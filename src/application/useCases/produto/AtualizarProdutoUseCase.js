const AppError = require('../../../utils/AppError');

class AtualizarProdutoUseCase {
    constructor(produtoRepository){
        this.produtoRepository = produtoRepository;
    }

    async execute(id, dados){
        const produto = await this.produtoRepository.buscarPorId(id);
        if(!produto){
            throw new AppError(`Produto com id ${id} não encontrado`, 404);
        }
        produto.atualizar(dados);
        return this.produtoRepository.atualizar(produto);
    }
}

module.exports = AtualizarProdutoUseCase;