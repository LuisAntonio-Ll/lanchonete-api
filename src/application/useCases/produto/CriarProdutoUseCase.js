const Produto = require('../../../domain/entities/Produto');

class CriarProdutoUseCase {
    constructor(produtoRepository){
        this.produtoRepository = produtoRepository;
    }

    async execute(dados){
        const produto = new Produto(dados);
        return this.produtoRepository.salvar(produto);
    }
}

module.exports = CriarProdutoUseCase;