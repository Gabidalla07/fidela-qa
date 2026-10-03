const { expect } = require('@playwright/test');

class LoginPage {
  constructor(page) {
    this.page = page;
    this.email = page.getByTestId('email');
    this.senha = page.getByTestId('senha');
    this.entrar = page.getByTestId('entrar');
  }

  async abrir() {
    await this.page.goto('/login');
    await expect(this.entrar).toBeVisible();
  }

  async logar(email, senha) {
    if (email) await this.email.fill(email);
    if (senha) await this.senha.fill(senha);
    await this.entrar.click();
  }
}

module.exports = { LoginPage };
