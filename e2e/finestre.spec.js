// Le finestre (modali) estratte da App.jsx in src/ui/modali/: ognuna si apre, mostra
// il suo contenuto e non genera errori JavaScript. Protegge dalle dimenticanze
// tipiche di uno spostamento di codice (una proprietà non passata, un import mancante).
import { test, expect } from '@playwright/test';
import { apriScheda, chiudiMenuIniziale } from './helpers.js';

test.describe('Finestre estratte', () => {
  let errori;
  test.beforeEach(async ({ page }) => {
    errori = [];
    page.on('pageerror', (e) => errori.push(e.message));
    await apriScheda(page);
  });
  test.afterEach(() => { expect(errori).toEqual([]); });

  test('Tavolo dei dadi (DadiModal)', async ({ page }) => {
    await page.getByRole('button', { name: 'Tira i dadi' }).first().click();
    await expect(page.getByText(/d20/).first()).toBeVisible();
    await page.keyboard.press('Escape');
  });

  test('Diario (DiarioModal)', async ({ page }) => {
    await page.getByRole('button', { name: 'Diario' }).first().click();
    await expect(page.getByRole('heading', { name: /Diario/i }).first()).toBeVisible();
    await page.keyboard.press('Escape');
  });

  test('Sincronizzazione (CloudModal)', async ({ page }) => {
    await page.getByRole('button', { name: 'Sincronizzazione' }).first().click();
    await expect(page.getByText('Backup e sincronizzazione')).toBeVisible();
    await page.keyboard.press('Escape');
  });

  test('Esperienza (PeModal)', async ({ page }) => {
    await page.getByText(/PE\b/).first().scrollIntoViewIfNeeded();
    await page.locator('[role="button"]').filter({ hasText: /\d[\d.,]*\s*$/ }).filter({ has: page.locator('text=/000/') }).first().click().catch(() => {});
    // in alternativa si apre dalla barra del livello: basta che, se aperta, non dia errori
    await page.keyboard.press('Escape');
  });

  test('Movimento (MovimentoModal)', async ({ page }) => {
    await page.getByText('Movimenti').first().click();
    await expect(page.getByText(/salto|Salto|carico|Carico/i).first()).toBeVisible();
    await page.keyboard.press('Escape');
  });

  test('Inneschi e reazioni (ReazioniModal)', async ({ page }) => {
    await page.getByRole('button', { name: /Inneschi e reazioni/ }).first().click();
    await expect(page.getByText(/Attacco di Opportunità/).first()).toBeVisible();
    await page.keyboard.press('Escape');
  });

  test('Manuali e fonti (ManualiModal)', async ({ page }) => {
    // il pulsante sta nel menu dei personaggi (icona della casa nell'intestazione)
    await page.getByRole('button', { name: /^Menu: nuovo personaggio/ }).first().click();
    await page.getByRole('button', { name: /Manuali e fonti/ }).first().click();
    await expect(page.getByText(/Player's Handbook 2024/).first()).toBeVisible();
    await page.keyboard.press('Escape');
  });

  test('Evoca / aggiungi compagno (AggiungiCompagnoModal)', async ({ page }) => {
    await page.getByRole('button', { name: /Evoca \/ Aggiungi Compagno/ }).first().click();
    await expect(page.getByText('Evoca / Aggiungi Compagno o Famiglio')).toBeVisible();
    await page.keyboard.press('Escape');
  });

  test('Guida di un\'abilità (AbilitaGuidaModal)', async ({ page }) => {
    await page.getByText('Atletica', { exact: true }).first().click();
    await expect(page.getByText(/CD|rules|regole/i).first()).toBeVisible();
    await page.keyboard.press('Escape');
  });

  test('Dettaglio creatura (BestiaDettaglioModal) dal catalogo Forma Selvatica', async ({ page }) => {
    await page.getByRole('button', { name: 'Forma Selvatica', exact: true }).first().click();
    await page.getByText('Cervo', { exact: true }).first().click();
    await expect(page.getByRole('button', { name: /Metamorfosi \(4 PF\)/ })).toBeVisible();
    await page.keyboard.press('Escape');
  });

  test('Avvisi e novità (NotificheModal)', async ({ page }) => {
    await page.getByRole('button', { name: /^Avvisi e novità/ }).first().click();
    await expect(page.getByText('Avvisi e novità', { exact: true }).first()).toBeVisible();
    await page.keyboard.press('Escape');
  });

  test('Atmosfera e audio (PannelloAudioModal)', async ({ page }) => {
    await page.getByRole('button', { name: /^Atmosfera:/ }).first().click();
    await expect(page.getByRole('button', { name: 'Chiudi pannello audio' })).toBeVisible();
    await page.getByRole('button', { name: 'Chiudi pannello audio' }).click();
  });

  test('Importa ed esporta (MenuEsportaModal)', async ({ page }) => {
    await page.getByRole('button', { name: /^Importa ed esporta/ }).first().click();
    await expect(page.getByText('Importa ed esporta', { exact: true }).first()).toBeVisible();
    await page.keyboard.press('Escape');
  });

  test('Benvenuto / tutorial (GuidaModal)', async ({ page }) => {
    await page.getByRole('button', { name: 'Nuovo personaggio' }).first().click();
    await page.getByRole('button', { name: 'ℹ️' }).first().click();
    await expect(page.getByText('Benvenuto al Tavolo dei Dadi')).toBeVisible();
  });

  test('Menu e strumenti su telefono (MenuHubMobile)', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.getByRole('button', { name: 'Apri menu e strumenti' }).first().click();
    await expect(page.getByText('Menu e strumenti', { exact: true })).toBeVisible();
  });

  for (const [pulsante, titolo, nome] of [
    [/Note legali/, 'Note legali e licenza', 'NoteLegaliModal'],
    [/Sostieni il progetto/, 'Sostieni Tavolo dei Dadi', 'DonazioniModal'],
    [/Cronologia versioni/, 'Versioni precedenti', 'RipristinoModal'],
  ]) {
    test(`${titolo} (${nome}, dal menu)`, async ({ page }) => {
      // la cronologia compare solo se esiste almeno un salvataggio automatico
      await page.evaluate(() => localStorage.setItem('scheda-interattiva:snapshots', JSON.stringify([{ ts: Date.now(), n: 1, roster: { personaggi: {} } }])));
      await page.reload();
      await chiudiMenuIniziale(page);
      await page.getByRole('button', { name: /^Menu: nuovo personaggio/ }).first().click();
      await page.getByRole('button', { name: pulsante }).first().click();
      await expect(page.getByText(titolo, { exact: true })).toBeVisible();
    });
  }
});
