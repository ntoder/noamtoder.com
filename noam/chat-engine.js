// NoamChat engine — peer-to-peer, end-to-end encrypted messaging between NoamBrowser users.
//   • Your identity is a pair of keys made on this computer (ECDSA for signing, ECDH for secrets).
//   • Friends swap invite codes. A friend request travels through the other person's "inbox" room,
//     which only someone holding their invite code can unlock.
//   • Each friendship has its own room whose password is a secret only the two of you can compute
//     (ECDH), and both sides prove who they are with signatures before they're let in.
//   • Public Nostr relays only help computers find each other; messages go directly between computers
//     over WebRTC (encrypted). Messages wait on your computer until your friend is online.
'use strict';
(() => {
  const APP = 'noamchat-v1';
  const te = new TextEncoder();
  const b64u = (buf) => { const a = new Uint8Array(buf); let s = ''; for (let i = 0; i < a.length; i++) s += String.fromCharCode(a[i]); return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''); };
  const unb64u = (s) => Uint8Array.from(atob(String(s).replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((String(s).length + 3) % 4)), (c) => c.charCodeAt(0));
  const hex = (buf) => [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
  const sha = async (s) => hex(await crypto.subtle.digest('SHA-256', typeof s === 'string' ? te.encode(s) : s));
  const rnd = (n) => b64u(crypto.getRandomValues(new Uint8Array(n)));
  const ECDSA = { name: 'ECDSA', namedCurve: 'P-256' }, ECDH = { name: 'ECDH', namedCurve: 'P-256' };
  const listeners = {};
  const emit = (ev, x) => (listeners[ev] || []).forEach((f) => { try { f(x); } catch (e) { console.error(e); } });

  let D = null, signKey = null, dhKey = null, myId = '';
  const rooms = new Map();       // roomId -> { room, kind, key, peers: Map(peerId -> {pub, id, prof}), actions }
  const typing = new Map();      // chatKey -> { name, until }
  const pubCache = new Map();
  const T = () => window.NoamTrystero;

  // ---------------------------------------------------------------- keys & identity
  const idOf = async (signPub) => (await sha(signPub)).slice(0, 12);
  const importVerify = async (pub) => { if (!pubCache.has(pub)) pubCache.set(pub, crypto.subtle.importKey('raw', unb64u(pub), ECDSA, false, ['verify'])); return pubCache.get(pub); };
  const sign = async (text) => b64u(await crypto.subtle.sign({ name: 'ECDSA', hash: 'SHA-256' }, signKey, te.encode(text)));
  const verify = async (pub, sig, text) => { try { return await crypto.subtle.verify({ name: 'ECDSA', hash: 'SHA-256' }, await importVerify(pub), unb64u(sig), te.encode(text)); } catch { return false; } };
  async function shared(dhPub) { const pk = await crypto.subtle.importKey('raw', unb64u(dhPub), ECDH, false, []); return b64u(await crypto.subtle.deriveBits({ name: 'ECDH', public: pk }, dhKey, 256)); }
  async function createIdentity(name, emoji) {
    const sk = await crypto.subtle.generateKey(ECDSA, true, ['sign', 'verify']);
    const dk = await crypto.subtle.generateKey(ECDH, true, ['deriveBits']);
    D.identity = {
      name: String(name || 'Me').slice(0, 40), emoji: emoji || '😀', created: Date.now(),
      signPub: b64u(await crypto.subtle.exportKey('raw', sk.publicKey)), dhPub: b64u(await crypto.subtle.exportKey('raw', dk.publicKey)), invite: rnd(16),
      priv: { sign: await crypto.subtle.exportKey('jwk', sk.privateKey), dh: await crypto.subtle.exportKey('jwk', dk.privateKey) },
    };
    await unlock(); save(); startRooms(); linkAccount(); emit('change');
  }
  async function unlock() {
    signKey = await crypto.subtle.importKey('jwk', D.identity.priv.sign, ECDSA, false, ['sign']);
    dhKey = await crypto.subtle.importKey('jwk', D.identity.priv.dh, ECDH, false, ['deriveBits']);
    myId = await idOf(D.identity.signPub);
  }
  const prof = () => ({ n: D.identity.name, e: D.identity.emoji });
  const inviteCode = () => 'NC1.' + b64u(te.encode(JSON.stringify({ n: D.identity.name, e: D.identity.emoji, s: D.identity.signPub, d: D.identity.dhPub, i: D.identity.invite })));
  function parseInvite(code) {
    const m = String(code || '').trim().match(/NC1\.([A-Za-z0-9_-]+)/); if (!m) return null;
    try { const o = JSON.parse(new TextDecoder().decode(unb64u(m[1]))); return o && o.s && o.d && o.i ? o : null; } catch { return null; }
  }
  const groupCode = (g) => 'NCG1.' + b64u(te.encode(JSON.stringify({ g: g.gid, n: g.name, e: g.emoji, k: g.secret })));
  function parseGroup(code) { const m = String(code || '').trim().match(/NCG1\.([A-Za-z0-9_-]+)/); if (!m) return null; try { const o = JSON.parse(new TextDecoder().decode(unb64u(m[1]))); return o && o.g && o.k ? o : null; } catch { return null; } }

  // ---------------------------------------------------------------- storage
  let saveT = null;
  function save() { clearTimeout(saveT); saveT = setTimeout(() => nb.invoke('chat:save', D).catch(() => {}), 400); }
  const chat = (key) => (D.chats[key] = D.chats[key] || { msgs: [], unread: 0 });
  function addMsg(key, m) {
    const c = chat(key); if (c.msgs.some((x) => x.id === m.id)) return false;
    c.msgs.push(m); c.msgs.sort((a, b) => a.t - b.t); if (c.msgs.length > 1500) c.msgs.splice(0, c.msgs.length - 1500);
    c.last = Math.max(c.last || 0, m.t); save(); return true;
  }

  // ---------------------------------------------------------------- rooms
  const relayCfg = () => { const st = typeof state !== 'undefined' ? state : null; const r = (st && st.settings && st.settings.chat && st.settings.chat.relays) || null; return r && r.length ? { urls: r } : { redundancy: 4 }; };
  const cfg = (password) => ({ appId: APP, password, relayConfig: { ...relayCfg(), warnOnRelayFailure: false }, rtcConfig: { iceServers: [{ urls: 'stun:stun.cloudflare.com:3478' }, { urls: 'stun:stun.l.google.com:19302' }] } });
  // both sides prove they own their key by signing the other's random challenge
  const handshake = (roomId, expect) => async (peerId, send, receive) => {
    const mine = rnd(16);
    await send({ hello: 1, pub: D.identity.signPub, nonce: mine, prof: prof() });
    const { data: h } = await receive();
    if (!h || typeof h.pub !== 'string' || typeof h.nonce !== 'string') throw new Error('bad hello');
    if (h.pub === D.identity.signPub) throw new Error('myself');
    if (!(await expect(h.pub, h))) throw new Error('not allowed');
    await send({ sig: await sign(h.nonce + '|' + roomId) });
    const { data: s } = await receive();
    if (!s || !(await verify(h.pub, s.sig, mine + '|' + roomId))) throw new Error('bad signature');
    const r = rooms.get(roomId); if (r) r.pending.set(peerId, { pub: h.pub, id: await idOf(h.pub), prof: h.prof || {} });
  };
  function open(roomId, password, kind, key, expect) {
    if (rooms.has(roomId)) return rooms.get(roomId);
    const r = { kind, key, peers: new Map(), pending: new Map(), roomId };
    try {
      r.room = T().joinRoom(cfg(password), roomId, { onPeerHandshake: handshake(roomId, expect), handshakeTimeoutMs: 15000, onJoinError: (d) => { const m = String((d && d.error) || ''); if (!/myself|overlapping room|not allowed/.test(m)) console.warn('noamchat join', kind, m); } });
    } catch (e) { console.error('noamchat join failed', e); return null; }
    r.a = {};
    for (const n of ['msg', 'ack', 'typing', 'req', 'reqok', 'have', 'give', 'prof']) {
      const a = r.room.makeAction(n);
      r.a[n] = { send: (data, peerId) => a.send(data, peerId ? { target: peerId } : undefined).catch(() => {}), get: (fn) => { a.onMessage = (data, info) => fn(data, info && info.peerId); } };
    }
    rooms.set(roomId, r);
    r.room.onPeerJoin = (peerId) => { const p = r.pending.get(peerId); if (!p) return; r.pending.delete(peerId); r.peers.set(peerId, p); onJoin(r, peerId, p); };
    r.room.onPeerLeave = (peerId) => { r.pending.delete(peerId); const p = r.peers.get(peerId); r.peers.delete(peerId); if (p) onLeave(r, p); };
    r.a.msg.get((m, peerId) => onMsg(r, m, peerId));
    r.a.ack.get((a, peerId) => onAck(r, a, peerId));
    r.a.typing.get((x, peerId) => { const p = r.peers.get(peerId); if (!p) return; typing.set(r.key, { name: p.prof.n || 'Someone', until: Date.now() + 5000 }); emit('typing', r.key); });
    r.a.req.get((x, peerId) => onRequest(r, x, peerId));
    r.a.reqok.get(() => { const f = D.friends[r.key]; if (f) { f.reqDelivered = true; save(); emit('change'); setTimeout(() => close(r.roomId), 1500); } });
    r.a.have.get((ids, peerId) => onHave(r, ids, peerId));
    r.a.give.get((list, peerId) => onGive(r, list, peerId));
    r.a.prof.get((p, peerId) => { const x = r.peers.get(peerId); if (x && p) { x.prof = p; updateProfile(r, x); emit('change'); } });
    return r;
  }
  function close(roomId) { const r = rooms.get(roomId); if (!r) return; try { r.room.leave(); } catch {} rooms.delete(roomId); }
  const dmRoomId = async (f) => 'dm-' + (await sha([D.identity.signPub, f.signPub].sort().join('|'))).slice(0, 32);
  async function openFriend(f) {
    if (f.status === 'blocked') return;
    const id = await dmRoomId(f); f.room = id;
    open(id, await shared(f.dhPub), 'dm', f.id, async (pub) => pub === f.signPub);
    if (f.status === 'pending' && !f.reqDelivered) {
      // knock on their inbox so they see the request
      const inbox = 'in-' + (await sha(f.signPub)).slice(0, 32);
      open(inbox, f.invite, 'out', f.id, async (pub) => pub === f.signPub);
    }
  }
  async function openGroup(g) { open('gr-' + g.gid, g.secret, 'group', g.gid, async () => true); }
  async function startRooms() {
    if (!T() || !D.identity) return;
    open('in-' + (await sha(D.identity.signPub)).slice(0, 32), D.identity.invite, 'in', 'inbox', async () => true);
    for (const f of Object.values(D.friends)) openFriend(f);
    for (const g of Object.values(D.groups)) openGroup(g);
  }
  function stopRooms() { for (const id of [...rooms.keys()]) close(id); }

  // ---------------------------------------------------------------- events from peers
  function onJoin(r, peerId, p) {
    if (r.kind === 'dm') {
      const f = D.friends[r.key]; if (!f) return;
      if (f.status === 'pending') { f.status = 'friend'; f.reqDelivered = true; for (const [id, x] of rooms) if (x.kind === 'out' && x.key === f.id) setTimeout(() => close(id), 1500); }
      updateProfile(r, p); f.online = true; f.lastSeen = Date.now(); save();
      // deliver anything that was waiting
      const waiting = chat('f:' + f.id).msgs.filter((m) => m.from === myId && (m.status === 'pending' || m.status === 'sent'));
      if (waiting.length) r.a.msg.send(waiting.map(strip), peerId);
      emit('change'); emit('presence', { key: 'f:' + f.id, online: true });
    } else if (r.kind === 'group') {
      const g = D.groups[r.key]; if (!g) return;
      g.members[p.id] = { n: p.prof.n || 'Someone', e: p.prof.e || '🙂', pub: p.pub, seen: Date.now() }; save();
      r.a.have.send(chat('g:' + g.gid).msgs.slice(-300).map((m) => m.id), peerId);
      emit('change');
    } else if (r.kind === 'out') {
      r.a.req.send({ code: inviteCode(), note: (D.friends[r.key] || {}).note || '' }, peerId);
    }
  }
  function onLeave(r, p) {
    if (r.kind === 'dm') { const f = D.friends[r.key]; if (f && r.peers.size === 0) { f.online = false; f.lastSeen = Date.now(); save(); emit('change'); emit('presence', { key: 'f:' + f.id, online: false }); } }
    if (r.kind === 'group') emit('change');
  }
  function updateProfile(r, p) {
    if (r.kind === 'dm') { const f = D.friends[r.key]; if (f && p.prof) { if (p.prof.n) f.name = String(p.prof.n).slice(0, 40); if (p.prof.e) f.emoji = String(p.prof.e).slice(0, 8); } }
    if (r.kind === 'group') { const g = D.groups[r.key]; if (g && g.members[p.id]) Object.assign(g.members[p.id], { n: p.prof.n, e: p.prof.e }); }
  }
  const strip = (m) => { const { status, mine, ...rest } = m; return rest; };
  const clean = (m) => ({ id: String(m.id || '').slice(0, 40), t: +m.t || Date.now(), text: typeof m.text === 'string' ? m.text.slice(0, 8000) : '', img: typeof m.img === 'string' && m.img.startsWith('data:image/') && m.img.length < 1.5e6 ? m.img : undefined, share: m.share && typeof m.share.url === 'string' && /^https?:/.test(m.share.url) ? { url: m.share.url.slice(0, 2000), title: String(m.share.title || '').slice(0, 300) } : undefined, ginv: m.ginv && m.ginv.g && m.ginv.k ? { g: String(m.ginv.g).slice(0, 40), n: String(m.ginv.n || 'Group').slice(0, 60), e: String(m.ginv.e || '👥').slice(0, 8), k: String(m.ginv.k).slice(0, 80) } : undefined, reply: typeof m.reply === 'string' ? m.reply.slice(0, 40) : undefined });
  const sigText = (m) => JSON.stringify([m.id, m.t, m.text || '', m.img ? m.img.length : 0, m.share ? m.share.url : '', m.ginv ? m.ginv.g : '']);
  async function onMsg(r, list, peerId) {
    const p = r.peers.get(peerId); if (!p) return;
    list = [].concat(list).slice(0, 500);
    if (r.kind === 'dm') {
      const f = D.friends[r.key]; if (!f) return;
      const got = [];
      for (const raw of list) { const m = { ...clean(raw), from: f.id }; if (!m.id) continue; got.push(m.id); if (addMsg('f:' + f.id, m)) incoming('f:' + f.id, m, f.name, f.emoji); }
      if (got.length) r.a.ack.send({ ids: got, st: 'delivered' }, peerId);
    } else if (r.kind === 'group') {
      const g = D.groups[r.key]; if (!g) return;
      for (const raw of list) { const m = { ...clean(raw), from: p.id, fromName: p.prof.n, fromEmoji: p.prof.e, sig: raw.sig, pub: p.pub }; if (!m.id || !(await verify(p.pub, raw.sig, sigText(m)))) continue; if (addMsg('g:' + g.gid, m)) incoming('g:' + g.gid, m, `${p.prof.n || 'Someone'} · ${g.name}`, g.emoji); }
    }
  }
  function onAck(r, a, peerId) {
    if (r.kind !== 'dm' || !a || !Array.isArray(a.ids)) return;
    const f = D.friends[r.key]; if (!f) return;
    const rank = { pending: 0, sent: 1, delivered: 2, read: 3 };
    for (const m of chat('f:' + f.id).msgs) if (m.from === myId && a.ids.includes(m.id) && rank[a.st] > (rank[m.status] || 0)) m.status = a.st;
    save(); emit('change');
  }
  async function onHave(r, ids, peerId) {
    const g = D.groups[r.key]; if (!g || !Array.isArray(ids)) return;
    const set = new Set(ids); const missing = chat('g:' + g.gid).msgs.filter((m) => !set.has(m.id) && m.sig).slice(-300);
    if (missing.length) r.a.give.send(missing.map((m) => ({ ...strip(m) })), peerId);
  }
  async function onGive(r, list, peerId) {
    const g = D.groups[r.key]; if (!g || !Array.isArray(list)) return;
    let n = 0;
    for (const raw of list.slice(0, 300)) {
      if (typeof raw.pub !== 'string' || !(await verify(raw.pub, raw.sig, sigText(clean(raw))))) continue;
      const m = { ...clean(raw), from: raw.pub === D.identity.signPub ? myId : await idOf(raw.pub), fromName: String(raw.fromName || '').slice(0, 40), fromEmoji: String(raw.fromEmoji || '').slice(0, 8), sig: raw.sig, pub: raw.pub };
      if (m.from === myId) m.status = 'sent';
      if (addMsg('g:' + g.gid, m)) n++;
    }
    if (n) emit('change');
  }
  async function onRequest(r, x, peerId) {
    if (r.kind !== 'in') return;
    const p = r.peers.get(peerId); const inv = parseInvite(x && x.code); if (!p || !inv || inv.s !== p.pub) return;
    const id = await idOf(inv.s);
    r.a.reqok.send({ ok: 1 }, peerId);
    const f = D.friends[id];
    if (f && f.status === 'blocked') return;
    if (f && (f.status === 'pending' || f.status === 'friend')) { if (f.status === 'pending') { f.status = 'friend'; save(); emit('change'); } return; } // we both added each other
    if (!D.requests.some((q) => q.id === id)) { D.requests.push({ id, inv, note: String((x && x.note) || '').slice(0, 200), t: Date.now() }); save(); }
    emit('change'); emit('request', { name: inv.n, emoji: inv.e });
  }
  const openChats = new Set();
  function incoming(key, m, title, emoji) {
    const viewing = openChats.has(key);
    if (!viewing) chat(key).unread = (chat(key).unread || 0) + 1;
    else if (key.startsWith('f:')) markRead(key);
    save(); emit('change'); emit('message', { key, m, title, emoji, viewing });
  }

  // ---------------------------------------------------------------- what the UI calls
  async function sendTo(key, body) {
    const m = { id: rnd(10), t: Date.now(), from: myId, ...body, status: 'pending' };
    if (key.startsWith('f:')) {
      const f = D.friends[key.slice(2)]; if (!f) return;
      addMsg(key, m);
      const r = rooms.get(f.room);
      if (r && r.peers.size) { r.a.msg.send([strip(m)]); m.status = 'sent'; }
      else if (f.status === 'friend') mailTo(f, { msgs: [strip(m)] }).then((ok) => { if (ok && m.status === 'pending') { m.status = 'sent'; m.via = 'mail'; save(); emit('change'); } });
    } else {
      const g = D.groups[key.slice(2)]; if (!g) return;
      m.sig = await sign(sigText(m)); m.pub = D.identity.signPub; m.fromName = D.identity.name; m.fromEmoji = D.identity.emoji; m.status = 'sent';
      addMsg(key, m);
      const r = rooms.get('gr-' + g.gid); if (r && r.peers.size) r.a.msg.send([strip(m)]);
    }
    save(); emit('change');
    return m;
  }
  function markRead(key) {
    const c = chat(key); c.unread = 0;
    if (key.startsWith('f:')) {
      const f = D.friends[key.slice(2)]; const r = f && rooms.get(f.room);
      const ids = c.msgs.filter((m) => m.from !== myId && !m.readSent).map((m) => { m.readSent = true; return m.id; });
      if (ids.length && r && r.peers.size) r.a.ack.send({ ids, st: 'read' });
      else if (ids.length) c.msgs.forEach((m) => { if (ids.includes(m.id)) m.readSent = false; });
    }
    save(); emit('change');
  }
  async function addFriend(code, note) {
    const inv = parseInvite(code); if (!inv) throw new Error('That isn’t a NoamChat invite code. It starts with NC1.');
    if (inv.s === D.identity.signPub) throw new Error('That’s your own invite code! Send it to a friend instead.');
    const id = await idOf(inv.s);
    const ex = D.friends[id];
    if (ex && ex.status === 'friend') return ex;
    const f = D.friends[id] = { id, name: String(inv.n || 'Friend').slice(0, 40), emoji: String(inv.e || '🙂').slice(0, 8), signPub: inv.s, dhPub: inv.d, invite: inv.i, status: ex && ex.status === 'blocked' ? 'pending' : 'pending', added: Date.now(), note: note || '' };
    // if they already asked us, it's mutual
    const q = D.requests.findIndex((x) => x.id === id); if (q >= 0) { D.requests.splice(q, 1); f.status = 'friend'; f.reqDelivered = true; }
    save(); await openFriend(f); emit('change'); return f;
  }
  // add a friend by their NoamBrowser account username (both of you need to be signed in)
  async function addByUsername(name, note) {
    const who = String(name || '').trim().replace(/^@/, '').toLowerCase();
    if (!who) throw new Error('Type your friend’s username.');
    const r = await nb.invoke('account:find', who);
    if (!r || r.error || !r.invite) throw new Error((r && r.error) || 'Couldn’t look up that username. Check your internet connection.');
    const f = await addFriend(r.invite, note);
    f.username = r.user; save();
    if (f.status === 'pending') { const ok = await mailRequest(f, note); if (ok) { f.reqMailed = true; save(); } }
    emit('change'); return f;
  }
  let acct = { user: null, findable: true };
  async function publish() { if (!D || !D.identity || !myId) return; try { acct = (await nb.invoke('account:chat-profile', inviteCode())) || acct; } catch {} emit('change'); }
  async function setFindable(on) { try { const st = await nb.invoke('account:findable', !!on); acct = { user: st.user, findable: st.findable }; } catch {} emit('change'); }
  async function acceptRequest(id) {
    const q = D.requests.find((x) => x.id === id); if (!q) return;
    D.requests = D.requests.filter((x) => x.id !== id);
    const f = D.friends[id] = { id, name: String(q.inv.n || 'Friend').slice(0, 40), emoji: String(q.inv.e || '🙂').slice(0, 8), signPub: q.inv.s, dhPub: q.inv.d, invite: q.inv.i, status: 'friend', reqDelivered: true, added: Date.now() };
    save(); await openFriend(f); mailTo(f, { ok: 1 }); emit('change'); return f;
  }
  function declineRequest(id, block) { const q = D.requests.find((x) => x.id === id); D.requests = D.requests.filter((x) => x.id !== id); if (block && q) D.friends[id] = { id, name: q.inv.n, emoji: q.inv.e, signPub: q.inv.s, dhPub: q.inv.d, invite: q.inv.i, status: 'blocked' }; save(); emit('change'); }
  async function removeFriend(id, block) { const f = D.friends[id]; if (!f) return; if (f.room) close(f.room); if (block) { f.status = 'blocked'; f.blockedAt = Date.now(); } else { delete D.friends[id]; delete D.chats['f:' + id]; } save(); emit('change'); }
  async function createGroup(name, emoji) {
    const g = { gid: rnd(12), secret: rnd(24), name: String(name || 'Group').slice(0, 60), emoji: emoji || '👥', created: Date.now(), members: {} };
    g.members[myId] = { n: D.identity.name, e: D.identity.emoji, pub: D.identity.signPub };
    D.groups[g.gid] = g; save(); await openGroup(g); emit('change'); return g;
  }
  async function joinGroup(codeOrInv) {
    const o = typeof codeOrInv === 'string' ? parseGroup(codeOrInv) : codeOrInv; if (!o) throw new Error('That isn’t a NoamChat group code. It starts with NCG1.');
    if (D.groups[o.g]) return D.groups[o.g];
    const g = { gid: o.g, secret: o.k, name: String(o.n || 'Group').slice(0, 60), emoji: String(o.e || '👥').slice(0, 8), created: Date.now(), members: { [myId]: { n: D.identity.name, e: D.identity.emoji, pub: D.identity.signPub } } };
    D.groups[g.gid] = g; save(); await openGroup(g); emit('change'); return g;
  }
  function leaveGroup(gid) { close('gr-' + gid); delete D.groups[gid]; delete D.chats['g:' + gid]; save(); emit('change'); }
  function setProfile(name, emoji) {
    if (name) D.identity.name = String(name).slice(0, 40); if (emoji) D.identity.emoji = emoji; D.identity.profileAt = Date.now(); save();
    for (const r of rooms.values()) if (r.peers.size) r.a.prof.send(prof());
    publish(); emit('change');
  }
  function sendTyping(key) {
    const r = key.startsWith('f:') ? rooms.get((D.friends[key.slice(2)] || {}).room) : rooms.get('gr-' + key.slice(2));
    if (r && r.peers.size) r.a.typing.send({ on: 1 });
  }
  function online(key) {
    if (key.startsWith('f:')) { const f = D.friends[key.slice(2)]; const r = f && rooms.get(f.room); return !!(r && r.peers.size); }
    const r = rooms.get('gr-' + key.slice(2)); return r ? r.peers.size : 0;
  }
  function deleteMsg(key, id) { const c = chat(key); c.msgs = c.msgs.filter((m) => m.id !== id); save(); emit('change'); }
  function clearChat(key) { chat(key).msgs = []; chat(key).unread = 0; save(); emit('change'); }

  // ---------------------------------------------------------------- mailbox (through your NoamBrowser account)
  // When a friend is offline, messages are left on the account server, locked with a key only the two of
  // you share (from ECDH), and collected when they next open NoamBrowser.
  const mailKeys = new Map();
  async function mailKey(f) {
    if (!mailKeys.has(f.id)) mailKeys.set(f.id, (async () => crypto.subtle.importKey('raw', await crypto.subtle.digest('SHA-256', unb64u(await shared(f.dhPub))), 'AES-GCM', false, ['encrypt', 'decrypt']))());
    return mailKeys.get(f.id);
  }
  let accountOn = false;
  async function mailTo(f, payload, extra) {
    if (!accountOn) return false;
    try {
      const iv = crypto.getRandomValues(new Uint8Array(12));
      const c = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, await mailKey(f), te.encode(JSON.stringify(payload)));
      const r = await nb.invoke('account:mail-send', { to: f.id, box: JSON.stringify({ v: 1, f: myId, iv: b64u(iv), c: b64u(c), ...(extra || {}) }) });
      return !!(r && r.ok);
    } catch { return false; }
  }
  // a friend request left in someone's mailbox: carries our public keys, signed, so they can check it's really us
  const reqText = (to, dhPub) => 'noamchat-req:' + to + ':' + dhPub;
  async function mailRequest(f, note) { return mailTo(f, { req: 1, note: note || '' }, { r: inviteCode(), sg: await sign(reqText(f.id, D.identity.dhPub)) }); }
  async function checkMail() {
    if (!accountOn || !D || !D.identity) return;
    let list = []; try { list = await nb.invoke('account:mail-fetch'); } catch { return; }
    for (const item of list || []) {
      try {
        const o = JSON.parse(item.box); let f = D.friends[o.f], inv = null;
        if (f && f.status === 'blocked') continue;
        if (!f) {
          // someone new: only a signed friend request is accepted
          inv = parseInvite(o.r);
          if (!inv || (await idOf(inv.s)) !== o.f || !(await verify(inv.s, o.sg, reqText(myId, inv.d)))) continue;
          f = { id: o.f, dhPub: inv.d };
        }
        const p = JSON.parse(new TextDecoder().decode(await crypto.subtle.decrypt({ name: 'AES-GCM', iv: unb64u(o.iv) }, await mailKey(f), unb64u(o.c))));
        if (inv) {
          if (p.req && !D.requests.some((q) => q.id === o.f)) { D.requests.push({ id: o.f, inv, note: String(p.note || '').slice(0, 200), t: Date.now() }); save(); emit('change'); emit('request', { name: inv.n, emoji: inv.e }); }
          continue;
        }
        // they wrote back, so they accepted our request
        if (f.status === 'pending') { f.status = 'friend'; f.reqDelivered = true; save(); emit('change'); }
        if (p.req) mailTo(f, { ok: 1 }); // we'd both added each other
        if (Array.isArray(p.msgs)) {
          const got = [];
          for (const raw of p.msgs.slice(0, 200)) { const m = { ...clean(raw), from: f.id }; if (!m.id) continue; got.push(m.id); if (addMsg('f:' + f.id, m)) incoming('f:' + f.id, m, f.name, f.emoji); }
          if (got.length) { const r = rooms.get(f.room); if (r && r.peers.size) r.a.ack.send({ ids: got, st: 'delivered' }); else mailTo(f, { ack: { ids: got, st: 'delivered' } }); }
        }
        if (p.ack && Array.isArray(p.ack.ids)) { const rank = { pending: 0, sent: 1, delivered: 2, read: 3 }; for (const m of chat('f:' + f.id).msgs) if (m.from === myId && p.ack.ids.includes(m.id) && rank[p.ack.st] > (rank[m.status] || 0)) m.status = p.ack.st; save(); emit('change'); }
      } catch (e) { console.warn('noamchat mail', e && e.message); }
    }
  }
  async function linkAccount() { try { accountOn = !!(await nb.invoke('account:chat-id', myId)); } catch { accountOn = false; } publish(); if (accountOn) checkMail(); }
  setInterval(() => { if (accountOn) checkMail(); }, 30000);
  nb.on('account:status', (st) => { const was = accountOn; accountOn = !!(st && st.user); const changed = !!st && (acct.user !== st.user || acct.findable !== st.findable); if (st) acct = { user: st.user, findable: st.findable !== false }; if (accountOn && !was && myId) linkAccount(); else if (changed) emit('change'); });
  nb.on('chat:reload', () => init());

  async function init() {
    stopRooms(); myId = ''; signKey = dhKey = null;
    try { D = await nb.invoke('chat:load'); } catch { D = {}; }
    D = { friends: {}, groups: {}, chats: {}, requests: [], ...D };
    if (D.identity && D.identity.priv) { try { await unlock(); } catch (e) { console.error('noamchat keys', e); D.identity = null; } }
    if (D.identity) { startRooms(); linkAccount(); }
    emit('change');
  }
  window.NoamChat = {
    init, on: (ev, f) => (listeners[ev] = listeners[ev] || []).push(f),
    get data() { return D; }, get myId() { return myId; }, ready: () => !!(D && D.identity),
    createIdentity, setProfile, inviteCode, parseInvite, addFriend, addByUsername, setFindable, account: () => ({ ...acct, signedIn: accountOn }), acceptRequest, declineRequest, removeFriend,
    createGroup, joinGroup, leaveGroup, groupCode, parseGroup, sendTo, markRead, sendTyping, online, deleteMsg, clearChat,
    typing: (key) => { const x = typing.get(key); return x && x.until > Date.now() ? x.name : null; },
    viewing: (key, on) => { if (on) openChats.add(key); else openChats.delete(key); },
    restart: async () => { stopRooms(); await startRooms(); emit('change'); },
    goOffline: () => { stopRooms(); for (const f of Object.values(D.friends)) f.online = false; emit('change'); },
    status: () => ({ rooms: rooms.size, peers: [...rooms.values()].reduce((a, r) => a + r.peers.size, 0), relays: (() => { try { return Object.entries(T().getRelaySockets()).map(([u, s]) => [u, s.readyState]); } catch { return []; } })() }),
  };
})();
