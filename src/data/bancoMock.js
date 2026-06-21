const bancoDeDados = {
  usuarios: [],
  produtos: [
    { id: 1, nome: 'Produto com Estoque', estoque: 10 },
    { id: 2, nome: 'Produto sem Estoque', estoque: 0 }
  ],
  pedidos: [],
  tentativasLogin: {}
};

function limparBanco() {
  bancoDeDados.usuarios = [];
  bancoDeDados.produtos = [
    { id: 1, nome: 'Produto com Estoque', estoque: 10 },
    { id: 2, nome: 'Produto sem Estoque', estoque: 0 }
  ];
  bancoDeDados.pedidos = [];
  bancoDeDados.tentativasLogin = {};
}

module.exports = {
  bancoDeDados,
  limparBanco
};
