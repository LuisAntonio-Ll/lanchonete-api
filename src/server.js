const createApp = require('./app');

const PORT = process.env.PORT || 3000;
const app = createApp();

app.listen(PORT, () => {
  console.log(`API da Lanchonete rodando em http://localhost:${PORT}`);
  console.log(`Documentação Swagger em http://localhost:${PORT}/api-docs`);
});