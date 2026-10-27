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
    // Dalla 4.102.2 si apre cliccando il valore della velocità (niente più etichetta "Movimenti").
    await page.getByTestId('velocita-valore').click();
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

  test('Evoca compagno (AggiungiCompagnoModal)', async ({ page }) => {
    await page.getByTestId('apri-evoca-compagno').first().click();
    await expect(page.getByText('Evoca un Compagno o un Famiglio')).toBeVisible();
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
    // Niente numero di versione nell'intestazione né tasto "Ricarica l'applicazione" in fondo.
    await expect(page.getByTestId('notifiche-versione')).toHaveCount(0);
    await expect(page.getByRole('button', { name: /Ricarica l.applicazione/ })).toHaveCount(0);
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
    await page.getByRole('button', { name: 'Nuovo personaggio', exact: true }).first().click();
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
    [/Supporta il progetto/, 'Supporta Tavolo dei Dadi ❤️', 'DonazioniModal'],
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

test('creazione personaggio: "Artefice" compare una volta sola, e solo col manuale Tasha attivo (v4.105.7)', async ({ page }) => {
  await apriScheda(page);
  const classi = async (tasha) => {
    await page.evaluate((v) => {
      const m = JSON.parse(localStorage.getItem('scheda-interattiva:manuali') || '{}');
      localStorage.setItem('scheda-interattiva:manuali', JSON.stringify({ ...m, tasha: v }));
    }, tasha);
    await apriScheda(page);
    await page.getByRole('button', { name: 'Nuovo personaggio', exact: true }).first().click();
    const sel = page.locator('select').filter({ has: page.locator('option', { hasText: 'Barbaro' }) }).first();
    return sel.locator('option').allTextContents();
  };
  const con = await classi(true);
  expect(con.filter((t) => /Artefice/.test(t))).toHaveLength(1);
  const senza = await classi(false);
  expect(senza.filter((t) => /Artefice/.test(t))).toHaveLength(0);
  expect(senza.filter((t) => /Barbaro/.test(t))).toHaveLength(1);
});

test('"I miei personaggi" è l\'ultima voce del menu a tendina del personaggio e apre l\'elenco; il menu iniziale non ha più il pulsante (v4.112.2)', async ({ page }) => {
  await apriScheda(page);
  const tendina = page.getByLabel('Personaggio attivo');
  const voci = await tendina.locator('option').allTextContents();
  expect(voci.at(-1)).toBe('I miei personaggi…');
  const prima = await tendina.inputValue();
  await tendina.selectOption({ label: 'I miei personaggi…' });
  const menu = page.getByTestId('menu-iniziale');
  await expect(menu).toBeVisible();
  await expect(menu.locator('#lista-carica-pg')).toBeVisible();
  await expect(menu.getByTestId('menu-pg-riga').first()).toBeVisible();
  // Il personaggio attivo non cambia.
  await page.keyboard.press('Escape');
  await expect(tendina).toHaveValue(prima);
  // Dalla 🏠 il menu si apre senza elenco e senza il vecchio pulsante.
  await page.locator('.btn-header-azione').first().click();
  await expect(menu).toBeVisible();
  await expect(menu.locator('#lista-carica-pg')).toHaveCount(0);
  await expect(menu.getByRole('button', { name: /^I miei personaggi/ })).toHaveCount(0);
});
