# Teste técnico QA Fidela — Parte C (Automação)

Automação de testes Web e API sobre o ServeRest, utilizando Playwright com JavaScript.

## Instalação

### Requisitos

- Node.js 18+
- Git

### Instalar dependências

```bash
npm install
npx playwright install chromium
```

Caso o download do navegador falhe em uma rede corporativa, pode ser utilizado o Google Chrome instalado na máquina.

No Windows PowerShell:

```powershell
$env:PW_CHANNEL="chrome"; npm test
```

## Execução

Toda a suíte de testes pode ser executada com um único comando:

```bash
npm test
```

Também estão disponíveis comandos específicos:

```bash
npm run test:api
npm run test:web
npm run test:headed
npm run report
```

### Comandos

- `npm test` — executa toda a suíte de testes.
- `npm run test:api` — executa somente os testes de API.
- `npm run test:web` — executa somente os testes Web.
- `npm run test:headed` — executa os testes Web com o navegador visível.
- `npm run report` — abre o relatório HTML do Playwright.

## O que está coberto

### C1 — Web

Localização: `tests/web/`

Os seguintes cenários foram automatizados:

- Login com sucesso.
- Login com senha inválida.
- Validação de campo obrigatório vazio.
- Fluxo funcional após o login: acesso à Lista de Compras.

O fluxo de Lista de Compras foi escolhido por representar uma funcionalidade disponível ao usuário autenticado no frontend online e por permitir validar uma jornada funcional além da autenticação.

Os dados do usuário utilizado no teste Web são criados pela API antes da abertura do navegador, evitando dependência de dados previamente existentes no ambiente.

### C2 — API

Localização: `tests/api/`

Foram automatizados:

- Cadastro de usuário com sucesso.
- Cadastro de usuário com e-mail já cadastrado.
- Login com sucesso, verificando o token retornado.
- Login com credenciais inválidas.
- Cadastro de produto sem token.
- Cadastro de produto com token de usuário comum.
- Cadastro de produto com token de administrador.
- Validação de contrato da resposta de cadastro de usuário utilizando JSON Schema com Ajv, verificando campos obrigatórios e seus tipos.

Os testes utilizam dados gerados durante a execução, incluindo e-mails únicos e nomes de produtos únicos, evitando dependência de dados previamente cadastrados.

## C3 — Estratégia de automação

A estratégia de automação está documentada em:

`docs/C3-estrategia-automacao.md`

De forma geral, a priorização considera:

- frequência de execução;
- repetitividade;
- criticidade para o negócio;
- estabilidade da funcionalidade;
- participação na regressão;
- custo e benefício da automação.

Cenários exploratórios, avaliações de usabilidade e funcionalidades instáveis permanecem preferencialmente manuais.

A automação deve gerar valor por reduzir esforço repetitivo, aumentar a frequência da regressão e permitir identificação rápida de falhas.

## Decisões técnicas

### Playwright

Foi utilizado Playwright para os testes Web e API, permitindo manter uma única ferramenta e uma única suíte de execução.

Os projetos `api` e `web` são separados na configuração do Playwright.

### Dados de teste

Os dados são gerados a cada execução.

Os usuários possuem e-mails únicos e os produtos possuem nomes únicos, evitando dependência de dados existentes no ambiente compartilhado do ServeRest.

Não são utilizadas credenciais reais no código.

### Preparação dos testes Web

Quando necessário, os dados utilizados pelo teste Web são preparados pela API antes da abertura do navegador.

Essa abordagem reduz o tempo de preparação e deixa o teste mais independente de dados previamente cadastrados.

### Page Objects

O fluxo de login utiliza o Page Object `LoginPage`, mantendo seletores e comportamentos da tela centralizados na pasta `pages/`.

Há também um Page Object preparado para cadastro de produtos.

Essa organização facilita a manutenção dos testes caso os elementos da interface sejam alterados.

### Seletores

Foram priorizados:

- `data-testid`, quando disponível;
- `getByRole` e nomes acessíveis, quando apropriado.

A intenção é evitar seletores frágeis baseados em CSS ou XPath sempre que possível.

### Fluxo pós-login

A Lista de Compras foi escolhida como fluxo funcional após o login por representar uma funcionalidade disponível ao usuário autenticado no frontend online e por permitir validar uma jornada funcional além da autenticação.

## Estrutura do projeto

```text
.github/
  workflows/

docs/
  C3-estrategia-automacao.md

helpers/
  api.js
  data.js
  schemas.js

pages/
  LoginPage.js
  CadastroProdutoPage.js

reporters/
  resumo-reporter.js

reports/
  ULTIMA-EXECUCAO.md

tests/
  api/
    usuarios.spec.js
    login.spec.js
    produtos.spec.js
    contrato.spec.js

  web/
    login.spec.js
    compra.spec.js
    produto.spec.js

.gitignore
package.json
playwright.config.js
README.md
```

## Relatórios

A última execução da suíte é registrada em:

`reports/ULTIMA-EXECUCAO.md`

O relatório contém a data e o horário da execução e o resultado dos testes.

O Playwright também gera o relatório HTML detalhado da execução.

## CI

O projeto possui configuração de GitHub Actions para execução automatizada da suíte.

A execução utiliza Node.js, instala as dependências e os navegadores do Playwright e executa os testes.

Os relatórios podem ser disponibilizados como artefatos da execução.

## Ambiente utilizado

Frontend:

https://front.serverest.dev

API:

https://serverest.dev

O frontend utilizado nos testes é o ambiente online do ServeRest e utiliza a API online correspondente.

A execução local do ServeRest não é utilizada para os testes Web.

Os testes geram seus próprios dados durante a execução, considerando que o ambiente online é compartilhado e pode ter seus dados removidos periodicamente.

## Observações

Nenhuma credencial real é utilizada no projeto.

Os testes foram desenvolvidos para serem executados de forma independente e evitar dependência de dados previamente existentes no ambiente.