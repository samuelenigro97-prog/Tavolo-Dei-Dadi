// Forma Selvatica nelle regole 2024: il riposo breve restituisce UN uso, il
// lungo tutti. Nella 5.0 entrambi i riposi li restituiscono tutti.
import { test, expect } from '@playwright/test';
import { apriScheda } from './helpers.js';

async function impostaForma(page, { versione, attuali }) {
  // Druido di prova (non il PG di esempio, che è una scheda 2014): lo script
  // parte prima dell'app e la risorsa sbagliata ("breve") va corretta da sola.
  await page.addInitScript(({ versione, attuali }) => {
    if (sessionStorage.getItem('forma-impostata')) return;
    sessionStorage.setItem('forma-impostata', '1');
    localStorage.setItem('scheda-interattiva:v1', JSON.stringify({
      attivo: 'pg-a',
      personaggi: { 'pg-a': { nome: 'Aldric', classe: 'Druido', livello: 5, versione, risorse: [{ id: 'auto-druido-forma-selvatica', nome: 'Forma Selvatica', attuali, max: 2, reset: 'breve' }] } },
    }));
  }, { versione, attuali });
  await page.reload();
  await page.waitForTimeout(1000);
  for (let i = 0; i < 3; i++) await page.keyboard.press('Escape');
  await page.mouse.click(20, 300);
}
const forma = (page) => page.evaluate(() => {
  const st = JSON.parse(localStorage.getItem('scheda-interattiva:v1'));
  return st.personaggi[st.attivo].risorse.find((r) => r.nome === 'Forma Selvatica');
});

test('regole 2024: la risorsa si ricarica "1 a riposo breve, tutti a lungo" e il riposo breve ne rende uno', async ({ page }) => {
  await apriScheda(page);
  await impostaForma(page, { versione: '2024', attuali: 0 });
  await expect.poll(async () => (await forma(page))?.reset).toBe('breve-uno');
  await expect(page.getByText('↻ 1 a riposo breve, tutti a lungo').first()).toBeVisible();
  await page.getByRole('button', { name: 'Breve', exact: true }).first().click();
  await page.getByRole('button', { name: /Conferma Riposo Breve/ }).click();
  await expect.poll(async () => (await forma(page))?.attuali).toBe(1);
});

test('regole 2014: il riposo breve restituisce tutti gli usi', async ({ page }) => {
  await apriScheda(page);
  await impostaForma(page, { versione: '2014', attuali: 0 });
  await expect.poll(async () => (await forma(page))?.reset).toBe('breve');
  await page.getByRole('button', { name: 'Breve', exact: true }).first().click();
  await page.getByRole('button', { name: /Conferma Riposo Breve/ }).click();
  await expect.poll(async () => (await forma(page))?.attuali).toBe(2);
});
