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
// El backend y la documentación no se publican como archivos del sitio
app.use(['/server', '/documentacion'], (req, res) => {
  res.status(404).send('No encontrado');
});

// index.html, spider-man.html, green-lantern.html, estilos, scripts e imágenes.
// dotfiles: 'ignore' evita servir la carpeta .git
app.use(express.static(CARPETA_FRONTEND, { dotfiles: 'ignore' }));

// ── Manejo centralizado de errores ──
// Express lo usa cuando una ruta lanza un error (por eso lleva 4 parámetros)
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

module.exports = app;
