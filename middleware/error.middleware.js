// Middleware de manejo de errores y logging

const requestLogger = (req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
};

const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    status: 'error',
    message: err.message || 'Error interno del servidor'
  });
};

const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    status: 'fail',
    message: `Ruta ${req.originalUrl} no encontrada`
  });
};

module.exports = {
  requestLogger,
  errorHandler,
  notFoundHandler
};
