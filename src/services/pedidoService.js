const { bancoDeDados } = require('../data/bancoMock');

function criarPedido(usuarioId, produtoId) {
  const produto = bancoDeDados.produtos.find(p => p.id === produtoId);

  if (!produto) {
    throw new Error('Produto não encontrado.');
  }

  if (produto.estoque <= 0) {
    throw new Error('Estoque insuficiente para realizar o pedido');
  }

  // Simula diminuição de estoque
  produto.estoque -= 1;

  const novoPedido = {
    id: bancoDeDados.pedidos.length + 1,
    usuarioId,
    produtoId,
    status: 'criado'
  };

  bancoDeDados.pedidos.push(novoPedido);

  return { status: novoPedido.status, id: novoPedido.id };
}

function processarPagamento(pedidoId, dadosPagamento) {
  const pedido = bancoDeDados.pedidos.find(p => p.id === pedidoId);

  if (!pedido) {
    throw new Error('Pedido não encontrado.');
  }

  // Se o cartão finaliza com '0000', recusar. Caso contrário, aprovar.
  if (dadosPagamento.cartao && dadosPagamento.cartao.endsWith('0000')) {
    throw new Error('Pagamento recusado pelo gateway.');
  }

  pedido.status = 'aprovado';

  return { status: pedido.status, mensagem: 'Pagamento aprovado com sucesso' };
}

module.exports = {
  criarPedido,
  processarPagamento
};
