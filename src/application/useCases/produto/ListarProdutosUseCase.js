class ListarProdutosUseCase {
    constructor(produtoRepository){
        this.produtoRepository = produtoRepository;
    }

    async execute(){
        return this.produtoRepository.listarTodos();
    }
}

module.exports = ListarProdutosUseCase;