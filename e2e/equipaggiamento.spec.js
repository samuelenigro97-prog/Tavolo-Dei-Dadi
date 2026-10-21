// Sezione Inventario (già Equipaggiamento): filtri in una riga, vista e tipo come gruppi distinti.
import { test, expect } from '@playwright/test';
import { apriScheda, scrollaA } from './helpers.js';

test.describe('Inventario', () => {
  test.beforeEach(async ({ page }) => {
    await apriScheda(page);
    await scrollaA(page, 'h3', 'Inventario');
  });

  test('la vista (Tutti/Indossati/Zaino) e il tipo (Tutti i tipi/Armi/Pozioni...) hanno due gruppi di filtri distinti', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Indossati', exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Zaino', exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Tutti i tipi', exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Pozioni', exact: true })).toBeVisible();
  });

  test('tutti i filtri e la ricerca stanno sulla stessa riga', async ({ page }) => {
    const ricerca = page.getByPlaceholder(/Cerca nell'inventario/);
    const tutti = page.getByRole('button', { name: 'Indossati', exact: true });
    const [rRicerca, rTutti] = await Promise.all([ricerca.boundingBox(), tutti.boundingBox()]);
    expect(rRicerca).not.toBeNull();
    expect(rTutti).not.toBeNull();
    // Su schermo desktop devono stare alla stessa altezza (± piccola tolleranza).
    expect(Math.abs(rRicerca.y - rTutti.y)).toBeLessThan(10);
  });

  test('un oggetto senza contenitore/effetto/utilizzi attivi mostra solo "⋯" e cestino, non 4 icone', async ({ page }) => {
    const riga = page.locator('tr.inventario-riga').filter({ hasText: 'Antitossina' });
    await expect(riga.getByRole('button', { name: '⋯' })).toBeVisible();
    // Icone vettoriali (non più emoji): si riconoscono dal titolo.
    const contenitore = riga.getByTitle('Inserisci sotto-oggetti (rendi contenitore)');
    const effetti = riga.getByTitle('Configura gli effetti dell’oggetto');
    await expect(contenitore).toHaveCount(0);
    await expect(effetti).toHaveCount(0);

    await riga.getByRole('button', { name: '⋯' }).click();
    await expect(contenitore).toBeVisible();
    await expect(effetti).toBeVisible();
    await expect(riga.getByTitle('Elimina')).toBeVisible();
  });

  test('anche un oggetto con un effetto attivo apre e chiude le icone dal "⋯" (v4.98.0)', async ({ page }) => {
    const riga = page.locator('tr.inventario-riga').filter({ hasText: 'Perla del Potere' });
    const altro = riga.getByRole('button', { name: '⋯' });
    await expect(altro).toBeVisible();
    const contenitore = riga.getByTitle('Inserisci sotto-oggetti (rendi contenitore)');
    const effetti = riga.getByTitle('Configura gli effetti dell’oggetto');
    await expect(contenitore).toHaveCount(0);
    await altro.click();
    await expect(contenitore).toBeVisible();
    await expect(effetti).toBeVisible();
    await expect(riga.getByTitle('Elimina')).toBeVisible();
    await altro.click();
    await expect(contenitore).toHaveCount(0);
  });

  test('il tasto ✎ rinomina l\'oggetto (v4.98.0)', async ({ page }) => {
    const riga = page.locator('tr.inventario-riga').filter({ hasText: 'Antitossina' });
    await riga.getByRole('button', { name: '⋯' }).click();
    page.once('dialog', (d) => d.accept('Antitossina del Druido'));
    await riga.getByRole('button', { name: 'Rinomina l\'oggetto' }).click();
    await expect(page.locator('tr.inventario-riga').filter({ hasText: 'Antitossina del Druido' })).toHaveCount(1);
  });
});

test('la CA degli oggetti compare tra parentesi e lo Scudo in Legnoferro è nel catalogo (v4.103.0)', async ({ page }) => {
  await apriScheda(page);
  await page.evaluate(() => {
    const r = JSON.parse(localStorage.getItem('scheda-interattiva:v1'));
    const pg = r.personaggi[r.attivo];
    pg.inventario.push(
      { id: 't-scudo', nome: 'Scudo in Legnoferro', qta: 1, peso: 3, equip: false },
      { id: 't-anello', nome: 'Anello di Protezione', qta: 1, peso: 0, equip: false, effettoMeccanico: 'classe_armatura_tiri_salvezza_1' },
      { id: 't-cuoio', nome: 'Armatura di cuoio +1', qta: 1, peso: 5, equip: false, categoria: 'Armatura' },
    );
    localStorage.setItem('scheda-interattiva:v1', JSON.stringify(r));
  });
  await apriScheda(page);
  await scrollaA(page, 'h3', 'Equipaggiamento');
  const riga = (nome) => page.locator('tr.inventario-riga').filter({ has: page.locator('.oggetto-nome', { hasText: nome }) });
  await expect(riga('Scudo in Legnoferro').getByTestId('oggetto-ca')).toHaveText('(CA +2)');
  await expect(riga('Anello di Protezione').getByTestId('oggetto-ca')).toHaveText('(CA +1)');
  await expect(riga('Armatura di cuoio +1').getByTestId('oggetto-ca')).toHaveText('(CA +12)');
  // La CA scritta a mano nel nome "(CA 14)" si legge da lì e si mostra sempre come "CA +14", senza doppione.
  await expect(riga('Corazza a Piastre in Legnoferro').getByTestId('oggetto-ca')).toHaveText('(CA +14)');
  await expect(riga('Corazza a Piastre in Legnoferro').locator('.oggetto-nome')).toHaveText('Corazza a Piastre in Legnoferro');
  // Oggetti senza CA: niente parentesi.
  await expect(riga('Antitossina').getByTestId('oggetto-ca')).toHaveCount(0);
  // Catalogo: cercando "legnoferro" si propone lo scudo.
  const { NOMI_OGGETTI } = await import('../src/data/dati5e.js');
  expect(NOMI_OGGETTI).toContain('Scudo in Legnoferro');
});
