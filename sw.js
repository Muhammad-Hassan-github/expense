const CACHE_NAME = "Expense v1";

const urlsToCache = [
  "/",
  "/index.html",
  "/app.js",
  "/manifest.json",
  "/icon/icon-192.png",
  "/icon/icon-512.png",
  "/itemimages/feed.png",
];

// INSTALL
self.addEventListener("install", event => {
  console.log("SW: Install event fired ✅");
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log("SW: Caching files:", urlsToCache);
      return Promise.all(
        urlsToCache.map(url =>
          cache.add(url).catch(err => {
            console.error("❌ Failed to cache:", url, err);
          })
        )
      );
    })
  );
  self.skipWaiting();
});

// ACTIVATE
self.addEventListener("activate", event => {
  console.log("SW: Activate event fired ✅");
  event.waitUntil(
    caches.keys().then(keys => {
      console.log("SW: Existing caches:", keys);
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            console.warn("SW: Deleting old cache:", key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// FETCH
self.addEventListener("fetch", event => {
  console.log("SW: Fetching:", event.request.url);

  event.respondWith(
    (async () => {
      try {
        const response = await fetch(event.request);
        console.log("SW: Network success:", event.request.url);
        if (response && response.status === 200) {
          const cache = await caches.open(CACHE_NAME);
          cache.put(event.request, response.clone());
        }
        return response;
      } catch (error) {
        console.warn("SW: Network failed, trying cache:", event.request.url);
        const cachedResponse = await caches.match(event.request);
        if (cachedResponse) {
          console.log("SW: Serving from cache:", event.request.url);
          return cachedResponse;
        }
        if (event.request.mode === "navigate") {
          console.log("SW: Navigation fallback to index.html");
          return caches.match("/index.html");
        }
        return new Response("⚠️ Offline (no cache)", {
          status: 503,
          headers: { "Content-Type": "text/plain" },
        });
      }
    })()
  );
});
