const { z } = require('zod');
const Produto = require('../../domain/entities/Produto');

const criarProdutoSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  categoria: z.enum(Produto.CATEGORIAS_VALIDAS, {
    errorMap: () => ({
      message: `Categoria deve ser uma de: ${Produto.CATEGORIAS_VALIDAS.join(', ')}`,
    }),
  }),
  preco: z.number().positive('Preço deve ser um número positivo'),
  tempoPreparoMinutos: z.number().min(0, 'Tempo de preparo não pode ser negativo'),
  ativo: z.boolean().optional(),
});

const atualizarProdutoSchema = criarProdutoSchema.partial();

module.exports = { criarProdutoSchema, atualizarProdutoSchema };