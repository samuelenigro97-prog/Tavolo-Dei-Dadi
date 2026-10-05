// Rilevamento dei conflitti di sincronizzazione.
//
// Problema: un dispositivo rimasto indietro (scheda aperta da ore, PWA mai
// ricaricata, dati locali vecchi) non deve MAI sovrascrivere in silenzio un
// salvataggio online più recente fatto da un altro dispositivo.
//
// Soluzione: ogni dispositivo ricorda la "base", cioè la versione online da
// cui partono le sue modifiche:
//   rev  → identificativo della versione online (revisione del Gist, oppure
//          l'updatedAt restituito dal servizio a codice);
//   ts   → _updatedAt/updatedAt letto o scritto l'ultima volta (fallback per
//          i dispositivi aggiornati da una versione che non salvava rev);
//   hash → impronta del roster locale in quel momento, per capire se da
//          allora sul dispositivo è cambiato qualcosa.
// Prima di ogni invio si rilegge la versione online e si decide con
// decidiSync() se inviare, caricare, non fare nulla o chiedere all'utente.

/** JSON con chiavi ordinate: due roster uguali danno sempre lo stesso testo. */
function jsonStabile(valore) {
  if (valore === null || typeof valore !== 'object') return JSON.stringify(valore) ?? 'null';
  if (Array.isArray(valore)) return `[${valore.map((v) => (v === undefined ? 'null' : jsonStabile(v))).join(',')}]`;
  const chiavi = Object.keys(valore).filter((k) => valore[k] !== undefined).sort();
  return `{${chiavi.map((k) => `${JSON.stringify(k)}:${jsonStabile(valore[k])}`).join(',')}}`;
}

function hashTesto(testo) {
  // FNV-1a a 32 bit + lunghezza: basta per riconoscere "uguale / diverso".
  let h = 0x811c9dc5;
  for (let i = 0; i < testo.length; i++) {
    h ^= testo.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return `${h.toString(16).padStart(8, '0')}-${testo.length}`;
}

function personaggiSenzaImmagini(roster) {
  const personaggi = {};
  for (const [id, pg] of Object.entries(roster?.personaggi || {})) {
    if (!pg || typeof pg !== 'object') continue;
    const { ritratto: _r, mappaCampagna: _m, ...resto } = pg;
    personaggi[id] = resto;
  }
  return personaggi;
}

/**
 * Impronta del contenuto di un roster. Esclude le immagini (vivono in
 * IndexedDB e il cloud può non averle) e i metadati di sincronizzazione.
 * Include i valori delle preferenze (tema, audio...) se il roster le ha, ma
 * non il loro timestamp: due dispositivi con gli stessi valori sono uguali.
 */
export function improntaRoster(roster) {
  const valoriPref = roster?.preferenze?.valori;
  const conPref = valoriPref && typeof valoriPref === 'object' && Object.keys(valoriPref).length > 0;
  return hashTesto(jsonStabile({
    attivo: roster?.attivo || '',
    personaggi: personaggiSenzaImmagini(roster),
    ...(conPref ? { preferenze: valoriPref } : {}),
  }));
}

/**
 * Come improntaRoster, ma ignora le preferenze: confronta solo i personaggi.
 * Ignora anche gli id degli attacchi: l'app li rigenera a ogni normalizzazione
 * della copia online, quindi due schede identiche avrebbero id diversi.
 */
export function improntaPersonaggi(roster) {
  const personaggi = personaggiSenzaImmagini(roster);
  for (const pg of Object.values(personaggi)) {
    if (Array.isArray(pg.attacchi)) pg.attacchi = pg.attacchi.map((a) => (a && typeof a === 'object' ? { ...a, id: undefined } : a));
  }
  return hashTesto(jsonStabile({ attivo: roster?.attivo || '', personaggi }));
}

/** La versione online è cambiata rispetto alla base di questo dispositivo? */
export function remotoCambiato(base, remoto) {
  if (!remoto) return false;
  const b = base || {};
  if (b.rev && remoto.rev) return String(remoto.rev) !== String(b.rev);
  const tsBase = Number(b.ts) || 0;
  const tsRemoto = Number(remoto.ts) || 0;
  // Nessuna base nota: il dispositivo non ha mai visto questa copia online.
  if (!tsBase) return true;
  return tsRemoto !== tsBase;
}

function haPersonaggi(roster) {
  return Boolean(roster && Object.keys(roster.personaggi || {}).length);
}

/**
 * Decide cosa fare prima di un invio (o all'avvio / al ritorno sull'app).
 *
 * @param {object} p
 * @param {{rev?:string, ts?:number, hash?:string}|null} p.base  versione online da cui partono le modifiche locali
 * @param {{rev?:string, ts?:number, roster?:object}|null} p.remoto  versione online attuale (null = non esiste ancora)
 * @param {object} p.locale  roster di questo dispositivo
 * @returns {{azione:'invia'|'niente'|'carica'|'allineato'|'conflitto', motivo:string}}
 *   invia     → la copia online è quella da cui partiamo: si può inviare
 *   niente    → come sopra, ma in locale non è cambiato nulla: inutile inviare
 *   carica    → online c'è una versione nuova e qui non ci sono modifiche: la si carica
 *   allineato → online è cambiata ma il contenuto è identico al locale: si aggiorna solo la base
 *   conflitto → online è cambiata E qui ci sono modifiche: decide l'utente
 */
export function decidiSync({ base, remoto, locale }) {
  const hashLocale = improntaRoster(locale);
  const localeModificato = !base?.hash || base.hash !== hashLocale;
  if (!remoto || !haPersonaggi(remoto.roster)) {
    return { azione: localeModificato || !remoto ? 'invia' : 'niente', motivo: remoto ? 'remoto-vuoto' : 'remoto-assente' };
  }
  if (!remotoCambiato(base, remoto)) {
    return { azione: localeModificato ? 'invia' : 'niente', motivo: 'remoto-invariato' };
  }
  if (improntaRoster(remoto.roster) === hashLocale) return { azione: 'allineato', motivo: 'contenuto-identico' };
  if (!localeModificato) return { azione: 'carica', motivo: 'locale-invariato' };
  if (!haPersonaggi(locale)) return { azione: 'carica', motivo: 'locale-vuoto' };
  // Personaggi identici e differenze solo nelle preferenze (tema, audio...):
  // non è un vero conflitto, vince la copia cambiata più di recente.
  if (improntaPersonaggi(remoto.roster) === improntaPersonaggi(locale)) {
    const tsRemoto = Number(remoto.roster?.preferenze?.ts) || 0;
    const tsLocale = Number(locale?.preferenze?.ts) || 0;
    return tsRemoto >= tsLocale
      ? { azione: 'carica', motivo: 'solo-preferenze-online' }
      : { azione: 'invia', motivo: 'solo-preferenze-locali' };
  }
  return { azione: 'conflitto', motivo: 'modifiche-su-entrambi' };
}

function nomePg(pg, id) {
  return String(pg?.nome || '').trim() || id;
}

/** Riepilogo leggibile delle differenze, per la finestra di conflitto. */
export function riepilogoConflitto(locale, remoto) {
  const pl = locale?.personaggi || {};
  const pr = remoto?.personaggi || {};
  const soloQui = [];
  const soloOnline = [];
  const diversi = [];
  for (const [id, pg] of Object.entries(pl)) {
    if (!pr[id]) soloQui.push(nomePg(pg, id));
    else if (improntaRoster({ personaggi: { x: pg } }) !== improntaRoster({ personaggi: { x: pr[id] } })) diversi.push(nomePg(pg, id));
  }
  for (const [id, pg] of Object.entries(pr)) if (!pl[id]) soloOnline.push(nomePg(pg, id));
  return {
    nQui: Object.keys(pl).length,
    nOnline: Object.keys(pr).length,
    soloQui,
    soloOnline,
    diversi,
  };
}

/** Legge la base salvata; se manca, ricava quel che si può dal vecchio timestamp. */
export function leggiBaseSync(storage, chiaveBase, chiaveTsLegacy) {
  try {
    const grezza = storage.getItem(chiaveBase);
    if (grezza) {
      const b = JSON.parse(grezza);
      if (b && typeof b === 'object') return { rev: b.rev || '', ts: Number(b.ts) || 0, hash: b.hash || '' };
    }
  } catch { /* base illeggibile: si riparte dal timestamp */ }
  const ts = Number(chiaveTsLegacy ? storage.getItem(chiaveTsLegacy) : 0) || 0;
  return { rev: '', ts, hash: '' };
}

export function salvaBaseSync(storage, chiaveBase, base, chiaveTsLegacy) {
  try {
    storage.setItem(chiaveBase, JSON.stringify({ rev: base?.rev || '', ts: Number(base?.ts) || 0, hash: base?.hash || '' }));
    if (chiaveTsLegacy && base?.ts) storage.setItem(chiaveTsLegacy, String(base.ts));
  } catch { /* spazio pieno: al peggio verrà chiesto all'utente */ }
}

/** Revisione di un Gist restituito dall'API GitHub (GET o PATCH). */
export function revisioneGist(gist) {
  return String(gist?.history?.[0]?.version || gist?.updated_at || '');
}
