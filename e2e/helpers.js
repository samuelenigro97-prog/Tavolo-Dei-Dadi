// Helper condivisi dai test e2e: aprire la scheda partendo da zero (localStorage
// pulito, quindi carica il PG di esempio "Vaelion") e chiudere i modal iniziali
// (Benvenuto + Menu) che altrimenti coprono tutto il resto della pagina.
export async function apriScheda(page) {
  await page.goto('/');
  // Attende l'app (non un tempo fisso): il titolo compare quando React ha disegnato.
  await page.getByText(/Tavolo dei Dadi/i).first().waitFor();
  const benvenuto = page.getByRole('button', { name: /^Inizia( a giocare)?$/ });
  // Il benvenuto compare solo al primo avvio: se non arriva entro un attimo si prosegue.
  await benvenuto.waitFor({ timeout: 1500 }).then(() => benvenuto.click()).catch(() => {});
  for (let i = 0; i < 3; i++) await page.keyboard.press('Escape');
  // Click fuori da eventuali modal residui (il Menu Iniziale non si chiude
  // sempre con Escape se il focus è finito altrove).
  await page.mouse.click(20, 300);
  // Nessuna finestra modale deve restare aperta sopra la scheda.
  await page.locator('[role="dialog"]:visible').first().waitFor({ state: 'detached', timeout: 1000 }).catch(() => {});
}

/**
 * Dopo un `page.reload()`: l'app riapre il menu iniziale (selettore dei personaggi)
 * a ogni avvio, quindi va chiuso prima di toccare la scheda.
 */
export async function chiudiMenuIniziale(page) {
  await page.getByText(/Tavolo dei Dadi/i).first().waitFor();
  for (let i = 0; i < 3; i++) await page.keyboard.press('Escape');
  await page.mouse.click(20, 300);
  await page.locator('[role="dialog"]:visible').first().waitFor({ state: 'detached', timeout: 1000 }).catch(() => {});
}

/** Scrolla l'elemento che contiene `testo` (case-insensitive) fino al centro dello schermo. */
export async function scrollaA(page, selettore, testo) {
  await page.evaluate(({ selettore, testo }) => {
    const re = new RegExp(testo, 'i');
    const el = Array.from(document.querySelectorAll(selettore)).find((e) => re.test(e.textContent));
    el?.scrollIntoView({ block: 'center' });
  }, { selettore, testo });
  await page.waitForTimeout(150);
}
