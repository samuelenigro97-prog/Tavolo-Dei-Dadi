// Profilo su desktop: i riquadri della colonna sinistra finiscono alla stessa
// altezza di quelli della colonna centrale (Competenze con Punti Ferita, Risorse
// di classe con CA/Riposo, Poteri con l'ultima fila dei riquadri vitali).
// Si allunga (min-height) il riquadro più corto dei due. Il centrale però solo se
// mancano pochi pixel: con una sezione aperta a sinistra (es. Competenze) la
// colonna centrale non viene stirata. Su mobile la colonna sinistra è
// `display: contents` e non si tocca nulla.
import { useEffect, useState } from 'react';

const COPPIE = [
  ['.profilo-competenze-box .sezione', '.profilo-pf-box'],
  ['.profilo-risorse-box:not(.profilo-poteri-box) .sezione', '.vitali-difesa'],
  ['.profilo-poteri-box .sezione', '.pm-tier-3'],
];
const MAX_ALLUNGO_CENTRALE = 40;

/** min-height che dà all'elemento un'altezza esterna (bordo compreso) di `altezza` px. */
function impostaAltezza(el, altezza) {
  const cs = getComputedStyle(el);
  const extra = cs.boxSizing === 'border-box' ? 0
    : ['paddingTop', 'paddingBottom', 'borderTopWidth', 'borderBottomWidth'].reduce((t, k) => t + (parseFloat(cs[k]) || 0), 0);
  el.style.minHeight = `${Math.max(0, Math.round(altezza - extra))}px`;
}

function allinea(griglia) {
  const sinistra = griglia.querySelector('.profilo-col-sinistra');
  const desktop = sinistra && getComputedStyle(sinistra).display !== 'contents';
  const coppie = COPPIE.map(([a, b]) => [griglia.querySelector(a), griglia.querySelector(b)]);
  // Si riparte dalle altezze naturali, poi si allinea dall'alto in basso: ogni
  // riquadro allungato sposta quelli sotto, che si misurano dopo.
  for (const el of coppie.flat()) if (el?.style.minHeight) el.style.minHeight = '';
  if (!desktop) return;
  // Allungare un riquadro centrale può spostare quelli sopra (la colonna ha altezza
  // fissa): si ripete finché nessuna coppia cambia più (le altezze crescono soltanto).
  for (let giro = 0; giro < 4; giro++) {
    let cambiato = false;
    for (const [box, meta] of coppie) {
      if (!box || !meta) continue;
      const rb = box.getBoundingClientRect();
      const rm = meta.getBoundingClientRect();
      const scarto = Math.round(rm.bottom - rb.bottom);
      if (scarto > 0) { impostaAltezza(box, rm.bottom - rb.top); cambiato = true; }
      else if (scarto < 0 && -scarto <= MAX_ALLUNGO_CENTRALE) { impostaAltezza(meta, rb.bottom - rm.top); cambiato = true; }
    }
    if (!cambiato) break;
  }
}

/** Restituisce il ref da mettere su `.profilo-griglia`. */
export function useAllineaProfilo() {
  const [griglia, setGriglia] = useState(null);
  useEffect(() => {
    if (!griglia || typeof ResizeObserver === 'undefined') return undefined;
    let frame = 0;
    const pianifica = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => allinea(griglia));
    };
    const osservatore = new ResizeObserver(pianifica);
    const osserva = () => {
      osservatore.disconnect();
      osservatore.observe(griglia);
      for (const sel of ['.profilo-main', '.pm-tier-1', '.profilo-col-sinistra', ...COPPIE.flat()]) {
        const el = griglia.querySelector(sel);
        if (el) osservatore.observe(el);
      }
    };
    osserva();
    // Riquadri che compaiono o spariscono (es. Poteri) cambiano gli elementi da osservare.
    const mutazioni = new MutationObserver(() => { osserva(); pianifica(); });
    mutazioni.observe(griglia, { childList: true, subtree: true });
    window.addEventListener('resize', pianifica);
    pianifica();
    return () => {
      cancelAnimationFrame(frame);
      osservatore.disconnect();
      mutazioni.disconnect();
      window.removeEventListener('resize', pianifica);
    };
  }, [griglia]);
  return setGriglia;
}
