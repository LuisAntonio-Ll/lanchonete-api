const { Router } = require('express');
const validate = require('../middlewares/validate');
const { criarProdutoSchema, atualizarProdutoSchema } = require('../validators/produtoValidator');

function produtoRoutes(produtoController) {
  const router = Router();

  router.post('/', validate(criarProdutoSchema), produtoController.criar);
  router.get('/', produtoController.listar);
  router.get('/:id', produtoController.buscar);
  router.put('/:id', validate(atualizarProdutoSchema), produtoController.atualizar);
  router.delete('/:id', produtoController.deletar);

  return router;
}

module.exports = produtoRoutes;