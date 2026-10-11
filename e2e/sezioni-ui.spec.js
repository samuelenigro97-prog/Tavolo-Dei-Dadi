// Comportamento generico delle sezioni collassabili (<details class="sezione">):
// gli angoli decorati devono restare visibili E nella posizione giusta anche
// a sezione chiusa. Regressione già capitata due volte in questa sessione:
// prima sparivano del tutto, poi (fix incompleto) restavano ma capovolti
// (gli angoli "bottom" finivano sopra quelli "top").
import { test, expect } from '@playwright/test';
import { apriScheda } from './helpers.js';

test.describe('Sezioni: angoli decorati', () => {
  test.beforeEach(async ({ page }) => {
    await apriScheda(page);
  });

  test('gli angoli restano nell\'ordine giusto (top sopra, bottom sotto) quando la sezione è chiusa', async ({ page }) => {
    const dettaglio = page.locator('details.sezione').filter({ hasText: 'Compagni, famigli ed evocazioni' });
    await dettaglio.locator('summary').click();
    await expect(dettaglio).not.toHaveAttribute('open');

    const box = await dettaglio.evaluate((d) => {
      const wrapper = d.parentElement;
      const angoli = Array.from(wrapper.querySelectorAll(':scope > .angolo-ornamento'));
      const rects = angoli.map((a) => ({ cls: a.className, top: a.getBoundingClientRect().top }));
      return rects;
    });

    const tl = box.find((b) => b.cls.includes('angolo-tl'));
    const bl = box.find((b) => b.cls.includes('angolo-bl'));
    expect(tl).toBeTruthy();
    expect(bl).toBeTruthy();
    // L'angolo in alto deve stare sopra (coordinata Y minore) di quello in basso.
    expect(tl.top).toBeLessThan(bl.top);
  });

  test('gli angoli sono visibili (non display:none) a sezione chiusa', async ({ page }) => {
    const dettaglio = page.locator('details.sezione').filter({ hasText: 'Compagni, famigli ed evocazioni' });
    await dettaglio.locator('summary').click();

    const displays = await dettaglio.evaluate((d) => {
      const wrapper = d.parentElement;
      return Array.from(wrapper.querySelectorAll(':scope > .angolo-ornamento')).map((a) => getComputedStyle(a).display);
    });
    expect(displays.length).toBe(4);
    expect(displays.every((d) => d !== 'none')).toBe(true);
  });

  test('i campi dell\'anagrafica e le rispettive etichette sono perfettamente allineati a filo a sinistra (diff 0px)', async ({ page }) => {
    const measurements = await page.evaluate(() => {
      const rows = [];
      document.querySelectorAll('.campi-anagrafica').forEach((row) => {
        const cols = [];
        row.querySelectorAll(':scope > div').forEach((col, colIdx) => {
          const box = col.querySelector('.campo-modulo-box');
          const label = col.querySelector('.campo-modulo-label');
          const content = box ? (box.querySelector('select') || box.firstElementChild || box) : null;
          const labelRect = label?.getBoundingClientRect();
          const contentRect = content?.getBoundingClientRect();
          cols.push({
            colIdx,
            diff: Math.abs((contentRect?.x ?? 0) - (labelRect?.x ?? 0)),
          });
        });
        rows.push(cols);
      });
      return rows;
    });

    for (const cols of measurements) {
      for (const col of cols) {
        expect(col.diff).toBeLessThan(0.5);
      }
    }
  });

  test('i 4 riquadri vitali (Competenza, Iniziativa, Velocità, Sfinimento) hanno la stessa altezza dei 4 riquadri sotto (Visione, Percezione, Resistenze, Condizioni)', async ({ page }) => {
    const heights = await page.evaluate(() => {
      const getH = (text) => {
        const needle = text.toLowerCase();
        const el = Array.from(document.querySelectorAll('.vital-box')).find((b) => b.textContent.toLowerCase().includes(needle));
        return el ? Math.round(el.getBoundingClientRect().height) : null;
      };
      return {
        comp: getH('BONUS DI COMPETENZA'),
        iniz: getH('INIZIATIVA'),
        vel: getH('VELOCITÀ'),
        sfin: getH('SFINIMENTO'),
        vis: getH('VISIONE'),
        perc: getH('PERCEZIONE PASSIVA'),
        res: getH('RESISTENZE'),
        cond: getH('CONDIZIONI'),
      };
    });

    expect(heights.comp).toBeTruthy();
    expect(heights.vis).toBeTruthy();
    expect(heights.comp).toBe(heights.iniz);
    expect(heights.iniz).toBe(heights.vel);
    expect(heights.vel).toBe(heights.sfin);
    expect(Math.abs(heights.comp - heights.vis)).toBeLessThanOrEqual(2);
  });
});


