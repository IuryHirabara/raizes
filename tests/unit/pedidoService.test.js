const pedidoService = require('../../src/services/pedidoService');
const { bancoDeDados, limparBanco } = require('../../src/data/bancoMock');

describe('PedidoService (Unitário)', () => {
  beforeEach(() => {
    limparBanco();
    // banco de dados já vem com Produto 1 (estoque 10) e Produto 2 (estoque 0)
  });

  describe('criarPedido', () => {
    it('CT01: Criação de pedido com dados válidos e estoque disponível. Retorna status "criado" e ID do pedido.', () => {
      const resultado = pedidoService.criarPedido(1, 1);
      
      expect(resultado).toHaveProperty('id');
      expect(resultado.status).toBe('criado');
      
      const pedidoBanco = bancoDeDados.pedidos.find(p => p.id === resultado.id);
      expect(pedidoBanco).toBeDefined();
      expect(pedidoBanco.status).toBe('criado');
      
      const produto = bancoDeDados.produtos.find(p => p.id === 1);
      expect(produto.estoque).toBe(9); // Diminuiu 1
    });

    it('CT02: Criação de pedido sem estoque. Deve retornar a mensagem exata: "Estoque insuficiente para realizar o pedido".', () => {
      expect(() => {
        pedidoService.criarPedido(1, 2); // Produto 2 tem estoque 0
      }).toThrow('Estoque insuficiente para realizar o pedido');
    });
  });

  describe('processarPagamento', () => {
    beforeEach(() => {
      // Cria um pedido para testar pagamento
      pedidoService.criarPedido(1, 1); // ID será 1
    });

    it('CT06: Pagamento aprovado via gateway. Atualiza status do pedido para "aprovado".', () => {
      const resultado = pedidoService.processarPagamento(1, { cartao: '1234567812345678' }); // Final diferente de 0000
      
      expect(resultado.status).toBe('aprovado');
      
      const pedidoBanco = bancoDeDados.pedidos.find(p => p.id === 1);
      expect(pedidoBanco.status).toBe('aprovado'); // CT10 e CT06
    });

    it('CT10: Atualização do status do pedido após retorno do gateway indicando sucesso. O status do pedido muda para "aprovado".', () => {
      pedidoService.processarPagamento(1, { cartao: '1111222233334444' });
      const pedidoBanco = bancoDeDados.pedidos.find(p => p.id === 1);
      
      // CT06 e CT10
      expect(pedidoBanco.status).toBe('aprovado');
    });

    it('CT07: Pagamento rejeitado pelo gateway. Deve retornar a mensagem: "Pagamento recusado pelo gateway.".', () => {
      expect(() => {
        pedidoService.processarPagamento(1, { cartao: '123456780000' }); // Final 0000 recusa
      }).toThrow('Pagamento recusado pelo gateway.');
      
      const pedidoBanco = bancoDeDados.pedidos.find(p => p.id === 1);
      expect(pedidoBanco.status).toBe('criado');
    });
  });
});
