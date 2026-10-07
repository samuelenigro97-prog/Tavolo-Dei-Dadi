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

test('senza Poteri, un tocco rimette quelli della campagna (Patrono + Araldi) e attiva il manuale', async ({ page }) => {
  await apriScheda(page);
  await page.evaluate(() => {
    const r = JSON.parse(localStorage.getItem('scheda-interattiva:v1'));
    const pg = r.personaggi[r.attivo];
    pg.poteri = [];
    pg.risorse = (pg.risorse || []).filter((x) => !String(x.id || '').startsWith('potere-'));
    localStorage.setItem('scheda-interattiva:v1', JSON.stringify(r));
    localStorage.removeItem('scheda-interattiva:snapshots');
  });
  await apriScheda(page);
  await page.getByTestId('ripristina-poteri-campagna').click();
  const box = page.getByTestId('poteri-risorse');
  await expect(box.getByRole('button', { name: 'Debito +1' })).toBeVisible();
  await expect(box.getByText('Segreti', { exact: true })).toBeVisible();
  await expect(page.getByTestId('araldi-pannello')).toBeVisible();
  const stato = await page.evaluate(() => {
    const r = JSON.parse(localStorage.getItem('scheda-interattiva:v1'));
    const pg = r.personaggi[r.attivo];
    return { nomi: pg.poteri.map((p) => p.nome), debiti: pg.risorse.filter((x) => x.nome === 'Debito').length, manuale: JSON.parse(localStorage.getItem('scheda-interattiva:manuali') || '{}').araldi };
  });
  expect(stato.nomi).toContain('Potere del Patrono');
  expect(stato.nomi).toContain('Inquisire (6° livello)');
  expect(stato.debiti).toBe(1);
  expect(stato.manuale).toBe(true);
});

test('con il solo Debito (6/100) il ripristino rimette gli Araldi e tiene il Debito a 6 (v4.84.0)', async ({ page }) => {
  await apriScheda(page);
  await page.evaluate(() => {
    const r = JSON.parse(localStorage.getItem('scheda-interattiva:v1'));
    const pg = r.personaggi[r.attivo];
    pg.poteri = [{ id: 'deb', nome: 'Debito', attivo: true, contatori: [{ nome: 'Debito', attuali: 6, max: 100 }], modificatori: [] }];
    pg.risorse = (pg.risorse || []).filter((x) => !String(x.id || '').startsWith('potere-'));
    localStorage.setItem('scheda-interattiva:v1', JSON.stringify(r));
    localStorage.removeItem('scheda-interattiva:snapshots');
  });
  await apriScheda(page);
  const box = page.getByTestId('poteri-risorse');
  await expect(box.getByText('Debito', { exact: true })).toBeVisible();
  await box.getByTestId('ripristina-poteri-campagna').click();
  await expect(box.getByText('Segreti', { exact: true })).toBeVisible();
  await expect(box.getByTestId('ripristina-poteri-campagna')).toHaveCount(0);
  const stato = await page.evaluate(() => {
    const r = JSON.parse(localStorage.getItem('scheda-interattiva:v1'));
    const pg = r.personaggi[r.attivo];
    return { debito: pg.risorse.filter((x) => x.nome === 'Debito').map((x) => x.attuali), araldi: pg.poteri.some((p) => p.modello === 'araldi-del-segreto') };
  });
  expect(stato.debito).toEqual([6]);
  expect(stato.araldi).toBe(true);
});

test('Myrdhal (Araldi del Segreto): si evoca dal catalogo solo con il manuale attivo, si "stacca" spegnendolo (v4.87.0)', async ({ page }) => {
  await apriScheda(page);
  const apriCatalogo = async () => {
    await page.getByRole('button', { name: /Evoca \/ Aggiungi Compagno/ }).first().click();
    await page.getByRole('button', { name: 'Evocazioni', exact: true }).click();
  };
  const chiudi = async () => { await page.keyboard.press('Escape'); await page.mouse.click(5, 300); };
  const manuale = async (acceso) => {
    await page.evaluate((v) => {
      const m = JSON.parse(localStorage.getItem('scheda-interattiva:manuali') || '{}');
      localStorage.setItem('scheda-interattiva:manuali', JSON.stringify({ ...m, araldi: v }));
    }, acceso);
    await apriScheda(page);
  };
  // Manuale spento di base: niente Myrdhal.
  await apriCatalogo();
  await expect(page.getByText('Elementale del Fuoco').first()).toBeVisible();
  await expect(page.getByText('Myrdhal', { exact: true })).toHaveCount(0);
  await chiudi();
  // Manuale acceso: Myrdhal compare e si evoca con i suoi 210 PF.
  await manuale(true);
  await apriCatalogo();
  await expect(page.getByTestId('creatura-manuale-araldi')).toContainText('Araldi del Segreto');
  await page.getByText('Myrdhal', { exact: true }).locator('xpath=ancestor::div[2]').getByRole('button', { name: 'Evoca / Aggiungi' }).click();
  const leggiAlleato = () => page.evaluate(() => {
    const r = JSON.parse(localStorage.getItem('scheda-interattiva:v1'));
    return (r.personaggi[r.attivo].alleati || []).find((a) => a.nome === 'Myrdhal') || null;
  });
  await expect.poll(leggiAlleato).not.toBeNull();
  const alleato = await leggiAlleato();
  // Blocco fisso: l'Evocatore Possente di Vaelion (+2 PF per dado vita) non lo tocca.
  expect(alleato.pfMax).toBe(210);
  expect(alleato.ca).toBe(20);
  expect(alleato.azioni.map((a) => a.nome)).toEqual(expect.arrayContaining(['Lama del Vuoto', 'Dardo di Terrore', 'Passo d\'Ombra (azione bonus)']));
  // Manuale spento di nuovo: sparisce dal catalogo, ma quello già evocato resta sulla scheda.
  await manuale(false);
  await apriCatalogo();
  await expect(page.getByText('Elementale del Fuoco').first()).toBeVisible();
  await expect(page.getByTestId('creatura-manuale-araldi')).toHaveCount(0);
  await chiudi();
  const resta = await page.evaluate(() => {
    const r = JSON.parse(localStorage.getItem('scheda-interattiva:v1'));
    return (r.personaggi[r.attivo].alleati || []).some((a) => a.nome === 'Myrdhal');
  });
  expect(resta).toBe(true);
});

test('Myrdhal già evocato con 250 PF (bug 4.87) torna a 210 (v4.89.0)', async ({ page }) => {
  await apriScheda(page);
  await page.evaluate(() => {
    const r = JSON.parse(localStorage.getItem('scheda-interattiva:v1'));
    const pg = r.personaggi[r.attivo];
    pg.alleati = [{ id: 'a1', nome: 'Myrdhal', nomeOriginale: 'Myrdhal', pfMax: 250, pfAttuali: 250, ca: 20, azioni: [] }];
    localStorage.setItem('scheda-interattiva:v1', JSON.stringify(r));
  });
  await apriScheda(page);
  await expect.poll(() => page.evaluate(() => {
    const r = JSON.parse(localStorage.getItem('scheda-interattiva:v1'));
    const a = r.personaggi[r.attivo].alleati[0];
    return [a.pfMax, a.pfAttuali];
  })).toEqual([210, 210]);
});
