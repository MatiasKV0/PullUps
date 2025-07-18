self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open('mi-app').then((cache) => {
      return cache.addAll([
        './',
        './index.html',
        './style.css',
        './main.js',
        './public/logo.webp'
      ]);
    })
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request);
    })
  );
});
