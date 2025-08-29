const CACHE_NAME = "soul-reflections-cache-v1";
const OFFLINE_URL = "/docs/offline.html"; // Update if using docs/ folder

// Files to cache (adjust paths if files are in docs/)
const FILES_TO_CACHE = [
  "/docs/", // Adjust to "/" if root
  "/docs/index.html",
  "/docs/offline.html",
  "/docs/manifest.json",
  "/docs/sw.js",
  "/docs/app.js",
  "/docs/icons/icon-192.png",
  "/docs/icons/icon-512.png"
];

// Install: cache files
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Service Worker: Pre-caching files");
      return cache.addAll(FILES_TO_CACHE).catch((error) => {
        console.error("Service Worker: Cache addAll failed", error);
      });
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

// Fetch: serve from cache, then network, then offline page
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // Bypass Firebase and API requests to network
  if (url.hostname.includes("firebase") || url.pathname.includes("/api/")) {
    event.respondWith(fetch(event.request).catch((error) => {
      console.error("Fetch failed for Firebase/API:", error);
      return new Response("Network error occurred", { status: 503 });
    }));
    return;
  }

  // Handle navigation requests
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request).catch(() =>
        caches.open(CACHE_NAME).then((cache) =>
          cache.match(OFFLINE_URL).then((response) => {
            if (!response) {
              console.error("Offline page not found in cache");
              return new Response(
                "<h1>Offline</h1><p>Please connect to the internet.</p>",
                { status: 200, headers: { "Content-Type": "text/html" } }
              );
            }
            return response;
          })
        )
      )
    );
  } else {
    // Handle other requests (cache-first, then network)
    event.respondWith(
      caches.match(event.request).then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request).then((fetchResponse) => {
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, fetchResponse.clone());
            return fetchResponse;
          });
        }).catch(() => {
          // Fallback for non-critical resources (e.g., images)
          return new Response("Resource not available offline", { status: 503 });
        });
      })
    );
  }
});
