function mockHash(senha) {
  return Buffer.from(`salt-${senha}`).toString('base64');
}

function compararSenhas(senhaTextoPlano, senhaHash) {
  return mockHash(senhaTextoPlano) === senhaHash;
}

function validarForcaSenha(senha) {
  const regexMaiuscula = /[A-Z]/;
  const regexMinuscula = /[a-z]/;
  const regexNumero = /[0-9]/;
  const regexEspecial = /[^A-Za-z0-9]/;

  return (
    regexMaiuscula.test(senha) &&
    regexMinuscula.test(senha) &&
    regexNumero.test(senha) &&
    regexEspecial.test(senha)
  );
}

module.exports = {
  mockHash,
  compararSenhas,
  validarForcaSenha
};
