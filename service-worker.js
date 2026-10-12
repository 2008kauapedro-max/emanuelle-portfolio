/* Emanuelle Costa — PWA offline shell, sem frameworks. */
const CACHE_NAME = 'emanuelle-portfolio-v4-films-horizontal';
const APP_ASSETS = [
  "./",
  "./index.html",
  "./css/styles.css",
  "./js/main.js",
  "./manifest.webmanifest",
  "./assets/favicon.svg",
  "./assets/icons/icon-192.png",
  "./assets/icons/icon-512.png",
  "./assets/icons/icon-maskable-512.png",
  "./assets/icons/apple-touch-icon.png",
  "./assets/images/capa-compartilhamento.jpg",
  "./assets/images/preview-whatsapp-ec-v3.jpg",
  "./assets/images/comunidade.webp",
  "./assets/images/emanuel-editorial.webp",
  "./assets/images/emanuel-hero.webp",
  "./assets/images/emanuel-portrait.webp",
  "./assets/images/infancia-01.webp",
  "./assets/images/maternidade-01.webp",
  "./assets/images/maternidade-02.webp",
  "./assets/images/observacao.webp",
  "./assets/images/paisagem-campo.webp",
  "./assets/images/paisagem-ceu.webp",
  "./assets/images/paisagem-montanha.webp",
  "./assets/images/recem-nascido-01.webp",
  "./assets/images/recem-nascido-02.webp"
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(APP_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(key => key.startsWith('emanuelle-portfolio-') && key !== CACHE_NAME).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET' || request.headers.has('range')) return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // Prioriza conteúdo atualizado quando há rede; usa o cache quando offline.
  event.respondWith(
    fetch(request).then(response => {
      if (response.ok && response.status === 200) {
        const copy = response.clone();
        event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.put(request, copy)));
      }
      return response;
    }).catch(async () => {
      const cached = await caches.match(request);
      if (cached) return cached;
      if (request.mode === 'navigate') return caches.match('./index.html');
      return Response.error();
    })
  );
});
