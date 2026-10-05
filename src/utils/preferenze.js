// Preferenze di aspetto e audio sincronizzate insieme ai personaggi.
//
// Prima restavano solo nel localStorage del singolo dispositivo: Mac, iPad e
// iPhone finivano con temi, ambientazioni e audio diversi. Ora viaggiano nello
// stesso invio del roster, come campo `preferenze: { ts, valori }`:
//   ts      → quando l'utente le ha cambiate l'ultima volta su un dispositivo
//             (serve a capire quale copia è più recente se i personaggi sono uguali);
//   valori  → solo le chiavi elencate qui sotto, già validate.
// Restano volutamente locali: token e codici di sincronizzazione, id del
// dispositivo, stato del combattimento, ultime date di backup/sync, guida vista.

const TEMI = ['auto', 'chiaro', 'scuro'];
const LINGUE = ['it', 'en'];
const VERSIONI_REGOLE = ['2024', '2014'];

const numero01 = (v) => typeof v === 'number' && Number.isFinite(v) && v >= 0 && v <= 1;
const testo = (v) => typeof v === 'string' && v.length <= 2000;

/** Validatori per chiave: un valore non valido viene scartato, non corretto. */
const VALIDATORI = {
  tema: (v) => TEMI.includes(v),
  presetColori: (v) => testo(v) && v.length > 0,
  temaCornici: (v) => testo(v) && v.length > 0,
  ambienteAudio: (v) => testo(v) && v.length > 0,
  volumeAudio: numero01,
  volumeEffetti: numero01,
  urlCustomAudio: testo,
  effettiSonori: (v) => typeof v === 'boolean',
  lingua: (v) => LINGUE.includes(v),
  regoleVersione: (v) => VERSIONI_REGOLE.includes(v),
  manuali: (v) => v && typeof v === 'object' && !Array.isArray(v) && Object.values(v).every((x) => typeof x === 'boolean'),
  ordineSezioni: (v) => Array.isArray(v) && v.length <= 100 && v.every(testo),
};

export const CHIAVI_PREFERENZE = Object.keys(VALIDATORI);

/**
 * Pulisce le preferenze lette da un salvataggio online: tiene solo le chiavi
 * note con un valore valido. Restituisce null se non ce n'è nessuna.
 */
export function normalizzaPreferenze(grezze) {
  if (!grezze || typeof grezze !== 'object' || Array.isArray(grezze)) return null;
  const sorgente = grezze.valori && typeof grezze.valori === 'object' ? grezze.valori : {};
  const valori = {};
  for (const chiave of CHIAVI_PREFERENZE) {
    if (chiave in sorgente && VALIDATORI[chiave](sorgente[chiave])) valori[chiave] = sorgente[chiave];
  }
  if (!Object.keys(valori).length) return null;
  return { ts: Number(grezze.ts) > 0 ? Number(grezze.ts) : 0, valori };
}
