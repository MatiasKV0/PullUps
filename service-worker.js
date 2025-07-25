self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open("mi-app").then((cache) => {
      return cache.addAll([
        "./",
        "./index.html",
        "./style.css",
        "./main.js",
        "./public/logo.webp",
      ]);
    })
  );
});

self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request);
    })
  );
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/service-worker.js")
      .then((reg) => console.log("SW registrado", reg))
      .catch((err) => console.error("SW error", err));
  });
}
