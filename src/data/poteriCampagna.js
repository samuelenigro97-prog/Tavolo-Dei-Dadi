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
