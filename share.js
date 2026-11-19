// share.js — "Share your score" cards and the "Can you beat my score?" challenge links.
// After a game, a 📤 Share button appears next to "Play again". It makes a picture of the score
// and a link like /Snake/snake?beat=1200. Opening that link shows a challenge banner.

import { GAMES, CURRENT_GAME, LANG, toast } from "./hub.js";

const he = LANG === "he";
const T = (en, hw) => (he ? hw : en);
const SITE = "https://noamtoder.com";
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const gname = (id) => (GAMES[id] && GAMES[id].name) || "Noam's Game Hub";

function styles() {
    if (document.getElementById("gh-share-css")) return;
    const st = document.createElement("style");
    st.id = "gh-share-css";
    st.textContent = `
      .gh-sharebtn{margin-inline-start:8px;background:#2ee6c9!important;color:#0b0d1a!important}
      .gh-sm{position:fixed;inset:0;z-index:99995;display:grid;place-items:center;padding:16px;background:rgba(11,13,26,.88);backdrop-filter:blur(6px);font-family:Inter,Rubik,system-ui,sans-serif;color:#eef0ff}
      .gh-sm .box{width:min(520px,100%);background:#171b36;border:1px solid #2a3060;border-radius:20px;padding:20px;position:relative;text-align:center;max-height:94vh;overflow:auto}
      .gh-sm img{width:100%;border-radius:12px;border:1px solid #2a3060;margin:6px 0 14px;display:block}
      .gh-sm h3{margin:0 0 4px;font-size:20px}.gh-sm p{color:#9aa0c8;font-size:14px;margin:0}
      .gh-sm .row{display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:8px}
      .gh-sm .row a,.gh-sm .row button{display:block;border:1px solid #2a3060;background:#12152b;color:#eef0ff;border-radius:12px;padding:12px;font:700 14px Inter,Rubik,system-ui,sans-serif;cursor:pointer;text-decoration:none}
      .gh-sm .row .main{background:#7c5cff;border-color:#7c5cff;color:#fff}
      .gh-sm .x{position:absolute;top:8px;inset-inline-end:12px;background:none;border:0;color:#9aa0c8;font-size:22px;cursor:pointer}
      .gh-beat{position:relative;z-index:5;max-width:980px;margin:0 auto 12px;padding:12px 16px;border-radius:14px;display:flex;gap:12px;align-items:center;flex-wrap:wrap;
        background:linear-gradient(90deg,#ff4d8d33,#ffc94d33);border:1px solid #ffc94d;font:700 15px Inter,Rubik,system-ui,sans-serif;color:#eef0ff;direction:${he ? "rtl" : "ltr"}}
      .gh-beat b{color:#ffc94d;font-size:18px}.gh-beat button{margin-inline-start:auto;background:none;border:0;color:#9aa0c8;font-size:18px;cursor:pointer}`;
    document.head.appendChild(st);
}

function loadImg(src) {
    return new Promise((res) => { const i = new Image(); i.onload = () => res(i); i.onerror = () => res(null); i.src = src; });
}
function rr(ctx, x, y, w, h, r) { ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); }

// 1200x630 picture: works well as a WhatsApp / social preview
export async function scoreCard(game, score, extra = "") {
    const W = 1200, H = 630, c = document.createElement("canvas");
    c.width = W; c.height = H;
    const ctx = c.getContext("2d");
    const g = ctx.createLinearGradient(0, 0, W, H); g.addColorStop(0, "#1b1440"); g.addColorStop(1, "#0b0d1a");
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    // glow blobs
    for (const [x, y, r, col] of [[1050, 80, 260, "#7c5cff44"], [120, 560, 300, "#2ee6c933"]]) {
        const rg = ctx.createRadialGradient(x, y, 0, x, y, r); rg.addColorStop(0, col); rg.addColorStop(1, "transparent"); ctx.fillStyle = rg; ctx.fillRect(0, 0, W, H);
    }
    const thumb = GAMES[game] && await loadImg(GAMES[game].img);
    if (thumb) {
        ctx.save(); rr(ctx, 60, 120, 560, 350, 28); ctx.clip(); ctx.drawImage(thumb, 60, 120, 560, 350); ctx.restore();
        ctx.strokeStyle = "#ffffff22"; ctx.lineWidth = 3; rr(ctx, 60, 120, 560, 350, 28); ctx.stroke();
    }
    ctx.textBaseline = "alphabetic";
    const font = (w, s) => `${w} ${s}px Inter, Rubik, system-ui, sans-serif`;
    ctx.fillStyle = "#9aa0c8"; ctx.font = font(700, 30); ctx.fillText(he ? "התוצאה שלי ב" : "My score in", 670, 175);
    ctx.fillStyle = "#eef0ff"; ctx.font = font(800, 52);
    let name = gname(game); while (ctx.measureText(name).width > 480 && name.length > 4) name = name.slice(0, -2) + "…";
    ctx.fillText(name, 670, 240);
    const sc = Number(score).toLocaleString("en");
    let size = 150; ctx.font = font(900, size); while (ctx.measureText(sc).width > 480 && size > 60) ctx.font = font(900, (size -= 8));
    const sg = ctx.createLinearGradient(670, 260, 1150, 400); sg.addColorStop(0, "#ffc94d"); sg.addColorStop(1, "#ff4d8d");
    ctx.fillStyle = sg; ctx.fillText(sc, 668, 260 + size * 0.85);
    if (extra) { ctx.fillStyle = "#9aa0c8"; ctx.font = font(700, 28); ctx.fillText(extra, 672, 455); }
    ctx.fillStyle = "#2ee6c9"; ctx.font = font(800, 40); ctx.fillText(he ? "תצליחו לנצח אותי? 🏆" : "Can you beat me? 🏆", 670, 520);
    // footer
    ctx.fillStyle = "#ffffff12"; ctx.fillRect(0, H - 70, W, 70);
    ctx.fillStyle = "#eef0ff"; ctx.font = font(800, 28); ctx.fillText("Noam's Game Hub", 60, H - 25);
    ctx.fillStyle = "#9aa0c8"; ctx.font = font(700, 26); const u = "noamtoder.com"; ctx.fillText(u, W - 60 - ctx.measureText(u).width, H - 25);
    return new Promise((res) => c.toBlob((b) => res(b), "image/png"));
}

export function challengeLink(game, score) {
    const path = (GAMES[game] && GAMES[game].path) || "/";
    return `${SITE}${path}?beat=${Math.floor(score)}`;
}

export async function openShare(game, score, extra = "") {
    styles();
    const link = challengeLink(game, score);
    const text = T(`I scored ${Number(score).toLocaleString("en")} in ${gname(game)}! Can you beat me? 🏆`, `השגתי ${Number(score).toLocaleString("en")} ב${gname(game)}! תצליחו לנצח אותי? 🏆`);
    const blob = await scoreCard(game, score, extra);
    const file = blob && new File([blob], `${game}-score.png`, { type: "image/png" });
    const url = blob ? URL.createObjectURL(blob) : "";
    const m = document.createElement("div");
    m.className = "gh-sm";
    m.innerHTML = `<div class="box"><button class="x" aria-label="Close">✕</button>
        <h3>${T("📤 Share your score", "📤 שתפו את התוצאה")}</h3><p>${T("Send it to a friend. The link challenges them to beat you.", "שלחו לחבר. הקישור מאתגר אותו לנצח אתכם.")}</p>
        ${url ? `<img src="${url}" alt="">` : ""}
        <div class="row">
          ${navigator.canShare && file && navigator.canShare({ files: [file] }) ? `<button class="main" data-a="share">📤 ${T("Share", "שיתוף")}</button>` : ""}
          <a href="https://wa.me/?text=${encodeURIComponent(text + " " + link)}" target="_blank" rel="noopener">💬 WhatsApp</a>
          <button data-a="copy">🔗 ${T("Copy link", "העתקת קישור")}</button>
          ${url ? `<a href="${url}" download="${game}-score.png">🖼️ ${T("Save picture", "שמירת תמונה")}</a>` : ""}
        </div></div>`;
    m.addEventListener("keydown", (e) => e.stopPropagation());
    m.addEventListener("click", async (e) => {
        if (e.target === m || e.target.closest(".x")) { m.remove(); return; }
        const b = e.target.closest("[data-a]"); if (!b) return;
        if (b.dataset.a === "share") { try { await navigator.share({ files: [file], text, url: link }); } catch (x) {} }
        if (b.dataset.a === "copy") { try { await navigator.clipboard.writeText(`${text} ${link}`); toast(T("Link copied!", "הקישור הועתק!"), 1600); } catch (x) { toast(esc(link), 6000); } }
    });
    document.body.appendChild(m);
    try { window.gtag && window.gtag("event", "share_score", { game_id: game }); } catch (e) {}
}

// called by hub.js after a score is saved: put a Share button next to "Play again"
export function offerShare(game, score) {
    if (!game || !GAMES[game] || !(score > 0)) return;
    if (window.__beatTarget && score > window.__beatTarget && !window.__beatDone) {
        window.__beatDone = true;
        toast(T(`🎉 You beat your friend's ${window.__beatTarget.toLocaleString("en")}! Send it back to them 📤`, `🎉 ניצחתם את ה־${window.__beatTarget.toLocaleString("en")} של החבר! שלחו לו בחזרה 📤`), 5000);
    }
    const again = document.querySelector("#over #againBtn") || document.querySelector("#over button");
    if (!again) return;
    styles();
    let b = again.parentElement.querySelector(".gh-sharebtn");
    if (!b) {
        b = document.createElement("button");
        b.className = "btn gh-sharebtn"; b.type = "button";
        b.textContent = T("📤 Share", "📤 שיתוף");
        again.after(b);
    }
    b.onclick = (e) => { e.stopPropagation(); openShare(game, score); };
}

// opened from a challenge link: show "Your friend scored N. Beat it!"
export function showChallenge() {
    const n = parseInt(new URLSearchParams(location.search).get("beat"), 10);
    if (!CURRENT_GAME || !(n > 0) || n > 1e9) return;
    styles();
    const bar = document.createElement("div");
    bar.className = "gh-beat";
    bar.innerHTML = `<span>🏆 ${T("Your friend scored", "החבר שלכם השיג")} <b>${n.toLocaleString("en")}</b> ${T(`in ${esc(gname(CURRENT_GAME))}. Can you beat it?`, `ב${esc(gname(CURRENT_GAME))}. תצליחו לנצח?`)}</span><button aria-label="Close">✕</button>`;
    bar.querySelector("button").onclick = () => bar.remove();
    const stage = document.querySelector(".stage") || document.querySelector(".gbar");
    stage ? stage.before(bar) : document.body.prepend(bar);
    window.__beatTarget = n;
}
