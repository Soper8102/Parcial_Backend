const MateriaModel = require('../models/materia.model');

// Controlador para obtener la lista de materias
const getMaterias = async (req, res, next) => {
  try {
    const materias = await MateriaModel.getAll();
    res.json(materias);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMaterias
};
