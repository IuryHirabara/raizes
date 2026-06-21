const request = require('supertest');
const app = require('../../src/app');
const { limparBanco } = require('../../src/data/bancoMock');

describe('Autenticação (Integração)', () => {
  beforeEach(() => {
    limparBanco();
  });

  describe('POST /registrar', () => {
    it('CT08: Cadastro de cliente com nome, email, senha (complexa) e consentimento da LGPD válidos. [RQ03]', async () => {
      const resposta = await request(app)
        .post('/registrar')
        .send({
          nome: 'Integração User',
          email: 'integ@teste.com',
          senha: 'StrongPassword@123',
          aceiteLgpd: true
        });

      expect(resposta.status).toBe(201);
      expect(resposta.body).toHaveProperty('id');
      expect(resposta.body.mensagem).toBe('Usuário registrado com sucesso');
    });

    it('CT09: Cadastro sem aceite da LGPD. Deve retornar a mensagem: "É obrigatório aceitar os termos de privacidade (LGPD).".', async () => {
      const resposta = await request(app)
        .post('/registrar')
        .send({
          nome: 'Integração User',
          email: 'integ@teste.com',
          senha: 'StrongPassword@123',
          aceiteLgpd: false
        });

      expect(resposta.status).toBe(400);
      expect(resposta.body.erro).toBe('É obrigatório aceitar os termos de privacidade (LGPD).');
    });
  });

  describe('POST /login', () => {
    beforeEach(async () => {
      await request(app)
        .post('/registrar')
        .send({
          nome: 'User Login',
          email: 'login@teste.com',
          senha: 'Login@123',
          aceiteLgpd: true
        });
    });

    it('CT03: Login com credenciais válidas. Retorna token.', async () => {
      const resposta = await request(app)
        .post('/login')
        .send({
          email: 'login@teste.com',
          senha: 'Login@123'
        });

      expect(resposta.status).toBe(200);
      expect(resposta.body).toHaveProperty('token');
    });

    it('CT04: Login com senha incorreta. Deve retornar a mensagem: "Credenciais inválidas.". [RQ04]', async () => {
      const resposta = await request(app)
        .post('/login')
        .send({
          email: 'login@teste.com',
          senha: 'SenhaErrada'
        });

      expect(resposta.status).toBe(401);
      expect(resposta.body.erro).toBe('Credenciais inválidas.');
    });

    it('CT05: Bloqueio após 5 erros. Deve retornar a mensagem: "Novas tentativas bloqueadas após múltiplas tentativas inválidas.". [RQ01, RQ07]', async () => {
      for (let i = 0; i < 5; i++) {
        await request(app).post('/login').send({ email: 'login@teste.com', senha: 'err' });
      }

      const resposta = await request(app)
        .post('/login')
        .send({
          email: 'login@teste.com',
          senha: 'Login@123' // Senha correta, mas bloqueado
        });

      expect(resposta.status).toBe(403);
      expect(resposta.body.erro).toBe('Novas tentativas bloqueadas após múltiplas tentativas inválidas.');
    });
  });
});
