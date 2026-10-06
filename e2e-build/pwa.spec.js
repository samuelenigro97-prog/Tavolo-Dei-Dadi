// Prova sulla build di produzione: versione pubblicata, service worker e offline.
// Sono i controlli che nessun test sul server di sviluppo può fare (e che avrebbero
// segnalato per tempo i casi "vedo ancora la versione vecchia").
import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';

const versioneInSorgente = /const APP_VERSION = '([^']+)'/.exec(readFileSync('src/App.jsx', 'utf8'))?.[1];

async function chiudiIniziali(page) {
  const inizia = page.getByRole('button', { name: /^Inizia( a giocare)?$/ });
  await inizia.waitFor({ timeout: 4000 }).then(() => inizia.click()).catch(() => {});
  for (let i = 0; i < 3; i++) await page.keyboard.press('Escape');
}

test('la build mostra la versione del codice sorgente', async ({ page }) => {
  expect(versioneInSorgente).toBeTruthy();
  await page.goto('./');
  await expect(page.getByText(`v${versioneInSorgente}`).first()).toBeVisible();
});

test('version.json esiste e segue la build (serve all\'aggiornamento della PWA)', async ({ request }) => {
  const res = await request.get('./version.json');
  expect(res.ok()).toBeTruthy();
  const dati = await res.json();
  expect(String(dati.build || '')).not.toHaveLength(0);
});

test('il service worker si installa, prende il controllo e l\'app funziona offline', async ({ page, context }) => {
  await page.goto('./');
  await chiudiIniziali(page);
  // Il service worker si registra e, con skipWaiting/clientsClaim, controlla la pagina.
  await page.waitForFunction(async () => {
    const reg = await navigator.serviceWorker.getRegistration();
    return Boolean(reg?.active) && Boolean(navigator.serviceWorker.controller);
  }, null, { timeout: 20_000 });

  await context.setOffline(true);
  await page.reload();
  // Senza rete la scheda si apre lo stesso, dalla cache.
  await expect(page.getByText(`v${versioneInSorgente}`).first()).toBeVisible({ timeout: 15_000 });
  await context.setOffline(false);
});

test('nessun errore JavaScript all\'avvio della build', async ({ page }) => {
  const errori = [];
  page.on('pageerror', (e) => errori.push(e.message));
  await page.goto('./');
  await chiudiIniziali(page);
  await expect(page.getByText(`v${versioneInSorgente}`).first()).toBeVisible();
  expect(errori).toEqual([]);
});

test('versione nuova pubblicata: la pagina si ricarica da sola e non entra mai in un ciclo infinito', async ({ page }) => {
  test.setTimeout(120_000);
  await page.goto('./');
  await chiudiIniziali(page);
  await page.waitForFunction(async () => Boolean((await navigator.serviceWorker.getRegistration())?.active), null, { timeout: 20_000 });
  // Da qui in poi version.json annuncia una build diversa (che però non arriva mai):
  // l'app deve provare ad aggiornarsi, poi (dopo 3 tentativi) fermarsi.
  let caricamenti = 0;
  page.on('load', () => { caricamenti += 1; });
  await page.route('**/version.json*', (route) => route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ build: 'build-futura' }) }));
  await expect.poll(() => caricamenti, { timeout: 40_000 }).toBeGreaterThanOrEqual(1);
  await page.waitForTimeout(45_000);
  const finali = caricamenti;
  expect(finali).toBeLessThanOrEqual(3);
  await page.waitForTimeout(15_000);
  expect(caricamenti).toBe(finali);
  await expect(page.getByText(`v${versioneInSorgente}`).first()).toBeVisible();
});
