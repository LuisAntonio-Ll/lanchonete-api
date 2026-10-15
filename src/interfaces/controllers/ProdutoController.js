class ProdutoController {
  constructor({
    criarProdutoUseCase,
    listarProdutosUseCase,
    buscarProdutoUseCase,
    atualizarProdutoUseCase,
    deletarProdutoUseCase,
  }) {
    this.criarProdutoUseCase = criarProdutoUseCase;
    this.listarProdutosUseCase = listarProdutosUseCase;
    this.buscarProdutoUseCase = buscarProdutoUseCase;
    this.atualizarProdutoUseCase = atualizarProdutoUseCase;
    this.deletarProdutoUseCase = deletarProdutoUseCase;
  }

  criar = async (req, res, next) => {
    try {
      const produto = await this.criarProdutoUseCase.execute(req.body);
      res.status(201).json(produto);
    } catch (err) {
      next(err);
    }
  };

  listar = async (req, res, next) => {
    try {
      const produtos = await this.listarProdutosUseCase.execute();
      res.status(200).json(produtos);
    } catch (err) {
      next(err);
    }
  };

  buscar = async (req, res, next) => {
    try {
      const produto = await this.buscarProdutoUseCase.execute(req.params.id);
      res.status(200).json(produto);
    } catch (err) {
      next(err);
    }
  };

  atualizar = async (req, res, next) => {
    try {
      const produto = await this.atualizarProdutoUseCase.execute(req.params.id, req.body);
      res.status(200).json(produto);
    } catch (err) {
      next(err);
    }
  };

  deletar = async (req, res, next) => {
    try {
      await this.deletarProdutoUseCase.execute(req.params.id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  };
}

module.exports = ProdutoController;