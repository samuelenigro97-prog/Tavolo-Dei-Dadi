// v4.48.0: sicurezza dei dati (promemoria backup, spazio pieno), menu iniziale
// solo al primo avvio, tastiera (Escape, Invio sui finti pulsanti).
import { test, expect } from '@playwright/test';
import { apriScheda, chiudiMenuIniziale } from './helpers.js';

const KEY = 'scheda-interattiva:v1';

test.describe('Robustezza e accessibilità', () => {
  test('Escape chiude il Menu Hub (telefono)', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await apriScheda(page);
    await page.locator('button[title="Apri Menu Hub"]').click();
    await expect(page.getByText('Menu e strumenti', { exact: false }).first()).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.getByText('Menu e strumenti', { exact: false })).toHaveCount(0);
  });

  test('promemoria backup visibile con sync spento; "Più tardi" lo rimanda', async ({ page }) => {
    await apriScheda(page);
    await page.evaluate(() => {
      localStorage.setItem('scheda-interattiva:ultimo-backup', String(Date.now() - 10 * 86400000));
      localStorage.removeItem('scheda-interattiva:snooze-backup');
    });
    await page.reload();
    await chiudiMenuIniziale(page);
    const banner = page.getByTestId('banner-backup');
    await expect(banner).toBeVisible();
    await expect(banner).toContainText('La sincronizzazione è spenta');
    await banner.getByRole('button', { name: 'Più tardi' }).click();
    await expect(banner).toHaveCount(0);
    const snooze = await page.evaluate(() => Number(localStorage.getItem('scheda-interattiva:snooze-backup')));
    expect(snooze).toBeGreaterThan(Date.now());
    await page.reload();
    await chiudiMenuIniziale(page);
    await expect(page.getByTestId('banner-backup')).toHaveCount(0);
  });

  test('al primo avvio niente promemoria backup', async ({ page }) => {
    await apriScheda(page);
    await page.reload();
    await chiudiMenuIniziale(page);
    await expect(page.getByTestId('banner-backup')).toHaveCount(0);
  });

  test('spazio del browser pieno: avviso visibile con "Scarica backup"', async ({ page }) => {
    await page.addInitScript((KEY) => {
      const orig = Storage.prototype.setItem;
      Storage.prototype.setItem = function (k, v) {
        if (window.__pieno && k === KEY) { const e = new Error('quota'); e.name = 'QuotaExceededError'; throw e; }
        return orig.call(this, k, v);
      };
    }, KEY);
    await apriScheda(page);
    await page.evaluate(() => { window.__pieno = true; });
    await page.getByRole('button', { name: '-1', exact: true }).first().click();
    const alert = page.getByTestId('banner-spazio-pieno');
    await expect(alert).toBeVisible();
    await expect(alert).toHaveAttribute('role', 'alert');
    await expect(alert.getByRole('button', { name: 'Scarica backup' })).toBeVisible();
  });

  test('all\'avvio si apre il menu coi personaggi; con "apri subito l\'ultima scheda" no, nemmeno con una scheda vuota', async ({ page }) => {
    await apriScheda(page);
    // Di base: dopo un riavvio il menu iniziale è aperto (selettore dei personaggi).
    await page.reload();
    await expect(page.getByRole('button', { name: 'Personaggio casuale' })).toBeVisible();
    await chiudiMenuIniziale(page);
    // Con la scelta "apri subito l'ultima scheda" il menu resta chiuso.
    await page.getByRole('button', { name: /^Menu: / }).first().click();
    await page.getByTestId('avvio-diretto').getByRole('checkbox').check();
    await chiudiMenuIniziale(page);
    await page.evaluate((KEY) => {
      const r = JSON.parse(localStorage.getItem(KEY));
      r.personaggi[r.attivo].nome = '';
      r.personaggi[r.attivo].classe = '';
      localStorage.setItem(KEY, JSON.stringify(r));
    }, KEY);
    await page.reload();
    await page.waitForTimeout(500);
    await expect(page.getByRole('button', { name: 'Personaggio casuale' })).toHaveCount(0);
  });

  test('un chip role="button" si attiva con Invio', async ({ page }) => {
    await apriScheda(page);
    // L'intestazione dei Trucchetti: il "pulsante" è la freccia, il titolo cambia quando si apre/chiude.
    const intestazione = page.locator('.sottosezione-titolo:has([role="button"])').first();
    const pulsante = intestazione.locator('[role="button"]').first();
    await intestazione.scrollIntoViewIfNeeded();
    const prima = await intestazione.getAttribute('title');
    await pulsante.focus();
    await page.keyboard.press('Enter');
    await expect(intestazione).not.toHaveAttribute('title', prima);
    await expect(pulsante).toHaveAttribute('aria-expanded', /true|false/);
  });
});
