// Poteri della campagna impostati per Vaelion: il Potere del Patrono (Debito,
// Maschera +3 m) e i privilegi degli Araldi del Segreto. Servono a rimetterli
// con un tocco se un personaggio li ha persi (es. collegando un dispositivo
// che non li aveva). Il Debito del Patrono resta l'unico Debito: gli Araldi lo
// usano invece di crearne un secondo, come fa il pulsante "Da modello".
import { VAELION_JSON } from './esempi.js';
import { MODELLI_POTERI, ID_MODELLO_ARALDI } from './modelliPoteri.js';
import { nuovoPotere, normalizzaPoteri } from '../rules/poteri.js';

export function costruisciPoteriCampagna() {
  const patrono = normalizzaPoteri(VAELION_JSON.poteri);
  const modello = MODELLI_POTERI.find((m) => m.id === ID_MODELLO_ARALDI);
  const nomiContatori = new Set(patrono.flatMap((p) => p.contatori.map((c) => String(c.nome).trim().toLowerCase())));
  const araldi = (modello?.poteri || []).map((p) => nuovoPotere({
    ...p,
    modello: ID_MODELLO_ARALDI,
    contatori: (p.contatori || []).filter((c) => !nomiContatori.has(String(c.nome).trim().toLowerCase())),
  }));
  return normalizzaPoteri([...patrono, ...araldi]);
}

const chiaveNome = (n) => String(n || '').trim().toLowerCase();

/**
 * I Poteri della campagna mancano o sono incompleti? Vero se non c'è nessun
 * potere, oppure se c'è il Debito ma non i privilegi degli Araldi del Segreto
 * (es. dopo una sincronizzazione che ha riportato una copia vecchia).
 */
export function poteriCampagnaIncompleti(scheda) {
  const poteri = Array.isArray(scheda?.poteri) ? scheda.poteri : [];
  if (!poteri.length) return true;
  if (poteri.some((p) => p?.modello === ID_MODELLO_ARALDI)) return false;
  return poteri.some((p) => (p?.contatori || []).some((c) => chiaveNome(c?.nome) === 'debito'));
}

/**
 * Poteri della campagna uniti a quelli della scheda: i contatori con lo stesso
 * nome tengono il valore attuale (es. Debito 6 resta 6), i poteri che la
 * campagna rimpiazza si tolgono, gli altri poteri della scheda restano.
 * `valoreAttuale(potere, indice, contatore)` legge il valore in gioco.
 */
export function unisciPoteriCampagna(poteriScheda, valoreAttuale = (p, i, c) => c?.attuali) {
  const campagna = costruisciPoteriCampagna();
  const valori = new Map();
  for (const p of normalizzaPoteri(poteriScheda)) {
    p.contatori.forEach((c, i) => {
      const k = chiaveNome(c.nome);
      if (k && !valori.has(k)) valori.set(k, Number(valoreAttuale(p, i, c)) || 0);
    });
  }
  const nomiPoteri = new Set(campagna.map((p) => chiaveNome(p.nome)));
  const nomiContatori = new Set(campagna.flatMap((p) => p.contatori.map((c) => chiaveNome(c.nome))));
  const aggiornati = campagna.map((p) => ({
    ...p,
    contatori: p.contatori.map((c) => (valori.has(chiaveNome(c.nome)) ? { ...c, attuali: valori.get(chiaveNome(c.nome)) } : c)),
  }));
  const altri = normalizzaPoteri(poteriScheda).filter((p) => !nomiPoteri.has(chiaveNome(p.nome))
    && !(p.contatori.length && p.contatori.every((c) => nomiContatori.has(chiaveNome(c.nome)))));
  return normalizzaPoteri([...aggiornati, ...altri]);
}
