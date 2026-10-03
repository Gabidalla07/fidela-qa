const { test, expect } = require('@playwright/test');
const { usuarioUnico } = require('../../helpers/data');
const { criarUsuarioOk } = require('../../helpers/api');

test.describe('API - Login', () => {

  test('login com sucesso retorna token', async ({ request }) => {
    const usuario = await criarUsuarioOk(
      request,
      usuarioUnico()
    );

    const response = await request.post('/login', {
      data: {
        email: usuario.email,
        password: usuario.password,
      },
    });

    expect(response.status()).toBe(200);

    const body = await response.json();

    expect(body).toHaveProperty('authorization');
    expect(typeof body.authorization).toBe('string');
    expect(body.authorization.length).toBeGreaterThan(0);
  });

  test('login com credenciais inválidas', async ({ request }) => {
    const usuario = usuarioUnico();

    const response = await request.post('/login', {
      data: {
        email: usuario.email,
        password: usuario.password,
      },
    });

    expect(response.status()).toBe(401);

    const body = await response.json();

    expect(body).toHaveProperty('message');
    expect(typeof body.message).toBe('string');
  });

});