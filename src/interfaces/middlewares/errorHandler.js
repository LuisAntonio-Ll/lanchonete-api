/* eslint-disable no-unused-vars */

function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || (err.name === 'Error' ? 400 : 500);

  if (statusCode === 500) {
    console.error(err);
  }

  res.status(statusCode).json({
    erro: err.name || 'Erro',
    mensagem: err.message || 'Ocorreu um erro inesperado',
  });
}

module.exports = errorHandler;