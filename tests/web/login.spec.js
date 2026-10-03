const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../../pages/LoginPage');
const { usuarioUnico } = require('../../helpers/data');
const { criarUsuarioOk } = require('../../helpers/api');

test.describe('Web - Login', () => {
  test('login com sucesso', async ({ page, request }) => {
    // Dado criado pela API antes do teste (mais rápido e estável que cadastrar pela tela).
    const usuario = await criarUsuarioOk(request, usuarioUnico());
    const login = new LoginPage(page);

    await login.abrir();
    await login.logar(usuario.email, usuario.password);

    await expect(page).toHaveURL(/\/home/);
    await expect(page.getByTestId('logout')).toBeVisible();
  });

  test('login com senha inválida mostra erro e permanece na tela', async ({ page, request }) => {
    const usuario = await criarUsuarioOk(request, usuarioUnico());
    const login = new LoginPage(page);

    await login.abrir();
    await login.logar(usuario.email, 'senha-errada');

    await expect(page.getByText('Email e/ou senha inválidos')).toBeVisible();
    await expect(page).toHaveURL(/\/login/);
  });

  test('login sem e-mail exige o campo obrigatório', async ({ page }) => {
    const login = new LoginPage(page);

    await login.abrir();
    await login.logar('', 'qualquer-senha');

    await expect(page.getByText(/Email é obrigatório/i)).toBeVisible();
    await expect(page).toHaveURL(/\/login/);
  });

  test('login sem senha exige o campo obrigatório', async ({ page }) => {
    const login = new LoginPage(page);

    await login.abrir();
    await login.logar('alguem@teste.com', '');

    await expect(page.getByText(/Password é obrigatório/i)).toBeVisible();
    await expect(page).toHaveURL(/\/login/);
  });
});
