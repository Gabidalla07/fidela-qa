const { test, expect } = require('@playwright/test');
const Ajv = require('ajv');
const { usuarioUnico } = require('../../helpers/data');
const { API_URL, criarUsuarioOk, fazerLogin } = require('../../helpers/api');
const { usuarioSchema, loginSchema } = require('../../helpers/schemas');

const ajv = new Ajv({ allErrors: true });

function validar(schema, corpo) {
  const valido = ajv.compile(schema);
  const ok = valido(corpo);
  // Se falhar, a mensagem mostra exatamente qual campo/tipo quebrou o contrato.
  expect(ok, JSON.stringify(valido.errors, null, 2)).toBe(true);
}

test.describe('API - Contrato (campos e tipos)', () => {
  test('GET /usuarios/{id} respeita o contrato', async ({ request }) => {
    const usuario = await criarUsuarioOk(request, usuarioUnico());

    const res = await request.get(`${API_URL}/usuarios/${usuario._id}`);

    expect(res.status()).toBe(200);
    validar(usuarioSchema, await res.json());
  });

  test('POST /login respeita o contrato', async ({ request }) => {
    const usuario = await criarUsuarioOk(request, usuarioUnico());

    const res = await fazerLogin(request, usuario);

    expect(res.status()).toBe(200);
    validar(loginSchema, await res.json());
  });
});
