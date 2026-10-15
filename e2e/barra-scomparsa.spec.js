// Barra in alto a scomparsa (v4.108.0): col mouse resta una striscia in cima; avvicinando il
// cursore la barra scende, allontanandolo risale. I test normali la vedono sempre aperta
// (navigator.webdriver), qui si finge un browser qualsiasi.
import { test, expect } from '@playwright/test';
import { apriScheda } from './helpers.js';

const S = process.env.FOTO_BARRA || '';

test('la barra si nasconde e scende passando col cursore in cima allo schermo', async ({ page }) => {
  await page.addInitScript(() => Object.defineProperty(Navigator.prototype, 'webdriver', { get: () => false }));
  await page.setViewportSize({ width: 1280, height: 800 });
  await apriScheda(page);
  await page.mouse.move(640, 500);
  const barra = page.locator('.barra-superiore-fissa');
  const fondo = async () => (await barra.boundingBox()).y + (await barra.boundingBox()).height;
  // Chiusa: se ne vede solo una striscia di una decina di pixel.
  await expect.poll(fondo, { timeout: 4000 }).toBeLessThan(22);
  if (S) await page.screenshot({ path: `${S}barra-chiusa.png`, clip: { x: 0, y: 0, width: 1280, height: 160 } });
  // Cursore in cima: la barra scende tutta.
  await page.mouse.move(640, 5);
  await expect.poll(fondo, { timeout: 4000 }).toBeGreaterThan(40);
  if (S) await page.screenshot({ path: `${S}barra-aperta.png`, clip: { x: 0, y: 0, width: 1280, height: 160 } });
  // Si clicca un tasto della barra senza che risalga.
  await page.getByRole('button', { name: 'Tira i dadi' }).first().hover();
  await expect.poll(fondo).toBeGreaterThan(40);
  // Cursore via: risale.
  await page.mouse.move(640, 600);
  await expect.poll(fondo, { timeout: 4000 }).toBeLessThan(22);
});

test('su telefono la barra resta sempre visibile', async ({ page }) => {
  await page.addInitScript(() => Object.defineProperty(Navigator.prototype, 'webdriver', { get: () => false }));
  await page.setViewportSize({ width: 390, height: 844 });
  await apriScheda(page);
  await page.mouse.move(200, 600);
  await page.waitForTimeout(1200);
  const box = await page.locator('.barra-superiore-fissa').boundingBox();
  expect(box.y).toBeGreaterThanOrEqual(0);
});

test('mentre la barra scorre le icone non si vedono (v4.108.2)', async ({ page }) => {
  await page.addInitScript(() => Object.defineProperty(Navigator.prototype, 'webdriver', { get: () => false }));
  await page.setViewportSize({ width: 1280, height: 800 });
  await apriScheda(page);
  await page.mouse.move(640, 500);
  const barra = page.locator('.barra-superiore-fissa');
  await expect.poll(async () => (await barra.boundingBox()).y + (await barra.boundingBox()).height, { timeout: 4000 }).toBeLessThan(22);
  // Si campiona nel browser, fotogramma per fotogramma, posizione della barra e opacità del contenuto.
  const campiona = (durata) => page.evaluate((ms) => new Promise((fine) => {
    const b = document.querySelector('.barra-superiore-fissa');
    const figlio = b.firstElementChild;
    const out = [];
    const t0 = performance.now();
    const passo = () => {
      const r = b.getBoundingClientRect();
      out.push({ fondo: r.bottom, opacita: Number(getComputedStyle(figlio).opacity) });
      if (performance.now() - t0 < ms) requestAnimationFrame(passo); else fine(out);
    };
    passo();
  }), durata);
  const altezza = (await barra.boundingBox()).height;
  await page.mouse.move(640, 4);
  const apertura = await campiona(900);
  await page.mouse.move(640, 500);
  const chiusura = await campiona(1400);
  // La barra scorre (transizione sul transform), non scatta: lo stile in linea non deve vincere.
  const transizione = await barra.evaluate((el) => {
    const cs = getComputedStyle(el);
    const prop = cs.transitionProperty.split(',').map((x) => x.trim());
    const dur = cs.transitionDuration.split(',').map((x) => parseFloat(x));
    return dur[prop.indexOf('transform')] || 0;
  });
  expect(transizione).toBeGreaterThan(0.2);
  expect(chiusura.at(-1).fondo).toBeLessThan(22);
  // Mentre è a metà corsa il contenuto è invisibile.
  for (const f of [...apertura, ...chiusura].filter((x) => x.fondo < altezza - 8)) expect(f.opacita).toBeLessThan(0.05);
});
