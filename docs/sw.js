self.addEventListener('install', event => {
  event.waitUntil(
    caches.open('soul-reflections-cache').then(cache => {
      return cache.addAll([
        'index.html',
        'manifest.json',
        'https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js',
        'https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js',
        'https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js'
      ]);
    }).catch(err => console.error('Cache addAll failed:', err))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request).catch(err => console.error('Fetch failed:', err));
    })
  );
});
