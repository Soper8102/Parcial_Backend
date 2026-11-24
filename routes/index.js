const { Router } = require('express');
const materiaRoutes = require('./materia.routes');

const router = Router();

// Rutas del backend
router.use('/materias', materiaRoutes);

module.exports = router;
