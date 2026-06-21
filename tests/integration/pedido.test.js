const request = require('supertest');
const app = require('../../src/app');
const { limparBanco } = require('../../src/data/bancoMock');

describe('Pedidos (Integração)', () => {
  beforeEach(() => {
    limparBanco();
  });

  describe('POST /pedidos', () => {
    it('CT01: Criação de pedido com dados válidos. Retorna status "criado" e ID do pedido.', async () => {
      const resposta = await request(app)
        .post('/pedidos')
        .send({
          usuarioId: 1,
          produtoId: 1 // Produto com estoque inicial 10
        });

      expect(resposta.status).toBe(201);
      expect(resposta.body).toHaveProperty('id');
      expect(resposta.body.status).toBe('criado');
    });

    it('CT02: Criação de pedido sem estoque. Deve retornar a mensagem: "Estoque insuficiente para realizar o pedido".', async () => {
      const resposta = await request(app)
        .post('/pedidos')
        .send({
          usuarioId: 1,
          produtoId: 2 // Produto com estoque 0
        });

      expect(resposta.status).toBe(400);
      expect(resposta.body.erro).toBe('Estoque insuficiente para realizar o pedido');
    });
  });

  describe('POST /pagamento', () => {
    let pedidoId;

    beforeEach(async () => {
      const res = await request(app).post('/pedidos').send({ usuarioId: 1, produtoId: 1 });
      pedidoId = res.body.id;
    });

    it('CT06 e CT10: Pagamento aprovado via gateway. Atualiza status do pedido para "aprovado".', async () => {
      const resposta = await request(app)
        .post('/pagamento')
        .send({
          pedidoId: pedidoId,
          dadosPagamento: { cartao: '1234123412341234' }
        });

      expect(resposta.status).toBe(200);
      expect(resposta.body.status).toBe('aprovado');
    });

    it('CT07: Pagamento rejeitado pelo gateway. Deve retornar a mensagem: "Pagamento recusado pelo gateway.".', async () => {
      const resposta = await request(app)
        .post('/pagamento')
        .send({
          pedidoId: pedidoId,
          dadosPagamento: { cartao: '1234123412340000' } // Termina com 0000 = recusa
        });

      expect(resposta.status).toBe(400);
      expect(resposta.body.erro).toBe('Pagamento recusado pelo gateway.');
    });
  });
});
