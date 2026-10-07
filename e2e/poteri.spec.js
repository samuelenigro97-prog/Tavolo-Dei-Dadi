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

  test('"Da modello" aggiunge Araldi del Segreto: pannello dedicato, contatori collegati, niente doppioni', async ({ page }) => {
    await attivaManuale(page);
    await page.getByRole('button', { name: 'Da modello' }).click();
    const elenco = page.getByTestId('modelli-poteri');
    await expect(elenco.getByText('Araldi del Segreto', { exact: true })).toBeVisible();
    await elenco.getByRole('button', { name: /Aggiungi \d+ poteri/ }).click();

    const pannello = page.getByTestId('araldi-pannello');
    await expect(pannello).toBeVisible();
    // Il PG di esempio è di 10° livello: Braccare! (14°) resta bloccato, Inquisire (6°) è disponibile.
    await expect(pannello.getByText('Liv. 14', { exact: true })).toBeVisible();
    await expect(pannello.getByText('— non ancora raggiunto')).toHaveCount(1);
    await expect(pannello.getByText('Liv. 6', { exact: true })).toBeVisible();
    const risorse = await page.evaluate(() => {
      const st = JSON.parse(localStorage.getItem('scheda-interattiva:v1'));
      return st.personaggi[st.attivo].risorse.map((r) => r.nome);
    });
    expect(risorse).toEqual(expect.arrayContaining(['Segreti', 'Debito', 'Affabilità', 'Inquisire', 'Trasferire Empatico']));
    expect(risorse).not.toContain('Braccare!');
    // I contatori dei Poteri stanno nella sezione Poteri, non in Risorse di classe; passando il
    // mouse sul nome del privilegio si legge cosa fa.
    await expect(page.getByTestId('araldi-privilegi').getByText('Inquisire', { exact: true })).toHaveAttribute('title', /Occhi: hai vantaggio/);
    await expect(page.getByText('Forma Selvatica').first()).toBeVisible();
    expect(await page.evaluate(() => [...document.querySelectorAll('.profilo-risorse-box strong')].map((e) => e.textContent).filter((t) => /Segreti|Inquisire|Affabilità/.test(t)).length)).toBe(0);

    // Una seconda volta non aggiunge doppioni.
    await page.getByRole('button', { name: 'Da modello' }).click();
    await expect(page.getByTestId('modelli-poteri').getByRole('button', { name: 'Già aggiunto' })).toBeDisabled();
  });

  test('manuale 1.1: Myrdhal fra le spese di Segreti, Veglia con "Vista Pura", testi vecchi aggiornati da soli (v4.86.0)', async ({ page }) => {
    await attivaManuale(page);
    // Una scheda con i testi della versione precedente del manuale.
    await page.getByRole('button', { name: 'Da modello' }).click();
    await page.getByTestId('modelli-poteri').getByRole('button', { name: /Aggiungi \d+ poteri/ }).click();
    await page.evaluate(() => {
      const r = JSON.parse(localStorage.getItem('scheda-interattiva:v1'));
      const pg = r.personaggi[r.attivo];
      for (const p of pg.poteri) {
        if (p.nome.endsWith('Soglie del Debito')) p.descrizione = p.descrizione.replace('Vista Pura', 'Truesight');
        if (p.nome.endsWith('Segreti e Debito')) p.descrizione = p.descrizione.split('\n').filter((l) => !/Myrdhal/.test(l)).join('\n');
      }
      localStorage.setItem('scheda-interattiva:v1', JSON.stringify(r));
    });
    await apriScheda(page);
    const testi = await page.evaluate(() => {
      const r = JSON.parse(localStorage.getItem('scheda-interattiva:v1'));
      return r.personaggi[r.attivo].poteri.filter((p) => p.modello === 'araldi-del-segreto').map((p) => p.descrizione).join('\n');
    });
    expect(testi).toContain('Vista Pura 9 m');
    expect(testi).not.toContain('Truesight');
    expect(testi).toContain('Myrdhal (10 Segreti, anche di gruppo)');
    const pannello = page.getByTestId('araldi-pannello');
    await expect(pannello.getByRole('button', { name: /^Myrdhal/ })).toBeDisabled();
    await expect(pannello.getByTestId('myrdhal-gruppo')).toContainText('10 Segreti');
    await expect(pannello.getByTestId('soglia-70')).toContainText('Vista Pura 9 m');
  });

  test('pannello Araldi: "Aggiungi gli incantesimi del manuale" mette la lista ampliata fra i conosciuti, senza contare nei limiti (v4.88.0)', async ({ page }) => {
    await attivaManuale(page);
    await page.getByRole('button', { name: 'Da modello' }).click();
    await page.getByTestId('modelli-poteri').getByRole('button', { name: /Aggiungi \d+ poteri/ }).click();
    const lista = () => page.evaluate(() => {
      const r = JSON.parse(localStorage.getItem('scheda-interattiva:v1'));
      return (r.personaggi[r.attivo].incantesimiLista || []).filter((s) => /Lista ampliata Araldi/.test(s.note || '')).map((s) => `${s.livello} ${s.nome}`);
    });
    const pannello = page.getByTestId('araldi-pannello');
    const bottone = pannello.getByTestId('aggiungi-incantesimi-araldi');
    // La comparsa automatica ha già aggiunto quelli dei cerchi sbloccati; se qualcuno manca, il pulsante lo rimette.
    await expect.poll(async () => (await lista()).length, { timeout: 8000 }).toBeGreaterThan(0);
    const presenti = await lista();
    expect(presenti).toEqual(expect.arrayContaining(['1 Camuffarsi', '5 Storia Leggendaria']));
    await expect(bottone).toHaveCount(0);
    // Tolto un incantesimo, il pulsante lo ripropone.
    await page.evaluate(() => {
      const r = JSON.parse(localStorage.getItem('scheda-interattiva:v1'));
      const pg = r.personaggi[r.attivo];
      pg.incantesimiLista = pg.incantesimiLista.filter((s) => s.nome !== 'Occhio Arcano');
      localStorage.setItem('scheda-interattiva:v1', JSON.stringify(r));
    });
    await apriScheda(page);
    await expect(bottone).toContainText('(1)');
    await bottone.click();
    await expect.poll(lista).toEqual(expect.arrayContaining(['4 Occhio Arcano']));
    await expect(bottone).toHaveCount(0);
  });

  test('pannello Araldi: perle degli usi, Debito che sale, soglie e +1 CA automatico a Debito 15', async ({ page }) => {
    await attivaManuale(page);
    await page.getByRole('button', { name: 'Da modello' }).click();
    await page.getByTestId('modelli-poteri').getByRole('button', { name: /Aggiungi \d+ poteri/ }).click();
    const pannello = page.getByTestId('araldi-pannello');
    const stato = () => page.evaluate(() => {
      const st = JSON.parse(localStorage.getItem('scheda-interattiva:v1'));
      const pg = st.personaggi[st.attivo];
      const r = (n) => pg.risorse.find((x) => x.nome === n)?.attuali;
      return { affabilita: r('Affabilità'), inquisire: r('Inquisire'), debito: r('Debito'), segreti: r('Segreti') };
    });
    const caIniziale = await page.evaluate(() => document.body.innerText.match(/CLASSE ARMATURA\s*(\d+)/i)?.[1]);
    // Il PG di esempio ha già un Debito suo (5): il modello lo riusa, non ne crea un secondo.
    const debito0 = (await stato()).debito;
    expect(await page.evaluate(() => JSON.parse(localStorage.getItem('scheda-interattiva:v1')).personaggi['pg-vaelion'].risorse.filter((r) => r.nome === 'Debito').length)).toBe(1);

    // Una perla di Inquisire = un uso: il Debito sale di 1.
    await pannello.getByTestId('perla-Inquisire').first().click();
    await expect.poll(async () => (await stato()).inquisire).toBe(2);
    await expect.poll(async () => (await stato()).debito).toBe(debito0 + 1);
    // Cliccare una perla spenta ripristina l'uso (senza toccare il Debito).
    await pannello.getByTestId('perla-Inquisire').last().click();
    await expect.poll(async () => (await stato()).inquisire).toBe(3);
    await expect.poll(async () => (await stato()).debito).toBe(debito0 + 1);

    // Debito a 15: il +1 CA di Occhio Risvegliato scatta da solo.
    for (let i = debito0 + 1; i < 15; i++) await pannello.getByRole('button', { name: 'Debito +1' }).click();
    await expect.poll(async () => (await stato()).debito).toBe(15);
    await expect(pannello.getByTestId('soglia-15')).toHaveAttribute('data-raggiunta', 'si');
    await expect(pannello.getByTestId('soglia-35')).toHaveAttribute('data-raggiunta', 'no');
    const caFinale = await page.evaluate(() => document.body.innerText.match(/CLASSE ARMATURA\s*(\d+)/i)?.[1]);
    expect(caIniziale).toBeTruthy();
    expect(Number(caFinale)).toBe(Number(caIniziale) + 1);

    // Segreti: spesa con Debito (Incantare costa 1 Segreto per cerchio e dà 1 Debito).
    await pannello.getByRole('button', { name: 'Segreti +1' }).click();
    await pannello.getByRole('button', { name: 'Segreti +1' }).click();
    await expect.poll(async () => (await stato()).segreti).toBe(2);
    await pannello.getByRole('button', { name: /^Lancia/ }).click();
    await expect.poll(async () => (await stato()).segreti).toBe(1);
    await expect.poll(async () => (await stato()).debito).toBe(16);
    // Inquisire → Cervello: la prova superata dà 1 Segreto.
    await pannello.getByRole('button', { name: /^Cervello/ }).click();
    await expect.poll(async () => (await stato()).segreti).toBe(2);
  });

  test('poteri degli Araldi aggiunti con la versione vecchia: si aggiornano da soli e mostrano il pannello anche col manuale spento', async ({ page }) => {
    await page.evaluate(() => {
      const st = JSON.parse(localStorage.getItem('scheda-interattiva:v1'));
      const pg = st.personaggi[st.attivo];
      pg.poteri.push(
        { id: 'old-1', nome: 'Araldi del Segreto · Segreti e Debito', descrizione: 'x', attivo: true, contatori: [{ nome: 'Segreti', attuali: 0, max: null }], modificatori: [] },
        { id: 'old-2', nome: 'Inquisire (6° livello)', descrizione: 'Occhi: test', attivo: true, contatori: [{ nome: 'Inquisire', attuali: 3, max: 3 }], modificatori: [] },
      );
      localStorage.setItem('scheda-interattiva:v1', JSON.stringify(st));
    });
    await page.reload();
    await page.waitForTimeout(1200);
    for (let i = 0; i < 3; i++) await page.keyboard.press('Escape');
    await page.mouse.click(20, 300);
    await expect(page.getByTestId('araldi-pannello')).toBeVisible();
    const pg = await page.evaluate(() => { const st = JSON.parse(localStorage.getItem('scheda-interattiva:v1')); return st.personaggi[st.attivo].poteri.find((p) => p.id === 'old-2'); });
    expect(pg.modello).toBe('araldi-del-segreto');
    expect(pg.livelloMin).toBe(6);
    expect(pg.contatori[0].ricarica).toBe('lungo');
  });

  test('un contatore senza totale accetta qualsiasi numero e il + non lo blocca', async ({ page }) => {
    const debito = () => page.evaluate(() => { const st = JSON.parse(localStorage.getItem('scheda-interattiva:v1')); return st.personaggi[st.attivo].risorse.find((r) => r.nome === 'Debito').attuali; });
    const campo = page.locator('span', { hasText: /^Debito/ }).locator('span').filter({ hasText: /^5$/ }).first();
    await campo.click();
    await page.keyboard.press('Control+A');
    await page.keyboard.type('1000');
    await page.keyboard.press('Enter');
    await expect.poll(debito).toBe(1000);
    // Il + della scheda del potere (il riquadro rapido a sinistra ha il suo, vedi sotto).
    await page.getByRole('button', { name: 'Debito +1' }).last().click();
    await expect.poll(debito).toBe(1001);
  });

  test('riquadro Poteri sotto Risorse di classe: stessi contatori, separati dalle risorse di classe', async ({ page }) => {
    const box = page.getByTestId('poteri-risorse');
    await expect(box).toBeVisible();
    await expect(box.getByText('Debito', { exact: true })).toBeVisible();
    const debito = () => page.evaluate(() => { const st = JSON.parse(localStorage.getItem('scheda-interattiva:v1')); return st.personaggi[st.attivo].risorse.find((r) => r.nome === 'Debito').attuali; });
    const prima = await debito();
    await box.getByRole('button', { name: 'Debito +1' }).click();
    await expect.poll(debito).toBe(prima + 1);
    await box.getByRole('button', { name: 'Debito −1' }).click();
    await expect.poll(debito).toBe(prima);
  });

  test('riquadro Poteri con gli Araldi: una perla di Inquisire spende un uso e aggiunge Debito', async ({ page }) => {
    await attivaManuale(page);
    await page.getByRole('button', { name: 'Da modello' }).click();
    await page.getByTestId('modelli-poteri').getByRole('button', { name: /Aggiungi \d+ poteri/ }).click();
    const box = page.getByTestId('poteri-risorse');
    const stato = () => page.evaluate(() => {
      const st = JSON.parse(localStorage.getItem('scheda-interattiva:v1'));
      const pg = st.personaggi[st.attivo];
      const r = (n) => pg.risorse.find((x) => x.nome === n)?.attuali;
      return { inquisire: r('Inquisire'), debito: r('Debito') };
    });
    const prima = await stato();
    await box.getByRole('button', { name: 'Usa Inquisire' }).first().click();
    await expect.poll(async () => (await stato()).inquisire).toBe(prima.inquisire - 1);
    await expect.poll(async () => (await stato()).debito).toBe(prima.debito + 1);
    // Il pannello Araldi della sezione Poteri vede lo stesso valore.
    await expect(page.getByTestId('araldi-pannello').getByTestId('perla-Inquisire').nth(prima.inquisire - 1)).toHaveAttribute('aria-pressed', 'true');
  });
});
