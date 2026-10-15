const { Router } = require('express');
const validate = require('../middlewares/validate');
const { criarPedidoSchema, atualizarStatusSchema } = require('../validators/pedidoValidator');

function pedidoRoutes(pedidoController) {
  const router = Router();

  router.post('/', validate(criarPedidoSchema), pedidoController.criar);
  router.get('/', pedidoController.listar);
  router.get('/:id', pedidoController.buscar);
  router.patch('/:id/status', validate(atualizarStatusSchema), pedidoController.atualizarStatus);

  return router;
}

module.exports = pedidoRoutes;