// pet.js — your Hub pet. It hatches from an egg after your first game, grows as you play,
// evolves into one of four kinds depending on the games you play most, gets hungry over time
// (it never dies), and wears accessories you unlock with achievements.
// Saved in the browser, and on your account when you're logged in.

import { GAMES, state, ready, LANG, toast, isPremium } from "./hub.js";
import * as PI from "./pet-items.js";
import { ACHIEVEMENTS } from "./progress.js";
import { TEXT, NAMES } from "./i18n.js";
export { PI };

const he = LANG === "he";
const T = (en, hw) => (he ? hw : en);
const KEY = "gh_pet";

export const STAGES = [
    { id: "egg", xp: 0, en: "Egg", he: "ביצה", size: 0.8 },
    { id: "baby", xp: 1, en: "Baby", he: "תינוק", size: 0.7 },
    { id: "kid", xp: 150, en: "Kid", he: "ילד", size: 0.85 },
    { id: "teen", xp: 500, en: "Teen", he: "נער", size: 0.95 },
    { id: "adult", xp: 1500, en: "Grown-up", he: "בוגר", size: 1.05 },
    { id: "legend", xp: 4000, en: "Legend", he: "אגדה", size: 1.12 }
];
// the kind it evolves into (from Teen) depends on the games you play most
export const KINDS = {
    blob:   { en: "Bloop", he: "בלופ", color: "#7c5cff", belly: "#b9a8ff", tags: [] },
    sporty: { en: "Sporty", he: "ספורטאי", color: "#ff8a3d", belly: "#ffd0ad", tags: ["sports"] },
    brainy: { en: "Brainy", he: "גאון", color: "#4d7cff", belly: "#b8cbff", tags: ["puzzle", "brain", "strategy"] },
    zappy:  { en: "Zappy", he: "זאפי", color: "#21d4b4", belly: "#a8f5e6", tags: ["arcade", "runner", "platformer"] },
    artsy:  { en: "Artsy", he: "אמן", color: "#ff5fa2", belly: "#ffc2dc", tags: ["creative", "word"] }
};
// accessories, unlocked by achievements (ids from progress.js) or pet level
export const HATS = [
    { id: "none", en: "Nothing", he: "בלי", need: null, xp: 0 },
    { id: "party", en: "Party hat", he: "כובע מסיבה", need: "first", xp: 1 },
    { id: "cap", en: "Cap", he: "כובע מצחייה", need: "five", xp: 150 },
    { id: "bow", en: "Bow", he: "פפיון", need: "daily1", xp: 300 },
    { id: "headphones", en: "Headphones", he: "אוזניות", need: "plays50", xp: 500 },
    { id: "glasses", en: "Glasses", he: "משקפיים", need: "good3", xp: 800 },
    { id: "ball", en: "Football", he: "כדורגל", need: "sports", xp: 1200 },
    { id: "wizard", en: "Wizard hat", he: "כובע קוסם", need: "brainy", xp: 2000 },
    { id: "star", en: "Star clip", he: "סיכת כוכב", need: "pro", xp: 3000 },
    { id: "crown", en: "Crown", he: "כתר", need: "legend", xp: 4000 }
];

const now = () => Date.now();
function blank() { return { name: T("Bloop", "בלופ"), born: now(), xp: 0, food: 80, love: 60, last: now(), hat: "none", plays: {}, treatAt: 0, v: 1 }; }
const OUTFIT0 = { hat: "none", color: "default", pattern: "none", eyes: "normal", face: "none", neck: "none", held: "none", aura: "none", room: "default" };
// older pets only had a hat: give them the new wardrobe fields
function migrate(p) {
    p.outfit = { ...OUTFIT0, ...(p.outfit || {}) };
    if (p.hat && p.hat !== "none" && p.outfit.hat === "none" && !p.migrated) p.outfit.hat = p.hat;
    p.migrated = 1;
    p.owned = Array.isArray(p.owned) ? p.owned : [];
    p.coins = p.coins || 0;
    p.stats = p.stats || {};
    p.outfits = Array.isArray(p.outfits) ? p.outfits : [];
    p.seen = Array.isArray(p.seen) ? p.seen : [];
    return p;
}
function load() {
    let p = null;
    try { p = JSON.parse(localStorage.getItem(KEY)); } catch (e) {}
    return migrate(p && p.v ? p : blank());
}
let pet = load();
function saveLocal() { try { localStorage.setItem(KEY, JSON.stringify(pet)); } catch (e) {} }

// food and love go down slowly while you're away (never below 5)
function decay() {
    const hrs = Math.max(0, (now() - (pet.last || now())) / 3600000);
    pet.food = Math.max(5, Math.round(pet.food - hrs * 3));
    pet.love = Math.max(5, Math.round(pet.love - hrs * 2));
    pet.last = now();
}
decay();

export function getPet() { return pet; }
export function stageOf(p = pet) { let s = STAGES[0]; for (const st of STAGES) if (p.xp >= st.xp) s = st; return s; }
export function nextStage(p = pet) { return STAGES.find((s) => s.xp > p.xp) || null; }
export function kindOf(p = pet) {
    const st = stageOf(p);
    if (["egg", "baby", "kid"].includes(st.id)) return "blob";
    if (p.kind) return p.kind;
    // decide once, when it first becomes a teen
    const score = { sporty: 0, brainy: 0, zappy: 0, artsy: 0 };
    for (const [id, n] of Object.entries(p.plays || {})) {
        const tags = (GAMES[id] && GAMES[id].tags) || [];
        for (const [k, v] of Object.entries(KINDS)) if (v.tags.some((t) => tags.includes(t))) score[k] += n;
    }
    const best = Object.entries(score).sort((a, b) => b[1] - a[1])[0];
    p.kind = best[1] > 0 ? best[0] : "zappy";
    return p.kind;
}
export function mood(p = pet) {
    const m = (p.food + p.love) / 2;
    return m > 70 ? "happy" : m > 40 ? "ok" : "sad";
}

let syncTimer = null;
async function sync() {
    saveLocal();
    clearTimeout(syncTimer);
    syncTimer = setTimeout(async () => {
        await ready;
        if (!state.user || !state.profile) return;
        try {
            const { db } = await import("./firebase-config.js");
            const { doc, updateDoc } = await import("https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js");
            const { plays, ...rest } = pet;
            await updateDoc(doc(db, "users", state.user.uid), { pet: { ...rest, plays } });
            state.profile.pet = pet;
        } catch (e) { console.warn("[GameHub] pet sync failed", e); }
    }, 1500);
}
// on login, keep whichever pet has grown more (account or this browser)
ready.then(() => {
    const acc = state.profile && state.profile.pet;
    if (acc && acc.v && (acc.xp || 0) > (pet.xp || 0)) {
        const mine = pet; pet = migrate({ ...acc, last: pet.last });
        pet.owned = [...new Set([...pet.owned, ...mine.owned])]; pet.coins = Math.max(pet.coins, mine.coins);
        decay(); saveLocal();
    }
    else if (state.user && pet.xp > 0 && (!acc || acc.xp !== pet.xp)) sync();
});

function grow(xp, food, love) {
    const before = stageOf();
    pet.xp += xp;
    pet.food = Math.min(100, pet.food + food);
    pet.love = Math.min(100, pet.love + love);
    pet.last = now();
    const after = stageOf();
    if (after.id !== before.id) {
        if (after.id === "teen") kindOf();
        const k = KINDS[kindOf()];
        const msg = before.id === "egg" ? T("🐣 Your egg hatched! Meet your Hub pet", "🐣 הביצה בקעה! תכירו את חיית המחמד שלכם")
            : after.id === "teen" ? T(`✨ Your pet evolved into a ${k.en}!`, `✨ חיית המחמד התפתחה ל${k.he}!`)
            : T(`⬆️ Your pet grew up: ${after.en}!`, `⬆️ חיית המחמד גדלה: ${after.he}!`);
        toast(`${msg} · <a href="/pet">${T("See it", "לצפייה")}</a>`, 5000);
        if (before.id !== "egg") earn(50);
    }
    sync();
}

// called by hub.js whenever a game is finished
export function fed(game) {
    pet.plays = pet.plays || {};
    pet.plays[game] = (pet.plays[game] || 0) + 1;
    const first = pet.xp === 0;
    grow(10, 12, 4);
    earn(5);
    if (!first && Math.random() < 0.25) toast(T(`🍪 Your pet ate a snack (+10 XP)`, `🍪 חיית המחמד אכלה חטיף (+10 XP)`), 1800);
}
export function bonus(xp, why) { grow(xp, 5, 5); if (why) toast(`🐾 ${why} (+${xp} XP)`, 2200); }

// pet page actions
export function pat() {
    pet.love = Math.min(100, pet.love + 4); pet.last = now();
    pet.stats.pats = (pet.stats.pats || 0) + 1;
    if (pet.stats.pats % 25 === 0) earn(5);
    sync();
}
export function treat() {
    if (now() - (pet.treatAt || 0) < 3600000) return false;
    pet.treatAt = now(); pet.food = Math.min(100, pet.food + 25);
    pet.stats.treats = (pet.stats.treats || 0) + 1; earn(3);
    grow(5, 0, 6); return true;
}
export function rename(n) { pet.name = String(n).replace(/[<>]/g, "").trim().slice(0, 16) || pet.name; sync(); }
export function wear(slot, id) {
    if (id === undefined) { id = slot; slot = "hat"; }
    pet.outfit[slot] = id; if (slot === "hat") pet.hat = id; sync();
}

// ---------- Coins, unlocks, shop, wheel, mystery box, codes ----------
export function earn(n) {
    pet.coins = (pet.coins || 0) + n;
    pet.stats.coinsEarned = (pet.stats.coinsEarned || 0) + n;
    sync();
}
const DAY = () => { const d = new Date(); return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate(); };
// call once per page visit: daily coins + streak + "visit at night" style unlocks. Returns what happened.
export function checkIn() {
    const out = {}, d = new Date(), h = d.getHours(), s = pet.stats;
    if (h >= 21 || h < 5) s.time_night = 1;
    if (h >= 5 && h < 8) s.time_early = 1;
    if (d.getDay() === 5 || d.getDay() === 6) s.time_weekend = 1;
    const today = DAY();
    if (pet.lastDay !== today) {
        const y = new Date(Date.now() - 864e5); const yest = y.getFullYear() + "-" + (y.getMonth() + 1) + "-" + y.getDate();
        pet.streak = pet.lastDay === yest ? (pet.streak || 0) + 1 : 1;
        pet.lastDay = today;
        s.bestStreak = Math.max(s.bestStreak || 0, pet.streak);
        out.daily = 20 + Math.min(30, (pet.streak - 1) * 5);
        earn(out.daily);
        // seasonal items: you get them just for visiting during that month
        const m = d.getMonth();
        out.seasonal = PI.ITEMS.filter((it) => it.u.t === "month" && it.u.v.includes(m) && give(it));
    }
    out.streak = pet.streak || 1;
    sync();
    return out;
}
function give(it) { const k = PI.key(it); if (pet.owned.includes(k)) return false; pet.owned.push(k); return true; }
export function unlockCtx(ach = new Set()) {
    const tagCount = (tag) => Object.entries(pet.plays || {}).reduce((n, [g, c]) => n + ((GAMES[g] && GAMES[g].tags || []).includes(tag) ? c : 0), 0);
    let premium = false; try { premium = !!isPremium(); } catch (e) {}
    return { pet, ach, premium, stage: stageOf().id, kind: kindOf(), tagCount,
        gameName: (g) => (GAMES[g] ? (he && NAMES[GAMES[g].name]) || GAMES[g].name : g),
        achName: (id) => { const a = ACHIEVEMENTS.find((x) => x.id === id); return a ? (he ? TEXT[a.name] || a.name : a.name) : id; },
        tagName: (g) => ({ arcade: "ארקייד", puzzle: "פאזל", brain: "חשיבה", sports: "ספורט", word: "מילים", music: "מוזיקה", creative: "יצירה" }[g] || g) };
}
export const has = (it, c) => PI.owned(it, c);
export function buy(it) {
    if (it.u.t !== "coins" || pet.coins < it.u.v || pet.owned.includes(PI.key(it))) return false;
    pet.coins -= it.u.v; give(it); sync(); return true;
}
// mystery box: a random item you don't have yet, preferring box-only items
export function openBox(c) {
    if (pet.coins < PI.BOX_PRICE) return null;
    const missing = PI.ITEMS.filter((it) => !PI.owned(it, c) && ["box", "coins", "spin"].includes(it.u.t));
    if (!missing.length) return null;
    const boxOnly = missing.filter((it) => it.u.t === "box");
    const pool = boxOnly.length && Math.random() < 0.6 ? boxOnly : missing;
    const it = pool[Math.floor(Math.random() * pool.length)];
    pet.coins -= PI.BOX_PRICE; give(it); sync(); return it;
}
export const canSpin = () => pet.spinDay !== DAY();
export function spin(c) {
    if (!canSpin()) return null;
    pet.spinDay = DAY();
    const i = Math.floor(Math.random() * PI.WHEEL.length), w = PI.WHEEL[i];
    const res = { i, ...w };
    if (w.kind === "coins") earn(w.v);
    if (w.kind === "xp") grow(w.v, 0, 5);
    if (w.kind === "item") {
        const pool = PI.ITEMS.filter((it) => !PI.owned(it, c) && (it.u.t === "spin" || it.u.t === "coins"));
        const spinOnly = pool.filter((it) => it.u.t === "spin");
        const p2 = spinOnly.length ? spinOnly : pool;
        if (p2.length) { res.item = p2[Math.floor(Math.random() * p2.length)]; give(res.item); } else { res.kind = "coins"; res.v = 40; earn(40); }
    }
    sync(); return res;
}
export function redeem(text) {
    const it = PI.ITEMS.find((x) => PI.codeMatches(x, text));
    if (!it) return null;
    if (!give(it)) return { it, already: true };
    sync(); return { it };
}
export function miniScore(n) {
    pet.stats.mini = Math.max(pet.stats.mini || 0, n);
    const c = Math.min(30, Math.floor(n / 3)); if (c) earn(c);
    grow(Math.min(15, Math.floor(n / 4)), 3, 8);
    return c;
}
export function saveOutfit(i) { pet.outfits[i] = { ...pet.outfit }; sync(); }
export function loadOutfit(i) { if (pet.outfits[i]) { pet.outfit = { ...OUTFIT0, ...pet.outfits[i] }; pet.hat = pet.outfit.hat; sync(); } }
export function setOutfit(o) { pet.outfit = { ...OUTFIT0, ...o }; pet.hat = pet.outfit.hat; sync(); }
export function markSeen(keys) { pet.seen = [...new Set([...pet.seen, ...keys])]; saveLocal(); }

// ---------- Drawing ----------
// draw(ctx, cx, cy, scale, t) draws the pet centred at cx,cy. t = time in seconds (for animation).
export function draw(ctx, cx, cy, s, t, p = pet, fx = {}) {
    const st = stageOf(p);
    ctx.save(); ctx.translate(cx, cy);
    if (st.id === "egg") { drawEgg(ctx, s, t, p); ctx.restore(); return; }
    const k0 = KINDS[kindOf(p)], md = mood(p), o = (p.outfit) || { ...OUTFIT0, hat: p.hat || "none" };
    const pal = PI.PALETTE[o.color];
    const k = pal ? { ...k0, color: pal[0], belly: pal[1] } : ["rainbow", "galaxy", "lava"].includes(o.color) ? { ...k0, color: { rainbow: "#ff8a3d", galaxy: "#3a2a8f", lava: "#d6401a" }[o.color], belly: { rainbow: "#fff0b8", galaxy: "#7c5cff", lava: "#ffcf3d" }[o.color] } : k0;
    const bounce = Math.abs(Math.sin(t * (md === "happy" ? 3.2 : md === "ok" ? 2.2 : 1.2))) * 8 * s;
    const squash = 1 + Math.sin(t * 6.4) * 0.03;
    const r = 60 * s * st.size;
    ctx.translate(0, -bounce + (fx.jump || 0));
    PI.drawAura(ctx, o.aura, r, t, "back");
    PI.drawBack(ctx, o, r, t);
    // shadow
    ctx.save(); ctx.translate(0, bounce - (fx.jump || 0)); ctx.fillStyle = "rgba(0,0,0,.25)"; ctx.beginPath(); ctx.ellipse(0, r * 0.95, r * 0.75 * (1 - bounce / 120), r * 0.16, 0, 0, 7); ctx.fill(); ctx.restore();
    // feet
    ctx.fillStyle = shade(k.color, -30);
    for (const x of [-0.42, 0.42]) { ctx.beginPath(); ctx.ellipse(x * r, r * 0.84, r * 0.24, r * 0.13, 0, 0, 7); ctx.fill(); }
    // arms (wave when happy)
    const wave = md === "happy" ? Math.sin(t * 5) * 0.5 : 0.1;
    ctx.fillStyle = k.color;
    for (const sd of [-1, 1]) {
        ctx.save(); ctx.translate(sd * r * 0.88, r * 0.1); ctx.rotate(sd * (0.6 + (sd > 0 ? wave : 0)));
        ctx.beginPath(); ctx.ellipse(0, r * 0.18, r * 0.16, r * 0.3, 0, 0, 7); ctx.fill(); ctx.restore();
    }
    // body
    ctx.save(); ctx.scale(1 / squash, squash);
    const bg = ctx.createRadialGradient(-r * 0.3, -r * 0.4, r * 0.1, 0, 0, r * 1.1); bg.addColorStop(0, shade(k.color, 35)); bg.addColorStop(1, k.color);
    ctx.fillStyle = PI.bodyFill(ctx, o.color, k.color, r, t) || bg; ctx.beginPath(); ctx.ellipse(0, 0, r, r * 0.92, 0, 0, 7); ctx.fill();
    if (o.color === "ghost") { ctx.globalAlpha = 0.75; }
    ctx.fillStyle = k.belly; ctx.beginPath(); ctx.ellipse(0, r * 0.32, r * 0.58, r * 0.5, 0, 0, 7); ctx.fill();
    ctx.globalAlpha = 1;
    PI.drawPattern(ctx, o.pattern, r, t, k.color);
    if (o.color === "neon") { ctx.strokeStyle = "#39ff88"; ctx.lineWidth = 3; ctx.shadowColor = "#39ff88"; ctx.shadowBlur = 18; ctx.beginPath(); ctx.ellipse(0, 0, r, r * 0.92, 0, 0, 7); ctx.stroke(); ctx.shadowBlur = 0; }
    if (o.color === "galaxy") for (let i = 0; i < 12; i++) { ctx.fillStyle = `rgba(255,255,255,${0.4 + 0.5 * Math.abs(Math.sin(t * 2 + i))})`; ctx.fillRect(Math.sin(i * 7.1) * r * 0.7, Math.cos(i * 3.3) * r * 0.6, 2, 2); }
    ctx.restore();
    // kind extras
    if (!o.hat || o.hat === "none" || kindOf(p) === "artsy") kindExtras(ctx, kindOf(p), r, t, k);
    // eyes (blink every few seconds)
    const blink = (t % 4) > 3.86 || fx.happyEyes;
    const custom = o.eyes && o.eyes !== "normal" && !fx.happyEyes;
    if (custom) PI.drawEyes(ctx, o.eyes, r, s, t, fx.look || 0);
    if (!custom) for (const sd of [-1, 1]) {
        const ex = sd * r * 0.32, ey = -r * 0.18;
        if (blink || (md === "happy" && fx.pat)) { ctx.strokeStyle = "#0b0d1a"; ctx.lineWidth = 3 * s; ctx.beginPath(); ctx.arc(ex, ey + 2, r * 0.1, Math.PI * 1.1, Math.PI * 1.9); ctx.stroke(); continue; }
        ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.ellipse(ex, ey, r * 0.17, r * 0.2, 0, 0, 7); ctx.fill();
        ctx.fillStyle = "#0b0d1a"; ctx.beginPath(); ctx.arc(ex + (fx.look || 0) * r * 0.05, ey + r * 0.03, r * 0.1, 0, 7); ctx.fill();
        ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(ex + r * 0.04, ey - r * 0.03, r * 0.035, 0, 7); ctx.fill();
    }
    // cheeks
    ctx.fillStyle = "rgba(255,120,170,.45)";
    for (const sd of [-1, 1]) { ctx.beginPath(); ctx.ellipse(sd * r * 0.55, r * 0.08, r * 0.11, r * 0.07, 0, 0, 7); ctx.fill(); }
    // mouth
    ctx.strokeStyle = "#0b0d1a"; ctx.lineWidth = 3 * s; ctx.lineCap = "round"; ctx.beginPath();
    if (md === "happy") { ctx.arc(0, r * 0.05, r * 0.16, 0.15 * Math.PI, 0.85 * Math.PI); }
    else if (md === "ok") { ctx.moveTo(-r * 0.1, r * 0.14); ctx.lineTo(r * 0.1, r * 0.14); }
    else { ctx.arc(0, r * 0.28, r * 0.13, 1.15 * Math.PI, 1.85 * Math.PI); }
    ctx.stroke();
    PI.drawFace(ctx, o.face, r, s, t);
    PI.drawNeck(ctx, o.neck, r, s, t);
    if (md === "sad") { ctx.fillStyle = "#7cc8ff"; ctx.beginPath(); ctx.ellipse(r * 0.42, r * 0.02 + (t * 30 % 20) * s, r * 0.04, r * 0.07, 0, 0, 7); ctx.fill(); }
    // legend sparkle
    if (st.id === "legend") for (let i = 0; i < 5; i++) { const a = t * 0.8 + i * 1.256; ctx.fillStyle = "#ffc94d"; star(ctx, Math.cos(a) * r * 1.35, Math.sin(a) * r * 1.1, r * 0.07 * (1 + Math.sin(t * 4 + i) * 0.3)); }
    hat(ctx, o.hat, r, t, s);
    PI.drawHat(ctx, o.hat, r, t, s);
    PI.drawHeld(ctx, o.held, r, s, t);
    PI.drawAura(ctx, o.aura, r, t, "front");
    ctx.restore();
}
function drawEgg(ctx, s, t, p) {
    const wob = Math.sin(t * 3) * 0.06 + (p.xp > 0 ? Math.sin(t * 20) * 0.04 : 0);
    const r = 50 * s;
    ctx.fillStyle = "rgba(0,0,0,.25)"; ctx.beginPath(); ctx.ellipse(0, r * 1.25, r * 0.7, r * 0.15, 0, 0, 7); ctx.fill();
    ctx.rotate(wob);
    const g = ctx.createRadialGradient(-r * 0.3, -r * 0.5, r * 0.1, 0, 0, r * 1.4); g.addColorStop(0, "#fffdf6"); g.addColorStop(1, "#e9dcc4");
    ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(0, 0, r * 0.82, r * 1.12, 0, 0, 7); ctx.fill();
    ctx.fillStyle = "#7c5cff66";
    for (const [x, y, rr] of [[-0.3, -0.4, 0.15], [0.35, -0.1, 0.12], [-0.1, 0.35, 0.18], [0.3, 0.55, 0.1], [-0.45, 0.2, 0.09]]) { ctx.beginPath(); ctx.arc(x * r, y * r, rr * r, 0, 7); ctx.fill(); }
}
function kindExtras(ctx, kind, r, t, k) {
    if (kind === "sporty") { ctx.fillStyle = "#fff"; ctx.fillRect(-r * 0.92, -r * 0.62, r * 1.84, r * 0.16); ctx.fillStyle = "#ff3b4e"; ctx.fillRect(-r * 0.92, -r * 0.58, r * 1.84, r * 0.06); }
    if (kind === "brainy") { ctx.strokeStyle = shade(k.color, -40); ctx.lineWidth = r * 0.05; ctx.beginPath(); ctx.moveTo(0, -r * 0.9); ctx.quadraticCurveTo(r * 0.25, -r * 1.25, r * 0.1, -r * 1.35); ctx.stroke(); ctx.fillStyle = "#ffc94d"; ctx.beginPath(); ctx.arc(r * 0.1, -r * 1.38, r * 0.09, 0, 7); ctx.fill(); }
    if (kind === "zappy") { ctx.fillStyle = "#ffe14d"; ctx.beginPath(); const x = r * 0.2, y = -r * 1.42; ctx.moveTo(x, y); ctx.lineTo(x - r * 0.22, y + r * 0.32); ctx.lineTo(x - r * 0.04, y + r * 0.32); ctx.lineTo(x - r * 0.16, y + r * 0.56); ctx.lineTo(x + r * 0.16, y + r * 0.18); ctx.lineTo(x - r * 0.02, y + r * 0.18); ctx.closePath(); ctx.fill(); }
    if (kind === "artsy") { ctx.fillStyle = "#ffffffcc"; for (const [x, y, c] of [[-0.5, 0.5, "#ffc94d"], [0.45, 0.55, "#2ee6c9"], [0.05, 0.7, "#7c5cff"]]) { ctx.fillStyle = c; ctx.beginPath(); ctx.arc(x * r, y * r, r * 0.07, 0, 7); ctx.fill(); } }
}
function hat(ctx, id, r, t, s) {
    const y = -r * 0.9;
    if (id === "party") { ctx.fillStyle = "#ff4d8d"; ctx.beginPath(); ctx.moveTo(-r * 0.3, y + r * 0.05); ctx.lineTo(r * 0.3, y + r * 0.05); ctx.lineTo(0, y - r * 0.65); ctx.closePath(); ctx.fill(); ctx.fillStyle = "#ffc94d"; ctx.beginPath(); ctx.arc(0, y - r * 0.68, r * 0.09, 0, 7); ctx.fill(); for (const [a, b] of [[-0.1, -0.15], [0.08, -0.35], [-0.04, -0.5]]) { ctx.fillStyle = "#2ee6c9"; ctx.beginPath(); ctx.arc(a * r, y + b * r, r * 0.04, 0, 7); ctx.fill(); } }
    if (id === "cap") { ctx.fillStyle = "#2e6bff"; ctx.beginPath(); ctx.ellipse(0, y + r * 0.08, r * 0.62, r * 0.4, 0, Math.PI, 0); ctx.fill(); ctx.fillRect(0, y + r * 0.02, r * 0.85, r * 0.1); }
    if (id === "headphones") { ctx.strokeStyle = "#222744"; ctx.lineWidth = r * 0.1; ctx.beginPath(); ctx.arc(0, -r * 0.15, r * 0.95, Math.PI * 1.1, Math.PI * 1.9); ctx.stroke(); ctx.fillStyle = "#ff4d8d"; for (const sd of [-1, 1]) { ctx.beginPath(); ctx.ellipse(sd * r * 0.92, -r * 0.2, r * 0.16, r * 0.24, 0, 0, 7); ctx.fill(); } }
    if (id === "bow") { ctx.fillStyle = "#ff4d8d"; for (const sd of [-1, 1]) { ctx.beginPath(); ctx.moveTo(r * 0.35, y + r * 0.1); ctx.lineTo(r * 0.35 + sd * r * 0.28, y - r * 0.08); ctx.lineTo(r * 0.35 + sd * r * 0.28, y + r * 0.28); ctx.closePath(); ctx.fill(); } ctx.beginPath(); ctx.arc(r * 0.35, y + r * 0.1, r * 0.08, 0, 7); ctx.fill(); }
    if (id === "glasses") { ctx.strokeStyle = "#0b0d1a"; ctx.lineWidth = r * 0.05; for (const sd of [-1, 1]) { ctx.beginPath(); ctx.arc(sd * r * 0.32, -r * 0.18, r * 0.22, 0, 7); ctx.stroke(); } ctx.beginPath(); ctx.moveTo(-r * 0.1, -r * 0.2); ctx.lineTo(r * 0.1, -r * 0.2); ctx.stroke(); }
    if (id === "ball") { const bx = r * 1.15, by = r * 0.62 + Math.abs(Math.sin(t * 4)) * -r * 0.3; ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(bx, by, r * 0.24, 0, 7); ctx.fill(); ctx.fillStyle = "#0b0d1a"; star(ctx, bx, by, r * 0.09, 5); }
    if (id === "wizard") { ctx.fillStyle = "#3b2a8f"; ctx.beginPath(); ctx.moveTo(-r * 0.5, y + r * 0.12); ctx.lineTo(r * 0.5, y + r * 0.12); ctx.lineTo(r * 0.1, y - r * 0.85); ctx.closePath(); ctx.fill(); ctx.fillStyle = "#ffc94d"; star(ctx, 0, y - r * 0.25, r * 0.1); star(ctx, r * 0.15, y - r * 0.5, r * 0.06); }
    if (id === "star") { ctx.fillStyle = "#ffc94d"; star(ctx, r * 0.5, y + r * 0.08, r * 0.17); }
    if (id === "crown") { ctx.fillStyle = "#ffc94d"; ctx.beginPath(); const w = r * 0.55; ctx.moveTo(-w, y + r * 0.08); ctx.lineTo(-w, y - r * 0.32); ctx.lineTo(-w / 2, y - r * 0.1); ctx.lineTo(0, y - r * 0.42); ctx.lineTo(w / 2, y - r * 0.1); ctx.lineTo(w, y - r * 0.32); ctx.lineTo(w, y + r * 0.08); ctx.closePath(); ctx.fill(); ctx.fillStyle = "#ff3b4e"; ctx.beginPath(); ctx.arc(0, y - r * 0.05, r * 0.07, 0, 7); ctx.fill(); }
}
function star(ctx, x, y, r, n = 5) { ctx.beginPath(); for (let i = 0; i < n * 2; i++) { const a = -Math.PI / 2 + i * Math.PI / n, rr = i % 2 ? r * 0.45 : r; ctx.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); } ctx.closePath(); ctx.fill(); }
function shade(hex, amt) { const n = parseInt(hex.slice(1), 16); const c = (v) => Math.max(0, Math.min(255, v + amt)); return `rgb(${c(n >> 16)},${c((n >> 8) & 255)},${c(n & 255)})`; }

// a shareable picture of your pet
export async function petCard(p = pet) {
    const W = 1200, H = 630, c = document.createElement("canvas"); c.width = W; c.height = H;
    const ctx = c.getContext("2d");
    const k = KINDS[kindOf(p)], st = stageOf(p);
    const g = ctx.createLinearGradient(0, 0, W, H); g.addColorStop(0, "#1b1440"); g.addColorStop(1, "#0b0d1a"); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    if (p.outfit && p.outfit.room && p.outfit.room !== "default") { ctx.save(); ctx.beginPath(); ctx.rect(0, 0, 640, H); ctx.clip(); ctx.translate(20, 0); PI.drawRoom(ctx, p.outfit.room, 600, H, 0.5); ctx.restore(); }
    const rg = ctx.createRadialGradient(330, 300, 0, 330, 300, 320); rg.addColorStop(0, k.color + "55"); rg.addColorStop(1, "transparent"); ctx.fillStyle = rg; ctx.fillRect(0, 0, W, H);
    draw(ctx, 330, 300, 2.3, 0.5, p, {});
    const f = (w, s) => `${w} ${s}px Inter, Rubik, system-ui, sans-serif`;
    ctx.fillStyle = "#9aa0c8"; ctx.font = f(700, 30); ctx.fillText(T("Meet my Hub pet", "תכירו את חיית המחמד שלי"), 660, 180);
    ctx.fillStyle = "#eef0ff"; ctx.font = f(900, 84); ctx.fillText(p.name, 660, 270);
    ctx.fillStyle = k.color; ctx.font = f(800, 38); ctx.fillText(`${st.id === "egg" ? "🥚" : "⭐"} ${he ? st.he : st.en}${st.id === "egg" ? "" : " · " + (he ? k.he : k.en)}`, 660, 335);
    ctx.fillStyle = "#cfd3f5"; ctx.font = f(700, 30); ctx.fillText(`${p.xp.toLocaleString("en")} XP`, 660, 390);
    ctx.fillStyle = "#2ee6c9"; ctx.font = f(800, 36); ctx.fillText(T("Hatch your own at noamtoder.com", "בקעו חיה משלכם ב־noamtoder.com"), 660, 480);
    ctx.fillStyle = "#ffffff12"; ctx.fillRect(0, H - 70, W, 70);
    ctx.fillStyle = "#eef0ff"; ctx.font = f(800, 28); ctx.fillText("Noam's Game Hub", 60, H - 25);
    ctx.fillStyle = "#9aa0c8"; ctx.font = f(700, 26); const u = "noamtoder.com/pet"; ctx.fillText(u, W - 60 - ctx.measureText(u).width, H - 25);
    return new Promise((res) => c.toBlob((b) => res(b), "image/png"));
}

// ---------- Homepage buddy: a small pet in the corner that says hi ----------
export function mountBuddy() {
    if (document.getElementById("gh-buddy")) return;
    const wrap = document.createElement("a");
    wrap.id = "gh-buddy"; wrap.href = "/pet"; wrap.title = T("My Hub pet", "חיית המחמד שלי");
    wrap.style.cssText = "position:fixed;left:14px;bottom:14px;z-index:9000;width:92px;height:92px;display:block;transition:transform .2s,opacity .3s";
    const c = document.createElement("canvas"); const dpr = Math.min(2, window.devicePixelRatio || 1);
    c.width = 92 * dpr; c.height = 92 * dpr; c.style.cssText = "width:92px;height:92px;filter:drop-shadow(0 6px 14px rgba(0,0,0,.45))";
    const b = document.createElement("div");
    b.style.cssText = `position:absolute;bottom:88px;left:6px;background:#fff;color:#0b0d1a;border-radius:12px;padding:7px 11px;font:700 13px Inter,Rubik,system-ui,sans-serif;white-space:nowrap;box-shadow:0 6px 18px rgba(0,0,0,.35);opacity:0;transition:opacity .3s;pointer-events:none;direction:${he ? "rtl" : "ltr"}`;
    // smaller on phones so it doesn't cover the games
    if (innerWidth < 600) { wrap.style.width = wrap.style.height = c.style.width = c.style.height = "64px"; wrap.style.left = "8px"; wrap.style.bottom = "8px"; b.style.bottom = "60px"; b.style.fontSize = "12px"; }
    wrap.append(b, c); document.body.appendChild(wrap);
    wrap.onmouseenter = () => (wrap.style.transform = "scale(1.1)"); wrap.onmouseleave = () => (wrap.style.transform = "");
    const ctx = c.getContext("2d"); ctx.scale(dpr, dpr);
    const t0 = performance.now();
    (function loop(now) {
        if (!document.body.contains(c)) return;
        // stay out of the way of the cookie bar on small screens
        wrap.style.opacity = document.querySelector(".gh-cookie") && innerWidth < 800 ? "0" : "1";
        ctx.clearRect(0, 0, 92, 92); draw(ctx, 46, 54, 0.52, (now - t0) / 1000, pet, {});
        requestAnimationFrame(loop);
    })(t0);
    const st = stageOf().id, md = mood();
    const lines = st === "egg" ? [T("Play a game to hatch me! 🥚", "שחקו כדי שאבקע! 🥚")]
        : md === "sad" ? [T("I'm hungry! Play a game? 🥺", "אני רעב! נשחק? 🥺")]
        : [T(`Hi, it's ${pet.name}! 👋`, `היי, זה ${pet.name}! 👋`), T("Let's play something! 🎮", "בואו נשחק! 🎮"), T("Tap me to visit 🏠", "לחצו לבקר אותי 🏠")];
    let i = 0;
    const show = () => { b.textContent = lines[i++ % lines.length]; b.style.opacity = "1"; setTimeout(() => (b.style.opacity = "0"), 3500); };
    setTimeout(show, 1500); setInterval(show, 20000);
}
