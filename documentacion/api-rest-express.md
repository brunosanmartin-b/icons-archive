# API REST con Express — Icons Archive

**Proyecto:** Selección interactiva de héroes (Icons Archive)  
**Materia/Ámbito:** Programación Web Dinámica  
**Fecha:** Octubre 2026  
**Estado:** Implementada (primera etapa, solo lectura)  

---

## 1. Objetivo

Hasta esta etapa, Icons Archive funcionaba íntegramente del lado del cliente: los datos de cada héroe (nombre, editorial, color `--tone`, logo y página) estaban definidos dentro de `script.js`.

Se incorporó una **API REST desarrollada con Node.js y Express** que almacena y sirve esa información. De esta manera:

* Se separan las responsabilidades entre **frontend** (presentación e interacción) y **backend** (datos y lógica).
* Se pueden agregar o modificar héroes editando `server/data/heroes.json`, sin tocar el código del frontend.
* Quedan sentadas las bases para funcionalidades futuras (base de datos, votos, usuarios).

---

## 2. Tecnologías

| Tecnología | Uso |
|---|---|
| **Node.js** (v18 o superior) | Entorno de ejecución de JavaScript del lado del servidor. También aporta `fetch` y el test runner `node:test`. |
| **Express 5** | Framework para definir rutas y manejar peticiones HTTP. |
| **cors** | Middleware que permite usar la API aunque el frontend se abra desde otro origen. |
| **nodemon** (desarrollo) | Reinicia el servidor automáticamente al guardar cambios. |
| **JSON** | Formato de almacenamiento de los datos (sin base de datos en esta etapa). |

---

## 3. Estructura de Carpetas

```
proyecto 1/
├── documentacion/
├── img/
├── index.html, styles.css, script.js        ← selector (consume la API)
├── spider-man.html / .css / .js             ← expediente de Spider-Man
├── green-lantern.html / .css / .js          ← expediente de Green Lantern
└── server/                                  ← backend
    ├── package.json
    ├── .gitignore                           ← excluye node_modules/
    ├── server.js                            ← punto de entrada (pone a escuchar la app)
    ├── app.js                               ← arma la app: middlewares, API y frontend
    ├── data/
    │   └── heroes.json                      ← datos de los 8 héroes
    ├── routes/
    │   └── heroes.routes.js                 ← definición de rutas
    ├── controllers/
    │   └── heroes.controller.js             ← lógica de cada ruta
    └── tests/
        └── api.test.js                      ← pruebas automáticas
```

**Decisiones respecto de la propuesta original:**
* **El frontend no se movió a `public/`.** Sigue en la raíz del proyecto, así se puede seguir abriendo con doble clic. Express sirve esa carpeta directamente.
* **La app se separó en `app.js` y `server.js`.** `app.js` arma la aplicación sin ponerla a escuchar, lo que permite que los tests la levanten en un puerto libre. `server.js` solo la inicia.
* **Lo que no se publica:** las carpetas `server/` y `documentacion/` responden `404` si se las pide desde el navegador, y la carpeta `.git` se ignora (`dotfiles: 'ignore'`).

---

## 4. Instalación y Puesta en Marcha

Desde la carpeta `server/`:

```bash
npm install      # instala express, cors y nodemon (solo la primera vez)
npm run dev      # inicia el servidor con nodemon
```

**Notas:**
* En las versiones nuevas de Node, `node --test tests/` ya no funciona porque trata `tests/` como un archivo. Por eso el script usa `node --test`, que encuentra solo los archivos de prueba.
* `npm install` puede avisar de vulnerabilidades en dependencias. Se revisan con `npm audit`. **No conviene usar `npm audit fix --force`**, porque puede bajar nodemon a una versión vieja (1.x); si pasa, se corrige con `npm install -D nodemon@^3.1.10`.
* Para detener el servidor se usa `Ctrl + C` en la terminal donde se inició.

| Script | Comando | Uso |
|---|---|---|
| `npm start` | `node server.js` | Inicia el servidor en modo normal. |
| `npm run dev` | `nodemon server.js` | Inicia el servidor y lo reinicia al guardar cambios (incluido `heroes.json`). |
| `npm test` | `node --test` | Ejecuta las pruebas de la API (busca los archivos `*.test.js`). |

Con el servidor en marcha:
* **Sitio completo:** `http://localhost:3000`
* **API:** `http://localhost:3000/api/heroes`

El puerto se puede cambiar con la variable de entorno `PORT`.

---

## 5. Modelo de Datos

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | string | Identificador único en minúsculas y con guiones (ej. `spider-man`). |
| `nombre` | string | Nombre visible del héroe. |
| `editorial` | string | `"marvel"` o `"dc"`. |
| `lema` | string | Frase que se muestra debajo del nombre (ej. `"THE DARK KNIGHT"`). |
| `tone` | string | Color hexadecimal que se inyecta en la variable CSS `--tone`. |
| `logo` | string | Ruta relativa al logo dentro de `img/`. |
| `alt` | string | Texto alternativo del logo. |
| `pagina` | string \| null | Página del expediente, o `null` si todavía no existe. |

Los campos `lema`, `alt` y `pagina` se agregaron respecto de la propuesta porque el selector los necesita. Las rutas de los logos y los colores son los reales del proyecto.

### Ejemplo (`GET /api/heroes/batman`)

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

---

## 6. Endpoints

En esta primera etapa la API es **de solo lectura**.

| Método | Ruta | Descripción | Respuesta exitosa |
|---|---|---|---|
| `GET` | `/api/heroes` | Devuelve la lista completa de héroes. | `200` + array de héroes |
| `GET` | `/api/heroes?editorial=marvel` | Filtra por editorial (`marvel` o `dc`, sin distinguir mayúsculas). | `200` + array filtrado |
| `GET` | `/api/heroes/:id` | Devuelve un héroe según su `id` (sin distinguir mayúsculas). | `200` + objeto héroe |

### Respuestas de error

| Código | Caso | Cuerpo |
|---|---|---|
| `400` | La editorial no es `marvel` ni `dc`, llega vacía o repetida. | `{ "error": "Editorial inválida" }` |
| `404` | No existe un héroe con ese `id`. | `{ "error": "Héroe no encontrado" }` |
| `404` | La ruta de la API no existe. | `{ "error": "Ruta no encontrada" }` |
| `500` | Error interno del servidor. | `{ "error": "Error interno del servidor" }` |

---

## 7. Funcionamiento del Código

* **`app.js`:** registra `cors()` y `express.json()`, monta las rutas en `/api/heroes`, responde `404` en JSON para cualquier otra ruta de `/api`, bloquea `/server` y `/documentacion`, sirve el frontend con `express.static` y define el manejador centralizado de errores (`500`).
* **`routes/heroes.routes.js`:** asocia `GET /` con `listarHeroes` y `GET /:id` con `obtenerHeroe`.
* **`controllers/heroes.controller.js`:** contiene la lógica. `listarHeroes` valida la editorial (texto, sin espacios, en minúsculas) y filtra. `obtenerHeroe` busca por `id`.
* **`server.js`:** importa la app y la pone a escuchar en `PORT` (3000 por defecto).

---

## 8. Integración con el Frontend (`script.js`)

El selector pide los héroes a la API al cargar la página:

1. `cargarHeroes()` hace `fetch('/api/heroes')`.
2. `desdeApi()` convierte cada héroe al formato que usa el selector (por ejemplo, `nombre` → `name` en mayúsculas, `pagina` → `page`).
3. Con los datos listos se arman las fichas del roster (`armarRoster()`) y se muestra el primer héroe (`render()`).

**Datos de respaldo:** `script.js` conserva la lista de héroes como `heroesLocales`. Se usa en estos casos:
* La página se abre con doble clic (`file://`), donde no hay servidor.
* La página se abre con otro servidor sin la API (por ejemplo, Live Server).
* La API responde con error o con una lista vacía. En ese caso queda un aviso en la consola.

Así el selector funciona siempre, con o sin backend. El contador (`01 / 08`) se calcula según la cantidad de héroes recibidos.

---

## 9. Pruebas

### 9.1. Pruebas automáticas (`npm test`)
`tests/api.test.js` levanta la app en un puerto libre y verifica:

| Petición | Resultado esperado |
|---|---|
| `GET /api/heroes` | `200`, 8 héroes |
| `GET /api/heroes?editorial=marvel` | `200`, 4 héroes de Marvel |
| `GET /api/heroes?editorial=DC` | `200`, 4 héroes (no distingue mayúsculas) |
| `GET /api/heroes?editorial=image` | `400`, editorial inválida |
| `GET /api/heroes/superman` | `200`, objeto de Superman |
| `GET /api/heroes/thor` | `404`, héroe no encontrado |
| `GET /api/villanos` | `404`, ruta no encontrada |
| `GET /` | `200`, sirve `index.html` |
| `GET /server/package.json` | `404`, el backend no se publica |

### 9.2. Pruebas manuales
* **Navegador:** abrir `http://localhost:3000/api/heroes`.
* **Thunder Client / Postman:** enviar las peticiones de la tabla y revisar los códigos.
* **Terminal:**

```bash
curl http://localhost:3000/api/heroes
curl http://localhost:3000/api/heroes/hulk
curl "http://localhost:3000/api/heroes?editorial=dc"
curl http://localhost:3000/api/heroes/no-existe   # responde 404
```

---

## 10. Próximas Etapas Posibles

Sobre esta API básica, el proyecto podría ampliarse con:

1. **Base de datos** (SQLite como primera opción por su simplicidad) en reemplazo de `heroes.json`.
2. **Sistema de votos:** `POST /api/heroes/:id/votar` y un ranking del héroe más elegido.
3. **CRUD completo:** rutas `POST`, `PUT` y `DELETE` para administrar héroes, con subida de logos mediante `multer`.
4. **Validación de datos** con `express-validator` o `zod`.
5. **Variables de entorno** con un archivo `.env` para el puerto y futuras credenciales.
6. **Autenticación** (bcrypt + JWT) para proteger las rutas de administración.
