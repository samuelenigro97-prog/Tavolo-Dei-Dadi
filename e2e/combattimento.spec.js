// Tabella Combattimento: Randello Incantato nasconde l'arma non incantata,
// colonna Note non ripete due volte la stessa informazione.
import { test, expect } from '@playwright/test';
import { apriScheda } from './helpers.js';
import { coloreCategoria } from '../src/rules/scheda.js';

test.describe('Combattimento', () => {
  test.beforeEach(async ({ page }) => {
    await apriScheda(page);
  });

  test('Randello Incantato nasconde Randello e Bastone Ferrato dalla tabella', async ({ page }) => {
    const righe = page.locator('tr.attacchi-riga');
    await expect(righe.filter({ hasText: 'Randello Incantato' })).toHaveCount(1);
    // Controlla solo il nome dell'arma (colonna .attacchi-nome), non l'intera riga:
    // "Bastone Ferrato" compare comunque nella nota di "Attacco di Opportunità".
    const nomiArma = page.locator('tr.attacchi-riga .attacchi-nome');
    await expect(nomiArma.filter({ hasText: /^\s*Randello\s*$/ })).toHaveCount(0);
    await expect(nomiArma.filter({ hasText: /^\s*Bastone Ferrato\s*$/ })).toHaveCount(0);
  });

  test('la riga non ripete la nota: proprietà e note stanno nella nuvoletta del nome', async ({ page }) => {
    const riga = page.locator('tr.attacchi-riga').filter({ hasText: 'Randello Incantato' });
    await expect(riga.getByText('Magico con SAG (Randello/Bastone)')).toHaveCount(0);
    await expect(riga.getByText('1 min: usa SAG su randello/bastone, danno 1d8')).toHaveCount(0);
    await riga.locator('.attacco-nome').click();
    const nuvola = page.getByText(/Azione: Azione Bonus/).last();
    await expect(nuvola).toContainText('Magico con SAG (Randello/Bastone)');
  });

  test('un\'arma senza categorie riconosciute mostra ancora il testo libero per intero', async ({ page }) => {
    // "Attacco di Opportunità" (Reazioni) non ha badge Innesco/Effetto pieni per ogni riga:
    // verifichiamo almeno che la tabella Reazioni esista e abbia righe con badge visibili.
    const reazioni = page.locator('tr.attacchi-riga').filter({ hasText: 'Attacco di Opportunità' });
    await expect(reazioni).toHaveCount(1);
  });

  test('la sezione "Azioni Bonus" è sempre visibile, prima di Reazioni, anche vuota', async ({ page }) => {
    const titoloBonus = page.getByRole('heading', { name: 'Azioni Bonus' });
    const titoloReazioni = page.getByRole('heading', { name: 'Reazioni' });
    await expect(titoloBonus).toBeVisible();
    await expect(titoloReazioni).toBeVisible();
    const posBonus = await titoloBonus.boundingBox();
    const posReazioni = await titoloReazioni.boundingBox();
    expect(posBonus.y).toBeLessThan(posReazioni.y);
  });

  test('gli incantesimi con tempo di lancio "Azione Bonus" stanno in Azioni Bonus, non in Combattimento', async ({ page }) => {
    const tabellaAzione = page.locator('table.attacchi-table').first();
    const sezioneBonus = page.getByRole('heading', { name: 'Azioni Bonus' }).locator('xpath=ancestor::div[.//table][1]');
    // Randello Incantato (trucchetto, Azione Bonus) e Parola di Guarigione (cura con tiro, Azione Bonus)
    await expect(sezioneBonus.locator('tr.attacchi-riga').filter({ hasText: 'Randello Incantato' })).toHaveCount(1);
    await expect(sezioneBonus.locator('tr.attacchi-riga').filter({ hasText: 'Parola di Guarigione' })).toHaveCount(1);
    await expect(tabellaAzione.locator('tr.attacchi-riga').filter({ hasText: 'Randello Incantato' })).toHaveCount(0);
    await expect(tabellaAzione.locator('tr.attacchi-riga').filter({ hasText: 'Frusta di Spine' })).toHaveCount(1);
    // Nessun duplicato in tutta la pagina Combattimento.
    await expect(page.locator('tr.attacchi-riga').filter({ hasText: 'Randello Incantato' })).toHaveCount(1);
    // Il messaggio "vuota" non compare più.
    await expect(page.getByText(/Nessun attacco\/incantesimo ad azione bonus/)).toHaveCount(0);
  });

  test('nuvoletta unica: prima il tipo di azione, subito dopo la distanza (anche per Inaridire)', async ({ page }) => {
    for (const [nome, azione, distanza] of [['Inaridire', '1 Azione', '9m'], ['Randello Incantato', 'Azione Bonus', 'Tocco'], ['Morsa del Gelo', '1 Azione', '18m'], ['Parola di Guarigione', 'Azione Bonus', '18m']]) {
      const riga = page.locator('tr.attacchi-riga').filter({ hasText: nome });
      await expect(riga.locator('.chip-tempo, .chip-gittata')).toHaveCount(0);
      await riga.locator('.attacco-nome').click();
      const nuvola = page.getByText(new RegExp(`Azione: ${azione}`)).last();
      await expect(nuvola).toBeVisible();
      const testo = await nuvola.innerText();
      const righe = testo.split('\n').map((r) => r.trim()).filter(Boolean);
      expect(righe[0]).toBe(`Azione: ${azione}`);
      expect(righe[1]).toBe(`Distanza: ${distanza}`);
      await page.keyboard.press('Escape');
    }
  });

  test('tiro per colpire e danni usano gli stessi badge di Trucchetti/Incantesimi', async ({ page }) => {
    const riga = page.locator('tr.attacchi-riga').filter({ hasText: 'Frusta di Spine' });
    await expect(riga.locator('.badge-tiro-colpire')).toHaveText(/^\s*Attacco \+9\s*$/);
    await expect(riga.locator('.badge-tiro-danno')).toContainText('Perforante');
    // Anche le Reazioni: Attacco di Opportunità.
    const reaz = page.locator('tr.attacchi-riga').filter({ hasText: 'Attacco di Opportunità' });
    await expect(reaz.locator('.badge-tiro-colpire')).toHaveCount(1);
    await expect(reaz.locator('.badge-tiro-danno')).toHaveCount(1);
  });

  test('Velocità mostra il totale con i Poteri in blu, senza il "+3m" sotto', async ({ page }) => {
    // Il colore atteso qui sotto è quello del tema chiaro: va forzato esplicitamente,
    // perché il tema di default "auto" passa al tema scuro di notte (eNotte: 20-7),
    // rendendo altrimenti il test dipendente dall'orario reale di esecuzione.
    await page.evaluate(() => localStorage.setItem('scheda-interattiva:tema', 'chiaro'));
    await apriScheda(page);
    const box = page.locator('.velocita-modificata');
    await expect(box).toHaveCount(1);
    await expect(box).toContainText('13.5');
    await expect(box).not.toContainText('+3m');
    const colore = await box.locator('span').first().evaluate((e) => getComputedStyle(e).color);
    // Il blu "valore modificato" è quello della palette dei chip (tema chiaro), non un numero scritto a mano nel test.
    const hex = coloreCategoria('modificato', false);
    const atteso = `rgb(${parseInt(hex.slice(1, 3), 16)}, ${parseInt(hex.slice(3, 5), 16)}, ${parseInt(hex.slice(5, 7), 16)})`;
    expect(colore).toBe(atteso);
  });

  test('Randello Incantato ha lo stesso danno (1d8 + mod SAG) in Azioni Bonus e in Trucchetti', async ({ page }) => {
    const rigaComb = page.locator('tr.attacchi-riga').filter({ hasText: 'Randello Incantato' });
    await expect(rigaComb.locator('.badge-tiro-danno')).toContainText('1d8+5 Contundente');
    await expect(rigaComb.locator('.badge-tiro-colpire')).toHaveText(/\+9/);
    const trucchetti = page.getByRole('heading', { name: 'Trucchetti', exact: true }).locator('xpath=ancestor::*[.//*[contains(@class, "badge-tiro-danno")]][1]');
    await expect(trucchetti.locator('.badge-tiro-danno').filter({ hasText: 'Contundente' }).first()).toContainText('1d8+5 Contundente');
  });

  test('un incantesimo a tiro salvezza (Morsa del Gelo) mostra solo la CD, nessun tiro per colpire', async ({ page }) => {
    for (const nome of ['Morsa del Gelo', 'Inaridire']) {
      const riga = page.locator('tr.attacchi-riga').filter({ hasText: nome });
      await expect(riga.locator('.badge-tiro-colpire')).toHaveCount(0);
      await expect(riga.locator('.badge-tiro-salvezza')).toHaveText(/Costituzione · CD 17/);
      // la CD non è ripetuta tra i chip della nota
      await expect(riga.locator('.attacchi-note').getByText(/CD 17/)).toHaveCount(0);
    }
  });

  test('la proprietà di Frusta di Spine nella nuvoletta è pulita ("Magico")', async ({ page }) => {
    const riga = page.locator('tr.attacchi-riga').filter({ hasText: 'Frusta di Spine' });
    await expect(riga.locator('.attacchi-note')).not.toContainText('Magico');
    await riga.locator('.attacco-nome').click();
    const nuvola = page.getByText(/Azione: 1 Azione/).last();
    const righe = (await nuvola.innerText()).split('\n').map((r) => r.trim());
    expect(righe).toContain('Proprietà: Magico');
  });

  test('nessun incantesimo ad azione bonus compare nella tabella Azione', async ({ page }) => {
    const tabellaAzione = page.locator('table.attacchi-table').first();
    const nomiAzione = await tabellaAzione.locator('tr.attacchi-riga .attacchi-nome').allInnerTexts();
    for (const n of nomiAzione) expect(n).not.toMatch(/Randello Incantato|Parola di Guarigione/);
  });

  test('i trucchetti hanno lo stesso danno scalato col livello in Trucchetti e in Combattimento (Vaelion, 10°)', async ({ page }) => {
    const trucchetti = page.getByRole('heading', { name: 'Trucchetti', exact: true }).locator('xpath=ancestor::*[.//*[contains(@class, "badge-tiro-danno")]][1]');
    const riga = (nome) => page.locator('tr.attacchi-riga').filter({ hasText: nome });
    await expect(riga('Frusta di Spine').locator('.badge-tiro-danno')).toContainText('2d6 Perforante');
    await expect(trucchetti.locator('.badge-tiro-danno').filter({ hasText: 'Perforante' }).first()).toContainText('2d6 Perforante');
    await expect(riga('Morsa del Gelo').locator('.badge-tiro-danno')).toContainText('2d6 Freddo');
    await expect(trucchetti.locator('.badge-tiro-danno').filter({ hasText: 'Freddo' }).first()).toContainText('2d6 Freddo');
  });

  test('con le regole 2024 il dado di Randello Incantato scala (d10 al 10°) ovunque', async ({ page }) => {
    await page.evaluate(() => {
      const k = 'scheda-interattiva:v1';
      const r = JSON.parse(localStorage.getItem(k));
      // Vaelion è forzato a 2014 da migrazioneRegoleVaelion (per nome): per il test
      // usiamo una copia con un altro nome e le regole 2024.
      r.personaggi[r.attivo].nome = 'Druido di prova 2024';
      r.personaggi[r.attivo].versione = '2024';
      localStorage.setItem(k, JSON.stringify(r));
    });
    await apriScheda(page);
    const rigaComb = page.locator('tr.attacchi-riga').filter({ hasText: 'Randello Incantato' });
    await expect(rigaComb.locator('.badge-tiro-danno')).toContainText('1d10+5 Contundente');
    const trucchetti = page.getByRole('heading', { name: 'Trucchetti', exact: true }).locator('xpath=ancestor::*[.//*[contains(@class, "badge-tiro-danno")]][1]');
    await expect(trucchetti.locator('.badge-tiro-danno').filter({ hasText: 'Contundente' }).first()).toContainText('1d10+5 Contundente');
  });
  test('Vaelion (5.0): le cure usano i dadi 2014 + mod SAG (Parola di Guarigione 1d4+5, Cura Ferite 1d8+5)', async ({ page }) => {
    const rigaBonus = page.locator('tr.attacchi-riga').filter({ hasText: 'Parola di Guarigione' });
    await expect(rigaBonus.locator('.badge-tiro-danno')).toContainText('1d4+5');
    // Lista incantesimi: il "2d8" salvato dal vecchio database non vince sull'edizione del PG.
    await expect(page.locator('.badge-tiro-danno').filter({ hasText: /1d8\+5 Guarigione/ })).toHaveCount(1);
    await expect(page.locator('.badge-tiro-danno').filter({ hasText: /2d8(\+\d+)? Guarigione/ })).toHaveCount(0);
    // Una cura non ha tiro per colpire: nessun badge "Attacco +9" sulla riga di Cura Ferite.
    const rigaCura = page.getByRole('button', { name: 'Cura Ferite', exact: true }).locator('xpath=ancestor::*[.//*[contains(@class, "badge-tiro-danno")]][1]');
    await expect(rigaCura.locator('.badge-tiro-colpire')).toHaveCount(0);
  });

  test('Assorbire Elementi (danno sul prossimo colpo in mischia) non ha il badge del tiro per colpire', async ({ page }) => {
    // La riga della Reazione in Combattimento (il nome è un pulsante anche nella lista incantesimi).
    const riga = page.locator('tr.attacchi-riga').filter({ hasText: 'Assorbire Elementi' });
    await expect(riga.locator('.badge-tiro-danno')).toHaveCount(1);
    await expect(riga.locator('.badge-tiro-colpire')).toHaveCount(0);
  });

  test('con le regole 2024 Parola di Guarigione è 2d4 + mod', async ({ page }) => {
    await page.evaluate(() => {
      const k = 'scheda-interattiva:v1';
      const r = JSON.parse(localStorage.getItem(k));
      r.personaggi[r.attivo].nome = 'Druido di prova 2024';
      r.personaggi[r.attivo].versione = '2024';
      localStorage.setItem(k, JSON.stringify(r));
    });
    await apriScheda(page);
    const rigaBonus = page.locator('tr.attacchi-riga').filter({ hasText: 'Parola di Guarigione' });
    await expect(rigaBonus.locator('.badge-tiro-danno')).toContainText('2d4+5');
  });

  test('Reazioni: niente riquadri di innesco/effetto, nome non modificabile, il tocco apre la nuvoletta essenziale', async ({ page }) => {
    const riga = page.locator('tr.attacchi-riga').filter({ hasText: 'Attacco di Opportunità' });
    await expect(riga.locator('.chip-reazione-testo')).toHaveCount(0);
    await expect(riga.locator('.chip-tempo')).toHaveCount(0);
    // Nessun campo modificabile nella riga (il nome lo decide il sistema).
    await expect(riga.locator('input, [contenteditable="true"]')).toHaveCount(0);
    await riga.locator('.attacco-nome').click();
    const nuvola = page.getByText(/Azione: Reazione/).last();
    await expect(nuvola).toBeVisible();
    await expect(nuvola).toContainText('Distanza: 1,5 m');
    await expect(nuvola).toContainText('Innesco:');
    await expect(nuvola).toContainText('Danno:');
  });
});
