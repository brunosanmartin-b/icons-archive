/* ============================================================
   ICONS ARCHIVE — Aplicación Express
   Arma la app (middlewares, API y archivos del frontend) sin
   ponerla a escuchar. Así los tests pueden usarla directamente;
   server.js es el que la inicia.
   ============================================================ */
const express = require('express');
const cors = require('cors');
const path = require('path');
const heroesRoutes = require('./routes/heroes.routes');

const app = express();
app.disable('x-powered-by'); // no anunciar que el servidor usa Express

// Carpeta del proyecto: el frontend (index.html, css, js, img) está un nivel arriba de server/
const CARPETA_FRONTEND = path.join(__dirname, '..');

// ── Middlewares ──
app.use(cors());          // permite usar la API aunque el frontend se abra desde otro origen
app.use(express.json());  // lee cuerpos JSON (para las próximas rutas POST / PUT)

// ── API ──
app.use('/api/heroes', heroesRoutes);

// Cualquier otra ruta que empiece con /api no existe
app.use('/api', (req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// ── Frontend ──
// Solo se publica lo que es del sitio: la carpeta img/ y los .html, .css y .js
// de la raíz. Todo lo demás (server/, documentacion/, README...) da 404.
// Es una lista blanca a propósito: bloquear '/server' no alcanzaba, porque
// '/%73erver/package.json' (la "s" codificada) o '/./server/...' se lo saltaban.
const EXTENSIONES_PUBLICAS = ['.html', '.css', '.js'];

function esArchivoPublico(rutaPedida) {
  let ruta;
  try {
    ruta = decodeURIComponent(rutaPedida);
  } catch {
    return false; // codificación inválida (ej. '/%E0')
  }
  // Se normaliza igual que lo hará express.static: '\' como '/', y sin '.' ni '..'
  const partes = path.posix.normalize(ruta.replace(/\\/g, '/')).split('/').filter(Boolean);
  if (partes.length === 0) return true; // "/" → index.html
  if (partes[0].toLowerCase() === 'img') return true;
  return partes.length === 1 && EXTENSIONES_PUBLICAS.includes(path.extname(partes[0]).toLowerCase());
}

app.use((req, res, next) => {
  if (esArchivoPublico(req.path)) return next();
  res.status(404).send('No encontrado');
});

// dotfiles: 'ignore' evita servir archivos ocultos (.gitignore, .git)
app.use(express.static(CARPETA_FRONTEND, { dotfiles: 'ignore' }));

// ── Manejo centralizado de errores ──
// Express lo usa cuando una ruta lanza un error (por eso lleva 4 parámetros).
// Los errores del cliente (ej. un JSON mal formado, status 400) conservan su
// código; el resto es un 500.
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const estado = err.status >= 400 && err.status < 500 ? err.status : 500;
  if (estado === 500) console.error(err);
  res.status(estado).json({ error: estado === 500 ? 'Error interno del servidor' : 'Solicitud inválida' });
});

module.exports = app;
