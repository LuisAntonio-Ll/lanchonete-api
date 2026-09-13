const FLUXO_STATUS = ['RECEBIDO', 'EM_ PREPARO', 'PRONTO', 'ENTREGUE'];

class Pedido{
    constructor({id, clienteNome, itens, discountStrategy}){
        if (!clienteNome || String(clienteNome).trim().length === 0){
            throw new Error('Nome do cliente é obrigatório');
        }
        if (!itens || itens.length === 0){
            throw new Error('O pedido deve conter ao menos 1 item');
        }

        this.id = id;
        this.clienteNome = clienteNome;
        this.itens = itens;
        this.status = 'RECEBIDO';
        this.criadoEm = new Date().toISOString();

        this.valorTotal = this.calcularValorTotal();
        this.desconto = discountStrategy ? discountStrategy.calcular(this.valorTotal) : 0;
        this.valorFinal = Number((this.valorTotal - this.desconto).toFixed(2));
        this.tempoPreparoEstimado = this._calcularTempoPreparo();
    }

    _calcularValorTotal(){
        return Number(this.itens.reduce((soma, item) => soma + item.subtotal, 0).toFixed(2));
    }

    _calcularTempoPreparo(){
        return Math.max(...this.itens.map((item) => item.tempoPreparoMinutos));
    }

    avancarStatus(novoStatus){
        if (this.status === 'CANCELADO'){
            throw new Error('Pedido cancelado não pode mais mudar de status');
        }
        if (this.status === 'ENTREGUE'){
            throw new Error('Pedido já entregue não pode mais mudar de status');
        }

        if (novoStatus === 'CANCELADO'){
            this.status = 'CANCELADO';
            return;
        }

        const indiceAtual = FLUXO_STATUS.indexOf(this.status);
        const indiceNovo = FLUXO_STATUS.indexOf(novoStatus);

        if(indiceNovo === -1){
            throw new Error(`Status inválido. Use um de: ${FLUXO_STATUS.join(', ')} ou CANCELADO`);
        }
        if(indiceNovo !== indiceAtual + 1){
            throw new Error(
                `Transição inválida de ${this.status} para ${novoStatus}. O fluxo é: ${FLUXO_STATUS.join(' -> ')}`
            );
        }

        this.status = novoStatus;
    }
}

Pedido.FLUXO_STATUS = FLUXO_STATUS;
module.exports = Pedido;