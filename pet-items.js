// pet-items.js — everything you can dress your Hub pet in, how each thing is unlocked, and how it's drawn.
// Slots: hat, color, pattern, eyes, face, neck, held, aura, room.
// Unlock rules (u): free · xp · ach (achievement) · coins (shop) · streak (days in a row) · game (play one game N times)
// · tag (play N games of a kind) · stat (pats, treats, minigame best, …) · code (secret code) · box (mystery box only)
// · spin (daily wheel only) · time (night owl / early bird / weekend) · month (only in that month) · premium · stage · kind · games (different games played)

export const SLOTS = [
    { id: "hat", e: "🎩", en: "Hats", he: "כובעים" },
    { id: "color", e: "🎨", en: "Colours", he: "צבעים" },
    { id: "pattern", e: "🐆", en: "Patterns", he: "דוגמאות" },
    { id: "eyes", e: "👀", en: "Eyes", he: "עיניים" },
    { id: "face", e: "😜", en: "Face", he: "פנים" },
    { id: "neck", e: "🧣", en: "Neck", he: "צוואר" },
    { id: "held", e: "🎈", en: "Holding", he: "ביד" },
    { id: "aura", e: "✨", en: "Effects", he: "אפקטים" },
    { id: "room", e: "🏠", en: "Rooms", he: "חדרים" },
];

const I = (slot, id, en, he, u) => ({ slot, id, en, he, u });
export const ITEMS = [
    // ---------- hats ----------
    I("hat", "none", "Nothing", "בלי", { t: "free" }),
    I("hat", "party", "Party hat", "כובע מסיבה", { t: "ach", v: "first", xp: 1 }),
    I("hat", "cap", "Cap", "כובע מצחייה", { t: "ach", v: "five", xp: 150 }),
    I("hat", "bow", "Bow", "פפיון", { t: "ach", v: "daily1", xp: 300 }),
    I("hat", "headphones", "Headphones", "אוזניות", { t: "ach", v: "plays50", xp: 500 }),
    I("hat", "glasses", "Glasses", "משקפיים", { t: "ach", v: "good3", xp: 800 }),
    I("hat", "ball", "Football", "כדורגל", { t: "ach", v: "sports", xp: 1200 }),
    I("hat", "wizard", "Wizard hat", "כובע קוסם", { t: "ach", v: "brainy", xp: 2000 }),
    I("hat", "star", "Star clip", "סיכת כוכב", { t: "ach", v: "pro", xp: 3000 }),
    I("hat", "crown", "Crown", "כתר", { t: "ach", v: "legend", xp: 4000 }),
    I("hat", "beanie", "Beanie", "כובע גרב", { t: "coins", v: 60 }),
    I("hat", "tophat", "Top hat", "מגבעת", { t: "coins", v: 150 }),
    I("hat", "cowboy", "Cowboy hat", "כובע בוקרים", { t: "coins", v: 120 }),
    I("hat", "chef", "Chef hat", "כובע שף", { t: "game", g: "burgerchef", v: 5 }),
    I("hat", "pirate", "Pirate hat", "כובע פיראטים", { t: "game", g: "seabattle", v: 5 }),
    I("hat", "helmet", "Racing helmet", "קסדת מרוץ", { t: "game", g: "turbokart", v: 5 }),
    I("hat", "astronaut", "Space helmet", "קסדת חלל", { t: "game", g: "moonlander", v: 5 }),
    I("hat", "viking", "Viking helmet", "קסדת ויקינגים", { t: "game", g: "castlesmash", v: 5 }),
    I("hat", "propeller", "Propeller cap", "כובע מדחף", { t: "tag", g: "arcade", v: 30 }),
    I("hat", "grad", "Graduation cap", "כובע סיום", { t: "tag", g: "puzzle", v: 30 }),
    I("hat", "halo", "Halo", "הילה", { t: "stat", s: "pats", v: 300 }),
    I("hat", "horns", "Little horns", "קרניים קטנות", { t: "time", v: "night" }),
    I("hat", "flower", "Flower crown", "זר פרחים", { t: "month", v: [2, 3, 4] }),
    I("hat", "santa", "Winter hat", "כובע חורף", { t: "month", v: [11, 0, 1] }),
    I("hat", "bunny", "Bunny ears", "אוזני ארנב", { t: "box" }),
    I("hat", "cat", "Cat ears", "אוזני חתול", { t: "box" }),
    I("hat", "unicorn", "Unicorn horn", "קרן חד-קרן", { t: "box" }),
    I("hat", "ninja", "Ninja headband", "סרט נינג'ה", { t: "code", c: "TklOSkE=" }),
    I("hat", "noam", "Noam's cap", "הכובע של נועם", { t: "code", c: "Tk9BTQ==" }),
    I("hat", "jester", "Jester hat", "כובע ליצן", { t: "spin" }),
    I("hat", "diamond", "Diamond tiara", "נזר יהלומים", { t: "premium" }),
    I("hat", "sprout", "Sprout", "נבט", { t: "streak", v: 3 }),
    I("hat", "laurel", "Gold laurel", "זר דפנה", { t: "streak", v: 14 }),

    // ---------- body colours ----------
    I("color", "default", "Natural", "טבעי", { t: "free" }),
    I("color", "red", "Cherry", "דובדבן", { t: "coins", v: 40 }),
    I("color", "orange", "Tangerine", "קלמנטינה", { t: "coins", v: 40 }),
    I("color", "yellow", "Lemon", "לימון", { t: "coins", v: 40 }),
    I("color", "green", "Lime", "ליים", { t: "coins", v: 40 }),
    I("color", "teal", "Mint", "מנטה", { t: "coins", v: 40 }),
    I("color", "blue", "Ocean", "אוקיינוס", { t: "coins", v: 40 }),
    I("color", "purple", "Grape", "ענבים", { t: "coins", v: 40 }),
    I("color", "pink", "Bubblegum", "מסטיק", { t: "coins", v: 40 }),
    I("color", "brown", "Cocoa", "קקאו", { t: "xp", v: 300 }),
    I("color", "white", "Snow", "שלג", { t: "month", v: [11, 0, 1] }),
    I("color", "black", "Shadow", "צל", { t: "time", v: "night" }),
    I("color", "gold", "Gold", "זהב", { t: "stage", v: "legend" }),
    I("color", "silver", "Silver", "כסף", { t: "stage", v: "adult" }),
    I("color", "rainbow", "Rainbow", "קשת", { t: "games", v: 40 }),
    I("color", "galaxy", "Galaxy", "גלקסיה", { t: "box" }),
    I("color", "lava", "Lava", "לבה", { t: "box" }),
    I("color", "ghost", "Ghost", "רוח רפאים", { t: "code", c: "Qk9P" }),
    I("color", "neon", "Neon", "ניאון", { t: "premium" }),
    I("color", "ice", "Ice", "קרח", { t: "spin" }),

    // ---------- patterns ----------
    I("pattern", "none", "Plain", "חלק", { t: "free" }),
    I("pattern", "spots", "Spots", "נקודות", { t: "coins", v: 50 }),
    I("pattern", "stripes", "Stripes", "פסים", { t: "coins", v: 50 }),
    I("pattern", "hearts", "Hearts", "לבבות", { t: "stat", s: "pats", v: 100 }),
    I("pattern", "stars", "Stars", "כוכבים", { t: "ach", v: "good10", xp: 2500 }),
    I("pattern", "zigzag", "Zig-zag", "זיגזג", { t: "tag", g: "sports", v: 20 }),
    I("pattern", "checks", "Checkers", "משבצות", { t: "game", g: "checkers", v: 5 }),
    I("pattern", "tiger", "Tiger", "נמר", { t: "coins", v: 120 }),
    I("pattern", "freckle", "Freckles", "נמשים", { t: "xp", v: 200 }),
    I("pattern", "bolts", "Lightning", "ברקים", { t: "kind", v: "zappy" }),
    I("pattern", "dots", "Polka dots", "פולקה", { t: "box" }),
    I("pattern", "camo", "Camo", "הסוואה", { t: "spin" }),
    I("pattern", "pixel", "Pixels", "פיקסלים", { t: "game", g: "pixelpaint", v: 3 }),
    I("pattern", "moons", "Moons", "ירחים", { t: "time", v: "night" }),

    // ---------- eyes ----------
    I("eyes", "normal", "Normal", "רגילות", { t: "free" }),
    I("eyes", "big", "Big and shiny", "גדולות ונוצצות", { t: "coins", v: 40 }),
    I("eyes", "sleepy", "Sleepy", "ישנוניות", { t: "time", v: "early" }),
    I("eyes", "happy", "Always happy", "תמיד שמחות", { t: "stat", s: "treats", v: 10 }),
    I("eyes", "hearts", "Heart eyes", "עיני לב", { t: "stat", s: "pats", v: 200 }),
    I("eyes", "stars", "Star eyes", "עיני כוכב", { t: "ach", v: "good25", xp: 3500 }),
    I("eyes", "cool", "Cool shades", "משקפי שמש", { t: "coins", v: 100 }),
    I("eyes", "wink", "Wink", "קריצה", { t: "coins", v: 60 }),
    I("eyes", "cyclops", "One big eye", "עין אחת גדולה", { t: "box" }),
    I("eyes", "robot", "Robot eyes", "עיני רובוט", { t: "tag", g: "brain", v: 20 }),
    I("eyes", "angry", "Determined", "נחושות", { t: "game", g: "zombiesurvival", v: 5 }),
    I("eyes", "dizzy", "Dizzy", "מסוחררות", { t: "spin" }),
    I("eyes", "monocle", "Monocle", "מונוקל", { t: "premium" }),

    // ---------- face ----------
    I("face", "none", "Nothing", "כלום", { t: "free" }),
    I("face", "tongue", "Tongue out", "לשון בחוץ", { t: "coins", v: 30 }),
    I("face", "teeth", "Big grin", "חיוך גדול", { t: "coins", v: 30 }),
    I("face", "mustache", "Moustache", "שפם", { t: "coins", v: 80 }),
    I("face", "fangs", "Vampire fangs", "ניבי ערפד", { t: "time", v: "night" }),
    I("face", "freckles", "Rosy cheeks", "לחיים ורודות", { t: "stat", s: "treats", v: 5 }),
    I("face", "paint", "Face paint", "צבע פנים", { t: "tag", g: "sports", v: 10 }),
    I("face", "bandaid", "Band-aid", "פלסטר", { t: "game", g: "dodge", v: 5 }),
    I("face", "beard", "Wizard beard", "זקן קוסם", { t: "box" }),
    I("face", "sticker", "Star sticker", "מדבקת כוכב", { t: "streak", v: 7 }),

    // ---------- neck ----------
    I("neck", "none", "Nothing", "כלום", { t: "free" }),
    I("neck", "bowtie", "Bow tie", "עניבת פרפר", { t: "coins", v: 50 }),
    I("neck", "scarf", "Scarf", "צעיף", { t: "coins", v: 70 }),
    I("neck", "tie", "Tie", "עניבה", { t: "coins", v: 60 }),
    I("neck", "bell", "Bell collar", "קולר פעמון", { t: "stat", s: "treats", v: 20 }),
    I("neck", "medal", "Gold medal", "מדליית זהב", { t: "ach", v: "pro", xp: 3000 }),
    I("neck", "necklace", "Pearl necklace", "שרשרת פנינים", { t: "coins", v: 150 }),
    I("neck", "cape", "Hero cape", "גלימת גיבור", { t: "xp", v: 1000 }),
    I("neck", "lei", "Flower lei", "שרשרת פרחים", { t: "month", v: [5, 6, 7] }),
    I("neck", "bandana", "Bandana", "בנדנה", { t: "box" }),
    I("neck", "chain", "Gold chain", "שרשרת זהב", { t: "premium" }),
    I("neck", "whistle", "Coach whistle", "משרוקית", { t: "game", g: "football", v: 5 }),

    // ---------- held ----------
    I("held", "none", "Nothing", "כלום", { t: "free" }),
    I("held", "balloon", "Balloon", "בלון", { t: "game", g: "balloonpop", v: 3 }),
    I("held", "icecream", "Ice cream", "גלידה", { t: "coins", v: 50 }),
    I("held", "lollipop", "Lollipop", "סוכרייה על מקל", { t: "coins", v: 40 }),
    I("held", "wand", "Magic wand", "שרביט קסמים", { t: "game", g: "weatherwizard", v: 3 }),
    I("held", "sword", "Toy sword", "חרב צעצוע", { t: "coins", v: 120 }),
    I("held", "controller", "Game controller", "שלט משחק", { t: "games", v: 20 }),
    I("held", "guitar", "Guitar", "גיטרה", { t: "game", g: "beatmaker", v: 3 }),
    I("held", "trophy", "Trophy", "גביע", { t: "ach", v: "legend", xp: 4000 }),
    I("held", "flag", "Flag", "דגל", { t: "game", g: "flagquiz", v: 5 }),
    I("held", "teddy", "Teddy", "דובי", { t: "stat", s: "pats", v: 50 }),
    I("held", "umbrella", "Umbrella", "מטרייה", { t: "month", v: [9, 10, 11, 0, 1] }),
    I("held", "fish", "Fish", "דג", { t: "game", g: "fishing", v: 5 }),
    I("held", "pizza", "Pizza slice", "משולש פיצה", { t: "code", c: "UElaWkE=" }),
    I("held", "rocket", "Toy rocket", "טיל צעצוע", { t: "box" }),
    I("held", "book", "Book", "ספר", { t: "tag", g: "word", v: 10 }),

    // ---------- auras ----------
    I("aura", "none", "Nothing", "כלום", { t: "free" }),
    I("aura", "sparkles", "Sparkles", "נצנצים", { t: "coins", v: 80 }),
    I("aura", "hearts", "Floating hearts", "לבבות מרחפים", { t: "stat", s: "pats", v: 150 }),
    I("aura", "bubbles", "Bubbles", "בועות", { t: "game", g: "bubblepop", v: 5 }),
    I("aura", "notes", "Music notes", "תווים", { t: "tag", g: "music", v: 5 }),
    I("aura", "fire", "Fire", "אש", { t: "streak", v: 5 }),
    I("aura", "snow", "Snowfall", "שלג יורד", { t: "month", v: [11, 0, 1] }),
    I("aura", "orbit", "Orbiting stars", "כוכבים מקיפים", { t: "game", g: "orbitbuilder", v: 3 }),
    I("aura", "rainbow", "Rainbow", "קשת בענן", { t: "box" }),
    I("aura", "zap", "Lightning", "ברקים", { t: "spin" }),
    I("aura", "leaves", "Falling leaves", "עלים נושרים", { t: "month", v: [8, 9, 10] }),
    I("aura", "coins", "Coin shower", "גשם מטבעות", { t: "stat", s: "coinsEarned", v: 1000 }),
    I("aura", "glow", "Glow", "זוהר", { t: "premium" }),

    // ---------- rooms ----------
    I("room", "default", "Night sky", "שמי לילה", { t: "free" }),
    I("room", "bedroom", "Cosy bedroom", "חדר שינה", { t: "coins", v: 100 }),
    I("room", "beach", "Beach", "חוף ים", { t: "coins", v: 150 }),
    I("room", "space", "Outer space", "החלל", { t: "game", g: "spaceshooter", v: 5 }),
    I("room", "forest", "Forest", "יער", { t: "streak", v: 10 }),
    I("room", "arcade", "Arcade", "ארקייד", { t: "games", v: 30 }),
    I("room", "underwater", "Under the sea", "מתחת לים", { t: "game", g: "fishing", v: 10 }),
    I("room", "snow", "Snowy hill", "גבעה מושלגת", { t: "month", v: [11, 0, 1] }),
    I("room", "candy", "Candy land", "ארץ הממתקים", { t: "box" }),
    I("room", "castle", "Castle", "טירה", { t: "ach", v: "legend", xp: 4000 }),
    I("room", "stadium", "Stadium", "אצטדיון", { t: "tag", g: "sports", v: 40 }),
    I("room", "volcano", "Volcano", "הר געש", { t: "code", c: "TEFWQQ==" }),
];
export const byId = (slot, id) => ITEMS.find((x) => x.slot === slot && x.id === id);
export const key = (it) => it.slot + ":" + it.id;

// ---------- colours ----------
export const PALETTE = {
    red: ["#ff4d5e", "#ffc2c8"], orange: ["#ff8a3d", "#ffd0ad"], yellow: ["#ffc93d", "#fff0b8"], green: ["#57d164", "#c8f5cc"],
    teal: ["#21d4b4", "#a8f5e6"], blue: ["#3d8bff", "#bcd6ff"], purple: ["#8a5cff", "#cfc0ff"], pink: ["#ff5fa2", "#ffc2dc"],
    brown: ["#9a6a44", "#e3c4a6"], white: ["#e9ecf7", "#ffffff"], black: ["#2a2d42", "#55597a"], gold: ["#e8b227", "#fff1b0"],
    silver: ["#a9b1c8", "#eef1f8"], ice: ["#9fe3ff", "#eafaff"], ghost: ["#cfd6ff", "#ffffff"], neon: ["#39ff88", "#d6ffe6"],
};
// animated colours return null from PALETTE and are handled by fillFor()
export function bodyFill(ctx, id, base, r, t) {
    if (id === "rainbow") { const g = ctx.createLinearGradient(-r, -r, r, r); ["#ff4d5e", "#ffc93d", "#57d164", "#3d8bff", "#8a5cff"].forEach((c, i) => g.addColorStop(((i / 4) + t * 0.1) % 1, c)); return g; }
    if (id === "galaxy") { const g = ctx.createRadialGradient(-r * 0.3, -r * 0.3, r * 0.1, 0, 0, r * 1.1); g.addColorStop(0, "#7c5cff"); g.addColorStop(0.6, "#2a1b6b"); g.addColorStop(1, "#0b0d2a"); return g; }
    if (id === "lava") { const g = ctx.createLinearGradient(0, -r, 0, r); g.addColorStop(0, "#ffcf3d"); g.addColorStop(0.5 + Math.sin(t * 2) * 0.1, "#ff5a1f"); g.addColorStop(1, "#8a1a0a"); return g; }
    return null;
}

// ---------- unlock checks ----------
// ctx = { pet, ach:Set, premium:bool, now:Date }
const STAGE_ORDER = ["egg", "baby", "kid", "teen", "adult", "legend"];
export function progressOf(it, c) {
    const p = c.pet, u = it.u, s = p.stats || {};
    switch (u.t) {
        case "free": return { ok: true };
        case "ach": return { ok: c.ach.has(u.v) || (u.xp != null && p.xp >= u.xp), have: p.xp, need: u.xp };
        case "xp": return { ok: p.xp >= u.v, have: p.xp, need: u.v };
        case "streak": return { ok: (s.bestStreak || 0) >= u.v, have: s.bestStreak || 0, need: u.v };
        case "game": return { ok: ((p.plays || {})[u.g] || 0) >= u.v, have: (p.plays || {})[u.g] || 0, need: u.v };
        case "tag": { const n = c.tagCount ? c.tagCount(u.g) : 0; return { ok: n >= u.v, have: n, need: u.v }; }
        case "games": { const n = Object.keys(p.plays || {}).length; return { ok: n >= u.v, have: n, need: u.v }; }
        case "stat": return { ok: (s[u.s] || 0) >= u.v, have: s[u.s] || 0, need: u.v };
        case "stage": return { ok: STAGE_ORDER.indexOf(c.stage) >= STAGE_ORDER.indexOf(u.v) };
        case "kind": return { ok: c.kind === u.v };
        case "premium": return { ok: !!c.premium };
        case "time": return { ok: !!(s["time_" + u.v]) };
        default: return { ok: false }; // coins, box, spin, code, month: only when owned
    }
}
export function owned(it, c) { return (c.pet.owned || []).includes(key(it)) || progressOf(it, c).ok; }
export function howTo(it, c, he) {
    const u = it.u, pr = progressOf(it, c), T = (e, h) => (he ? h : e);
    const prog = pr.need != null ? ` (${Math.min(pr.have, pr.need)}/${pr.need})` : "";
    const MON = he ? ["ינואר", "פברואר", "מרץ", "אפריל", "מאי", "יוני", "יולי", "אוגוסט", "ספטמבר", "אוקטובר", "נובמבר", "דצמבר"] : ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    switch (u.t) {
        case "ach": { const a = c.achName ? c.achName(u.v) : ""; return T(`🏆 "${a}", or ${u.xp} pet XP`, `🏆 "${a}", או ${u.xp} XP`) + prog; }
        case "xp": return T(`${u.v} pet XP`, `${u.v} XP`) + prog;
        case "coins": return `🪙 ${u.v}`;
        case "streak": return T(`Visit ${u.v} days in a row`, `ביקור ${u.v} ימים ברצף`) + prog;
        case "game": return T(`Play ${c.gameName(u.g)} ${u.v}×`, `שחקו ${c.gameName(u.g)} ${u.v} פעמים`) + prog;
        case "tag": return T(`Play ${u.v} ${u.g} games`, `שחקו ${u.v} משחקי ${c.tagName(u.g)}`) + prog;
        case "games": return T(`Play ${u.v} different games`, `שחקו ${u.v} משחקים שונים`) + prog;
        case "stat": return ({ pats: T(`Pat your pet ${u.v} times`, `ליטוף ${u.v} פעמים`), treats: T(`Give ${u.v} treats`, `${u.v} חטיפים`), coinsEarned: T(`Earn ${u.v} coins in total`, `הרוויחו ${u.v} מטבעות`), mini: T(`Score ${u.v} in Treat Catch`, `${u.v} נקודות בתפיסת חטיפים`) }[u.s] || "") + prog;
        case "stage": return T(`Grow to ${u.v === "legend" ? "Legend" : "Grown-up"}`, `לגדול ל${u.v === "legend" ? "אגדה" : "בוגר"}`);
        case "kind": return T("Evolve into Zappy", "להתפתח לזאפי");
        case "premium": return T("👑 Premium members", "👑 למנויי פרימיום");
        case "time": return { night: T("🌙 Visit your pet at night (9pm–5am)", "🌙 בקרו בלילה (21:00–05:00)"), early: T("🌅 Visit early in the morning (5–8am)", "🌅 בקרו מוקדם בבוקר (05:00–08:00)"), weekend: T("Visit on a weekend", "בקרו בסוף שבוע") }[u.v];
        case "month": return T(`🗓️ Only in ${u.v.map((m) => MON[m]).join(", ")}`, `🗓️ רק ב${u.v.map((m) => MON[m]).join(", ")}`);
        case "box": return T("🎁 Mystery box", "🎁 קופסת הפתעה");
        case "spin": return T("🎡 Daily wheel", "🎡 הגלגל היומי");
        case "code": return T("🔑 Secret code", "🔑 קוד סודי");
    }
    return "";
}
export const codeMatches = (it, text) => it.u.t === "code" && it.u.c === btoa(String(text).trim().toUpperCase());

// ---------- drawing helpers (all centred on the pet, r = body radius) ----------
function star(ctx, x, y, r, n = 5) { ctx.beginPath(); for (let i = 0; i < n * 2; i++) { const a = -Math.PI / 2 + i * Math.PI / n, rr = i % 2 ? r * 0.45 : r; ctx.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); } ctx.closePath(); ctx.fill(); }
function heart(ctx, x, y, s) { ctx.beginPath(); ctx.moveTo(x, y + s * 0.3); ctx.bezierCurveTo(x - s, y - s * 0.4, x - s * 0.4, y - s, x, y - s * 0.35); ctx.bezierCurveTo(x + s * 0.4, y - s, x + s, y - s * 0.4, x, y + s * 0.3); ctx.fill(); }
const rnd = (i) => { const x = Math.sin(i * 12.9898) * 43758.5453; return x - Math.floor(x); };

export function drawPattern(ctx, id, r, t, base) {
    if (!id || id === "none") return;
    ctx.save(); ctx.beginPath(); ctx.ellipse(0, 0, r, r * 0.92, 0, 0, 7); ctx.clip();
    ctx.globalAlpha = 0.33; ctx.fillStyle = "#0b0d1a"; ctx.strokeStyle = "#0b0d1a";
    if (id === "spots") for (let i = 0; i < 9; i++) { ctx.beginPath(); ctx.ellipse((rnd(i) - 0.5) * r * 1.8, (rnd(i + 9) - 0.5) * r * 1.6, r * (0.08 + rnd(i + 3) * 0.08), r * (0.06 + rnd(i + 4) * 0.06), 0, 0, 7); ctx.fill(); }
    if (id === "stripes") { ctx.lineWidth = r * 0.12; for (let x = -r; x <= r; x += r * 0.35) { ctx.beginPath(); ctx.moveTo(x, -r); ctx.lineTo(x + r * 0.2, r); ctx.stroke(); } }
    if (id === "tiger") { ctx.globalAlpha = 0.5; ctx.fillStyle = "#1a1008"; for (let i = 0; i < 7; i++) { const y = -r * 0.8 + i * r * 0.26, sd = i % 2 ? 1 : -1; ctx.beginPath(); ctx.moveTo(sd * r, y); ctx.quadraticCurveTo(sd * r * 0.55, y + r * 0.06, sd * r * 0.35, y + r * 0.12); ctx.quadraticCurveTo(sd * r * 0.6, y + r * 0.14, sd * r, y + r * 0.12); ctx.fill(); } }
    if (id === "hearts") { ctx.globalAlpha = 0.45; ctx.fillStyle = "#ff4d8d"; for (let i = 0; i < 8; i++) heart(ctx, (rnd(i) - 0.5) * r * 1.7, (rnd(i + 7) - 0.5) * r * 1.5, r * 0.12); }
    if (id === "stars") { ctx.globalAlpha = 0.6; ctx.fillStyle = "#fff6a0"; for (let i = 0; i < 9; i++) star(ctx, (rnd(i) - 0.5) * r * 1.8, (rnd(i + 5) - 0.5) * r * 1.6, r * 0.08); }
    if (id === "zigzag") { ctx.lineWidth = r * 0.07; for (let yy = -r * 0.7; yy < r; yy += r * 0.45) { ctx.beginPath(); for (let x = -r; x <= r; x += r * 0.2) ctx.lineTo(x, yy + ((x / (r * 0.2)) % 2 ? r * 0.1 : -r * 0.1)); ctx.stroke(); } }
    if (id === "checks") { const s = r * 0.3; for (let x = -r; x < r; x += s) for (let y = -r; y < r; y += s) if ((Math.round(x / s) + Math.round(y / s)) % 2) ctx.fillRect(x, y, s, s); }
    if (id === "freckle") { ctx.globalAlpha = 0.4; ctx.fillStyle = "#6b3a1a"; for (let i = 0; i < 30; i++) { ctx.beginPath(); ctx.arc((rnd(i) - 0.5) * r * 1.8, (rnd(i + 30) - 0.5) * r * 1.7, r * 0.025, 0, 7); ctx.fill(); } }
    if (id === "bolts") { ctx.globalAlpha = 0.55; ctx.fillStyle = "#ffe14d"; for (let i = 0; i < 5; i++) { const x = (rnd(i) - 0.5) * r * 1.6, y = (rnd(i + 2) - 0.5) * r * 1.4, s = r * 0.18; ctx.beginPath(); ctx.moveTo(x, y - s); ctx.lineTo(x - s * 0.5, y + s * 0.1); ctx.lineTo(x, y + s * 0.1); ctx.lineTo(x - s * 0.3, y + s); ctx.lineTo(x + s * 0.5, y - s * 0.1); ctx.lineTo(x, y - s * 0.1); ctx.closePath(); ctx.fill(); } }
    if (id === "dots") { ctx.globalAlpha = 0.5; ctx.fillStyle = "#fff"; const s = r * 0.3; for (let y = -r; y < r; y += s) for (let x = -r + ((y / s) % 2 ? s / 2 : 0); x < r; x += s) { ctx.beginPath(); ctx.arc(x, y, r * 0.06, 0, 7); ctx.fill(); } }
    if (id === "camo") { ctx.globalAlpha = 0.45; for (let i = 0; i < 14; i++) { ctx.fillStyle = ["#3a5a2a", "#6b7a3a", "#2a3a1a"][i % 3]; ctx.beginPath(); ctx.ellipse((rnd(i) - 0.5) * r * 2, (rnd(i + 14) - 0.5) * r * 2, r * 0.25, r * 0.14, rnd(i + 3) * 3, 0, 7); ctx.fill(); } }
    if (id === "pixel") { const s = r * 0.18; for (let x = -r; x < r; x += s) for (let y = -r; y < r; y += s) if (rnd(Math.round(x * 7 + y * 13)) > 0.62) { ctx.fillStyle = ["#ff4d8d", "#2ee6c9", "#ffc94d", "#7c5cff"][Math.floor(rnd(x + y) * 4)]; ctx.fillRect(x, y, s, s); } }
    if (id === "moons") { ctx.globalAlpha = 0.5; ctx.fillStyle = "#fff6c0"; for (let i = 0; i < 6; i++) { const x = (rnd(i) - 0.5) * r * 1.7, y = (rnd(i + 6) - 0.5) * r * 1.5, s = r * 0.12; ctx.beginPath(); ctx.arc(x, y, s, 0, 7); ctx.fill(); ctx.globalCompositeOperation = "destination-out"; ctx.beginPath(); ctx.arc(x + s * 0.5, y - s * 0.3, s, 0, 7); ctx.fill(); ctx.globalCompositeOperation = "source-over"; } }
    ctx.restore();
}

// returns true if it drew the eyes (so the default eyes are skipped)
export function drawEyes(ctx, id, r, s, t, look = 0) {
    if (!id || id === "normal") return false;
    const ink = "#0b0d1a";
    for (const sd of [-1, 1]) {
        const ex = sd * r * 0.32, ey = -r * 0.18;
        if (id === "big") { ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.ellipse(ex, ey, r * 0.22, r * 0.26, 0, 0, 7); ctx.fill(); ctx.fillStyle = ink; ctx.beginPath(); ctx.arc(ex + look * r * 0.05, ey + r * 0.04, r * 0.15, 0, 7); ctx.fill(); ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(ex + r * 0.06, ey - r * 0.04, r * 0.06, 0, 7); ctx.arc(ex - r * 0.04, ey + r * 0.08, r * 0.03, 0, 7); ctx.fill(); }
        if (id === "sleepy") { ctx.strokeStyle = ink; ctx.lineWidth = 3 * s; ctx.beginPath(); ctx.moveTo(ex - r * 0.13, ey + 2); ctx.lineTo(ex + r * 0.13, ey + 2); ctx.stroke(); if (sd > 0) { ctx.fillStyle = "#cfd6ff"; ctx.font = `800 ${r * 0.22}px Inter, sans-serif`; ctx.fillText("z", r * 0.6, -r * 0.6 - (t * 10 % 10)); } }
        if (id === "happy") { ctx.strokeStyle = ink; ctx.lineWidth = 3.5 * s; ctx.beginPath(); ctx.arc(ex, ey + r * 0.04, r * 0.11, Math.PI * 1.1, Math.PI * 1.9); ctx.stroke(); }
        if (id === "hearts") { ctx.fillStyle = "#ff3b6b"; heart(ctx, ex, ey + r * 0.04, r * 0.17 * (1 + Math.sin(t * 6) * 0.08)); }
        if (id === "stars") { ctx.fillStyle = "#ffc93d"; star(ctx, ex, ey, r * 0.17); ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(ex + r * 0.03, ey - r * 0.04, r * 0.03, 0, 7); ctx.fill(); }
        if (id === "wink") { if (sd < 0) { ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.ellipse(ex, ey, r * 0.17, r * 0.2, 0, 0, 7); ctx.fill(); ctx.fillStyle = ink; ctx.beginPath(); ctx.arc(ex, ey + r * 0.03, r * 0.1, 0, 7); ctx.fill(); } else { ctx.strokeStyle = ink; ctx.lineWidth = 3 * s; ctx.beginPath(); ctx.moveTo(ex - r * 0.12, ey - r * 0.04); ctx.lineTo(ex + r * 0.1, ey + r * 0.02); ctx.lineTo(ex - r * 0.12, ey + r * 0.08); ctx.stroke(); } }
        if (id === "robot") { ctx.fillStyle = "#1a2a3a"; ctx.fillRect(ex - r * 0.16, ey - r * 0.13, r * 0.32, r * 0.26); ctx.fillStyle = Math.sin(t * 4) > 0 ? "#2ee6c9" : "#1aa68f"; ctx.fillRect(ex - r * 0.11, ey - r * 0.04, r * 0.22, r * 0.08); }
        if (id === "angry") { ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.ellipse(ex, ey, r * 0.16, r * 0.17, 0, 0, 7); ctx.fill(); ctx.fillStyle = ink; ctx.beginPath(); ctx.arc(ex, ey + r * 0.04, r * 0.09, 0, 7); ctx.fill(); ctx.strokeStyle = ink; ctx.lineWidth = 4 * s; ctx.beginPath(); ctx.moveTo(ex - sd * r * 0.2, ey - r * 0.26); ctx.lineTo(ex + sd * r * 0.12, ey - r * 0.14); ctx.stroke(); }
        if (id === "dizzy") { ctx.strokeStyle = ink; ctx.lineWidth = 2.5 * s; ctx.beginPath(); for (let a = 0; a < 12; a += 0.3) { const rr = a * r * 0.012; ctx.lineTo(ex + Math.cos(a + t * 5) * rr, ey + Math.sin(a + t * 5) * rr); } ctx.stroke(); }
        if (id === "monocle") { ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.ellipse(ex, ey, r * 0.17, r * 0.2, 0, 0, 7); ctx.fill(); ctx.fillStyle = ink; ctx.beginPath(); ctx.arc(ex, ey + r * 0.03, r * 0.1, 0, 7); ctx.fill(); if (sd > 0) { ctx.strokeStyle = "#e8b227"; ctx.lineWidth = r * 0.04; ctx.beginPath(); ctx.arc(ex, ey, r * 0.24, 0, 7); ctx.stroke(); ctx.lineWidth = r * 0.015; ctx.beginPath(); ctx.moveTo(ex + r * 0.2, ey + r * 0.14); ctx.quadraticCurveTo(ex + r * 0.4, ey + r * 0.5, ex + r * 0.3, ey + r * 0.7); ctx.stroke(); } }
    }
    if (id === "cool") { ctx.fillStyle = ink; ctx.beginPath(); ctx.moveTo(-r * 0.58, -r * 0.3); ctx.lineTo(r * 0.58, -r * 0.3); ctx.lineTo(r * 0.5, -r * 0.08); ctx.quadraticCurveTo(r * 0.32, r * 0.02, r * 0.12, -r * 0.1); ctx.lineTo(-r * 0.12, -r * 0.1); ctx.quadraticCurveTo(-r * 0.32, r * 0.02, -r * 0.5, -r * 0.08); ctx.closePath(); ctx.fill(); ctx.fillStyle = "#ffffff55"; ctx.fillRect(-r * 0.45, -r * 0.25, r * 0.12, r * 0.04); ctx.fillRect(r * 0.2, -r * 0.25, r * 0.12, r * 0.04); }
    if (id === "cyclops") { ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.ellipse(0, -r * 0.2, r * 0.3, r * 0.32, 0, 0, 7); ctx.fill(); ctx.fillStyle = "#3d8bff"; ctx.beginPath(); ctx.arc(look * r * 0.06, -r * 0.16, r * 0.17, 0, 7); ctx.fill(); ctx.fillStyle = ink; ctx.beginPath(); ctx.arc(look * r * 0.06, -r * 0.16, r * 0.09, 0, 7); ctx.fill(); ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(r * 0.07, -r * 0.24, r * 0.05, 0, 7); ctx.fill(); }
    return true;
}

export function drawFace(ctx, id, r, s, t) {
    if (!id || id === "none") return;
    const ink = "#0b0d1a";
    if (id === "tongue") { ctx.fillStyle = "#ff5f7e"; ctx.beginPath(); ctx.ellipse(r * 0.04, r * 0.24, r * 0.08, r * 0.1, 0.2, 0, 7); ctx.fill(); }
    if (id === "teeth") { ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(0, r * 0.08, r * 0.17, 0.1 * Math.PI, 0.9 * Math.PI); ctx.closePath(); ctx.fill(); ctx.strokeStyle = ink; ctx.lineWidth = 2 * s; ctx.stroke(); }
    if (id === "mustache") { ctx.fillStyle = "#3a2414"; for (const sd of [-1, 1]) { ctx.beginPath(); ctx.moveTo(0, r * 0.07); ctx.quadraticCurveTo(sd * r * 0.2, -r * 0.02, sd * r * 0.32, r * 0.08); ctx.quadraticCurveTo(sd * r * 0.2, r * 0.16, 0, r * 0.11); ctx.fill(); } }
    if (id === "fangs") { ctx.fillStyle = "#fff"; for (const sd of [-1, 1]) { ctx.beginPath(); ctx.moveTo(sd * r * 0.12, r * 0.14); ctx.lineTo(sd * r * 0.07, r * 0.14); ctx.lineTo(sd * r * 0.095, r * 0.26); ctx.closePath(); ctx.fill(); } }
    if (id === "freckles") { ctx.fillStyle = "rgba(255,80,140,.6)"; for (const sd of [-1, 1]) { ctx.beginPath(); ctx.ellipse(sd * r * 0.55, r * 0.08, r * 0.15, r * 0.1, 0, 0, 7); ctx.fill(); } }
    if (id === "paint") { for (const sd of [-1, 1]) { ctx.fillStyle = "#ff3b4e"; ctx.fillRect(sd * r * 0.62 - r * 0.08, -r * 0.02, r * 0.16, r * 0.05); ctx.fillStyle = "#fff"; ctx.fillRect(sd * r * 0.62 - r * 0.08, r * 0.03, r * 0.16, r * 0.05); ctx.fillStyle = "#3d8bff"; ctx.fillRect(sd * r * 0.62 - r * 0.08, r * 0.08, r * 0.16, r * 0.05); } }
    if (id === "bandaid") { ctx.save(); ctx.translate(r * 0.5, -r * 0.5); ctx.rotate(0.6); ctx.fillStyle = "#f5c99a"; ctx.fillRect(-r * 0.18, -r * 0.06, r * 0.36, r * 0.12); ctx.fillStyle = "#e0a876"; ctx.fillRect(-r * 0.06, -r * 0.06, r * 0.12, r * 0.12); ctx.restore(); }
    if (id === "beard") { ctx.fillStyle = "#eef0ff"; ctx.beginPath(); ctx.moveTo(-r * 0.4, r * 0.1); ctx.quadraticCurveTo(0, r * 0.25, r * 0.4, r * 0.1); ctx.lineTo(r * 0.15, r * 0.75); ctx.lineTo(0, r * 0.95); ctx.lineTo(-r * 0.15, r * 0.75); ctx.closePath(); ctx.fill(); }
    if (id === "sticker") { ctx.fillStyle = "#ffc93d"; star(ctx, -r * 0.6, -r * 0.5, r * 0.12); }
}

export function drawNeck(ctx, id, r, s, t) {
    if (!id || id === "none") return;
    const y = r * 0.42;
    if (id === "bowtie") { ctx.fillStyle = "#ff3b4e"; for (const sd of [-1, 1]) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(sd * r * 0.22, y - r * 0.12); ctx.lineTo(sd * r * 0.22, y + r * 0.12); ctx.closePath(); ctx.fill(); } ctx.beginPath(); ctx.arc(0, y, r * 0.06, 0, 7); ctx.fill(); }
    if (id === "tie") { ctx.fillStyle = "#3d5bff"; ctx.beginPath(); ctx.moveTo(-r * 0.07, y - r * 0.06); ctx.lineTo(r * 0.07, y - r * 0.06); ctx.lineTo(r * 0.1, y + r * 0.4); ctx.lineTo(0, y + r * 0.5); ctx.lineTo(-r * 0.1, y + r * 0.4); ctx.closePath(); ctx.fill(); ctx.fillStyle = "#ffc93d"; ctx.fillRect(-r * 0.08, y + r * 0.12, r * 0.16, r * 0.04); }
    if (id === "scarf") { ctx.fillStyle = "#ff4d5e"; ctx.beginPath(); ctx.ellipse(0, y, r * 0.78, r * 0.14, 0, 0, 7); ctx.fill(); ctx.fillRect(r * 0.3, y, r * 0.18, r * 0.45 + Math.sin(t * 3) * r * 0.04); ctx.fillStyle = "#fff8"; for (let x = -r * 0.6; x < r * 0.7; x += r * 0.25) ctx.fillRect(x, y - r * 0.12, r * 0.08, r * 0.24); }
    if (id === "bell") { ctx.fillStyle = "#ff4d8d"; ctx.beginPath(); ctx.ellipse(0, y, r * 0.7, r * 0.08, 0, 0, 7); ctx.fill(); ctx.fillStyle = "#ffc93d"; ctx.beginPath(); ctx.arc(0, y + r * 0.12, r * 0.1, 0, 7); ctx.fill(); ctx.fillStyle = "#b8860b"; ctx.fillRect(-r * 0.05, y + r * 0.14, r * 0.1, r * 0.02); }
    if (id === "medal") { ctx.strokeStyle = "#3d8bff"; ctx.lineWidth = r * 0.07; ctx.beginPath(); ctx.moveTo(-r * 0.35, y - r * 0.15); ctx.lineTo(0, y + r * 0.2); ctx.lineTo(r * 0.35, y - r * 0.15); ctx.stroke(); ctx.fillStyle = "#ffc93d"; ctx.beginPath(); ctx.arc(0, y + r * 0.3, r * 0.14, 0, 7); ctx.fill(); ctx.fillStyle = "#fff6c0"; star(ctx, 0, y + r * 0.3, r * 0.07); }
    if (id === "necklace") { for (let i = 0; i <= 10; i++) { const a = Math.PI * (0.15 + 0.07 * i); ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(Math.cos(a) * r * 0.55, y - r * 0.3 + Math.sin(a) * r * 0.45, r * 0.05, 0, 7); ctx.fill(); } }
    if (id === "chain") { ctx.strokeStyle = "#ffc93d"; ctx.lineWidth = r * 0.05; ctx.beginPath(); ctx.arc(0, y - r * 0.3, r * 0.5, Math.PI * 0.18, Math.PI * 0.82); ctx.stroke(); ctx.fillStyle = "#ffc93d"; ctx.font = `900 ${r * 0.22}px Inter, sans-serif`; ctx.textAlign = "center"; ctx.fillText("$", 0, y + r * 0.32); ctx.textAlign = "start"; }
    if (id === "cape") { /* drawn behind the body, see drawBack */ ctx.fillStyle = "#ff3b4e"; ctx.beginPath(); ctx.ellipse(0, y - r * 0.02, r * 0.6, r * 0.08, 0, 0, 7); ctx.fill(); ctx.fillStyle = "#ffc93d"; ctx.beginPath(); ctx.arc(0, y, r * 0.07, 0, 7); ctx.fill(); }
    if (id === "lei") { for (let i = 0; i <= 12; i++) { const a = Math.PI * (0.1 + 0.067 * i); ctx.fillStyle = ["#ff4d8d", "#ffc93d", "#fff", "#ff8a3d"][i % 4]; ctx.beginPath(); ctx.arc(Math.cos(a) * r * 0.62, y - r * 0.35 + Math.sin(a) * r * 0.5, r * 0.08, 0, 7); ctx.fill(); } }
    if (id === "bandana") { ctx.fillStyle = "#3d5bff"; ctx.beginPath(); ctx.moveTo(-r * 0.6, y - r * 0.06); ctx.lineTo(r * 0.6, y - r * 0.06); ctx.lineTo(0, y + r * 0.35); ctx.closePath(); ctx.fill(); ctx.fillStyle = "#fff"; for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.arc(-r * 0.3 + i * r * 0.2, y + (i % 2) * r * 0.08, r * 0.025, 0, 7); ctx.fill(); } }
    if (id === "whistle") { ctx.strokeStyle = "#ff3b4e"; ctx.lineWidth = r * 0.03; ctx.beginPath(); ctx.arc(0, y - r * 0.3, r * 0.45, Math.PI * 0.2, Math.PI * 0.8); ctx.stroke(); ctx.fillStyle = "#c9ccd9"; ctx.fillRect(-r * 0.06, y + r * 0.1, r * 0.2, r * 0.08); ctx.beginPath(); ctx.arc(r * 0.14, y + r * 0.18, r * 0.07, 0, 7); ctx.fill(); }
}
export function drawBack(ctx, o, r, t) {
    if (o.neck === "cape") { ctx.fillStyle = "#c21a2e"; ctx.beginPath(); ctx.moveTo(-r * 0.55, r * 0.35); ctx.quadraticCurveTo(-r * 1.25, r * 0.9 + Math.sin(t * 3) * r * 0.08, -r * 0.9, r * 1.05); ctx.lineTo(r * 0.9, r * 1.05); ctx.quadraticCurveTo(r * 1.25, r * 0.9 + Math.cos(t * 3) * r * 0.08, r * 0.55, r * 0.35); ctx.closePath(); ctx.fill(); }
}

export function drawHeld(ctx, id, r, s, t) {
    if (!id || id === "none") return;
    const x = r * 1.05, y = r * 0.35;
    ctx.save(); ctx.translate(x, y); ctx.scale(1.35, 1.35);
    if (id === "balloon") { ctx.strokeStyle = "#fff"; ctx.lineWidth = 1.5 * s; ctx.beginPath(); ctx.moveTo(0, 0); ctx.quadraticCurveTo(r * 0.1, -r * 0.6, Math.sin(t * 2) * r * 0.08, -r * 1.2); ctx.stroke(); ctx.fillStyle = "#ff4d5e"; ctx.beginPath(); ctx.ellipse(Math.sin(t * 2) * r * 0.08, -r * 1.45, r * 0.26, r * 0.32, 0, 0, 7); ctx.fill(); ctx.fillStyle = "#ffffff66"; ctx.beginPath(); ctx.arc(-r * 0.07, -r * 1.55, r * 0.06, 0, 7); ctx.fill(); }
    if (id === "icecream") { ctx.fillStyle = "#e0a85a"; ctx.beginPath(); ctx.moveTo(-r * 0.12, -r * 0.1); ctx.lineTo(r * 0.12, -r * 0.1); ctx.lineTo(0, r * 0.3); ctx.closePath(); ctx.fill(); ctx.fillStyle = "#ffb3d1"; ctx.beginPath(); ctx.arc(0, -r * 0.18, r * 0.15, 0, 7); ctx.fill(); ctx.fillStyle = "#fff4e0"; ctx.beginPath(); ctx.arc(0, -r * 0.36, r * 0.12, 0, 7); ctx.fill(); ctx.fillStyle = "#ff3b4e"; ctx.beginPath(); ctx.arc(0, -r * 0.5, r * 0.05, 0, 7); ctx.fill(); }
    if (id === "lollipop") { ctx.fillStyle = "#fff"; ctx.fillRect(-r * 0.02, -r * 0.3, r * 0.04, r * 0.5); ctx.save(); ctx.translate(0, -r * 0.45); ctx.rotate(t); for (let i = 0; i < 6; i++) { ctx.fillStyle = i % 2 ? "#ff4d8d" : "#fff"; ctx.beginPath(); ctx.moveTo(0, 0); ctx.arc(0, 0, r * 0.2, (i * Math.PI) / 3, ((i + 1) * Math.PI) / 3); ctx.fill(); } ctx.restore(); }
    if (id === "wand") { ctx.rotate(-0.5); ctx.fillStyle = "#3a2a1a"; ctx.fillRect(-r * 0.03, -r * 0.6, r * 0.06, r * 0.7); ctx.fillStyle = "#ffc93d"; star(ctx, 0, -r * 0.68, r * 0.14); for (let i = 0; i < 3; i++) { ctx.fillStyle = `rgba(255,230,120,${0.5 + Math.sin(t * 5 + i) * 0.5})`; star(ctx, Math.cos(t * 2 + i * 2) * r * 0.25, -r * 0.7 + Math.sin(t * 2 + i * 2) * r * 0.2, r * 0.04); } }
    if (id === "sword") { ctx.rotate(-0.4); ctx.fillStyle = "#c9ccd9"; ctx.beginPath(); ctx.moveTo(-r * 0.05, -r * 0.15); ctx.lineTo(r * 0.05, -r * 0.15); ctx.lineTo(r * 0.03, -r * 0.85); ctx.lineTo(0, -r * 0.92); ctx.lineTo(-r * 0.03, -r * 0.85); ctx.closePath(); ctx.fill(); ctx.fillStyle = "#8a5a2b"; ctx.fillRect(-r * 0.16, -r * 0.17, r * 0.32, r * 0.06); ctx.fillRect(-r * 0.03, -r * 0.12, r * 0.06, r * 0.2); }
    if (id === "controller") { ctx.fillStyle = "#2a2d42"; ctx.beginPath(); ctx.ellipse(0, 0, r * 0.3, r * 0.17, 0, 0, 7); ctx.fill(); ctx.fillStyle = "#fff"; ctx.fillRect(-r * 0.2, -r * 0.02, r * 0.12, r * 0.04); ctx.fillRect(-r * 0.16, -r * 0.06, r * 0.04, r * 0.12); ctx.fillStyle = "#ff4d5e"; ctx.beginPath(); ctx.arc(r * 0.12, -r * 0.03, r * 0.035, 0, 7); ctx.fill(); ctx.fillStyle = "#2ee6c9"; ctx.beginPath(); ctx.arc(r * 0.19, r * 0.03, r * 0.035, 0, 7); ctx.fill(); }
    if (id === "guitar") { ctx.rotate(-0.7); ctx.fillStyle = "#e8913a"; ctx.beginPath(); ctx.ellipse(0, r * 0.1, r * 0.2, r * 0.24, 0, 0, 7); ctx.ellipse(0, -r * 0.18, r * 0.15, r * 0.16, 0, 0, 7); ctx.fill(); ctx.fillStyle = "#3a2414"; ctx.beginPath(); ctx.arc(0, 0, r * 0.06, 0, 7); ctx.fill(); ctx.fillRect(-r * 0.03, -r * 0.75, r * 0.06, r * 0.55); }
    if (id === "trophy") { ctx.fillStyle = "#ffc93d"; ctx.beginPath(); ctx.moveTo(-r * 0.2, -r * 0.5); ctx.lineTo(r * 0.2, -r * 0.5); ctx.quadraticCurveTo(r * 0.2, -r * 0.15, 0, -r * 0.12); ctx.quadraticCurveTo(-r * 0.2, -r * 0.15, -r * 0.2, -r * 0.5); ctx.fill(); ctx.fillRect(-r * 0.04, -r * 0.14, r * 0.08, r * 0.15); ctx.fillRect(-r * 0.14, 0, r * 0.28, r * 0.07); ctx.strokeStyle = "#ffc93d"; ctx.lineWidth = r * 0.04; for (const sd of [-1, 1]) { ctx.beginPath(); ctx.arc(sd * r * 0.22, -r * 0.38, r * 0.08, sd > 0 ? -1.5 : 1.6, sd > 0 ? 1.5 : 4.7); ctx.stroke(); } }
    if (id === "flag") { ctx.fillStyle = "#c9ccd9"; ctx.fillRect(-r * 0.02, -r * 0.9, r * 0.04, r * 1.0); ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.moveTo(r * 0.02, -r * 0.9); for (let i = 0; i <= 8; i++) ctx.lineTo(r * 0.02 + i * r * 0.06, -r * 0.9 + Math.sin(t * 5 + i) * r * 0.03); ctx.lineTo(r * 0.5, -r * 0.5 + Math.sin(t * 5 + 8) * r * 0.03); for (let i = 8; i >= 0; i--) ctx.lineTo(r * 0.02 + i * r * 0.06, -r * 0.5 + Math.sin(t * 5 + i) * r * 0.03); ctx.fill(); ctx.fillStyle = "#3d5bff"; ctx.fillRect(r * 0.02, -r * 0.84, r * 0.48, r * 0.05); ctx.fillRect(r * 0.02, -r * 0.6, r * 0.48, r * 0.05); }
    if (id === "teddy") { ctx.fillStyle = "#b07a45"; for (const [a, b, c] of [[0, 0, 0.2], [0, -0.28, 0.15], [-0.12, -0.4, 0.06], [0.12, -0.4, 0.06], [-0.17, 0.05, 0.07], [0.17, 0.05, 0.07]]) { ctx.beginPath(); ctx.arc(a * r, b * r, c * r, 0, 7); ctx.fill(); } ctx.fillStyle = "#0b0d1a"; ctx.beginPath(); ctx.arc(-r * 0.05, -r * 0.3, r * 0.02, 0, 7); ctx.arc(r * 0.05, -r * 0.3, r * 0.02, 0, 7); ctx.fill(); }
    if (id === "umbrella") { ctx.fillStyle = "#3a2a1a"; ctx.fillRect(-r * 0.02, -r * 1.2, r * 0.04, r * 1.25); ctx.fillStyle = "#3d8bff"; ctx.beginPath(); ctx.arc(0, -r * 1.2, r * 0.55, Math.PI, 0); ctx.closePath(); ctx.fill(); ctx.fillStyle = "#ffc93d"; ctx.beginPath(); ctx.moveTo(0, -r * 1.2); ctx.arc(0, -r * 1.2, r * 0.55, Math.PI * 1.33, Math.PI * 1.66); ctx.closePath(); ctx.fill(); }
    if (id === "fish") { ctx.rotate(Math.sin(t * 6) * 0.2); ctx.fillStyle = "#ff8a3d"; ctx.beginPath(); ctx.ellipse(0, -r * 0.1, r * 0.25, r * 0.12, 0, 0, 7); ctx.fill(); ctx.beginPath(); ctx.moveTo(r * 0.2, -r * 0.1); ctx.lineTo(r * 0.38, -r * 0.22); ctx.lineTo(r * 0.38, r * 0.02); ctx.closePath(); ctx.fill(); ctx.fillStyle = "#0b0d1a"; ctx.beginPath(); ctx.arc(-r * 0.14, -r * 0.13, r * 0.025, 0, 7); ctx.fill(); }
    if (id === "pizza") { ctx.rotate(-0.3); ctx.fillStyle = "#e8b45a"; ctx.beginPath(); ctx.moveTo(-r * 0.22, -r * 0.4); ctx.lineTo(r * 0.22, -r * 0.4); ctx.lineTo(0, r * 0.15); ctx.closePath(); ctx.fill(); ctx.fillStyle = "#ffd94d"; ctx.beginPath(); ctx.moveTo(-r * 0.18, -r * 0.35); ctx.lineTo(r * 0.18, -r * 0.35); ctx.lineTo(0, r * 0.1); ctx.closePath(); ctx.fill(); ctx.fillStyle = "#d62b3a"; for (const [a, b] of [[-0.07, -0.25], [0.07, -0.2], [0, -0.05]]) { ctx.beginPath(); ctx.arc(a * r, b * r, r * 0.04, 0, 7); ctx.fill(); } }
    if (id === "rocket") { ctx.rotate(-0.3 + Math.sin(t * 3) * 0.1); ctx.fillStyle = "#e9ecf7"; ctx.beginPath(); ctx.ellipse(0, -r * 0.3, r * 0.1, r * 0.3, 0, 0, 7); ctx.fill(); ctx.fillStyle = "#ff3b4e"; ctx.beginPath(); ctx.moveTo(-r * 0.1, -r * 0.5); ctx.quadraticCurveTo(0, -r * 0.8, r * 0.1, -r * 0.5); ctx.fill(); ctx.fillRect(-r * 0.16, -r * 0.12, r * 0.32, r * 0.08); ctx.fillStyle = "#ffc93d"; ctx.beginPath(); ctx.moveTo(-r * 0.06, 0); ctx.lineTo(0, r * (0.15 + Math.random() * 0.1)); ctx.lineTo(r * 0.06, 0); ctx.fill(); }
    if (id === "book") { ctx.rotate(-0.2); ctx.fillStyle = "#3d5bff"; ctx.fillRect(-r * 0.22, -r * 0.3, r * 0.44, r * 0.32); ctx.fillStyle = "#fff"; ctx.fillRect(-r * 0.19, -r * 0.27, r * 0.17, r * 0.26); ctx.fillRect(r * 0.02, -r * 0.27, r * 0.17, r * 0.26); }
    ctx.restore();
}

// auras: "back" layer is drawn behind the pet, "front" in front of it
export function drawAura(ctx, id, r, t, layer) {
    if (!id || id === "none") return;
    if (layer === "back") {
        if (id === "glow") { const g = ctx.createRadialGradient(0, 0, r * 0.5, 0, 0, r * 1.7); g.addColorStop(0, `rgba(255,220,120,${0.35 + Math.sin(t * 2) * 0.1})`); g.addColorStop(1, "rgba(255,220,120,0)"); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, r * 1.7, 0, 7); ctx.fill(); }
        if (id === "rainbow") { const cols = ["#ff4d5e", "#ff8a3d", "#ffc93d", "#57d164", "#3d8bff", "#8a5cff"]; ctx.lineWidth = r * 0.09; cols.forEach((c, i) => { ctx.strokeStyle = c; ctx.globalAlpha = 0.7; ctx.beginPath(); ctx.arc(0, r * 0.4, r * (1.6 - i * 0.09), Math.PI * 1.05, Math.PI * 1.95); ctx.stroke(); }); ctx.globalAlpha = 1; }
        if (id === "fire") { for (let i = 0; i < 14; i++) { const a = (i / 14) * Math.PI * 2, h = r * (0.25 + 0.15 * Math.sin(t * 8 + i * 1.7)); ctx.fillStyle = i % 2 ? "rgba(255,138,61,.75)" : "rgba(255,201,61,.75)"; ctx.beginPath(); const x = Math.cos(a) * r * 0.9, y = Math.sin(a) * r * 0.85; ctx.ellipse(x, y - h * 0.4, r * 0.14, h, 0, 0, 7); ctx.fill(); } }
        return;
    }
    if (id === "sparkles") for (let i = 0; i < 7; i++) { const a = t * 0.7 + i * 0.9, d = r * (1.15 + 0.15 * Math.sin(t * 2 + i)); ctx.fillStyle = `rgba(255,240,180,${0.5 + 0.5 * Math.sin(t * 4 + i)})`; star(ctx, Math.cos(a) * d, Math.sin(a) * d * 0.85, r * 0.06, 4); }
    if (id === "hearts") for (let i = 0; i < 5; i++) { const ph = (t * 0.35 + i / 5) % 1; ctx.globalAlpha = 1 - ph; ctx.fillStyle = "#ff4d8d"; heart(ctx, (rnd(i) - 0.5) * r * 2.2, r * 0.6 - ph * r * 2, r * 0.1); }
    if (id === "bubbles") for (let i = 0; i < 7; i++) { const ph = (t * 0.25 + i / 7) % 1; ctx.globalAlpha = 1 - ph; ctx.strokeStyle = "#9fe3ff"; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc((rnd(i + 3) - 0.5) * r * 2.4 + Math.sin(t * 2 + i) * r * 0.1, r - ph * r * 2.4, r * (0.06 + rnd(i) * 0.06), 0, 7); ctx.stroke(); }
    if (id === "notes") for (let i = 0; i < 4; i++) { const ph = (t * 0.3 + i / 4) % 1; ctx.globalAlpha = 1 - ph; ctx.fillStyle = ["#ffc93d", "#2ee6c9", "#ff4d8d", "#cfc0ff"][i]; ctx.font = `900 ${r * 0.3}px serif`; ctx.fillText(i % 2 ? "♪" : "♫", (i % 2 ? 1 : -1) * r * (0.9 + ph * 0.4), -r * 0.3 - ph * r * 1.2); }
    if (id === "snow") for (let i = 0; i < 14; i++) { const ph = (t * 0.12 + rnd(i)) % 1; ctx.globalAlpha = 0.85; ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc((rnd(i + 20) - 0.5) * r * 3 + Math.sin(t + i) * r * 0.1, -r * 1.6 + ph * r * 3, r * 0.035, 0, 7); ctx.fill(); }
    if (id === "leaves") for (let i = 0; i < 7; i++) { const ph = (t * 0.1 + rnd(i)) % 1; ctx.save(); ctx.translate((rnd(i + 5) - 0.5) * r * 3 + Math.sin(t * 2 + i) * r * 0.2, -r * 1.6 + ph * r * 3); ctx.rotate(t * 2 + i); ctx.fillStyle = ["#e8913a", "#d64a2a", "#e8b227"][i % 3]; ctx.beginPath(); ctx.ellipse(0, 0, r * 0.08, r * 0.04, 0, 0, 7); ctx.fill(); ctx.restore(); }
    if (id === "orbit") for (let i = 0; i < 3; i++) { const a = t * 1.5 + (i * Math.PI * 2) / 3, x = Math.cos(a) * r * 1.35, y = Math.sin(a) * r * 0.35 - r * 0.2; if (Math.sin(a) < -0.2 && layer === "front") continue; ctx.fillStyle = ["#ffc93d", "#2ee6c9", "#ff4d8d"][i]; star(ctx, x, y, r * 0.09); }
    if (id === "zap") { if (Math.sin(t * 7) > 0.6) { ctx.strokeStyle = "#ffe14d"; ctx.lineWidth = 3; for (const sd of [-1, 1]) { ctx.beginPath(); let x = sd * r * 1.1, y = -r * 0.9; ctx.moveTo(x, y); for (let k = 0; k < 4; k++) { x += sd * (rnd(k + Math.floor(t * 7)) * r * 0.2 - r * 0.05); y += r * 0.25; ctx.lineTo(x, y); } ctx.stroke(); } } }
    if (id === "coins") for (let i = 0; i < 8; i++) { const ph = (t * 0.3 + rnd(i)) % 1; ctx.globalAlpha = 1; ctx.fillStyle = "#ffc93d"; ctx.beginPath(); ctx.ellipse((rnd(i + 8) - 0.5) * r * 2.6, -r * 1.5 + ph * r * 2.6, r * 0.07 * Math.abs(Math.cos(t * 4 + i)), r * 0.07, 0, 0, 7); ctx.fill(); }
    ctx.globalAlpha = 1;
}

export function drawHat(ctx, id, r, t, s) {
    const y = -r * 0.9;
    const dome = (c, h = 0.42) => { ctx.fillStyle = c; ctx.beginPath(); ctx.ellipse(0, y + r * 0.12, r * 0.66, r * h, 0, Math.PI, 0); ctx.fill(); };
    if (id === "beanie") { dome("#3d8bff", 0.5); ctx.fillStyle = "#2a6add"; ctx.fillRect(-r * 0.68, y + r * 0.02, r * 1.36, r * 0.14); ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(0, y - r * 0.42, r * 0.12, 0, 7); ctx.fill(); }
    if (id === "tophat") { ctx.fillStyle = "#3a3552"; ctx.strokeStyle = "#6a6590"; ctx.lineWidth = r * 0.03; ctx.strokeRect(-r * 0.38, y - r * 0.6, r * 0.76, r * 0.64); ctx.fillRect(-r * 0.62, y + r * 0.02, r * 1.24, r * 0.1); ctx.fillRect(-r * 0.38, y - r * 0.6, r * 0.76, r * 0.64); ctx.fillStyle = "#d62b3a"; ctx.fillRect(-r * 0.38, y - r * 0.1, r * 0.76, r * 0.1); }
    if (id === "cowboy") { ctx.fillStyle = "#9a6a44"; ctx.beginPath(); ctx.ellipse(0, y + r * 0.08, r * 0.95, r * 0.16, 0, 0, 7); ctx.fill(); ctx.beginPath(); ctx.moveTo(-r * 0.4, y + r * 0.06); ctx.quadraticCurveTo(-r * 0.45, y - r * 0.5, -r * 0.1, y - r * 0.42); ctx.quadraticCurveTo(0, y - r * 0.3, r * 0.1, y - r * 0.42); ctx.quadraticCurveTo(r * 0.45, y - r * 0.5, r * 0.4, y + r * 0.06); ctx.fill(); ctx.fillStyle = "#3a2414"; ctx.fillRect(-r * 0.42, y - r * 0.06, r * 0.84, r * 0.08); }
    if (id === "chef") { ctx.fillStyle = "#fff"; ctx.fillRect(-r * 0.42, y - r * 0.15, r * 0.84, r * 0.25); for (const [a, b, c] of [[-0.3, -0.35, 0.25], [0, -0.48, 0.3], [0.3, -0.35, 0.25]]) { ctx.beginPath(); ctx.arc(a * r, y + b * r, c * r, 0, 7); ctx.fill(); } }
    if (id === "pirate") { ctx.fillStyle = "#1a1a2a"; ctx.beginPath(); ctx.moveTo(-r * 0.9, y + r * 0.18); ctx.quadraticCurveTo(-r * 0.55, y - r * 0.8, 0, y - r * 0.6); ctx.quadraticCurveTo(r * 0.55, y - r * 0.8, r * 0.9, y + r * 0.18); ctx.quadraticCurveTo(0, y - r * 0.05, -r * 0.9, y + r * 0.18); ctx.fill(); ctx.strokeStyle = "#e8b227"; ctx.lineWidth = r * 0.04; ctx.beginPath(); ctx.moveTo(-r * 0.85, y + r * 0.12); ctx.quadraticCurveTo(0, y - r * 0.1, r * 0.85, y + r * 0.12); ctx.stroke(); ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(0, y - r * 0.32, r * 0.11, 0, 7); ctx.fill(); ctx.fillRect(-r * 0.06, y - r * 0.24, r * 0.12, r * 0.07); ctx.strokeStyle = "#fff"; ctx.lineWidth = r * 0.035; ctx.beginPath(); ctx.moveTo(-r * 0.16, y - r * 0.12); ctx.lineTo(r * 0.16, y - r * 0.02); ctx.moveTo(r * 0.16, y - r * 0.12); ctx.lineTo(-r * 0.16, y - r * 0.02); ctx.stroke(); ctx.fillStyle = "#1a1a2a"; ctx.beginPath(); ctx.arc(-r * 0.04, y - r * 0.33, r * 0.03, 0, 7); ctx.arc(r * 0.04, y - r * 0.33, r * 0.03, 0, 7); ctx.fill(); }
    if (id === "helmet") { dome("#d62b3a", 0.62); ctx.fillStyle = "#1a2a3a"; ctx.beginPath(); ctx.ellipse(0, y + r * 0.02, r * 0.5, r * 0.14, 0, Math.PI, 0); ctx.fill(); ctx.fillStyle = "#fff"; ctx.fillRect(-r * 0.05, y - r * 0.5, r * 0.1, r * 0.4); }
    if (id === "astronaut") { ctx.strokeStyle = "#e9ecf7"; ctx.lineWidth = r * 0.08; ctx.fillStyle = "rgba(160,220,255,.18)"; ctx.beginPath(); ctx.arc(0, -r * 0.1, r * 1.1, 0, 7); ctx.fill(); ctx.stroke(); ctx.fillStyle = "#ffffff66"; ctx.beginPath(); ctx.ellipse(-r * 0.5, -r * 0.6, r * 0.12, r * 0.25, 0.6, 0, 7); ctx.fill(); }
    if (id === "viking") { dome("#9aa0b5", 0.42); ctx.fillStyle = "#f5ecd5"; for (const sd of [-1, 1]) { ctx.beginPath(); ctx.moveTo(sd * r * 0.5, y); ctx.quadraticCurveTo(sd * r * 0.95, y - r * 0.2, sd * r * 0.85, y - r * 0.7); ctx.quadraticCurveTo(sd * r * 0.75, y - r * 0.2, sd * r * 0.4, y - r * 0.12); ctx.fill(); } }
    if (id === "propeller") { dome("#ffc93d", 0.36); ctx.fillStyle = "#d62b3a"; ctx.beginPath(); ctx.ellipse(0, y + r * 0.12, r * 0.66, r * 0.36, 0, Math.PI, Math.PI * 1.33); ctx.lineTo(0, y + r * 0.12); ctx.fill(); ctx.fillStyle = "#555"; ctx.fillRect(-r * 0.02, y - r * 0.45, r * 0.04, r * 0.2); ctx.fillStyle = "#3d8bff"; const w = Math.cos(t * 18) * r * 0.45; ctx.beginPath(); ctx.ellipse(0, y - r * 0.46, Math.abs(w), r * 0.05, 0, 0, 7); ctx.fill(); }
    if (id === "grad") { ctx.fillStyle = "#1a1a2a"; ctx.beginPath(); ctx.ellipse(0, y + r * 0.05, r * 0.45, r * 0.2, 0, Math.PI, 0); ctx.fill(); ctx.beginPath(); ctx.moveTo(-r * 0.7, y - r * 0.1); ctx.lineTo(0, y - r * 0.32); ctx.lineTo(r * 0.7, y - r * 0.1); ctx.lineTo(0, y + r * 0.1); ctx.closePath(); ctx.fill(); ctx.strokeStyle = "#ffc93d"; ctx.lineWidth = r * 0.03; ctx.beginPath(); ctx.moveTo(0, y - r * 0.12); ctx.lineTo(r * 0.5, y + r * 0.05 + Math.sin(t * 3) * r * 0.03); ctx.lineTo(r * 0.5, y + r * 0.35); ctx.stroke(); }
    if (id === "halo") { ctx.strokeStyle = "#ffe28a"; ctx.lineWidth = r * 0.07; ctx.shadowColor = "#ffe28a"; ctx.shadowBlur = 12; ctx.beginPath(); ctx.ellipse(0, y - r * 0.35 + Math.sin(t * 2) * r * 0.04, r * 0.45, r * 0.12, 0, 0, 7); ctx.stroke(); ctx.shadowBlur = 0; }
    if (id === "horns") { ctx.fillStyle = "#d62b3a"; for (const sd of [-1, 1]) { ctx.beginPath(); ctx.moveTo(sd * r * 0.25, y + r * 0.15); ctx.quadraticCurveTo(sd * r * 0.5, y - r * 0.1, sd * r * 0.45, y - r * 0.35); ctx.quadraticCurveTo(sd * r * 0.35, y - r * 0.05, sd * r * 0.12, y + r * 0.08); ctx.fill(); } }
    if (id === "flower") { for (let i = 0; i < 7; i++) { const a = Math.PI * (1.08 + i * 0.14); const x = Math.cos(a) * r * 0.62, yy = y + r * 0.35 + Math.sin(a) * r * 0.45; ctx.fillStyle = ["#ff4d8d", "#ffc93d", "#fff", "#cfc0ff"][i % 4]; for (let k = 0; k < 5; k++) { ctx.beginPath(); ctx.arc(x + Math.cos(k * 1.256) * r * 0.06, yy + Math.sin(k * 1.256) * r * 0.06, r * 0.05, 0, 7); ctx.fill(); } ctx.fillStyle = "#ffc93d"; ctx.beginPath(); ctx.arc(x, yy, r * 0.035, 0, 7); ctx.fill(); } }
    if (id === "santa") { ctx.fillStyle = "#d62b3a"; ctx.beginPath(); ctx.moveTo(-r * 0.6, y + r * 0.08); ctx.quadraticCurveTo(0, y - r * 0.6, r * 0.7, y - r * 0.4); ctx.lineTo(r * 0.6, y + r * 0.08); ctx.closePath(); ctx.fill(); ctx.fillStyle = "#fff"; ctx.fillRect(-r * 0.65, y, r * 1.3, r * 0.14); ctx.beginPath(); ctx.arc(r * 0.72, y - r * 0.38, r * 0.1, 0, 7); ctx.fill(); }
    if (id === "bunny") { for (const sd of [-1, 1]) { ctx.save(); ctx.translate(sd * r * 0.3, y); ctx.rotate(sd * (0.15 + Math.sin(t * 2) * 0.05)); ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.ellipse(0, -r * 0.45, r * 0.14, r * 0.45, 0, 0, 7); ctx.fill(); ctx.fillStyle = "#ffb3d1"; ctx.beginPath(); ctx.ellipse(0, -r * 0.45, r * 0.07, r * 0.33, 0, 0, 7); ctx.fill(); ctx.restore(); } }
    if (id === "cat") { for (const sd of [-1, 1]) { ctx.fillStyle = "#2a2d42"; ctx.beginPath(); ctx.moveTo(sd * r * 0.15, y + r * 0.12); ctx.lineTo(sd * r * 0.45, y - r * 0.35); ctx.lineTo(sd * r * 0.62, y + r * 0.2); ctx.closePath(); ctx.fill(); ctx.fillStyle = "#ffb3d1"; ctx.beginPath(); ctx.moveTo(sd * r * 0.25, y + r * 0.1); ctx.lineTo(sd * r * 0.44, y - r * 0.2); ctx.lineTo(sd * r * 0.53, y + r * 0.14); ctx.closePath(); ctx.fill(); } }
    if (id === "unicorn") { const g = ctx.createLinearGradient(0, y - r * 0.8, 0, y); g.addColorStop(0, "#ffe28a"); g.addColorStop(1, "#ffb3d1"); ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(-r * 0.12, y + r * 0.08); ctx.lineTo(0, y - r * 0.75); ctx.lineTo(r * 0.12, y + r * 0.08); ctx.closePath(); ctx.fill(); ctx.strokeStyle = "#fff8"; ctx.lineWidth = 2; for (let k = 1; k < 4; k++) { ctx.beginPath(); ctx.moveTo(-r * 0.1 + k * r * 0.025, y - k * r * 0.2); ctx.lineTo(r * 0.1 - k * r * 0.025, y - k * r * 0.2 + r * 0.06); ctx.stroke(); } }
    if (id === "ninja") { ctx.fillStyle = "#1a1a2a"; ctx.fillRect(-r * 0.95, -r * 0.55, r * 1.9, r * 0.16); ctx.fillStyle = "#c9ccd9"; ctx.fillRect(-r * 0.12, -r * 0.53, r * 0.24, r * 0.12); ctx.fillStyle = "#1a1a2a"; ctx.beginPath(); ctx.moveTo(r * 0.9, -r * 0.5); ctx.lineTo(r * 1.3, -r * 0.6 + Math.sin(t * 6) * r * 0.06); ctx.lineTo(r * 1.25, -r * 0.4 + Math.sin(t * 6 + 1) * r * 0.06); ctx.closePath(); ctx.fill(); }
    if (id === "noam") { dome("#7c5cff", 0.42); ctx.fillRect(0, y + r * 0.02, r * 0.85, r * 0.1); ctx.fillStyle = "#2ee6c9"; ctx.font = `900 ${r * 0.28}px Inter, sans-serif`; ctx.textAlign = "center"; ctx.fillText("N", 0, y - r * 0.02); ctx.textAlign = "start"; }
    if (id === "jester") { const cols = ["#d62b3a", "#3d8bff", "#ffc93d"]; for (let k = -1; k <= 1; k++) { ctx.fillStyle = cols[k + 1]; ctx.beginPath(); ctx.moveTo(k * r * 0.3 - r * 0.2, y + r * 0.1); ctx.quadraticCurveTo(k * r * 0.6, y - r * 0.5, k * r * 0.75, y - r * 0.3 + (k ? 0 : -r * 0.2)); ctx.lineTo(k * r * 0.3 + r * 0.2, y + r * 0.1); ctx.fill(); ctx.fillStyle = "#ffc93d"; ctx.beginPath(); ctx.arc(k * r * 0.75, y - r * 0.3 + (k ? 0 : -r * 0.2), r * 0.07, 0, 7); ctx.fill(); } }
    if (id === "diamond") { ctx.fillStyle = "#e8eef8"; ctx.beginPath(); ctx.moveTo(-r * 0.5, y + r * 0.1); ctx.lineTo(-r * 0.3, y - r * 0.15); ctx.lineTo(0, y - r * 0.32); ctx.lineTo(r * 0.3, y - r * 0.15); ctx.lineTo(r * 0.5, y + r * 0.1); ctx.closePath(); ctx.fill(); for (const [x, yy, c] of [[0, -0.18, "#5cc8ff"], [-0.25, -0.02, "#ff4d8d"], [0.25, -0.02, "#2ee6c9"]]) { ctx.fillStyle = c; ctx.beginPath(); ctx.moveTo(x * r, y + yy * r - r * 0.07); ctx.lineTo(x * r + r * 0.06, y + yy * r); ctx.lineTo(x * r, y + yy * r + r * 0.07); ctx.lineTo(x * r - r * 0.06, y + yy * r); ctx.fill(); } }
    if (id === "sprout") { ctx.strokeStyle = "#3fbf5a"; ctx.lineWidth = r * 0.05; ctx.beginPath(); ctx.moveTo(0, y + r * 0.05); ctx.lineTo(0, y - r * 0.3); ctx.stroke(); ctx.fillStyle = "#57d164"; for (const sd of [-1, 1]) { ctx.beginPath(); ctx.ellipse(sd * r * 0.14, y - r * 0.33 + Math.sin(t * 2) * r * 0.02, r * 0.15, r * 0.07, sd * 0.4, 0, 7); ctx.fill(); } }
    if (id === "laurel") { ctx.fillStyle = "#e8b227"; for (const sd of [-1, 1]) for (let k = 0; k < 6; k++) { const a = Math.PI * (sd > 0 ? 1.95 - k * 0.1 : 1.05 + k * 0.1); ctx.beginPath(); ctx.ellipse(Math.cos(a) * r * 0.65, y + r * 0.35 + Math.sin(a) * r * 0.45, r * 0.09, r * 0.04, a + Math.PI / 2, 0, 7); ctx.fill(); } }
}

// ---------- rooms (backgrounds for the pet page and the share card) ----------
export function drawRoom(ctx, id, W, H, t) {
    const sky = (a, b) => { const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, a); g.addColorStop(1, b); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); };
    const floorY = H * 0.86;
    if (!id || id === "default") { const g = ctx.createRadialGradient(W / 2, H * 0.85, 10, W / 2, H * 0.6, W * 0.7); g.addColorStop(0, "#2a2160"); g.addColorStop(1, "#171b36"); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); for (let i = 0; i < 40; i++) { ctx.fillStyle = `rgba(255,255,255,${0.2 + 0.4 * Math.abs(Math.sin(t + i))})`; ctx.fillRect(rnd(i) * W, rnd(i + 40) * H * 0.6, 1.5, 1.5); } ctx.fillStyle = "#ffffff08"; ctx.beginPath(); ctx.ellipse(W / 2, floorY + 6, W * 0.45, 40, 0, 0, 7); ctx.fill(); return; }
    if (id === "bedroom") { sky("#ffe9cf", "#f5d3ad"); ctx.fillStyle = "#c89466"; ctx.fillRect(0, floorY, W, H); ctx.fillStyle = "#8fd3ff"; ctx.fillRect(W * 0.08, H * 0.12, W * 0.22, H * 0.3); ctx.strokeStyle = "#fff"; ctx.lineWidth = 6; ctx.strokeRect(W * 0.08, H * 0.12, W * 0.22, H * 0.3); ctx.beginPath(); ctx.moveTo(W * 0.19, H * 0.12); ctx.lineTo(W * 0.19, H * 0.42); ctx.stroke(); ctx.fillStyle = "#7c5cff"; ctx.fillRect(W * 0.72, floorY - H * 0.18, W * 0.24, H * 0.18); ctx.fillStyle = "#fff"; ctx.fillRect(W * 0.74, floorY - H * 0.24, W * 0.08, H * 0.07); ctx.fillStyle = "#ff4d8d"; ctx.beginPath(); ctx.ellipse(W / 2, floorY + 18, W * 0.3, 18, 0, 0, 7); ctx.fill(); ctx.fillStyle = "#ffc93d"; ctx.fillRect(W * 0.82, H * 0.1, 6, H * 0.15); ctx.beginPath(); ctx.arc(W * 0.83, H * 0.1, 18, Math.PI, 0); ctx.fill(); return; }
    if (id === "beach") { sky("#7fd0ff", "#d4f0ff"); ctx.fillStyle = "#ffe14d"; ctx.beginPath(); ctx.arc(W * 0.82, H * 0.18, 34, 0, 7); ctx.fill(); ctx.fillStyle = "#2a8ad9"; ctx.fillRect(0, H * 0.6, W, H * 0.2); ctx.fillStyle = "#ffffff88"; for (let x = 0; x < W; x += 40) ctx.fillRect(x + ((t * 20) % 40), H * 0.62 + Math.sin(x + t) * 3, 20, 3); ctx.fillStyle = "#f3d38a"; ctx.fillRect(0, H * 0.78, W, H); ctx.strokeStyle = "#8a5a2b"; ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(W * 0.1, H * 0.85); ctx.quadraticCurveTo(W * 0.12, H * 0.5, W * 0.2, H * 0.3); ctx.stroke(); ctx.fillStyle = "#2ea84a"; for (let k = 0; k < 5; k++) { ctx.beginPath(); ctx.ellipse(W * 0.2 + Math.cos(k * 1.2) * 40, H * 0.3 + Math.sin(k * 1.2) * 15, 50, 12, k * 1.2, 0, 7); ctx.fill(); } return; }
    if (id === "space") { ctx.fillStyle = "#04030f"; ctx.fillRect(0, 0, W, H); for (let i = 0; i < 90; i++) { ctx.fillStyle = `rgba(255,255,255,${0.3 + 0.6 * Math.abs(Math.sin(t * 0.7 + i))})`; ctx.fillRect(rnd(i) * W, rnd(i + 90) * H, 1.5, 1.5); } ctx.fillStyle = "#ff8a3d"; ctx.beginPath(); ctx.arc(W * 0.85, H * 0.2, 40, 0, 7); ctx.fill(); ctx.strokeStyle = "#ffd0ad"; ctx.lineWidth = 4; ctx.beginPath(); ctx.ellipse(W * 0.85, H * 0.2, 65, 14, -0.3, 0, 7); ctx.stroke(); ctx.fillStyle = "#8a8fa3"; ctx.beginPath(); ctx.ellipse(W / 2, H + 120, W * 0.8, 200, 0, 0, 7); ctx.fill(); ctx.fillStyle = "#6a6f80"; for (let i = 0; i < 6; i++) { ctx.beginPath(); ctx.ellipse(rnd(i) * W, floorY + 20 + rnd(i + 3) * 30, 20, 6, 0, 0, 7); ctx.fill(); } return; }
    if (id === "forest") { sky("#bfe8ff", "#e8f7ff"); for (let k = 0; k < 2; k++) { ctx.fillStyle = k ? "#2f7a3f" : "#5fa86a"; for (let i = 0; i < 8; i++) { const x = i * W / 7 + k * 40, h = H * (0.4 + rnd(i + k * 8) * 0.2); ctx.beginPath(); ctx.moveTo(x - 40, floorY); ctx.lineTo(x, floorY - h); ctx.lineTo(x + 40, floorY); ctx.fill(); } } ctx.fillStyle = "#4f8f3a"; ctx.fillRect(0, floorY, W, H); for (let i = 0; i < 8; i++) { ctx.fillStyle = ["#ff4d8d", "#ffc93d", "#fff"][i % 3]; ctx.beginPath(); ctx.arc(rnd(i + 30) * W, floorY + 10 + rnd(i) * 40, 4, 0, 7); ctx.fill(); } return; }
    if (id === "arcade") { ctx.fillStyle = "#14082a"; ctx.fillRect(0, 0, W, H); for (let i = 0; i < 4; i++) { const x = 20 + i * (W - 40) / 4; ctx.fillStyle = ["#7c5cff", "#ff4d8d", "#2ee6c9", "#ffc93d"][i]; ctx.fillRect(x, H * 0.25, 70, H * 0.6); ctx.fillStyle = "#0b0d1a"; ctx.fillRect(x + 8, H * 0.3, 54, 40); ctx.fillStyle = `hsl(${(t * 60 + i * 90) % 360},80%,60%)`; ctx.fillRect(x + 14, H * 0.32 + (Math.sin(t * 3 + i) + 1) * 10, 10, 10); } ctx.fillStyle = "#2a1650"; ctx.fillRect(0, floorY, W, H); ctx.strokeStyle = "#ff4dd2"; ctx.lineWidth = 3; ctx.shadowColor = "#ff4dd2"; ctx.shadowBlur = 10; ctx.font = "900 26px 'Press Start 2P', monospace"; ctx.strokeText("ARCADE", W / 2 - 90, H * 0.14); ctx.shadowBlur = 0; return; }
    if (id === "underwater") { sky("#2ec4f1", "#06305a"); for (let i = 0; i < 6; i++) { ctx.strokeStyle = ["#2ea84a", "#5cd65c", "#a64dff"][i % 3]; ctx.lineWidth = 8; const x = rnd(i) * W; ctx.beginPath(); ctx.moveTo(x, H); for (let y = H; y > H * 0.55; y -= 12) ctx.lineTo(x + Math.sin(y / 20 + t * 2) * 10, y); ctx.stroke(); } ctx.fillStyle = "#e8d29a"; ctx.fillRect(0, floorY + 10, W, H); for (let i = 0; i < 12; i++) { const ph = (t * 0.2 + rnd(i)) % 1; ctx.strokeStyle = "#ffffff77"; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(rnd(i + 4) * W, H - ph * H, 3 + rnd(i) * 5, 0, 7); ctx.stroke(); } return; }
    if (id === "snow") { sky("#a8c8ec", "#e8f2ff"); ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.ellipse(W * 0.2, floorY + 30, W * 0.5, 120, 0, Math.PI, 0); ctx.ellipse(W * 0.85, floorY + 40, W * 0.4, 100, 0, Math.PI, 0); ctx.fill(); ctx.fillRect(0, floorY, W, H); for (let i = 0; i < 40; i++) { ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc((rnd(i) * W + Math.sin(t + i) * 10) % W, (rnd(i + 40) * H + t * 30) % H, 2.5, 0, 7); ctx.fill(); } return; }
    if (id === "candy") { sky("#ffd6ec", "#fff0f8"); for (let i = 0; i < 5; i++) { const x = 40 + i * W / 5; ctx.fillStyle = "#fff"; ctx.fillRect(x - 3, floorY - 120, 6, 120); ctx.save(); ctx.translate(x, floorY - 130); ctx.rotate(t * 0.5 + i); for (let k = 0; k < 6; k++) { ctx.fillStyle = k % 2 ? ["#ff4d8d", "#2ee6c9", "#ffc93d", "#7c5cff", "#ff8a3d"][i] : "#fff"; ctx.beginPath(); ctx.moveTo(0, 0); ctx.arc(0, 0, 28, (k * Math.PI) / 3, ((k + 1) * Math.PI) / 3); ctx.fill(); } ctx.restore(); } ctx.fillStyle = "#ffb3d1"; ctx.fillRect(0, floorY, W, H); ctx.fillStyle = "#fff"; for (let x = 0; x < W; x += 30) { ctx.beginPath(); ctx.arc(x + 15, floorY, 15, 0, Math.PI); ctx.fill(); } return; }
    if (id === "castle") { sky("#3a2a6a", "#7a5aaa"); ctx.fillStyle = "#5a5f70"; ctx.fillRect(W * 0.1, H * 0.3, W * 0.8, floorY - H * 0.3); for (let x = W * 0.1; x < W * 0.9; x += 40) ctx.fillRect(x, H * 0.26, 24, 20); ctx.fillStyle = "#4a4f60"; for (const x of [W * 0.06, W * 0.82]) { ctx.fillRect(x, H * 0.15, W * 0.12, floorY - H * 0.15); ctx.fillStyle = "#d62b3a"; ctx.beginPath(); ctx.moveTo(x - 6, H * 0.15); ctx.lineTo(x + W * 0.06, H * 0.02); ctx.lineTo(x + W * 0.12 + 6, H * 0.15); ctx.fill(); ctx.fillStyle = "#4a4f60"; } ctx.fillStyle = "#ffc93d"; for (const x of [W * 0.3, W * 0.65]) { ctx.beginPath(); ctx.arc(x, H * 0.45, 14, Math.PI, 0); ctx.fill(); ctx.fillRect(x - 14, H * 0.45, 28, 26); } ctx.fillStyle = "#8a2a3a"; ctx.fillRect(W * 0.3, floorY, W * 0.4, H); return; }
    if (id === "stadium") { sky("#1a3a6a", "#3a6aaa"); for (let i = 0; i < 4; i++) { ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(W * (0.15 + i * 0.23), H * 0.08, 10, 0, 7); ctx.fill(); } ctx.fillStyle = "#3a4a6a"; ctx.fillRect(0, H * 0.25, W, H * 0.3); for (let i = 0; i < 120; i++) { ctx.fillStyle = ["#ff4d5e", "#ffc93d", "#fff", "#3d8bff"][i % 4]; ctx.fillRect(rnd(i) * W, H * 0.28 + rnd(i + 120) * H * 0.24 + (Math.sin(t * 6 + i) > 0.95 ? -4 : 0), 4, 4); } ctx.fillStyle = "#3f8a3a"; ctx.fillRect(0, H * 0.55, W, H); ctx.strokeStyle = "#ffffffaa"; ctx.lineWidth = 3; ctx.beginPath(); ctx.ellipse(W / 2, floorY, 120, 30, 0, 0, 7); ctx.stroke(); return; }
    if (id === "volcano") { sky("#2a0a0a", "#7a2a1a"); ctx.fillStyle = "#3a1a1a"; ctx.beginPath(); ctx.moveTo(W * 0.1, floorY); ctx.lineTo(W * 0.42, H * 0.22); ctx.lineTo(W * 0.58, H * 0.22); ctx.lineTo(W * 0.9, floorY); ctx.fill(); ctx.fillStyle = "#ff5a1f"; ctx.beginPath(); ctx.moveTo(W * 0.44, H * 0.22); ctx.lineTo(W * 0.56, H * 0.22); ctx.lineTo(W * 0.6, H * 0.45); ctx.lineTo(W * 0.4, H * 0.5); ctx.fill(); for (let i = 0; i < 10; i++) { const ph = (t * 0.5 + rnd(i)) % 1; ctx.fillStyle = `rgba(255,${120 + i * 10},40,${1 - ph})`; ctx.beginPath(); ctx.arc(W / 2 + (rnd(i + 3) - 0.5) * 100 * ph, H * 0.2 - ph * H * 0.2, 5, 0, 7); ctx.fill(); } ctx.fillStyle = "#1a0a0a"; ctx.fillRect(0, floorY, W, H); return; }
}

// what the daily wheel can land on
export const WHEEL = [
    { kind: "coins", v: 10 }, { kind: "coins", v: 25 }, { kind: "item" }, { kind: "coins", v: 15 },
    { kind: "coins", v: 50 }, { kind: "xp", v: 30 }, { kind: "coins", v: 20 }, { kind: "item" },
];
export const BOX_PRICE = 80;
