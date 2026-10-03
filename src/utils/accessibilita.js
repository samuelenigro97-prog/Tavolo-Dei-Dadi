/**
 * Accessibilità da tastiera condivisa dall'app.
 *
 * Quasi tutti i modali dell'app si chiudono toccando lo sfondo scuro
 * (`onClick` sul backdrop con `e.target === e.currentTarget`). Escape fa la
 * stessa cosa sul livello più in alto: così vale per menu, Menu Hub e modali
 * senza dover collegare a mano ogni singolo stato.
 */

/** Tra gli sfondi a tutto schermo candidati, sceglie quello visivamente in cima. */
export function overlayInCima(candidati) {
  let migliore = null;
  candidati.forEach((c, ordine) => {
    if (!c || !c.copreSchermo || c.ignora) return;
    const z = Number.isFinite(c.zIndex) ? c.zIndex : 0;
    if (!migliore || z > migliore.z || (z === migliore.z && ordine > migliore.ordine)) {
      migliore = { el: c.el, z, ordine };
    }
  });
  return migliore ? migliore.el : null;
}

/** Elementi in cui Escape ha già un significato proprio (annullare la modifica). */
export function eCampoModificabile(el) {
  if (!el) return false;
  const tag = String(el.tagName || '').toUpperCase();
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || el.isContentEditable === true;
}

/** Trova nel DOM lo sfondo modale più in alto (fixed, a tutto schermo). */
export function trovaBackdropInCima(doc = globalThis.document, win = globalThis.window) {
  if (!doc || !win) return null;
  const vw = win.innerWidth;
  const vh = win.innerHeight;
  const candidati = Array.from(doc.querySelectorAll('div')).map((el) => {
    const st = win.getComputedStyle(el);
    if (st.position !== 'fixed') return null;
    const r = el.getBoundingClientRect();
    return {
      el,
      zIndex: parseInt(st.zIndex, 10),
      copreSchermo: r.left <= 1 && r.top <= 1 && r.width >= vw - 2 && r.height >= vh - 2,
      ignora: st.pointerEvents === 'none' || st.visibility === 'hidden' || el.getAttribute('aria-hidden') === 'true',
    };
  });
  return overlayInCima(candidati);
}

/**
 * Gli elementi non-<button> marcati role="button" (chip, badge, intestazioni
 * pieghevoli) devono attivarsi anche con Invio o Spazio, come un vero pulsante.
 */
export function deveAttivareDaTastiera({ key, tagName, role } = {}) {
  if (key !== 'Enter' && key !== ' ') return false;
  if (role !== 'button') return false;
  const tag = String(tagName || '').toUpperCase();
  return tag !== 'BUTTON' && tag !== 'A' && tag !== 'INPUT' && tag !== 'TEXTAREA' && tag !== 'SELECT';
}
