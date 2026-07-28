/* ============================================================
   Service Worker — Hub de apps
   Estrategia:
   - HTML / navegación  -> NETWORK-FIRST: estando online siempre
     bajás la última versión apenas cambiás el repo. Sin conexión,
     sirve la copia cacheada (funciona offline).
   - Íconos / manifest  -> stale-while-revalidate (rápido + se
     actualiza en segundo plano).
   - Google Fonts       -> cache-first (para que ande offline).

   No necesitás tocar nada para actualizar: al estar online, el
   contenido nuevo entra solo. Si alguna vez querés forzar el
   borrado total del cache viejo, subí el número de VERSION.
   ============================================================ */
const VERSION = "hub-v1";
const CORE = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-maskable-512.png",
  "./icons/apple-touch-icon.png"
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(VERSION).then((c) => c.addAll(CORE)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET" || !req.url.startsWith("http")) return;
  const url = new URL(req.url);
  const sameOrigin = url.origin === location.origin;

  // 1) Navegación / HTML -> network-first
  if (req.mode === "navigate" || (sameOrigin && url.pathname.endsWith(".html"))) {
    e.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(VERSION).then((c) => c.put(req, copy));
          return res;
        })
        .catch(() => caches.match(req).then((r) => r || caches.match("./index.html")))
    );
    return;
  }

  // 2) Mismo origen (íconos, manifest) -> stale-while-revalidate
  if (sameOrigin) {
    e.respondWith(
      caches.match(req).then((cached) => {
        const network = fetch(req)
          .then((res) => {
            const copy = res.clone();
            caches.open(VERSION).then((c) => c.put(req, copy));
            return res;
          })
          .catch(() => cached);
        return cached || network;
      })
    );
    return;
  }

  // 3) Cross-origin (Google Fonts) -> cache-first con relleno
  e.respondWith(
    caches.match(req).then((cached) =>
      cached ||
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(VERSION).then((c) => c.put(req, copy));
          return res;
        })
        .catch(() => cached)
    )
  );
});
