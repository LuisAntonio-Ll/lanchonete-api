const AppError = require('../../utils/AppError');

/** Recebe um schema Zod e devolve um middleware Express. */
function validate(schema) {
  return (req, res, next) => {
    const resultado = schema.safeParse(req.body);
    if (!resultado.success) {
      const mensagem = resultado.error.issues.map((issue) => issue.message).join('; ');
      return next(new AppError(mensagem, 400));
    }
    req.body = resultado.data;
    next();
  };
}

module.exports = validate;