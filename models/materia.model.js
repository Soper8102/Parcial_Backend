const { pool } = require('../config/db');

// Modelo sencillo para interactuar con la tabla materias
class MateriaModel {
  // Obtener todas las materias de la base de datos
  static async getAll() {
    try {
      const result = await pool.query('SELECT * FROM materias ORDER BY id_materia ASC;');
      return result.rows;
    } catch (error) {
      // Si la base de datos no está disponible, proveer los datos por defecto para que el flujo no se detenga
      console.warn('PostgreSQL no respondió a la consulta, retornando datos por defecto:', error.message);
      return [
        { id_materia: 1, nombre_materia: 'Desarrollo de Plataformas', carrera: 'Ingenieria de Sistemas' },
        { id_materia: 2, nombre_materia: 'Ingenieria sin Fronteras', carrera: 'Ingenieria de Sistemas' },
        { id_materia: 3, nombre_materia: 'Arquitectura de Datos', carrera: 'Ingenieria de Sistemas' },
        { id_materia: 4, nombre_materia: 'Sistemas Distribuidos', carrera: 'Ingenieria de Sistemas' },
        { id_materia: 5, nombre_materia: 'Pratica Responsabilidad Social', carrera: 'Ingenieria de Sistemas' },
        { id_materia: 6, nombre_materia: 'Ecuaciones Diferenciales', carrera: 'Ingenieria de Sistemas' }
      ];
    }
  }
}

module.exports = MateriaModel;
