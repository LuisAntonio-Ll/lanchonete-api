const IPedidoRepository = require('../../domain/repositories/IPedidoRepository');
const Database = require('../database/Database');

class InMemoryPedidoRepository extends IPedidoRepository {
  constructor(database = Database.getInstance()) {
    super();
    this.db = database;
  }

  async salvar(pedido) {
    pedido.id = this.db.proximoIdPedido();
    this.db.pedidos.set(pedido.id, pedido);
    return pedido;
  }

  async buscarPorId(id) {
    return this.db.pedidos.get(Number(id)) || null;
  }

  async listarTodos() {
    return Array.from(this.db.pedidos.values());
  }

  async atualizar(pedido) {
    this.db.pedidos.set(pedido.id, pedido);
    return pedido;
  }
}

module.exports = InMemoryPedidoRepository;