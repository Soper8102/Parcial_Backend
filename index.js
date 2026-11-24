const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');

const { initDB } = require('./config/db');
const routes = require('./routes');
const { requestLogger, errorHandler, notFoundHandler } = require('./middleware/error.middleware');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

// Ruta principal de bienvenida
app.get('/', (req, res) => {
  res.json({
    message: 'API Backend funcionando correctamente con Express.js y PostgreSQL',
    endpoints: {
      materias: '/api/materias'
    }
  });
});

// Rutas de la API
app.use('/api', routes);

// Manejo de errores
app.use(notFoundHandler);
app.use(errorHandler);

// Iniciar servidor e inicializar DB
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', async () => {
  console.log(`Servidor Express corriendo en el puerto ${PORT}`);
  console.log(`URL local: http://localhost:${PORT}`);
  console.log(`Endpoint materias: http://localhost:${PORT}/api/materias`);
  await initDB();
});
