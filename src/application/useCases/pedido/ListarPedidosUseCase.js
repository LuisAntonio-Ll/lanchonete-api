const Pedido = require('../../../domain/entities/Pedido');
const AppError = require('../../../utils/AppError');

const STATUS_VALIDOS = [...Pedido.FLUXO_STATUS, 'CANCELADO'];

class ListarPedidosUseCase {
  constructor(pedidoRepository) {
    this.pedidoRepository = pedidoRepository;
  }

  async execute({ status } = {}) {
    if (status && !STATUS_VALIDOS.includes(status)) {
      throw new AppError(`Status inválido para filtro. Use um de: ${STATUS_VALIDOS.join(', ')}`, 400);
    }

    const pedidos = await this.pedidoRepository.listarTodos();
    return status ? pedidos.filter((pedido) => pedido.status === status) : pedidos;
  }
}

module.exports = ListarPedidosUseCase;