// Forma Selvatica nelle regole 2024: il riposo breve restituisce UN uso, il
// lungo tutti. Nella 5.0 entrambi i riposi li restituiscono tutti.
import { test, expect } from '@playwright/test';
import { apriScheda } from './helpers.js';

async function impostaForma(page, { versione, attuali, risorse, livello = 5 }) {
  // Druido di prova (non il PG di esempio, che è una scheda 2014): lo script
  // parte prima dell'app e la risorsa sbagliata ("breve") va corretta da sola.
  await page.addInitScript(({ versione, attuali, risorse, livello }) => {
    if (sessionStorage.getItem('forma-impostata')) return;
    sessionStorage.setItem('forma-impostata', '1');
    localStorage.setItem('scheda-interattiva:v1', JSON.stringify({
      attivo: 'pg-a',
      personaggi: { 'pg-a': { nome: 'Aldric', classe: 'Druido', livello, versione, risorse: risorse || [{ id: 'auto-druido-forma-selvatica', nome: 'Forma Selvatica', attuali, max: 2, reset: 'breve' }] } },
    }));
  }, { versione, attuali, risorse, livello });
  await page.reload();
  await page.waitForTimeout(1000);
  for (let i = 0; i < 3; i++) await page.keyboard.press('Escape');
  await page.mouse.click(20, 300);
}
const forma = (page) => page.evaluate(() => {
  const st = JSON.parse(localStorage.getItem('scheda-interattiva:v1'));
  return st.personaggi[st.attivo].risorse.find((r) => r.nome === 'Forma Selvatica');
});

for (const versione of ['2014', '2024']) {
  for (const inverti of [false, true]) {
    test(`Forma Bestiale e Selvatica: un solo contatore, spese conservate (${versione}, inverti=${inverti})`, async ({ page }) => {
      await page.route('**/*.workers.dev/**', route => route.abort());
      await apriScheda(page);
      const doppioni = [
        { id: 'vecchia-forma', nome: 'Forma Bestiale', max: 4, attuali: 4, reset: 'breve' },
        { id: 'auto-druido-forma-selvatica', nome: 'Forma Selvatica', max: 2, attuali: 1, reset: 'breve' },
      ];
      const personale = { id: 'personale', nome: 'Forma Bestiale potenziata', max: 5, attuali: 3, reset: 'manuale' };
      await impostaForma(page, { versione, livello: 10, risorse: [...(inverti ? doppioni.reverse() : doppioni), personale] });
      const verifica = async () => page.evaluate(() => {
        const st = JSON.parse(localStorage.getItem('scheda-interattiva:v1'));
        return st.personaggi[st.attivo].risorse;
      });
      await expect.poll(async () => (await verifica()).filter(r => r.nome === 'Forma Selvatica').length).toBe(1);
      const risorse = await verifica();
      expect(risorse.some(r => r.nome === 'Forma Bestiale')).toBe(false);
      expect(risorse.find(r => r.nome === 'Forma Selvatica')).toMatchObject({ max: versione === '2014' ? 2 : 3, attuali: versione === '2014' ? 1 : 2, reset: versione === '2014' ? 'breve' : 'breve-uno' });
      expect(risorse.find(r => r.id === 'personale')).toEqual(personale);
      await page.reload();
      await expect.poll(verifica).toEqual(risorse);
    });
  }
}

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
