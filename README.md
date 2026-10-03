# Teste técnico QA Fidela — Parte C (Automação)

Automação web e de API sobre o [ServeRest](https://serverest.dev), usando **Playwright (JavaScript)**.

## Instalação

Requisitos: Node.js 18+ e Git.

```bash
npm install
npx playwright install chromium
```

> Se o download do navegador falhar (rede corporativa), use o Google Chrome instalado na máquina:
> `PW_CHANNEL=chrome npm test` (Windows PowerShell: `$env:PW_CHANNEL="chrome"; npm test`).

## Execução

Toda a suíte (API + web) com **um único comando**:

```bash
npm test
```

Opcionais: `npm run test:api`, `npm run test:web`, `npm run test:headed` (navegador visível) e `npm run report` (abre o relatório HTML).

## Relatórios

- `reports/ULTIMA-EXECUCAO.md`: resumo da última execução, com **data e hora (Brasília)** e resultado de cada teste (versionado no repositório).
- `reports/html/`: relatório HTML detalhado, gerado pelo Playwright e incluído nos artefatos do GitHub Actions.

## O que está coberto

**C1 — Web** (`tests/web`): login com sucesso, login com senha inválida, login com e-mail vazio, login com senha vazia e um fluxo pós-login (admin cadastra um produto e o vê na listagem).

**C2 — API** (`tests/api`): cadastro de usuário (sucesso e e-mail duplicado), login (token Bearer e credenciais inválidas), cadastro de produto (sem token → 401, usuário comum → 403, admin → 201) e validação de contrato (campos e tipos) de `GET /usuarios/{id}` e `POST /login`.

**C3 — Estratégia:** veja [`docs/C3-estrategia-automacao.md`](docs/C3-estrategia-automacao.md).

## Decisões tomadas

- **Playwright para web e API:** uma ferramenta só, uma configuração, um relatório e um comando. Os dois ambientes ficam como *projects* separados (`api` e `web`) no `playwright.config.js`.
- **Ambiente online (`serverest.dev`):** o front online sempre usa a API online, então os dados do teste web são criados na API online. A execução local do ServeRest não foi usada.
- **Dados gerados a cada execução:** e-mail único (UUID + timestamp), senha aleatória e nome de produto único. O ambiente é compartilhado e apagado diariamente, então nenhum teste depende de dado pré-existente. **Não há credenciais reais no código.**
- **Testes web com dados criados pela API:** cadastrar o usuário via API antes de abrir o navegador deixa o teste mais rápido e estável, e cada teste fica independente dos outros (podem rodar em paralelo).
- **Page Objects** (`pages/`): seletores concentrados em um lugar; se a tela mudar, o ajuste é em um arquivo só.
- **Seletores:** `data-testid` quando existe; senão, papel e nome acessível (`getByRole`). Evitei CSS e XPath frágeis.
- **Fluxo pós-login escolhido (cadastro de produto pelo admin):** é a função de negócio principal do perfil administrador, exercita autenticação, autorização e escrita de dados, e é verificável na própria tela (produto aparece na listagem).
- **Contrato com JSON Schema (Ajv):** valida presença e tipo dos campos. Os schemas não proíbem campos extras, para não quebrar com evolução compatível da API; se o time quiser contrato mais rígido, basta adicionar `additionalProperties: false`.
- **Cada teste de API verifica status e mensagem**, não só o status, para não aceitar o erro "certo" pelo motivo errado.
- **Relatório com data/hora:** um reporter próprio (`reporters/resumo-reporter.js`) gera o resumo em Markdown a cada execução, mesmo com falhas.
- **CI (opcional):** GitHub Actions em `.github/workflows/ci.yml` roda a suíte a cada push e guarda os relatórios como artefato.

## Estrutura

```
tests/api/       testes de API (usuários, login, produtos, contrato)
tests/web/       testes web (login e fluxo do admin)
pages/           Page Objects
helpers/         dados de teste, chamadas de API, schemas
reporters/       reporter do resumo da última execução
docs/            C3 - estratégia de automação
```
