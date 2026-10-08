// Poteri personalizzati: regole homebrew del tavolo (patti, benedizioni,
// maledizioni...) che non rientrano nelle classi/talenti ufficiali ma
// devono comunque contare sulla scheda. Funzioni pure, nessun React.
//
// Modello dati per personaggio (campo `poteri`, array, default []):
//   { id, nome, descrizione, attivo,
//     contatori: [{ nome, attuali, max }],       // max: null = nessun tetto
//     modificatori: [{ bersaglio, valore, fonte }] }
//
// Ogni contatore è collegato a una voce di `scheda.risorse` con reset
// 'manuale' (mai toccata da riposo breve/lungo, vedi risorseDopoRiposo):
// il collegamento è per id stabile (idRisorsaContatore), non per nome, così
// rinominare il contatore non rompe il legame. Il valore mostrato sulla
// scheda dei Poteri va SEMPRE letto dalla risorsa collegata quando esiste
// (vedi valoreContatore): così un +/- fatto da "Risorse di Classe" e uno
// fatto dalla scheda del Potere restano automaticamente allineati, senza
// dover toccare i molti punti del codice che già modificano `risorse`.

// Nota: questo file non importa nulla da scheda.js apposta (scheda.js importa
// bonusPotereBersaglio da qui per caTotale/iniziativaTotale/pfMassimiEffettivi:
// un import nell'altro verso creerebbe un ciclo tra i due moduli).

/** Bersagli supportati per i modificatori dei Poteri. */
export const BERSAGLI_MODIFICATORE_POTERE = [
  { chiave: 'velocita', label: 'Velocità', labelEn: 'Speed', unita: 'm' },
  { chiave: 'ca', label: 'CA', labelEn: 'AC', unita: '' },
  { chiave: 'iniziativa', label: 'Iniziativa', labelEn: 'Initiative', unita: '' },
  { chiave: 'attacco', label: 'Tiri per colpire', labelEn: 'Attack rolls', unita: '' },
  { chiave: 'pf_massimi', label: 'PF Massimi', labelEn: 'Max HP', unita: '' },
];

function idCasuale(prefisso) {
  return `${prefisso}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

export function nuovoPotere(dati = {}) {
  return {
    id: idCasuale('potere'),
    nome: '',
    descrizione: '',
    attivo: true,
    livelloMin: 0,
    condizione: null,
    modello: '',
    contatori: [],
    modificatori: [],
    ...dati,
  };
}

export function nuovoContatore(dati = {}) {
  return { nome: '', attuali: 0, max: null, ...dati };
}

/** Valore di `bersaglio` per un modificatore su un bersaglio libero (scritto a mano),
 * per coprire qualsiasi effetto homebrew non previsto in BERSAGLI_MODIFICATORE_POTERE. */
export const BERSAGLIO_LIBERO = 'altro';

export function nuovoModificatore(dati = {}) {
  return { bersaglio: BERSAGLI_MODIFICATORE_POTERE[0].chiave, bersaglioLibero: '', valore: 0, fonte: '', ...dati };
}

/** Come si calcola in automatico il massimo di un contatore (altrimenti vale `max`). */
export const MAX_AUTO_CONTATORE = ['competenza', 'doppia-competenza'];
/** Quando si ricarica un contatore: '' = solo a mano; altrimenti con i riposi. */
export const RICARICHE_CONTATORE = ['breve', 'lungo'];

/** Difende da dati mancanti/malformati (schede vecchie, import parziali). */
export function normalizzaPotere(p) {
  if (!p || typeof p !== 'object') return null;
  const cond = p.condizione && typeof p.condizione === 'object' && String(p.condizione.contatore || '').trim()
    ? { contatore: String(p.condizione.contatore).trim(), minimo: Number(p.condizione.minimo) || 0 }
    : null;
  return {
    id: p.id || idCasuale('potere'),
    nome: String(p.nome || ''),
    descrizione: String(p.descrizione || ''),
    attivo: p.attivo !== false,
    // Livello da cui il potere è disponibile (0 = sempre), come i privilegi di classe.
    livelloMin: Math.max(0, Math.min(20, Math.floor(Number(p.livelloMin) || 0))),
    // Si applica solo se un contatore (per nome) ha almeno quel valore: es. Debito ≥ 15.
    condizione: cond,
    // Id del modello da cui arriva (es. 'araldi-del-segreto'): serve al pannello dedicato.
    modello: p.modello ? String(p.modello) : '',
    contatori: Array.isArray(p.contatori)
      ? p.contatori.map((c) => ({
          nome: String(c?.nome || ''),
          attuali: Number(c?.attuali) || 0,
          max: (c?.max === null || c?.max === undefined || c?.max === '') ? null : Number(c.max),
          ...(RICARICHE_CONTATORE.includes(c?.ricarica) ? { ricarica: c.ricarica } : {}),
          ...(MAX_AUTO_CONTATORE.includes(c?.maxAuto) ? { maxAuto: c.maxAuto } : {}),
        }))
      : [],
    modificatori: Array.isArray(p.modificatori)
      ? p.modificatori
          .filter((m) => m && (BERSAGLI_MODIFICATORE_POTERE.some((b) => b.chiave === m.bersaglio) || m.bersaglio === BERSAGLIO_LIBERO))
          .map((m) => ({ bersaglio: m.bersaglio, bersaglioLibero: String(m.bersaglioLibero || ''), valore: Number(m.valore) || 0, fonte: String(m.fonte || '') }))
      : [],
  };
}

export function normalizzaPoteri(lista) {
  if (!Array.isArray(lista)) return [];
  return lista.map(normalizzaPotere).filter(Boolean);
}

/** Id stabile della risorsa collegata a un contatore: sopravvive a rinomine del contatore. */
export function idRisorsaContatore(potereId, indiceContatore) {
  return `potere-${potereId}-${indiceContatore}`;
}

/** Livello totale del personaggio (classe principale + multiclasse). */
export function livelloTotaleScheda(scheda) {
  const base = Number(scheda?.livello) || 1;
  const multi = Array.isArray(scheda?.multiclasse) ? scheda.multiclasse.reduce((a, m) => a + (Number(m?.livello) || 0), 0) : 0;
  return base + multi;
}

/** Un potere con `livelloMin` è disponibile solo dal livello indicato (come i privilegi di classe). */
export function potereSbloccato(potere, livelloTotale) {
  return (Number(potere?.livelloMin) || 0) <= (Number.isFinite(livelloTotale) ? livelloTotale : Infinity);
}

/** Massimo "vero" di un contatore: calcolato dalla competenza se `maxAuto`, altrimenti `max`. */
export function maxContatore(contatore, bonusCompetenza) {
  const comp = Number(bonusCompetenza) || 2;
  if (contatore?.maxAuto === 'competenza') return comp;
  if (contatore?.maxAuto === 'doppia-competenza') return comp * 2;
  return contatore?.max === null || contatore?.max === undefined ? null : Number(contatore.max);
}

/** Valore attuale di un contatore cercato per NOME fra tutti i poteri (0 se non esiste). */
export function valoreContatorePerNome(scheda, nome) {
  const cerca = String(nome || '').trim().toLowerCase();
  for (const p of normalizzaPoteri(scheda?.poteri)) {
    const i = p.contatori.findIndex((c) => String(c.nome || '').trim().toLowerCase() === cerca);
    if (i >= 0) return valoreContatore(scheda, p.id, i, p.contatori[i]).attuali;
  }
  return 0;
}

/** Un potere produce i suoi effetti se è attivo, sbloccato e (se ha una condizione) il contatore l'ha raggiunta. */
export function potereInEffetto(scheda, potere, livelloTotale = livelloTotaleScheda(scheda)) {
  if (!potere?.attivo || !potereSbloccato(potere, livelloTotale)) return false;
  if (potere.condizione) return valoreContatorePerNome(scheda, potere.condizione.contatore) >= potere.condizione.minimo;
  return true;
}

/** Tutti i modificatori dei Poteri in effetto (attivi, sbloccati, condizione raggiunta), appiattiti con la fonte. */
export function modificatoriPoteriAttivi(scheda) {
  const livello = livelloTotaleScheda(scheda);
  return normalizzaPoteri(scheda?.poteri)
    .filter((p) => potereInEffetto(scheda, p, livello))
    .flatMap((p) => p.modificatori.map((m) => ({ ...m, fonte: m.fonte || p.nome || '' })));
}

/** Somma dei modificatori attivi per un bersaglio (es. 'ca', 'velocita', 'iniziativa', 'pf_massimi'). */
export function bonusPotereBersaglio(scheda, bersaglio) {
  return modificatoriPoteriAttivi(scheda)
    .filter((m) => m.bersaglio === bersaglio)
    .reduce((tot, m) => tot + (Number(m.valore) || 0), 0);
}

// iniziativaTotale e pfMassimiEffettivi vivono in scheda.js: usano
// punteggioCaratteristica, che è definita lì (vedi nota in cima al file).

/**
 * Valore attuale/massimo "vero" di un contatore: se esiste già una risorsa
 * collegata in `scheda.risorse`, i suoi numeri vincono (sono la fonte più
 * recente, es. dopo un +/- fatto da Risorse di Classe); altrimenti si usano
 * quelli scritti sul contatore stesso (prima sincronizzazione, o export che
 * ha perso le risorse).
 */
export function valoreContatore(scheda, potereId, indiceContatore, contatore) {
  const idRis = idRisorsaContatore(potereId, indiceContatore);
  const risorsa = (Array.isArray(scheda?.risorse) ? scheda.risorse : []).find((r) => r?.id === idRis);
  if (risorsa) return { attuali: Number(risorsa.attuali) || 0, max: risorsa.max === null || risorsa.max === undefined ? null : Number(risorsa.max) };
  return { attuali: Number(contatore?.attuali) || 0, max: contatore?.max === null || contatore?.max === undefined ? null : Number(contatore.max) };
}

/**
 * Ricalcola `scheda.risorse` in base ai Poteri correnti: aggiunge/aggiorna
 * (nome, max, reset: 'manuale') la risorsa collegata a ogni contatore di ogni
 * potere ATTIVO e già sbloccato (livelloMin), preservandone gli `attuali` se la risorsa esiste già
 * (rispetta le modifiche fatte da Risorse di Classe); rimuove le risorse
 * collegate a poteri disattivati/eliminati o a contatori non più presenti,
 * cosi' un potere spento o cancellato smette di comparire ovunque.
 * Va chiamata insieme a ogni `aggiorna({ poteri: ... })`, nello stesso patch.
 */
export function sincronizzaRisorsePoteri(poteri, risorseAttuali, livelloTotale = Infinity, bonusCompetenza = 2) {
  const risorseBase = Array.isArray(risorseAttuali) ? risorseAttuali : [];
  const listaPoteri = normalizzaPoteri(poteri);
  const mappaEsistenti = new Map(risorseBase.map((r) => [r?.id, r]));

  const risorsePoteri = [];
  for (const p of listaPoteri) {
    if (!p.attivo || !potereSbloccato(p, livelloTotale)) continue;
    p.contatori.forEach((c, i) => {
      const id = idRisorsaContatore(p.id, i);
      const esistente = mappaEsistenti.get(id);
      const max = maxContatore(c, bonusCompetenza);
      const attualiBase = esistente ? Number(esistente.attuali) || 0 : (Number(c.attuali) || 0);
      risorsePoteri.push({
        id,
        nome: c.nome || p.nome || 'Potere',
        max,
        attuali: max === null ? attualiBase : Math.min(attualiBase, max),
        // Con `ricarica` il contatore si ripristina con i riposi come le risorse di classe.
        reset: c.ricarica || 'manuale',
      });
    });
  }

  // Le risorse "normali" (non legate a un potere) restano intatte; quelle
  // legate a un potere che non esiste più (o è stato disattivato/il
  // contatore rimosso) vengono tolte, sostituite dall'elenco appena
  // ricostruito (`risorsePoteri`) che riflette solo i poteri attivi correnti.
  const risorseNonPotere = risorseBase.filter((r) => !String(r?.id || '').startsWith('potere-'));
  return [...risorseNonPotere, ...risorsePoteri];
}

/** Cerca un contatore per NOME: { potere, indice, contatore, attuali, max } oppure null. */
export function trovaContatore(scheda, nome) {
  const cerca = String(nome || '').trim().toLowerCase();
  for (const p of normalizzaPoteri(scheda?.poteri)) {
    const indice = p.contatori.findIndex((c) => String(c.nome || '').trim().toLowerCase() === cerca);
    if (indice >= 0) {
      const contatore = p.contatori[indice];
      const { attuali, max } = valoreContatore(scheda, p.id, indice, contatore);
      return { potere: p, indice, contatore, attuali, max };
    }
  }
  return null;
}

/**
 * Patch (`{ poteri, risorse }`) che somma `delta` a uno o più contatori per nome,
 * rispettando il massimo e senza scendere sotto zero. Aggiorna sia il contatore
 * del potere sia la risorsa collegata, così le due viste restano allineate.
 * `variazioni`: [{ nome, delta }]. Restituisce null se nessun contatore esiste.
 */
export function patchVariaContatori(scheda, variazioni) {
  let poteri = normalizzaPoteri(scheda?.poteri);
  let risorse = Array.isArray(scheda?.risorse) ? scheda.risorse : [];
  let toccato = false;
  for (const { nome, delta } of variazioni) {
    const t = trovaContatore({ ...scheda, poteri, risorse }, nome);
    if (!t) continue;
    toccato = true;
    const voluto = t.attuali + (Number(delta) || 0);
    const nuovo = Math.max(0, t.max === null || t.max === undefined ? voluto : Math.min(voluto, t.max));
    const idRis = idRisorsaContatore(t.potere.id, t.indice);
    poteri = poteri.map((p) => (p.id === t.potere.id
      ? { ...p, contatori: p.contatori.map((c, i) => (i === t.indice ? { ...c, attuali: nuovo } : c)) }
      : p));
    risorse = risorse.map((r) => (r?.id === idRis ? { ...r, attuali: nuovo } : r));
  }
  return toccato ? { poteri, risorse } : null;
}

/**
 * Contatori dei Poteri "in gioco" (potere attivo e già sbloccato al livello), uno per nome
 * (il primo, come trovaContatore): servono al riquadro rapido sotto Risorse di classe.
 * Ogni voce: { potere, indice, contatore, attuali, max }.
 */
export function contatoriInGioco(scheda) {
  const livello = livelloTotaleScheda(scheda);
  const visti = new Set();
  const voci = [];
  for (const p of normalizzaPoteri(scheda?.poteri)) {
    if (!p.attivo || !potereSbloccato(p, livello)) continue;
    p.contatori.forEach((c, indice) => {
      const chiave = String(c.nome || '').trim().toLowerCase();
      if (!chiave || visti.has(chiave)) return;
      visti.add(chiave);
      const { attuali, max } = valoreContatore(scheda, p.id, indice, c);
      voci.push({ potere: p, indice, contatore: c, attuali, max });
    });
  }
  return voci;
}
