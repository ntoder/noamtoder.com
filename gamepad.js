/* Game controller support for every game on Noam's Game Hub.
   Turns gamepad buttons into the keyboard keys the games already understand,
   lets you press the menu buttons, and adds an on-screen cursor (right stick)
   for games you normally play with the mouse.
   A game can set window.GAMEPAD_MAP = [map for pad 1, map for pad 2] to change the keys. */
(function () {
    if (!("getGamepads" in navigator)) return;
    var KEYINFO = { ArrowUp: "ArrowUp", ArrowDown: "ArrowDown", ArrowLeft: "ArrowLeft", ArrowRight: "ArrowRight", Space: " ", Enter: "Enter", Escape: "Escape", ShiftLeft: "Shift", ShiftRight: "Shift", Period: ".", Slash: "/", Comma: ",", Semicolon: ";", Backspace: "Backspace" };
    function keyOf(code) { if (KEYINFO[code]) return KEYINFO[code]; if (code.indexOf("Key") === 0) return code.slice(3).toLowerCase(); if (code.indexOf("Digit") === 0) return code.slice(5); return code; }
    // Standard gamepad layout: 0 A, 1 B, 2 X, 3 Y, 4 LB, 5 RB, 6 LT, 7 RT, 8 Select, 9 Start, 12-15 D-pad
    var DEFAULT = [
        { up: "ArrowUp", down: "ArrowDown", left: "ArrowLeft", right: "ArrowRight", a: "Space", b: "KeyX", x: "KeyZ", y: "KeyC", lb: "KeyQ", rb: "KeyE", lt: "ShiftLeft", rt: "ShiftRight", start: "Enter", select: "KeyR" },
        { up: "KeyW", down: "KeyS", left: "KeyA", right: "KeyD", a: "KeyJ", b: "KeyK", x: "KeyL", y: "KeyI", lb: "KeyU", rb: "KeyO", lt: "KeyH", rt: "KeyN", start: "Enter", select: "KeyR" },
    ];
    var BTN = ["a", "b", "x", "y", "lb", "rb", "lt", "rt", "select", "start", "l3", "r3", "up", "down", "left", "right"];
    var down = {};            // "pad:action" -> code currently held
    var prevBtn = {};         // "pad:index" -> pressed last frame
    var cursor = null, cx = innerWidth / 2, cy = innerHeight / 2, cursorT = 0, mouseDown = false, dragTarget = null;
    var hush = {}, focusIdx = -1, lastNav = 0, running = false, toastEl = null;
    var he = function () { return document.documentElement.lang === "he"; };

    // Synthetic pointer ids can't be captured; never let that break a game.
    var origCap = Element.prototype.setPointerCapture;
    Element.prototype.setPointerCapture = function (id) { try { return origCap.call(this, id); } catch (e) { } };
    var origRel = Element.prototype.releasePointerCapture;
    Element.prototype.releasePointerCapture = function (id) { try { return origRel.call(this, id); } catch (e) { } };

    function key(type, code) {
        var ev = new KeyboardEvent(type, { key: keyOf(code), code: code, bubbles: true, cancelable: true });
        var t = document.activeElement && document.activeElement !== document.body && !/INPUT|TEXTAREA/.test(document.activeElement.tagName) ? document.activeElement : window;
        (t === window ? window : t).dispatchEvent(ev);
    }
    function press(pad, action, on) {
        var maps = (window.GAMEPAD_MAP && window.GAMEPAD_MAP.length ? window.GAMEPAD_MAP : DEFAULT);
        var map = maps[pad] || maps[maps.length - 1] || DEFAULT[0];
        var id = pad + ":" + action, code = map[action];
        if (on && !down[id] && code) { down[id] = code; key("keydown", code); }
        else if (!on && down[id]) { key("keyup", down[id]); delete down[id]; }
    }
    function releaseAll() { for (var id in down) { key("keyup", down[id]); } down = {}; }

    // ----- overlay (start / game over) navigation -----
    function overlay() {
        var els = document.querySelectorAll(".overlay");
        for (var i = 0; i < els.length; i++) { var el = els[i]; if (!el.classList.contains("hidden") && el.offsetParent !== null && getComputedStyle(el).display !== "none") return el; }
        return null;
    }
    function overlayButtons(ov) { return Array.prototype.filter.call(ov.querySelectorAll("button, a.btn"), function (b) { return b.offsetParent !== null && !b.disabled; }); }
    function mainButton(list) { for (var i = 0; i < list.length; i++) if (/startBtn|againBtn/.test(list[i].id)) return i; for (i = list.length - 1; i >= 0; i--) if (list[i].classList.contains("btn")) return i; return list.length - 1; }
    function markFocus(list) { list.forEach(function (b, i) { b.style.outline = i === focusIdx ? "3px solid #ffc94d" : ""; b.style.outlineOffset = i === focusIdx ? "3px" : ""; }); }

    // ----- virtual mouse cursor -----
    function ensureCursor() {
        if (cursor) return cursor;
        cursor = document.createElement("div");
        cursor.style.cssText = "position:fixed;left:0;top:0;width:22px;height:22px;margin:-11px 0 0 -11px;border-radius:50%;border:3px solid #fff;background:rgba(255,201,77,.55);box-shadow:0 0 0 2px #000a;pointer-events:none;z-index:99999;display:none;transition:transform .08s";
        document.body.appendChild(cursor); return cursor;
    }
    function ptr(type, target) {
        var opts = { bubbles: true, cancelable: true, clientX: cx, clientY: cy, pointerId: 77, pointerType: "mouse", isPrimary: true, button: 0, buttons: mouseDown ? 1 : 0, view: window };
        try { target.dispatchEvent(new PointerEvent(type, opts)); } catch (e) { }
        var m = { pointerdown: "mousedown", pointermove: "mousemove", pointerup: "mouseup" }[type];
        if (m) target.dispatchEvent(new MouseEvent(m, opts));
    }
    function hitAt() { if (cursor) cursor.style.display = "none"; var el = document.elementFromPoint(cx, cy) || document.body; if (cursor && cursorT > 0) cursor.style.display = "block"; return el; }
    function mouse(on) {
        var t = dragTarget || hitAt();
        if (on && !mouseDown) { mouseDown = true; dragTarget = hitAt(); ptr("pointerdown", dragTarget); if (cursor) cursor.style.transform = "scale(.75)"; }
        else if (!on && mouseDown) { mouseDown = false; ptr("pointerup", t); var under = hitAt(); if (under === t || t.contains(under)) under.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true, clientX: cx, clientY: cy, view: window })); dragTarget = null; if (cursor) cursor.style.transform = ""; }
    }

    function toast(msg) {
        if (!toastEl) { toastEl = document.createElement("div"); toastEl.style.cssText = "position:fixed;left:50%;bottom:24px;transform:translateX(-50%);background:#1b1f3b;color:#fff;font:700 15px Inter,Rubik,sans-serif;padding:10px 18px;border-radius:12px;box-shadow:0 6px 24px #0008;z-index:99999;transition:opacity .4s"; document.body.appendChild(toastEl); }
        toastEl.textContent = msg; toastEl.style.opacity = "1"; clearTimeout(toast.t); toast.t = setTimeout(function () { toastEl.style.opacity = "0"; }, 3500);
    }

    var last = performance.now();
    function frame(now) {
        var dt = Math.min(0.05, (now - last) / 1000); last = now;
        var pads = navigator.getGamepads ? navigator.getGamepads() : [];
        var list = []; for (var i = 0; i < pads.length; i++) if (pads[i] && pads[i].connected) list.push(pads[i]);
        if (!list.length) { releaseAll(); running = false; if (cursor) cursor.style.display = "none"; return; }
        var ov = overlay(), obtns = ov ? overlayButtons(ov) : [];
        if (ov !== frame.ov) { frame.ov = ov; frame.ovT = now; }
        var ovReady = ov && now - frame.ovT > 600;
        if (!ov && focusIdx !== -1) { focusIdx = -1; document.querySelectorAll(".overlay button, .overlay a.btn").forEach(function (b) { b.style.outline = ""; }); }

        list.forEach(function (gp, n) {
            var p = Math.min(n, 1), b = gp.buttons, ax = gp.axes;
            var pr = function (i) { return !!(b[i] && (b[i].pressed || b[i].value > 0.5)); };
            var lx = ax[0] || 0, ly = ax[1] || 0, rx = ax[2] || 0, ry = ax[3] || 0;
            var dir = { up: pr(12) || ly < -0.45, down: pr(13) || ly > 0.45, left: pr(14) || lx < -0.45, right: pr(15) || lx > 0.45 };
            var J = {}; for (var bi = 0; bi < 16; bi++) { var kk = n + ":" + bi; J[bi] = pr(bi) && !prevBtn[kk]; prevBtn[kk] = pr(bi); }
            var just = function (i) { return J[i]; };

            if (ov && obtns.length && n === 0) {
                // Menu mode: D-pad / stick picks a button, A presses it
                releaseAll();
                if (focusIdx < 0 || focusIdx >= obtns.length) focusIdx = mainButton(obtns);
                var horiz = dir.left ? -1 : dir.right ? 1 : dir.up ? -1 : dir.down ? 1 : 0;
                if (horiz && now - lastNav > 220) { focusIdx = (focusIdx + horiz + obtns.length) % obtns.length; lastNav = now; }
                if (!horiz) lastNav = 0;
                markFocus(obtns);
                if (ovReady && (just(0) || just(9))) { var btn = obtns[focusIdx]; focusIdx = -1; markFocus([]); btn.click(); hush[n] = true; }
                return;
            }

            // Cursor: right stick moves it, RB / RT or A (while the cursor is showing) clicks
            if (Math.abs(rx) > 0.18 || Math.abs(ry) > 0.18) {
                ensureCursor(); var sp = 900 * dt; cx = Math.max(0, Math.min(innerWidth - 1, cx + rx * Math.abs(rx) * sp)); cy = Math.max(0, Math.min(innerHeight - 1, cy + ry * Math.abs(ry) * sp));
                cursorT = 4; cursor.style.display = "block"; cursor.style.left = cx + "px"; cursor.style.top = cy + "px"; ptr("pointermove", dragTarget || hitAt());
            }
            var cursorOn = cursorT > 0;
            if (dir.up || dir.down || dir.left || dir.right) { if (!mouseDown) cursorT = Math.min(cursorT, 0.5); }
            var clickBtn = pr(5) && cursorOn || pr(7) && cursorOn || (cursorOn && pr(0));
            if (cursorOn || mouseDown) mouse(clickBtn);

            ["up", "down", "left", "right"].forEach(function (d) { press(p, d, dir[d]); });
            if (hush[n] && !pr(0) && !pr(9)) hush[n] = false;
            press(p, "a", pr(0) && !cursorOn && !hush[n]); press(p, "b", pr(1)); press(p, "x", pr(2)); press(p, "y", pr(3));
            press(p, "lb", pr(4)); press(p, "rb", pr(5) && !cursorOn); press(p, "lt", pr(6)); press(p, "rt", pr(7) && !cursorOn);
            press(p, "select", pr(8)); press(p, "start", pr(9) && !hush[n]);
        });
        if (cursorT > 0) { cursorT -= dt; if (cursorT <= 0 && cursor && !mouseDown) cursor.style.display = "none"; }
        requestAnimationFrame(frame);
    }
    function kick() { if (!running) { running = true; last = performance.now(); requestAnimationFrame(frame); } }
    addEventListener("gamepadconnected", function (e) {
        toast(he() ? "🎮 בקר מחובר! A = פעולה, Start = התחלה, סטיק ימני = סמן עכבר" : "🎮 Controller connected! A = action, Start = start, right stick = mouse cursor");
        kick();
    });
    addEventListener("gamepaddisconnected", function () { releaseAll(); toast(he() ? "🎮 הבקר נותק" : "🎮 Controller disconnected"); });
    // Some browsers only report pads after a button press: keep checking for a few seconds.
    var tries = 0, iv = setInterval(function () { var ps = navigator.getGamepads(); for (var i = 0; i < ps.length; i++) if (ps[i]) { kick(); clearInterval(iv); return; } if (++tries > 30) clearInterval(iv); }, 1000);
    window.GamepadSupport = { DEFAULT: DEFAULT };
})();
