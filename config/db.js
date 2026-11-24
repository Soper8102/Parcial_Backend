const { Pool } = require('pg');

// Configuración de la conexión con variables de entorno
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'postgres',
  port: parseInt(process.env.DB_PORT, 10) || 5432,
  connectionTimeoutMillis: 2000 // Timeout rápido si no está levantado postgres
});

// Manejo de errores del pool para evitar caídas del proceso si no hay conexión activa
pool.on('error', (err) => {
  console.warn('Evento de error en pool PostgreSQL:', err.message);
});

// Función para inicializar la tabla y sembrar los datos si está vacía
const initDB = async () => {
  let client;
  try {
    client = await pool.connect();
    console.log('Conectado exitosamente a PostgreSQL');

    // 1. Crear la tabla materias si no existe
    await client.query(`
      CREATE TABLE IF NOT EXISTS materias (
        id_materia SERIAL PRIMARY KEY,
        nombre_materia VARCHAR(255) NOT NULL,
        carrera VARCHAR(255) NOT NULL
      );
    `);
    console.log('Tabla "materias" verificada/creada');

    // 2. Verificar si ya existen registros
    const countRes = await client.query('SELECT COUNT(*) FROM materias;');
    const totalMaterias = parseInt(countRes.rows[0].count, 10);

    if (totalMaterias === 0) {
      console.log('Sembrando materias iniciales en la base de datos...');
      const materiasIniciales = [
        'Desarrollo de Plataformas',
        'Ingenieria sin Fronteras',
        'Arquitectura de Datos',
        'Sistemas Distribuidos',
        'Pratica Responsabilidad Social',
        'Ecuaciones Diferenciales'
      ];
      const carrera = 'Ingenieria de Sistemas';

      for (const nombre of materiasIniciales) {
        await client.query(
          'INSERT INTO materias (nombre_materia, carrera) VALUES ($1, $2);',
          [nombre, carrera]
        );
      }
      console.log('Datos iniciales insertados correctamente en PostgreSQL');
    }
  } catch (error) {
    console.warn('Aviso: PostgreSQL no está respondiendo en el puerto configurado o las credenciales no coinciden.');
    console.warn(`Detalle del error: ${error.message}`);
    console.warn('El backend continuará activo y servirá los datos de las materias de forma transparente.');
  } finally {
    if (client) {
      client.release();
    }
  }
};

module.exports = {
  pool,
  initDB
};
