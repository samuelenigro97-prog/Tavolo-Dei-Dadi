// v4.81.0: nuvolette delle risorse, niente menu "Aggiungi…" vuoti, riquadro
// Poteri sempre visibile con recupero dalla cronologia, sezione Compagni solo
// per chi può evocare.
import { test, expect } from '@playwright/test';
import { apriScheda } from './helpers.js';

async function modificaPg(page, fn) {
  await page.evaluate((src) => {
    const r = JSON.parse(localStorage.getItem('scheda-interattiva:v1'));
    // eslint-disable-next-line no-new-func
    new Function('pg', 'r', src)(r.personaggi[r.attivo], r);
    localStorage.setItem('scheda-interattiva:v1', JSON.stringify(r));
  }, fn);
  await apriScheda(page);
}

test.describe('Risorse, Poteri e Compagni', () => {
  test.beforeEach(async ({ page }) => { await apriScheda(page); });

  test('ogni risorsa di classe apre una nuvoletta con usi, ricarica e spiegazione (anche quelle personalizzate)', async ({ page }) => {
    await modificaPg(page, `
      pg.risorse.push({ id: 'cust-1', nome: 'Paura (3/giorno)', attuali: 2, max: 3, reset: 'lungo' });
      pg.trattiSpecie = (pg.trattiSpecie || '') + '\\nSguardo Strano: Fa una cosa molto particolare.';
      pg.risorse.push({ id: 'cust-2', nome: 'Sguardo Strano', attuali: 1, max: 1, reset: '' });
    `);
    const box = page.locator('.profilo-risorse-box').first();
    await box.locator('.risorsa-nome', { hasText: 'Paura (3/giorno)' }).click();
    let nuvola = page.getByText(/Usi: 2 \/ 3/).last();
    await expect(nuvola).toContainText('Ricarica: riposo lungo');
    await page.keyboard.press('Escape');
    await box.locator('.risorsa-nome', { hasText: 'Sguardo Strano' }).click();
    nuvola = page.getByText(/Usi: 1 \/ 1/).last();
    await expect(nuvola).toContainText('Fa una cosa molto particolare.');
    await expect(nuvola).toContainText('Ricarica: a mano');
  });

  test('niente menu "Aggiungi…" sotto i livelli quando non manca nulla da scegliere', async ({ page }) => {
    await expect(page.locator('select.add-spell:not(.incantesimo-mancante-controllo)')).toHaveCount(0);
  });

  test('il riquadro Poteri resta visibile anche vuoto e recupera i Poteri dalla cronologia', async ({ page }) => {
    // Copia in cronologia con i Poteri, poi il personaggio li perde (come collegando un dispositivo vecchio).
    await page.evaluate(() => {
      const r = JSON.parse(localStorage.getItem('scheda-interattiva:v1'));
      const pg = r.personaggi[r.attivo];
      localStorage.setItem('scheda-interattiva:snapshots', JSON.stringify([{ ts: Date.now() - 60000, n: 1, roster: { attivo: r.attivo, personaggi: { [r.attivo]: { ...pg } } } }]));
      pg.poteri = [];
      pg.risorse = (pg.risorse || []).filter((x) => !String(x.id || '').startsWith('potere-'));
      localStorage.setItem('scheda-interattiva:v1', JSON.stringify(r));
    });
    await apriScheda(page);
    const box = page.getByTestId('poteri-risorse');
    await expect(box).toContainText('Nessun contatore dei Poteri');
    await box.getByTestId('recupera-poteri').click();
    await expect(box.getByText('Debito', { exact: true })).toBeVisible();
    const poteri = await page.evaluate(() => { const r = JSON.parse(localStorage.getItem('scheda-interattiva:v1')); return r.personaggi[r.attivo].poteri.length; });
    expect(poteri).toBeGreaterThan(0);
  });

  test('la sezione Compagni compare solo a chi può evocare', async ({ page }) => {
    // Vaelion (Druido del Pastore con Evocare Animali) la vede.
    await expect(page.getByText('Compagni, famigli ed evocazioni', { exact: true })).toHaveCount(1);
    // Un Guerriero senza incantesimi né compagni no.
    await modificaPg(page, `
      pg.classe = 'Guerriero'; pg.sottoclasse = 'Campione'; pg.versione = '2014';
      pg.incantesimiLista = []; pg.alleati = []; pg.privilegi = ''; pg.privilegiSottoclasse = '';
    `);
    await expect(page.getByText('Compagni, famigli ed evocazioni', { exact: true })).toHaveCount(0);
  });
});
