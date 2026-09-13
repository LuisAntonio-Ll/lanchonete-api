class IProdutoRepository {
    async salvar (_produto) {
        throw new Error('Método salvar não implementado');
    }

    async buscarPorId (_id) {
        throw new Error('Método buscarPorId não implementado');
    }

    async listarTodos () {
        throw new Error('Método listarTodos não implementado');
    }

    async atualizar (_id, _produto) {
        throw new Error('Método atualizar não implementado');
    }

    async deletar (_id) {
        throw new Error('Método deletar não implementado');
    }
}

module.exports = IProdutoRepository;