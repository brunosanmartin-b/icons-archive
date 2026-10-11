# ICONS ARCHIVE

Archivo digital de superhéroes: un **selector** donde elegís el logo de un personaje y te lleva a su **expediente**, una especie de biografía ilustrada y animada.

Proyecto escolar de **Programación Web Dinámica** · EPET N.º 20 (Neuquén).

---

## Qué incluye

| Componente | Descripción | Estado |
|---|---|---|
| **Selector** (`index.html`) | 8 héroes, color propio por personaje, navegación con flechas, teclado y deslizamiento en celular. | Listo |
| **Expediente de Spider-Man** | Logo animado, nombre en 3D, galería, efecto de lente con los actores y tarjetas de los portadores del emblema. | Listo |
| **Expediente de Green Lantern** | Juramento con luz y humo, línea de tiempo horizontal de Hal Jordan y Linternas de la Tierra. | Listo |
| **Backend** (`server/`) | API REST con Node.js y Express que sirve los héroes y el sitio. | Listo (solo lectura) |
| **Otros 6 expedientes** | Batman, Superman, Hulk, Iron Man, Wonder Woman y Captain America. | Pendiente (el botón muestra "En preparación") |

## Tecnologías

- **Frontend:** HTML, CSS y JavaScript, sin librerías. Tipografías de Google Fonts (Cinzel, Barlow Condensed, DM Sans).
- **Backend:** Node.js 18 o superior, Express 5 y cors. Nodemon para desarrollo.
- **Datos:** archivo JSON (`server/data/heroes.json`).
- **Pruebas:** `node:test` y `fetch`, incluidos en Node.

## Cómo ejecutarlo

### Opción 1: con el backend (recomendada)

Hace falta tener [Node.js](https://nodejs.org) 18 o superior.

```bash
cd server
npm install
npm run dev
```

Después abrí:

- Sitio: <http://localhost:3000>
- API: <http://localhost:3000/api/heroes>

Para detener el servidor, `Ctrl + C`. El puerto se puede cambiar con la variable de entorno `PORT`.

### Opción 2: sin backend

Abrí `index.html` con doble clic (o con Live Server). El selector usa una copia local de los datos y funciona igual.

### Scripts (dentro de `server/`)

| Comando | Qué hace |
|---|---|
| `npm start` | Inicia el servidor. |
| `npm run dev` | Inicia el servidor y lo reinicia al guardar cambios. |
| `npm test` | Corre las pruebas de la API. |

> **Aviso:** si `npm install` muestra vulnerabilidades, revisalas con `npm audit`. Evitá `npm audit fix --force`: puede bajar nodemon a una versión vieja.

## API

Solo lectura en esta etapa.

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/api/heroes` | Lista completa. |
| `GET` | `/api/heroes?editorial=marvel` | Filtra por editorial (`marvel` o `dc`). |
| `GET` | `/api/heroes/:id` | Un héroe por su `id` (ej. `batman`). |

Errores: `400` (editorial inválida), `404` (héroe o ruta inexistente) y `500` (error interno), siempre con cuerpo `{ "error": "..." }`.

Ejemplo:

```bash
curl http://localhost:3000/api/heroes/batman
```

```json
{
  "id": "batman",
  "nombre": "Batman",
  "editorial": "dc",
  "lema": "THE DARK KNIGHT",
  "tone": "#c3cedb",
  "logo": "img/Batman-movie-Logo-2005.webp",
  "alt": "Símbolo de Batman",
  "pagina": null
}
```

## Estructura del proyecto

```
.
├── index.html, styles.css, script.js      # selector
├── spider-man.html / .css / .js           # expediente de Spider-Man
├── green-lantern.html / .css / .js        # expediente de Green Lantern
├── img/                                   # logos e imágenes
├── documentacion/                         # documentos del proyecto
└── server/                                # backend
    ├── app.js                             # arma la app (middlewares, API, frontend)
    ├── server.js                          # punto de entrada
    ├── data/heroes.json                   # datos de los héroes
    ├── routes/heroes.routes.js            # rutas
    ├── controllers/heroes.controller.js   # lógica de cada ruta
    └── tests/api.test.js                  # pruebas automáticas
```

## Cómo agregar un héroe

1. Sumá su logo en `img/`.
2. Agregá un objeto en `server/data/heroes.json` con los campos `id`, `nombre`, `editorial`, `lema`, `tone`, `logo`, `alt` y `pagina` (`null` si todavía no tiene página).
3. Agregá el mismo héroe a `heroesLocales` en `script.js`, para que el respaldo siga igual que la API.
4. Reiniciá el servidor.

## Accesibilidad y rendimiento

- Textos alternativos en las imágenes y navegación por teclado.
- Respeto de `prefers-reduced-motion`: las animaciones se reducen si el sistema lo pide.
- Diseño adaptado a computadora, tablet y celular.

## Próximas etapas posibles

- Expedientes de los 6 héroes restantes.
- Base de datos (SQLite) en lugar del JSON.
- Votos por héroe y ranking.
- Panel de administración con validación y autenticación.

## Documentación

En la carpeta [`documentacion/`](documentacion/) hay una guía por cada expediente, la documentación de la API (`api-rest-express.md`) y dos PDF: la explicación del backend y la propuesta del proyecto.

## Créditos y aviso

Proyecto educativo, sin fines de lucro. Los personajes, nombres, logos e imágenes pertenecen a sus respectivos dueños (Marvel, DC y otros titulares de derechos) y se usan solo con fines escolares. Este sitio no es oficial ni está afiliado a ellos.

**Autores:** Bruno San Martin, Iasser Chahaud y Gael Rodriguez · EPET N.º 20, 6to 5ta Neuquén.
