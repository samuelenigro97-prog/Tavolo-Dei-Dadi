// Accessibilità automatica (axe-core, WCAG 2 A/AA) sulla scheda: contrasto dei testi,
// nome dei campi a tendina, pulsanti senza nome, controlli interattivi annidati. Il contrasto è la regola che
// più spesso si rompe cambiando tema, ambientazione o classe: si prova con le
// ambientazioni dalla palette più tenue, in chiaro e in scuro.
import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';

const axeSorgente = readFileSync('node_modules/axe-core/axe.min.js', 'utf8');
const REGOLE = ['color-contrast', 'select-name', 'button-name', 'label', 'image-alt', 'nested-interactive'];
const AMBIENTAZIONI = ['taverna', 'tempesta', 'dungeon', 'tempio', 'deserto', 'accampamento', 'tundra'];

async function apri(page, { tema, preset }) {
  await page.addInitScript(([t, p]) => {
    localStorage.setItem('scheda-interattiva:tema', t);
    localStorage.setItem('scheda-interattiva:preset-colori', p);
    localStorage.setItem('scheda-interattiva:guida-vista', '1');
    localStorage.setItem('scheda-interattiva:snooze-backup', String(Date.now() + 1e10));
  }, [tema, preset]);
  await page.goto('/');
  await page.getByText(/Tavolo dei Dadi/i).first().waitFor();
  for (let i = 0; i < 3; i++) await page.keyboard.press('Escape');
  await page.mouse.click(5, 300);
  // Le animazioni di ingresso falsano il contrasto: si attende che finiscano.
  await page.waitForTimeout(900);
}

async function violazioni(page) {
  await page.evaluate(axeSorgente);
  return page.evaluate(async (regole) => {
    const esito = await window.axe.run(document, { runOnly: regole });
    return esito.violations.map((v) => `${v.id} ×${v.nodes.length}: ${v.nodes.slice(0, 3).map((n) => `${(n.any[0]?.data?.fgColor || '')}/${(n.any[0]?.data?.bgColor || '')} ${n.html.slice(0, 80)}`).join(' | ')}`);
  }, REGOLE);
}

for (const tema of ['scuro', 'chiaro']) {
  for (const preset of AMBIENTAZIONI) {
    test(`senza violazioni di contrasto/nomi: tema ${tema}, ambientazione ${preset}`, async ({ page }) => {
      await apri(page, { tema, preset });
      expect(await violazioni(page)).toEqual([]);
    });
  }
}

test('telefono (390 px): niente violazioni, nemmeno nelle aree che scorrono', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 900 });
  await apri(page, { tema: 'scuro', preset: 'taverna' });
  await page.evaluate(axeSorgente);
  const v = await page.evaluate(async (regole) => {
    const esito = await window.axe.run(document, { runOnly: regole });
    return esito.violations.map((x) => `${x.id} ×${x.nodes.length}: ${x.nodes.slice(0, 2).map((n) => n.html.slice(0, 90)).join(' | ')}`);
  }, [...REGOLE, 'scrollable-region-focusable']);
  expect(v).toEqual([]);
});
