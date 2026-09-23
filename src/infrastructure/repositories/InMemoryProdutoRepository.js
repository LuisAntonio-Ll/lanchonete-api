const IProdutoRepository = require('../../domain/repositories/IProdutoRepository');
const Database = require('../database/Database');

class InMemoryProdutoRepository extends IProdutoRepository {
  constructor(database = Database.getInstance()) {
    super();
    this.db = database;
  }

  async salvar(produto) {
    produto.id = this.db.proximoIdProduto();
    this.db.produtos.set(produto.id, produto);
    return produto;
  }

  async buscarPorId(id) {
    return this.db.produtos.get(Number(id)) || null;
  }

  async listarTodos() {
    return Array.from(this.db.produtos.values());
  }

  async atualizar(produto) {
    this.db.produtos.set(produto.id, produto);
    return produto;
  }

  async deletar(id) {
    return this.db.produtos.delete(Number(id));
  }
}

module.exports = InMemoryProdutoRepository;