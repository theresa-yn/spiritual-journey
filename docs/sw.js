// sw.js - Service Worker for Soul Reflections App
const CACHE_NAME = "soul-reflections-cache-v5"; // bumped to invalidate old caches
const OFFLINE_URL = "offline.html";
// Files to cache
const FILES_TO_CACHE = [
  "/",
  "/index.html",
  "/offline.html",
  "/manifest.json",
  "/sw.js",
  "/icon-192.png",
  "/icon-512.png"
];
// Install: cache files
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Service Worker: Pre-caching files");
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});
// Activate: cleanup old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keyList) =>
      Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            console.log("Service Worker: Removing old cache", key);
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});
// Fetch: serve from cache, then fallback to network, then offline page
self.addEventListener("fetch", (event) => {
  if (event.request.mode === "navigate") {
    // Always try network first for navigations with cache-bypass to get fresh index.html
    event.respondWith(
      (async () => {
        try {
          const freshRequest = new Request(event.request.url, { cache: "reload" });
          return await fetch(freshRequest);
        } catch (err) {
          const cache = await caches.open(CACHE_NAME);
          return (await cache.match(OFFLINE_URL)) || Response.error();
        }
      })()
    );
  } else {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return (
          response ||
          fetch(event.request).then((fetchResponse) => {
            return caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, fetchResponse.clone());
              return fetchResponse;
            });
          })
        );
      })
    );
  }
});
