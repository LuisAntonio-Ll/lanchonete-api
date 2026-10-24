const CriarPedidoUseCase = require('../../src/application/useCases/pedido/CriarPedidoUseCase');
const Produto = require('../../src/domain/entities/Produto');
const PercentageThresholdDiscountStrategy = require('../../src/domain/strategies/PercentageThresholdDiscountStrategy');

function criarMockProdutoRepository(produtos) {
  return {
    buscarPorId: jest.fn((id) => Promise.resolve(produtos.find((p) => p.id === id) || null)),
  };
}

function criarMockPedidoRepository() {
  return {
    salvar: jest.fn((pedido) => {
      pedido.id = 1;
      return Promise.resolve(pedido);
    }),
  };
}

describe('CriarPedidoUseCase', () => {
  const produtoBurger = new Produto({
    id: 1,
    nome: 'X-Burger',
    categoria: 'LANCHE',
    preco: 30,
    tempoPreparoMinutos: 15,
  });
  const produtoRefri = new Produto({
    id: 2,
    nome: 'Refrigerante',
    categoria: 'BEBIDA',
    preco: 8,
    tempoPreparoMinutos: 2,
  });

  it('cria o pedido calculando valor total, desconto e tempo de preparo', async () => {
    const produtoRepository = criarMockProdutoRepository([produtoBurger, produtoRefri]);
    const pedidoRepository = criarMockPedidoRepository();
    const discountStrategy = new PercentageThresholdDiscountStrategy(50, 0.1);

    const useCase = new CriarPedidoUseCase(pedidoRepository, produtoRepository, discountStrategy);

    const pedido = await useCase.execute({
      clienteNome: 'João',
      itens: [
        { produtoId: 1, quantidade: 2 }, // 60
        { produtoId: 2, quantidade: 1 }, // 8
      ],
    });

    expect(pedido.valorTotal).toBe(68);
    expect(pedido.desconto).toBe(6.8);
    expect(pedido.valorFinal).toBe(61.2);
    expect(pedido.tempoPreparoEstimado).toBe(15);
    expect(pedidoRepository.salvar).toHaveBeenCalledTimes(1);
  });

  it('lança erro (404) se algum produto do pedido não existir', async () => {
    const produtoRepository = criarMockProdutoRepository([produtoBurger]);
    const pedidoRepository = criarMockPedidoRepository();
    const useCase = new CriarPedidoUseCase(pedidoRepository, produtoRepository, null);

    await expect(
      useCase.execute({ clienteNome: 'João', itens: [{ produtoId: 999, quantidade: 1 }] })
    ).rejects.toThrow('não encontrado');
  });

  it('lança erro (400) se o pedido não tiver itens', async () => {
    const produtoRepository = criarMockProdutoRepository([]);
    const pedidoRepository = criarMockPedidoRepository();
    const useCase = new CriarPedidoUseCase(pedidoRepository, produtoRepository, null);

    await expect(useCase.execute({ clienteNome: 'João', itens: [] })).rejects.toThrow(
      'ao menos 1 item'
    );
  });
});