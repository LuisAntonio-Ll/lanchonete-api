const AppError = require('../../../utils/AppError');

class DeletarProdutoUseCase{
    constuctor(produtoRepository){
        this.produtoRepository = produtoRepository;
    }

    async execute(id){
        const produto = await this.produtoRepository.buscarPorId(id);
        if (!produto){
            throw new AppError(`Produto com id ${id} não encontrado`, 404);
        }
        await this.produtoRepository.deletar(id);
    }
}

module.exports = DeletarProdutoUseCase;