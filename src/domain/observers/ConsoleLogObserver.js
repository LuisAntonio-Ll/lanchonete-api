const PedidoObserver = require('./PedidoObserver');

class ConsoleLogObserver extends PedidoObserver {
    notificar(pedido, statusAnterior){
        console.log(
            `[Pedido #${pedido.id}] status mudou de ${statusAnterior} para ${pedido.status}`
        );
    }
}

module.exports = ConsoleLogObserver;