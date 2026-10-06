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

// Le immagini sono lunghe (centinaia di KB in base64): la loro impronta si
// calcola una volta sola per stringa e si ricorda (bastano poche voci).
const cacheImpronteImmagini = new Map();
function improntaImmagine(dato) {
  if (typeof dato !== 'string' || !dato) return '';
  let h = cacheImpronteImmagini.get(dato);
  if (!h) {
    h = hashTesto(dato);
    if (cacheImpronteImmagini.size > 16) cacheImpronteImmagini.clear();
    cacheImpronteImmagini.set(dato, h);
  }
  return h;
}

/**
 * Personaggi con le immagini sostituite da una loro impronta breve: così un
 * ritratto o una mappa cambiati contano come modifica (e viaggiano tra i
 * dispositivi) senza dover confrontare megabyte di base64. Un personaggio
 * senza immagini resta identico a personaggiSenzaImmagini.
 */
function personaggiConImpronteImmagini(roster) {
  const personaggi = personaggiSenzaImmagini(roster);
  for (const [id, pg] of Object.entries(roster?.personaggi || {})) {
    if (!personaggi[id]) continue;
    const r = improntaImmagine(pg.ritratto);
    const m = improntaImmagine(pg.mappaCampagna);
    if (r || m) personaggi[id] = { ...personaggi[id], _immagini: { ...(r ? { ritratto: r } : {}), ...(m ? { mappa: m } : {}) } };
  }
  return personaggi;
}

function valoriPreferenze(roster) {
  const valoriPref = roster?.preferenze?.valori;
  return valoriPref && typeof valoriPref === 'object' && Object.keys(valoriPref).length > 0 ? valoriPref : null;
}

/**
 * Impronta del contenuto di un roster: personaggi (con l'impronta delle
 * immagini, non le immagini stesse) e valori delle preferenze (tema, audio...)
 * se il roster le ha, ma non il loro timestamp né i metadati di sincronizzazione:
 * due dispositivi con gli stessi dati sono uguali.
 */
export function improntaRoster(roster) {
  const pref = valoriPreferenze(roster);
  return hashTesto(jsonStabile({
    attivo: roster?.attivo || '',
    personaggi: personaggiConImpronteImmagini(roster),
    ...(pref ? { preferenze: pref } : {}),
  }));
}

/** Impronta nel formato 4.52.0–4.74.0 (immagini escluse): per le basi salvate da quelle versioni. */
export function improntaRosterSenzaImmagini(roster) {
  const pref = valoriPreferenze(roster);
  return hashTesto(jsonStabile({
    attivo: roster?.attivo || '',
    personaggi: personaggiSenzaImmagini(roster),
    ...(pref ? { preferenze: pref } : {}),
  }));
}

/** Impronta nel formato precedente alla 4.52.0 (senza preferenze): per le basi già salvate. */
export function improntaRosterLegacy(roster) {
  return hashTesto(jsonStabile({ attivo: roster?.attivo || '', personaggi: personaggiSenzaImmagini(roster) }));
}

/**
 * Come improntaRoster, ma ignora le preferenze: confronta solo i personaggi
 * (immagini comprese, tramite impronta).
 * Ignora anche gli id degli attacchi: l'app li rigenera a ogni normalizzazione
 * della copia online, quindi due schede identiche avrebbero id diversi.
 */
export function improntaPersonaggi(roster) {
  const personaggi = personaggiConImpronteImmagini(roster);
  for (const pg of Object.values(personaggi)) {
    if (Array.isArray(pg.attacchi)) pg.attacchi = pg.attacchi.map((a) => (a && typeof a === 'object' ? { ...a, id: undefined } : a));
  }
  return hashTesto(jsonStabile({ attivo: roster?.attivo || '', personaggi }));
}

/**
 * Contenuto della base, da conservare accanto all'impronta: serve all'unione a
 * tre vie (unisciTreVie). Personaggi con le impronte delle immagini al posto
 * delle immagini, niente preferenze: pochi KB anche con molti personaggi.
 */
export function contenutoBase(roster) {
  return jsonStabile({ attivo: roster?.attivo || '', personaggi: personaggiConImpronteImmagini(roster) });
}

const CAMPI_IMMAGINE = { ritratto: 'ritratto', mappaCampagna: 'mappa' };
const ASSENTE = '\u2205';

function valoreCampo(pg, campo, daBase) {
  if (CAMPI_IMMAGINE[campo]) return daBase ? (pg?._immagini?.[CAMPI_IMMAGINE[campo]] || '') : improntaImmagine(pg?.[campo]);
  let v = pg?.[campo];
  if (v === undefined) return ASSENTE;
  // Gli id degli attacchi vengono rigenerati normalizzando la copia online: non contano.
  if (campo === 'attacchi' && Array.isArray(v)) v = v.map((a) => (a && typeof a === 'object' ? { ...a, id: undefined } : a));
  return jsonStabile(v);
}

function campiDi(...pgs) {
  const campi = new Set();
  for (const pg of pgs) {
    for (const k of Object.keys(pg || {})) if (k !== '_immagini') campi.add(k);
    if (pg?._immagini?.ritratto) campi.add('ritratto');
    if (pg?._immagini?.mappa) campi.add('mappaCampagna');
  }
  return campi;
}

function pgUgualeABase(pg, base) {
  for (const campo of campiDi(pg, base)) if (valoreCampo(pg, campo, false) !== valoreCampo(base, campo, true)) return false;
  return true;
}

/**
 * Unione a tre vie, campo per campo, di ogni personaggio: se dall'ultima
 * sincronizzazione (la base) questo dispositivo e l'altro hanno cambiato parti
 * DIVERSE della scheda (es. qui il ritratto, là i PF), le due modifiche si
 * sommano senza chiedere nulla. Restituisce il roster unito, oppure null se lo
 * stesso campo è stato cambiato in modo diverso da entrambe le parti (vero
 * conflitto: decide l'utente). Un'immagine assente nella copia online conta
 * come "non cambiata" (il servizio può non averla), non come cancellata.
 */
export function unisciTreVie(contenuto, locale, remoto) {
  let base;
  try { base = JSON.parse(contenuto); } catch { return null; }
  if (!base || typeof base.personaggi !== 'object') return null;
  const bP = base.personaggi || {};
  const lP = locale?.personaggi || {};
  const rP = remoto?.personaggi || {};
  const personaggi = {};
  for (const id of new Set([...Object.keys(bP), ...Object.keys(lP), ...Object.keys(rP)])) {
    const b = bP[id];
    const l = lP[id];
    const r = rP[id];
    if (!b) {
      // Nuovo da una parte sola: si tiene. Nuovo da entrambe: solo se identico.
      if (l && r) {
        if (improntaPersonaggi({ personaggi: { x: l } }) !== improntaPersonaggi({ personaggi: { x: r } })) return null;
        personaggi[id] = l;
      } else if (l || r) personaggi[id] = l || r;
      continue;
    }
    if (!l && !r) continue;
    // Eliminato da una parte: va bene solo se l'altra non l'ha modificato.
    if (!l) { if (pgUgualeABase(r, b)) continue; return null; }
    if (!r) { if (pgUgualeABase(l, b)) continue; return null; }
    const unito = {};
    for (const campo of campiDi(l, r, b)) {
      const bv = valoreCampo(b, campo, true);
      const lv = valoreCampo(l, campo, false);
      let rv = valoreCampo(r, campo, false);
      if (CAMPI_IMMAGINE[campo] && !rv) rv = bv;
      let scelto;
      if (lv === rv || rv === bv) scelto = l[campo] !== undefined ? l[campo] : r[campo];
      else if (lv === bv) scelto = r[campo] !== undefined ? r[campo] : l[campo];
      else return null;
      if (scelto !== undefined) unito[campo] = scelto;
    }
    personaggi[id] = unito;
  }
  const attivo = personaggi[locale?.attivo] ? locale.attivo : personaggi[remoto?.attivo] ? remoto.attivo : (Object.keys(personaggi)[0] || '');
  return { attivo, personaggi };
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
 * @returns {{azione:'invia'|'niente'|'carica'|'allineato'|'unisci'|'conflitto', motivo:string, roster?:object}}
 *   invia     → la copia online è quella da cui partiamo: si può inviare
 *   niente    → come sopra, ma in locale non è cambiato nulla: inutile inviare
 *   carica    → online c'è una versione nuova e qui non ci sono modifiche: la si carica
 *   allineato → online è cambiata ma il contenuto è identico al locale: si aggiorna solo la base
 *   unisci    → online è cambiata E qui ci sono modifiche, ma a campi diversi: `roster` le contiene tutte
 *   conflitto → online è cambiata E qui ci sono modifiche allo stesso campo: decide l'utente
 */
export function decidiSync({ base, remoto, locale }) {
  const hashLocale = improntaRoster(locale);
  // Base salvata da una versione che non contava le immagini (riconoscibile perché
  // non ha il contenuto): se coincide con l'impronta senza immagini, qui non è
  // cambiato nulla dall'ultima sincronizzazione.
  const baseSenzaImmagini = Boolean(base?.hash) && !base?.contenuto && base.hash === improntaRosterSenzaImmagini(locale);
  const localeModificato = !base?.hash || (base.hash !== hashLocale && !baseSenzaImmagini);
  if (!remoto || !haPersonaggi(remoto.roster)) {
    return { azione: localeModificato || !remoto ? 'invia' : 'niente', motivo: remoto ? 'remoto-vuoto' : 'remoto-assente' };
  }
  if (!remotoCambiato(base, remoto)) {
    return { azione: localeModificato ? 'invia' : 'niente', motivo: 'remoto-invariato' };
  }
  if (improntaRoster(remoto.roster) === hashLocale) return { azione: 'allineato', motivo: 'contenuto-identico' };
  if (!localeModificato) return { azione: 'carica', motivo: 'locale-invariato' };
  // Base salvata prima della 4.52.0: la sua impronta non conosce le preferenze,
  // quindi "diverso" non significa che i personaggi siano stati toccati qui.
  if (base?.hash && base.hash === improntaRosterLegacy(locale)) return { azione: 'carica', motivo: 'base-precedente-invariata' };
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
  // Modifiche su entrambi i dispositivi ma a parti diverse della scheda: si uniscono da sole.
  if (base?.contenuto) {
    const unito = unisciTreVie(base.contenuto, locale, remoto.roster);
    if (unito) return { azione: 'unisci', motivo: 'modifiche-compatibili', roster: unito };
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
      if (b && typeof b === 'object') return { rev: b.rev || '', ts: Number(b.ts) || 0, hash: b.hash || '', ...(typeof b.contenuto === 'string' ? { contenuto: b.contenuto } : {}) };
    }
  } catch { /* base illeggibile: si riparte dal timestamp */ }
  const ts = Number(chiaveTsLegacy ? storage.getItem(chiaveTsLegacy) : 0) || 0;
  return { rev: '', ts, hash: '' };
}

export function salvaBaseSync(storage, chiaveBase, base, chiaveTsLegacy) {
  const essenziale = { rev: base?.rev || '', ts: Number(base?.ts) || 0, hash: base?.hash || '' };
  try {
    try {
      storage.setItem(chiaveBase, JSON.stringify(typeof base?.contenuto === 'string' ? { ...essenziale, contenuto: base.contenuto } : essenziale));
    } catch {
      // Spazio quasi pieno: senza il contenuto si perde solo l'unione automatica.
      storage.setItem(chiaveBase, JSON.stringify(essenziale));
    }
    if (chiaveTsLegacy && base?.ts) storage.setItem(chiaveTsLegacy, String(base.ts));
  } catch { /* spazio pieno: al peggio verrà chiesto all'utente */ }
}

/** Revisione di un Gist restituito dall'API GitHub (GET o PATCH). */
export function revisioneGist(gist) {
  return String(gist?.history?.[0]?.version || gist?.updated_at || '');
}
