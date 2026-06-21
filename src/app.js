const express = require('express');
const app = express();

const autenticacaoController = require('./controllers/autenticacaoController');
const pedidoController = require('./controllers/pedidoController');

app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).json({
    message: 'OK',
    status: 'online',
    timestamp: new Date().toISOString(),
  });
});

app.post('/registrar', autenticacaoController.registrar);
app.post('/login', autenticacaoController.login);
app.post('/pedidos', pedidoController.criar);
app.post('/pagamento', pedidoController.pagar);

module.exports = app;
