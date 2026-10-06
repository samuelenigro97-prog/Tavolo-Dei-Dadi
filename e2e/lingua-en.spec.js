// Le spiegazioni inglesi si caricano a richiesta (file separato): in inglese i
// testi devono comparire comunque, senza dover ricaricare la pagina.
import { test, expect } from '@playwright/test';

test('in inglese le spiegazioni dei tratti compaiono in inglese', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('scheda-interattiva:lingua', 'en');
    localStorage.setItem('scheda-interattiva:guida-vista', '1');
  });
  const richiesteEn = [];
  page.on('request', (r) => { if (/spiegazioni\.en/.test(r.url())) richiesteEn.push(r.url()); });
  await page.goto('/');
  await page.getByText(/Tavolo dei Dadi/i).first().waitFor();
  for (let i = 0; i < 3; i++) await page.keyboard.press('Escape');
  await page.mouse.click(20, 300);
  expect(richiesteEn.length).toBeGreaterThan(0);
  // Un tratto della specie del PG di esempio: il testo (tooltip) è quello inglese.
  const tratto = page.getByRole('button', { name: /Sensi Acuti/i }).first();
  await expect(tratto).toBeVisible();
  await expect.poll(async () => (await tratto.getAttribute('title')) || '').toMatch(/Proficiency in one skill/i);
});

test('in italiano il file delle spiegazioni inglesi non viene nemmeno scaricato', async ({ page }) => {
  const richiesteEn = [];
  page.on('request', (r) => { if (/spiegazioni\.en/.test(r.url())) richiesteEn.push(r.url()); });
  await page.goto('/');
  await page.getByText(/Tavolo dei Dadi/i).first().waitFor();
  await page.waitForTimeout(1500);
  expect(richiesteEn).toEqual([]);
});
