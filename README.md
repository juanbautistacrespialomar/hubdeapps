# Hub de apps

Una página que junta todas mis apps en un solo lugar, con logo, descripción y link para abrir e instalar cada una. Es además una **PWA instalable** (se puede sumar al teléfono como una app más) y se **actualiza sola** cada vez que cambio el repo.

## Estructura del repo

```
.
├── index.html                  # La página (todo el HTML, CSS y JS + logos embebidos)
├── manifest.json               # Datos de la PWA (nombre, colores, íconos)
├── sw.js                       # Service worker (offline + auto-actualización)
├── favicon.ico                 # Ícono de la pestaña del navegador
├── .nojekyll                   # Le dice a GitHub Pages que sirva todo tal cual
├── README.md                   # Este archivo
└── icons/
    ├── icon-192.png            # Ícono PWA
    ├── icon-512.png            # Ícono PWA
    ├── icon-maskable-512.png   # Ícono adaptable (Android recorta a su forma)
    └── apple-touch-icon.png    # Ícono para iPhone/iPad
```

Con esos archivos alcanza. No falta nada más para que funcione y sea instalable.

## Cómo publicarlo (GitHub Pages)

1. Subí todos estos archivos a un repo (por ejemplo `hub`).
2. En el repo: **Settings → Pages**.
3. En *Source* elegí la rama `main` y carpeta `/ (root)`. Guardá.
4. En un rato tenés la URL: `https://juanbautistacrespialomar.github.io/hub/`.

Ese link es el que compartís. **Importante:** una PWA necesita HTTPS, y GitHub Pages ya lo da. Si abrís el `index.html` con doble clic (`file://`), la parte de instalar/offline no anda; hay que abrirlo desde la URL de Pages.

## Cómo se actualiza (esto es lo importante)

El service worker usa estrategia **network-first** para el HTML: cada vez que alguien abre el hub **estando online, baja la última versión** automáticamente. No hace falta que toques nada cuando cambiás una app o una descripción.

Sin conexión, sirve la última copia guardada (así igual abre offline).

> Si alguna vez querés forzar el borrado total del cache viejo en todos los dispositivos, subí el número de `VERSION` en `sw.js` (por ejemplo de `hub-v1` a `hub-v2`) y hacé push. Es opcional.

## Cómo agregar, sacar o reordenar apps

Todo está en la lista `APPS`, arriba del `<script>` en `index.html`:

```js
const APPS = [
  {
    "nombre": "Tu Contador",
    "descripcion": "…",
    "url": "https://juanbautistacrespialomar.github.io/appdegastos/",
    "tag": "Finanzas",        // categoría (arma los filtros de arriba)
    "instalable": true,        // muestra el cartel "instalable"
    "logo": "data:image/png;base64,…"   // logo embebido (o una URL a una imagen)
  },
  // …
];
```

- Para **reordenar**: cambiás el orden en la lista.
- Para **agregar una app**: copiás un bloque y completás los campos. El `logo` puede ser un data-URI o directamente la URL de la imagen (por ejemplo el ícono de esa app en su propio Pages).
- El orden de los filtros por categoría sale solo de los `tag` que uses.

## Los links de las apps

Los botones "Abrir" apuntan a cada app en su GitHub Pages:

| App | URL |
|---|---|
| Tu Contador | `juanbautistacrespialomar.github.io/appdegastos/` |
| Compartimos | `juanbautistacrespialomar.github.io/compartimos/` |
| Hábitos | `juanbautistacrespialomar.github.io/habitos/` |
| Anotador de Truco | `juanbautistacrespialomar.github.io/anotadortruco/` |
| Soy Bostero | `juanbautistacrespialomar.github.io/soybostero/` |
| Tu Profe | `juanbautistacrespialomar.github.io/tuprofe/` |

Para que cada botón funcione, esa app tiene que tener **GitHub Pages activo** en su repo. Si alguna no abre, revisá Settings → Pages de ese repo.

## Cómo instalarlo en el teléfono

La misma página, abajo de todo, tiene el paso a paso para Android (Chrome) y iPhone (Chrome o Safari). En resumen: abrís el link en el navegador y usás "Instalar app" / "Agregar a pantalla de inicio".
