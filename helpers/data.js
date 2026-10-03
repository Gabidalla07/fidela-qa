const { randomUUID } = require('crypto');

// Todos os dados são gerados a cada execução (e-mails únicos), sem credenciais fixas.
function usuarioUnico({ administrador = false } = {}) {
  const id = randomUUID().slice(0, 8);
  return {
    nome: `QA Teste ${id}`,
    email: `qa.${id}.${Date.now()}@teste.com`,
    password: `Pw-${randomUUID().slice(0, 12)}`,
    administrador: String(administrador),
  };
}

function produtoUnico() {
  const id = randomUUID().slice(0, 8);
  return {
    nome: `Produto QA ${id}`,
    preco: 150,
    descricao: 'Produto criado por teste automatizado',
    quantidade: 10,
  };
}

module.exports = { usuarioUnico, produtoUnico };
