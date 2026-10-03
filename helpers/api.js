const { expect } = require('@playwright/test');

// URL absoluta: assim o mesmo helper funciona nos testes de API e nos testes web
// (que usam a API para preparar dados antes de abrir o navegador).
const API_URL = process.env.API_URL || 'https://serverest.dev';

async function criarUsuario(request, usuario) {
  return request.post(`${API_URL}/usuarios`, { data: usuario });
}

async function fazerLogin(request, { email, password }) {
  return request.post(`${API_URL}/login`, { data: { email, password } });
}

// Cria o usuário e devolve o usuário com _id (falha o teste se o setup não funcionar).
async function criarUsuarioOk(request, usuario) {
  const res = await criarUsuario(request, usuario);
  expect(res.status(), 'setup: cadastro de usuário').toBe(201);
  const corpo = await res.json();
  return { ...usuario, _id: corpo._id };
}

// Faz login e devolve o token completo ("Bearer xxx").
async function obterToken(request, usuario) {
  const res = await fazerLogin(request, usuario);
  expect(res.status(), 'setup: login').toBe(200);
  return (await res.json()).authorization;
}

async function cadastrarProduto(request, produto, token) {
  const headers = token ? { Authorization: token } : {};
  return request.post(`${API_URL}/produtos`, { data: produto, headers });
}

module.exports = {
  API_URL,
  criarUsuario,
  fazerLogin,
  criarUsuarioOk,
  obterToken,
  cadastrarProduto
};