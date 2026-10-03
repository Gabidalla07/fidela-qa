const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../../pages/LoginPage');
const { usuarioUnico } = require('../../helpers/data');
const { criarUsuarioOk } = require('../../helpers/api');

test.describe('Web - Fluxo após login', () => {

  test('login e acesso à lista de compras', async ({ page, request }) => {

    // 1. Criar usuário comum via API
    const usuario = await criarUsuarioOk(
      request,
      usuarioUnico()
    );

    // 2. Login pela interface
    const login = new LoginPage(page);

    await login.abrir();
    await login.logar(usuario.email, usuario.password);

    await expect(page).toHaveURL(/\/home/);

    // 3. Acessar Lista de Compras
    await page.getByTestId('lista-de-compras').click();

    // 4. Validar a tela
    await expect(
      page.getByRole('heading', { name: 'Lista de Compras' })
    ).toBeVisible();
  });

});