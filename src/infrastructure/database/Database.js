/**
 * PADRÃO GoF: Singleton.
 * Garante uma única instância de "conexão" com o armazenamento em toda a aplicação.
 *
 * Implementação: armazenamento em memória (Map), simples e sem dependências nativas —
 * ideal para rodar o projeto localmente sem instalar nada além do Node.js.
 * Graças ao padrão Repository (Etapa 3), trocar isto por SQLite/PostgreSQL no futuro
 * exige apenas criar uma nova implementação das interfaces, sem tocar em
 * controllers, use cases ou entidades (Dependency Inversion Principle).
 */
class Database {
  constructor() {
    if (Database.instance) {
      return Database.instance;
    }

    this.produtos = new Map();
    this.pedidos = new Map();
    this._produtoIdCounter = 1;
    this._pedidoIdCounter = 1;

    Database.instance = this;
  }

  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  proximoIdProduto() {
    return this._produtoIdCounter++;
  }

  proximoIdPedido() {
    return this._pedidoIdCounter++;
  }

  /** Útil para resetar o estado entre testes. */
  static resetar() {
    Database.instance = null;
  }
}

module.exports = Database;