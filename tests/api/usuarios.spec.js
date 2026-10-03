const { test, expect } = require('@playwright/test');
const { usuarioUnico } = require('../../helpers/data');

test.describe('API - Usuários', () => {

  test('cadastro de usuário com sucesso', async ({ request }) => {
    const usuario = usuarioUnico();

    const response = await request.post('/usuarios', {
      data: usuario,
    });

    expect(response.status()).toBe(201);

    const body = await response.json();

    expect(body).toHaveProperty('_id');
    expect(body).toHaveProperty('message');
    expect(typeof body._id).toBe('string');
    expect(typeof body.message).toBe('string');
  });

  test('cadastro de usuário com e-mail já cadastrado', async ({ request }) => {
    const usuario = usuarioUnico();

    // Primeiro cadastro
    const primeiroCadastro = await request.post('/usuarios', {
      data: usuario,
    });

    expect(primeiroCadastro.status()).toBe(201);

    // Segundo cadastro com o mesmo e-mail
    const segundoCadastro = await request.post('/usuarios', {
      data: usuario,
    });

    expect(segundoCadastro.status()).toBe(400);

    const body = await segundoCadastro.json();

    expect(body).toHaveProperty('message');
    expect(typeof body.message).toBe('string');
  });

});