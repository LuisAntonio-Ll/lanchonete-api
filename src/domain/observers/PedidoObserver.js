/**
 * PADRÃO GoF: Observer.
 * Interface para quem quiser "escutar" mudanças de status de um pedido.
 */
class PedidoObserver {
    notificar(_pedido, _statusAnterior){
        throw new Error('Método notificar() não implementado');
    }
}

module.exports = PedidoObserver;