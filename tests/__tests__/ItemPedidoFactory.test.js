const ItemPedidoFactory = require('../../src/domain/factories/ItemPedidoFactory');
const Produto = require('../../src/domain/entities/Produto');

describe('ItemPedidoFactory', () => {
  const produtoAtivo = new Produto({
    id: 1,
    nome: 'X-Burger',
    categoria: 'LANCHE',
    preco: 20,
    tempoPreparoMinutos: 15,
    ativo: true,
  });

  it('cria um ItemPedido com subtotal calculado corretamente', () => {
    const item = ItemPedidoFactory.criar(produtoAtivo, 3);
    expect(item.subtotal).toBe(60);
    expect(item.nomeProduto).toBe('X-Burger');
    expect(item.tempoPreparoMinutos).toBe(15);
  });

  it('lança erro se o produto estiver inativo', () => {
    const produtoInativo = new Produto({ ...produtoAtivo, id: 2, ativo: false });
    expect(() => ItemPedidoFactory.criar(produtoInativo, 1)).toThrow('não está disponível');
  });

  it('lança erro se a quantidade for inválida', () => {
    expect(() => ItemPedidoFactory.criar(produtoAtivo, 0)).toThrow();
  });
});