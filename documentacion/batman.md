# Documentación Técnica y de Diseño UX/UI — Expediente Batman

**Proyecto:** Icons Archive · Expediente 003 / DC
**Materia/Ámbito:** Programación Web Dinámica
**Fecha:** Octubre 2026
**Archivos:** `batman.html`, `batman.css`, `batman.js` · imágenes en `img/batman/`

---

## 1. Resumen

Expediente de Batman con la misma estructura que los de Spider-Man y Green Lantern (encabezado, hero, menú de secciones, secciones numeradas, nota del archivo y footer), pero con una identidad propia:

* **Predomina el negro** (`#030304`), con acentos plateados (`--silver`) y dorados (`--gold`, el color del cinturón y de la Batiseñal).
* **Batman se camufla con el fondo:** las ilustraciones tienen fondo negro y se funden con la página.
* **Murciélagos animados** que salen en bandada y cruzan la pantalla.

El selector (`index.html`) abre esta página: `pagina: "batman.html"` en `server/data/heroes.json` y `page: 'batman.html'` en `heroesLocales` de `script.js`.

---

## 2. Sistema de Diseño (`batman.css`)

| Token | Valor | Uso |
|---|---|---|
| `--bg` | `#030304` | Fondo de toda la página (casi negro puro). |
| `--bg-card` | `#0c0d11` | Tarjetas. |
| `--silver` | `#c3cedb` | Títulos destacados, bordes, el mismo tono que Batman tiene en el selector. |
| `--gold` | `#f2c94c` | Etiquetas, numeración, enlaces y la Batiseñal. |

Tipografías iguales al resto del sitio: Cinzel (títulos), Barlow Condensed (etiquetas) y DM Sans (texto).

---

## 3. Estructura de la Página

| Sección | Id | Contenido |
|---|---|---|
| Hero | `#inicio` | Logo, título plateado "BATMAN · EL CABALLERO OSCURO", Batman camuflado y murciélagos. |
| 01 / Identidad | `#perfil` | Tarjeta de Bruce Wayne y ficha técnica (nombre, base, ocupación, afiliaciones, debut). |
| 02 / El origen | `#origen` | Crime Alley y la promesa. Ilustración `batman comic.webp` fundida con el negro. |
| 03 / Arsenal | `#arsenal` | Detective, artes marciales, cinturón y tecnología, preparación. Bloque "Su regla" (no mata). |
| 04 / Alfred | `#alfred` | Alfred Pennyworth (`alfred.jpg`) con los bordes esfumados. |
| 05 / La Batifamilia | `#batifamilia` | Lista de 8 integrantes y la ilustración `bat-family.jpg`. |
| 06 / El legado de Robin | `#robins` | Banner `all robins.webp` y tarjetas de Dick Grayson, Jason Todd, Tim Drake y Damian Wayne. |
| Nota del archivo | — | Batiseñal con murciélagos alrededor, cita y enlace a DC. |

---

## 4. Efectos

### 4.1. Batman camuflado (hero)
* Del arte de Alex Ross (`background.jpg`) se muestra solo el círculo de luna con Batman, en un recuadro a la derecha del texto. La imagen tiene fondo negro: con `mix-blend-mode: lighten`, ese negro desaparece contra el fondo de la página.
* **Tamaño y calidad:** la imagen es de baja resolución, así que se dibuja más chica que su tamaño real (al 68% en escritorio, con `--w: min(420px, 36vw)`). Todas las medidas del recuadro y de la imagen dependen de `--w`, así que para agrandarla o achicarla alcanza con cambiar ese valor. En celulares el recuadro va centrado detrás del texto.
* Una máscara radial esfuma los bordes del recuadro.
* Hay dos capas de la misma imagen:
  * **`.hero-art-dark`:** muy oscura (`brightness(0.42)`), apenas se adivina la silueta.
  * **`.hero-art-light`:** iluminada, visible solo dentro de un círculo de luz (máscara en `--sx` / `--sy`).
* **Sin mouse** (o en celulares), el círculo recorre la imagen solo, como un reflector (`@keyframes searchlight`; `--sx` y `--sy` se registran con `@property` para poder animarlas).
* **Con mouse**, `batman.js` mueve la luz detrás del cursor y agrega `.is-tracking`, que detiene el recorrido automático.

### 4.2. Logo del hero
* `batman-logo.webp` es negro sobre blanco: se invierte (`invert(1)`) para que quede un óvalo plateado con el murciélago negro.
* El recuadro `.hero-logo` tiene la proporción del óvalo y `border-radius: 50%`, así que solo se ve el logo. La imagen (cuadrada) se agranda y se corre para llenarlo.
* **Entrada (`logo-emerge`):** aparece borroso y apagado, y se enfoca y se enciende.
* **Brillo (`logo-sheen`):** cada 5 segundos un reflejo metálico lo cruza.

### 4.3. Murciélagos
* Cada murciélago es un SVG con dos alas (`.wing-l`, `.wing-r`) que aletean con CSS (`flap-left` / `flap-right`) y un cuerpo con orejas.
* Son siluetas oscuras con un borde de luz de luna (`drop-shadow`) para que se distingan sobre el negro.
* `batman.js` los crea dentro de los contenedores `.bat-sky` y los hace volar con la Web Animations API (`element.animate`), con una trayectoria ondulada. Al terminar el vuelo se eliminan del DOM.
* **Bandada:** al aparecer el hero en pantalla salen 26 murciélagos desde Batman; en la nota final salen 14 desde la Batiseñal.
* **Vuelos sueltos:** mientras la sección está en pantalla, cada pocos segundos un murciélago cruza de un lado al otro. Un `IntersectionObserver` los pausa cuando la sección no se ve y no se lanzan con la pestaña oculta.

### 4.4. Imágenes que salen de las sombras
* `batman comic.webp` (origen) y `alfred.jpg` se funden con el fondo con máscaras de degradado.
* `batman comic.webp` mide 860 × 484: se muestra entera (`object-fit: contain`) con un ancho máximo de 760 px, así nunca se agranda ni pierde calidad.
* Las fotos de los Robins arrancan en blanco y negro y oscuras, y se encienden una tras otra al aparecer en pantalla (`.is-visible`).

### 4.5. Tarjetas de los Robins
* **Entrada (`robin-in`):** cada tarjeta cae girando desde atrás (`rotateX`), como una ficha que se da vuelta, una tras otra (retraso según `--i`).
* **Inclinación 3D:** con el mouse encima, `batman.js` calcula `--rx` / `--ry` y la tarjeta se inclina hacia el cursor.
* **Hover:** borde y resplandor dorados, un brillo diagonal cruza la foto, la viñeta oscura de abajo se abre, el número se enciende en dorado y el nombre cambia a dorado.

### 4.6. Batiseñal
* El logo `batman-logo.webp` se invierte (`invert(1)`: óvalo claro con murciélago negro), se recorta al óvalo con `clip-path` y toma el color de la luz con `mix-blend-mode: multiply` sobre un disco amarillo.
* Un haz de luz (`.signal-beam`) titila suavemente.

### 4.7. Entradas al hacer scroll
Igual que en Spider-Man: cada `[data-reveal]` sube y aparece al entrar en pantalla, escalonado con `--i` dentro de su grupo (`[data-reveal-group]`).

---

## 5. Accesibilidad y Rendimiento

* **Movimiento reducido:** con `prefers-reduced-motion` no se crean murciélagos, la luz del hero queda quieta, el logo aparece sin animación, no hay entradas animadas ni inclinación 3D, y las fotos de los Robins se ven a color desde el inicio.
* **Decorativos:** la imagen del hero, los murciélagos, la Batiseñal y el arte del origen tienen `aria-hidden` / `alt=""`.
* **Menú de secciones:** ScrollSpy de Bootstrap con `aria-current="location"`, como en los otros expedientes.
* **Rendimiento:** los murciélagos usan `transform` y `opacity` (animaciones en la GPU), se eliminan al terminar y solo vuelan con la sección en pantalla. Las imágenes de la Batifamilia y los Robins usan `loading="lazy"`.

---

## 6. Responsive

* **1080 px:** arsenal y Robins en 2 columnas; la Batifamilia pasa a una columna (lista arriba, imagen abajo).
* **900 px:** el hero se centra y Batman queda detrás del texto con opacidad reducida; perfil, origen y Alfred en una columna.
* **600 px:** todo en una columna, la ficha técnica apila etiqueta y valor, y la Batiseñal se achica.

---

## 7. Imágenes (`img/batman/`)

| Archivo | Uso |
|---|---|
| `background.jpg` | Hero (arte de Alex Ross, Batman camuflado). |
| `batman comic.webp` | Sección 02 / El origen. |
| `batman-logo.webp` | Batiseñal y marca de agua de la tarjeta de perfil. |
| `alfred.jpg` | Sección 04 / Alfred. |
| `bat-family.jpg` | Sección 05 / La Batifamilia. |
| `all robins.webp` | Banner de la sección 06. |
| `nightwing.jpg`, `red hood.jpg`, `tim drake.jpg`, `damian wayne.jpg` | Tarjetas de los Robins. |

---

## 8. Pendientes y Observaciones

* **Página en desarrollo:** el diseño se va a seguir ajustando.
* **Logo del selector:** el index sigue usando `img/Batman-movie-Logo-2005.webp`; se podría reemplazar por `img/batman/batman-logo.webp` si se prefiere el mismo símbolo en todo el sitio.
* **Fuentes y Bootstrap:** vienen de Google Fonts y del CDN jsDelivr. Sin conexión, la página usa fuentes de reemplazo y funciona sin Bootstrap.
