// noam-ui.js — the shared top bar and the sign-in box for the Noam pages on noamtoder.com.
'use strict';
(() => {
  const C = window.NoamCore;
  const PAGES = [['chat', '💬 Chat', '/chat/'], ['music', '🎧 Music', '/music/'], ['focus', '🍅 Focus', '/focus/'], ['bookmarks', '⭐ Bookmarks', '/bookmarks/'], ['account', '👤 Account', '/account/']];
  function shell(active) {
    const top = document.createElement('header'); top.className = 'top';
    top.innerHTML = `<a class="logo" href="/">Noam's <span>Game Hub</span></a><nav class="nav">${PAGES.map(([id, label, href]) => `<a href="${href}" class="${id === active ? 'on' : ''}">${label}</a>`).join('')}</nav><a class="who" id="who" href="/account/"></a>`;
    document.body.prepend(top);
    const who = top.querySelector('#who');
    const paint = (st) => { who.innerHTML = st && st.user ? `@<b>${esc(st.user)}</b>${st.state === 'syncing' ? ' · syncing…' : ''}` : 'Sign in'; };
    C.on('account:status', paint); C.status && paint(C.status());
    const foot = document.createElement('div'); foot.className = 'foot'; foot.innerHTML = 'Your NoamBrowser account · end-to-end encrypted · <a href="/privacy">Privacy</a>'; document.body.appendChild(foot);
  }
  const OWNER = (() => { try { return new URLSearchParams(location.search).get('owner') || ''; } catch { return ''; } })();
  const clean = (e) => String((e && e.message) || e);
  // the sign-in / create-account box. onDone() runs once you're signed in.
  function signIn(el, { onDone, title } = {}) {
    let mode = 'in';
    const gh = window.GameHubLink ? window.GameHubLink.get() : {};
    const paint = () => {
      el.innerHTML = `<div class="card signin"><h2>${esc(title || 'Sign in with your NoamBrowser account')}</h2>
        <p class="muted" style="margin:0 0 16px;font-size:14px;line-height:1.5">The same account as in the NoamBrowser app. Your chats, bookmarks and to-dos sync with all your computers.</p>
        <div class="tabs"><button data-m="in" class="${mode === 'in' ? 'on' : ''}">Sign in</button><button data-m="up" class="${mode === 'up' ? 'on' : ''}">Create account</button></div>
        ${gh.name ? `<p class="linked">🎮 Game Hub: signed in as <b>${esc(gh.name)}</b>${gh.noamAccount ? ` (linked to @${esc(gh.noamAccount)})` : '. Your accounts get linked when you sign in.'}</p>` : ''}
        <label class="field">Username<input id="nu" autocomplete="username" autocapitalize="none" spellcheck="false" maxlength="32" value="${esc(gh.noamAccount || '')}"></label>
        <label class="field">Password<input id="np" type="password" autocomplete="${mode === 'up' ? 'new-password' : 'current-password'}"></label>
        ${mode === 'up' ? `<label class="field">Type the password again<input id="np2" type="password" autocomplete="new-password"></label><p class="warn">⚠️ Nobody can reset a forgotten password, not even us, because your password never leaves your device. Keep it somewhere safe.</p>` : ''}
        <label class="check"><input type="checkbox" id="nr" checked> Keep me signed in on this device</label>
        <button class="btn primary" id="ngo" style="width:100%">${mode === 'up' ? 'Create account' : 'Sign in'}</button><div class="err" id="nerr"></div></div>`;
      el.querySelectorAll('[data-m]').forEach((b) => (b.onclick = () => { mode = b.dataset.m; paint(); }));
      const go = el.querySelector('#ngo'), err = el.querySelector('#nerr');
      el.querySelectorAll('input').forEach((i) => (i.onkeydown = (e) => { if (e.key === 'Enter') go.click(); }));
      go.onclick = async () => {
        err.textContent = '';
        const user = el.querySelector('#nu').value, password = el.querySelector('#np').value, remember = el.querySelector('#nr').checked;
        if (mode === 'up' && password !== el.querySelector('#np2').value) { err.textContent = 'The two passwords aren’t the same.'; return; }
        go.disabled = true; go.textContent = mode === 'up' ? 'Creating your account…' : 'Signing in…';
        try { if (mode === 'up') await C.signUp({ user, password, remember, ownerKey: OWNER }); else await C.signIn({ user, password, remember }); onDone && onDone(); }
        catch (e) { err.textContent = clean(e); go.disabled = false; go.textContent = mode === 'up' ? 'Create account' : 'Sign in'; }
      };
    };
    paint();
    addEventListener('gamehub-user', () => { if (!el.querySelector('#np') || el.querySelector('#np').value) return; Object.assign(gh, window.GameHubLink.get()); paint(); });
  }
  // show `signedIn(el)` when signed in, the sign-in box otherwise
  function gate(el, signedIn, opts) {
    let shown = null;
    const show = () => { const s = C.signedIn() ? 'in' : 'out'; if (s === shown) return; shown = s; el.innerHTML = ''; if (s === 'in') signedIn(el); else signIn(el, { ...opts, onDone: show }); };
    C.ready.then(show); C.on('account:status', show);
  }
  window.NoamUI = { shell, signIn, gate };
})();
