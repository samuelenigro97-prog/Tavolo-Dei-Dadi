// Sezione Poteri (dentro Privilegi, Tratti & Talenti): chiarimento "regole
// homebrew" nel titolo, bersaglio libero per i modificatori.
import { test, expect } from '@playwright/test';
import { apriScheda } from './helpers.js';

// Attiva il manuale di campagna "Araldi del Segreto" dal pannello Manuali e fonti.
async function attivaManuale(page) {
  await page.evaluate(() => {
    const m = JSON.parse(localStorage.getItem('scheda-interattiva:manuali') || '{}');
    localStorage.setItem('scheda-interattiva:manuali', JSON.stringify({ ...m, araldi: true }));
  });
  await page.reload();
  await page.waitForTimeout(800);
  for (let i = 0; i < 3; i++) await page.keyboard.press('Escape');
  await page.mouse.click(20, 300);
}

test.describe('Poteri', () => {
  test.beforeEach(async ({ page }) => {
    await apriScheda(page);
  });

  test('il titolo della sezione specifica "regole homebrew"', async ({ page }) => {
    await expect(page.locator('div, span, h3, h4').filter({ hasText: /^\s*[▾▸]?\s*Poteri\s*\(regole homebrew\)\s*$/ }).last()).toBeVisible();
    await expect(page.getByText('(regole homebrew)')).toBeVisible();
  });

  test('l\'etichetta del bersaglio di un modificatore è visibile senza passare il mouse', async ({ page }) => {
    // Il PG di esempio ha un potere "Potere del Patrono" con un modificatore su Velocità.
    await expect(page.getByText(/Velocità \+\d+m/)).toBeVisible();
  });

  test('si può aggiungere un modificatore con bersaglio libero personalizzato', async ({ page }) => {
    await page.getByText('Potere del Patrono').click();
    const dialog = page.getByRole('dialog');
    await dialog.getByRole('button', { name: /Aggiungi modificatore/ }).click();
    await page.waitForTimeout(150);

    const selectBersaglio = dialog.locator('select').last();
    await selectBersaglio.selectOption({ label: 'Altro (personalizzato)…' });

    const campoLibero = dialog.getByPlaceholder(/Su cosa agisce/);
    await expect(campoLibero).toBeVisible();
    await campoLibero.fill('Vantaggio ai TS Carisma');

    // Chiudi il modal e verifica che il chip mostri l'etichetta scritta a mano.
    await dialog.getByRole('button', { name: '✕' }).click();
    await expect(page.getByText(/Vantaggio ai TS Carisma/)).toBeVisible();
  });

  test('il manuale di campagna è spento di base: "Da modello" compare solo dopo averlo attivato', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Da modello' })).toHaveCount(0);
    await attivaManuale(page);
    await expect(page.getByRole('button', { name: 'Da modello' })).toBeVisible();
  });

  test('la sezione Poteri si può rimpicciolire e si ricorda la scelta', async ({ page }) => {
    await expect(page.getByText('Potere del Patrono').first()).toBeVisible();
    await page.getByTestId('poteri-titolo').click();
    await expect(page.getByText('Potere del Patrono')).toHaveCount(0);
    await page.reload();
    await page.waitForTimeout(800);
    await expect(page.getByText('Potere del Patrono')).toHaveCount(0);
    await page.getByTestId('poteri-titolo').click();
    await expect(page.getByText('Potere del Patrono').first()).toBeVisible();
  });

  test('"Da modello" aggiunge Araldi del Segreto con contatori collegati e non lo duplica', async ({ page }) => {
    await attivaManuale(page);
    await page.getByRole('button', { name: 'Da modello' }).click();
    const elenco = page.getByTestId('modelli-poteri');
    await expect(elenco.getByText('Araldi del Segreto', { exact: true })).toBeVisible();
    await elenco.getByRole('button', { name: /Aggiungi \d+ poteri/ }).click();

    await expect(page.getByText('Affabilità (1° livello)')).toBeVisible();
    await expect(page.getByText('Braccare! (14° livello)')).toBeVisible();
    // I contatori creano le risorse collegate (Segreti, Debito, usi dei privilegi).
    const risorse = await page.evaluate(() => {
      const st = JSON.parse(localStorage.getItem('scheda-interattiva:v1'));
      return st.personaggi[st.attivo].risorse.map((r) => r.nome);
    });
    // Il PG di esempio è di 10° livello: Braccare! (14°) resta bloccato e senza risorsa.
    expect(risorse).toEqual(expect.arrayContaining(['Segreti', 'Affabilità', 'Inquisire', 'Trasferire Empatico']));
    expect(risorse).not.toContain('Braccare!');
    await expect(page.getByText('🔒 14° liv.')).toBeVisible();
    await expect(page.getByText('6° liv.', { exact: true })).toBeVisible();
    // Passando il mouse sulla risorsa si legge cosa fa quel potere.
    await expect(page.getByRole('button', { name: 'Inquisire', exact: true })).toHaveAttribute('title', /Occhi: hai vantaggio/);

    // Una seconda volta non aggiunge doppioni.
    await page.getByRole('button', { name: 'Da modello' }).click();
    await expect(page.getByTestId('modelli-poteri').getByRole('button', { name: 'Già aggiunto' })).toBeDisabled();
  });
});
