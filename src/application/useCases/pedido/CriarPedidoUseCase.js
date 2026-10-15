const Pedido = require('../../../domain/entities/Pedido');
const ItemPedidoFactory = require('../../../domain/factories/ItemPedidoFactory');
const AppError = require('../../../utils/AppError');

/**
 * Orquestra a criação de um pedido:
 *  1. Busca cada produto no repositório
 *  2. Usa a Factory Method para transformar produto + quantidade em ItemPedido
 *  3. Cria a entidade Pedido, que aplica a Strategy de desconto e calcula totais
 *  4. Persiste via Repository
 */
class CriarPedidoUseCase {
    constructor(pedidoRepository, produtoRepository, discountStrategy) {
        this.pedidoRepository = pedidoRepository;
        this.produtoRepository = produtoRepository;
        this.discountStrategy = discountStrategy;
    }

    async execute({ clienteNome, itens }) {
        if (!itens || itens.length === 0){
            throw new AppError('O pedido deve conter ao menos 1 item', 400);
        }
        
        const itensPedido = [];
        for (const item of itens){
            const produto = await this.produtoRepository.buscarPorId(item.produtoId);
            if (!produto){
                throw new AppError(`Produto com id ${item.produtoId} não encontado`, 404);
            }
            itensPedido.push(ItemPedidoFactory.criar(produto, item.quantidade));
        }

        const pedido = new Pedido({
            clienteNome,
            itens: itensPedido,
            disconutStrategy: this.discountStrategy,
        });

        return this.pedidoRepository.salvar(pedido);
    }
}

module.exports = CriarPedidoUseCase;