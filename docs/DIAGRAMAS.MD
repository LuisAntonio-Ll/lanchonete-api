# Diagramas do Projeto

## 1. Diagrama de Classes (domínio e padrões)

```mermaid
classDiagram
    class Produto {
        +Number id
        +String nome
        +String categoria
        +Number preco
        +Number tempoPreparoMinutos
        +Boolean ativo
        +validar(dados)$
        +atualizar(dados)
    }

    class ItemPedido {
        +Number produtoId
        +String nomeProduto
        +Number precoUnitario
        +Number quantidade
        +Number tempoPreparoMinutos
        +Number subtotal
    }

    class Pedido {
        +Number id
        +String clienteNome
        +String status
        +String criadoEm
        +Number valorTotal
        +Number desconto
        +Number valorFinal
        +Number tempoPreparoEstimado
        +avancarStatus(novoStatus)
    }

    class DiscountStrategy {
        <<interface>>
        +calcular(valorTotal)
    }
    class NoDiscountStrategy {
        +calcular(valorTotal)
    }
    class PercentageThresholdDiscountStrategy {
        +Number threshold
        +Number percentage
        +calcular(valorTotal)
    }

    class ItemPedidoFactory {
        +criar(produto, quantidade)$
    }

    class PedidoObserver {
        <<interface>>
        +notificar(pedido, statusAnterior)
    }
    class ConsoleLogObserver {
        +notificar(pedido, statusAnterior)
    }
    class PedidoStatusNotifier {
        +inscrever(observer)
        +notificar(pedido, statusAnterior)
    }

    class IProdutoRepository {
        <<interface>>
        +salvar(produto)
        +buscarPorId(id)
        +listarTodos()
        +atualizar(produto)
        +deletar(id)
    }
    class IPedidoRepository {
        <<interface>>
        +salvar(pedido)
        +buscarPorId(id)
        +listarTodos()
        +atualizar(pedido)
    }
    class InMemoryProdutoRepository
    class InMemoryPedidoRepository
    class Database {
        -Database instance$
        +getInstance()$
        +proximoIdProduto()
        +proximoIdPedido()
    }

    Pedido "1" *-- "1..*" ItemPedido : contém
    ItemPedido ..> Produto : snapshot de
    Pedido ..> DiscountStrategy : usa
    DiscountStrategy <|.. NoDiscountStrategy
    DiscountStrategy <|.. PercentageThresholdDiscountStrategy
    ItemPedidoFactory ..> Produto : lê
    ItemPedidoFactory ..> ItemPedido : cria
    PedidoObserver <|.. ConsoleLogObserver
    PedidoStatusNotifier o-- PedidoObserver : notifica
    IProdutoRepository <|.. InMemoryProdutoRepository
    IPedidoRepository <|.. InMemoryPedidoRepository
    InMemoryProdutoRepository ..> Database : usa
    InMemoryPedidoRepository ..> Database : usa
```

## 2. Diagrama de Arquitetura (camadas / pacotes)

```mermaid
flowchart TB
    Cliente(["Cliente: Postman / Swagger UI"])

    subgraph interfaces ["interfaces (porta de entrada HTTP)"]
        Rotas["routes + middlewares<br/>validate, errorHandler, notFound"]
        Controllers["controllers<br/>ProdutoController, PedidoController"]
        Validators["validators (Zod)"]
    end

    subgraph application ["application (casos de uso)"]
        UseCases["useCases<br/>Criar/Listar/Buscar/Atualizar/Deletar Produto<br/>Criar/Listar/Buscar Pedido, AtualizarStatus"]
    end

    subgraph domain ["domain (regras de negócio puras)"]
        Entities["entities<br/>Produto, ItemPedido, Pedido"]
        Patterns["strategies, factories, observers"]
        RepoInterfaces["repositories<br/>IProdutoRepository, IPedidoRepository"]
    end

    subgraph infrastructure ["infrastructure (detalhes técnicos)"]
        RepoImpl["repositories<br/>InMemory...Repository"]
        Db["database<br/>Database (Singleton)"]
    end

    Container["container.js<br/>(Composition Root: injeção de dependência)"]

    Cliente --> Rotas
    Rotas --> Validators
    Rotas --> Controllers
    Controllers --> UseCases
    UseCases --> Entities
    UseCases --> Patterns
    UseCases --> RepoInterfaces
    RepoImpl -. implementa .-> RepoInterfaces
    RepoImpl --> Db
    Container -. monta e injeta .-> Controllers
    Container -. monta e injeta .-> UseCases
    Container -. monta e injeta .-> RepoImpl
```

**Regra de dependência:** as setas apontam sempre para dentro. O `domain` não conhece `application`, `interfaces` nem `infrastructure`. A infraestrutura só aparece ligada ao domínio pela seta pontilhada "implementa".