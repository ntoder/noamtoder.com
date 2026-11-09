// NoamChat — the sidebar panel: chats with friends and groups (peer-to-peer, end-to-end encrypted)
// plus the AI helper tab. Engine: chat-engine.js. AI: ai.js.
'use strict';
(() => {
  const C = window.NoamChat;
  const AVATARS = ['😀', '😎', '🤓', '🦊', '🐼', '🐯', '🦁', '🐸', '🐙', '🦄', '🐝', '🐧', '🚀', '⚽', '🎮', '🎸', '🌟', '🌈', '🍕', '🍩', '🧠', '👾', '🤖', '🦖'];
  const QUICK = ['😀', '😂', '🥹', '😍', '😎', '🤔', '😮', '😢', '😡', '👍', '👎', '👏', '🙏', '💪', '🔥', '🎉', '❤️', '💯', '✅', '❌', '👀', '🤝', '🙌', '😴', '🍕', '⚽', '🎮', '📚', '💻', '🚀', '⭐', '🙂'];
  const hue = (s) => { let h = 0; for (const c of String(s)) h = (h * 31 + c.charCodeAt(0)) % 360; return h; };
  const av = (emoji, id, big) => `<span class="nc-av${big ? ' big' : ''}" style="--h:${hue(id)}">${esc(emoji || '🙂')}</span>`;
  const time = (t) => { const d = new Date(t), n = new Date(); return d.toDateString() === n.toDateString() ? d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : (n - d < 6 * 864e5 ? d.toLocaleDateString([], { weekday: 'short' }) : d.toLocaleDateString([], { day: 'numeric', month: 'short' })); };
  const ago = (t) => { if (!t) return 'not seen yet'; const m = Math.round((Date.now() - t) / 60000); return m < 1 ? 'just now' : m < 60 ? `${m} min ago` : m < 1440 ? `${Math.round(m / 60)} h ago` : `${Math.round(m / 1440)} d ago`; };
  // 🎮 play a game together: the invite is a normal message with a join link, shown here as a game card
  const PLAY = [['TicTacToe/tictactoe', '❌', 'Tic-Tac-Toe'], ['FourInARow/fourinarow', '🟡', 'Four in a Row'], ['Checkers/checkers', '⚪', 'Checkers'], ['Chess/chess', '♟️', 'Chess']];
  const SITE = /^https?:$/.test(location.protocol) ? location.origin : 'https://noamtoder.com';
  const GAME_RE = /^🎮 [^\n]*?(https?:\/\/[^\s/]+\/(TicTacToe|FourInARow|Checkers|Chess)\/\w+\?room=([A-Z0-9]{5}))\s*$/;
  function gameCard(m, mine) {
    const g = m.text && m.text.match(GAME_RE); if (!g) return '';
    const p = PLAY.find((x) => x[0].startsWith(g[2] + '/')); if (!p) return '';
    const url = mine ? g[1].replace('?room=', '?host=') : g[1];
    return `<div class="nc-game"><span class="ic">${p[1]}</span><span class="tx"><b>${esc(p[2])}</b><small>${mine ? 'You invited them to play' : 'Wants to play with you!'} · ${esc(g[3])}</small></span><button class="btn primary" data-url="${esc(url)}">▶ ${mine ? 'Open' : 'Join'}</button></div>`;
  }
  const linkify = (s) => esc(s).replace(/\bhttps?:\/\/[^\s<]+[^\s<.,;:!?)"'\]]/g, (u) => `<a href="#" data-url="${u}">${u}</a>`).replace(/\n/g, '<br>');
  let body = null, view = { tab: 'chats', screen: 'list', key: null }, flash = '';

  // ---------------------------------------------------------------- shell
  function render(el) {
    if (el) body = el; if (!body || !body.isConnected) return;
    [...body.children].forEach((c) => { if (c.tagName !== 'WEBVIEW') c.remove(); });
    const wrap = document.createElement('div'); wrap.className = 'nc';
    wrap.innerHTML = `<div class="nc-tabs"><button data-tab="chats" class="${view.tab === 'chats' ? 'on' : ''}">💬 Chats${totalUnread() ? ` <b>${totalUnread()}</b>` : ''}</button><button data-tab="ai" class="${view.tab === 'ai' ? 'on' : ''}">🤖 AI helper</button></div><div class="nc-main"></div>`;
    body.appendChild(wrap);
    wrap.querySelectorAll('[data-tab]').forEach((b) => (b.onclick = () => { setViewing(null); view.tab = b.dataset.tab; render(); }));
    const main = wrap.querySelector('.nc-main');
    if (view.tab === 'ai') { if (window.renderAIPanel) window.renderAIPanel(main); else main.innerHTML = '<p class="nc-note">The AI helper is loading…</p>'; return; }
    if (!C.data) { main.innerHTML = '<p class="nc-note">Loading…</p>'; return; }
    if (!C.ready()) return setupScreen(main);
    ({ list: listScreen, conv: convScreen, add: addScreen, me: meScreen, group: newGroupScreen, invite: inviteScreen }[view.screen] || listScreen)(main);
  }
  const go = (screen, key) => { if (screen !== 'conv') setViewing(null); view.screen = screen; if (key !== undefined) view.key = key; render(); };
  function setViewing(key) { if (view.viewing && view.viewing !== key) C.viewing(view.viewing, false); view.viewing = key; if (key) { C.viewing(key, true); C.markRead(key); } }
  const totalUnread = () => { const D = C.data; if (!D) return 0; return Object.entries(D.chats).reduce((a, [k, c]) => a + (c.unread || 0), 0) + (D.requests || []).length; };

  // ---------------------------------------------------------------- first time
  function setupScreen(main) {
    let pick = AVATARS[Math.floor(Math.random() * AVATARS.length)];
    main.innerHTML = `<div class="nc-setup"><div class="nc-hero">💬</div><h3>Welcome to NoamChat</h3>
      <p>Chat with friends who use NoamBrowser. Messages go <b>straight from your computer to theirs</b>, locked so only the two of you can read them. No account, no phone number, no company in the middle.</p>
      <label class="nc-l">Your name</label><input class="nc-in" id="nc-name" maxlength="40" placeholder="What friends will see">
      <label class="nc-l">Pick a picture</label><div class="nc-avs">${AVATARS.map((a) => `<button data-a="${a}" class="${a === pick ? 'on' : ''}">${a}</button>`).join('')}</div>
      <button class="btn primary nc-wide" id="nc-start">Start chatting</button></div>`;
    main.querySelectorAll('[data-a]').forEach((b) => (b.onclick = () => { pick = b.dataset.a; main.querySelectorAll('[data-a]').forEach((x) => x.classList.toggle('on', x === b)); }));
    const name = main.querySelector('#nc-name'); name.focus();
    name.onkeydown = (e) => { e.stopPropagation(); if (e.key === 'Enter') main.querySelector('#nc-start').click(); };
    main.querySelector('#nc-start').onclick = async () => { const n = name.value.trim(); if (!n) { name.focus(); name.classList.add('nc-bad'); return; } main.querySelector('#nc-start').disabled = true; await C.createIdentity(n, pick); go('add'); };
  }

  // ---------------------------------------------------------------- chat list
  function listScreen(main) {
    const D = C.data, me = D.identity;
    const items = [
      ...Object.values(D.friends).filter((f) => f.status !== 'blocked').map((f) => ({ key: 'f:' + f.id, name: f.name, emoji: f.emoji, id: f.id, pending: f.status === 'pending', online: C.online('f:' + f.id) })),
      ...Object.values(D.groups).map((g) => ({ key: 'g:' + g.gid, name: g.name, emoji: g.emoji, id: g.gid, group: true, online: C.online('g:' + g.gid) })),
    ].map((x) => { const c = D.chats[x.key] || { msgs: [] }; const last = c.msgs[c.msgs.length - 1]; return { ...x, last, unread: c.unread || 0, t: (last && last.t) || 0 }; }).sort((a, b) => b.t - a.t);
    const preview = (x) => { const m = x.last; if (x.pending && !m) return '⏳ Waiting for them to accept'; if (!m) return x.group ? 'Say hi to the group 👋' : 'Say hi 👋'; const who = m.from === C.myId ? 'You: ' : x.group && m.fromName ? m.fromName + ': ' : ''; return who + (m.img ? '📷 Photo' : m.share ? '🔗 ' + (m.share.title || m.share.url) : m.ginv ? '👥 Group invite' : m.text); };
    main.innerHTML = `<div class="nc-bar"><button class="nc-me" id="nc-me" title="Your profile and username">${av(me.emoji, C.myId)}<b>${esc(me.name)}</b></button><span class="grow"></span><button class="nc-ib" id="nc-add" title="Add a friend">➕ Friend</button><button class="nc-ib" id="nc-grp" title="New group">👥 Group</button></div>
      ${flash ? `<div class="nc-flash">${flash}</div>` : ''}
      ${D.requests.map((q) => `<div class="nc-req">${av(q.inv.e, q.id)}<div><b>${esc(q.inv.n)}</b> wants to chat with you${q.note ? `<small>“${esc(q.note)}”</small>` : ''}<span class="nc-req-a"><button class="btn primary" data-acc="${q.id}">Accept</button><button class="btn ghost" data-dec="${q.id}">Not now</button><button class="btn ghost" data-blk="${q.id}" title="Block">🚫</button></span></div></div>`).join('')}
      <div class="nc-list">${items.length ? items.map((x) => `<button class="nc-item" data-key="${x.key}"><span class="nc-avw">${av(x.emoji, x.id)}${x.online ? '<i class="nc-on"></i>' : ''}</span><span class="nc-mid"><b>${esc(x.name)}</b><span>${esc(preview(x))}</span></span><span class="nc-meta">${x.t ? `<small>${time(x.t)}</small>` : ''}${x.unread ? `<em>${x.unread}</em>` : ''}</span></button>`).join('')
      : `<div class="nc-empty"><div>👋</div><b>No chats yet</b><p>Add a friend who uses NoamBrowser by their username.</p><button class="btn primary" id="nc-add2">Add a friend</button></div>`}</div>
      <p class="nc-foot">🔒 End-to-end encrypted, peer-to-peer. Messages wait on your computer until your friend is online.</p>`;
    flash = '';
    main.querySelector('#nc-me').onclick = () => go('me');
    main.querySelector('#nc-add').onclick = () => go('add');
    const a2 = main.querySelector('#nc-add2'); if (a2) a2.onclick = () => go('add');
    main.querySelector('#nc-grp').onclick = () => go('group');
    main.querySelectorAll('[data-key]').forEach((b) => (b.onclick = () => go('conv', b.dataset.key)));
    main.querySelectorAll('[data-acc]').forEach((b) => (b.onclick = async () => { const f = await C.acceptRequest(b.dataset.acc); if (f) go('conv', 'f:' + f.id); }));
    main.querySelectorAll('[data-dec]').forEach((b) => (b.onclick = () => C.declineRequest(b.dataset.dec)));
    main.querySelectorAll('[data-blk]').forEach((b) => (b.onclick = () => C.declineRequest(b.dataset.blk, true)));
  }

  // ---------------------------------------------------------------- add a friend / join a group
  async function addScreen(main) {
    const code = C.inviteCode(); const acc = C.account();
    const userCard = acc.signedIn && acc.user
      ? `<div class="nc-card"><b>Your friend’s username</b><p>The username they use for their NoamBrowser account.</p>
          <div class="nc-at"><span>@</span><input class="nc-in" id="nc-user" maxlength="40" autocomplete="off" spellcheck="false" placeholder="username"></div>
          <input class="nc-in" id="nc-note" maxlength="200" placeholder="Add a short note (optional), e.g. “It’s Sara from class”">
          <button class="btn primary nc-wide" id="nc-addu">Add friend</button><div class="nc-err" id="nc-err"></div></div>
        <div class="nc-card nc-mine">Friends add you with <b>@${esc(acc.user)}</b> <button class="btn ghost" id="nc-copyu">📋 Copy</button>${acc.findable ? '' : '<p class="nc-warn">You’ve turned off “Let friends find me”, so nobody can add you by username right now. Turn it on in your profile.</p>'}</div>`
      : `<div class="nc-card nc-center"><div class="nc-big">👤</div><b>Add friends by username</b><p>Sign in to your free NoamBrowser account (no email needed). Then just type a friend’s username to add them, and they can add you by yours.</p><button class="btn primary nc-wide" id="nc-signin">Sign in or create an account</button></div>`;
    main.innerHTML = `<div class="nc-bar"><button class="nc-ib" id="nc-back">‹ Back</button><b class="grow">Add a friend</b></div>
      ${userCard}
      <details class="nc-more"${acc.signedIn ? '' : ' open'}><summary>Other ways: invite code or QR</summary>
        <div class="nc-card"><b>Send your invite code</b><p>For friends without an account. Share it any way you like (WhatsApp, email…).</p>
          <div class="nc-code"><code>${esc(code)}</code></div><div class="nc-row"><button class="btn" id="nc-copy">📋 Copy my code</button><button class="btn ghost" id="nc-qrb">📱 Show QR</button></div><div id="nc-qr"></div></div>
        <div class="nc-card"><b>Paste a friend’s code</b><textarea class="nc-in" id="nc-paste" rows="2" placeholder="NC1.…"></textarea>
          <button class="btn nc-wide" id="nc-addf">Send friend request</button><div class="nc-err" id="nc-cerr"></div></div>
        <div class="nc-card"><b>Got a group code?</b><div class="nc-row"><input class="nc-in" id="nc-gcode" placeholder="NCG1.…"><button class="btn" id="nc-gjoin">Join</button></div><div class="nc-err" id="nc-gerr"></div></div>
      </details>`;
    const $ = (q) => main.querySelector(q);
    main.querySelectorAll('input, textarea').forEach((el) => (el.onkeydown = (e) => { e.stopPropagation(); if (e.key === 'Enter' && el.id === 'nc-user') $('#nc-addu').click(); }));
    $('#nc-back').onclick = () => go('list');
    const done = (f) => { flash = f.status === 'friend' ? `✅ You and ${esc(f.name)} are now friends` : `📨 Friend request sent to ${esc(f.name)}. They’ll see it next time they open NoamBrowser.`; go('list'); };
    if ($('#nc-signin')) $('#nc-signin').onclick = () => newTab({ url: 'noam://account/' });
    if ($('#nc-addu')) {
      setTimeout(() => $('#nc-user') && $('#nc-user').focus(), 50);
      $('#nc-user').oninput = (e) => { const v = e.target.value.replace(/^\s*@+/, ''); if (v !== e.target.value) e.target.value = v; };
      $('#nc-addu').onclick = async () => {
        const btn = $('#nc-addu'), err = $('#nc-err'); err.textContent = ''; btn.disabled = true; btn.textContent = 'Looking…';
        try { done(await C.addByUsername($('#nc-user').value, $('#nc-note').value.trim())); }
        catch (e) { err.textContent = e.message; btn.disabled = false; btn.textContent = 'Add friend'; }
      };
      $('#nc-copyu').onclick = () => navigator.clipboard.writeText('@' + acc.user).then(() => toast('📋 Username copied'));
    }
    $('#nc-copy').onclick = () => navigator.clipboard.writeText(code).then(() => toast('📋 Invite code copied. Paste it to your friend'));
    $('#nc-qrb').onclick = async () => { const q = await nb.invoke('chat:qr', code); $('#nc-qr').innerHTML = q ? `<img class="nc-qrimg" src="${q}" alt="QR code"><small>Scan with a phone to copy the code, then send it to yourself or a friend.</small>` : ''; };
    $('#nc-addf').onclick = async () => { $('#nc-cerr').textContent = ''; try { done(await C.addFriend($('#nc-paste').value, '')); } catch (e) { $('#nc-cerr').textContent = e.message; } };
    $('#nc-gjoin').onclick = async () => { try { const g = await C.joinGroup($('#nc-gcode').value); go('conv', 'g:' + g.gid); } catch (e) { $('#nc-gerr').textContent = e.message; } };
  }
  function meScreen(main) {
    const me = C.data.identity;
    main.innerHTML = `<div class="nc-bar"><button class="nc-ib" id="nc-back">‹ Back</button><b class="grow">You</b></div>
      <div class="nc-card nc-center">${av(me.emoji, C.myId, true)}<input class="nc-in nc-namein" id="nc-name" maxlength="40" value="${esc(me.name)}"><div class="nc-avs">${AVATARS.map((a) => `<button data-a="${a}" class="${a === me.emoji ? 'on' : ''}">${a}</button>`).join('')}</div><small class="nc-muted">Your NoamChat ID: ${C.myId.slice(0, 4).toUpperCase()}-${C.myId.slice(4, 8).toUpperCase()}</small></div>
      ${(() => { const acc = C.account(); return acc.signedIn && acc.user ? `<div class="nc-card"><b>Your username: @${esc(acc.user)}</b><p>Friends can add you by typing it in NoamChat.</p><label class="nc-check"><input type="checkbox" id="nc-find" ${acc.findable ? 'checked' : ''}> Let friends find me by my username</label></div>` : `<div class="nc-card"><b>Get a username</b><p>Sign in to a NoamBrowser account and friends can add you by your username instead of a code.</p><button class="btn" id="nc-signin">Sign in or create an account</button></div>`; })()}
      <details class="nc-more"><summary>Your invite code</summary><div class="nc-card"><div class="nc-code"><code>${esc(C.inviteCode())}</code></div><button class="btn" id="nc-copy">📋 Copy</button></div></details>
      <div class="nc-card"><label class="nc-check"><input type="checkbox" id="nc-notif" ${C.data.settings && C.data.settings.mute ? '' : 'checked'}> Show notifications for new messages</label><small class="nc-muted">During a Focus session they wait until your break.</small></div>
      <div class="nc-card"><b>How it works</b><p class="nc-muted">Your friends’ computers connect straight to yours, so they can see your internet address (like on a video call). Public “Nostr” servers only help computers find each other; they can’t read anything. Your chats are saved only on this computer.</p><button class="btn ghost danger" id="nc-reset">Delete NoamChat from this computer…</button></div>`;
    main.querySelector('#nc-back').onclick = () => go('list');
    const name = main.querySelector('#nc-name'); name.onkeydown = (e) => e.stopPropagation(); name.onchange = () => C.setProfile(name.value.trim());
    main.querySelectorAll('[data-a]').forEach((b) => (b.onclick = () => C.setProfile(null, b.dataset.a)));
    main.querySelector('#nc-copy').onclick = () => navigator.clipboard.writeText(C.inviteCode()).then(() => toast('📋 Invite code copied'));
    const fnd = main.querySelector('#nc-find'); if (fnd) fnd.onchange = () => C.setFindable(fnd.checked);
    const si = main.querySelector('#nc-signin'); if (si) si.onclick = () => newTab({ url: 'noam://account/' });
    main.querySelector('#nc-notif').onchange = (e) => { C.data.settings = { ...(C.data.settings || {}), mute: !e.target.checked }; nb.invoke('chat:save', C.data); };
    main.querySelector('#nc-reset').onclick = async () => { if (!confirm('Delete your NoamChat identity, friends and all chats from this computer? This can’t be undone.')) return; await nb.invoke('chat:wipe'); await C.init(); view.screen = 'list'; render(); };
  }
  function newGroupScreen(main) {
    let pick = '👥';
    const friends = Object.values(C.data.friends).filter((f) => f.status === 'friend');
    main.innerHTML = `<div class="nc-bar"><button class="nc-ib" id="nc-back">‹ Back</button><b class="grow">New group</b></div>
      <div class="nc-card"><label class="nc-l">Group name</label><input class="nc-in" id="nc-gname" maxlength="60" placeholder="e.g. Science project">
      <label class="nc-l">Picture</label><div class="nc-avs">${['👥', '📚', '⚽', '🎮', '🎸', '🧪', '🏫', '🚀', '🍕', '🎉', '🙏', '💻'].map((a) => `<button data-a="${a}" class="${a === pick ? 'on' : ''}">${a}</button>`).join('')}</div>
      ${friends.length ? `<label class="nc-l">Invite friends</label><div class="nc-picks">${friends.map((f) => `<label class="nc-check">${av(f.emoji, f.id)} <input type="checkbox" value="${f.id}" checked> ${esc(f.name)}</label>`).join('')}</div>` : '<p class="nc-muted">You can invite friends after making the group.</p>'}
      <button class="btn primary nc-wide" id="nc-gmake">Create group</button></div>`;
    main.querySelector('#nc-back').onclick = () => go('list');
    main.querySelectorAll('[data-a]').forEach((b) => (b.onclick = () => { pick = b.dataset.a; main.querySelectorAll('[data-a]').forEach((x) => x.classList.toggle('on', x === b)); }));
    const gn = main.querySelector('#nc-gname'); gn.onkeydown = (e) => e.stopPropagation(); gn.focus();
    main.querySelector('#nc-gmake').onclick = async () => {
      const n = gn.value.trim(); if (!n) { gn.classList.add('nc-bad'); gn.focus(); return; }
      const g = await C.createGroup(n, pick);
      for (const cb of main.querySelectorAll('.nc-picks input:checked')) await C.sendTo('f:' + cb.value, { text: `Join my group “${g.name}”`, ginv: { g: g.gid, n: g.name, e: g.emoji, k: g.secret } });
      go('conv', 'g:' + g.gid);
    };
  }
  function inviteScreen(main) {
    const g = C.data.groups[view.key.slice(2)]; if (!g) return go('list');
    const friends = Object.values(C.data.friends).filter((f) => f.status === 'friend');
    main.innerHTML = `<div class="nc-bar"><button class="nc-ib" id="nc-back">‹ Back</button><b class="grow">Invite to ${esc(g.name)}</b></div>
      <div class="nc-card">${friends.length ? `<div class="nc-picks">${friends.map((f) => `<label class="nc-check">${av(f.emoji, f.id)} <input type="checkbox" value="${f.id}"> ${esc(f.name)}</label>`).join('')}</div><button class="btn primary nc-wide" id="nc-send">Send invites</button>` : '<p class="nc-muted">Add some friends first.</p>'}</div>
      <div class="nc-card"><b>Or share the group code</b><p class="nc-muted">Anyone with this code can join and read the group, so only give it to people you trust.</p><div class="nc-code"><code>${esc(C.groupCode(g))}</code></div><button class="btn" id="nc-copy">📋 Copy group code</button></div>`;
    main.querySelector('#nc-back').onclick = () => go('conv');
    main.querySelector('#nc-copy').onclick = () => navigator.clipboard.writeText(C.groupCode(g)).then(() => toast('📋 Group code copied'));
    const s = main.querySelector('#nc-send'); if (s) s.onclick = async () => { const ids = [...main.querySelectorAll('.nc-picks input:checked')].map((x) => x.value); for (const id of ids) await C.sendTo('f:' + id, { text: `Join my group “${g.name}”`, ginv: { g: g.gid, n: g.name, e: g.emoji, k: g.secret } }); toast(`📨 Invited ${ids.length} friend${ids.length === 1 ? '' : 's'}`); go('conv'); };
  }

  // ---------------------------------------------------------------- a conversation
  let draft = {};
  function convScreen(main) {
    const key = view.key, D = C.data; const isG = key.startsWith('g:');
    const f = !isG && D.friends[key.slice(2)], g = isG && D.groups[key.slice(2)];
    if (!f && !g) return go('list');
    setViewing(key);
    const c = D.chats[key] || { msgs: [] };
    const online = C.online(key), typ = C.typing(key);
    const status = typ ? `${esc(typ)} is typing…` : isG ? `${Object.keys(g.members).length} member${Object.keys(g.members).length === 1 ? '' : 's'} · ${online} online` : f.status === 'pending' ? '⏳ Waiting for them to accept your request' : online ? '🟢 Online' : `Last seen ${ago(f.lastSeen)}`;
    let lastDay = '';
    const msgs = c.msgs.map((m) => {
      const mine = m.from === C.myId; const day = new Date(m.t).toDateString(); let sep = '';
      if (day !== lastDay) { lastDay = day; sep = `<div class="nc-day">${new Date(m.t).toLocaleDateString([], { weekday: 'long', day: 'numeric', month: 'long' })}</div>`; }
      const tick = mine && !isG ? `<i class="nc-tick ${m.status}" title="${{ pending: 'Waiting to send (they’re offline)', sent: 'Sent', delivered: 'Delivered', read: 'Read' }[m.status] || ''}">${m.status === 'pending' ? '🕓' : m.status === 'sent' ? '✓' : '✓✓'}</i>` : '';
      const who = isG && !mine ? `<span class="nc-who" style="--h:${hue(m.from)}">${esc(m.fromEmoji || '')} ${esc(m.fromName || 'Someone')}</span>` : '';
      const inner = (m.img ? `<img class="nc-img" src="${esc(m.img)}" alt="photo">` : '') + (m.share ? `<a href="#" class="nc-share" data-url="${esc(m.share.url)}"><b>🔗 ${esc(m.share.title || m.share.url)}</b><small>${esc(m.share.url.replace(/^https?:\/\//, '').slice(0, 60))}</small></a>` : '') + (m.ginv ? `<div class="nc-ginv">${esc(m.ginv.e)} <b>${esc(m.ginv.n)}</b><button class="btn primary" data-join='${esc(JSON.stringify(m.ginv))}'>${D.groups[m.ginv.g] ? 'Open' : 'Join group'}</button></div>` : '') + (gameCard(m, mine) || (m.text && !(m.ginv && /^Join my group/.test(m.text)) ? `<div class="nc-text">${linkify(m.text)}</div>` : ''));
      return `${sep}<div class="nc-msg ${mine ? 'mine' : ''}" data-id="${m.id}">${who}<div class="nc-bub">${inner}<span class="nc-time">${new Date(m.t).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}${tick}</span></div></div>`;
    }).join('');
    main.innerHTML = `<div class="nc-bar nc-convbar"><button class="nc-ib" id="nc-back" title="Back">‹</button>${av(isG ? g.emoji : f.emoji, isG ? g.gid : f.id)}<span class="nc-ttl"><b>${esc(isG ? g.name : f.name)}</b><small>${status}</small></span><button class="nc-ib" id="nc-more" title="More">⋯</button></div>
      <div class="nc-msgs" id="nc-msgs">${msgs || `<div class="nc-empty small"><div>${isG ? g.emoji : '👋'}</div>${isG ? 'Messages here go to everyone in the group.' : f.status === 'pending' ? `When ${esc(f.name)} accepts, you can chat. You can write now: it’ll be delivered then.` : `Say hi to ${esc(f.name)}!`}</div>`}</div>
      <div class="nc-emo" id="nc-emo" hidden>${QUICK.map((e) => `<button>${e}</button>`).join('')}</div>
      <div class="nc-comp"><button class="nc-cb" id="nc-emob" title="Emoji">😊</button><button class="nc-cb" id="nc-imgb" title="Send a photo">📷</button><button class="nc-cb" id="nc-tabb" title="Share the page you’re on">🔗</button><button class="nc-cb" id="nc-playb" title="Play a game together">🎮</button>
        <textarea id="nc-text" rows="1" placeholder="Message${isG ? ' the group' : ''}…" maxlength="8000"></textarea><button class="nc-send" id="nc-send" title="Send (Enter)">➤</button><input type="file" id="nc-file" accept="image/*" hidden></div>`;
    const list = main.querySelector('#nc-msgs'); list.scrollTop = list.scrollHeight;
    main.querySelector('#nc-back').onclick = () => go('list');
    main.querySelector('#nc-more').onclick = (e) => convMenu(key, e.clientX, e.clientY);
    const ta = main.querySelector('#nc-text'); ta.value = draft[key] || '';
    const grow = () => { ta.style.height = 'auto'; ta.style.height = Math.min(120, ta.scrollHeight) + 'px'; ta.style.overflowY = ta.scrollHeight > 120 ? 'auto' : 'hidden'; }; grow();
    let lastType = 0;
    ta.oninput = () => { draft[key] = ta.value; grow(); if (Date.now() - lastType > 2500) { lastType = Date.now(); C.sendTyping(key); } };
    const send = async () => { const t = ta.value.trim(); if (!t) return; ta.value = ''; draft[key] = ''; grow(); await C.sendTo(key, { text: t }); };
    ta.onkeydown = (e) => { e.stopPropagation(); if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } };
    ta.onpaste = (e) => { const it = [...(e.clipboardData || {}).items || []].find((x) => x.type.startsWith('image/')); if (it) { e.preventDefault(); sendImage(key, it.getAsFile()); } };
    main.querySelector('#nc-send').onclick = send;
    main.querySelector('#nc-emob').onclick = () => { const p = main.querySelector('#nc-emo'); p.hidden = !p.hidden; };
    main.querySelectorAll('#nc-emo button').forEach((b) => (b.onclick = () => { const s = ta.selectionStart || ta.value.length; ta.value = ta.value.slice(0, s) + b.textContent + ta.value.slice(s); draft[key] = ta.value; ta.focus(); }));
    main.querySelector('#nc-imgb').onclick = () => main.querySelector('#nc-file').click();
    main.querySelector('#nc-file').onchange = (e) => { const file = e.target.files[0]; if (file) sendImage(key, file); };
    main.querySelector('#nc-playb').onclick = async (e) => {
      const r = e.currentTarget.getBoundingClientRect();
      const a = await popup(PLAY.map(([id, ic, n]) => ({ id, label: `${ic} ${n}` })), r.left, r.top - 8);
      const p = PLAY.find((x) => x[0] === a); if (!p) return;
      const ABC = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
      const code = Array.from(crypto.getRandomValues(new Uint8Array(5)), (b) => ABC[b % ABC.length]).join('');
      const url = `${SITE}/${p[0]}?room=${code}`;
      newTab({ url: url.replace('?room=', '?host=') });            // your game opens and waits for your friend
      await C.sendTo(key, { text: `🎮 Let's play ${p[2]}! Join me here: ${url}` });
      toast(`🎮 Invite sent. ${p[2]} opened in a new tab`);
    };
    main.querySelector('#nc-tabb').onclick = () => { const t = state.active; if (!t || !/^https?:/.test(t.url || '') || t.private) { toast('Open a web page first, then share it'); return; } C.sendTo(key, { share: { url: t.url, title: t.title } }); };
    list.querySelectorAll('[data-url]').forEach((a) => (a.onclick = (e) => { e.preventDefault(); newTab({ url: a.dataset.url }); }));
    list.querySelectorAll('.nc-img').forEach((img) => (img.onclick = () => lightbox(img.src)));
    list.querySelectorAll('[data-join]').forEach((b) => (b.onclick = async () => { const o = JSON.parse(b.dataset.join); const g2 = await C.joinGroup(o); go('conv', 'g:' + g2.gid); }));
    list.querySelectorAll('.nc-msg').forEach((m) => (m.oncontextmenu = async (e) => { e.preventDefault(); const msg = c.msgs.find((x) => x.id === m.dataset.id); if (!msg) return; const a = await popup([{ id: 'copy', label: 'Copy text', enabled: !!msg.text }, { id: 'del', label: '🗑️ Delete on this computer' }], e.clientX, e.clientY); if (a === 'copy') navigator.clipboard.writeText(msg.text); if (a === 'del') C.deleteMsg(key, msg.id); }));
    setTimeout(() => ta.focus(), 0);
  }
  async function convMenu(key, x, y) {
    const isG = key.startsWith('g:');
    const items = isG ? [{ id: 'inv', label: '➕ Invite friends' }, { id: 'code', label: '📋 Copy group code' }, { id: 'clear', label: 'Clear chat on this computer' }, { type: 'separator' }, { id: 'leave', label: '🚪 Leave group' }]
      : [{ id: 'clear', label: 'Clear chat on this computer' }, { type: 'separator' }, { id: 'remove', label: 'Remove friend' }, { id: 'block', label: '🚫 Block' }];
    const a = await popup(items, x, y);
    if (a === 'inv') go('invite');
    if (a === 'code') navigator.clipboard.writeText(C.groupCode(C.data.groups[key.slice(2)])).then(() => toast('📋 Group code copied'));
    if (a === 'clear') C.clearChat(key);
    if (a === 'leave' && confirm('Leave this group? You’ll need a new invite to come back.')) { C.leaveGroup(key.slice(2)); go('list'); }
    if (a === 'remove' && confirm('Remove this friend? Your chat with them is deleted from this computer.')) { C.removeFriend(key.slice(2)); go('list'); }
    if (a === 'block' && confirm('Block this person? They won’t be able to message you or send requests.')) { C.removeFriend(key.slice(2), true); go('list'); }
  }
  // photos are shrunk before sending so they arrive quickly
  function sendImage(key, file) {
    if (!file || !/^image\//.test(file.type)) return;
    const img = new Image(); const url = URL.createObjectURL(file);
    img.onload = () => {
      const s = Math.min(1, 1280 / Math.max(img.width, img.height)); const cv = document.createElement('canvas'); cv.width = Math.round(img.width * s); cv.height = Math.round(img.height * s);
      cv.getContext('2d').drawImage(img, 0, 0, cv.width, cv.height); URL.revokeObjectURL(url);
      let q = 0.82, d = cv.toDataURL('image/jpeg', q); while (d.length > 1.2e6 && q > 0.4) { q -= 0.12; d = cv.toDataURL('image/jpeg', q); }
      C.sendTo(key, { img: d });
    };
    img.onerror = () => toast('That picture couldn’t be opened');
    img.src = url;
  }
  function lightbox(src) { const d = document.createElement('div'); d.className = 'nc-light'; d.innerHTML = `<img src="${esc(src)}" alt="">`; d.onclick = () => d.remove(); document.body.appendChild(d); }

  // ---------------------------------------------------------------- notifications, badge, focus mode
  let focusPhase = 'idle', held = 0;
  nb.on('focus:state', (f) => { const was = focusPhase; focusPhase = f.phase; if (was === 'focus' && f.phase !== 'focus' && held) { toast(`💬 ${held} message${held === 1 ? '' : 's'} arrived while you were focusing`, 5000); held = 0; } });
  C.on('message', ({ key, m, title, emoji, viewing }) => {
    const panelOpen = typeof openPanelId !== 'undefined' && openPanelId === 'noamchat';
    if (viewing && panelOpen && document.hasFocus()) return;
    if (C.data.settings && C.data.settings.mute) return;
    if (focusPhase === 'focus') { held++; return; }
    nb.invoke('chat:notify', { title: `${emoji || ''} ${title}`.trim(), body: m.img ? '📷 Photo' : m.share ? '🔗 ' + (m.share.title || m.share.url) : m.ginv ? '👥 Invited you to a group' : m.text, chat: key }).catch(() => {});
  });
  C.on('request', ({ name }) => { if (!(C.data.settings && C.data.settings.mute)) nb.invoke('chat:notify', { title: '💬 NoamChat', body: `${name} wants to chat with you`, chat: 'requests' }).catch(() => {}); });
  nb.on('chat:open', async (key) => { if (openPanelId !== 'noamchat') await openKind('chat'); view.tab = 'chats'; if (key && key !== 'requests') go('conv', key); else go('list'); });
  function paintBadge() {
    const b = document.querySelector('.rail-btn[data-id="noamchat"]'); if (!b) return;
    let el = b.querySelector('.nc-badge'); const n = totalUnread();
    if (!n) { if (el) el.remove(); return; }
    if (!el) { el = document.createElement('i'); el.className = 'nc-badge'; b.appendChild(el); }
    el.textContent = n > 99 ? '99+' : n;
  }
  const _rr = renderRail; window.renderRail = function () { _rr(); paintBadge(); };
  let rT = null;
  const rerender = () => { clearTimeout(rT); rT = setTimeout(() => { paintBadge(); if (body && body.isConnected && body.querySelector('.nc') && view.tab === 'chats') { const ta = body.querySelector('#nc-text'); const focus = ta && document.activeElement === ta; const sel = ta && ta.selectionStart; const scroll = body.querySelector('#nc-msgs'); const atBottom = !scroll || scroll.scrollHeight - scroll.scrollTop - scroll.clientHeight < 60; const prevTop = scroll && scroll.scrollTop; if (body.querySelector('input:focus:not(#nc-text), textarea:focus:not(#nc-text)')) return; render(); const ta2 = body.querySelector('#nc-text'); if (ta2 && focus) { ta2.focus(); try { ta2.setSelectionRange(sel, sel); } catch {} } const s2 = body.querySelector('#nc-msgs'); if (s2 && !atBottom) s2.scrollTop = prevTop; } }, 60); };
  C.on('change', rerender); C.on('typing', rerender); C.on('presence', rerender);
  setInterval(() => { if (view.screen === 'conv' && body && body.isConnected) rerender(); }, 15000);
  window.renderChatPanel = (el) => { view.screen = view.screen || 'list'; render(el); };
  // stop counting a chat as "being read" once the panel closes
  const _cs = closeSide; window.closeSide = function () { setViewing(null); _cs(); };
  $('#rp-close').addEventListener('click', () => setViewing(null));

  // add NoamChat to the sidebar once, at the top
  const _init = hooks.init;
  hooks.init = async (init) => {
    await _init(init);
    let added = false; try { added = localStorage.getItem('noamchat-added') === '1'; } catch {}
    const panels = (state.settings.sidePanel || {}).panels || [];
    if (!added && !panels.some((p) => p.kind === 'chat')) state.settings = await nb.invoke('settings:set', { sidePanel: { panels: [{ id: 'noamchat', kind: 'chat', name: 'NoamChat' }, ...panels] } });
    try { localStorage.setItem('noamchat-added', '1'); } catch {}
    await C.init(); paintBadge();
  };
  const _cmds = commands;
  commands = function () { return [..._cmds(), CMD('noamchat', 'Open NoamChat 💬', '', () => openKind('chat'), 'chat'), CMD('noamchat-add', 'NoamChat: add a friend', '', async () => { await openKind('chat'); go('add'); }, 'chat'), CMD('noamai', 'Ask the AI helper 🤖', '', async () => { await openKind('chat'); view.tab = 'ai'; render(); }, 'chat')]; };
  window.NoamChatUI = { go, render, view };
})();
