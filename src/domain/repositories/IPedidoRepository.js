class IPedidoRepository {
    async salvar (_pedido) {
        throw new Error('Método salvar não implementado');
    }

    async buscarPorId (_id) {
        throw new Error('Método buscarPorId não implementado');
    }

    async listarTodos () {
        throw new Error('Método listarTodos não implementado');
    }

    async atualizar (_id, _pedido) {
        throw new Error('Método atualizar não implementado');
    }
}

module.exports = IPedidoRepository;