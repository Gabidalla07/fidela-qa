const { expect } = require('@playwright/test');

// PNG 1x1 válido, usado só para preencher o campo de imagem do formulário.
const PNG_1X1 = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
  'base64'
);

class CadastroProdutoPage {
  constructor(page) {
    this.page = page;
    this.nome = page.getByTestId('nome');
    this.preco = page.getByTestId('preco');
    this.descricao = page.getByTestId('descricao');
    this.quantidade = page.getByTestId('quantity');
    this.imagem = page.getByTestId('imagem');
    this.botaoCadastrar = page.getByRole('button', { name: 'Cadastrar', exact: true });
  }

  async abrir() {
    await this.page.goto('/admin/cadastrarprodutos');
    await expect(this.nome).toBeVisible();
  }

  async cadastrar(produto) {
    await this.nome.fill(produto.nome);
    await this.preco.fill(String(produto.preco));
    await this.descricao.fill(produto.descricao);
    await this.quantidade.fill(String(produto.quantidade));
    if (await this.imagem.count()) {
      await this.imagem.setInputFiles({ name: 'produto.png', mimeType: 'image/png', buffer: PNG_1X1 });
    }
    await this.botaoCadastrar.click();
  }
}

module.exports = { CadastroProdutoPage };
