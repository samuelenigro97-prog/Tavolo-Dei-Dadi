// Cronologia versioni (punti di ripristino salvati su questo dispositivo).
// Prima se ne tenevano solo gli ultimi 12, uno ogni 5 minuti: dopo un'ora di
// gioco la versione di qualche ora prima non c'era più. Ora si tengono le più
// recenti, poi una all'ora per due giorni e una al giorno per due settimane;
// le copie salvate prima di una sincronizzazione restano più a lungo.

const ORA = 3600 * 1000;
const GIORNO = 24 * ORA;

export const MOTIVI_SNAPSHOT = {
  'prima-sync': { it: 'prima di caricare la versione online', en: 'before loading the online version' },
  'online-sostituita': { it: 'copia online sostituita da questa', en: 'online copy replaced by this device' },
  ripristino: { it: 'prima di un ripristino', en: 'before a restore' },
};

/**
 * Sceglie quali punti di ripristino tenere. `snaps` ordinati dal più recente.
 * @returns {Array} gli snapshot da conservare, dal più recente
 */
export function potaSnapshot(snaps, ora = Date.now(), massimo = 30) {
  const ordinati = [...(snaps || [])].filter((s) => s && s.roster).sort((a, b) => (b.ts || 0) - (a.ts || 0));
  const tenuti = new Set();
  // Le ultime 10, qualunque siano.
  ordinati.slice(0, 10).forEach((s) => tenuti.add(s));
  // Le copie salvate prima di una sincronizzazione: fino a 10, per 30 giorni.
  ordinati.filter((s) => s.motivo && ora - (s.ts || 0) < 30 * GIORNO).slice(0, 10).forEach((s) => tenuti.add(s));
  // Le altre: la più recente di ogni ora per 2 giorni, di ogni giorno per 14 giorni.
  const fasce = new Set();
  for (const s of ordinati) {
    const eta = ora - (s.ts || 0);
    let fascia = null;
    if (eta < 2 * GIORNO) fascia = `h${Math.floor((s.ts || 0) / ORA)}`;
    else if (eta < 14 * GIORNO) fascia = `g${Math.floor((s.ts || 0) / GIORNO)}`;
    if (!fascia || fasce.has(fascia)) continue;
    fasce.add(fascia);
    tenuti.add(s);
  }
  return ordinati.filter((s) => tenuti.has(s)).slice(0, massimo);
}

/** Riassunto di un personaggio per riconoscere la versione giusta (PF, slot spesi...). */
export function riassuntoPgSnapshot(pg) {
  if (!pg) return '';
  const parti = [String(pg.nome || '—')];
  const pfMax = Number(pg.pfMax) || 0;
  if (pfMax) parti.push(`PF ${Number(pg.pfAttuali) || 0}/${pfMax}`);
  const slot = pg.slotIncantesimo || null;
  if (slot && typeof slot === 'object') {
    let max = 0;
    let usati = 0;
    for (const v of Object.values(slot)) {
      if (!v || typeof v !== 'object') continue;
      max += Number(v.totale) || 0;
      usati += Number(v.spesi) || 0;
    }
    if (max) parti.push(`slot ${Math.max(0, max - usati)}/${max}`);
  }
  return parti.join(' · ');
}
