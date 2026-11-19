// game-kit.js — small shared helpers for every Game Hub game (plain script, sets window.Kit)
(function () {
    const $ = (id) => document.getElementById(id);
    let ac, muted = false;
    try { muted = localStorage.getItem("gh_muted") === "1"; } catch (e) {}

    const Kit = {
        $,
        // ---- sound ----
        beep(freq = 440, dur = 0.08, type = "square", vol = 0.05, slide = 0) {
            if (muted) return;
            try {
                ac = ac || new (window.AudioContext || window.webkitAudioContext)();
                const o = ac.createOscillator(), g = ac.createGain(), t = ac.currentTime;
                o.type = type; o.frequency.setValueAtTime(freq, t);
                if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(40, freq + slide), t + dur);
                g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
                o.connect(g).connect(ac.destination); o.start(t); o.stop(t + dur + 0.02);
            } catch (e) {}
        },
        tune(notes, step = 0.09, type = "square", vol = 0.05) {
            notes.forEach((f, i) => setTimeout(() => Kit.beep(f, step * 1.4, type, vol), i * step * 1000));
        },
        get muted() { return muted; },
        toggleMute() { muted = !muted; try { localStorage.setItem("gh_muted", muted ? "1" : "0"); } catch (e) {} return muted; },

        // ---- best score (in this browser) ----
        best(key) { try { return +localStorage.getItem(key) || 0; } catch (e) { return 0; } },
        setBest(key, v) {
            const b = Math.max(Kit.best(key), v);
            try { localStorage.setItem(key, b); } catch (e) {}
            const el = $("best"); if (el) el.textContent = b.toLocaleString();
            return b;
        },
        // save to the account (leaderboard, profile, daily challenge)
        save(score) { if (window.GameHub) window.GameHub.saveScore(score); },
        skin(game, fallback) { return (window.GameHub && window.GameHub.skin && window.GameHub.skin(game)) || fallback; },

        // ---- screens ----
        show(id) { $(id) && $(id).classList.remove("hidden"); },
        hide(id) { $(id) && $(id).classList.add("hidden"); },
        stat(id, v) { const el = $(id); if (el) el.textContent = typeof v === "number" ? v.toLocaleString() : v; },

        // ---- game loop with steady timing ----
        loop(step) {
            let last = 0, id = 0, on = false;
            const tick = (t) => {
                if (!on) return;
                const dt = Math.min(0.05, (t - (last || t)) / 1000); last = t;
                step(dt, t);
                id = requestAnimationFrame(tick);
            };
            return {
                start() { if (on) return; on = true; last = 0; id = requestAnimationFrame(tick); },
                stop() { on = false; cancelAnimationFrame(id); },
                get running() { return on; }
            };
        },

        // ---- input ----
        keys: new Set(),
        onKeys(map, down, up) {
            addEventListener("keydown", (e) => {
                const a = map[e.code]; if (!a) return;
                e.preventDefault();
                if (!e.repeat || a.startsWith("+")) down && down(a.replace(/^\+/, ""), e);
                Kit.keys.add(a.replace(/^\+/, ""));
            });
            addEventListener("keyup", (e) => { const a = map[e.code]; if (!a) return; Kit.keys.delete(a.replace(/^\+/, "")); up && up(a.replace(/^\+/, ""), e); });
        },
        // on-screen buttons: <button data-k="left">
        touchButtons(down, up) {
            document.querySelectorAll("[data-k]").forEach((b) => {
                const k = b.dataset.k;
                b.addEventListener("pointerdown", (e) => { e.preventDefault(); Kit.keys.add(k); down && down(k); });
                const end = () => { Kit.keys.delete(k); up && up(k); };
                b.addEventListener("pointerup", end); b.addEventListener("pointerleave", end); b.addEventListener("pointercancel", end);
            });
        },
        swipe(el, cb, tap) {
            let sx = 0, sy = 0, st = 0;
            el.addEventListener("pointerdown", (e) => { sx = e.clientX; sy = e.clientY; st = Date.now(); });
            el.addEventListener("pointerup", (e) => {
                const dx = e.clientX - sx, dy = e.clientY - sy;
                if (Math.max(Math.abs(dx), Math.abs(dy)) < 24) { tap && tap(e); return; }
                cb(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? "right" : "left") : (dy > 0 ? "down" : "up"));
            });
        },
        // canvas coords from a pointer event
        point(cv, e) { const r = cv.getBoundingClientRect(); return { x: (e.clientX - r.left) * (cv.width / r.width), y: (e.clientY - r.top) * (cv.height / r.height) }; },

        // ---- drawing helpers ----
        rr(ctx, x, y, w, h, r) { ctx.beginPath(); ctx.roundRect(x, y, w, h, r); },
        text(ctx, s, x, y, size = 16, color = "#eef0ff", align = "center", font = "Inter, Rubik, system-ui, sans-serif", weight = 800) {
            if (window.Kit && window.Kit.tr) s = window.Kit.tr(s);
            ctx.fillStyle = color; ctx.font = `${weight} ${size}px ${font}`; ctx.textAlign = align; ctx.textBaseline = "middle"; ctx.fillText(s, x, y);
        },
        particles() {
            const list = [];
            return {
                burst(x, y, color, n = 14, speed = 3) {
                    for (let i = 0; i < n; i++) { const a = Math.random() * 6.283, s = Math.random() * speed + 0.5;
                        list.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, life: 1, color }); }
                },
                update(dt) { for (const p of list) { p.x += p.vx * dt * 60; p.y += p.vy * dt * 60; p.vy += 0.05; p.life -= dt * 1.6; }
                    for (let i = list.length - 1; i >= 0; i--) if (list[i].life <= 0) list.splice(i, 1); },
                draw(ctx) { for (const p of list) { ctx.globalAlpha = Math.max(0, p.life); ctx.fillStyle = p.color; ctx.fillRect(p.x - 2, p.y - 2, 4, 4); } ctx.globalAlpha = 1; },
                get count() { return list.length; }
            };
        },
        rand: (a, b) => a + Math.random() * (b - a),
        randi: (a, b) => Math.floor(a + Math.random() * (b - a + 1)),
        pick: (arr) => arr[Math.floor(Math.random() * arr.length)],
        hit: (a, b) => a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y
    };

    // ---- big, sharp game screen ----
    // The main canvas (#c) grows to fill the window, and draws at a higher resolution so it stays crisp.
    // Games keep using their normal sizes (cv.width / cv.height stay the same for them).
    (function bigScreen() {
        const cv = $("c");
        if (!cv || !cv.closest(".frame") || cv.dataset.fixed !== undefined) return;
        const w = cv.width, h = cv.height;
        const fit = () => {
            const wrap = cv.closest(".playwrap");
            let side = 0;
            if (wrap && innerWidth > 760) wrap.querySelectorAll(":scope > .side").forEach((s) => { side += s.getBoundingClientRect().width + 14; });
            const bar = document.querySelector(".gbar"), touch = document.querySelector(".touch");
            const used = (bar ? bar.offsetHeight : 60) + 70 + (touch && getComputedStyle(touch).display !== "none" ? touch.offsetHeight + 10 : 0);
            const availW = Math.min(innerWidth - 56, 1700) - side, availH = Math.max(260, innerHeight - used);
            return Math.max(0.3, Math.min(availW / w, availH / h, 1.9));
        };
        const s0 = fit();
        let k = Math.min(2, (window.devicePixelRatio || 1) * Math.max(1, s0));
        if (w * h * k * k > 3.2e6) k = Math.sqrt(3.2e6 / (w * h));
        k = Math.max(1, k);
        const proto = HTMLCanvasElement.prototype, dw = Object.getOwnPropertyDescriptor(proto, "width"), dh = Object.getOwnPropertyDescriptor(proto, "height");
        dw.set.call(cv, Math.round(w * k)); dh.set.call(cv, Math.round(h * k));
        Object.defineProperty(cv, "width", { get: () => w, set() {} });
        Object.defineProperty(cv, "height", { get: () => h, set() {} });
        const orig = cv.getContext.bind(cv);
        cv.getContext = (type, opts) => { const c = orig(type, opts); if (type === "2d" && c && !c.__big) { c.__big = true; c.setTransform(k, 0, 0, k, 0, 0); } return c; };
        const apply = () => { cv.style.width = Math.round(w * fit()) + "px"; cv.style.height = "auto"; };
        apply();
        addEventListener("resize", apply);
        document.addEventListener("DOMContentLoaded", apply);
    })();

    // mute button in the top bar
    document.addEventListener("DOMContentLoaded", () => {
        const bar = document.querySelector(".gbar .stats");
        if (!bar) return;
        const b = document.createElement("button");
        b.className = "stat mute"; b.title = "Sound on/off"; b.setAttribute("aria-label", "Sound on/off");
        b.textContent = muted ? "🔇" : "🔊";
        b.onclick = () => { b.textContent = Kit.toggleMute() ? "🔇" : "🔊"; };
        bar.appendChild(b);
    });
    // online play with a friend (loads /online.js only when a game asks for it)
    Kit.net = { active: false, mySide: null, replaying: false, myTurn: () => false, send() {}, over() {}, leave() {},
        open() { Kit.net._ready && Kit.net._ready.then(() => Kit.net.open()); } };
    Kit.online = (adapter) => {
        Kit.net._ready = import("/online.js").then((m) => m.init(adapter)).catch((e) => console.warn("[Kit] online unavailable", e));
    };
    window.Kit = Kit;
})();
