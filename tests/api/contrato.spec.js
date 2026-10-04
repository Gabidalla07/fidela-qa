const { test, expect } = require('@playwright/test');
const Ajv = require('ajv');

const { usuarioUnico } = require('../../helpers/data');
const { usuarioSchema } = require('../../helpers/schemas');

test.describe('C2.4 - Contrato da API', () => {

  test('resposta de cadastro de usuário deve respeitar o contrato', async ({ request }) => {
    const usuario = usuarioUnico();

    const response = await request.post('/usuarios', {
      data: usuario,
    });

    expect(response.status()).toBe(201);

    const body = await response.json();

    const ajv = new Ajv();
    const validar = ajv.compile(usuarioSchema);
    const valido = validar(body);

    expect(
      valido,
      `Contrato inválido: ${ajv.errorsText(validar.errors)}`
    ).toBe(true);
  });

});