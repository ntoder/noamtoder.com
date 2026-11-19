// noam-core.js — your NoamBrowser account on noamtoder.com.
// Same account and the same zero-knowledge encryption as the NoamBrowser app: your password is turned into
// two keys in this browser (a "login key" sent to the server and a "lock key" that never leaves), and
// everything is compressed and locked before upload. This page counts as one more "computer" on your
// account ("Web"), so your chats, bookmarks and to-dos sync with NoamBrowser on all your computers.
// Passwords and history are never brought to the web.
'use strict';
(() => {
  // (a different server can only be used when testing on this computer, so no link can send your login elsewhere)
  const SERVER = (() => { try { const q = new URLSearchParams(location.search).get('server'); if (q && /^(localhost|127\.0\.0\.1)$/.test(location.hostname) && /^http:\/\/127\.0\.0\.1:\d+$/.test(q)) return q; } catch {} return 'https://noambrowser-accounts.noam-2d9.workers.dev'; })();
  const ITER = 600000;
  const te = new TextEncoder(), td = new TextDecoder();
  const b64 = (u8) => { let s = ''; for (let i = 0; i < u8.length; i += 0x8000) s += String.fromCharCode.apply(null, u8.subarray(i, i + 0x8000)); return btoa(s); };
  const unb64 = (s) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));
  const cat = (...a) => { const o = new Uint8Array(a.reduce((n, x) => n + x.length, 0)); let i = 0; for (const x of a) { o.set(x, i); i += x.length; } return o; };
  const pipe = async (u8, stream) => new Uint8Array(await new Response(new Blob([u8]).stream().pipeThrough(stream)).arrayBuffer());
  const clone = (o) => (o == null ? o : JSON.parse(JSON.stringify(o)));

  // ---------------------------------------------------------------- keys and locking (matches src/account.js)
  async function derive(user, password) {
    const k = await crypto.subtle.importKey('raw', te.encode(password), 'PBKDF2', false, ['deriveBits']);
    const bits = new Uint8Array(await crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt: te.encode('noambrowser-account-v1:' + user), iterations: ITER }, k, 512));
    return { auth: b64(bits.subarray(0, 32)), encKey: await crypto.subtle.importKey('raw', bits.subarray(32), 'AES-GCM', false, ['encrypt', 'decrypt']) };
  }
  async function lock(obj, key) {
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const out = new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, await pipe(te.encode(JSON.stringify(obj)), new CompressionStream('gzip'))));
    return 'NBA1.' + b64(cat(iv, out.subarray(out.length - 16), out.subarray(0, out.length - 16)));
  }
  async function unlock(str, key) {
    if (typeof str !== 'string' || !str.startsWith('NBA1.')) throw new Error('not a NoamBrowser vault');
    const b = unb64(str.slice(5));
    const pt = new Uint8Array(await crypto.subtle.decrypt({ name: 'AES-GCM', iv: b.subarray(0, 12) }, key, cat(b.subarray(28), b.subarray(12, 28))));
    return JSON.parse(td.decode(await pipe(pt, new DecompressionStream('gzip'))));
  }

  // ---------------------------------------------------------------- storage (IndexedDB, falls back to memory)
  const mem = new Map();
  const idb = (() => { try { return new Promise((res) => { const r = indexedDB.open('noam', 1); r.onupgradeneeded = () => r.result.createObjectStore('kv'); r.onsuccess = () => res(r.result); r.onerror = () => res(null); }); } catch { return Promise.resolve(null); } })();
  async function kget(k) { const db = await idb; if (!db) return mem.get(k); return new Promise((res) => { try { const q = db.transaction('kv').objectStore('kv').get(k); q.onsuccess = () => res(q.result); q.onerror = () => res(mem.get(k)); } catch { res(mem.get(k)); } }); }
  async function kset(k, v) { mem.set(k, v); const db = await idb; if (!db) return; return new Promise((res) => { try { const t = db.transaction('kv', 'readwrite'); if (v === undefined) t.objectStore('kv').delete(k); else t.objectStore('kv').put(v, k); t.oncomplete = res; t.onerror = res; } catch { res(); } }); }

  // ---------------------------------------------------------------- events
  const ls = {}; const on = (ev, f) => (ls[ev] = ls[ev] || []).push(f); const emit = (ev, x) => (ls[ev] || []).forEach((f) => { try { f(x); } catch (e) { console.error(e); } });

  // ---------------------------------------------------------------- state
  let S = null;        // { deviceId, bookmarks, bookmarkTombstones, extras, chat, devices, last, findable }
  let secret = null;   // { user, auth, encKey }
  let status = { state: 'signedout', error: '' };
  const blankExtras = () => ({ readingList: [], sessions: [], notes: {}, todos: [], tombstones: [] });
  const ready = (async () => {
    S = (await kget('state')) || {};
    S = { deviceId: 'd-web-' + Array.from(crypto.getRandomValues(new Uint8Array(6)), (x) => x.toString(16).padStart(2, '0')).join(''), bookmarks: [], bookmarkTombstones: [], extras: blankExtras(), chat: {}, devices: [], last: 0, findable: true, ...S };
    S.extras = { ...blankExtras(), ...(S.extras || {}) };
    secret = (await kget('secret')) || null;
    if (secret) status.state = 'idle';
    await kset('state', S);
  })();
  let saveT = null; const persist = () => { clearTimeout(saveT); saveT = setTimeout(() => kset('state', S), 300); };
  const browserName = () => { const u = navigator.userAgent; const b = /Edg\//.test(u) ? 'Edge' : /OPR\//.test(u) ? 'Opera' : /Chrome\//.test(u) ? 'Chrome' : /Firefox\//.test(u) ? 'Firefox' : /Safari\//.test(u) ? 'Safari' : 'Browser'; const os = /Android/.test(u) ? 'Android' : /iPhone|iPad/.test(u) ? 'iPhone' : /Mac/.test(u) ? 'Mac' : /Windows/.test(u) ? 'Windows' : /Linux/.test(u) ? 'Linux' : ''; return `Web · ${b}${os ? ' on ' + os : ''}`; };
  const pub = () => ({ ...status, user: secret ? secret.user : null, last: S ? S.last : 0, devices: S ? (S.devices || []).map((d) => ({ ...d, me: d.device === S.deviceId })) : [], deviceId: S && S.deviceId, deviceName: browserName(), findable: S ? S.findable !== false : true, chat: true, passwords: false, history: false });
  const set = (p) => { Object.assign(status, p); emit('account:status', pub()); };

  async function api(method, p, body, auth = true) {
    const headers = { 'content-type': 'application/json' };
    if (auth) { if (!secret) throw new Error('Not signed in.'); headers.authorization = 'Basic ' + btoa(secret.user + ':' + secret.auth); }
    let r;
    try { r = await fetch(SERVER + p, { method, headers, body: body ? JSON.stringify(body) : undefined }); }
    catch { throw new Error('Can’t reach the account server. Check your internet connection.'); }
    let j = {}; try { j = await r.json(); } catch {}
    if (!r.ok) { const e = new Error(j.error || `Server error (${r.status})`); e.status = r.status; throw e; }
    return j;
  }

  // ---------------------------------------------------------------- merging other computers' data (matches the app)
  function mergeBookmarks(remote) {
    let changed = false;
    const tomb = new Map((S.bookmarkTombstones || []).map((t) => [t.url, t.t]));
    for (const t of remote.bookmarkTombstones || []) if ((tomb.get(t.url) || 0) < t.t) { tomb.set(t.url, t.t); changed = true; }
    const byUrl = new Map(S.bookmarks.map((b) => [b.url, b]));
    for (const rb of remote.bookmarks || []) {
      const lb = byUrl.get(rb.url);
      if (!lb) { byUrl.set(rb.url, { ...rb }); changed = true; }
      else if ((rb.updated || rb.added || 0) > (lb.updated || lb.added || 0)) { Object.assign(lb, { title: rb.title, folder: rb.folder, updated: rb.updated }); changed = true; }
    }
    const merged = [...byUrl.values()].filter((b) => !(tomb.get(b.url) > (b.updated || b.added || 0)));
    if (merged.length !== S.bookmarks.length) changed = true;
    if (changed) { S.bookmarks = merged; S.bookmarkTombstones = [...tomb].map(([url, t]) => ({ url, t })).slice(-2000); }
    return changed;
  }
  function mergeExtras(remote) {
    if (!remote) return false;
    const X = S.extras; let any = false;
    const dead = new Map(X.tombstones.map((t) => [t.kind + ':' + t.id, t.t]));
    for (const t of remote.tombstones || []) { const k = t.kind + ':' + t.id; if ((dead.get(k) || 0) < t.t) { dead.set(k, t.t); any = true; } }
    const mergeList = (key, kind) => {
      const mine = new Map((X[key] || []).map((x) => [x.id, x]));
      for (const r of remote[key] || []) { const l = mine.get(r.id); if (!l || (r.updated || 0) > (l.updated || 0)) { mine.set(r.id, { ...r }); any = true; } }
      const list = [...mine.values()].filter((x) => !((dead.get(kind + ':' + x.id) || 0) >= (x.updated || x.added || x.created || 0)));
      if (list.length !== (X[key] || []).length) any = true;
      X[key] = list;
    };
    mergeList('readingList', 'reading'); mergeList('sessions', 'session'); mergeList('todos', 'todo');
    const notes = { ...X.notes };
    for (const [k, n] of Object.entries(remote.notes || {})) if (!notes[k] || (n.updated || 0) > (notes[k].updated || 0)) { notes[k] = n; any = true; }
    for (const k of Object.keys(notes)) if ((dead.get('note:' + k) || 0) >= (notes[k].updated || 0)) { delete notes[k]; any = true; }
    X.notes = notes;
    X.tombstones = [...dead].map(([k, t]) => { const i = k.indexOf(':'); return { kind: k.slice(0, i), id: k.slice(i + 1), t }; }).slice(-3000);
    return any;
  }
  const RANK = { pending: 0, sent: 1, delivered: 2, read: 3 };
  function chatSnapshot() {
    const D = S.chat || {}; if (!D.identity || !D.identity.priv) return null;
    const friends = {}; for (const [id, f] of Object.entries(D.friends || {})) { const { online, room, ...rest } = f; friends[id] = rest; }
    const chats = {}; for (const [k, c] of Object.entries(D.chats || {})) chats[k] = { msgs: (c.msgs || []).slice(-300).map((m) => (m.img ? { ...m, img: undefined, imgOmitted: true } : m)) };
    return { identity: D.identity, friends, groups: D.groups || {}, requests: D.requests || [], chats };
  }
  function mergeChat(r) {
    const D = S.chat = S.chat || {}; if (!r || !r.identity || !r.identity.priv) return false;
    let changed = false;
    if (!D.identity) { Object.assign(D, { identity: r.identity, friends: {}, groups: {}, chats: {}, requests: [] }); changed = true; }
    else if (D.identity.signPub !== r.identity.signPub) {
      if ((r.identity.created || 0) >= (D.identity.created || 0)) return false;
      D.oldIdentity = { identity: D.identity, friends: D.friends, groups: D.groups, at: Date.now() };
      Object.assign(D, { identity: r.identity, friends: {}, groups: {}, chats: {}, requests: [] }); changed = true;
    }
    if ((r.identity.profileAt || 0) > (D.identity.profileAt || 0)) { D.identity.name = r.identity.name; D.identity.emoji = r.identity.emoji; D.identity.profileAt = r.identity.profileAt; changed = true; }
    D.friends = D.friends || {}; D.groups = D.groups || {}; D.chats = D.chats || {}; D.requests = D.requests || [];
    for (const [id, f] of Object.entries(r.friends || {})) {
      const l = D.friends[id];
      if (!l) { D.friends[id] = { ...f }; changed = true; }
      else if (l.status === 'pending' && f.status === 'friend') { l.status = 'friend'; l.reqDelivered = true; changed = true; }
      else if (f.status === 'blocked' && l.status !== 'blocked' && (f.blockedAt || 0) > (l.added || 0)) { l.status = 'blocked'; changed = true; }
    }
    for (const [gid, g] of Object.entries(r.groups || {})) { const l = D.groups[gid]; if (!l) { D.groups[gid] = g; changed = true; } else for (const [mid, m] of Object.entries(g.members || {})) if (!l.members[mid]) { l.members[mid] = m; changed = true; } }
    for (const [k, rc] of Object.entries(r.chats || {})) {
      const c = D.chats[k] = D.chats[k] || { msgs: [], unread: 0 }; const byId = new Map(c.msgs.map((m) => [m.id, m])); let n = 0;
      for (const m of rc.msgs || []) { const x = byId.get(m.id); if (!x) { c.msgs.push(m); n++; } else if ((RANK[m.status] || 0) > (RANK[x.status] || 0)) { x.status = m.status; n++; } }
      if (n) { c.msgs.sort((a, b) => a.t - b.t); if (c.msgs.length > 1500) c.msgs.splice(0, c.msgs.length - 1500); changed = true; }
    }
    for (const q of r.requests || []) if (!D.requests.some((x) => x.id === q.id) && !D.friends[q.id]) { D.requests.push(q); changed = true; }
    if (changed) D.rev = (D.rev || 0) + 1;
    return changed;
  }
  const snapshot = () => ({
    device: { id: S.deviceId, name: browserName(), platform: 'web' }, written: Date.now(),
    settingsUpdated: 0, settings: {}, // the web never changes your browser settings
    bookmarks: S.bookmarks, bookmarkTombstones: S.bookmarkTombstones, extras: S.extras, chat: chatSnapshot() || undefined,
  });

  // ---------------------------------------------------------------- syncing
  let busy = false, again = false;
  async function sync() {
    await ready;
    if (!secret) return pub();
    if (busy) { again = true; return pub(); }
    busy = true; set({ state: 'syncing', error: '' });
    try {
      const { vaults } = await api('GET', '/v1/vaults');
      const got = { bookmarks: false, extras: false, chat: false }; const devices = [];
      for (const v of vaults) {
        devices.push({ device: v.device, name: v.name, updated: v.updated });
        if (v.device === S.deviceId) continue;
        try {
          const r = await unlock(v.blob, secret.encKey);
          if (mergeBookmarks(r)) got.bookmarks = true;
          if (mergeExtras(r.extras)) got.extras = true;
          if (r.chat && mergeChat(r.chat)) got.chat = true;
        } catch (e) { console.warn('noam sync', v.device, e.message); }
      }
      const out = await api('PUT', '/v1/vaults/' + S.deviceId, { name: browserName(), blob: await lock(snapshot(), secret.encKey) });
      S.devices = out.devices; S.last = Date.now(); persist();
      if (got.chat) emit('chat:reload', {});
      if (got.bookmarks || got.extras) emit('data', got);
      set({ state: 'idle', error: '' });
    } catch (e) {
      if (e.status === 401) { await forget(); set({ state: 'signedout', error: 'Your password was changed on another computer. Sign in again.' }); }
      else set({ state: 'error', error: e.message });
    } finally { busy = false; if (again) { again = false; setTimeout(sync, 1500); } }
    return pub();
  }
  let touchT = null; const touch = () => { if (!secret) return; clearTimeout(touchT); touchT = setTimeout(() => sync().catch(() => {}), 5000); };
  setInterval(() => { if (secret && document.visibilityState === 'visible') sync().catch(() => {}); }, 60000);
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible' && secret && Date.now() - (S.last || 0) > 30000) sync().catch(() => {}); });

  // ---------------------------------------------------------------- signing in and out
  const userOk = (u) => /^[a-z0-9][a-z0-9_.-]{2,31}$/.test(u);
  async function keep(user, k, remember) { secret = { user, auth: k.auth, encKey: k.encKey }; if (remember !== false) await kset('secret', secret); else await kset('secret', undefined); }
  async function forget() { secret = null; await kset('secret', undefined); }
  async function signUp({ user, password, remember, ownerKey }) {
    await ready; user = String(user || '').trim().toLowerCase();
    if (!userOk(user)) throw new Error('Usernames are 3–32 letters, numbers, dots, dashes or underscores, starting with a letter or number.');
    if (String(password || '').length < 8) throw new Error('Use a password of at least 8 characters.');
    set({ state: 'working' });
    try { const k = await derive(user, password); await api('POST', '/v1/register', { user, auth: k.auth, ...(ownerKey ? { ownerKey } : {}) }, false); await keep(user, k, remember); }
    catch (e) { set({ state: 'signedout' }); throw e; }
    await sync(); afterSignIn(); return pub();
  }
  async function signIn({ user, password, remember }) {
    await ready; user = String(user || '').trim().toLowerCase();
    set({ state: 'working' });
    try { const k = await derive(user, password); await api('POST', '/v1/login', { user, auth: k.auth }, false); await keep(user, k, remember); }
    catch (e) { set({ state: 'signedout' }); throw e; }
    await sync(); afterSignIn(); return pub();
  }
  async function signOut({ forgetDevice } = {}) {
    if (forgetDevice && secret) await api('DELETE', '/v1/vaults/' + S.deviceId).catch(() => {});
    await forget();
    // nothing of yours stays on this browser after signing out
    S = { deviceId: S.deviceId, bookmarks: [], bookmarkTombstones: [], extras: blankExtras(), chat: {}, devices: [], last: 0, findable: true };
    await kset('state', S); published = ''; set({ state: 'signedout', error: '' }); emit('chat:reload', {}); emit('data', { bookmarks: true, extras: true }); return pub();
  }
  async function changePassword({ current, password }) {
    if (!secret) throw new Error('Not signed in.');
    if (String(password || '').length < 8) throw new Error('Use a password of at least 8 characters.');
    const old = await derive(secret.user, current); if (old.auth !== secret.auth) throw new Error('Your current password isn’t right.');
    const k = await derive(secret.user, password);
    const { vaults } = await api('GET', '/v1/vaults');
    const re = []; for (const v of vaults) { try { re.push({ device: v.device, name: v.name, blob: await lock(await unlock(v.blob, secret.encKey), k.encKey) }); } catch {} }
    await api('POST', '/v1/password', { auth: k.auth, vaults: re });
    await keep(secret.user, k, !!(await kget('secret'))); await sync(); return pub();
  }
  async function deleteAccount({ password }) {
    if (!secret) throw new Error('Not signed in.');
    const k = await derive(secret.user, password); if (k.auth !== secret.auth) throw new Error('That password isn’t right.');
    await api('DELETE', '/v1/account'); return signOut({});
  }
  async function removeDevice(id) { const r = await api('DELETE', '/v1/vaults/' + id); S.devices = r.devices; persist(); set({}); return pub(); }

  // ---------------------------------------------------------------- NoamChat: mailbox and usernames
  let chatIds = [], chatInvite = '', published = '';
  async function registerChat() { if (!secret || !chatIds.length) return; try { await api('PUT', '/v1/chatids', { ids: chatIds }); } catch (e) { console.warn('chat ids', e.message); } }
  async function publishProfile() {
    if (!secret || !chatInvite) return;
    const want = S.findable !== false ? secret.user + '|' + chatInvite : secret.user + '|hidden';
    if (want === published) return;
    try { if (S.findable !== false) await api('PUT', '/v1/profile', { invite: chatInvite }); else await api('DELETE', '/v1/profile'); published = want; } catch (e) { console.warn('chat profile', e.message); }
  }
  function afterSignIn() { published = ''; registerChat(); publishProfile(); }

  // ---------------------------------------------------------------- `nb`: what the NoamChat engine and UI talk to
  // (in the app this goes to the main process; here it's all in this page)
  const H = {
    'chat:load': async () => { await ready; return clone(S.chat || {}); },
    'chat:save': async (d) => { if (!d || typeof d !== 'object') return false; if (S.chat && (d.rev || 0) < (S.chat.rev || 0)) return false; S.chat = clone(d); persist(); touch(); return true; },
    'chat:wipe': async () => { S.chat = {}; persist(); return true; },
    'chat:qr': async (text) => { try { const q = window.qrcode(0, 'L'); q.addData(String(text).slice(0, 2000)); q.make(); return 'data:image/svg+xml;base64,' + btoa(q.createSvgTag({ cellSize: 4, margin: 2, scalable: true })); } catch { return null; } },
    'chat:notify': async ({ title, body, chat }) => {
      try {
        if (!('Notification' in window) || Notification.permission !== 'granted' || (document.visibilityState === 'visible' && document.hasFocus())) return false;
        const n = new Notification(String(title).slice(0, 80), { body: String(body).slice(0, 180), icon: '/favicon.png' });
        n.onclick = () => { window.focus(); emit('chat:open', chat); n.close(); }; return true;
      } catch { return false; }
    },
    'chat:focused': async () => document.hasFocus(),
    'account:chat-id': async (id) => { await ready; if (/^[a-f0-9]{12}$/.test(id || '') && !chatIds.includes(id)) { chatIds = [id]; registerChat(); } return !!secret; },
    'account:chat-profile': async (invite) => { await ready; if (typeof invite === 'string' && /^NC1\.[A-Za-z0-9_-]{40,1500}$/.test(invite)) { chatInvite = invite; publishProfile(); } return { user: secret ? secret.user : null, findable: S.findable !== false }; },
    'account:findable': async (v) => { S.findable = !!v; persist(); published = ''; publishProfile(); set({}); return pub(); },
    'account:find': async (who) => {
      if (!secret) return { error: 'Sign in to your NoamBrowser account first.' };
      who = String(who || '').trim().replace(/^@/, '').toLowerCase();
      if (!userOk(who)) return { error: 'That doesn’t look like a username. Usernames are 3–32 letters, numbers, dots, dashes or underscores.' };
      if (who === secret.user) return { error: 'That’s your own username! Ask your friend for theirs.' };
      try { return await api('GET', '/v1/find/' + encodeURIComponent(who)); } catch (e) { return { error: e.message }; }
    },
    'account:mail-send': async ({ to, box }) => { if (!secret) return { ok: false }; try { return await api('POST', '/v1/mail/' + to, { box }); } catch (e) { return { ok: false, error: e.message }; } },
    'account:mail-fetch': async () => { if (!secret || !chatIds.length) return []; try { return (await api('GET', '/v1/mail')).mail; } catch { return []; } },
    'account:status': async () => { await ready; return pub(); },
    'settings:get': async () => ({}), 'settings:set': async () => ({}),
  };
  window.nb = {
    invoke: (ch, ...a) => (H[ch] ? Promise.resolve().then(() => H[ch](...a)) : Promise.reject(new Error('not on the web: ' + ch))),
    on,
  };

  // ---------------------------------------------------------------- bookmarks and to-dos (for the Bookmarks page)
  const now = () => Date.now();
  const uid = () => (crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36) + Math.random().toString(36).slice(2));
  const data = {
    bookmarks: () => (S ? S.bookmarks : []),
    addBookmark({ url, title, folder }) {
      if (!/^https?:\/\//i.test(url || '')) throw new Error('Type a web address starting with https://');
      if (S.bookmarks.some((b) => b.url === url)) throw new Error('That page is already in your bookmarks.');
      let favicon; try { favicon = 'https://www.google.com/s2/favicons?sz=64&domain=' + new URL(url).hostname; } catch {}
      S.bookmarks.push({ id: uid(), url, title: String(title || url).slice(0, 300), favicon, added: now(), folder: folder || '' });
      S.bookmarkTombstones = (S.bookmarkTombstones || []).filter((t) => t.url !== url);
      persist(); touch(); emit('data', { bookmarks: true });
    },
    removeBookmark(id) {
      const b = S.bookmarks.find((x) => x.id === id); if (!b) return;
      S.bookmarks = S.bookmarks.filter((x) => x.id !== id);
      if (!S.bookmarks.some((x) => x.url === b.url)) S.bookmarkTombstones = [...(S.bookmarkTombstones || []).filter((t) => t.url !== b.url), { url: b.url, t: now() }];
      persist(); touch(); emit('data', { bookmarks: true });
    },
    todos: () => (S ? S.extras.todos : []),
    saveTodos(list) {
      const old = S.extras.todos; const clean = list.slice(0, 200).map((t) => ({ id: String(t.id || uid()), text: String(t.text || '').slice(0, 300), done: !!t.done, updated: +t.updated || now() }));
      for (const o of old) if (!clean.some((c) => c.id === o.id)) S.extras.tombstones.push({ kind: 'todo', id: o.id, t: now() });
      S.extras.todos = clean; persist(); touch(); emit('data', { extras: true });
    },
  };

  window.NoamCore = { ready, on, status: pub, sync, signUp, signIn, signOut, changePassword, deleteAccount, removeDevice, data, setFindable: (v) => H['account:findable'](v), signedIn: () => !!secret, user: () => (secret ? secret.user : null), _test: { derive, lock, unlock } };
  ready.then(() => { emit('account:status', pub()); if (secret) { afterSignIn(); sync().catch(() => {}); } });
})();
