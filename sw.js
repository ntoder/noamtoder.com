// sw.js — lets the Game Hub be installed as an app and keeps games playable offline.
// Pages: try the network first (so updates show up straight away), fall back to the saved copy.
// Firebase / ads / analytics are never cached.
const CACHE = "gamehub-v11";
const CORE = ["/", "/game-shell.css", "/games.js", "/progress.js", "/hub.js", "/i18n.js", "/firebase-config.js", "/favicon.png", "/icons/icon-192.png"];

self.addEventListener("install", (e) => {
    e.waitUntil(caches.open(CACHE).then((c) => c.addAll(CORE)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", (e) => {
    e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", (e) => {
    const url = new URL(e.request.url);
    if (e.request.method !== "GET" || url.origin !== location.origin) return; // let Firebase, ads etc. go straight to the network
    e.respondWith(
        fetch(e.request).then((res) => {
            if (res.ok) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(e.request, copy)); }
            return res;
        }).catch(() => caches.match(e.request).then((r) => r || caches.match("/")))
    );
});
