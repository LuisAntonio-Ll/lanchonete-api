const AppError = require('../../../utils/AppError');

class AtualizarStatusPedidoUseCase {
  constructor(pedidoRepository, notifier) {
    this.pedidoRepository = pedidoRepository;
    this.notifier = notifier;
  }

  async execute(id, novoStatus) {
    const pedido = await this.pedidoRepository.buscarPorId(id);
    if (!pedido) {
      throw new AppError(`Pedido com id ${id} não encontrado`, 404);
    }

    const statusAnterior = pedido.status;
    pedido.avancarStatus(novoStatus); // regra de negócio vive na entidade

    await this.pedidoRepository.atualizar(pedido);

    if (this.notifier) {
      this.notifier.notificar(pedido, statusAnterior);
    }

    return pedido;
  }
}

module.exports = AtualizarStatusPedidoUseCase;