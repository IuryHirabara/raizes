const { bancoDeDados } = require('../data/bancoMock');
const { mockHash, compararSenhas, validarForcaSenha } = require('../utils/seguranca');

function registrar(dadosUsuario) {
  const { nome, email, senha, aceiteLgpd } = dadosUsuario;

  if (!aceiteLgpd) {
    throw new Error('É obrigatório aceitar os termos de privacidade (LGPD).');
  }

  if (!validarForcaSenha(senha)) {
    throw new Error('A senha deve conter caracteres especiais, minúsculas, maiúsculas e números.');
  }

  const usuarioExistente = bancoDeDados.usuarios.find(u => u.email === email);
  if (usuarioExistente) {
    throw new Error('Usuário já cadastrado.');
  }

  const novoUsuario = {
    id: bancoDeDados.usuarios.length + 1,
    nome,
    email,
    senhaHash: mockHash(senha),
    aceiteLgpd
  };

  bancoDeDados.usuarios.push(novoUsuario);
  return novoUsuario;
}

function login(email, senha) {
  const tentativasFalhas = bancoDeDados.tentativasLogin[email] || 0;

  if (tentativasFalhas >= 5) {
    throw new Error('Novas tentativas bloqueadas após múltiplas tentativas inválidas.');
  }

  const usuario = bancoDeDados.usuarios.find(u => u.email === email);
  
  if (!usuario || !compararSenhas(senha, usuario.senhaHash)) {
    // Registra falha de login (RQ04)
    bancoDeDados.tentativasLogin[email] = tentativasFalhas + 1;
    // console.log(`Tentativa de login falha registrada: ${email}. Total: ${tentativasFalhas + 1}`);
    throw new Error('Credenciais inválidas.');
  }

  // Sucesso no login, reseta tentativas
  bancoDeDados.tentativasLogin[email] = 0;
  
  // Retorna um token mockado (CT03)
  return { token: `mock-token-jwt-${usuario.id}` };
}

module.exports = {
  registrar,
  login
};
