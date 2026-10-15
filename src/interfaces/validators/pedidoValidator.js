const { z } = require('zod');

const criarPedidoSchema = z.object({
  clienteNome: z.string().min(1, 'Nome do cliente é obrigatório'),
  itens: z
    .array(
      z.object({
        produtoId: z.number().int().positive('produtoId inválido'),
        quantidade: z.number().int().positive('quantidade deve ser maior que zero'),
      })
    )
    .min(1, 'O pedido deve conter ao menos 1 item'),
});

const atualizarStatusSchema = z.object({
  status: z.enum(['EM_PREPARO', 'PRONTO', 'ENTREGUE', 'CANCELADO'], {
    errorMap: () => ({ message: 'Status inválido' }),
  }),
});

module.exports = { criarPedidoSchema, atualizarStatusSchema };