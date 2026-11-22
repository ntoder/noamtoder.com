// glue.js — the few NoamBrowser window helpers that NoamChat and Music expect, for the website.
// Load before chat-ui.js / ambient.js.
'use strict';
var state = { settings: { chat: {} }, active: null };
try { const r = new URLSearchParams(location.search).get('relay'); if (r && /^wss?:\/\//.test(r)) state.settings.chat.relays = [r]; } catch {}
var openPanelId = 'noamchat';
var hooks = { init: async () => {} };
var commands = () => [];
function CMD() { return {}; }
function renderRail() {}
function closeSide() {}
function openKind() { return Promise.resolve(); }
function newTab(o) { const u = o && o.url; if (!u) return; if (u.startsWith('noam://account')) location.href = '/account/'; else if (/^https?:/.test(u)) window.open(u, '_blank', 'noopener'); }
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
let toastT = null;
function toast(msg, ms = 2600) {
  let t = document.getElementById('toast'); if (!t) { t = document.createElement('div'); t.id = 'toast'; document.body.appendChild(t); }
  t.textContent = msg; t.classList.add('show'); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('show'), ms);
}
// popup menu. Pass x, y for a click point, or an element as `anchor` to open next to it
// (below it, or above it when there's no room). Closes on Escape, outside click, scroll or resize.
let closeMenu = null, menuAnchor = null;
function popup(items, x, y, anchor) {
  if (closeMenu) { const same = anchor && anchor === menuAnchor; closeMenu(null); if (same) return Promise.resolve(null); }
  menuAnchor = anchor || null;
  return new Promise((resolve) => {
    const m = document.createElement('div'); m.className = 'menu'; m.setAttribute('role', 'menu');
    const btns = [];
    for (const it of items) {
      if (it.type === 'separator') { m.appendChild(document.createElement('hr')); continue; }
      const b = document.createElement('button'); b.textContent = it.label; b.disabled = it.enabled === false; b.setAttribute('role', 'menuitem');
      b.onclick = (e) => { e.stopPropagation(); done(it.id); }; m.appendChild(b); if (!b.disabled) btns.push(b);
    }
    document.body.appendChild(m);
    const r = m.getBoundingClientRect(), W = innerWidth, H = innerHeight;
    let left = x, top = y;
    if (anchor) {
      const a = anchor.getBoundingClientRect();
      left = a.right - r.width > 8 && a.left + r.width > W - 8 ? a.right - r.width : a.left;   // line up with the button
      top = a.bottom + 6 + r.height <= H - 8 ? a.bottom + 6 : a.top - 6 - r.height;           // below, or above if no room
    }
    m.style.left = Math.max(8, Math.min(left, W - r.width - 8)) + 'px';
    m.style.top = Math.max(8, Math.min(top, H - r.height - 8)) + 'px';
    const onDown = (e) => { if (!m.contains(e.target) && !(anchor && anchor.contains(e.target))) done(null); };
    const onKey = (e) => {
      if (e.key === 'Escape') { e.preventDefault(); done(null); return; }
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); const i = btns.indexOf(document.activeElement); const n = e.key === 'ArrowDown' ? (i + 1) % btns.length : (i - 1 + btns.length) % btns.length; btns[n] && btns[n].focus(); }
    };
    const onAway = () => done(null);
    function done(v) {
      if (!m.isConnected) return; m.remove(); closeMenu = null; menuAnchor = null;
      removeEventListener('pointerdown', onDown, true); removeEventListener('keydown', onKey, true); removeEventListener('resize', onAway); removeEventListener('scroll', onAway, true);
      resolve(v);
    }
    closeMenu = done;
    setTimeout(() => { addEventListener('pointerdown', onDown, true); addEventListener('resize', onAway); addEventListener('scroll', onAway, true); }, 0);
    addEventListener('keydown', onKey, true);
  });
}
function $(q) { return document.querySelector(q) || document.createElement('div'); }
// don't let the app's "add me to the sidebar" code run here
try { localStorage.setItem('noamchat-added', '1'); localStorage.setItem('ambient-added', '1'); } catch {}
