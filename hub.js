// hub.js — shared account logic for Noam's Game Hub
// Loaded on every page:  <script type="module" src="/hub.js"></script>
// Games call (no imports needed):
//   window.GameHub.saveScore(score)   → saves best score, plays, leaderboards, daily challenge
//   window.GameHub.recordPlay()       → counts a play (games without a score)
//   window.GameHub.skin("spaceshooter") → the colour the player picked (Premium skins)
//   window.GameHub.saveData({...}) / await window.GameHub.loadData()  → any saved progress

import { db, auth } from "./firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
    doc, getDoc, setDoc, updateDoc, getDocs, collection, query, orderBy, limit,
    writeBatch, increment, serverTimestamp, arrayUnion, arrayRemove
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { GAMES, PLAY_ONLY, DEFAULT_PREMIUM } from "./games.js";
import { TARGETS, SKINS, FRAMES, dayKey, weekKey, dailyChallenge, nameProblem } from "./progress.js";
import { getLang, startHebrew, addLangButton } from "./i18n.js";
export { GAMES };

// ---------- Clean URLs: /login instead of /login.html, / instead of /index.html ----------
(() => {
    const p = location.pathname;
    const clean = p.replace(/\/index\.html$/i, "/").replace(/\.html$/i, "");
    if (clean !== p) history.replaceState(null, "", clean + location.search + location.hash);
})();

// ---------- Light code protection ----------
// Blocks right-click and the usual "view source" shortcuts. This stops casual peeking only —
// the real protection is the database rules (nobody can give themselves Premium or admin).
(() => {
    addEventListener("contextmenu", (e) => { if (!e.target.closest("input, textarea")) e.preventDefault(); });
    addEventListener("keydown", (e) => {
        const k = e.key.toLowerCase(), mod = e.ctrlKey || e.metaKey;
        if (e.key === "F12" || (mod && e.shiftKey && ["i", "j", "c"].includes(k)) || (mod && e.altKey && ["i", "j", "c", "u"].includes(k)) || (mod && ["u", "s"].includes(k))) {
            e.preventDefault(); e.stopPropagation();
        }
    }, true);
    addEventListener("dragstart", (e) => { if (e.target.tagName === "IMG") e.preventDefault(); });
})();

// ---------- Hebrew / English ----------
export const LANG = getLang();
(async () => {
    if (location.pathname.startsWith("/admin")) return;           // admin page stays in English
    await new Promise((r) => (document.readyState === "loading" ? addEventListener("DOMContentLoaded", r) : r()));
    const game = !!gameIdFromPath(decodeURIComponent(location.pathname));
    addLangButton(LANG);
    if (LANG === "he") startHebrew({ gamePage: game });
})();

const ADSENSE_SRC = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8671583156732584";

// ---------- Helpers ----------
export function gameIdFromPath(path) {
    const parts = path.split("/").filter(Boolean);
    if (parts.length < 2) return null;
    const id = parts[0].toLowerCase();
    return GAMES[id] ? id : null;
}
export const CURRENT_GAME = gameIdFromPath(decodeURIComponent(location.pathname));
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const ls = {
    get(k, d) { try { const v = JSON.parse(localStorage.getItem(k)); return v ?? d; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
};

// ---------- Account + settings state ----------
export const state = { user: null, profile: null, premiumGames: DEFAULT_PREMIUM, site: {} };

export const isPremium = (profile = state.profile) => !!(profile && (profile.premium || profile.role === "admin"));
export const isEarlyAccess = (id) => !!(GAMES[id] && GAMES[id].earlyUntil && Date.now() < Date.parse(GAMES[id].earlyUntil));
export const isPremiumGame = (id) => state.premiumGames.includes(id) || isEarlyAccess(id);
export const isLockedGame = (id, profile = state.profile) => isPremiumGame(id) && !isPremium(profile);
export const isBanned = (profile = state.profile) => !!(profile && profile.banned);

const settingsLoaded = Promise.all([
    getDoc(doc(db, "settings", "games")).then((snap) => {
        if (snap.exists() && Array.isArray(snap.data().premium)) state.premiumGames = snap.data().premium;
    }),
    getDoc(doc(db, "settings", "site")).then((snap) => { if (snap.exists()) state.site = snap.data(); })
]).catch((e) => console.warn("[GameHub] settings load failed", e));

const listeners = new Set();
let resolveReady;
export const ready = new Promise((r) => (resolveReady = r));
let first = true;

onAuthStateChanged(auth, async (user) => {
    state.user = user;
    state.profile = null;
    if (user) {
        try {
            const snap = await getDoc(doc(db, "users", user.uid));
            if (snap.exists()) state.profile = snap.data();
        } catch (e) { console.warn("[GameHub] profile load failed", e); }
    }
    await settingsLoaded;
    if (first) { first = false; resolveReady(state); }
    listeners.forEach((cb) => cb(state));
});

export function onAccount(cb) {
    listeners.add(cb);
    ready.then(() => cb(state));
    return () => listeners.delete(cb);
}

const meRef = () => doc(db, "users", state.user.uid);
async function updateMe(fields) {
    await updateDoc(meRef(), fields);
    // keep the local copy in step (handles "a.b" dotted keys too)
    for (const [k, v] of Object.entries(fields)) {
        const parts = k.split(".");
        let o = state.profile;
        for (let i = 0; i < parts.length - 1; i++) o = o[parts[i]] = o[parts[i]] || {};
        o[parts[parts.length - 1]] = v;
    }
}

// ---------- Admin helpers ----------
export async function savePremiumGames(list) {
    await setDoc(doc(db, "settings", "games"), { premium: list, updatedAt: serverTimestamp() }, { merge: true });
    state.premiumGames = list;
}
export async function saveSiteSettings(fields) {
    await setDoc(doc(db, "settings", "site"), { ...fields, updatedAt: serverTimestamp() }, { merge: true });
    Object.assign(state.site, fields);
}

// ---------- Ads: only for visitors who aren't premium ----------
// 1. In AdSense → Ads → By ad unit → Display ads, create one unit called "Game Hub banner".
// 2. Paste its data-ad-slot number below. Until then the ad boxes stay hidden.
const AD_CLIENT = "ca-pub-8671583156732584";
const AD_SLOTS = {
    banner: ""          // e.g. "1234567890"
};
// The hub's players are mostly kids, so ad requests are tagged for child treatment
// (Google then shows only non-personalised ads). 1 = child, 2 = teen, 0 = no tag.
const AD_AGE_TREATMENT = "1";

function loadAds() {
    if (document.querySelector('script[src*="adsbygoogle.js"]')) return;
    const s = document.createElement("script");
    s.async = true;
    s.crossOrigin = "anonymous";
    s.src = ADSENSE_SRC;
    document.head.appendChild(s);
}

function placeAds() {
    let spots = [...document.querySelectorAll("[data-ad]")];
    // Game pages without their own spot: add one under the game
    if (!spots.length && CURRENT_GAME) {
        const div = document.createElement("div");
        div.dataset.ad = "banner";
        document.body.appendChild(div);
        spots = [div];
    }
    for (const spot of spots) {
        const slot = AD_SLOTS[spot.dataset.ad];
        if (!slot) { spot.remove(); continue; }
        spot.className = "gh-ad";
        spot.innerHTML = `<div class="gh-ad-label">Advertisement</div>
            <ins class="adsbygoogle" style="display:block" data-ad-client="${AD_CLIENT}" data-ad-slot="${slot}"
                 data-ad-format="auto" data-full-width-responsive="true" data-tag-for-age-treatment="${AD_AGE_TREATMENT}"></ins>
            <a class="gh-ad-remove" href="/premium">★ Remove ads · ₪10 for life</a>`;
        try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch (e) {}
    }
    if (spots.length) {
        const st = document.createElement("style");
        st.textContent = `.gh-ad{direction:ltr;max-width:970px;margin:24px auto;padding:0 16px;text-align:center;font-family:Inter,system-ui,sans-serif}
          .gh-ad-label{font-size:11px;letter-spacing:.5px;text-transform:uppercase;color:#9aa0c8;margin-bottom:6px}
          .gh-ad-remove{display:inline-block;margin-top:6px;font-size:12px;font-weight:700;color:#ffc94d;text-decoration:none}`;
        document.head.appendChild(st);
    }
}

const domReady = new Promise((r) => (document.readyState === "loading" ? addEventListener("DOMContentLoaded", r) : r()));

ready.then(async () => {
    await domReady;
    if (isPremium()) document.querySelectorAll("[data-ad]").forEach((el) => el.remove());
    else { loadAds(); placeAds(); }
    showAnnouncement();
    if (isBanned()) toast("⛔ Your account has been suspended, so scores aren't being saved. Ask Noam if you think this is a mistake.", 8000);
});

// ---------- Announcement banner (set on the admin page) ----------
function showAnnouncement() {
    const a = state.site || {};
    if (!a.announcement || a.announcementOn === false) return;
    if (ls.get("gh_dismissed", "") === a.announcement) return;
    ensureStyles();
    const bar = document.createElement("div");
    bar.className = "gh-announce";
    bar.innerHTML = `<span>📢 ${esc(a.announcement)}</span>
        ${a.announcementLink ? `<a href="${esc(a.announcementLink)}">${esc(a.announcementLinkText || "Check it out →")}</a>` : ""}
        <button aria-label="Close">✕</button>`;
    bar.querySelector("button").onclick = () => { ls.set("gh_dismissed", a.announcement); bar.remove(); };
    document.body.prepend(bar);
}

// ---------- Saving scores & progress ----------
const gameRef = (uid, id) => doc(db, "users", uid, "games", id);

export async function saveScore(score, game = CURRENT_GAME) {
    await ready;
    score = Math.floor(Number(score));
    if (!game || !Number.isFinite(score) || score < 0) return { saved: false };
    markRecent(game);
    if (!state.user) { nudgeLogin(); return { saved: false }; }
    if (isBanned()) return { saved: false };
    try {
        const ref = gameRef(state.user.uid, game);
        const snap = await getDoc(ref);
        const oldBest = snap.exists() ? (snap.data().best ?? 0) : 0;
        const best = Math.max(oldBest, score);
        await setDoc(ref, { best, lastScore: score, plays: increment(1), lastPlayed: serverTimestamp() }, { merge: true });
        const msgs = [];
        if (score > oldBest && score > 0) msgs.push(`🏆 New personal best: ${score}!`);
        const daily = await checkDaily(game, score);
        if (daily) msgs.push(daily);
        const lb = await submitLeaderboard(game, score);
        if (lb) msgs.push(lb);
        if (msgs.length && CURRENT_GAME) toast(msgs.join("<br>"), 4500);
        social().then((m) => { m.noteScore(game, score); m.checkAchievements(); }).catch(() => {});
        return { saved: true, best, newBest: score > oldBest };
    } catch (e) {
        console.warn("[GameHub] save failed", e);
        return { saved: false };
    }
}

export async function recordPlay(game = CURRENT_GAME) {
    await ready;
    if (!game) return { saved: false };
    markRecent(game);
    if (!state.user || isBanned()) return { saved: false };
    try {
        await setDoc(gameRef(state.user.uid, game), { plays: increment(1), lastPlayed: serverTimestamp() }, { merge: true });
        social().then((m) => { m.noteScore(game, null); m.checkAchievements(); }).catch(() => {});
        return { saved: true };
    } catch (e) { return { saved: false }; }
}

export async function saveData(data, game = CURRENT_GAME) {
    await ready;
    if (!game || !state.user || isBanned()) return { saved: false };
    await setDoc(gameRef(state.user.uid, game), { data, lastPlayed: serverTimestamp() }, { merge: true });
    return { saved: true };
}

export async function loadData(game = CURRENT_GAME) {
    await ready;
    if (!game || !state.user) return null;
    const snap = await getDoc(gameRef(state.user.uid, game));
    return snap.exists() ? (snap.data().data ?? null) : null;
}

export async function getMyGames(uid = state.user?.uid) {
    if (!uid) return {};
    const snap = await getDocs(collection(db, "users", uid, "games"));
    const out = {};
    snap.forEach((d) => (out[d.id] = d.data()));
    return out;
}

// ---------- Daily challenge ----------
export const todaysChallenge = () => dailyChallenge(new Date(), state.premiumGames);

async function checkDaily(game, score) {
    const c = todaysChallenge();
    if (game !== c.game || score < c.target) return null;
    if (state.profile?.daily?.[c.day]) return null;
    try {
        await updateMe({ [`daily.${c.day}`]: true });
        return `📅 Daily challenge complete! +40 XP`;
    } catch (e) { return null; }
}

// ---------- Leaderboards ----------
const lbAll = (game, uid) => doc(db, "leaderboards", game, "all", uid);
const lbWeek = (game, uid, wk = weekKey()) => doc(db, "leaderboards", game, "weeks", wk, "scores", uid);
let warnedName = false;

async function submitLeaderboard(game, score) {
    if (!TARGETS[game] || score <= 0) return null;
    const p = state.profile;
    if (!p) return null;
    if (nameProblem(p.name)) {
        if (!warnedName) { warnedName = true; return `Change your name on your <a href="/profile">profile</a> to appear on the leaderboard`; }
        return null;
    }
    const entry = { name: p.name, avatar: p.avatar || "", best: score, premium: isPremium(p), frame: p.frame || "none", updatedAt: serverTimestamp() };
    const [a, w] = await Promise.all([getDoc(lbAll(game, state.user.uid)), getDoc(lbWeek(game, state.user.uid))]);
    const writes = [];
    if (!a.exists() || score > (a.data().best || 0)) writes.push(setDoc(lbAll(game, state.user.uid), entry));
    if (!w.exists() || score > (w.data().best || 0)) writes.push(setDoc(lbWeek(game, state.user.uid), entry));
    if (!writes.length) return null;
    try {
        await Promise.all(writes);
        const top = await getLeaderboard(game, "week", 10);
        const rank = top.findIndex((r) => r.uid === state.user.uid);
        return rank >= 0 ? `📊 You're #${rank + 1} on this week's leaderboard!` : null;
    } catch (e) { console.warn("[GameHub] leaderboard save failed", e); return null; }
}

export async function getLeaderboard(game, scope = "all", n = 10, wk = weekKey()) {
    const col = scope === "week"
        ? collection(db, "leaderboards", game, "weeks", wk, "scores")
        : collection(db, "leaderboards", game, "all");
    const snap = await getDocs(query(col, orderBy("best", "desc"), limit(n)));
    return snap.docs.map((d) => ({ uid: d.id, ...d.data() }));
}

// ---------- Favorites & recently played ----------
export function getFavorites() {
    return state.profile?.favorites || ls.get("gh_favs", []);
}
// favorites picked before logging in get added to the account
ready.then(async () => {
    const local = ls.get("gh_favs", []);
    if (!state.user || !state.profile || !local.length) return;
    const missing = local.filter((id) => !(state.profile.favorites || []).includes(id));
    if (!missing.length) return;
    try { await updateDoc(meRef(), { favorites: arrayUnion(...missing) }); state.profile.favorites = [...new Set([...(state.profile.favorites || []), ...missing])]; } catch (e) {}
});
export async function toggleFavorite(id) {
    const favs = new Set(getFavorites());
    const on = !favs.has(id);
    on ? favs.add(id) : favs.delete(id);
    ls.set("gh_favs", [...favs]);
    if (state.user && state.profile) {
        try { await updateDoc(meRef(), { favorites: on ? arrayUnion(id) : arrayRemove(id) }); state.profile.favorites = [...favs]; } catch (e) {}
    }
    return on;
}
export function getRecent() {
    // this device's list first, then games played on other devices (saved on the account)
    const local = ls.get("gh_recent", []), acc = state.profile?.recent || [];
    return [...new Set([...local, ...acc])].filter((id) => GAMES[id]).slice(0, 12);
}
let recentSaved = false;
function markRecent(game) {
    const r = ls.get("gh_recent", []).filter((x) => x !== game);
    r.unshift(game);
    ls.set("gh_recent", r.slice(0, 12));
    // keep a copy on the account (once per page) so "Continue playing" follows you to other devices
    if (state.user && state.profile && !isBanned() && !recentSaved) {
        recentSaved = true;
        const acc = [game, ...(state.profile.recent || []).filter((x) => x !== game)].slice(0, 12);
        updateMe({ recent: acc }).catch(() => {});
    }
}
if (CURRENT_GAME) { ls.set("gh_recent", [CURRENT_GAME, ...ls.get("gh_recent", []).filter((x) => x !== CURRENT_GAME)].slice(0, 12)); ready.then(() => markRecent(CURRENT_GAME)); }
export function clearRecent() {
    ls.set("gh_recent", []);
    if (state.user && state.profile) updateMe({ recent: [] }).catch(() => {});
}

// ---------- Avatar ----------
export async function setAvatar(emoji) {
    if (!state.user || !state.profile) return false;
    await updateMe({ avatar: emoji });
    social().then((m) => m.checkAchievements()).catch(() => {});
    return true;
}
export async function setPrivate(on) {
    if (!state.user || !state.profile) return false;
    await updateMe({ private: !!on });
    social().then((m) => m.syncPlayer()).catch(() => {});
    return true;
}
const social = () => import("./social.js");
export { social };

// ---------- Skins & frames (Premium) ----------
export function skin(game) {
    const s = SKINS[game];
    if (!s) return null;
    const pick = isPremium() ? (state.profile?.skins?.[game] || "classic") : "classic";
    return (s.options[pick] || s.options.classic)[1];
}
export async function setSkin(game, key) {
    if (!isPremium() || !SKINS[game]?.options[key]) return false;
    await updateMe({ [`skins.${game}`]: key });
    return true;
}
export async function setFrame(key) {
    if (!FRAMES[key] || (FRAMES[key].premium && !isPremium())) return false;
    await updateMe({ frame: key });
    return true;
}
export function frameCss(profile = state.profile) {
    const f = FRAMES[profile?.frame || "none"];
    return f && (!f.premium || isPremium(profile)) ? f.css : "";
}

// ---------- Redeem codes ----------
export function makeCode() {
    const abc = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no 0/O/1/I so codes are easy to read
    let s = "";
    const r = crypto.getRandomValues(new Uint32Array(8));
    for (let i = 0; i < 8; i++) s += abc[r[i] % abc.length];
    return `${s.slice(0, 4)}-${s.slice(4)}`;
}
export async function redeemCode(raw) {
    await ready;
    if (!state.user) throw new Error("Log in first.");
    if (isPremium()) throw new Error("You already have Premium!");
    const code = String(raw || "").toUpperCase().replace(/[^A-Z0-9]/g, "").replace(/^(.{4})(.{4})$/, "$1-$2");
    if (!/^[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(code)) throw new Error("Codes look like ABCD-1234.");
    const b = writeBatch(db);
    b.update(doc(db, "codes", code), { usedBy: state.user.uid, usedByName: state.profile?.name || "", usedAt: serverTimestamp() });
    b.update(meRef(), { premium: true, premiumSince: serverTimestamp(), redeemedCode: code });
    try {
        await b.commit();
    } catch (e) {
        throw new Error("That code doesn't work. Check it, or it may have been used already.");
    }
    state.profile.premium = true;
    state.profile.premiumSince = { toDate: () => new Date() };
    return true;
}

// ---------- Small UI for game pages ----------
function ensureStyles() {
    if (document.getElementById("gh-styles")) return;
    const st = document.createElement("style");
    st.id = "gh-styles";
    st.textContent = `
      .gh-toast{direction:ltr;position:fixed;bottom:20px;left:50%;transform:translateX(-50%) translateY(20px);opacity:0;
        background:#171b36;color:#eef0ff;border:1px solid #7c5cff;border-radius:12px;padding:12px 18px;line-height:1.5;
        font:600 14px Inter,system-ui,sans-serif;box-shadow:0 12px 30px rgba(0,0,0,.5);z-index:99999;
        transition:opacity .25s,transform .25s;pointer-events:none;max-width:90vw;text-align:center}
      .gh-toast.show{opacity:1;transform:translateX(-50%) translateY(0)}
      .gh-toast a{color:#2ee6c9;pointer-events:auto}
      .gh-lock{direction:ltr;position:fixed;inset:0;z-index:99998;display:grid;place-items:center;padding:16px;
        background:rgba(11,13,26,.97);backdrop-filter:blur(8px);font-family:Inter,system-ui,sans-serif;color:#eef0ff}
      .gh-lock .box{max-width:420px;text-align:center;background:#171b36;border:1px solid #2a3060;border-radius:20px;padding:32px 26px}
      .gh-lock .star{font-size:44px;color:#ffc94d}
      .gh-lock h2{margin:10px 0 8px;font-size:22px}
      .gh-lock p{color:#9aa0c8;margin:0 0 22px;line-height:1.5}
      .gh-lock a{display:inline-block;margin:4px;padding:11px 20px;border-radius:10px;text-decoration:none;font-weight:700}
      .gh-lock .primary{background:#7c5cff;color:#fff}.gh-lock .ghost{border:1px solid #2a3060;color:#eef0ff}
      .gh-announce{direction:ltr;position:relative;z-index:100;display:flex;gap:12px;align-items:center;justify-content:center;flex-wrap:wrap;
        padding:10px 44px;background:linear-gradient(90deg,#7c5cff,#2ee6c9);color:#0b0d1a;font:700 14px Inter,system-ui,sans-serif;text-align:center}
      .gh-announce a{color:#0b0d1a;text-decoration:underline}
      .gh-announce button{position:absolute;right:10px;top:50%;transform:translateY(-50%);border:0;background:#0b0d1a22;color:#0b0d1a;
        width:26px;height:26px;border-radius:50%;cursor:pointer;font-weight:800}`;
    document.head.appendChild(st);
}

export function toast(html, ms = 3200) {
    ensureStyles();
    let t = document.querySelector(".gh-toast");
    if (!t) { t = document.createElement("div"); t.className = "gh-toast"; document.body.appendChild(t); }
    t.innerHTML = html;
    requestAnimationFrame(() => t.classList.add("show"));
    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => t.classList.remove("show"), ms);
}

let nudged = false;
function nudgeLogin() {
    if (nudged || !CURRENT_GAME) return;
    nudged = true;
    const next = encodeURIComponent(GAMES[CURRENT_GAME]?.path || "/");
    toast(`<a href="/login?next=${next}">Log in</a> to save your scores and get on the leaderboard`, 5000);
}

function showLock() {
    ensureStyles();
    const loggedIn = !!state.user;
    const early = isEarlyAccess(CURRENT_GAME) && !state.premiumGames.includes(CURRENT_GAME);
    const next = encodeURIComponent(GAMES[CURRENT_GAME]?.path || "/");
    const freeDate = early ? new Date(GAMES[CURRENT_GAME].earlyUntil).toLocaleDateString(undefined, { day: "numeric", month: "long" }) : "";
    const el = document.createElement("div");
    el.className = "gh-lock";
    el.innerHTML = `<div class="box">
        <div class="star">★</div>
        <h2>${esc(GAMES[CURRENT_GAME]?.name || "This game")} is ${early ? "in early access" : "Premium"}</h2>
        <p>${early ? `Premium players get to play it first. It opens for everyone on <b>${freeDate}</b>.`
              : loggedIn ? "Your account is on the free plan. Premium unlocks every ★ game and removes all ads."
              : "Premium is ₪10, once, for life. Already have it? Log in."}</p>
        <a class="primary" href="/premium">★ Get Premium · ₪10</a>
        ${loggedIn ? "" : `<a class="ghost" href="/login?next=${next}">Log in</a>`}
        <a class="ghost" href="/">Back to games</a>
      </div>`;
    document.body.appendChild(el);
    // stop the game underneath from taking keys
    addEventListener("keydown", (e) => e.stopImmediatePropagation(), true);
}

if (CURRENT_GAME) {
    ready.then(() => {
        if (isLockedGame(CURRENT_GAME)) showLock();
        else if (PLAY_ONLY.includes(CURRENT_GAME)) recordPlay();
        showGameExtras().finally(() => social().then((m) => { m.mountGamePage({ getFavorites, toggleFavorite }); m.checkAchievements(); }).catch((e) => console.warn("[GameHub] social failed", e)));
    });
}

// Daily challenge note + mini leaderboard under each game
async function showGameExtras() {
    await domReady;
    const info = document.querySelector(".gh-info");
    if (!info || !TARGETS[CURRENT_GAME]) return;
    if (info.querySelector(".gh-lb")) return;
    const c = todaysChallenge();
    if (c.game === CURRENT_GAME) {
        const done = state.profile?.daily?.[c.day];
        const sec = document.createElement("section");
        sec.style.borderColor = "#ffc94d";
        sec.innerHTML = `<h3 style="color:#ffc94d">📅 Today's daily challenge</h3>
            <p>${done ? "✅ You finished today's challenge. Come back tomorrow for a new one!"
                      : `Score <b>${c.target.toLocaleString()} ${c.unit}</b> in this game today to complete it and earn 40 XP.${state.user ? "" : ' <a href="/login" style="color:#2ee6c9">Log in</a> to take part.'}`}</p>`;
        info.prepend(sec);
    }
    const sec = document.createElement("section");
    sec.innerHTML = `<h3>🏆 Top 5 this week</h3><div class="gh-lb">Loading…</div>
        <p style="margin-top:10px"><a href="/leaderboard?game=${CURRENT_GAME}" style="color:#2ee6c9;font-weight:700;text-decoration:none">See the full leaderboard →</a></p>`;
    const about = info.querySelector("section h2")?.closest("section");
    about ? about.after(sec) : info.prepend(sec);
    try {
        const rows = await getLeaderboard(CURRENT_GAME, "week", 5);
        sec.querySelector(".gh-lb").innerHTML = rows.length
            ? `<table>${rows.map((r, i) => `<tr${r.uid === state.user?.uid ? ' style="background:#7c5cff22"' : ""}><td>${["🥇", "🥈", "🥉", "4", "5"][i]}</td>
                <td style="${r.premium ? "color:#ffc94d;" : ""}font-weight:700"><a class="gh-lbname" href="/player?u=${encodeURIComponent(r.uid)}" style="color:inherit;text-decoration:none">${esc(r.name)}${r.premium ? " ★" : ""}</a></td>
                <td style="text-align:right;color:#2ee6c9;font-weight:800">${Number(r.best).toLocaleString()}</td></tr>`).join("")}</table>`
            : "No scores yet this week. Be the first!";
    } catch (e) { sec.querySelector(".gh-lb").textContent = "Leaderboard unavailable right now."; }
}

// ---------- Cookie notice ----------
// Visitors in Europe/UK/Switzerland get Google's own consent message (set up in AdSense), so this
// notice skips them. Everyone else sees a small bar once: "Accept" or "Only necessary".
// The choice is saved as gh_cookies = "all" | "necessary" and passed to Google with Consent Mode.
const COOKIE_TXT = LANG === "he"
    ? { t: "🍪 האתר משתמש בעוגיות כדי לשמור את ההתחברות והשיאים שלכם, לספור ביקורים (Google Analytics) ולהציג פרסומות.", ok: "מאשר/ת", no: "רק הכרחיות", more: "פרטים", set: "🍪 הגדרות עוגיות" }
    : { t: "🍪 We use cookies to keep you logged in and save your scores, count visits (Google Analytics) and show ads.", ok: "Accept", no: "Only necessary", more: "Learn more", set: "🍪 Cookie settings" };
export function cookieChoice() { try { return localStorage.getItem("gh_cookies"); } catch (e) { return null; } }
export function setCookieChoice(v) {
    try { localStorage.setItem("gh_cookies", v); } catch (e) {}
    const g = v === "all" ? "granted" : "denied";
    if (typeof window.gtag === "function") window.gtag("consent", "update", { analytics_storage: g, ad_storage: g, ad_user_data: "denied", ad_personalization: "denied" });
}
function gdprApplies() {
    // Google's consent tool answers this for visitors in Europe (only once AdSense loads it)
    return new Promise((res) => {
        let tries = 0;
        const check = () => {
            if (typeof window.__tcfapi === "function") {
                try { window.__tcfapi("getTCData", 2, (d, ok) => res(!!(ok && d && d.gdprApplies))); } catch (e) { res(false); }
                return;
            }
            if (++tries > 12) return res(false);
            setTimeout(check, 250);
        };
        check();
    });
}
export function showCookieBar(force = false) {
    if (document.querySelector(".gh-cookie")) return;
    ensureStyles();
    const st = document.createElement("style");
    st.textContent = `.gh-cookie{position:fixed;left:50%;bottom:14px;transform:translateX(-50%);z-index:99997;width:min(760px,calc(100% - 24px));
        display:flex;gap:12px;align-items:center;flex-wrap:wrap;background:#171b36;color:#eef0ff;border:1px solid #2a3060;border-radius:16px;
        padding:12px 14px 12px 18px;box-shadow:0 14px 40px rgba(0,0,0,.5);font:600 14px Inter,Rubik,system-ui,sans-serif;line-height:1.45;direction:${LANG === "he" ? "rtl" : "ltr"}}
      .gh-cookie p{flex:1;min-width:220px;margin:0}.gh-cookie a{color:#2ee6c9}
      .gh-cookie .b{display:flex;gap:8px;margin-inline-start:auto}
      .gh-cookie button{border:1px solid #2a3060;background:#12152b;color:#eef0ff;border-radius:10px;padding:9px 14px;font:700 14px Inter,Rubik,system-ui,sans-serif;cursor:pointer;white-space:nowrap}
      .gh-cookie button.ok{background:#7c5cff;border-color:#7c5cff;color:#fff}`;
    document.head.appendChild(st);
    const bar = document.createElement("div");
    bar.className = "gh-cookie"; bar.setAttribute("role", "dialog"); bar.setAttribute("aria-label", "Cookies"); bar.dataset.noi18n = "";
    bar.innerHTML = `<p>${COOKIE_TXT.t} <a href="/privacy">${COOKIE_TXT.more}</a></p><div class="b"><button class="no">${COOKIE_TXT.no}</button><button class="ok">${COOKIE_TXT.ok}</button></div>`;
    bar.querySelector(".ok").onclick = () => { setCookieChoice("all"); bar.remove(); };
    bar.querySelector(".no").onclick = () => { setCookieChoice("necessary"); bar.remove(); };
    document.body.appendChild(bar);
}
domReady.then(async () => {
    if (location.pathname.startsWith("/admin")) return;
    // "Cookie settings" link in page footers and on the privacy page
    document.querySelectorAll("footer, [data-cookie-settings]").forEach((f) => {
        const b = document.createElement("button");
        b.type = "button"; b.textContent = COOKIE_TXT.set; b.dataset.noi18n = "";
        b.style.cssText = "background:none;border:0;color:inherit;font:inherit;text-decoration:underline;cursor:pointer;padding:0;margin:8px 0 0;opacity:.85";
        b.onclick = () => showCookieBar(true);
        f.appendChild(b);
    });
    if (cookieChoice()) return;
    if (await gdprApplies()) return;      // Google's own message handles Europe
    setTimeout(() => showCookieBar(), 600);
});

// ---------- Install as an app (PWA) ----------
if ("serviceWorker" in navigator && location.protocol === "https:") {
    addEventListener("load", () => navigator.serviceWorker.register("/sw.js").catch(() => {}));
}

// For plain (non-module) game scripts
window.GameHub = { saveScore, recordPlay, saveData, loadData, ready, state, skin, isPremium: () => isPremium() };
