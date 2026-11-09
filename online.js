// online.js — play board games online with a friend using a room code.
// A game turns it on with:
//   Kit.online({ sides: ["x", "o"], names: { x: "X", o: "O" }, start(mySide), apply(move), leave() })
// and while Kit.net.active is true it calls Kit.net.send(move) after each of its own moves
// and Kit.net.over(winnerSide or "draw") when a round ends.
// Rooms live in Firestore at rooms/{CODE}. Moves are plain strings the game understands.

import { db } from "./firebase-config.js";
import { doc, getDoc, setDoc, deleteDoc, onSnapshot, runTransaction, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { state, ready, toast, LANG, CURRENT_GAME, isBanned } from "./hub.js";
import { bumpStat } from "./social.js";

const he = LANG === "he";
const T = (en, hw) => (he ? hw : en);
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const ABC = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const EMOTES = ["👍", "😂", "😮", "😢", "🔥", "👏", "GG"];
const net = window.Kit.net;

let A = null, code = null, room = null, unsub = null, me = null, round = 0, applied = 0, lastEmote = -1, sentAt = 0, pending = Promise.resolve();
const roomRef = (c) => doc(db, "rooms", c);
const other = () => (me === "host" ? "guest" : "host");
const sideOf = (who, r = room) => A.sides[(r.round % 2 === 1) === (who === "host") ? 0 : 1];
const turnSide = () => A.sides[(room.moves || []).length % 2];
const whoHas = (side) => (sideOf("host") === side ? "host" : "guest");
const sideName = (s) => (A.names && A.names[s]) || s;

// ---------- UI ----------
let modal, bar;
function styles() {
    if (document.getElementById("gh-online-css")) return;
    const st = document.createElement("style");
    st.id = "gh-online-css";
    st.textContent = `
      .gh-om{position:fixed;inset:0;z-index:99990;display:grid;place-items:center;padding:16px;background:rgba(11,13,26,.88);backdrop-filter:blur(6px);
        font-family:Inter,Rubik,system-ui,sans-serif;color:#eef0ff}
      .gh-om .box{width:min(420px,100%);background:#171b36;border:1px solid #2a3060;border-radius:20px;padding:26px 24px;text-align:center;position:relative}
      .gh-om h2{font-size:22px;margin:0 0 6px}.gh-om p{color:#9aa0c8;margin:0 0 18px;line-height:1.5;font-size:14px}
      .gh-om .x{position:absolute;top:10px;inset-inline-end:12px;background:none;border:0;color:#9aa0c8;font-size:20px;cursor:pointer}
      .gh-om .big{display:block;width:100%;margin:8px 0;padding:14px;border-radius:12px;border:0;font:800 16px Inter,Rubik,system-ui,sans-serif;cursor:pointer;background:#7c5cff;color:#fff}
      .gh-om .big.alt{background:#12152b;border:1px solid #2a3060;color:#eef0ff}
      .gh-om .code{font:800 40px 'Press Start 2P',monospace;letter-spacing:6px;color:#2ee6c9;margin:10px 0 6px;direction:ltr}
      .gh-om input{width:100%;padding:14px;border-radius:12px;border:1px solid #7c5cff;background:#12152b;color:#eef0ff;text-align:center;
        font:800 26px 'Press Start 2P',monospace;letter-spacing:6px;text-transform:uppercase;outline:none;direction:ltr}
      .gh-om .err{color:#ff8db4;font-weight:700;font-size:14px;min-height:20px;margin-top:8px}
      .gh-om .dots::after{content:"";animation:ghdots 1.2s steps(4) infinite}
      @keyframes ghdots{0%{content:""}25%{content:"."}50%{content:".."}75%{content:"..."}}
      .gh-ob{direction:${he ? "rtl" : "ltr"};max-width:980px;margin:0 auto 12px;padding:10px 14px;display:flex;gap:10px;align-items:center;flex-wrap:wrap;
        background:linear-gradient(90deg,#7c5cff33,#2ee6c922);border:1px solid #7c5cff;border-radius:14px;font:700 14px Inter,Rubik,system-ui,sans-serif;color:#eef0ff;position:relative}
      .gh-ob .turn{padding:4px 12px;border-radius:999px;background:#12152b}.gh-ob .turn.mine{background:#2ee6a0;color:#0b0d1a}
      .gh-ob .sc{font:800 15px Inter,sans-serif;direction:ltr}
      .gh-ob .em{display:flex;gap:2px;margin-inline-start:auto}
      .gh-ob button{border:1px solid #2a3060;background:#12152b;color:#eef0ff;border-radius:10px;padding:5px 9px;cursor:pointer;font:700 14px Inter,Rubik,system-ui,sans-serif}
      .gh-ob button:hover{border-color:#7c5cff}.gh-ob .again{background:#2ee6a0;color:#0b0d1a;border:0}
      .gh-ob .res{width:100%;display:flex;gap:10px;align-items:center;justify-content:center;flex-wrap:wrap;padding-top:6px;font-size:16px}
      .gh-bub{position:fixed;z-index:99991;font-size:44px;pointer-events:none;animation:ghbub 2.2s ease-out forwards;font-family:Inter,sans-serif;font-weight:800}
      .gh-bub small{display:block;font-size:12px;color:#eef0ff;text-align:center;background:#171b36;border-radius:8px;padding:2px 6px}
      @keyframes ghbub{0%{transform:translateY(20px) scale(.4);opacity:0}15%{transform:translateY(0) scale(1.1);opacity:1}80%{opacity:1}100%{transform:translateY(-60px) scale(1);opacity:0}}`;
    document.head.appendChild(st);
}
function showModal(html) {
    styles();
    if (!modal) { modal = document.createElement("div"); modal.className = "gh-om"; document.body.appendChild(modal); }
    modal.innerHTML = `<div class="box"><button class="x" aria-label="Close">✕</button>${html}</div>`;
    modal.style.display = "";
    modal.querySelector(".x").onclick = () => { if (room && room.status === "waiting" && me === "host") cancelRoom(); closeModal(); };
    modal.onkeydown = (e) => e.stopPropagation();
    return modal;
}
function closeModal() { if (modal) modal.style.display = "none"; }
const stopKeys = (e) => { if (modal && modal.style.display !== "none" && !e.target.closest(".gh-om")) e.stopImmediatePropagation(); };
addEventListener("keydown", stopKeys, true);

// ---------- Lobby ----------
export async function open() {
    await ready;
    if (!state.user) {
        showModal(`<h2>🌐 ${T("Play online", "משחק אונליין")}</h2><p>${T("Log in to play online with a friend. It's free!", "התחברו כדי לשחק אונליין עם חבר. זה בחינם!")}</p>
            <a class="big" style="text-decoration:none;display:block" href="/login?next=${encodeURIComponent(location.pathname + location.search)}">${T("Log in", "התחברות")}</a>`);
        return;
    }
    if (isBanned()) { toast(T("Your account is suspended.", "החשבון שלך מושעה.")); return; }
    if (net.active && code) { toast(T("You're already in an online game.", "אתם כבר במשחק אונליין.")); return; }
    const m = showModal(`<h2>🌐 ${T("Play online with a friend", "משחק אונליין עם חבר")}</h2>
        <p>${T("Make a room and send the code to a friend, or type the code your friend gave you.", "צרו חדר ושלחו את הקוד לחבר, או הקלידו את הקוד שחבר שלח לכם.")}</p>
        <button class="big" id="ghCreate">✨ ${T("Make a room", "יצירת חדר")}</button>
        <div style="margin:16px 0 8px;color:#9aa0c8;font-size:13px;font-weight:700">${T("or join a friend", "או הצטרפו לחבר")}</div>
        <input id="ghCode" maxlength="5" placeholder="ABCDE" autocomplete="off" spellcheck="false">
        <button class="big alt" id="ghJoin">${T("Join", "הצטרפות")}</button><div class="err" id="ghErr"></div>`);
    const inp = m.querySelector("#ghCode");
    inp.addEventListener("input", () => { inp.value = inp.value.toUpperCase().replace(/[^A-Z0-9]/g, ""); m.querySelector("#ghErr").textContent = ""; });
    inp.addEventListener("keydown", (e) => { if (e.key === "Enter") join(inp.value); });
    m.querySelector("#ghJoin").onclick = () => join(inp.value);
    m.querySelector("#ghCreate").onclick = create;
}
function err(msg) { const e = modal && modal.querySelector("#ghErr"); if (e) e.textContent = msg; else toast(msg); }
const meInfo = () => ({ uid: state.user.uid, name: state.profile?.name || state.user.displayName || T("Player", "שחקן"), avatar: state.profile?.avatar || "" });

async function create(fixed) {
    const btn = modal && modal.querySelector("#ghCreate"); if (btn) btn.disabled = true;
    for (let tries = 0; tries < 5; tries++) {
        const c = typeof fixed === "string" ? fixed : Array.from(crypto.getRandomValues(new Uint8Array(5)), (b) => ABC[b % ABC.length]).join("");
        try {
            const ex = await getDoc(roomRef(c));
            if (ex.exists()) {
                // opened from a NoamChat invite: it's my room already, so just reconnect
                if (typeof fixed === "string") { const d = ex.data(); if (d.host.uid === state.user.uid || d.guest?.uid === state.user.uid) { me = d.host.uid === state.user.uid ? "host" : "guest"; listen(c); if (d.status === "waiting") waiting(c); return; } return join(c); }
                continue;
            }
            await setDoc(roomRef(c), { game: CURRENT_GAME, host: meInfo(), guest: null, status: "waiting", moves: [], round: 1, result: null,
                score: { host: 0, guest: 0 }, rematch: { host: false, guest: false }, emote: null, leftBy: null, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
            me = "host"; listen(c); waiting(c);
            return;
        } catch (e) { console.warn("[GameHub] room create failed", e); if (btn) btn.disabled = false; err(T("Couldn't make a room. Try again.", "לא הצלחנו ליצור חדר. נסו שוב.")); return; }
    }
}
function waiting(c) {
    const link = `${location.origin}${location.pathname}?room=${c}`;
    const m = showModal(`<h2>🌐 ${T("Your room is ready", "החדר מוכן")}</h2>
        <p>${T("Send this code to your friend. They open this game, press 🌐 Online and type it in.", "שלחו את הקוד לחבר. הוא פותח את המשחק הזה, לוחץ 🌐 אונליין ומקליד אותו.")}</p>
        <div class="code">${c}</div>
        <button class="big alt" id="ghCopy">🔗 ${T("Copy invite link", "העתקת קישור הזמנה")}</button>
        <p style="margin:14px 0 0" class="dots">${T("Waiting for your friend", "מחכים לחבר")}</p>`);
    m.querySelector("#ghCopy").onclick = async () => {
        try { if (navigator.share && matchMedia("(pointer:coarse)").matches) await navigator.share({ title: document.title, url: link }); else { await navigator.clipboard.writeText(link); toast(T("Link copied!", "הקישור הועתק!"), 1600); } }
        catch (e) { const i = document.createElement("input"); i.value = link; i.readOnly = true; i.style.cssText = "font:600 13px Inter,sans-serif;letter-spacing:0;text-transform:none;margin-top:8px"; m.querySelector("#ghCopy").after(i); i.select(); }
    };
}
async function cancelRoom() {
    const c = code; stopListening(); me = null; room = null;
    try { await deleteDoc(roomRef(c)); } catch (e) {}
}

async function join(raw, retries = 0) {
    const c = String(raw || "").toUpperCase().trim();
    if (!/^[A-Z0-9]{5}$/.test(c)) return err(T("Codes have 5 letters and numbers.", "לקוד יש 5 אותיות ומספרים."));
    try {
        const ok = await runTransaction(db, async (tx) => {
            const s = await tx.get(roomRef(c));
            if (!s.exists()) return "none";
            const d = s.data();
            if (d.game !== CURRENT_GAME) return "game:" + d.game;
            if (d.host.uid === state.user.uid) { me = "host"; return "ok"; }
            if (d.guest && d.guest.uid === state.user.uid) { me = "guest"; return "ok"; }
            if (d.guest || d.status !== "waiting") return "full";
            tx.update(roomRef(c), { guest: meInfo(), status: "playing", updatedAt: serverTimestamp() });
            me = "guest"; return "ok";
        });
        if (ok === "none" && retries > 0) return setTimeout(() => join(c, retries - 1), 1500);   // the host may still be opening it
        if (ok === "none") return err(T("There's no room with that code.", "אין חדר עם הקוד הזה."));
        if (ok === "full") return err(T("That room is already full.", "החדר הזה כבר מלא."));
        if (ok.startsWith("game:")) return err(T("That code is for a different game.", "הקוד הזה שייך למשחק אחר."));
        listen(c);
    } catch (e) { console.warn("[GameHub] join failed", e); err(T("Couldn't join. Check the code and try again.", "לא הצלחנו להצטרף. בדקו את הקוד ונסו שוב.")); }
}

// ---------- Live room ----------
function listen(c) {
    stopListening();
    code = c; round = 0; applied = 0;
    const u = new URL(location.href); u.searchParams.delete("host"); u.searchParams.set("room", c); history.replaceState(null, "", u);
    unsub = onSnapshot(roomRef(c), (s) => onRoom(s.exists() ? s.data() : null), (e) => { console.warn("[GameHub] room listen failed", e); });
}
function stopListening() { if (unsub) unsub(); unsub = null; code = null; }

function onRoom(d) {
    if (!d) { if (code) finish(T("The room was closed.", "החדר נסגר.")); return; }
    room = d;
    if (d.status === "waiting") return;
    if (d.status === "left") { finish(d.leftBy === me ? null : T("Your friend left the game.", "החבר יצא מהמשחק.")); return; }
    if (d.round !== round) {
        // new round (or we just arrived): reset the board and replay every move
        round = d.round; applied = 0;
        net.mySide = sideOf(me); net.active = true; net.round = round;
        closeModal();
        A.start(net.mySide);
        if (round === 1 && !d.moves.length) toast(`🌐 ${T("Connected!", "מחוברים!")} ${T("You are", "אתם")} ${esc(sideName(net.mySide))}`, 2500);
    }
    while (applied < d.moves.length) { const m = d.moves[applied++]; net.replaying = true; try { A.apply(m); } finally { net.replaying = false; } }
    if (lastEmote < 0) lastEmote = (d.emote && d.emote.n) || 0;          // don't replay an old emoji when arriving
    else if (d.emote && d.emote.n > lastEmote) { bubble(d.emote); lastEmote = d.emote.n; }
    if (d.rematch && d.rematch.host && d.rematch.guest && me === "host") newRound();
    renderBar();
}

export function myTurn() { return !!(net.active && room && room.status === "playing" && !room.result && turnSide() === net.mySide); }

export async function send(move) {
    if (!net.active || !room) return;
    const expect = applied; applied++; sentAt = Date.now();
    room.moves = [...room.moves, String(move)];
    renderBar();
    let done; pending = new Promise((r) => (done = r));
    try {
        await runTransaction(db, async (tx) => {
            const s = await tx.get(roomRef(code));
            const d = s.data();
            if (!d || d.round !== round || d.moves.length !== expect) throw new Error("out of sync");
            tx.update(roomRef(code), { moves: [...d.moves, String(move)], updatedAt: serverTimestamp() });
        });
    } catch (e) {
        console.warn("[GameHub] move failed, syncing", e);
        resync();
    }
    done();
}
async function resync() {
    try { const s = await getDoc(roomRef(code)); round = 0; if (s.exists()) onRoom(s.data()); } catch (e) {}
}

const counted = new Set();
export async function over(result) {
    if (!net.active || !room) return;
    await new Promise((r) => setTimeout(r, 0));     // the game calls this before it sends its last move
    await pending;
    if (!net.active || !room) return;
    const key = `${code}:${round}`;
    if (!counted.has(key)) {
        counted.add(key);
        // stats once per round per player (also safe after a page refresh)
        const lsKey = "gh_on_" + (state.user && state.user.uid) + ":" + key;
        let done = false; try { done = !!localStorage.getItem(lsKey); localStorage.setItem(lsKey, "1"); } catch (e) {}
        if (!done) { bumpStat("onlineGames"); if (result === net.mySide) bumpStat("onlineWins"); }
    }
    // the player who made the last move writes the result
    const lastMover = A.sides[(room.moves.length - 1) % 2];
    if (room.result || lastMover !== net.mySide) { renderBar(); return; }
    try {
        await runTransaction(db, async (tx) => {
            const s = await tx.get(roomRef(code)); const d = s.data();
            if (!d || d.round !== round || d.result) return;
            const winner = result === "draw" ? "draw" : whoHas(result);
            const score = { ...d.score }; if (winner !== "draw") score[winner] = (score[winner] || 0) + 1;
            tx.update(roomRef(code), { result: { winner, side: result }, score, updatedAt: serverTimestamp() });
        });
    } catch (e) { console.warn("[GameHub] result failed", e); }
}

async function rematch() {
    try {
        await runTransaction(db, async (tx) => {
            const s = await tx.get(roomRef(code)); const d = s.data(); if (!d) return;
            tx.update(roomRef(code), { rematch: { ...d.rematch, [me]: true }, updatedAt: serverTimestamp() });
        });
    } catch (e) { console.warn(e); }
}
async function newRound() {
    try {
        await runTransaction(db, async (tx) => {
            const s = await tx.get(roomRef(code)); const d = s.data();
            if (!d || !(d.rematch.host && d.rematch.guest)) return;
            tx.update(roomRef(code), { moves: [], round: d.round + 1, result: null, rematch: { host: false, guest: false }, updatedAt: serverTimestamp() });
        });
    } catch (e) { console.warn(e); }
}
async function emote(e) {
    if (Date.now() - (emote.t || 0) < 1500) return;
    emote.t = Date.now();
    const n = Date.now();
    bubble({ by: me, e, n });
    lastEmote = n;
    try { await runTransaction(db, async (tx) => { const s = await tx.get(roomRef(code)); if (s.exists()) tx.update(roomRef(code), { emote: { by: me, e, n }, updatedAt: serverTimestamp() }); }); } catch (x) {}
}
function bubble(em) {
    if (!EMOTES.includes(em.e)) return;
    styles();
    const b = document.createElement("div");
    b.className = "gh-bub";
    const who = em.by === me ? T("You", "אתם") : (room[em.by] && room[em.by].name) || "";
    b.innerHTML = `${esc(em.e)}<small>${esc(who)}</small>`;
    const r = (bar || document.body).getBoundingClientRect();
    b.style.left = (em.by === me ? r.left + 30 : r.right - 90) + "px";
    b.style.top = Math.max(10, r.bottom + 10) + "px";
    document.body.appendChild(b);
    setTimeout(() => b.remove(), 2300);
}

export async function leave() {
    const c = code;
    if (!c) return;
    try {
        await runTransaction(db, async (tx) => {
            const s = await tx.get(roomRef(c)); if (!s.exists()) return;
            if (s.data().status === "waiting") tx.delete(roomRef(c));
            else tx.update(roomRef(c), { status: "left", leftBy: me, updatedAt: serverTimestamp() });
        });
    } catch (e) {}
    finish(null);
}
function finish(msg) {
    stopListening();
    net.active = false; net.mySide = null; room = null; me = null; round = 0;
    const u = new URL(location.href); u.searchParams.delete("room"); history.replaceState(null, "", u);
    if (bar) { bar.remove(); bar = null; }
    closeModal();
    if (msg) toast("🌐 " + msg, 4000);
    A && A.leave && A.leave();
}

function renderBar() {
    if (!room || !net.active) return;
    styles();
    if (!bar) {
        bar = document.createElement("div"); bar.className = "gh-ob"; bar.dataset.noi18n = "";
        const stage = document.querySelector(".stage");
        stage ? stage.before(bar) : document.body.prepend(bar);
        bar.addEventListener("click", (e) => {
            const b = e.target.closest("button"); if (!b) return;
            if (b.dataset.em) emote(b.dataset.em);
            else if (b.classList.contains("again")) { b.disabled = true; rematch(); }
            else if (b.classList.contains("leave")) { if (b.dataset.armed) leave(); else { b.dataset.armed = "1"; b.textContent = T("Sure?", "בטוח?"); setTimeout(() => { delete b.dataset.armed; b.textContent = T("Leave", "יציאה"); }, 2500); } }
        });
    }
    const opp = room[other()] || {}, mine = myTurn();
    const sc = room.score || {};
    let res = "";
    if (room.result) {
        const w = room.result.winner;
        const txt = w === "draw" ? T("🤝 It's a draw!", "🤝 תיקו!") : w === me ? T("🏆 You won!", "🏆 ניצחתם!") : T(`${opp.name || "Your friend"} won`, `${opp.name || "החבר"} ניצח`);
        const waitingFor = room.rematch && room.rematch[me] && !room.rematch[other()];
        res = `<div class="res"><span>${esc(txt)}</span>${waitingFor ? `<span class="dots" style="color:#9aa0c8;font-size:13px">${T("Waiting for your friend", "מחכים לחבר")}</span>`
            : `<button class="again">${room.rematch && room.rematch[other()] ? T("✅ Your friend wants a rematch! Play again", "✅ החבר רוצה עוד משחק! לשחק שוב") : T("🔁 Play again", "🔁 לשחק שוב")}</button>`}</div>`;
    }
    bar.innerHTML = `<span>🌐 ${T("Online", "אונליין")} · ${T("You are", "אתם")} <b>${esc(sideName(net.mySide))}</b></span>
        <span>${T("vs", "נגד")} ${opp.avatar ? esc(opp.avatar) + " " : ""}<b>${esc(opp.name || "…")}</b></span>
        <span class="sc">${sc[me] || 0} : ${sc[other()] || 0}</span>
        ${room.result ? "" : `<span class="turn${mine ? " mine" : ""}">${mine ? T("Your turn", "התור שלכם") : T("Friend's turn", "התור של החבר")}</span>`}
        <span class="em">${EMOTES.map((e) => `<button data-em="${e}" aria-label="${e}">${e}</button>`).join("")}</span>
        <button class="leave">${T("Leave", "יציאה")}</button>${res}`;
}

// ---------- Start ----------
export async function init(adapter) {
    A = adapter;
    net.open = open; net.send = send; net.over = over; net.leave = leave; net.myTurn = myTurn;
    const q = new URLSearchParams(location.search), c = q.get("room"), h = q.get("host");
    if (h && /^[A-Z0-9]{5}$/i.test(h)) {
        // opened from a NoamChat invite I sent: make the room with that code and wait
        await ready;
        if (!state.user) return open();
        open(); create(h.toUpperCase());
    } else if (c) {
        await ready;
        if (!state.user) return open();
        open(); if (modal) modal.querySelector("#ghCode").value = c.toUpperCase();
        join(c, 6);
    }
}
