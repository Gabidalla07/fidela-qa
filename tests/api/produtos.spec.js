const { test, expect } = require('@playwright/test');

const {
  usuarioUnico,
  produtoUnico
} = require('../../helpers/data');

const {
  criarUsuarioOk,
  obterToken,
  cadastrarProduto
} = require('../../helpers/api');

test.describe('C2.3 - Cadastro de produto', () => {

  test('Não deve cadastrar produto sem token', async ({ request }) => {
    const produto = produtoUnico();

    const response = await cadastrarProduto(
      request,
      produto
    );

    expect(response.status()).toBe(401);

    const body = await response.json();

    expect(body.message).toBe(
      'Token de acesso ausente, inválido, expirado ou usuário do token não existe mais'
    );
  });

  test('Não deve cadastrar produto com token de usuário comum', async ({ request }) => {
    const usuario = usuarioUnico({
      administrador: false
    });

    const usuarioCriado = await criarUsuarioOk(
      request,
      usuario
    );

    const token = await obterToken(request, {
      email: usuarioCriado.email,
      password: usuarioCriado.password
    });

    const produto = produtoUnico();

    const response = await cadastrarProduto(
      request,
      produto,
      token
    );

    expect(response.status()).toBe(403);

    const body = await response.json();

    expect(body.message).toBe(
      'Rota exclusiva para administradores'
    );
  });

  test('Deve cadastrar produto com token de administrador', async ({ request }) => {
    const usuario = usuarioUnico({
      administrador: true
    });

    const usuarioCriado = await criarUsuarioOk(
      request,
      usuario
    );

    const token = await obterToken(request, {
      email: usuarioCriado.email,
      password: usuarioCriado.password
    });

    const produto = produtoUnico();

    const response = await cadastrarProduto(
      request,
      produto,
      token
    );

    expect(response.status()).toBe(201);

    const body = await response.json();

    expect(body.message).toBe(
      'Cadastro realizado com sucesso'
    );

    expect(body._id).toBeTruthy();
  });

});