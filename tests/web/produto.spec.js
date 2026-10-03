const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../../pages/LoginPage');
const { CadastroProdutoPage } = require('../../pages/CadastroProdutoPage');
const { usuarioUnico, produtoUnico } = require('../../helpers/data');
const { criarUsuarioOk } = require('../../helpers/api');

test.describe('Web - Fluxo pós-login: cadastro de produto pelo administrador', () => {
  test('admin cadastra produto e o vê na listagem', async ({ page, request }) => {
    const admin = await criarUsuarioOk(request, usuarioUnico({ administrador: true }));
    const produto = produtoUnico();

    const login = new LoginPage(page);
    await login.abrir();
    await login.logar(admin.email, admin.password);
    await expect(page).toHaveURL(/\/admin\/home/);

    const cadastro = new CadastroProdutoPage(page);
    await cadastro.abrir();
    await cadastro.cadastrar(produto);

    await expect(page).toHaveURL(/\/admin\/listarprodutos/);
    await expect(page.getByText(produto.nome)).toBeVisible();
  });
});
