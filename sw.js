// DICE service worker: works offline for pages already visited, keeps data fresh when online.
const VERSION = 'dice-v1';
const CORE = ['/', '/2027', '/offline', '/styles.css', '/app.js', '/pwa.js', '/logo.webp', '/favicon.png', '/icon-192.png', '/manifest.webmanifest'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(CORE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});

const put = (req, res) => { if (res && (res.ok || res.type === 'opaque')) { const copy = res.clone(); caches.open(VERSION).then((c) => c.put(req, copy)); } return res; };

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  const same = url.origin === self.location.origin;
  if (same && url.pathname.startsWith('/api/')) return; // sign-ups, exports: always live
  if (same && url.pathname === '/sw.js') return;

  // Pages: network first, then the saved copy, then the offline page.
  if (req.mode === 'navigate') {
    e.respondWith(fetch(req).then((res) => put(req, res)).catch(() => caches.match(req, { ignoreSearch: true }).then((r) => r || caches.match('/offline'))));
    return;
  }
  // Polling-unit data: network first, saved copy when offline.
  if (same && url.pathname.startsWith('/vr-data/')) {
    e.respondWith(fetch(req).then((res) => put(req, res)).catch(() => caches.match(req)));
    return;
  }
  // Styles, scripts, images, data files, map libraries and fonts: saved copy at once, refreshed in the background.
  const cdn = /^(cdnjs\.cloudflare\.com|fonts\.googleapis\.com|fonts\.gstatic\.com)$/.test(url.hostname);
  if (same || cdn) {
    e.respondWith(caches.match(req).then((hit) => {
      const net = fetch(req).then((res) => put(req, res)).catch(() => hit);
      return hit || net;
    }));
  }
});
