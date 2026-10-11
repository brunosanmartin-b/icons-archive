/* Rutas de /api/heroes: cada ruta llama a su función del controlador. */
const { Router } = require('express');
const { listarHeroes, obtenerHeroe } = require('../controllers/heroes.controller');

const router = Router();

router.get('/', listarHeroes);
router.get('/:id', obtenerHeroe);

module.exports = router;
