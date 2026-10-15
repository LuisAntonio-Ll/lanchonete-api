class PedidoController {
  constructor({
    criarPedidoUseCase,
    listarPedidosUseCase,
    buscarPedidoUseCase,
    atualizarStatusPedidoUseCase,
  }) {
    this.criarPedidoUseCase = criarPedidoUseCase;
    this.listarPedidosUseCase = listarPedidosUseCase;
    this.buscarPedidoUseCase = buscarPedidoUseCase;
    this.atualizarStatusPedidoUseCase = atualizarStatusPedidoUseCase;
  }

  criar = async (req, res, next) => {
    try {
      const pedido = await this.criarPedidoUseCase.execute(req.body);
      res.status(201).json(pedido);
    } catch (err) {
      next(err);
    }
  };

  listar = async (req, res, next) => {
    try {
      const pedidos = await this.listarPedidosUseCase.execute();
      res.status(200).json(pedidos);
    } catch (err) {
      next(err);
    }
  };

  buscar = async (req, res, next) => {
    try {
      const pedido = await this.buscarPedidoUseCase.execute(req.params.id);
      res.status(200).json(pedido);
    } catch (err) {
      next(err);
    }
  };

  atualizarStatus = async (req, res, next) => {
    try {
      const pedido = await this.atualizarStatusPedidoUseCase.execute(
        req.params.id,
        req.body.status
      );
      res.status(200).json(pedido);
    } catch (err) {
      next(err);
    }
  };
}

module.exports = PedidoController;