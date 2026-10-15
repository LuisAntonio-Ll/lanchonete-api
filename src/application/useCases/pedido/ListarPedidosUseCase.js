class ListarPedidosUseCase {
  constructor(pedidoRepository) {
    this.pedidoRepository = pedidoRepository;
  }

  async execute() {
    return this.pedidoRepository.listarTodos();
  }
}

module.exports = ListarPedidosUseCase;