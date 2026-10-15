const AppError = require('../../../utils/AppError');

class BuscarPedidoUseCase {
  constructor(pedidoRepository) {
    this.pedidoRepository = pedidoRepository;
  }

  async execute(id) {
    const pedido = await this.pedidoRepository.buscarPorId(id);
    if (!pedido) {
      throw new AppError(`Pedido com id ${id} não encontrado`, 404);
    }
    return pedido;
  }
}

module.exports = BuscarPedidoUseCase;