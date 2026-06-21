const autenticacaoService = require('../services/autenticacaoService');

function registrar(req, res) {
  try {
    const usuario = autenticacaoService.registrar(req.body);
    res.status(201).json({ mensagem: 'Usuário registrado com sucesso', id: usuario.id });
  } catch (erro) {
    res.status(400).json({ erro: erro.message });
  }
}

function login(req, res) {
  try {
    const { email, senha } = req.body;
    const resultado = autenticacaoService.login(email, senha);
    res.status(200).json(resultado);
  } catch (erro) {
    if (erro.message === 'Novas tentativas bloqueadas após múltiplas tentativas inválidas.') {
      res.status(403).json({ erro: erro.message });
    } else {
      res.status(401).json({ erro: erro.message });
    }
  }
}

module.exports = {
  registrar,
  login
};
