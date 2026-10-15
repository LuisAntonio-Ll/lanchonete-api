const express = require('express');
const swaggerUi = require('swagger-ui-express');

const buildContainer = require('./container');
const produtoRoutes = require('./interfaces/routes/produtoRoutes');
const pedidoRoutes = require('./interfaces/routes/pedidoRoutes');
const errorHandler = require('./interfaces/middlewares/errorHandler');
const notFoundHandler = require('./interfaces/middlewares/notFoundHandler');
const swaggerDocument = require('../swagger.json');

function createApp() {
  const app = express();
  app.use(express.json());

  const { produtoController, pedidoController } = buildContainer();

  app.get('/', (req, res) => {
    res.json({
      mensagem: 'API da Lanchonete no ar',
      documentacao: '/api-docs',
    });
  });

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  app.use('/produtos', produtoRoutes(produtoController));
  app.use('/pedidos', pedidoRoutes(pedidoController));

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

module.exports = createApp;