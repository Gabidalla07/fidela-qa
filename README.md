# Teste técnico QA Fidela — Parte C (Automação)

Automação web e de API sobre o [ServeRest](https://serverest.dev/), usando **Playwright (JavaScript)**.

## Instalação

Requisitos:
- Node.js 18+
- Git

Instalar dependências:

```bash
npm install
npx playwright install chromium
```

> Se o download do navegador falhar por restrição de rede, é possível utilizar o Google Chrome instalado na máquina.
>
> Git Bash:
>
> ```bash
> PW_CHANNEL=chrome npm test
> ```
>
> Windows PowerShell:
>
> ```powershell
> $env:PW_CHANNEL="chrome"; npm test
> ```

## Execução

Toda a suíte (API + web) pode ser executada com um único comando:

```bash
npm test
```

Execuções específicas:

```bash
npm run test:api
```

Executa somente os testes de API.

```bash
npm run test:web
```

Executa somente os testes web.

```bash
npm run test:headed
```

Executa os testes web com o navegador visível.

```bash
npm run report
```

Abre o relatório HTML gerado pelo Playwright.

## Relatórios

A cada execução são gerados:

- `reports/ULTIMA-EXECUCAO.md`: resumo da última execução, com data e hora em Brasília e resultado dos testes.
- `reports/html/`: relatório HTML detalhado do Playwright.
- `reports/results.json`: resultado da execução em formato JSON.

O GitHub Actions também publica os relatórios como artefatos da execução de CI.

## O que está coberto

### C1 — Testes Web

Os testes web estão em `tests/web` e cobrem:

- Login com sucesso.
- Login com senha inválida.
- Login sem e-mail, validando o campo obrigatório.
- Login sem senha, validando o campo obrigatório.
- Acesso à lista de compras após o login.
- Cadastro de produto pelo administrador após o login e validação de que o produto aparece na listagem.

Os dados utilizados pelos testes são criados durante a própria execução, evitando dependência de usuários ou produtos previamente existentes no ambiente.

### C2 — Testes de API

Os testes de API estão em `tests/api` e cobrem:

- Cadastro de usuário com sucesso.
- Cadastro de usuário com e-mail duplicado.
- Login com credenciais válidas, verificando a obtenção do token Bearer.
- Login com credenciais inválidas.
- Cadastro de produto sem token.
- Cadastro de produto utilizando token de usuário comum.
- Cadastro de produto utilizando token de administrador.
- Validação de contrato da resposta de cadastro de usuário (`POST /usuarios`), verificando campos e tipos com JSON Schema + Ajv.

### C3 — Estratégia de automação

A estratégia de automação está documentada em:

[`docs/C3-estrategia-automacao.md`](https://github.com/Gabidalla07/fidela-qa/blob/main/docs/C3-estrategia-automacao.md)

O documento apresenta os critérios utilizados para decidir:

- O que deve ser automatizado primeiro.
- O que deve permanecer manual.
- Como avaliar o valor gerado pela automação.

## Decisões tomadas

### Playwright para web e API

Foi utilizado Playwright para os testes web e de API, permitindo trabalhar com uma única ferramenta, configuração e relatório.

Os dois tipos de teste foram separados como projetos no `playwright.config.js`:

- `api`
- `web`

A suíte completa pode ser executada com:

```bash
npm test
```

### Ambiente online

Os testes web utilizam o ambiente online do ServeRest:

```text
https://front.serverest.dev
```

A API utilizada é:

```text
https://serverest.dev
```

A execução local do ServeRest não foi utilizada.

### Dados independentes entre execuções

Os testes geram seus próprios dados durante a execução.

São utilizados:

- e-mails únicos para usuários;
- senhas geradas para os usuários de teste;
- nomes únicos para produtos.

Isso evita dependência de dados previamente existentes no ambiente compartilhado.

Não há credenciais reais armazenadas no código.

### Criação de dados via API

Nos testes web, os usuários necessários são criados previamente pela API antes da abertura do navegador.

Essa abordagem reduz dependências entre testes e torna a execução mais rápida e estável.

### Page Objects

Os testes web utilizam Page Objects em `pages/`.

Essa organização concentra os elementos e interações das telas em classes específicas, facilitando a manutenção caso os elementos da aplicação sejam alterados.

### Seletores

Foi dada preferência a:

1. `data-testid`, quando disponível;
2. papéis e nomes acessíveis utilizando `getByRole`.

Foram evitados seletores frágeis baseados em CSS ou XPath sempre que possível.

### Fluxos pós-login

Foram escolhidos dois fluxos pós-login:

**Lista de compras**

Valida que o usuário autenticado consegue acessar uma funcionalidade disponível após o login.

**Cadastro de produto pelo administrador**

Valida autenticação, autorização e uma operação de escrita de dados, verificando posteriormente o produto na listagem.

### Contrato da API

A validação de contrato utiliza **JSON Schema + Ajv**.

O teste verifica a estrutura esperada da resposta de cadastro de usuário, incluindo os campos e seus tipos.

Os schemas não proíbem campos adicionais, permitindo evolução compatível da API sem quebrar o teste de contrato.

### Status e mensagens

Os testes de API verificam não apenas o status HTTP, mas também informações relevantes da resposta, evitando aceitar um erro apenas porque o status retornado coincide com o esperado.

### Dados e paralelismo

Cada teste cria seus próprios dados quando necessário.

Isso reduz o acoplamento entre testes e permite que a suíte seja executada em paralelo sem depender de uma ordem específica entre os cenários.

### Relatório da última execução

Foi criado um reporter próprio em:

`reporters/resumo-reporter.js`

Ele gera:

`reports/ULTIMA-EXECUCAO.md`

O arquivo registra a data e hora da execução e o resultado de cada teste.

### CI — GitHub Actions

A suíte também possui integração com GitHub Actions em:

`.github/workflows/ci.yml`

A automação permite executar os testes a cada push e disponibilizar os relatórios da execução como artefatos.

## Estrutura do projeto

```text
tests/api/       testes de API
tests/web/       testes web
pages/           Page Objects
helpers/         dados de teste, chamadas de API e schemas
reporters/       reporter do resumo da execução
reports/         relatórios gerados
docs/            estratégia de automação C3
.github/         configuração do GitHub Actions
```

## Repositório

Repositório público:

https://github.com/Gabidalla07/fidela-qa