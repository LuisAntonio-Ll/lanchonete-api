class ItemPedido {
    constructor({ produtoId, nomeProduto, precoUnitario, quantidade, tempoPreparoMinutos}){
        if (!Number.isInteger(quantidade) || quantidade <= 0){
            throw new Error('Quantidade deve ser um número inteiro maior que zero');
        }

        this.produtoId = produtoId;
        this.nomeProduto = nomeProduto;
        this.precoUnitario = precoUnitario;
        this.quantidade = quantidade;
        this.tempoPreparoMinutos = tempoPreparoMinutos;
        this.subtotal = Number((precoUnitario * quantidade).toFixed(2));
    }
}

module.exports = ItemPedido;