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
function popup(items, x, y) {
  return new Promise((resolve) => {
    document.querySelectorAll('.menu').forEach((m) => m.remove());
    const m = document.createElement('div'); m.className = 'menu';
    for (const it of items) {
      if (it.type === 'separator') { m.appendChild(document.createElement('hr')); continue; }
      const b = document.createElement('button'); b.textContent = it.label; b.disabled = it.enabled === false;
      b.onclick = (e) => { e.stopPropagation(); m.remove(); resolve(it.id); }; m.appendChild(b);
    }
    document.body.appendChild(m);
    const r = m.getBoundingClientRect();
    m.style.left = Math.max(8, Math.min(x, innerWidth - r.width - 8)) + 'px'; m.style.top = Math.max(8, Math.min(y, innerHeight - r.height - 8)) + 'px';
    setTimeout(() => addEventListener('pointerdown', function off(e) { if (!m.contains(e.target)) { m.remove(); removeEventListener('pointerdown', off, true); resolve(null); } }, true), 0);
  });
}
function $(q) { return document.querySelector(q) || document.createElement('div'); }
// don't let the app's "add me to the sidebar" code run here
try { localStorage.setItem('noamchat-added', '1'); localStorage.setItem('ambient-added', '1'); } catch {}
