# API da Lanchonete

API RESTful para gerenciar o catálogo de produtos e os pedidos de uma lanchonete, desenvolvida em Node.js + Express como trabalho final da disciplina Análise e Projeto de Sistemas II. O projeto aplica princípios SOLID, padrões de projeto (GoF e GRASP), Clean Architecture em camadas, DDD, testes unitários com TDD e documentação com Swagger.

## Integrantes

- LUIS ANTÔNIO PEREIRA RABELO
- JOÃO PEDRO PEREIRA RABELO

## Tema e regras de negócio

O sistema gerencia **Produtos** (cardápio) e **Pedidos** (feitos por clientes, com um ou mais itens).

**Regras de negócio implementadas:**

1. **Desconto por valor:** pedidos com valor total a partir de R$ 50,00 recebem 10% de desconto.
2. **Tempo de preparo estimado:** é o maior tempo de preparo entre os itens do pedido (a cozinha prepara em paralelo).
3. **Fluxo de status:** `RECEBIDO → EM_PREPARO → PRONTO → ENTREGUE`. Não é permitido pular etapas nem voltar. O cancelamento (`CANCELADO`) é permitido a qualquer momento antes de `ENTREGUE`.
4. **Produto indisponível:** produtos inativos não podem ser adicionados a um pedido.
5. **Preço congelado:** cada item do pedido guarda o preço e o tempo de preparo do produto no momento da compra, então alterar o produto depois não muda pedidos antigos.
6. **Filtro por status:** a listagem de pedidos aceita `?status=` para filtrar.

## Padrões de projeto aplicados

| Padrão | Tipo | Onde | Por que foi usado |
|---|---|---|---|
| **Strategy** | GoF | `src/domain/strategies/` | O cálculo de desconto pode mudar (ex: desconto fixo, por dia da semana). Com Strategy, trocar a regra é criar uma nova classe, sem alterar a entidade `Pedido` (Open/Closed). |
| **Factory Method** | GoF | `src/domain/factories/ItemPedidoFactory.js` | Centraliza a criação do `ItemPedido` a partir de um `Produto` (validação de produto ativo e "congelamento" de preço e tempo), evitando duplicar essa lógica. |
| **Observer** | GoF | `src/domain/observers/` | Permite reagir a mudanças de status (hoje, um log) sem acoplar o `Pedido` a quem escuta. Novos observers (e-mail, WhatsApp) entram sem tocar nas regras existentes. |
| **Singleton** | GoF | `src/infrastructure/database/Database.js` | Garante uma única instância de armazenamento compartilhada por todos os repositórios. |
| **Repository** | GRASP | `src/domain/repositories/` (interfaces) e `src/infrastructure/repositories/` (implementações) | Isola o acesso a dados. Trocar o armazenamento em memória por SQLite/PostgreSQL exige só uma nova implementação das interfaces. |
| **Controller** | GRASP | `src/interfaces/controllers/` | Controllers apenas recebem a requisição HTTP e delegam a um caso de uso, sem regra de negócio. |
| **Information Expert** | GRASP | `src/domain/entities/Pedido.js` | O `Pedido` calcula seu próprio total, tempo de preparo e transições de status, porque é quem tem os dados necessários. |

## Princípios SOLID

- **S (Single Responsibility):** cada classe tem uma função (controller traduz HTTP, use case orquestra, entidade guarda regra, repositório persiste).
- **O (Open/Closed):** novas regras de desconto e novos observers são adicionados criando classes, sem modificar as existentes.
- **L (Liskov):** `NoDiscountStrategy` e `PercentageThresholdDiscountStrategy` são intercambiáveis onde se espera um `DiscountStrategy`.
- **I (Interface Segregation):** interfaces de repositório separadas por entidade (`IProdutoRepository`, `IPedidoRepository`).
- **D (Dependency Inversion):** use cases dependem das interfaces de repositório e da strategy, injetadas pelo construtor em `src/container.js` (Composition Root).

## Arquitetura

Clean Architecture em camadas. As dependências apontam sempre para dentro: o `domain` não conhece nenhuma outra camada.

- Diagrama de classes e diagrama de arquitetura: [`docs/DIAGRAMAS.md`](docs/DIAGRAMAS.md)

## Estrutura de pastas

```
lanchonete-api/
├── src/
│   ├── domain/                  # Regras de negócio puras (DDD)
│   │   ├── entities/            # Produto, ItemPedido, Pedido
│   │   ├── repositories/        # Interfaces (contratos) dos repositórios
│   │   ├── strategies/          # Strategy de desconto
│   │   ├── factories/           # Factory Method de ItemPedido
│   │   └── observers/           # Observer de mudança de status
│   ├── application/
│   │   └── useCases/            # Casos de uso (produto/ e pedido/)
│   ├── infrastructure/
│   │   ├── database/            # Singleton de armazenamento em memória
│   │   └── repositories/        # Implementações dos repositórios
│   ├── interfaces/
│   │   ├── controllers/         # Recebem HTTP e chamam use cases
│   │   ├── routes/              # Definição das rotas
│   │   ├── middlewares/         # validate, errorHandler, notFoundHandler
│   │   └── validators/          # Schemas Zod
│   ├── utils/                   # AppError
│   ├── container.js             # Injeção de dependência (Composition Root)
│   ├── app.js                   # Configuração do Express
│   └── server.js                # Inicialização do servidor
├── tests/__tests__/             # Testes unitários e de integração
├── docs/                        # Diagramas UML
├── swagger.json                 # Documentação OpenAPI
├── jest.config.js
├── eslint.config.js
├── .prettierrc
└── package.json
```

## Como rodar

Pré-requisito: Node.js 18 ou superior.

```bash
git clone <<link do repositório>>
cd lanchonete-api
npm install
npm start
```

A API sobe em `http://localhost:3000`. Para desenvolvimento com reinício automático: `npm run dev`.

> Os dados ficam em memória, então são reiniciados sempre que o servidor reinicia.

## Documentação Swagger

Com a API rodando: **http://localhost:3000/api-docs**

### Endpoints

| Método | Rota | Descrição |
|---|---|---|
| POST | `/produtos` | Cria produto |
| GET | `/produtos` | Lista produtos |
| GET | `/produtos/:id` | Busca produto |
| PUT | `/produtos/:id` | Atualiza produto (parcial) |
| DELETE | `/produtos/:id` | Remove produto |
| POST | `/pedidos` | Cria pedido |
| GET | `/pedidos` | Lista pedidos (filtro opcional `?status=`) |
| GET | `/pedidos/:id` | Busca pedido |
| PATCH | `/pedidos/:id/status` | Avança o status do pedido |

## Como rodar os testes

```bash
npm test                 # roda todos os testes
npm run test:coverage    # roda com relatório de cobertura
```

Resultado atual: **30 testes passando** e cobertura de linhas de aproximadamente **85%** (mínimo exigido: 40%).

Os testes de use cases usam **mocks** (`jest.fn()`) dos repositórios para isolar a regra de negócio.

### Funcionalidade desenvolvida com TDD

<<ESCREVAM AQUI SOMENTE DEPOIS DE FAZER A PARTE E DA ETAPA 10>>
**Filtro de pedidos por status** (`GET /pedidos?status=...`), desenvolvido no ciclo vermelho → verde → refatoração. O histórico de commits da branch `feature/tdd-filtro-status` mostra cada fase:
1. `test:` testes escritos antes da implementação (falhando)
2. `feat:` implementação mínima para passar
3. `refactor:` integração com o controller

Arquivo de teste: `tests/__tests__/ListarPedidosUseCase.test.js`

## Fluxo de trabalho em equipe

Repositório único, com uma branch por funcionalidade (`feature/...`) e integração na `main` via Pull Request. Commits distribuídos entre os dois integrantes.