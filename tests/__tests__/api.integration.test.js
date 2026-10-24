const request = require('supertest');
const createApp = require('../../src/app');
const Database = require('../../src/infrastructure/database/Database');

describe('API - fluxo de integração', () => {
  let app;

  beforeEach(() => {
    Database.resetar(); // zera o "banco" entre os testes
    app = createApp();
  });

  it('cria produto, cria pedido e avança o status', async () => {
    const respostaProduto = await request(app).post('/produtos').send({
      nome: 'X-Burger',
      categoria: 'LANCHE',
      preco: 25,
      tempoPreparoMinutos: 12,
    });
    expect(respostaProduto.status).toBe(201);
    const produtoId = respostaProduto.body.id;

    const respostaPedido = await request(app)
      .post('/pedidos')
      .send({ clienteNome: 'Carlos', itens: [{ produtoId, quantidade: 3 }] });
    expect(respostaPedido.status).toBe(201);
    expect(respostaPedido.body.valorTotal).toBe(75);
    expect(respostaPedido.body.desconto).toBe(7.5); // 75 >= 50, então 10%

    const respostaStatus = await request(app)
      .patch(`/pedidos/${respostaPedido.body.id}/status`)
      .send({ status: 'EM_PREPARO' });
    expect(respostaStatus.status).toBe(200);
    expect(respostaStatus.body.status).toBe('EM_PREPARO');
  });

  it('retorna 400 ao tentar pular etapa de status', async () => {
    const produto = await request(app).post('/produtos').send({
      nome: 'Suco',
      categoria: 'BEBIDA',
      preco: 8,
      tempoPreparoMinutos: 3,
    });
    const pedido = await request(app)
      .post('/pedidos')
      .send({ clienteNome: 'Ana', itens: [{ produtoId: produto.body.id, quantidade: 1 }] });

    const resposta = await request(app)
      .patch(`/pedidos/${pedido.body.id}/status`)
      .send({ status: 'ENTREGUE' });
    expect(resposta.status).toBe(400);
  });

  it('retorna 404 ao buscar produto inexistente', async () => {
    const resposta = await request(app).get('/produtos/999');
    expect(resposta.status).toBe(404);
  });

  it('retorna 400 ao criar produto com dados inválidos', async () => {
    const resposta = await request(app).post('/produtos').send({ nome: '' });
    expect(resposta.status).toBe(400);
  });
});