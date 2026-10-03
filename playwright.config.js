// @ts-check
const { defineConfig, devices } = require('@playwright/test');

const API_URL = process.env.API_URL || 'https://serverest.dev';
const WEB_URL = process.env.WEB_URL || 'https://front.serverest.dev';
// Se o download dos navegadores falhar (rede corporativa), use: PW_CHANNEL=chrome npm test
const channel = process.env.PW_CHANNEL || undefined;

module.exports = defineConfig({
  timeout: 30_000,
  expect: { timeout: 10_000 },
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  reporter: [
    ['list'],
    ['html', { outputFolder: 'reports/html', open: 'never' }],
    ['json', { outputFile: 'reports/results.json' }],
    ['./reporters/resumo-reporter.js'],
  ],
  projects: [
    {
      name: 'api',
      testDir: './tests/api',
      use: { baseURL: API_URL },
    },
    {
      name: 'web',
      testDir: './tests/web',
      use: {
        ...devices['Desktop Chrome'],
        channel,
        // Pausa (ms) entre as ações, só para demonstrações: SLOWMO=800
        launchOptions: { slowMo: Number(process.env.SLOWMO || 0) },
        baseURL: WEB_URL,
        trace: 'retain-on-failure',
        screenshot: 'only-on-failure',
      },
    },
  ],
});