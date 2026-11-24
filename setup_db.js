const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const { Client } = require('pg');

async function createDatabaseAndTables() {
  const host = process.env.DB_HOST || 'localhost';
  const user = process.env.DB_USER || 'postgres';
  const password = process.env.DB_PASSWORD || 'uniminuto';
  const port = parseInt(process.env.DB_PORT, 10) || 5432;
  const targetDb = 'parcial_db';

  console.log('--- INICIANDO CONFIGURACIÓN DE BASE DE DATOS EN POSTGRESQL ---');

  // Paso 1: Conectar al servidor PostgreSQL usando la BD por defecto 'postgres'
  const adminClient = new Client({
    host,
    user,
    password,
    database: 'postgres',
    port
  });

  try {
    await adminClient.connect();
    console.log('1. Conectado exitosamente al servidor PostgreSQL');

    // Verificar si la base de datos ya existe
    const resCheck = await adminClient.query(
      "SELECT 1 FROM pg_database WHERE datname = $1;",
      [targetDb]
    );

    if (resCheck.rowCount === 0) {
      console.log(`2. Creando base de datos "${targetDb}"...`);
      await adminClient.query(`CREATE DATABASE ${targetDb};`);
      console.log(`   Base de datos "${targetDb}" creada correctamente.`);
    } else {
      console.log(`2. La base de datos "${targetDb}" ya existe.`);
    }
  } catch (error) {
    console.error('Error al verificar/crear la base de datos:', error.message);
    throw error;
  } finally {
    await adminClient.end();
  }

  // Paso 2: Conectar directamente a la base de datos 'parcial_db'
  const dbClient = new Client({
    host,
    user,
    password,
    database: targetDb,
    port
  });

  try {
    await dbClient.connect();
    console.log(`3. Conectado a la base de datos "${targetDb}"`);

    // Paso 3: Crear la tabla materias si no existe
    console.log('4. Creando tabla "materias"...');
    await dbClient.query(`
      CREATE TABLE IF NOT EXISTS materias (
        id_materia SERIAL PRIMARY KEY,
        nombre_materia VARCHAR(255) NOT NULL,
        carrera VARCHAR(255) NOT NULL
      );
    `);
    console.log('   Tabla "materias" creada y verificada exitosamente.');

    // Paso 4: Insertar las materias requeridas si no existen
    const countRes = await dbClient.query('SELECT COUNT(*) FROM materias;');
    const total = parseInt(countRes.rows[0].count, 10);

    const materiasRequeridas = [
      'Desarrollo de Plataformas',
      'Ingenieria sin Fronteras',
      'Arquitectura de Datos',
      'Sistemas Distribuidos',
      'Pratica Responsabilidad Social',
      'Ecuaciones Diferenciales'
    ];
    const carrera = 'Ingenieria de Sistemas';

    if (total === 0) {
      console.log('5. Insertando registros de materias...');
      for (const nombre of materiasRequeridas) {
        await dbClient.query(
          'INSERT INTO materias (nombre_materia, carrera) VALUES ($1, $2);',
          [nombre, carrera]
        );
      }
      console.log('   6 materias insertadas correctamente.');
    } else {
      console.log(`5. La tabla ya contiene ${total} registros.`);
    }

    // Paso 5: Consultar y listar los registros
    const selectRes = await dbClient.query('SELECT * FROM materias ORDER BY id_materia ASC;');
    console.log('\n======================================================');
    console.log(`TABLA "materias" EN BASE DE DATOS "${targetDb}":`);
    console.log('======================================================');
    console.table(selectRes.rows);
  } catch (error) {
    console.error('Error al configurar la tabla en parcial_db:', error.message);
    throw error;
  } finally {
    await dbClient.end();
  }
}

createDatabaseAndTables()
  .then(() => {
    console.log('\nConfiguración de PostgreSQL finalizada con éxito.');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Fallo en la configuración:', err.message);
    process.exit(1);
  });
