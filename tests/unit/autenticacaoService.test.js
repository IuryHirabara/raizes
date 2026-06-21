const autenticacaoService = require('../../src/services/autenticacaoService');
const { bancoDeDados, limparBanco } = require('../../src/data/bancoMock');

describe('AutenticacaoService (Unitário)', () => {
  beforeEach(() => {
    limparBanco();
  });

  describe('registrar', () => {
    it('CT08: Cadastro de cliente com nome, email, senha e consentimento da LGPD válidos. [RQ03, RQ05]', () => {
      const usuario = autenticacaoService.registrar({
        nome: 'João Silva',
        email: 'joao@teste.com',
        senha: 'Password@123',
        aceiteLgpd: true
      });

      expect(usuario).toHaveProperty('id');
      expect(usuario.nome).toBe('João Silva');
      expect(usuario.senhaHash).toBeDefined(); // RQ05
      expect(usuario.senhaHash).not.toBe('Password@123');
    });

    it('CT09: Cadastro sem aceite da LGPD. Deve retornar a mensagem: "É obrigatório aceitar os termos de privacidade (LGPD).".', () => {
      expect(() => {
        autenticacaoService.registrar({
          nome: 'João Silva',
          email: 'joao@teste.com',
          senha: 'Password@123',
          aceiteLgpd: false
        });
      }).toThrow('É obrigatório aceitar os termos de privacidade (LGPD).');
    });

    it('Deve falhar se a senha não atender aos requisitos [RQ03]', () => {
      expect(() => {
        autenticacaoService.registrar({
          nome: 'João',
          email: 'joao@teste.com',
          senha: 'senhafraca',
          aceiteLgpd: true
        });
      }).toThrow('A senha deve conter caracteres especiais, minúsculas, maiúsculas e números.');
    });
  });

  describe('login', () => {
    beforeEach(() => {
      autenticacaoService.registrar({
        nome: 'Maria Silva',
        email: 'maria@teste.com',
        senha: 'Password@123',
        aceiteLgpd: true
      });
    });

    it('CT03: Login com credenciais válidas. Retorna token de autenticação.', () => {
      const resultado = autenticacaoService.login('maria@teste.com', 'Password@123');
      expect(resultado).toHaveProperty('token');
      expect(bancoDeDados.tentativasLogin['maria@teste.com']).toBe(0);
    });

    it('CT04: Login com senha incorreta. Deve retornar a mensagem: "Credenciais inválidas.". [RQ04]', () => {
      expect(() => {
        autenticacaoService.login('maria@teste.com', 'SenhaErrada123!');
      }).toThrow('Credenciais inválidas.');
      expect(bancoDeDados.tentativasLogin['maria@teste.com']).toBe(1); // RQ04 (Log)
    });

    it('CT05: Bloqueio após 5 tentativas inválidas. Deve retornar a mensagem: "Novas tentativas bloqueadas após múltiplas tentativas inválidas.". [RQ01, RQ07]', () => {
      // 5 falhas
      for (let i = 0; i < 5; i++) {
        expect(() => {
          autenticacaoService.login('maria@teste.com', 'SenhaErrada123!');
        }).toThrow('Credenciais inválidas.');
      }

      // Sexta tentativa válida, bloqueia
      expect(() => {
        autenticacaoService.login('maria@teste.com', 'Password@123');
      }).toThrow('Novas tentativas bloqueadas após múltiplas tentativas inválidas.');
    });
  });
});
