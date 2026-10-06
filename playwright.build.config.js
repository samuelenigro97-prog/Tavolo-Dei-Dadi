// Test end-to-end sulla BUILD DI PRODUZIONE (vite preview), con il service worker
// attivo: verifica ciò che il server di sviluppo non può mostrare (PWA installata,
// funzionamento offline, versione realmente pubblicata).
//   npm run test:e2e:build      → compila e prova
// In CI la build esiste già: `npx playwright test -c playwright.build.config.js`.
import { defineConfig, devices } from '@playwright/test';

const PORT = 5198;
// Stessa regola di vite.config.js: in GitHub Actions la base è /<nome del repo>/.
const nomeRepo = (process.env.GITHUB_ACTIONS && process.env.GITHUB_REPOSITORY || '').split('/')[1];
const BASE = nomeRepo ? `/${nomeRepo}/` : '/';

export default defineConfig({
  testDir: './e2e-build',
  fullyParallel: false,
  workers: 1,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  timeout: 60_000,
  globalTimeout: process.env.CI ? 6 * 60_000 : undefined,
  reporter: process.env.CI ? [['line'], ['html', { open: 'never', outputFolder: 'playwright-report-build' }]] : 'list',
  use: {
    baseURL: `http://localhost:${PORT}${BASE}`,
    serviceWorkers: 'allow',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 1000 } } },
  ],
  webServer: {
    command: `npx vite preview --port ${PORT} --strictPort`,
    url: `http://localhost:${PORT}${BASE}`,
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
  },
});
