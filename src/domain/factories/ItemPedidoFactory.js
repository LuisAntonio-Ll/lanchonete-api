const ItemPedido = require('../entities/ItemPedido');

/**
 * PADRÃO GoF: Factory Method.
 * Centraliza e encapsula a lógica de criação de um ItemPedido a partir de um
 * Produto do catálogo, garantindo as validações de negócio (ex: produto ativo)
 * antes de "congelar" o preço e o tempo de preparo no item do pedido.
 */
class ItemPedidoFactory {
    static criar(produto, quantidade){
        if(!produto.ativo){
            throw new Error(`Produto "${produto.nome}" nçao está disponível no momento`);
        }

        return new ItemPedido({
            produtoId: produto.id,
            nomeProduto: produto.nome,
            precoUnitario: produto.preco,
            quantidade,
            tempoPreparoMinutos: produto.tempoPreparoMinutos,
        });
    }
}

module.exports = ItemPedidoFactory;