const { Router } = require('express');
const { getMaterias } = require('../controllers/materia.controller');

const router = Router();

// GET /api/materias
router.get('/', getMaterias);

module.exports = router;
