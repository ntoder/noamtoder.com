// NoamBrowser — music & ambient sounds for the sidebar. Everything is generated live with the Web Audio
// engine (no recordings, no internet, no ads, no talking): 14 music styles that keep composing new tunes,
// plus rain, waves, fire, birds and more. Mix them, use moods, a sleep timer, or play during Focus.
'use strict';
(() => {
  const SOUNDS = [
    ['rain', '🌧️', 'Rain'], ['waves', '🌊', 'Ocean waves'], ['fire', '🔥', 'Fireplace'], ['birds', '🐦', 'Forest birds'],
    ['stream', '💧', 'Stream'], ['wind', '🍃', 'Wind'], ['cafe', '☕', 'Café'],
    ['brown', '🟤', 'Brown noise'], ['pink', '🌸', 'Pink noise'], ['white', '⚪', 'White noise'],
  ];
  // music styles: one plays at a time, and each keeps writing new tunes (new key, chords and melody every minute or so)
  const MUSIC = [
    ['lofi', '🎹', 'Lo-fi beats'], ['piano', '🎼', 'Calm piano'], ['jazz', '🎷', 'Jazz café'], ['classical', '🎻', 'Classical'],
    ['guitar', '🎸', 'Acoustic guitar'], ['rock', '🤘', 'Rock'], ['synthwave', '🌆', 'Synthwave'], ['chiptune', '👾', '8-bit game'],
    ['dance', '🪩', 'Dance'], ['oud', '🪘', 'Middle Eastern'], ['musicbox', '🎠', 'Music box'], ['space', '🌌', 'Space ambient'],
    ['harp', '🧚', 'Dreamy harp'], ['bowls', '🧘', 'Meditation bowls'],
  ];
  const IS_MUSIC = new Set(MUSIC.map(([id]) => id));
  const ALL = [...MUSIC, ...SOUNDS];
  const PRESETS = [
    ['🌧️', 'Rainy day', { lofi: 0.75, rain: 0.4, fire: 0.25 }], ['📚', 'Study', { piano: 0.8, rain: 0.3 }],
    ['🌲', 'Forest', { birds: 0.6, stream: 0.45, wind: 0.25 }], ['🏖️', 'Beach', { waves: 0.8, wind: 0.2, birds: 0.15 }],
    ['☕', 'Café', { jazz: 0.8, cafe: 0.35 }], ['🏕️', 'Campfire', { guitar: 0.8, fire: 0.35 }], ['🌃', 'Night drive', { synthwave: 0.8 }],
    ['🎮', 'Game time', { chiptune: 0.8 }], ['🧘', 'Calm', { bowls: 0.8, stream: 0.3 }], ['🧠', 'Deep focus', { brown: 0.6 }],
    ['😴', 'Sleep', { musicbox: 0.5, rain: 0.4 }],
  ];
  // loudness balance: measured so every sound and style plays equally loud at the same slider position
  const TRIM = {rain: 3.97, waves: 3.46, fire: 3.55, birds: 28, stream: 6.0, wind: 7.0, cafe: 8.75, brown: 2.12, pink: 2.07, white: 1.31, lofi: 4.67, piano: 7.23, jazz: 3.14, classical: 7.85, guitar: 4.54, rock: 5.3, synthwave: 15.5, chiptune: 16.5, dance: 11.2, oud: 5.34, musicbox: 9.38, space: 8.96, harp: 8.31, bowls: 5.26};
  const vol = (id, v) => v * (TRIM[id] || 1);
  let S = { levels: {}, master: 0.85, focusLink: false, timer: 0, playing: false };
  try { Object.assign(S, JSON.parse(localStorage.getItem('ambient') || '{}')); S.playing = false; if (localStorage.getItem('ambient-v2') !== '1') { S.master = Math.max(S.master, 0.85); localStorage.setItem('ambient-v2', '1'); } } catch {}
  const save = () => { try { localStorage.setItem('ambient', JSON.stringify({ ...S, playing: false })); } catch {} };

  // ---------------------------------------------------------------- engine
  let ac = null, master = null, analyser = null; const live = new Map(); let timerEnd = 0, timerT = null;
  const rnd = (a, b) => a + Math.random() * (b - a);
  function ctx() {
    if (ac) return ac;
    ac = new AudioContext();
    // gentle compressor + make-up gain so it's nicely loud, then a limiter so mixes never distort
    const comp = ac.createDynamicsCompressor(); comp.threshold.value = -20; comp.knee.value = 10; comp.ratio.value = 3; comp.attack.value = 0.01; comp.release.value = 0.25;
    const makeup = ac.createGain(); makeup.gain.value = 1.45;
    const lim = ac.createDynamicsCompressor(); lim.threshold.value = -3; lim.knee.value = 0; lim.ratio.value = 20; lim.attack.value = 0.002; lim.release.value = 0.1;
    master = ac.createGain(); master.gain.value = S.master;
    analyser = ac.createAnalyser(); analyser.fftSize = 512; analyser.smoothingTimeConstant = 0.75;
    if (window.NOAM_AMB_RAW) { master.connect(analyser).connect(ac.destination); return ac; } // test-only: measure before the limiter
    master.connect(comp).connect(makeup).connect(lim).connect(analyser).connect(ac.destination);
    return ac;
  }
  const bufCache = {};
  function noiseBuf(kind, secs = 4) {
    const k = kind + secs; if (bufCache[k]) return bufCache[k];
    const n = ac.sampleRate * secs, b = ac.createBuffer(2, n, ac.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const d = b.getChannelData(ch); let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0, last = 0;
      for (let i = 0; i < n; i++) {
        const w = Math.random() * 2 - 1;
        if (kind === 'white') d[i] = w * 0.5;
        else if (kind === 'pink') { b0 = 0.99886 * b0 + w * 0.0555179; b1 = 0.99332 * b1 + w * 0.0750759; b2 = 0.969 * b2 + w * 0.153852; b3 = 0.8665 * b3 + w * 0.3104856; b4 = 0.55 * b4 + w * 0.5329522; b5 = -0.7616 * b5 - w * 0.016898; d[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + w * 0.5362) * 0.11; b6 = w * 0.115926; }
        else { last = (last + 0.02 * w) / 1.02; d[i] = last * 3.5; }
      }
    }
    return (bufCache[k] = b);
  }
  const loop = (kind, secs = 4) => { const s = ac.createBufferSource(); s.buffer = noiseBuf(kind, secs); s.loop = true; s.loopStart = Math.random(); s.start(0, Math.random() * secs); return s; };
  const filt = (type, f, q = 0.7) => { const x = ac.createBiquadFilter(); x.type = type; x.frequency.value = f; x.Q.value = q; return x; };
  const gain = (v) => { const g = ac.createGain(); g.gain.value = v; return g; };
  function burst(out, { dur = 0.02, f = 3000, type = 'bandpass', q = 1, vol = 0.2, at = ac.currentTime }) {
    const s = ac.createBufferSource(); s.buffer = noiseBuf('white', 1); const fl = filt(type, f, q); const g = gain(0);
    g.gain.setValueAtTime(vol, at); g.gain.exponentialRampToValueAtTime(0.0001, at + dur);
    s.connect(fl).connect(g).connect(out); s.start(at, Math.random() * 0.9, dur + 0.05);
  }
  function tone(out, { f, type = 'sine', at, dur, vol, attack = 0.01, release = 0.3, filterF }) {
    const o = ac.createOscillator(); o.type = type; o.frequency.setValueAtTime(f, at);
    const g = gain(0); g.gain.setValueAtTime(0.0001, at); g.gain.exponentialRampToValueAtTime(vol, at + attack); g.gain.setValueAtTime(vol, at + Math.max(attack, dur - release)); g.gain.exponentialRampToValueAtTime(0.0001, at + dur);
    let n = o.connect(g); if (filterF) n = g.connect(filt('lowpass', filterF)); else n = g; n.connect(out); o.start(at); o.stop(at + dur + 0.05); return o;
  }
  // every sound: (out) => stop()
  const BUILD = {
    white: (out) => { const s = loop('white'); s.connect(gain(0.6)).connect(out); return () => s.stop(); },
    pink: (out) => { const s = loop('pink'); s.connect(gain(0.9)).connect(out); return () => s.stop(); },
    brown: (out) => { const s = loop('brown'); s.connect(filt('lowpass', 900)).connect(gain(0.9)).connect(out); return () => s.stop(); },
    rain: (out) => {
      const s = loop('pink'); s.connect(filt('highpass', 500)).connect(filt('lowpass', 7500)).connect(gain(0.75)).connect(out);
      const body = loop('brown'); body.connect(filt('lowpass', 400)).connect(gain(0.25)).connect(out);
      const t = setInterval(() => { const now = ac.currentTime; for (let i = 0; i < 6; i++) if (Math.random() < 0.7) burst(out, { at: now + rnd(0, 0.1), dur: rnd(0.008, 0.03), f: rnd(1800, 6500), q: rnd(0.8, 3), vol: rnd(0.04, 0.22) }); }, 100);
      return () => { clearInterval(t); s.stop(); body.stop(); };
    },
    waves: (out) => {
      const s = loop('brown', 6); const lp = filt('lowpass', 700); const g = gain(0.5);
      s.connect(lp).connect(g).connect(out);
      const lfo = ac.createOscillator(); lfo.frequency.value = 0.085; const depth = gain(0.42); lfo.connect(depth).connect(g.gain);
      const lfo2 = ac.createOscillator(); lfo2.frequency.value = 0.085; const d2 = gain(500); lfo2.connect(d2).connect(lp.frequency);
      lfo.start(); lfo2.start();
      const foam = loop('pink'); const fg = gain(0.05); foam.connect(filt('highpass', 2000)).connect(fg).connect(out); const fl = ac.createOscillator(); fl.frequency.value = 0.085; const fd = gain(0.05); fl.connect(fd).connect(fg.gain); fl.start();
      return () => { s.stop(); lfo.stop(); lfo2.stop(); foam.stop(); fl.stop(); };
    },
    wind: (out) => {
      const s = loop('pink'); const bp = filt('bandpass', 500, 1.2); const g = gain(0.5); s.connect(bp).connect(g).connect(out);
      const t = setInterval(() => { const now = ac.currentTime; bp.frequency.setTargetAtTime(rnd(250, 950), now, 1.2); g.gain.setTargetAtTime(rnd(0.25, 0.9), now, 1.5); }, 1800);
      return () => { clearInterval(t); s.stop(); };
    },
    stream: (out) => {
      const s = loop('white'); const bp = filt('bandpass', 1400, 0.9); const g = gain(0.4); s.connect(bp).connect(g).connect(out);
      const low = loop('brown'); low.connect(filt('lowpass', 500)).connect(gain(0.3)).connect(out);
      const t = setInterval(() => { const now = ac.currentTime; bp.frequency.setTargetAtTime(rnd(900, 2600), now, 0.05); g.gain.setTargetAtTime(rnd(0.25, 0.5), now, 0.06); }, 90);
      return () => { clearInterval(t); s.stop(); low.stop(); };
    },
    fire: (out) => {
      const r = loop('brown'); r.connect(filt('lowpass', 500)).connect(gain(0.6)).connect(out);
      const hiss = loop('pink'); hiss.connect(filt('highpass', 3000)).connect(gain(0.04)).connect(out);
      const t = setInterval(() => { const now = ac.currentTime; const n = Math.random() < 0.3 ? 3 : 1; for (let i = 0; i < n; i++) if (Math.random() < 0.55) burst(out, { at: now + rnd(0, 0.15), dur: rnd(0.004, 0.025), f: rnd(1500, 5000), type: 'highpass', vol: rnd(0.08, Math.random() < 0.08 ? 0.9 : 0.35) }); }, 140);
      return () => { clearInterval(t); r.stop(); hiss.stop(); };
    },
    birds: (out) => {
      const leaves = loop('pink'); leaves.connect(filt('bandpass', 1200, 0.6)).connect(gain(0.05)).connect(out);
      const pan = () => { const p = ac.createStereoPanner(); p.pan.value = rnd(-0.8, 0.8); p.connect(out); return p; };
      const sing = () => {
        const now = ac.currentTime + 0.05; const p = pan(); const base = rnd(2200, 4800); const notes = Math.floor(rnd(2, 7)); const kind = Math.random();
        for (let i = 0; i < notes; i++) {
          const at = now + i * rnd(0.09, 0.18); const o = ac.createOscillator(); o.type = 'sine'; const g = gain(0);
          const f0 = base * rnd(0.9, 1.1); o.frequency.setValueAtTime(f0, at);
          if (kind < 0.5) o.frequency.exponentialRampToValueAtTime(f0 * rnd(1.3, 1.8), at + 0.06); else o.frequency.exponentialRampToValueAtTime(f0 * rnd(0.6, 0.8), at + 0.08);
          g.gain.setValueAtTime(0.0001, at); g.gain.exponentialRampToValueAtTime(rnd(0.05, 0.14), at + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, at + 0.09);
          o.connect(g).connect(p); o.start(at); o.stop(at + 0.12);
        }
      };
      let t; const next = () => { t = setTimeout(() => { sing(); if (Math.random() < 0.3) setTimeout(sing, rnd(150, 400)); next(); }, rnd(500, 2600)); };
      next();
      return () => { clearTimeout(t); leaves.stop(); };
    },
    cafe: (out) => {
      const m1 = loop('pink'), m2 = loop('brown');
      const bp = filt('bandpass', 550, 0.9); const g = gain(0.5); m1.connect(bp); m2.connect(filt('bandpass', 350, 1)).connect(bp); bp.connect(g).connect(out);
      const t = setInterval(() => { const now = ac.currentTime; g.gain.setTargetAtTime(rnd(0.3, 0.7), now, 0.25); bp.frequency.setTargetAtTime(rnd(380, 800), now, 0.3); }, 350);
      const clink = setInterval(() => { if (Math.random() < 0.35) { const at = ac.currentTime + 0.02; const f = rnd(2400, 4200); [1, 2.76, 5.4].forEach((h, i) => tone(out, { f: f * h, at, dur: 0.5 - i * 0.12, vol: 0.03 / (i + 1), attack: 0.002, release: 0.45 })); } }, 1800);
      return () => { clearInterval(t); clearInterval(clink); m1.stop(); m2.stop(); };
    },
    lofi: (out) => {
      const bus = gain(0.9); const warm = filt('lowpass', 2400); bus.connect(warm).connect(out);
      const crackle = loop('white'); const cg = gain(0.012); crackle.connect(filt('highpass', 4000)).connect(cg).connect(out);
      const pops = setInterval(() => { if (Math.random() < 0.5) burst(out, { dur: 0.004, f: 3000, vol: rnd(0.02, 0.07) }); }, 300);
      const midi = (n) => 440 * Math.pow(2, (n - 69) / 12);
      const CH = [[53, 57, 60, 64], [52, 55, 59, 62], [50, 53, 57, 60], [48, 52, 55, 59]]; // Fmaj7 Em7 Dm7 Cmaj7
      const PENT = [72, 74, 76, 79, 81, 84];
      const beat = 60 / 72; let next = ac.currentTime + 0.1, step = 0;
      const sched = setInterval(() => {
        while (next < ac.currentTime + 0.3) {
          const bar = Math.floor(step / 8), s8 = step % 8, at = next;
          if (s8 === 0) { CH[bar % 4].forEach((n, i) => tone(bus, { f: midi(n), type: 'triangle', at: at + i * 0.012, dur: beat * 4, vol: 0.045, attack: 0.25, release: 1.2, filterF: 1400 })); tone(bus, { f: midi(CH[bar % 4][0] - 12), type: 'sine', at, dur: beat * 3.5, vol: 0.09, attack: 0.05, release: 0.8 }); }
          if (s8 === 0 || s8 === 5) { const o = ac.createOscillator(); const g = gain(0); o.frequency.setValueAtTime(110, at); o.frequency.exponentialRampToValueAtTime(42, at + 0.28); g.gain.setValueAtTime(0.32, at); g.gain.exponentialRampToValueAtTime(0.0001, at + 0.35); o.connect(g).connect(bus); o.start(at); o.stop(at + 0.4); }
          if (s8 === 2 || s8 === 6) burst(bus, { at, dur: 0.16, f: 1800, q: 0.7, vol: 0.09 });
          if (step % 1 === 0) burst(bus, { at: at + (s8 % 2 ? beat * 0.08 : 0), dur: 0.025, f: 8000, type: 'highpass', vol: s8 % 2 ? 0.02 : 0.035 });
          if (Math.random() < 0.18) tone(bus, { f: midi(PENT[Math.floor(Math.random() * PENT.length)]), type: 'sine', at: at + rnd(0, beat / 2), dur: rnd(0.3, 0.9), vol: 0.035, attack: 0.02, release: 0.5 });
          next += beat / 2; step++;
        }
      }, 60);
      return () => { clearInterval(sched); clearInterval(pops); crackle.stop(); };
    },
  };
  // ---------------------------------------------------------------- music
  const midi = (n) => 440 * Math.pow(2, (n - 69) / 12);
  const pick = (a) => a[Math.floor(Math.random() * a.length)];
  const SC = { major: [0, 2, 4, 5, 7, 9, 11], minor: [0, 2, 3, 5, 7, 8, 10], dorian: [0, 2, 3, 5, 7, 9, 10], lydian: [0, 2, 4, 6, 7, 9, 11], hijaz: [0, 1, 4, 5, 7, 8, 10], mixo: [0, 2, 4, 5, 7, 9, 10] };
  const deg = (key, sc, d) => { const n = sc.length; return key + 12 * Math.floor(d / n) + sc[((d % n) + n) % n]; };
  const chordOf = (key, sc, d, size = 3) => Array.from({ length: size }, (_, i) => deg(key, sc, d + 2 * i));
  const irCache = {};
  function reverbNode(secs) {
    const c = ac.createConvolver();
    if (!irCache[secs]) { const n = Math.floor(ac.sampleRate * secs), b = ac.createBuffer(2, n, ac.sampleRate); for (let ch = 0; ch < 2; ch++) { const d = b.getChannelData(ch); for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / n, 3); } irCache[secs] = b; }
    c.buffer = irCache[secs]; return c;
  }
  function env(g, at, vol, attack, len) { g.gain.setValueAtTime(0.0001, at); g.gain.exponentialRampToValueAtTime(vol, at + attack); g.gain.exponentialRampToValueAtTime(0.0001, at + len); }
  // instruments — each plays one note into `out`
  function piano(out, n, at, dur, vol) {
    const len = Math.min(4.5, dur + 1.2), g = gain(0), lp = filt('lowpass', 900 + midi(n) * 3); env(g, at, vol, 0.006, len); g.connect(lp).connect(out);
    [[1, 1], [2, 0.42], [3, 0.16], [4, 0.08], [5.02, 0.03]].forEach(([h, a]) => { const o = ac.createOscillator(); o.frequency.value = midi(n) * h; const pg = gain(a); o.connect(pg).connect(g); o.start(at); o.stop(at + len + 0.05); });
  }
  const ksCache = {};
  function ksBuf(n, decay, bright, secs) {
    const k = [n, decay, bright, secs].join('|'); if (ksCache[k]) return ksCache[k];
    const sr = ac.sampleRate, len = Math.floor(sr * secs), b = ac.createBuffer(1, len, sr), d = b.getChannelData(0);
    const P = Math.max(2, Math.round(sr / midi(n))), ring = new Float32Array(P); let prev = 0;
    for (let i = 0; i < P; i++) { prev += (Math.random() * 2 - 1 - prev) * bright; ring[i] = prev; }
    let peak = 0.001; for (let i = 0; i < len; i++) { const j = i % P, v = ring[j]; d[i] = v; ring[j] = decay * 0.5 * (v + ring[(j + 1) % P]); if (i < P * 4) peak = Math.max(peak, Math.abs(v)); }
    for (let i = 0; i < len; i++) d[i] /= peak * 1.4;
    return (ksCache[k] = b);
  }
  function pluck(out, n, at, vol, { decay = 0.998, bright = 0.5, secs = 2.5, lp } = {}) {
    const s = ac.createBufferSource(); s.buffer = ksBuf(Math.round(n), decay, bright, secs); const g = gain(vol);
    if (lp) s.connect(filt('lowpass', lp)).connect(g); else s.connect(g); g.connect(out); s.start(at);
  }
  function synth(out, n, at, dur, vol, { type = 'sawtooth', cutoff = 1800, attack = 0.01, detune = 0, q = 0.7 } = {}) {
    const g = gain(0), lp = filt('lowpass', cutoff, q); env(g, at, vol, attack, dur); g.connect(out); lp.connect(g);
    (detune ? [-detune, detune] : [0]).forEach((dt) => { const o = ac.createOscillator(); o.type = type; o.frequency.value = midi(n); o.detune.value = dt; o.connect(lp); o.start(at); o.stop(at + dur + 0.05); });
  }
  function bell(out, n, at, vol, len = 2.5, parts = [[1, 1], [2, 0.18], [5.43, 0.07]]) {
    parts.forEach(([h, a], i) => { const o = ac.createOscillator(); o.frequency.value = midi(n) * h; const g = gain(0); env(g, at, vol * a, 0.003, len / (i + 1)); o.connect(g).connect(out); o.start(at); o.stop(at + len + 0.05); });
  }
  function kick(out, at, vol = 0.4, f0 = 140) { const o = ac.createOscillator(), g = gain(0); o.frequency.setValueAtTime(f0, at); o.frequency.exponentialRampToValueAtTime(42, at + 0.18); env(g, at, vol, 0.002, 0.32); o.connect(g).connect(out); o.start(at); o.stop(at + 0.4); }
  function snare(out, at, vol = 0.15, len = 0.18) { burst(out, { at, dur: len, f: 1900, q: 0.6, vol }); const o = ac.createOscillator(), g = gain(0); o.frequency.value = 190; env(g, at, vol * 0.6, 0.002, 0.08); o.connect(g).connect(out); o.start(at); o.stop(at + 0.12); }
  const hat = (out, at, vol = 0.03, len = 0.04) => burst(out, { at, dur: len, f: 8000, type: 'highpass', vol });
  const ride = (out, at, vol = 0.03) => { burst(out, { at, dur: 0.5, f: 6000, q: 2.5, vol }); burst(out, { at, dur: 0.03, f: 9000, type: 'highpass', vol: vol * 0.8 }); };
  const clap = (out, at, vol = 0.12) => { for (let i = 0; i < 3; i++) burst(out, { at: at + i * 0.011, dur: i === 2 ? 0.14 : 0.02, f: 1300, q: 1.2, vol }); };
  // melodies: a short motif (scale steps above the chord's root) repeated as A A' A B, so it sounds like a tune
  function motif(len, density, step = [-2, -1, -1, 1, 1, 2]) { const m = []; let cur = pick([0, 2, 4]); for (let i = 0; i < len; i++) { if (i && Math.random() > density) { m.push(null); continue; } m.push(cur); cur = Math.max(-1, Math.min(7, cur + pick(step))); } return m; }
  const mutate = (m, p = 0.25) => m.map((v, i) => (!i || Math.random() > p ? v : v == null ? pick([0, 2, 4]) : Math.random() < 0.3 ? null : v + pick([-1, 1])));
  // a style = tempo, modes (scale, keys, chord progressions) and what to play on each step
  const style = (o) => (out) => {
    const dry = gain(1); dry.connect(out); const rv = reverbNode(o.reverb || 2.4); const wet = gain(o.wet ?? 0.25); rv.connect(wet).connect(out);
    const send = gain(1); send.connect(dry); send.connect(rv);
    const steps = o.steps || 8, beats = o.beats || 4, beat = 60 / o.bpm, sd = (beat * beats) / steps;
    const st = { sd, beat, steps };
    const section = () => { const [sc, keys, progs] = pick(o.modes); st.sc = SC[sc]; st.key = pick(keys); st.prog = pick(progs); st.A = motif(steps, o.density ?? 0.6, o.melStep); st.B = motif(steps, o.density ?? 0.6, o.melStep); st.A2 = mutate(st.A); st.var = Math.floor(Math.random() * 3); };
    section();
    const e = { out: send, dry, rv, st };
    const cleanup = o.setup ? o.setup(e) : null;
    let next = ac.currentTime + 0.15, step = 0;
    const t = setInterval(() => {
      while (next < ac.currentTime + 0.4) {
        const s = step % steps, bar = Math.floor(step / steps);
        if (s === 0) {
          if (bar && bar % (o.sectionBars || 16) === 0) section();
          const per = o.barsPerChord || 1, i = Math.floor(bar / per) % st.prog.length;
          st.bar = bar; st.cd = st.prog[i]; st.nd = st.prog[(i + 1) % st.prog.length]; st.chord = chordOf(st.key, st.sc, st.cd, o.chordSize || 3); st.newChord = bar % per === 0;
          st.mel = [st.A, st.A2, st.A, st.B][bar % 4];
        }
        const at = next + (o.swing && s % 2 ? sd * o.swing : 0) + (o.human ? Math.random() * o.human : 0);
        o.play(e, s, at, st);
        next += sd; step++;
      }
    }, 50);
    return () => { clearInterval(t); if (cleanup) cleanup(); setTimeout(() => { try { dry.disconnect(); wet.disconnect(); } catch {} }, 6000); };
  };
  const mel = (st, s, oct = 0) => { const m = st.mel[s]; return m == null ? null : deg(st.key, st.sc, st.cd + m) + 12 * oct; };
  const MAJ = [[0, 5, 3, 4], [0, 4, 5, 3], [5, 3, 0, 4], [3, 4, 2, 5], [0, 3, 1, 4]];
  const MIN = [[0, 5, 2, 6], [0, 3, 6, 2], [0, 6, 5, 6], [5, 6, 0, 0], [0, 3, 4, 0]];
  const MUSIC_BUILD = {
    piano: style({ bpm: 66, density: 0.5, wet: 0.35, reverb: 3, modes: [['major', [60, 62, 65, 67], MAJ], ['minor', [57, 62, 64], MIN]],
      play(e, s, at, st) {
        const c = st.chord, arp = [c[0] - 24, c[2] - 24, c[0] - 12, c[1] - 12, c[2] - 12, c[1] - 12, c[0] - 12, c[2] - 24];
        piano(e.out, arp[s], at, st.sd * 3, s ? 0.05 : 0.09);
        if (st.bar % 8 < 7) { const n = mel(st, s, 1); if (n != null) piano(e.out, n, at, st.beat * 1.5, 0.085); }
      } }),
    jazz: style({ bpm: 116, swing: 0.33, density: 0.45, chordSize: 4, wet: 0.18, modes: [['major', [60, 65, 58, 63], [[1, 4, 0, 5], [1, 4, 0, 0], [2, 5, 1, 4], [0, 5, 1, 4]]]],
      play(e, s, at, st) {
        const c = st.chord;
        if (s % 2 === 0) { // walking bass
          const b = s / 2, root = c[0] - 24, nr = deg(st.key, st.sc, st.nd) - 24;
          const n = b === 0 ? root : b === 1 ? pick([c[1], c[2]]) - 24 : b === 2 ? c[2] - 24 + pick([0, 2]) : nr + pick([-1, 1]);
          pluck(e.dry, n, at, 0.55, { decay: 0.994, bright: 0.25, secs: 1.2, lp: 700 });
        }
        if (s % 2 === 0 || s === 3 || s === 7) ride(e.out, at, s % 4 === 0 ? 0.022 : 0.017);
        if (s === 2 || s === 6) { hat(e.dry, at, 0.025, 0.03); burst(e.dry, { at, dur: 0.12, f: 2500, q: 0.4, vol: 0.02 }); }
        if ((s === 0 && Math.random() < 0.35) || (s === 3 && Math.random() < 0.45) || (s === 5 && Math.random() < 0.3)) [c[1], c[2], c[3], c[0] + 12].forEach((n, i) => piano(e.out, n - 12 + (i > 2 ? 0 : 12), at + i * 0.008, 0.35, 0.03));
        if (st.bar % 8 < 6) { const n = mel(st, s, 1); if (n != null) piano(e.out, n, at, st.sd * 1.6, 0.07); }
      } }),
    classical: style({ bpm: 72, steps: 16, wet: 0.3, reverb: 2.8, modes: [['major', [60, 62, 67], [[0, 4, 5, 2, 3, 0, 3, 4], [0, 3, 4, 0], [0, 5, 1, 4]]], ['minor', [57, 62], [[0, 3, 4, 0], [0, 5, 3, 4]]]],
      play(e, s, at, st) {
        const c = st.chord, v = [c[0] - 12, c[2] - 12, c[0], c[1], c[2]];
        const P = [[0, 1, 2, 3, 4, 2, 3, 4], [0, 2, 1, 3, 2, 4, 3, 2], [0, 4, 3, 2, 1, 2, 3, 4]][st.var];
        pluck(e.out, v[P[s % 8]] + (st.var === 2 && s >= 8 ? 12 : 0), at, 0.22, { decay: 0.997, bright: 0.85, secs: 1.6 });
        if (s === 0) { synth(e.out, c[0] - 24, at, st.sd * 16 + 0.6, 0.05, { cutoff: 600, attack: 0.4, detune: 6 }); synth(e.out, c[0] - 12, at, st.sd * 16 + 0.6, 0.03, { cutoff: 700, attack: 0.5, detune: 6 }); }
      } }),
    guitar: style({ bpm: 84, density: 0.3, human: 0.018, wet: 0.2, modes: [['major', [55, 57, 60, 52], [[0, 4, 5, 3], [0, 3, 0, 4], [5, 3, 0, 4], [0, 4, 3, 3]]]],
      play(e, s, at, st) {
        const c = st.chord, v = [c[0] - 12, c[2] - 12, c[1], c[2], c[0] + 12, c[1] + 12];
        [[0, 4], [2], [1], [3], [0], [5], [1], [3]][s].forEach((i, k) => pluck(e.out, v[i], at + k * 0.012, i < 2 ? 0.32 : 0.22, { decay: 0.9985, bright: 0.45, secs: 3 }));
        if (st.bar % 4 === 3) { const n = mel(st, s, 1); if (n != null) pluck(e.out, n, at, 0.22, { decay: 0.998, bright: 0.6, secs: 2 }); }
      } }),
    rock: style({ bpm: 124, wet: 0.12, modes: [['minor', [52, 57, 50], [[0, 5, 6, 0], [0, 3, 5, 6], [0, 6, 5, 4], [0, 0, 5, 6]]]],
      setup(e) { const ws = ac.createWaveShaper(), k = 30, n = 1024, curve = new Float32Array(n); for (let i = 0; i < n; i++) { const x = (i * 2) / n - 1; curve[i] = ((1 + k) * x) / (1 + k * Math.abs(x)); } ws.curve = curve; const pre = gain(0.9); const post = gain(0.32); pre.connect(ws).connect(filt('lowpass', 3200)).connect(post).connect(e.out); e.amp = pre; },
      play(e, s, at, st) {
        const r = st.chord[0] - 24, chorus = st.bar % 8 >= 4;
        if (chorus) { if (s === 0 || s === 3 || s === 6) [r, r + 7, r + 12].forEach((n) => synth(e.amp, n, at, s === 6 ? st.sd * 2 : st.sd * 3, 0.16, { cutoff: 4000 })); }
        else [r, r + 7].forEach((n) => synth(e.amp, n, at, st.sd * 0.7, 0.14, { cutoff: 1100 }));
        synth(e.dry, r - 12, at, st.sd * 0.9, 0.16, { type: 'triangle', cutoff: 500 });
        if (s === 0 || s === 5 || (s === 4 && chorus)) kick(e.dry, at, 0.42);
        if (s === 2 || s === 6) snare(e.out, at, 0.2, 0.2);
        hat(e.dry, at, chorus ? 0.035 : 0.025, chorus && s % 2 ? 0.12 : 0.04);
        if (chorus && st.bar % 8 === 7) { const n = mel(st, s, 0); if (n != null) synth(e.amp, n, at, st.sd * 1.5, 0.08, { cutoff: 3000 }); }
      } }),
    synthwave: style({ bpm: 96, steps: 16, wet: 0.3, modes: [['minor', [57, 52, 62], MIN]],
      setup(e) { const d = ac.createDelay(1); d.delayTime.value = e.st.sd * 3; const fb = gain(0.35); const dg = gain(0.4); d.connect(fb).connect(d); d.connect(dg).connect(e.out); e.delay = gain(1); e.delay.connect(e.out); e.delay.connect(d); },
      play(e, s, at, st) {
        const c = st.chord;
        if (s % 8 === 0) kick(e.dry, at, 0.4);
        if (s === 4 || s === 12) { snare(e.dry, at, 0.16, 0.12); burst(e.rv, { at, dur: 0.35, f: 1500, q: 0.5, vol: 0.4 }); }
        if (s % 4 === 2) hat(e.dry, at, 0.03);
        if (s % 2 === 0) synth(e.dry, c[0] - 24 + (s % 4 === 2 ? 12 : 0), at, st.sd * 1.6, 0.1, { cutoff: 600, q: 4 });
        synth(e.delay, [c[0], c[1], c[2], c[0] + 12][s % 4] + 12, at, st.sd * 0.8, 0.035, { cutoff: 2600, type: 'square' });
        if (s === 0) synth(e.out, c[0] - 12, at, st.sd * 16, 0.03, { cutoff: 1100, attack: 0.3, detune: 10 }), c.forEach((n) => synth(e.out, n, at, st.sd * 16, 0.022, { cutoff: 1300, attack: 0.4, detune: 10 }));
        if (st.bar % 8 >= 4 && s % 2 === 0) { const n = mel(st, s / 2, 1); if (n != null) synth(e.delay, n, at, st.sd * 3, 0.05, { type: 'sawtooth', cutoff: 3000, detune: 8 }); }
      } }),
    chiptune: style({ bpm: 132, steps: 16, density: 0.6, wet: 0.08, modes: [['major', [60, 62, 65], MAJ], ['minor', [57, 64], MIN]],
      play(e, s, at, st) {
        const c = st.chord;
        if (s % 2 === 0) { const n = mel(st, s / 2, 1); if (n != null) synth(e.out, n, at, st.sd * 1.8, 0.035, { type: 'square', cutoff: 6000 }); }
        if (s % 2 === 0) synth(e.out, c[0] - 24 + (s % 4 ? 12 : 0), at, st.sd * 1.5, 0.11, { type: 'triangle', cutoff: 5000 });
        if (st.bar % 8 >= 4) synth(e.out, [c[0], c[1], c[2]][s % 3] + 24, at, st.sd * 0.8, 0.012, { type: 'square', cutoff: 7000 });
        if (s % 8 === 0) kick(e.out, at, 0.3, 200);
        if (s === 4 || s === 12) burst(e.out, { at, dur: 0.1, f: 4000, type: 'highpass', vol: 0.12 });
        if (s % 2 === 0) burst(e.out, { at, dur: 0.02, f: 10000, type: 'highpass', vol: 0.03 });
      } }),
    dance: style({ bpm: 122, steps: 16, chordSize: 4, wet: 0.2, modes: [['minor', [57, 53, 60], [[0, 5, 2, 6], [0, 3, 0, 4], [5, 6, 0, 0]]], ['dorian', [62, 57], [[0, 3, 0, 3]]]],
      setup(e) { const d = ac.createDelay(1); d.delayTime.value = e.st.sd * 3; const fb = gain(0.3); const dg = gain(0.35); d.connect(fb).connect(d); d.connect(dg).connect(e.out); e.delay = gain(1); e.delay.connect(e.out); e.delay.connect(d); },
      play(e, s, at, st) {
        const c = st.chord;
        if (s % 4 === 0) kick(e.dry, at, 0.42);
        if (s === 4 || s === 12) clap(e.out, at, 0.1);
        if (s % 4 === 2) hat(e.dry, at, 0.045, 0.12); else hat(e.dry, at, 0.012);
        if (s % 4 === 2 || s === 15) synth(e.dry, c[0] - 24, at, st.sd * 1.2, 0.13, { cutoff: 450, q: 3 });
        if (s === 6 || s === 11) c.forEach((n) => synth(e.delay, n, at, 0.16, 0.03, { cutoff: 1600 }));
        if (st.bar % 16 >= 8 && s % 2 === 0) { const n = mel(st, s / 2, 1); if (n != null) piano(e.delay, n, at, 0.4, 0.06); }
      } }),
    oud: style({ bpm: 100, density: 0.75, melStep: [-1, -1, 1, 1, 2, -2], wet: 0.2, modes: [['hijaz', [62, 57, 60], [[0, 0, 6, 0], [0, 3, 6, 0], [0, 3, 0, 6]]]],
      setup(e) { const o = ac.createOscillator(); o.type = 'sawtooth'; o.frequency.value = midi(e.st.key - 24); const g = gain(0.03); o.connect(filt('lowpass', 350)).connect(g).connect(e.out); o.start(); e.drone = o; return () => o.stop(ac.currentTime + 1); },
      play(e, s, at, st) {
        if (s === 0) e.drone.frequency.setTargetAtTime(midi(st.key - 24), at, 0.3);
        const D = (t) => { kick(e.dry, t, 0.3, 95); burst(e.dry, { at: t, dur: 0.15, f: 200, type: 'lowpass', vol: 0.15 }); };
        const T = (t, v = 0.11) => { burst(e.dry, { at: t, dur: 0.05, f: 4500, q: 1.5, vol: v }); };
        if (s === 0 || s === 4) D(at); if (s === 1 || s === 3 || s === 6) T(at); if ((s === 5 || s === 7) && Math.random() < 0.5) T(at, 0.05);
        if (s % 2) burst(e.dry, { at, dur: 0.08, f: 9000, q: 3, vol: 0.02 });
        const n = mel(st, s, 0);
        if (n != null) { pluck(e.out, n, at, 0.3, { decay: 0.996, bright: 0.7, secs: 1.4 }); if (Math.random() < 0.15) pluck(e.out, n, at + st.sd / 2, 0.2, { decay: 0.996, bright: 0.7, secs: 1 }); }
      } }),
    musicbox: style({ bpm: 70, beats: 3, steps: 6, density: 0.55, melStep: [-1, -1, 1, 1, 2, -2, 0], wet: 0.35, reverb: 3, modes: [['major', [60, 62, 65], [[0, 3, 4, 0], [0, 5, 3, 4], [0, 4, 0, 4]]]],
      play(e, s, at, st) {
        const c = st.chord;
        if (s === 0) bell(e.out, c[0], at, 0.06, 2); if (s === 2 || s === 4) bell(e.out, (s === 2 ? c[1] : c[2]) + 12, at, 0.035, 1.5);
        const n = mel(st, s, 2); if (n != null) bell(e.out, n, at, 0.07, 2.5);
      } }),
    space: style({ bpm: 40, steps: 4, barsPerChord: 2, sectionBars: 8, chordSize: 4, wet: 0.6, reverb: 4, modes: [['lydian', [60, 62, 57], [[0, 1, 0, 4], [0, 4, 5, 1]]], ['major', [60, 65], [[0, 3, 5, 4]]]],
      play(e, s, at, st) {
        const c = st.chord, len = st.sd * 8 + 3;
        if (s === 0 && st.newChord) { c.forEach((n) => synth(e.out, n - 12, at, len, 0.035, { cutoff: 900, attack: 2.5, detune: 9 })); synth(e.out, c[0] - 24, at, len, 0.07, { type: 'sine', cutoff: 400, attack: 3 }); }
        if (Math.random() < 0.4) bell(e.out, deg(st.key, st.sc, st.cd + pick([0, 2, 4, 7, 9])) + 12, at + Math.random(), 0.035, 4);
      } }),
    harp: style({ bpm: 60, steps: 12, beats: 4, barsPerChord: 1, wet: 0.45, reverb: 3.5, density: 0.35, modes: [['major', [60, 65, 62], MAJ], ['lydian', [60], [[0, 1, 0, 1]]]],
      play(e, s, at, st) {
        const c = st.chord, up = [c[0] - 12, c[1] - 12, c[2] - 12, c[0], c[1], c[2], c[0] + 12, c[1] + 12, c[2] + 12, c[0] + 24, c[2] + 12, c[0] + 12];
        pluck(e.out, up[s], at, 0.17, { decay: 0.999, bright: 0.35, secs: 3.5 });
        if (s === 0) synth(e.out, c[0] - 12, at, st.sd * 12 + 1, 0.03, { cutoff: 800, attack: 0.8, detune: 7 });
        if (st.bar % 4 >= 2 && s % 3 === 0) { const n = mel(st, s / 3, 2); if (n != null) bell(e.out, n, at, 0.03, 3); }
      } }),
    bowls: (out) => {
      const rv = reverbNode(4.5), wet = gain(0.5); rv.connect(wet).connect(out); const send = gain(1); send.connect(out); send.connect(rv);
      const root = pick([48, 50, 53]), drone = [0, 7].map((iv, i) => { const o = ac.createOscillator(); o.frequency.value = midi(root - 12 + iv); const g = gain(i ? 0.03 : 0.05); o.connect(g).connect(send); o.start(); return o; });
      const strike = () => {
        const at = ac.currentTime + 0.05, f = midi(root + pick([12, 14, 19, 21, 24, 26, 31])), vol = rnd(0.05, 0.09);
        [[1, 1], [2.76, 0.35], [5.4, 0.12]].forEach(([h, a], i) => [0, 1.6 + i].forEach((beat) => { const o = ac.createOscillator(); o.frequency.value = f * h + beat; const g = gain(0); env(g, at, vol * a * 0.5, 0.04, 10 / (i + 1)); o.connect(g).connect(send); o.start(at); o.stop(at + 11); }));
        burst(send, { at, dur: 0.03, f: 2500, q: 1, vol: 0.03 });
      };
      let t; const next = () => { t = setTimeout(() => { strike(); next(); }, rnd(4500, 10000)); }; strike(); next();
      return () => { clearTimeout(t); drone.forEach((o) => o.stop(ac.currentTime + 1)); };
    },
  };
  Object.assign(BUILD, MUSIC_BUILD);

  function startSound(id) {
    if (live.has(id) || !BUILD[id]) return;
    ctx(); const g = gain(0); g.connect(master);
    const stop = BUILD[id](g);
    g.gain.setTargetAtTime(vol(id, S.levels[id] ?? 0.6), ac.currentTime, 0.6);
    live.set(id, { g, stop });
  }
  function stopSound(id, fade = 0.5) {
    const l = live.get(id); if (!l) return; live.delete(id);
    l.g.gain.setTargetAtTime(0, ac.currentTime, fade / 3);
    setTimeout(() => { try { l.stop(); } catch {} try { l.g.disconnect(); } catch {} }, fade * 1000 + 200);
  }
  function play() { S.playing = true; ctx().resume(); for (const [id, v] of Object.entries(S.levels)) if (v > 0) startSound(id); refresh(); }
  function pause(fade = 0.6) { S.playing = false; for (const id of [...live.keys()]) stopSound(id, fade); clearTimeout(timerT); timerEnd = 0; refresh(); }
  function setLevel(id, v) {
    if (v > 0 && IS_MUSIC.has(id)) for (const o of Object.keys(S.levels)) if (o !== id && IS_MUSIC.has(o)) { delete S.levels[o]; stopSound(o, 1.2); }
    if (v > 0) S.levels[id] = v; else delete S.levels[id];
    save();
    if (!S.playing) { if (v > 0) play(); return; }
    if (v > 0) { if (!live.has(id)) startSound(id); else live.get(id).g.gain.setTargetAtTime(vol(id, v), ac.currentTime, 0.15); } else stopSound(id);
    if (!Object.keys(S.levels).length) pause();
  }
  function setTimer(min) {
    S.timer = min; save(); clearTimeout(timerT); timerEnd = 0;
    if (min > 0 && S.playing) { timerEnd = Date.now() + min * 60000; timerT = setTimeout(() => { pause(8); toast('🌙 Ambient sounds stopped (sleep timer)'); }, min * 60000); }
  }
  const currentMusic = () => Object.keys(S.levels).find((id) => IS_MUSIC.has(id));
  function newTune() { const id = currentMusic(); if (!id || !S.playing) return; stopSound(id, 1.2); setTimeout(() => { if (S.playing && S.levels[id]) startSound(id); }, 900); }
  function surprise() { const cur = currentMusic(); const id = pick(MUSIC.filter(([m]) => m !== cur))[0]; setLevel(id, (cur && S.levels[cur]) || 0.6); if (!S.playing) { play(); setTimer(S.timer); } refresh(); }
  const level = () => { if (!analyser) return 0; const d = new Float32Array(analyser.fftSize); analyser.getFloatTimeDomainData(d); let x = 0; for (const v of d) x += v * v; return Math.sqrt(x / d.length); };
  window.ambient = { play, pause, setLevel, newTune, surprise, level, music: MUSIC.map(([id]) => id), state: () => ({ ...S, live: [...live.keys()] }) };

  // ---------------------------------------------------------------- panel UI
  let body = null;
  function refresh() {
    document.querySelectorAll('.rail-btn[data-id="ambient"]').forEach((b) => b.classList.toggle('playing', S.playing));
    if (body && body.isConnected && body.querySelector('.amb')) render(body);
  }
  setInterval(() => { document.querySelectorAll('.rail-btn[data-id="ambient"]').forEach((b) => b.classList.toggle('playing', S.playing)); if (timerEnd && body && body.isConnected) { const el = body.querySelector('#amb-left'); if (el) { const s = Math.max(0, Math.round((timerEnd - Date.now()) / 1000)); el.textContent = `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')} left`; } } }, 1000);
  function render(el) {
    body = el;
    [...el.children].forEach((c) => { if (c.tagName !== 'WEBVIEW') c.remove(); });
    const div = document.createElement('div'); div.className = 'amb';
    const on = Object.keys(S.levels).length;
    div.innerHTML = `<div class="amb-top"><button class="amb-play ${S.playing ? 'on' : ''}" id="amb-play" ${on || !S.playing ? '' : ''}>${S.playing ? '⏸' : '▶'}</button>
        <div class="amb-now"><b>${S.playing ? 'Playing' : on ? 'Paused' : 'Pick some sounds'}</b><span>${on ? ALL.filter(([id]) => S.levels[id]).map(([, e, n]) => e + ' ' + n).join(' · ') : 'Music, nature sounds, or both'}</span></div></div>
      <canvas class="amb-viz" id="amb-viz" width="300" height="34" ${S.playing ? '' : 'hidden'}></canvas>
      <label class="amb-master">🔊 <input type="range" min="0" max="100" value="${Math.round(S.master * 100)}" id="amb-master"></label>
      <div class="amb-sub">Moods</div><div class="amb-presets">${PRESETS.map(([e, n], i) => `<button data-p="${i}">${e} ${n}</button>`).join('')}</div>
      <div class="amb-sub amb-subrow">Music <span><button id="amb-new" title="Same style, brand-new tune" ${currentMusic() && S.playing ? '' : 'disabled'}>⏭ New tune</button><button id="amb-surprise" title="Play a random style">🔀 Surprise me</button></span></div>
      <div class="amb-grid">${MUSIC.map(([id, e, n]) => { const v = S.levels[id] || 0; return `<div class="amb-tile ${v ? 'on' : ''}" data-id="${id}"><button class="amb-t"><span>${e}</span>${n}</button><input type="range" min="0" max="100" value="${Math.round(v * 100)}"></div>`; }).join('')}</div>
      <p class="amb-note" style="margin:0">One music style plays at a time, and it keeps making up new tunes, so it never repeats.</p>
      <div class="amb-sub">Sounds</div><div class="amb-grid">${SOUNDS.map(([id, e, n]) => { const v = S.levels[id] || 0; return `<div class="amb-tile ${v ? 'on' : ''}" data-id="${id}"><button class="amb-t"><span>${e}</span>${n}</button><input type="range" min="0" max="100" value="${Math.round(v * 100)}"></div>`; }).join('')}</div>
      <div class="amb-sub">Options</div>
      <div class="amb-opt"><label>⏲️ Stop after <select id="amb-timer"><option value="0">never</option>${[15, 30, 45, 60, 90, 120].map((m) => `<option value="${m}" ${S.timer === m ? 'selected' : ''}>${m} min</option>`).join('')}</select></label><span id="amb-left" class="muted-p">${timerEnd ? '' : ''}</span></div>
      <label class="amb-opt"><input type="checkbox" id="amb-focus" ${S.focusLink ? 'checked' : ''}> 🍅 Play during Focus sessions, pause on breaks</label>
      <p class="amb-note">All music and sounds are made live on your computer: no internet, no ads, no talking.</p>`;
    el.appendChild(div);
    div.querySelector('#amb-play').onclick = () => { if (S.playing) pause(); else { if (!Object.keys(S.levels).length) S.levels = { ...PRESETS[0][2] }; play(); setTimer(S.timer); } };
    div.querySelector('#amb-master').oninput = (e) => { S.master = e.target.value / 100; if (master) master.gain.setTargetAtTime(S.master, ac.currentTime, 0.05); save(); };
    div.querySelectorAll('[data-p]').forEach((b) => (b.onclick = () => { const p = PRESETS[+b.dataset.p][2]; for (const id of Object.keys(S.levels)) if (!p[id]) setLevel(id, 0); S.levels = { ...p }; save(); if (S.playing) { for (const [id, v] of Object.entries(p)) { if (live.has(id)) live.get(id).g.gain.setTargetAtTime(vol(id, v), ac.currentTime, 0.3); else startSound(id); } } else play(); if (PRESETS[+b.dataset.p][1] === 'Sleep' && !S.timer) setTimer(30); else setTimer(S.timer); refresh(); }));
    div.querySelectorAll('.amb-tile').forEach((t) => {
      const id = t.dataset.id; const r = t.querySelector('input');
      t.querySelector('.amb-t').onclick = () => { setLevel(id, S.levels[id] ? 0 : IS_MUSIC.has(id) ? 0.75 : 0.6); if (!S.playing && S.levels[id]) { play(); setTimer(S.timer); } refresh(); };
      r.oninput = () => { setLevel(id, r.value / 100); t.classList.toggle('on', r.value > 0); };
      r.onchange = refresh;
    });
    div.querySelector('#amb-new').onclick = newTune;
    div.querySelector('#amb-surprise').onclick = surprise;
    viz(div.querySelector('#amb-viz'));
    div.querySelector('#amb-timer').onchange = (e) => setTimer(+e.target.value);
    div.querySelector('#amb-focus').onchange = (e) => { S.focusLink = e.target.checked; save(); };
  }
  // a little live equaliser while music plays (only runs while the panel is open)
  let vizOn = false;
  function viz(cv) {
    if (vizOn || !cv || !S.playing) return; vizOn = true;
    const g = cv.getContext('2d'), bins = new Uint8Array(analyser ? analyser.frequencyBinCount : 0), N = 28;
    const color = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#7c5cff';
    const draw = () => {
      if (!cv.isConnected || !S.playing || !analyser || document.hidden) { vizOn = false; return; }
      analyser.getByteFrequencyData(bins); g.clearRect(0, 0, cv.width, cv.height); g.fillStyle = color;
      const w = cv.width / N;
      for (let i = 0; i < N; i++) { const idx = Math.floor(Math.pow(i / N, 1.7) * bins.length * 0.6) + 1; const h = Math.max(2, (bins[idx] / 255) * cv.height); g.globalAlpha = 0.45 + (0.55 * i) / N; g.fillRect(i * w + 1, cv.height - h, w - 3, h); }
      requestAnimationFrame(draw);
    };
    requestAnimationFrame(draw);
  }
  window.renderAmbientPanel = render;

  // follow Focus mode
  let lastPhase = null;
  nb.on('focus:state', (f) => {
    if (!S.focusLink || f.phase === lastPhase) { lastPhase = f.phase; return; }
    if (f.phase === 'focus' && !f.paused && !S.playing) { if (!Object.keys(S.levels).length) S.levels = { brown: 0.5 }; play(); }
    if ((f.phase === 'break' || f.phase === 'idle') && S.playing) pause(1.5);
    lastPhase = f.phase;
  });
  const _cmds = commands;
  commands = function () { return [..._cmds(), CMD('ambient', S.playing ? 'Pause ambient sounds' : 'Play ambient sounds 🎧', '', () => { if (S.playing) pause(); else { if (!Object.keys(S.levels).length) S.levels = { ...PRESETS[0][2] }; play(); } }, 'music')]; };

  // add the panel to the sidebar once for people who already had NoamBrowser
  const _init = hooks.init;
  hooks.init = async (init) => {
    await _init(init);
    let added = false; try { added = localStorage.getItem('ambient-added') === '1'; } catch {}
    const panels = (state.settings.sidePanel || {}).panels || [];
    if (!added && !panels.some((p) => p.kind === 'ambient')) {
      const i = Math.max(0, panels.findIndex((p) => p.kind === 'reading') + 1);
      const list = [...panels]; list.splice(i, 0, { id: 'ambient', kind: 'ambient', name: 'Music & sounds' });
      state.settings = await nb.invoke('settings:set', { sidePanel: { panels: list } });
    }
    try { localStorage.setItem('ambient-added', '1'); } catch {}
    const cur = ((state.settings.sidePanel || {}).panels || []);
    if (cur.some((p) => p.kind === 'ambient' && p.name === 'Ambient sounds')) state.settings = await nb.invoke('settings:set', { sidePanel: { panels: cur.map((p) => (p.kind === 'ambient' && p.name === 'Ambient sounds' ? { ...p, name: 'Music & sounds' } : p)) } });
  };
})();
