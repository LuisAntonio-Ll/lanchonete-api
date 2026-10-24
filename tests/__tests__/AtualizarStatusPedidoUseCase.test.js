const AtualizarStatusPedidoUseCase = require('../../src/application/useCases/pedido/AtualizarStatusPedidoUseCase');
const Pedido = require('../../src/domain/entities/Pedido');
const ItemPedido = require('../../src/domain/entities/ItemPedido');

function criarPedidoDeTeste() {
  return new Pedido({
    id: 1,
    clienteNome: 'Ana',
    itens: [
      new ItemPedido({ produtoId: 1, nomeProduto: 'X-Burger', precoUnitario: 20, quantidade: 1, tempoPreparoMinutos: 10 }),
    ],
  });
}

describe('AtualizarStatusPedidoUseCase', () => {
  it('avança o status e notifica os observers', async () => {
    const pedido = criarPedidoDeTeste();
    const pedidoRepository = {
      buscarPorId: jest.fn().mockResolvedValue(pedido),
      atualizar: jest.fn().mockResolvedValue(pedido),
    };
    const notifier = { notificar: jest.fn() };

    const useCase = new AtualizarStatusPedidoUseCase(pedidoRepository, notifier);
    const resultado = await useCase.execute(1, 'EM_PREPARO');

    expect(resultado.status).toBe('EM_PREPARO');
    expect(pedidoRepository.atualizar).toHaveBeenCalledWith(pedido);
    expect(notifier.notificar).toHaveBeenCalledWith(pedido, 'RECEBIDO');
  });

  it('lança erro 404 se o pedido não existir', async () => {
    const pedidoRepository = { buscarPorId: jest.fn().mockResolvedValue(null) };
    const useCase = new AtualizarStatusPedidoUseCase(pedidoRepository, null);
    await expect(useCase.execute(999, 'EM_PREPARO')).rejects.toThrow('não encontrado');
  });
});