-- 1. Crear base de datos (ejecutar primero en PostgreSQL)
CREATE DATABASE parcial_db;

-- 2. Conectarse a la base de datos parcial_db
\c parcial_db;

-- 3. Crear tabla materias
CREATE TABLE IF NOT EXISTS materias (
  id_materia SERIAL PRIMARY KEY,
  nombre_materia VARCHAR(255) NOT NULL,
  carrera VARCHAR(255) NOT NULL
);

-- 4. Insertar asignaturas
INSERT INTO materias (nombre_materia, carrera) VALUES
  ('Desarrollo de Plataformas', 'Ingenieria de Sistemas'),
  ('Ingenieria sin Fronteras', 'Ingenieria de Sistemas'),
  ('Arquitectura de Datos', 'Ingenieria de Sistemas'),
  ('Sistemas Distribuidos', 'Ingenieria de Sistemas'),
  ('Pratica Responsabilidad Social', 'Ingenieria de Sistemas'),
  ('Ecuaciones Diferenciales', 'Ingenieria de Sistemas')
ON CONFLICT DO NOTHING;

-- 5. Consultar los registros
SELECT * FROM materias ORDER BY id_materia ASC;
