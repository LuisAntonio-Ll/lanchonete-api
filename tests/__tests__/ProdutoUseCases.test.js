const CriarProdutoUseCase = require('../../src/application/useCases/produto/CriarProdutoUseCase');
const BuscarProdutoUseCase = require('../../src/application/useCases/produto/BuscarProdutoUseCase');
const AtualizarProdutoUseCase = require('../../src/application/useCases/produto/AtualizarProdutoUseCase');
const DeletarProdutoUseCase = require('../../src/application/useCases/produto/DeletarProdutoUseCase');

function criarMockRepository() {
  const produtos = new Map();
  let nextId = 1;
  return {
    salvar: jest.fn((produto) => {
      produto.id = nextId++;
      produtos.set(produto.id, produto);
      return Promise.resolve(produto);
    }),
    buscarPorId: jest.fn((id) => Promise.resolve(produtos.get(Number(id)) || null)),
    atualizar: jest.fn((produto) => {
      produtos.set(produto.id, produto);
      return Promise.resolve(produto);
    }),
    deletar: jest.fn((id) => Promise.resolve(produtos.delete(Number(id)))),
  };
}

describe('CriarProdutoUseCase', () => {
  it('cria um produto válido', async () => {
    const repo = criarMockRepository();
    const useCase = new CriarProdutoUseCase(repo);
    const produto = await useCase.execute({
      nome: 'Batata Frita',
      categoria: 'ACOMPANHAMENTO',
      preco: 12,
      tempoPreparoMinutos: 8,
    });
    expect(produto.id).toBe(1);
    expect(repo.salvar).toHaveBeenCalledTimes(1);
  });

  it('rejeita produto com preço inválido', async () => {
    const repo = criarMockRepository();
    const useCase = new CriarProdutoUseCase(repo);
    await expect(
      useCase.execute({ nome: 'X', categoria: 'LANCHE', preco: -5, tempoPreparoMinutos: 5 })
    ).rejects.toThrow('Preço');
  });
});

describe('BuscarProdutoUseCase', () => {
  it('retorna erro 404 se produto não existir', async () => {
    const repo = criarMockRepository();
    const useCase = new BuscarProdutoUseCase(repo);
    await expect(useCase.execute(999)).rejects.toThrow('não encontrado');
  });
});

describe('AtualizarProdutoUseCase', () => {
  it('atualiza os dados de um produto existente', async () => {
    const repo = criarMockRepository();
    const produto = await new CriarProdutoUseCase(repo).execute({
      nome: 'Suco',
      categoria: 'BEBIDA',
      preco: 7,
      tempoPreparoMinutos: 3,
    });

    const atualizado = await new AtualizarProdutoUseCase(repo).execute(produto.id, { preco: 9 });
    expect(atualizado.preco).toBe(9);
  });
});

describe('DeletarProdutoUseCase', () => {
  it('remove um produto existente', async () => {
    const repo = criarMockRepository();
    const produto = await new CriarProdutoUseCase(repo).execute({
      nome: 'Sorvete',
      categoria: 'SOBREMESA',
      preco: 10,
      tempoPreparoMinutos: 2,
    });

    await new DeletarProdutoUseCase(repo).execute(produto.id);
    expect(repo.deletar).toHaveBeenCalledWith(produto.id);
  });

  it('lança erro 404 ao tentar deletar produto inexistente', async () => {
    const repo = criarMockRepository();
    await expect(new DeletarProdutoUseCase(repo).execute(999)).rejects.toThrow('não encontrado');
  });
});