const AppError = require('../../utils/AppError');

function notFoundHandler(req, res, next) {
  next(new AppError(`Rota ${req.method} ${req.originalUrl} não encontrada`, 404));
}

module.exports = notFoundHandler;