/* ============================================================
   ICONS ARCHIVE — Punto de entrada del servidor
   npm run dev  → con nodemon (se reinicia al guardar)
   npm start    → modo normal
   ============================================================ */
const app = require('./app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Icons Archive escuchando en http://localhost:${PORT}`);
  console.log(`API de héroes:            http://localhost:${PORT}/api/heroes`);
});
