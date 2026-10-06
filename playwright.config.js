// Config dei test end-to-end (Playwright Test). Girano contro il server di
// sviluppo Vite (non serve una build prima): npm run test:e2e.
// Vedi e2e/README.md per come sono organizzati (una sezione della scheda = un file).
import { defineConfig, devices } from '@playwright/test';

const PORT = 5199;

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  // Mai più blocchi silenziosi: un test lento fallisce da solo dopo 45 s e l'intera
  // suite si interrompe dopo 12 minuti (con report), invece di arrivare al limite
  // del job di CI (15 minuti) e venire annullata senza spiegazioni.
  timeout: 45_000,
  globalTimeout: process.env.CI ? 12 * 60_000 : undefined,
  expect: { timeout: 8_000 },
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['line'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 1400 } } },
  ],
  webServer: {
    command: `npx vite --port ${PORT} --strictPort`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
    timeout: 30000,
  },
});
