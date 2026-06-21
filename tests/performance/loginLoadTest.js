const autocannon = require('autocannon');
const app = require('../../src/app');
const { limparBanco } = require('../../src/data/bancoMock');
const autenticacaoService = require('../../src/services/autenticacaoService');

const PORT = 3001;

limparBanco();
autenticacaoService.registrar({
  nome: 'Load Test User',
  email: 'loadtest@teste.com',
  senha: 'Password@123',
  aceiteLgpd: true
});

const server = app.listen(PORT, () => {
  console.log(`Servidor de performance rodando na porta ${PORT}`);

  const instance = autocannon({
    url: `http://localhost:${PORT}/login`,
    connections: 500, // Simula 500 conexões (Logins paralelos)
    duration: 5,      // Duração de 5 segundos
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email: 'loadtest@teste.com',
      senha: 'Password@123'
    })
  }, (err, result) => {
    server.close(); // Fecha o servidor ao fim do teste
    
    if (err) {
      console.error('Erro ao executar o autocannon:', err);
      process.exit(1);
    }

    const p99Latency = result.latency.p99;
    console.log(`RQ02 e RQ06: Testes finalizados`);
    console.log(`Requisições totais: ${result.requests.total}`);
    console.log(`Latência p99: ${p99Latency} ms`);
    
    if (p99Latency > 2000) {
      console.error(`FALHA: O tempo de resposta p99 (${p99Latency}ms) ultrapassou o limite de 2000ms!`);
      process.exit(1);
    } else {
      console.log(`SUCESSO: Tempo de resposta está dentro do aceitável (< 2s) para 500 conexões.`);
      process.exit(0);
    }
  });

  // Verificação de progresso no terminal
  autocannon.track(instance, { renderProgressBar: true });
});
