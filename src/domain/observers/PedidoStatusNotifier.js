/**
 * Sujeito (Subject) do padrão Observer: mantém a lista de observadores
 * e os notifica sempre que o status de um pedido muda.
 */
class PedidoStatusNotifier{
    constructor(){
        this.observers = [];
    }

    inscrever(observer){
        this.observers.push(observer);
    }

    notificar(pedido, statusAnterior){
        for (const observer of this.observers){
            observer.notificar(pedido, statusAnterior);
        }
    }
}

module.exports = PedidoStatusNotifier;