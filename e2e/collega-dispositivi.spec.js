// Collegare due dispositivi con il codice di sincronizzazione (v4.74.0): il
// pulsante "Crea un codice" mancava, quindi il codice si poteva solo inserire.
// Il Worker è simulato con una memoria condivisa fra i due "dispositivi"
// (due contesti del browser, cioè due localStorage separati).
import { test, expect } from '@playwright/test';

const dispositivoGiusto = {
  attivo: 'pg-v',
  personaggi: { 'pg-v': { nome: 'Vaelion Giusto', classe: 'Druido', livello: 10, esperienza: 75000 } },
};
const dispositivoVecchio = {
  attivo: 'pg-v',
  personaggi: { 'pg-v': { nome: 'Vaelion Vecchio', classe: 'Druido', livello: 10, esperienza: 64000 } },
};

async function simulaWorker(context, memoria) {
  await context.route('**/sync/*', async (route) => {
    const req = route.request();
    const codice = req.url().split('/sync/')[1];
    if (req.method() === 'PUT') {
      const corpo = JSON.parse(req.postData() || '{}');
      memoria[codice] = { roster: corpo.roster, updatedAt: corpo.updatedAt };
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ ok: true, updatedAt: corpo.updatedAt }) });
      return;
    }
    if (!memoria[codice]) {
      await route.fulfill({ status: 404, contentType: 'application/json', body: JSON.stringify({ error: 'SYNC_NOT_FOUND' }) });
      return;
    }
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(memoria[codice]) });
  });
}

async function apri(context, roster) {
  const page = await context.newPage();
  await page.addInitScript((r) => {
    if (sessionStorage.getItem('preparato')) return;
    sessionStorage.setItem('preparato', '1');
    localStorage.setItem('scheda-interattiva:guida-vista', '1');
    localStorage.setItem('scheda-interattiva:v1', JSON.stringify(r));
  }, roster);
  await page.goto('/');
  await page.getByText(/Tavolo dei Dadi/i).first().waitFor();
  for (let i = 0; i < 3; i++) await page.keyboard.press('Escape');
  await page.mouse.click(5, 300);
  return page;
}

test('crea il codice sul dispositivo giusto, inseriscilo sull’altro: arrivano le schede giuste', async ({ browser }) => {
  const memoria = {};
  const ctxA = await browser.newContext();
  const ctxB = await browser.newContext();
  await simulaWorker(ctxA, memoria);
  await simulaWorker(ctxB, memoria);

  // Dispositivo A (quello con la scheda giusta): crea il codice.
  const a = await apri(ctxA, dispositivoGiusto);
  await a.getByRole('button', { name: 'Sincronizzazione', exact: true }).first().click();
  await a.getByTestId('crea-codice-sync').click();
  await expect.poll(() => Object.keys(memoria).length, { timeout: 8000 }).toBe(1);
  const codice = Object.keys(memoria)[0];
  expect(memoria[codice].roster.personaggi['pg-v'].nome).toBe('Vaelion Giusto');
  await expect(a.getByText(/Sincronizzato ·/)).toBeVisible();

  // Dispositivo B (dati vecchi): inserisce lo stesso codice e riceve la scheda giusta.
  const b = await apri(ctxB, dispositivoVecchio);
  await b.getByRole('button', { name: 'Sincronizzazione', exact: true }).first().click();
  await b.getByPlaceholder('XXXXX-XXXXX').fill(codice);
  await b.getByPlaceholder('XXXXX-XXXXX').press('Enter');
  await expect.poll(() => b.evaluate(() => JSON.parse(localStorage.getItem('scheda-interattiva:v1')).personaggi['pg-v'].nome), { timeout: 8000 }).toBe('Vaelion Giusto');

  await ctxA.close();
  await ctxB.close();
});

test('un ritratto nuovo caricato su un dispositivo arriva anche sull’altro', async ({ browser }) => {
  test.setTimeout(90000);
  const memoria = {};
  const ctxA = await browser.newContext();
  const ctxB = await browser.newContext();
  await simulaWorker(ctxA, memoria);
  await simulaWorker(ctxB, memoria);
  const a = await apri(ctxA, dispositivoGiusto);
  await a.getByRole('button', { name: 'Sincronizzazione', exact: true }).first().click();
  await a.getByTestId('crea-codice-sync').click();
  await expect.poll(() => Object.keys(memoria).length, { timeout: 8000 }).toBe(1);
  const codice = Object.keys(memoria)[0];
  await a.keyboard.press('Escape');
  await a.getByRole('button', { name: 'Chiudi', exact: true }).click({ timeout: 1500 }).catch(() => {});

  const b = await apri(ctxB, dispositivoVecchio);
  await b.getByRole('button', { name: 'Sincronizzazione', exact: true }).first().click();
  await b.getByPlaceholder('XXXXX-XXXXX').fill(codice);
  await b.getByPlaceholder('XXXXX-XXXXX').press('Enter');
  await expect.poll(() => b.evaluate(() => JSON.parse(localStorage.getItem('scheda-interattiva:v1')).personaggi['pg-v'].nome), { timeout: 8000 }).toBe('Vaelion Giusto');

  // Sul dispositivo A si carica un ritratto nuovo (un PNG 2×2 rosso).
  const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAIAAAD91JpzAAAAFklEQVR4nGP8z8DAwMDAxMDAwMDAAAANHQEDasKb6QAAAABJRU5ErkJggg==', 'base64');
  // Il secondo campo immagine della pagina è quello del ritratto (il primo è la mappa).
  await a.locator('input[type="file"][accept="image/*"]').nth(1).setInputFiles({ name: 'vaelion.png', mimeType: 'image/png', buffer: png });
  await expect.poll(() => memoria[codice]?.roster?.personaggi?.['pg-v']?.ritratto?.slice(0, 15) || '', { timeout: 30000 }).toBe('data:image/jpeg');
  const ritrattoNuovo = memoria[codice].roster.personaggi['pg-v'].ritratto;

  // Il dispositivo B torna sull'app: ricontrolla online e prende il ritratto nuovo.
  await b.evaluate(() => window.dispatchEvent(new Event('online')));
  await expect.poll(() => b.evaluate(() => Array.from(document.images).some((img) => img.src.startsWith('data:image/jpeg'))), { timeout: 15000 }).toBe(true);
  expect(await b.evaluate((src) => Array.from(document.images).some((img) => img.src === src), ritrattoNuovo)).toBe(true);

  await ctxA.close();
  await ctxB.close();
});

test('su telefono la nuvola nella barra in alto mostra la sincronizzazione e apre la scheda Online', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.getByText(/Tavolo dei Dadi/i).first().waitFor();
  for (let i = 0; i < 3; i++) await page.keyboard.press('Escape');
  await page.mouse.click(5, 300);
  await page.getByTestId('cloud-mobile').click();
  await expect(page.getByTestId('crea-codice-sync')).toBeVisible();
});
