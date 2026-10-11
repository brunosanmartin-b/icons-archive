/* ============================================================
   Controlador de héroes: la lógica de cada ruta de /api/heroes.
   Los datos se leen de data/heroes.json (todavía sin base de datos).
   ============================================================ */
const heroes = require('../data/heroes.json');

const EDITORIALES_VALIDAS = ['marvel', 'dc'];

// GET /api/heroes            → lista completa
// GET /api/heroes?editorial= → lista filtrada por editorial (marvel o dc)
function listarHeroes(req, res) {
  const { editorial } = req.query;

  if (editorial === undefined) {
    return res.json(heroes);
  }

  // Si la editorial llega repetida (?editorial=dc&editorial=marvel) o vacía, es inválida
  if (typeof editorial !== 'string') {
    return res.status(400).json({ error: 'Editorial inválida' });
  }

  const editorialNormalizada = editorial.trim().toLowerCase();

  if (!EDITORIALES_VALIDAS.includes(editorialNormalizada)) {
    return res.status(400).json({ error: 'Editorial inválida' });
  }

  const filtrados = heroes.filter((heroe) => heroe.editorial === editorialNormalizada);
  return res.json(filtrados);
}

// GET /api/heroes/:id → un héroe según su id (ej. "batman")
function obtenerHeroe(req, res) {
  const id = req.params.id.toLowerCase();
  const heroe = heroes.find((h) => h.id === id);

  if (!heroe) {
    return res.status(404).json({ error: 'Héroe no encontrado' });
  }

  return res.json(heroe);
}

module.exports = { listarHeroes, obtenerHeroe, EDITORIALES_VALIDAS };
