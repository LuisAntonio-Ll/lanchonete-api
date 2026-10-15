/**
 * Composition Root: único lugar da aplicação onde as implementações concretas
 * são "amarradas" às abstrações (Dependency Injection manual).
 * Isso permite, por exemplo, trocar InMemoryProdutoRepository por um
 * SqliteProdutoRepository no futuro sem alterar use cases nem controllers.
 */
const InMemoryProdutoRepository = require('./infrastructure/repositories/InMemoryProdutoRepository');
const InMemoryPedidoRepository = require('./infrastructure/repositories/InMemoryPedidoRepository');

const PercentageThresholdDiscountStrategy = require('./domain/strategies/PercentageThresholdDiscountStrategy');
const PedidoStatusNotifier = require('./domain/observers/PedidoStatusNotifier');
const ConsoleLogObserver = require('./domain/observers/ConsoleLogObserver');

const CriarProdutoUseCase = require('./application/useCases/produto/CriarProdutoUseCase');
const ListarProdutosUseCase = require('./application/useCases/produto/ListarProdutosUseCase');
const BuscarProdutoUseCase = require('./application/useCases/produto/BuscarProdutoUseCase');
const AtualizarProdutoUseCase = require('./application/useCases/produto/AtualizarProdutoUseCase');
const DeletarProdutoUseCase = require('./application/useCases/produto/DeletarProdutoUseCase');

const CriarPedidoUseCase = require('./application/useCases/pedido/CriarPedidoUseCase');
const ListarPedidosUseCase = require('./application/useCases/pedido/ListarPedidosUseCase');
const BuscarPedidoUseCase = require('./application/useCases/pedido/BuscarPedidoUseCase');
const AtualizarStatusPedidoUseCase = require('./application/useCases/pedido/AtualizarStatusPedidoUseCase');

const ProdutoController = require('./interfaces/controllers/ProdutoController');
const PedidoController = require('./interfaces/controllers/PedidoController');

function buildContainer() {
  // Repositórios (infraestrutura)
  const produtoRepository = new InMemoryProdutoRepository();
  const pedidoRepository = new InMemoryPedidoRepository();

  // Strategy de desconto: 10% para pedidos a partir de R$ 50
  const discountStrategy = new PercentageThresholdDiscountStrategy(50, 0.1);

  // Observer: loga toda mudança de status de pedido
  const pedidoStatusNotifier = new PedidoStatusNotifier();
  pedidoStatusNotifier.inscrever(new ConsoleLogObserver());

  // Use cases de Produto
  const criarProdutoUseCase = new CriarProdutoUseCase(produtoRepository);
  const listarProdutosUseCase = new ListarProdutosUseCase(produtoRepository);
  const buscarProdutoUseCase = new BuscarProdutoUseCase(produtoRepository);
  const atualizarProdutoUseCase = new AtualizarProdutoUseCase(produtoRepository);
  const deletarProdutoUseCase = new DeletarProdutoUseCase(produtoRepository);

  // Use cases de Pedido
  const criarPedidoUseCase = new CriarPedidoUseCase(
    pedidoRepository,
    produtoRepository,
    discountStrategy
  );
  const listarPedidosUseCase = new ListarPedidosUseCase(pedidoRepository);
  const buscarPedidoUseCase = new BuscarPedidoUseCase(pedidoRepository);
  const atualizarStatusPedidoUseCase = new AtualizarStatusPedidoUseCase(
    pedidoRepository,
    pedidoStatusNotifier
  );

  // Controllers
  const produtoController = new ProdutoController({
    criarProdutoUseCase,
    listarProdutosUseCase,
    buscarProdutoUseCase,
    atualizarProdutoUseCase,
    deletarProdutoUseCase,
  });

  const pedidoController = new PedidoController({
    criarPedidoUseCase,
    listarPedidosUseCase,
    buscarPedidoUseCase,
    atualizarStatusPedidoUseCase,
  });

  return { produtoController, pedidoController, produtoRepository, pedidoRepository };
}

module.exports = buildContainer;