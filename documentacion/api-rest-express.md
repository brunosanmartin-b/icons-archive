# Propuesta Técnica — API REST con Express para Hero Archive

**Proyecto:** Selección interactiva de héroes (Hero Archive)  
**Materia/Ámbito:** Programación Web Dinámica  
**Fecha:** Octubre 2026  
**Estado:** Propuesta (no implementada)  

---

## 1. Objetivo

Actualmente, Hero Archive funciona íntegramente del lado del cliente: los datos de cada héroe (nombre, editorial, color `--tone` y logo) se encuentran definidos dentro de `script.js`.

Se propone incorporar una **API REST básica desarrollada con Node.js y Express** que se encargue de almacenar y servir esa información. De esta manera:

* Se separan las responsabilidades entre **frontend** (presentación e interacción) y **backend** (datos y lógica).
* Se podrán agregar o modificar héroes sin editar el código del frontend.
* Se sentarán las bases para funcionalidades futuras (base de datos, votos, usuarios).

---

## 2. Tecnologías Propuestas

| Tecnología | Uso |
|---|---|
| **Node.js** (v18 o superior) | Entorno de ejecución de JavaScript del lado del servidor. |
| **Express** | Framework para definir rutas y manejar peticiones HTTP. |
| **cors** | Middleware para permitir peticiones desde el frontend si se sirve desde otro origen. |
| **nodemon** (desarrollo) | Reinicia el servidor automáticamente al guardar cambios. |
| **JSON** | Formato de almacenamiento inicial de los datos (sin base de datos en esta etapa). |

---

## 3. Estructura de Carpetas Propuesta

```
proyecto 1/
├── documentacion/
│   ├── contexto.md
│   └── api-rest-express.md
├── public/                  ← frontend actual
│   ├── index.html
│   ├── styles.css
│   ├── script.js
│   └── img/
│       ├── background.jpg
│       └── logos/
└── server/                  ← backend nuevo
    ├── package.json
    ├── server.js            ← punto de entrada
    ├── data/
    │   └── heroes.json      ← datos de los héroes
    ├── routes/
    │   └── heroes.routes.js ← definición de rutas
    └── controllers/
        └── heroes.controller.js ← lógica de cada ruta
```

> **Nota:** se propone mover los archivos actuales del frontend a `public/` para que Express pueda servirlos directamente. Si se prefiere no moverlos, el frontend puede seguir abriéndose por separado y consumir la API gracias a `cors`.

---

## 4. Instalación y Puesta en Marcha

Desde la carpeta `server/`:

```bash
npm init -y
npm install express cors
npm install --save-dev nodemon
```

En `package.json` se agregarían los siguientes scripts:

```json
"scripts": {
  "start": "node server.js",
  "dev": "nodemon server.js"
}
```

Para iniciar el servidor en modo desarrollo:

```bash
npm run dev
```

El servidor quedaría disponible en `http://localhost:3000` *(puerto hipotético, configurable)*.

---

## 5. Modelo de Datos

Cada héroe se representaría como un objeto con la siguiente forma:

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | string | Identificador único en minúsculas y con guiones (ej. `spider-man`). |
| `nombre` | string | Nombre visible del héroe. |
| `editorial` | string | `"marvel"` o `"dc"`. |
| `tone` | string | Color hexadecimal que se inyecta en la variable CSS `--tone`. |
| `logo` | string | Ruta relativa a la imagen del logo. |

### Ejemplo de `data/heroes.json`

Los colores corresponden a los definidos en el rediseño. Las rutas de los logos son **valores hipotéticos** y deben ajustarse a los nombres reales de los archivos.

```json
[
  { "id": "spider-man",      "nombre": "Spider-Man",      "editorial": "marvel", "tone": "#e8474c", "logo": "img/logos/spider-man.png" },
  { "id": "green-lantern",   "nombre": "Green Lantern",   "editorial": "dc",     "tone": "#48c982", "logo": "img/logos/green-lantern.png" },
  { "id": "batman",          "nombre": "Batman",          "editorial": "dc",     "tone": "#b9c4d1", "logo": "img/logos/batman.png" },
  { "id": "superman",        "nombre": "Superman",        "editorial": "dc",     "tone": "#df424b", "logo": "img/logos/superman.png" },
  { "id": "hulk",            "nombre": "Hulk",            "editorial": "marvel", "tone": "#78c951", "logo": "img/logos/hulk.png" },
  { "id": "iron-man",        "nombre": "Iron Man",        "editorial": "marvel", "tone": "#eaa24d", "logo": "img/logos/iron-man.png" },
  { "id": "wonder-woman",    "nombre": "Wonder Woman",    "editorial": "dc",     "tone": "#e5b86c", "logo": "img/logos/wonder-woman.png" },
  { "id": "captain-america", "nombre": "Captain America", "editorial": "marvel", "tone": "#5d9dd3", "logo": "img/logos/captain-america.png" }
]
```

---

## 6. Endpoints Propuestos

En esta primera etapa la API sería **de solo lectura**.

| Método | Ruta | Descripción | Respuesta exitosa |
|---|---|---|---|
| `GET` | `/api/heroes` | Devuelve la lista completa de héroes. | `200` + array de héroes |
| `GET` | `/api/heroes?editorial=marvel` | Filtra la lista por editorial (`marvel` o `dc`). | `200` + array filtrado |
| `GET` | `/api/heroes/:id` | Devuelve un héroe según su `id`. | `200` + objeto héroe |

### Respuestas de error

| Código | Caso | Cuerpo |
|---|---|---|
| `400` | La editorial enviada no es `marvel` ni `dc`. | `{ "error": "Editorial inválida" }` |
| `404` | No existe un héroe con ese `id`. | `{ "error": "Héroe no encontrado" }` |
| `404` | La ruta solicitada no existe. | `{ "error": "Ruta no encontrada" }` |
| `500` | Error interno del servidor. | `{ "error": "Error interno del servidor" }` |

### Ejemplo de petición y respuesta

```
GET /api/heroes/batman
```

```json
{
  "id": "batman",
  "nombre": "Batman",
  "editorial": "dc",
  "tone": "#b9c4d1",
  "logo": "img/logos/batman.png"
}
```

---

## 7. Código Base Propuesto

### 7.1. `server.js` — Punto de entrada

```js
const express = require('express');
const cors = require('cors');
const path = require('path');
const heroesRoutes = require('./routes/heroes.routes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Servir el frontend estático
app.use(express.static(path.join(__dirname, '..', 'public')));

// Rutas de la API
app.use('/api/heroes', heroesRoutes);

// Ruta no encontrada
app.use('/api', (req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Manejo centralizado de errores
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
```

### 7.2. `routes/heroes.routes.js` — Definición de rutas

```js
const { Router } = require('express');
const { listarHeroes, obtenerHeroe } = require('../controllers/heroes.controller');

const router = Router();

router.get('/', listarHeroes);
router.get('/:id', obtenerHeroe);

module.exports = router;
```

### 7.3. `controllers/heroes.controller.js` — Lógica

```js
const heroes = require('../data/heroes.json');

const EDITORIALES_VALIDAS = ['marvel', 'dc'];

function listarHeroes(req, res) {
  const { editorial } = req.query;

  if (!editorial) {
    return res.json(heroes);
  }

  const editorialNormalizada = editorial.toLowerCase();

  if (!EDITORIALES_VALIDAS.includes(editorialNormalizada)) {
    return res.status(400).json({ error: 'Editorial inválida' });
  }

  const filtrados = heroes.filter(h => h.editorial === editorialNormalizada);
  res.json(filtrados);
}

function obtenerHeroe(req, res) {
  const heroe = heroes.find(h => h.id === req.params.id);

  if (!heroe) {
    return res.status(404).json({ error: 'Héroe no encontrado' });
  }

  res.json(heroe);
}

module.exports = { listarHeroes, obtenerHeroe };
```

---

## 8. Integración con el Frontend

En `script.js`, el array de héroes definido de forma fija se reemplazaría por una petición a la API. El resto de la lógica (navegación con flechas, animación `arrive`, inyección de `--tone`) se mantendría igual, ya que recibiría los mismos datos.

```js
async function cargarHeroes() {
  try {
    const respuesta = await fetch('/api/heroes');

    if (!respuesta.ok) {
      throw new Error(`Error HTTP ${respuesta.status}`);
    }

    const heroes = await respuesta.json();
    iniciarGaleria(heroes); // función existente que arma la selección (nombre hipotético)
  } catch (error) {
    console.error('No se pudieron cargar los héroes:', error);
    // Se propone mostrar un mensaje visible al usuario en #heroStage
  }
}

cargarHeroes();
```

> **Nota:** `iniciarGaleria` es un nombre hipotético. Debe reemplazarse por la función que actualmente inicializa la selección de héroes en `script.js`.

### Consideración de UX
Mientras se espera la respuesta del servidor, se recomienda mostrar un estado de carga discreto (por ejemplo, el halo `.emblem-halo` pulsando sin logo) para mantener la coherencia con la estética noir del proyecto.

---

## 9. Pruebas de la API

Con el servidor en marcha, los endpoints pueden verificarse de las siguientes formas:

* **Navegador:** abrir `http://localhost:3000/api/heroes` directamente.
* **Thunder Client / Postman:** extensiones o aplicaciones para enviar peticiones y revisar códigos de estado.
* **Terminal:**

```bash
curl http://localhost:3000/api/heroes
curl http://localhost:3000/api/heroes/hulk
curl "http://localhost:3000/api/heroes?editorial=dc"
curl http://localhost:3000/api/heroes/no-existe   # debería responder 404
```

### Casos de prueba sugeridos

| Petición | Resultado esperado |
|---|---|
| `GET /api/heroes` | `200`, 8 héroes |
| `GET /api/heroes?editorial=marvel` | `200`, 4 héroes |
| `GET /api/heroes?editorial=DC` | `200`, 4 héroes (no distingue mayúsculas) |
| `GET /api/heroes?editorial=image` | `400`, editorial inválida |
| `GET /api/heroes/superman` | `200`, objeto de Superman |
| `GET /api/heroes/thor` | `404`, héroe no encontrado |
| `GET /api/villanos` | `404`, ruta no encontrada |

---

## 10. Próximas Etapas Posibles

Una vez implementada esta API básica, el proyecto podría ampliarse con:

1. **Base de datos** (SQLite como primera opción por su simplicidad) en reemplazo de `heroes.json`.
2. **Sistema de votos:** `POST /api/heroes/:id/votar` y un ranking del héroe más elegido.
3. **CRUD completo:** rutas `POST`, `PUT` y `DELETE` para administrar héroes, con subida de logos mediante `multer`.
4. **Validación de datos** con `express-validator` o `zod`.
5. **Variables de entorno** con un archivo `.env` para el puerto y futuras credenciales.
6. **Autenticación** (bcrypt + JWT) para proteger las rutas de administración.
