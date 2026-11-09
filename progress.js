// progress.js — XP, levels, achievements, daily challenge and the name filter.
// Pure functions (no Firebase), so any page can use them.
import { GAMES } from "./games.js";

// ---------- Score targets per game (used by daily challenges & achievements) ----------
// easy = a fair daily goal, hard = an achievement for really good players
export const TARGETS = {
    noametry:     { easy: 15,   hard: 60,    unit: "points" },
    spaceshooter: { easy: 800,  hard: 5000,  unit: "points" },
    game2048:     { easy: 1500, hard: 10000, unit: "points" },
    breakout:     { easy: 400,  hard: 2500,  unit: "points" },
    memory:       { easy: 400,  hard: 700,   unit: "points" },
    subwaysurfer: { easy: 250,  hard: 1500,  unit: "points" },
    dinogame:     { easy: 300,  hard: 1500,  unit: "points" },
    flappybird:   { easy: 5,    hard: 30,    unit: "pipes" },
    snake:        { easy: 100,  hard: 500,   unit: "points" },
    pacman:       { easy: 500,  hard: 2500,  unit: "points" },
    tetris:       { easy: 400,  hard: 4000,  unit: "points" },
    mario:        { easy: 1000, hard: 5000,  unit: "points" },
    bubblebobble: { easy: 1000, hard: 5000,  unit: "points" },
    motorracing:  { easy: 300,  hard: 1500,  unit: "points" },
    soccer:       { easy: 2,    hard: 6,     unit: "goals" },
    paddlebattle: { easy: 300,  hard: 1200,  unit: "points" },
    fourinarow:   { easy: 1,    hard: 5,     unit: "wins in a row" },
    minefinder:   { easy: 300,  hard: 2500,  unit: "points" },
    molemash:     { easy: 300,  hard: 1200,  unit: "points" },
    colorecho:    { easy: 6,    hard: 15,    unit: "rounds" },
    stacktower:   { easy: 15,   hard: 50,    unit: "blocks" },
    spacerocks:   { easy: 2000, hard: 10000, unit: "points" },
    mathblitz:    { easy: 300,  hard: 1500,  unit: "points" },
    typingrain:   { easy: 400,  hard: 2500,  unit: "points" },
    penalty:      { easy: 300,  hard: 1200,  unit: "points" },
    keepyuppy:    { easy: 15,   hard: 80,    unit: "points" },
    minigolf:     { easy: 1500, hard: 3500,  unit: "points" },
    bowling:      { easy: 80,   hard: 180,   unit: "points" },
    tennis:       { easy: 100,  hard: 500,   unit: "points" },
    airhockey:    { easy: 300,  hard: 1200,  unit: "points" },
    hoopshot:     { easy: 15,   hard: 60,    unit: "points" },
    gemswap:      { easy: 800,  hard: 3000,  unit: "points" },
    skyclimber:   { easy: 300,  hard: 2000,  unit: "points" },
    fruitslash:   { easy: 150,  hard: 600,   unit: "points" },
    headerhero:   { easy: 300,  hard: 1200,  unit: "points" },
    fiveaside:    { easy: 200,  hard: 800,   unit: "points" },
    checkers:     { easy: 1,    hard: 4,     unit: "wins in a row" },
    sudoku:       { easy: 800,  hard: 3000,  unit: "points" },
    solitaire:    { easy: 300,  hard: 1500,  unit: "points" },
    seabattle:    { easy: 500,  hard: 1500,  unit: "points" },
    castledefense:{ easy: 800,  hard: 2500,  unit: "points" },
    wordguess:    { easy: 300,  hard: 1500,  unit: "points" },
    wordsearch:   { easy: 300,  hard: 1500,  unit: "points" },
    flagquiz:     { easy: 400,  hard: 1200,  unit: "points" },
    rhythmtap:    { easy: 5000, hard: 30000, unit: "points" },
    idlebakery:   { easy: 1000, hard: 100000, unit: "cupcakes" },
    tankbattle:   { easy: 1000, hard: 5000,  unit: "points" },
    fishing:      { easy: 200,  hard: 800,   unit: "points" },
    maze:         { easy: 200,  hard: 800,   unit: "points" }
};

// ---------- Dates ----------
export function dayKey(d = new Date()) {
    // local date, e.g. "2026-11-04"
    const z = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${z(d.getMonth() + 1)}-${z(d.getDate())}`;
}
export function weekKey(d = new Date()) {
    // ISO week, e.g. "2026-W45" (weeks start on Monday)
    const t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    const day = t.getUTCDay() || 7;
    t.setUTCDate(t.getUTCDate() + 4 - day);
    const y = t.getUTCFullYear();
    const w = Math.ceil(((t - Date.UTC(y, 0, 1)) / 864e5 + 1) / 7);
    return `${y}-W${String(w).padStart(2, "0")}`;
}

// ---------- Daily challenge: same for everyone, changes every day ----------
export function dailyChallenge(d = new Date(), premiumGames = []) {
    // Only free games, so every player can do it
    const pool = Object.keys(TARGETS).filter((id) => !premiumGames.includes(id));
    const key = dayKey(d);
    let h = 0;
    for (const ch of key) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
    const game = pool[h % pool.length];
    return { day: key, game, target: TARGETS[game].easy, unit: TARGETS[game].unit };
}
export function dailyStreak(daily = {}, d = new Date()) {
    let streak = 0;
    const t = new Date(d);
    if (!daily[dayKey(t)]) t.setDate(t.getDate() - 1); // today not done yet: count from yesterday
    while (daily[dayKey(t)]) { streak++; t.setDate(t.getDate() - 1); }
    return streak;
}

// ---------- XP and levels ----------
export function xpFor(games = {}, profile = {}) {
    let xp = 0;
    for (const [id, g] of Object.entries(games)) {
        xp += (g.plays || 0) * 10;                                   // 10 XP per game played
        const t = TARGETS[id];
        if (t && (g.best || 0) >= t.easy) xp += 50;                  // bonus for a good score
        if (t && (g.best || 0) >= t.hard) xp += 150;                 // big bonus for a great score
    }
    xp += Object.keys(profile.daily || {}).length * 40;              // 40 XP per daily challenge
    const s = profile.stats || {};
    xp += (s.onlineGames || 0) * 10 + (s.onlineWins || 0) * 20;      // online games count too
    return xp;
}
// Level n needs 50·n·(n−1) XP in total: level 2 = 100, level 3 = 300, level 4 = 600 …
export function levelFor(xp) {
    let lvl = 1;
    while (50 * (lvl + 1) * lvl <= xp) lvl++;
    const cur = 50 * lvl * (lvl - 1), next = 50 * (lvl + 1) * lvl;
    return { level: lvl, xp, into: xp - cur, need: next - cur, pct: Math.floor(((xp - cur) / (next - cur)) * 100) };
}

// ---------- Achievements ----------
// cat = which group the badge shows in on the profile page
// p.stats (written by hub.js): { rated, comments, onlineGames, onlineWins }
const A = (cat, id, icon, name, desc, test) => ({ cat, id, icon, name, desc, test });
const st = (p, k) => (p.stats && p.stats[k]) || 0;
const lvl = (g, p) => levelFor(xpFor(g, p)).level;
const tagPlayed = (g, tag) => Object.keys(GAMES).filter((id) => GAMES[id].tags.includes(tag) && g[id] && g[id].plays).length;
const tagTotal = (tag) => Object.keys(GAMES).filter((id) => GAMES[id].tags.includes(tag)).length;
export const ACH_CATS = { play: "🎮 Playing", skill: "⭐ Skill", daily: "📅 Daily", social: "💬 Social", online: "🌐 Online", master: "👑 Game masters" };
export const ACHIEVEMENTS = [
    A("play", "first",    "🎮", "First game",       "Play any game",                       (g) => played(g) >= 1),
    A("play", "five",     "🖐️", "Explorer",         "Play 5 different games",              (g) => played(g) >= 5),
    A("play", "ten",      "🧭", "Adventurer",       "Play 10 different games",             (g) => played(g) >= 10),
    A("play", "twentyfive","🗺️", "Globetrotter",    "Play 25 different games",             (g) => played(g) >= 25),
    A("play", "all",      "🌍", "Tried them all",   "Play every game on the hub",          (g, p, n) => played(g) >= n),
    A("play", "plays50",  "🔥", "Keen player",      "Play 50 games in total",              (g) => plays(g) >= 50),
    A("play", "plays250", "💪", "Unstoppable",      "Play 250 games in total",             (g) => plays(g) >= 250),
    A("play", "plays1000","🌋", "Hub legend",       "Play 1,000 games in total",           (g) => plays(g) >= 1000),
    A("play", "sports",   "⚽", "Sports fan",       "Play 8 sports games",                 (g) => tagPlayed(g, "sports") >= Math.min(8, tagTotal("sports"))),
    A("play", "brainy",   "🧩", "Puzzle lover",     "Play 8 puzzle games",                 (g) => tagPlayed(g, "puzzle") >= Math.min(8, tagTotal("puzzle"))),
    A("play", "words",    "🔤", "Word nerd",        "Play every word game",                (g) => tagPlayed(g, "word") >= tagTotal("word")),
    A("play", "artist",   "🎨", "Artist",           "Make a picture in Pixel Paint",       (g) => !!(g.pixelpaint && g.pixelpaint.plays)),
    A("play", "level5",   "🥉", "Level 5",          "Reach level 5",                       (g, p) => lvl(g, p) >= 5),
    A("play", "level10",  "🥈", "Level 10",         "Reach level 10",                      (g, p) => lvl(g, p) >= 10),
    A("play", "level20",  "🥇", "Level 20",         "Reach level 20",                      (g, p) => lvl(g, p) >= 20),
    A("skill", "good3",   "⭐", "Getting good",     "Reach a daily-challenge score in 3 games", (g) => over(g, "easy") >= 3),
    A("skill", "good10",  "🌟", "All-rounder",      "Reach a daily-challenge score in 10 games", (g) => over(g, "easy") >= 10),
    A("skill", "good25",  "💫", "Superstar",        "Reach a daily-challenge score in 25 games", (g) => over(g, "easy") >= 25),
    A("skill", "pro",     "🏆", "Pro",              "Reach an expert score in any game",   (g) => over(g, "hard") >= 1),
    A("skill", "legend",  "👑", "Legend",           "Reach expert scores in 5 games",      (g) => over(g, "hard") >= 5),
    A("skill", "mastermind","🧠", "Grand master",   "Reach expert scores in 15 games",     (g) => over(g, "hard") >= 15),
    A("daily", "daily1",  "📅", "Daily player",     "Finish a daily challenge",            (g, p) => Object.keys(p.daily || {}).length >= 1),
    A("daily", "daily10", "📌", "Regular",          "Finish 10 daily challenges",          (g, p) => Object.keys(p.daily || {}).length >= 10),
    A("daily", "streak3", "📆", "On a roll",        "Finish daily challenges 3 days in a row", (g, p) => dailyStreak(p.daily) >= 3),
    A("daily", "streak7", "🗓️", "Week warrior",     "Finish daily challenges 7 days in a row", (g, p) => dailyStreak(p.daily) >= 7),
    A("daily", "streak30","🏅", "Month master",     "Finish daily challenges 30 days in a row", (g, p) => dailyStreak(p.daily) >= 30),
    A("social", "avatar", "😎", "New look",         "Pick an avatar on your profile",      (g, p) => !!p.avatar),
    A("social", "fav5",   "❤️", "Collector",        "Add 5 games to your favorites",       (g, p) => (p.favorites || []).length >= 5),
    A("social", "rate1",  "⭐", "Critic",           "Rate a game",                         (g, p) => st(p, "rated") >= 1),
    A("social", "rate10", "📝", "Top critic",       "Rate 10 games",                       (g, p) => st(p, "rated") >= 10),
    A("social", "comment","💬", "Say hello",        "Write a comment on a game",           (g, p) => st(p, "comments") >= 1),
    A("social", "premium","★",  "Supporter",        "Get Premium",                         (g, p) => !!p.premium),
    A("online", "online1","🌐", "Online!",          "Play an online game with a friend",   (g, p) => st(p, "onlineGames") >= 1),
    A("online", "onwin1", "🤝", "First online win", "Win an online game",                  (g, p) => st(p, "onlineWins") >= 1),
    A("online", "onwin10","🎖️", "Online champion",  "Win 10 online games",                 (g, p) => st(p, "onlineWins") >= 10),
    A("online", "online25","📡", "Always online",   "Play 25 online games",                (g, p) => st(p, "onlineGames") >= 25),
    // one "master" badge for every game with a score: reach its expert score
    ...Object.keys(TARGETS).filter((id) => GAMES[id]).map((id) => A("master", "m_" + id, "👑", GAMES[id].name + " master",
        `Score ${TARGETS[id].hard.toLocaleString("en")} ${TARGETS[id].unit} in ${GAMES[id].name}`, (g) => best(g, id) >= TARGETS[id].hard))
];
function played(g) { return Object.values(g).filter((x) => x.plays).length; }
function plays(g) { return Object.values(g).reduce((n, x) => n + (x.plays || 0), 0); }
function best(g, id) { return (g[id] && g[id].best) || 0; }
function over(g, lvl) { return Object.keys(TARGETS).filter((id) => best(g, id) >= TARGETS[id][lvl]).length; }

export function achievementsFor(games = {}, profile = {}, totalGames = Object.keys(GAMES).length) {
    return ACHIEVEMENTS.map((a) => ({ ...a, done: !!a.test(games, profile, totalGames) }));
}

// ---------- Avatars (free for everyone) ----------
export const AVATARS = ["😎", "🤖", "👾", "🦊", "🐼", "🐯", "🦁", "🐸", "🐧", "🦄", "🐙", "🦖", "🐶", "🐱", "🐵", "🦉",
    "⚽", "🏀", "🎮", "🚀", "⭐", "🔥", "⚡", "🌈", "🍕", "🧁", "👑", "🎨", "🎸", "🏆", "💎", "🛸"];

// ---------- Avatar frames (Premium) ----------
export const FRAMES = {
    none:    { name: "None",    premium: false, css: "" },
    gold:    { name: "Gold",    premium: true,  css: "box-shadow:0 0 0 3px #ffc94d,0 0 14px #ffc94d88" },
    neon:    { name: "Neon",    premium: true,  css: "box-shadow:0 0 0 3px #2ee6c9,0 0 16px #2ee6c9aa" },
    fire:    { name: "Fire",    premium: true,  css: "box-shadow:0 0 0 3px #ff4d8d,0 0 0 6px #ff9d4d,0 0 18px #ff4d8d99" },
    rainbow: { name: "Rainbow", premium: true,  css: "box-shadow:0 0 0 2px #ff4d8d,0 0 0 4px #ffc94d,0 0 0 6px #2ee6a0,0 0 0 8px #7c5cff" }
};

// ---------- Skins (Premium) ----------
export const SKINS = {
    spaceshooter: { label: "Ship", options: { classic: ["Classic", "#2ee6c9"], gold: ["Gold", "#ffc94d"], pink: ["Pink", "#ff4d8d"], violet: ["Violet", "#a15cff"], white: ["Ghost", "#eef0ff"] } },
    subwaysurfer: { label: "Hoodie", options: { classic: ["Classic", "#7c5cff"], red: ["Red", "#ff4d4d"], green: ["Green", "#2ee6a0"], gold: ["Gold", "#ffc94d"], black: ["Shadow", "#2a2d3a"] } },
    dinogame:     { label: "Dino", options: { classic: ["Classic", "#eef0ff"], green: ["Green", "#2ee6a0"], pink: ["Pink", "#ff4d8d"], gold: ["Gold", "#ffc94d"], blue: ["Blue", "#4da3ff"] } },
    breakout:     { label: "Paddle", options: { classic: ["Classic", "#2ee6c9"], pink: ["Pink", "#ff4d8d"], gold: ["Gold", "#ffc94d"], violet: ["Violet", "#a15cff"], white: ["White", "#eef0ff"] } }
};

// ---------- Name filter ----------
// Blocks rude words in display names (English + Hebrew), including common tricks like "sh1t" or "s.h.i.t".
const BAD = [
    "fuck", "fuk", "fck", "shit", "bitch", "btch", "cunt", "dick", "cock", "pussy", "penis", "vagina", "sex", "porn",
    "nude", "naked", "boob", "tits", "ass", "arse", "bastard", "slut", "whore", "hoe", "fag", "gay", "nigg", "nigr", "retard",
    "rape", "kill", "nazi", "hitler", "isis", "pedo", "piss", "wank", "crap", "damn", "hell", "stupid", "idiot", "dumb", "loser", "suck",
    "זין", "כוס", "זונה", "שרמוטה", "מניאק", "חרא", "מזדיין", "לזיין", "הומו", "קוקסינל", "מפגר", "דביל", "אידיוט", "סקס", "פורנו", "ערבי מסריח", "נאצי", "היטלר"
];
// Short words that are only bad on their own (so "Glass", "Hello", "Shell" are fine)
const WHOLE_ONLY = ["ass", "arse", "hoe", "hell", "sex", "gay", "dumb", "crap", "damn", "kill", "suck", "piss", "tits"];
const LEET = { "0": "o", "1": "i", "3": "e", "4": "a", "5": "s", "7": "t", "8": "b", "@": "a", "$": "s", "!": "i", "|": "i" };

export function nameProblem(name) {
    const raw = String(name || "").trim();
    if (raw.length < 2) return "Your name needs at least 2 characters.";
    if (raw.length > 20) return "Please keep your name to 20 characters or less.";
    if (/https?:|www\.|\.com|@/i.test(raw)) return "Names can't have links or emails in them.";
    if (/\d{6,}/.test(raw)) return "Names can't have phone numbers in them.";
    const lower = raw.toLowerCase();
    const words = lower.split(/[^a-z0-9֐-׿@$!|]+/).map(deleet).filter(Boolean);
    const squashed = deleet(lower).replace(/[^a-z֐-׿]/g, "").replace(/(.)\1+/g, "$1");
    for (const w of BAD) {
        if (WHOLE_ONLY.includes(w)) { if (words.includes(w)) return "Please choose a friendlier name."; }
        else if (squashed.includes(deleet(w).replace(/[^a-z\u0590-\u05ff]/g, "").replace(/(.)\1+/g, "$1")) || words.some((x) => x.includes(w))) return "Please choose a friendlier name.";
    }
    return null;
}
function deleet(s) { return s.replace(/[0134578@$!|]/g, (c) => LEET[c] || c); }

// ---------- Comment filter ----------
// Blocks rude words, links, emails and phone numbers in comments. Returns a problem message or null.
export function textProblem(text) {
    const raw = String(text || "").trim();
    if (raw.length < 2) return "Write a bit more first.";
    if (raw.length > 300) return "Comments can be up to 300 characters.";
    if (/https?:|www\.|\.(com|net|org|io|co|il|ly|gg|me)\b|@/i.test(raw)) return "Comments can't have links or emails in them.";
    if (/(\d[\s-]?){7,}/.test(raw)) return "Comments can't have phone numbers in them.";
    if (/(.)\1{9,}/.test(raw)) return "Please don't spam.";
    const lower = raw.toLowerCase();
    let tokens = lower.split(/[^a-z0-9֐-׿@$!|]+/).filter(Boolean);
    // join spaced-out letters: "s h i t" -> "shit"
    const joined = [];
    for (let i = 0; i < tokens.length; i++) {
        if (tokens[i].length === 1) { let w = ""; while (i < tokens.length && tokens[i].length === 1) w += tokens[i++]; i--; joined.push(w); }
        else joined.push(tokens[i]);
    }
    const words = joined.map(deleet);
    for (const w of BAD) {
        const bw = deleet(w);
        if (WHOLE_ONLY.includes(w)) { if (words.some((x) => x === bw || x.replace(/(.)\1+/g, "$1") === bw)) return "Please keep comments friendly."; }
        else if (words.some((x) => x.includes(bw) || x.replace(/(.)\1+/g, "$1").includes(bw.replace(/(.)\1+/g, "$1")))) return "Please keep comments friendly.";
    }
    return null;
}
