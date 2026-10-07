// Lista ampliata degli incantesimi del manuale Araldi del Segreto (Player 1.1):
// si usano quando il personaggio sblocca il relativo cerchio e si lanciano senza
// slot, spendendo 1 Segreto per livello dell'incantesimo (+1 Debito). Qui sono
// pronti da aggiungere agli incantesimi conosciuti della scheda.
import { datiIncantesimo } from './incantesimi.js';

/** [nome nel catalogo, cerchio]: due incantesimi per cerchio, dal 1° al 5°. */
export const INCANTESIMI_ARALDI = [
  ['Ammaliare Persone', 1], ['Camuffarsi', 1],
  ['Individuazione dei Pensieri', 2], ['Cecità/Sordità', 2],
  ['Parlare con i Morti', 3], ['Chiaroveggenza', 3],
  ['Occhio Arcano', 4], ['Localizza Creatura', 4],
  ['Dominare Persone', 5], ['Storia Leggendaria', 5],
];

export const NOTA_INCANTESIMO_ARALDI = 'Lista ampliata Araldi del Segreto: si lancia senza slot spendendo 1 Segreto per livello (+1 Debito).';

/** Cerchio più alto per cui la scheda ha slot (0 se non ne ha). */
function cerchioMassimo(scheda) {
  let max = 0;
  for (const [liv, v] of Object.entries(scheda?.slotIncantesimo || {})) {
    if ((Number(v?.totale) || 0) > 0) max = Math.max(max, Number(liv) || 0);
  }
  return max;
}

/**
 * Incantesimi della lista ampliata che la scheda non ha ancora, solo dei cerchi
 * già sbloccati (cerchio massimo degli slot). Sono segnati `bonus`: non contano
 * fra gli incantesimi conosciuti/preparati del limite di classe.
 */
export function incantesimiAraldiMancanti(scheda) {
  const presenti = new Set((scheda?.incantesimiLista || []).map((s) => String(datiIncantesimo(s.nome)?.nome || s.nome || '').trim().toLowerCase()));
  const sbloccato = cerchioMassimo(scheda);
  const out = [];
  for (const [nome, liv] of INCANTESIMI_ARALDI) {
    if (liv > sbloccato || presenti.has(nome.toLowerCase())) continue;
    const d = datiIncantesimo(nome) || {};
    out.push({
      id: `araldi-${liv}-${nome.toLowerCase().replace(/[^a-z]+/g, '-')}-${Math.random().toString(36).slice(2, 6)}`,
      livello: liv,
      nome,
      tempo: d.tempo || '1 Azione',
      gittata: d.gittata || '',
      note: NOTA_INCANTESIMO_ARALDI,
      scuola: d.scuola || '',
      area: d.area || '',
      danno: d.danno || '',
      tipoDanno: d.tipoDanno || '',
      preparato: true,
      bonus: true,
      conc: Boolean(d.conc),
    });
  }
  return out;
}
