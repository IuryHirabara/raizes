# Raízes do Nordeste

Sistema fictício integrado para a rede de franquias Raízes do Nordeste.

## Tecnologias Utilizadas

- Node.js
- Express.js
- Jest
- Supertest
- ESLint
- Prettier
- SonarQube
- Autocannon

## Pré-requisitos

Certifique-se de ter instalado em sua máquina:

- Node.js
- npm

## Instalação

1. Clone o repositório para sua máquina local.
2. Acesse o diretório do projeto e instale as dependências:

```bash
npm install
```

## Executando o Projeto

O projeto possui um comando configurado com **Nodemon** para facilitar a execução:

```bash
npm run dev
```

## Execução dos Testes

Este projeto inclui testes automatizados divididos em unitários, integração e de performance (localizados no diretório `tests/`).

Utilize os comandos abaixo para gerenciar a execução dos testes:

- **Executar os testes gerando somente o relatório de coverage no terminal:**

  ```bash
  npm test
  ```

- **Executar os testes com relatório de cobertura (Coverage):**
  Este comando irá gerar um relatório sobre as partes do código cobertas pelos testes. O resultado será exibido no terminal e exportado para o diretório `coverage/`.

  ```bash
  npm run test:coverage
  ```

- **Executar os testes de performance/carga:**
  Executa um teste de carga para avaliar a capacidade de resposta da aplicação (Somente Login).
  ```bash
  npm run test:perf
  ```

## Ferramentas de Qualidade de Código

Para garantir a padronização e evitar erros comuns, você pode usar os seguintes comandos:

- **Verificar problemas de Linting:**

  ```bash
  npm run lint
  ```

- **Formatar o código automaticamente:**
  ```bash
  npm run format
  ```
