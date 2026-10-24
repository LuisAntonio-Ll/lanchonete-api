const Pedido = require('../../src/domain/entities/Pedido');
const ItemPedido = require('../../src/domain/entities/ItemPedido');
const PercentageThresholdDiscountStrategy = require('../../src/domain/strategies/PercentageThresholdDiscountStrategy');

function criarItens() {
  return [
    new ItemPedido({ produtoId: 1, nomeProduto: 'X-Burger', precoUnitario: 20, quantidade: 2, tempoPreparoMinutos: 15 }),
    new ItemPedido({ produtoId: 2, nomeProduto: 'Refrigerante', precoUnitario: 6, quantidade: 2, tempoPreparoMinutos: 2 }),
  ];
}

describe('Pedido - criação', () => {
  it('calcula valor total, desconto e tempo de preparo corretamente', () => {
    const pedido = new Pedido({
      clienteNome: 'Maria',
      itens: criarItens(),
      discountStrategy: new PercentageThresholdDiscountStrategy(50, 0.1),
    });

    expect(pedido.valorTotal).toBe(52); // (20*2) + (6*2)
    expect(pedido.desconto).toBe(5.2); // 10% de 52
    expect(pedido.valorFinal).toBe(46.8);
    expect(pedido.tempoPreparoEstimado).toBe(15); // maior tempo entre os itens
    expect(pedido.status).toBe('RECEBIDO');
  });

  it('lança erro se não houver itens', () => {
    expect(() => new Pedido({ clienteNome: 'Maria', itens: [] })).toThrow('ao menos 1 item');
  });

  it('lança erro se não houver nome do cliente', () => {
    expect(() => new Pedido({ clienteNome: '', itens: criarItens() })).toThrow('Nome do cliente');
  });
});

describe('Pedido - máquina de estados do status', () => {
  it('avança status na ordem correta', () => {
    const pedido = new Pedido({ clienteNome: 'Maria', itens: criarItens() });
    pedido.avancarStatus('EM_PREPARO');
    expect(pedido.status).toBe('EM_PREPARO');
    pedido.avancarStatus('PRONTO');
    expect(pedido.status).toBe('PRONTO');
    pedido.avancarStatus('ENTREGUE');
    expect(pedido.status).toBe('ENTREGUE');
  });

  it('não permite pular etapas do fluxo', () => {
    const pedido = new Pedido({ clienteNome: 'Maria', itens: criarItens() });
    expect(() => pedido.avancarStatus('PRONTO')).toThrow('Transição inválida');
  });

  it('não permite mudar status depois de ENTREGUE', () => {
    const pedido = new Pedido({ clienteNome: 'Maria', itens: criarItens() });
    pedido.avancarStatus('EM_PREPARO');
    pedido.avancarStatus('PRONTO');
    pedido.avancarStatus('ENTREGUE');
    expect(() => pedido.avancarStatus('EM_PREPARO')).toThrow('já entregue');
  });

  it('permite cancelar antes de ENTREGUE', () => {
    const pedido = new Pedido({ clienteNome: 'Maria', itens: criarItens() });
    pedido.avancarStatus('EM_PREPARO');
    pedido.avancarStatus('CANCELADO');
    expect(pedido.status).toBe('CANCELADO');
  });

  it('não permite mudar status depois de CANCELADO', () => {
    const pedido = new Pedido({ clienteNome: 'Maria', itens: criarItens() });
    pedido.avancarStatus('CANCELADO');
    expect(() => pedido.avancarStatus('EM_PREPARO')).toThrow('cancelado');
  });
});