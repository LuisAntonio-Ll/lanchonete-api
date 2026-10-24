const ListarPedidosUseCase = require('../../src/application/useCases/pedido/ListarPedidosUseCase');

describe('ListarPedidosUseCase - filtro por status (TDD)', () => {
  const pedidos = [
    { id: 1, status: 'RECEBIDO' },
    { id: 2, status: 'PRONTO' },
    { id: 3, status: 'RECEBIDO' },
  ];
  const pedidoRepository = { listarTodos: jest.fn().mockResolvedValue(pedidos) };

  it('retorna todos os pedidos quando não há filtro', async () => {
    const resultado = await new ListarPedidosUseCase(pedidoRepository).execute();
    expect(resultado).toHaveLength(3);
  });

  it('retorna apenas os pedidos do status informado', async () => {
    const resultado = await new ListarPedidosUseCase(pedidoRepository).execute({ status: 'RECEBIDO' });
    expect(resultado.map((p) => p.id)).toEqual([1, 3]);
  });

  it('lança erro se o status do filtro for inválido', async () => {
    await expect(
      new ListarPedidosUseCase(pedidoRepository).execute({ status: 'INVENTADO' })
    ).rejects.toThrow('Status inválido');
  });
});