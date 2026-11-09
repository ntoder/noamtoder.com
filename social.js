// social.js — ratings, comments, public player pages and achievement pop-ups.
// Loaded by hub.js on game pages, and imported by the homepage, profile, player and admin pages.

import { db } from "./firebase-config.js";
import {
    doc, getDoc, setDoc, getDocs, collection, collectionGroup, query, orderBy, limit, startAfter, where,
    writeBatch, increment, serverTimestamp, deleteDoc, getAggregateFromServer, count, average
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { state, ready, toast, GAMES, CURRENT_GAME, LANG, isPremium, isBanned, getMyGames } from "./hub.js";
import { xpFor, levelFor, achievementsFor, textProblem, TARGETS } from "./progress.js";

const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const ls = {
    get(k, d) { try { const v = JSON.parse(localStorage.getItem(k)); return v ?? d; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
};
const he = LANG === "he";
const T = (en, hw) => (he ? hw : en);

export function avatarOf(p) { return (p && p.avatar) || ""; }
export function avatarHtml(p, size = 36) {
    const a = avatarOf(p), name = (p && p.name) || "?";
    return `<span class="gh-av" style="width:${size}px;height:${size}px;font-size:${Math.round(size * (a ? 0.6 : 0.45))}px">${a ? esc(a) : esc(name.charAt(0).toUpperCase())}</span>`;
}
export function timeAgo(ts) {
    const d = ts?.toDate ? ts.toDate() : ts ? new Date(ts) : null;
    if (!d) return T("just now", "עכשיו");
    const s = Math.round((d - Date.now()) / 1000), rtf = new Intl.RelativeTimeFormat(he ? "he" : "en", { numeric: "auto" });
    for (const [u, n] of [["year", 31536000], ["month", 2592000], ["week", 604800], ["day", 86400], ["hour", 3600], ["minute", 60]])
        if (Math.abs(s) >= n) return rtf.format(Math.round(s / n), u);
    return T("just now", "עכשיו");
}

// ---------- My stats (rated / comments / online) ----------
export async function bumpStat(key, n = 1) {
    if (!state.user || !state.profile) return;
    try {
        const b = writeBatch(db);
        b.update(doc(db, "users", state.user.uid), { [`stats.${key}`]: increment(n) });
        await b.commit();
        state.profile.stats = state.profile.stats || {};
        state.profile.stats[key] = (state.profile.stats[key] || 0) + n;
        await checkAchievements();
    } catch (e) { console.warn("[GameHub] stat failed", e); }
}

// ---------- Achievements: pop-up when a new one unlocks ----------
let myGames = null;
export async function loadMyGames(force = false) {
    if (!state.user) return {};
    if (!myGames || force) myGames = await getMyGames(state.user.uid).catch(() => ({}));
    return myGames;
}
export function noteScore(game, score) {
    if (!myGames) return;
    const g = myGames[game] = myGames[game] || {};
    g.plays = (g.plays || 0) + 1;
    if (score != null) g.best = Math.max(g.best || 0, score);
}
let lastDone = null;
export async function checkAchievements() {
    if (!state.user || !state.profile) return;
    const games = await loadMyGames();
    const done = achievementsFor(games, state.profile).filter((a) => a.done);
    const ids = new Set(done.map((a) => a.id));
    const seen = new Set(state.profile.achSeen || ls.get("gh_ach_" + state.user.uid, null) || (lastDone ? [...lastDone] : [...ids]));
    const fresh = done.filter((a) => !seen.has(a.id));
    lastDone = ids;
    ls.set("gh_ach_" + state.user.uid, [...ids]);
    if (fresh.length) {
        const a = fresh[0];
        showAchievement(a, fresh.length - 1);
        try { const b = writeBatch(db); b.update(doc(db, "users", state.user.uid), { achSeen: [...ids] }); await b.commit(); state.profile.achSeen = [...ids]; } catch (e) {}
    }
    syncPlayer(games);
}
const achQueue = [];
let achBusy = false;
function showAchievement(a, more) {
    achQueue.push([a, more]);
    if (!achBusy) nextAchievement();
}
function nextAchievement() {
    const n = achQueue.shift();
    if (!n) { achBusy = false; return; }
    achBusy = true;
    const [a, more] = n;
    ensureStyles();
    const el = document.createElement("div");
    el.className = "gh-ach";
    el.innerHTML = `<div class="ic">${a.icon}</div><div><small>${T("ACHIEVEMENT UNLOCKED", "הישג חדש!")}</small><b>${esc(a.name)}</b><span>${esc(a.desc)}</span>
        ${more > 0 ? `<em>${T(`+${more} more`, `ועוד ${more}`)}</em>` : ""}</div>`;
    document.body.appendChild(el);
    try { const ac = new AudioContext(); [784, 988, 1319].forEach((f, i) => { const o = ac.createOscillator(), g = ac.createGain(); o.type = "triangle"; o.frequency.value = f; g.gain.setValueAtTime(0.06, ac.currentTime + i * 0.1); g.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + i * 0.1 + 0.3); o.connect(g).connect(ac.destination); o.start(ac.currentTime + i * 0.1); o.stop(ac.currentTime + i * 0.1 + 0.3); }); } catch (e) {}
    requestAnimationFrame(() => el.classList.add("show"));
    setTimeout(() => { el.classList.remove("show"); setTimeout(() => { el.remove(); nextAchievement(); }, 450); }, 3800);
}

// ---------- Public player page data: players/{uid} ----------
// Only safe things: display name, avatar, level, badges and best scores. Never the email.
let lastSync = "";
export async function syncPlayer(games) {
    const p = state.profile, u = state.user;
    if (!u || !p || isBanned()) return;
    games = games || await loadMyGames();
    const xp = xpFor(games, p), lv = levelFor(xp).level;
    const ach = achievementsFor(games, p).filter((a) => a.done).map((a) => a.id);
    const top = Object.entries(games).filter(([id, g]) => GAMES[id] && g.plays)
        .sort((a, b) => (b[1].plays || 0) - (a[1].plays || 0)).slice(0, 8)
        .map(([id, g]) => ({ id, best: Math.floor(g.best || 0), plays: g.plays || 0 }));
    const data = p.private
        ? { name: p.name, avatar: p.avatar || "", private: true, premium: isPremium(p), frame: p.frame || "none" }
        : { name: p.name, avatar: p.avatar || "", premium: isPremium(p), frame: p.frame || "none", level: lv, xp,
            ach, top, played: Object.values(games).filter((g) => g.plays).length,
            onlineWins: (p.stats && p.stats.onlineWins) || 0, since: p.createdAt || null };
    const key = JSON.stringify(data);
    if (key === lastSync) return;
    lastSync = key;
    try { await setDoc(doc(db, "players", u.uid), { ...data, updatedAt: serverTimestamp() }); }
    catch (e) { console.warn("[GameHub] player sync failed", e); }
}
export async function getPlayer(uid) {
    const s = await getDoc(doc(db, "players", uid));
    return s.exists() ? s.data() : null;
}

// ---------- Ratings ----------
const voteRef = (game, uid) => doc(db, "ratings", game, "votes", uid);
export async function getRating(game) {
    const snap = await getAggregateFromServer(collection(db, "ratings", game, "votes"), { n: count(), avg: average("stars") });
    const d = snap.data();
    return { n: d.n || 0, avg: d.avg || 0 };
}
export async function myRating(game) {
    if (!state.user) return 0;
    const s = await getDoc(voteRef(game, state.user.uid)).catch(() => null);
    return s && s.exists() ? s.data().stars : 0;
}
export async function rate(game, stars) {
    if (!state.user || isBanned()) return false;
    const had = await myRating(game);
    await setDoc(voteRef(game, state.user.uid), { stars, updatedAt: serverTimestamp() });
    if (!had) await bumpStat("rated");
    return true;
}

// ---------- Comments ----------
const postsCol = (game) => collection(db, "comments", game, "posts");
export async function getComments(game, n = 15, after = null) {
    const q = after ? query(postsCol(game), orderBy("createdAt", "desc"), startAfter(after), limit(n)) : query(postsCol(game), orderBy("createdAt", "desc"), limit(n));
    const snap = await getDocs(q);
    return { rows: snap.docs.map((d) => ({ id: d.id, ...d.data() })), last: snap.docs[snap.docs.length - 1] || null, more: snap.docs.length === n };
}
export async function postComment(game, text) {
    const p = state.profile;
    if (!state.user || !p) throw new Error(T("Log in to comment.", "צריך להתחבר כדי להגיב."));
    if (isBanned()) throw new Error(T("Your account is suspended.", "החשבון שלך מושעה."));
    if (state.site.commentsOff) throw new Error(T("Comments are turned off right now.", "התגובות כבויות כרגע."));
    const problem = textProblem(text);
    if (problem) throw new Error(problem);
    const last = p.lastCommentAt?.toMillis?.() || 0;
    if (Date.now() - last < 30000) throw new Error(T("Please wait a little before commenting again.", "חכו קצת לפני שמגיבים שוב."));
    const ref = doc(postsCol(game));
    const b = writeBatch(db);
    b.set(ref, { uid: state.user.uid, name: p.name, avatar: p.avatar || "", premium: isPremium(p), text: text.trim(), createdAt: serverTimestamp() });
    b.update(doc(db, "users", state.user.uid), { lastCommentAt: serverTimestamp(), "stats.comments": increment(1) });
    await b.commit();
    p.lastCommentAt = { toMillis: () => Date.now() };
    p.stats = p.stats || {}; p.stats.comments = (p.stats.comments || 0) + 1;
    checkAchievements();
    return ref.id;
}
export async function deleteComment(game, id) { await deleteDoc(doc(db, "comments", game, "posts", id)); }
export async function reportComment(game, id) {
    if (!state.user) throw new Error(T("Log in to report.", "צריך להתחבר כדי לדווח."));
    await setDoc(doc(db, "reports", `${game}__${id}__${state.user.uid}`), { game, post: id, by: state.user.uid, createdAt: serverTimestamp() });
}
// admin: newest comments across every game, and the reported ones
export async function latestComments(n = 50) {
    const snap = await getDocs(query(collectionGroup(db, "posts"), orderBy("createdAt", "desc"), limit(n)));
    return snap.docs.map((d) => ({ id: d.id, game: d.ref.parent.parent.id, ...d.data() }));
}
export async function getReports() {
    const snap = await getDocs(query(collection(db, "reports"), orderBy("createdAt", "desc"), limit(100)));
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}
export async function clearReports(game, post) {
    const snap = await getDocs(query(collection(db, "reports"), where("post", "==", post)));
    await Promise.all(snap.docs.map((d) => deleteDoc(d.ref)));
}

// ---------- Homepage summary: stats/summary (ratings + player counts for every game) ----------
// Only the admin's browser rebuilds it (every few hours), so visitors read just one document.
export async function getSummary() {
    const cached = ls.get("gh_summary", null);
    if (cached && Date.now() - cached.at < 30 * 60 * 1000) return cached.games;
    try {
        const s = await getDoc(doc(db, "stats", "summary"));
        const games = s.exists() ? s.data().games || {} : {};
        ls.set("gh_summary", { at: Date.now(), games, built: s.exists() ? s.data().builtAt?.toMillis?.() || 0 : 0 });
        return games;
    } catch (e) { return cached ? cached.games : {}; }
}
export async function rebuildSummary() {
    const games = {};
    await Promise.all(Object.keys(GAMES).map(async (id) => {
        try {
            const [r, pl] = await Promise.all([
                getAggregateFromServer(collection(db, "ratings", id, "votes"), { n: count(), avg: average("stars") }),
                getAggregateFromServer(collection(db, "leaderboards", id, "all"), { n: count() })
            ]);
            games[id] = { avg: Math.round((r.data().avg || 0) * 10) / 10, n: r.data().n || 0, players: pl.data().n || 0 };
        } catch (e) { games[id] = { avg: 0, n: 0, players: 0 }; }
    }));
    await setDoc(doc(db, "stats", "summary"), { games, builtAt: serverTimestamp() });
    ls.set("gh_summary", { at: Date.now(), games, built: Date.now() });
    return games;
}
export async function maybeRebuildSummary() {
    if (state.profile?.role !== "admin") return;
    try {
        const s = await getDoc(doc(db, "stats", "summary"));
        const at = s.exists() ? s.data().builtAt?.toMillis?.() || 0 : 0;
        if (Date.now() - at > 3 * 3600 * 1000) await rebuildSummary();
    } catch (e) { console.warn("[GameHub] summary rebuild failed", e); }
}

// ---------- Styles ----------
function ensureStyles() {
    if (document.getElementById("gh-social-css")) return;
    const st = document.createElement("style");
    st.id = "gh-social-css";
    st.textContent = `
      .gh-av{display:inline-grid;place-items:center;flex:none;border-radius:50%;background:linear-gradient(135deg,#7c5cff,#2ee6c9);color:#fff;font-weight:800;line-height:1}
      .gh-ach{position:fixed;top:18px;left:50%;transform:translate(-50%,-140%);z-index:100000;display:flex;gap:14px;align-items:center;
        background:linear-gradient(135deg,#2a2160,#171b36);border:2px solid #ffc94d;border-radius:16px;padding:12px 20px 12px 14px;color:#eef0ff;
        font-family:Inter,Rubik,system-ui,sans-serif;box-shadow:0 14px 40px rgba(0,0,0,.55),0 0 30px #ffc94d44;transition:transform .45s cubic-bezier(.2,1.4,.4,1);max-width:92vw}
      .gh-ach.show{transform:translate(-50%,0)}
      .gh-ach .ic{font-size:34px;width:48px;height:48px;display:grid;place-items:center;background:#ffc94d22;border-radius:12px}
      .gh-ach small{display:block;color:#ffc94d;font-size:11px;font-weight:800;letter-spacing:1px}
      .gh-ach b{display:block;font-size:16px}.gh-ach span{color:#9aa0c8;font-size:13px}.gh-ach em{display:block;color:#2ee6c9;font-size:12px;font-style:normal;font-weight:700}
      .gh-fav{margin-inline-start:auto;border:1px solid #2a3060;background:#12152b;color:#eef0ff;border-radius:999px;padding:6px 12px;
        font:700 13px Inter,Rubik,system-ui,sans-serif;cursor:pointer;white-space:nowrap}
      .gh-fav:hover{border-color:#ff4d8d}.gh-fav.on{border-color:#ff4d8d;background:#ff4d8d22}
      .gh-rate{display:flex;align-items:center;gap:14px;flex-wrap:wrap}
      .gh-stars{display:inline-flex;direction:ltr}
      .gh-stars button{background:none;border:0;font-size:30px;line-height:1;cursor:pointer;color:#3a4070;padding:0 2px;transition:transform .15s,color .15s}
      .gh-stars button.on{color:#ffc94d}.gh-stars button:hover{transform:scale(1.2)}
      .gh-stars.ro button{cursor:default}.gh-stars.ro button:hover{transform:none}
      .gh-avg{color:#9aa0c8;font-weight:700;font-size:14px}.gh-avg b{color:#ffc94d;font-size:18px}
      .gh-cform{display:flex;flex-direction:column;gap:8px;margin:6px 0 16px}
      .gh-cform textarea{width:100%;min-height:70px;resize:vertical;background:#12152b;border:1px solid #2a3060;border-radius:12px;color:#eef0ff;
        padding:10px 12px;font:500 15px Inter,Rubik,system-ui,sans-serif;outline:none}
      .gh-cform textarea:focus{border-color:#7c5cff}
      .gh-cform .row{display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap;color:#9aa0c8;font-size:12px}
      .gh-btn{border:0;background:#7c5cff;color:#fff;border-radius:10px;padding:9px 18px;font:700 14px Inter,Rubik,system-ui,sans-serif;cursor:pointer}
      .gh-btn:disabled{opacity:.5;cursor:default}.gh-btn.ghost{background:#12152b;border:1px solid #2a3060;color:#eef0ff}
      .gh-err{color:#ff8db4;font-weight:700;font-size:13px}
      .gh-c{display:flex;gap:12px;padding:12px 0;border-top:1px solid #2a3060}
      .gh-c .body{flex:1;min-width:0}.gh-c .top{display:flex;gap:8px;align-items:baseline;flex-wrap:wrap}
      .gh-c .nm{font-weight:800;color:#eef0ff;text-decoration:none}.gh-c .nm.prem{color:#ffc94d}.gh-c .nm:hover{text-decoration:underline}
      .gh-c .when{color:#9aa0c8;font-size:12px}
      .gh-c .txt{margin-top:4px;color:#d9dcf5;line-height:1.5;white-space:pre-wrap;overflow-wrap:anywhere}
      .gh-c .acts{margin-inline-start:auto;display:flex;gap:4px}
      .gh-c .acts button{background:none;border:0;color:#9aa0c8;cursor:pointer;font-size:12px;font-weight:700;padding:2px 6px;border-radius:6px}
      .gh-c .acts button:hover{background:#12152b;color:#eef0ff}
      .gh-lbname{color:inherit;text-decoration:none}.gh-lbname:hover{text-decoration:underline}`;
    document.head.appendChild(st);
}
export { ensureStyles as socialStyles };

// ---------- Game page: favorite button, ratings and comments ----------
function starsHtml(v, ro = false) {
    return `<span class="gh-stars${ro ? " ro" : ""}">${[1, 2, 3, 4, 5].map((i) => `<button type="button" data-star="${i}" class="${i <= Math.round(v) ? "on" : ""}" aria-label="${i} ${T(i === 1 ? "star" : "stars", "כוכבים")}">★</button>`).join("")}</span>`;
}

export async function mountGamePage(hub) {
    const game = CURRENT_GAME;
    if (!game) return;
    ensureStyles();
    await ready;

    // ❤️ favorite button in the top bar
    const bar = document.querySelector(".gbar");
    if (bar && !bar.querySelector(".gh-fav")) {
        const b = document.createElement("button");
        b.className = "gh-fav";
        const paint = () => { const on = hub.getFavorites().includes(game); b.classList.toggle("on", on); b.textContent = on ? T("❤️ Favorite", "❤️ מועדף") : T("🤍 Favorite", "🤍 למועדפים"); };
        paint();
        b.onclick = async () => { const on = await hub.toggleFavorite(game); paint(); toast(on ? T("❤️ Added to your favorites", "❤️ נוסף למועדפים") : T("Removed from favorites", "הוסר מהמועדפים"), 1800); if (on) checkAchievements(); };
        const stats = bar.querySelector(".stats");
        stats ? bar.insertBefore(b, stats) : bar.appendChild(b);
    }

    const info = document.querySelector(".gh-info");
    if (!info) return;
    const sec = document.createElement("section");
    sec.className = "gh-social";
    sec.innerHTML = `<h3>${T("⭐ Rate this game", "⭐ דרגו את המשחק")}</h3>
        <div class="gh-rate"><span class="mine">${starsHtml(0)}</span><span class="gh-avg">…</span></div>
        <p class="gh-rmsg" style="margin-top:6px;color:#9aa0c8;font-size:13px"></p>
        <h3 style="margin-top:22px">${T("💬 Comments", "💬 תגובות")}</h3>
        <div class="gh-cbox"></div>
        <div class="gh-clist"><p style="color:#9aa0c8">${T("Loading…", "טוען…")}</p></div>
        <button class="gh-btn ghost gh-cmore" style="display:none;margin-top:8px">${T("Show more comments", "עוד תגובות")}</button>`;
    sec.dataset.noi18n = "";
    const lb = [...info.querySelectorAll("section")].find((s) => s.querySelector(".gh-lb"));
    const about = info.querySelector("section h2")?.closest("section");
    (lb || about) ? (lb || about).after(sec) : info.prepend(sec);

    // ratings
    const avgEl = sec.querySelector(".gh-avg"), msg = sec.querySelector(".gh-rmsg"), mine = sec.querySelector(".mine");
    async function showAvg() {
        try {
            const r = await getRating(game);
            avgEl.innerHTML = r.n ? `<b>${r.avg.toFixed(1)}</b> / 5 · ${r.n} ${T(r.n === 1 ? "rating" : "ratings", r.n === 1 ? "דירוג" : "דירוגים")}` : T("No ratings yet. Be the first!", "עדיין אין דירוגים. היו הראשונים!");
        } catch (e) { avgEl.textContent = ""; }
    }
    let my = await myRating(game);
    const paintMine = (v) => mine.querySelectorAll("button").forEach((b) => b.classList.toggle("on", +b.dataset.star <= v));
    paintMine(my);
    msg.textContent = state.user ? (my ? T("Thanks for rating! You can change it any time.", "תודה על הדירוג! אפשר לשנות מתי שרוצים.") : T("Tap a star to rate.", "לחצו על כוכב כדי לדרג.")) : "";
    if (!state.user) msg.innerHTML = `<a href="/login?next=${encodeURIComponent(location.pathname)}" style="color:#2ee6c9">${T("Log in", "התחברו")}</a> ${T("to rate this game.", "כדי לדרג את המשחק.")}`;
    mine.addEventListener("mouseover", (e) => { const b = e.target.closest("[data-star]"); if (b && state.user) paintMine(+b.dataset.star); });
    mine.addEventListener("mouseleave", () => paintMine(my));
    mine.addEventListener("click", async (e) => {
        const b = e.target.closest("[data-star]"); if (!b) return;
        if (!state.user) { toast(`<a href="/login?next=${encodeURIComponent(location.pathname)}">${T("Log in", "התחברו")}</a> ${T("to rate games", "כדי לדרג משחקים")}`); return; }
        try { my = +b.dataset.star; paintMine(my); await rate(game, my); msg.textContent = T("Thanks for rating! You can change it any time.", "תודה על הדירוג! אפשר לשנות מתי שרוצים."); showAvg(); }
        catch (err) { msg.textContent = T("Couldn't save your rating.", "לא הצלחנו לשמור את הדירוג."); }
    });
    showAvg();

    // comments
    const box = sec.querySelector(".gh-cbox"), list = sec.querySelector(".gh-clist"), more = sec.querySelector(".gh-cmore");
    const isAdmin = state.profile?.role === "admin";
    if (state.site.commentsOff) box.innerHTML = `<p style="color:#9aa0c8">${T("Comments are turned off right now.", "התגובות כבויות כרגע.")}</p>`;
    else if (!state.user) box.innerHTML = `<p style="color:#9aa0c8"><a href="/login?next=${encodeURIComponent(location.pathname)}" style="color:#2ee6c9;font-weight:700">${T("Log in", "התחברו")}</a> ${T("to write a comment.", "כדי לכתוב תגובה.")}</p>`;
    else if (isBanned()) box.innerHTML = "";
    else {
        box.innerHTML = `<form class="gh-cform"><textarea maxlength="300" placeholder="${T("Say something nice about this game…", "כתבו משהו נחמד על המשחק…")}"></textarea>
            <div class="row"><span>${T("Be kind. No personal info (phone, address, school). Rude comments get removed.", "היו נחמדים. בלי פרטים אישיים (טלפון, כתובת, בית ספר). תגובות לא יפות יימחקו.")} <b class="cnt">0/300</b></span>
            <span class="gh-err"></span><button class="gh-btn" type="submit">${T("Post", "פרסום")}</button></div></form>`;
        const f = box.querySelector("form"), ta = f.querySelector("textarea"), err = f.querySelector(".gh-err");
        ta.addEventListener("input", () => { f.querySelector(".cnt").textContent = `${ta.value.length}/300`; err.textContent = ""; });
        f.addEventListener("submit", async (e) => {
            e.preventDefault();
            const btn = f.querySelector("button"); btn.disabled = true; err.textContent = "";
            try {
                await postComment(game, ta.value);
                ta.value = ""; f.querySelector(".cnt").textContent = "0/300";
                await loadComments(true);
            } catch (x) { err.textContent = x.code ? T("Couldn't post your comment. Try again.", "לא הצלחנו לפרסם את התגובה. נסו שוב.") : he ? (HE_ERR[x.message] || x.message) : x.message; }
            btn.disabled = false;
        });
    }
    let last = null;
    function row(c) {
        const own = c.uid === state.user?.uid;
        return `<div class="gh-c" data-id="${esc(c.id)}">${avatarHtml(c, 38)}<div class="body"><div class="top">
            <a class="nm${c.premium ? " prem" : ""}" href="/player?u=${encodeURIComponent(c.uid)}">${esc(c.name)}${c.premium ? " ★" : ""}</a>
            <span class="when">${esc(timeAgo(c.createdAt))}</span>
            <span class="acts">${own || isAdmin ? `<button data-del="${esc(c.id)}">${T("Delete", "מחיקה")}</button>` : ""}${!own && state.user ? `<button data-rep="${esc(c.id)}" title="${T("Report", "דיווח")}">🚩</button>` : ""}</span></div>
            <div class="txt">${esc(c.text)}</div></div></div>`;
    }
    async function loadComments(reset) {
        try {
            const r = await getComments(game, 15, reset ? null : last);
            if (reset) list.innerHTML = "";
            last = r.last;
            list.insertAdjacentHTML("beforeend", r.rows.map(row).join(""));
            if (!list.children.length) list.innerHTML = `<p class="none" style="color:#9aa0c8">${T("No comments yet. Write the first one!", "עדיין אין תגובות. כתבו את הראשונה!")}</p>`;
            more.style.display = r.more ? "" : "none";
        } catch (e) { list.innerHTML = `<p style="color:#9aa0c8">${T("Comments are unavailable right now.", "התגובות לא זמינות כרגע.")}</p>`; }
    }
    more.onclick = () => loadComments(false);
    list.addEventListener("click", async (e) => {
        const d = e.target.closest("[data-del]"), r = e.target.closest("[data-rep]");
        if (d) {
            if (!confirmInline(d, T("Sure?", "בטוח?"))) return;
            try { await deleteComment(game, d.dataset.del); d.closest(".gh-c").remove(); toast(T("Comment deleted", "התגובה נמחקה"), 1800); } catch (x) { toast(T("Couldn't delete it.", "לא הצלחנו למחוק.")); }
        }
        if (r) {
            try { await reportComment(game, r.dataset.rep); r.textContent = "✓"; r.disabled = true; toast(T("Thanks. Noam will check it.", "תודה. נועם יבדוק את זה."), 2500); } catch (x) { toast(x.message); }
        }
    });
    loadComments(true);
}
// two-tap confirm without browser dialogs
function confirmInline(btn, text) {
    if (btn.dataset.armed) return true;
    btn.dataset.armed = "1"; const old = btn.textContent; btn.textContent = text;
    setTimeout(() => { delete btn.dataset.armed; btn.textContent = old; }, 2500);
    return false;
}
const HE_ERR = {
    "Write a bit more first.": "כתבו עוד קצת.",
    "Comments can be up to 300 characters.": "תגובה יכולה להיות עד 300 תווים.",
    "Comments can't have links or emails in them.": "אסור קישורים או אימיילים בתגובות.",
    "Comments can't have phone numbers in them.": "אסור מספרי טלפון בתגובות.",
    "Please don't spam.": "בלי ספאם בבקשה.",
    "Please keep comments friendly.": "בבקשה לכתוב תגובות נחמדות."
};
