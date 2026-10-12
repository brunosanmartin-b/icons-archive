# Bootstrap en Icons Archive

**Versión:** Bootstrap 5.3.3, desde el CDN jsDelivr.
**Archivo:** `bootstrap-layer.css` (raíz del proyecto).

---

## 1. Objetivo

Sumar Bootstrap al frontend **sin cambiar el diseño** de ninguna página. Las tres páginas (`index.html`, `spider-man.html` y `green-lantern.html`) tienen un diseño propio muy detallado, y Bootstrap trae su propio reset (Reboot) que cambia el interlineado, los títulos, los botones, las imágenes, el `kbd` y el scroll suave.

Antes de integrarlo se midió el efecto: cargado de la forma normal, Bootstrap cambiaba **más de 100 propiedades** en el selector.

---

## 2. Cómo se integró: capas CSS (`@layer`)

En CSS, los estilos que están dentro de una capa (`@layer`) siempre pierden contra los que no están en ninguna capa, sin importar la especificidad. Por eso Bootstrap se importa dentro de una capa, y los CSS de las páginas (que no usan capas) siempre ganan.

```css
@layer bootstrap, bootstrap-compat;

@import url("https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css") layer(bootstrap);

@layer bootstrap-compat {
  /* deshace las reglas de Reboot que las páginas no redefinen */
}
```

**`bootstrap-compat`** es una segunda capa, posterior a la de Bootstrap, que devuelve al valor por defecto del navegador (`revert`) las pocas reglas de Reboot que los CSS de las páginas no redefinían:

| Elemento | Propiedades que se revierten |
|---|---|
| `:root` | `scroll-behavior` (Bootstrap activa el scroll suave) |
| `body` | `line-height`, `text-size-adjust`, `-webkit-tap-highlight-color` |
| `h1` … `h6` | `font-size`, `font-weight`, `line-height`, `color` |
| `button`, `input`, `select`, `optgroup`, `textarea` | `font-family`, `font-size`, `line-height`, `border-radius`, `text-transform` |
| `button`, `[type="button"]`, `[type="reset"]`, `[type="submit"]` | `appearance` |
| `button:focus:not(:focus-visible)` | `outline` |
| `img`, `svg` | `vertical-align` |
| `kbd` | `background-color` |

---

## 3. Dónde se carga

En el `<head>` de cada página, **antes** del CSS propio:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cinzel...&display=swap">
<link rel="stylesheet" href="bootstrap-layer.css">
<link rel="stylesheet" href="styles.css">
```

Los expedientes también cargan el JS de Bootstrap al final del `<body>`, con `defer` y verificación de integridad (SRI):

```html
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
  integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous" defer></script>
```

El selector (`index.html`) no usa componentes con JS, así que solo carga el CSS.

---

## 4. Qué se usa hoy

* **ScrollSpy** en `spider-man.html` y `green-lantern.html`: marca con `.active` el enlace del menú de secciones (`.section-nav`) que corresponde a la sección visible. Los scripts de cada página le suman `aria-current="location"` para los lectores de pantalla. No hay cambio visual, porque el CSS no le da estilo a `.active`.
  * El atributo `data-bs-spy="scroll"` va en `<main>` y no en `<body>`: como `body` tiene `overflow-x: hidden`, Bootstrap lo tomaba como contenedor de scroll y nunca marcaba ninguna sección.
* **Clases, grid y utilidades:** quedan disponibles para las próximas páginas (Batman, Superman, etc.).

---

## 5. Verificación

Se comparó en el navegador cada propiedad CSS calculada de cada elemento (incluidos `::before`, `::after` y `::marker`), con y sin `bootstrap-layer.css`:

| Página | Escritorio (1009 px) | Celular (375 px) |
|---|---|---|
| `index.html` | 0 diferencias | 0 diferencias |
| `spider-man.html` | 0 diferencias | 0 diferencias |
| `green-lantern.html` | 0 diferencias | 0 diferencias |

---

## 6. Cosas a tener en cuenta

* **Las utilidades de Bootstrap usan `!important`.** Dentro de una capa, un `!important` le gana a los estilos sin capa. Si se agrega una clase como `d-none` o `mt-3` a un elemento, va a pisar el diseño propio a propósito.
* **Componentes nuevos:** como el `body` mantiene el interlineado del navegador (y no el `1.5` de Bootstrap), un componente de Bootstrap que dependa de ese valor puede verse un poco más compacto que en la documentación oficial.
* **Sin conexión o si el CDN falla:** el diseño queda igual (no depende de Bootstrap); solo se pierde el marcado del menú. Mientras el CDN no responde, la primera carga de la página puede demorarse.
* **Navegadores viejos:** los que no soportan `@import ... layer()` (anteriores a 2022) ignoran el import completo, así que se ven sin Bootstrap pero con el diseño intacto.
* **Actualizar Bootstrap:** hay que cambiar la versión en `bootstrap-layer.css` y en el `<script>` de los expedientes, recalcular el hash SRI y volver a comprobar que no haya diferencias.
