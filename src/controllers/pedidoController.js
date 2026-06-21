const pedidoService = require('../services/pedidoService');

function criar(req, res) {
  try {
    const { usuarioId, produtoId } = req.body;
    const resultado = pedidoService.criarPedido(usuarioId, produtoId);
    res.status(201).json(resultado);
  } catch (erro) {
    res.status(400).json({ erro: erro.message });
  }
}

function pagar(req, res) {
  try {
    const { pedidoId, dadosPagamento } = req.body;
    const resultado = pedidoService.processarPagamento(pedidoId, dadosPagamento);
    res.status(200).json(resultado);
  } catch (erro) {
    res.status(400).json({ erro: erro.message });
  }
}

module.exports = {
  criar,
  pagar
};
