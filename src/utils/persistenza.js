/** Dimensione UTF-8 reale di un testo, utile per diagnosticare la quota browser. */
export function byteUtf8(testo) {
  return new TextEncoder().encode(String(testo ?? '')).length;
}

/**
 * Salva JSON senza nascondere gli errori di quota/privacy del browser.
 * Restituisce sempre un esito, così l'interfaccia può avvisare l'utente.
 */
export function salvaJson(storage, chiave, valore) {
  const json = JSON.stringify(valore);
  const bytes = byteUtf8(json);
  try {
    storage.setItem(chiave, json);
    return { ok: true, bytes };
  } catch (errore) {
    return { ok: false, bytes, errore: errore?.name || 'StorageError' };
  }
}

export const CHIAVE_SNAPSHOT = 'scheda-interattiva:snapshots';
export const GIORNI_PROMEMORIA_BACKUP = 7;

function eQuotaEsaurita(nome) {
  return nome === 'QuotaExceededError' || nome === 'NS_ERROR_DOM_QUOTA_REACHED';
}

/**
 * Come salvaJson, ma se il browser è pieno libera spazio sacrificando gli
 * snapshot automatici più vecchi (sono copie di emergenza, il roster vale di
 * più) e riprova. Restituisce anche quanti snapshot sono stati rimossi.
 */
export function salvaJsonLiberandoSpazio(storage, chiave, valore, chiaveSnapshot = CHIAVE_SNAPSHOT) {
  let esito = salvaJson(storage, chiave, valore);
  if (esito.ok || !eQuotaEsaurita(esito.errore)) return esito;
  let snapshot;
  try { snapshot = JSON.parse(storage.getItem(chiaveSnapshot) || '[]'); } catch { snapshot = []; }
  if (!Array.isArray(snapshot)) snapshot = [];
  let rimossi = 0;
  while (snapshot.length > 0) {
    const tieni = Math.floor(snapshot.length / 2);
    rimossi += snapshot.length - tieni;
    snapshot = snapshot.slice(0, tieni);
    try {
      if (snapshot.length) storage.setItem(chiaveSnapshot, JSON.stringify(snapshot));
      else storage.removeItem(chiaveSnapshot);
    } catch { /* se nemmeno questo riesce, si prova comunque a salvare */ }
    esito = salvaJson(storage, chiave, valore);
    if (esito.ok) return { ...esito, snapshotRimossi: rimossi };
  }
  return { ...esito, snapshotRimossi: rimossi };
}

/**
 * Decide se mostrare il promemoria "fai un backup". Con la sincronizzazione
 * cloud attiva i dati hanno già una copia altrove, quindi non serve; senza,
 * lo si ricorda ogni GIORNI_PROMEMORIA_BACKUP giorni, rispettando il "Più tardi".
 */
export function deveRicordareBackup({ ultimoBackup = 0, snoozeFino = 0, primoAvvio = 0, ora = Date.now(), pgReali = 0, syncAttivo = false, giorni = GIORNI_PROMEMORIA_BACKUP } = {}) {
  if (syncAttivo || pgReali < 1) return false;
  if (ora < (Number(snoozeFino) || 0)) return false;
  // Mai fatto un backup: si conta dal primo avvio (chi ha appena installato
  // l'app non ha ancora nulla da perdere); senza data, si ricorda subito.
  const riferimento = Number(ultimoBackup) || Number(primoAvvio) || 0;
  return !riferimento || (ora - riferimento) > giorni * 24 * 3600 * 1000;
}

/**
 * Gli snapshot sono copie di emergenza frequenti: duplicare al loro interno le
 * immagini base64 esaurirebbe rapidamente la quota del browser. Le immagini
 * restano nel roster principale, nel cloud e nel backup completo.
 */
export function rosterSenzaImmagini(roster) {
  const leggero = { attivo: roster?.attivo || '', personaggi: {} };
  for (const [id, scheda] of Object.entries(roster?.personaggi || {})) {
    const { ritratto, mappaCampagna, ...resto } = scheda || {};
    leggero.personaggi[id] = resto;
  }
  return leggero;
}

/** Riaggancia le immagini correnti ai PG omonimi quando si ripristina uno snapshot. */
export function riagganciaImmagini(rosterSnapshot, rosterCorrente) {
  const ripristinato = { ...rosterSnapshot, personaggi: {} };
  for (const [id, scheda] of Object.entries(rosterSnapshot?.personaggi || {})) {
    const corrente = rosterCorrente?.personaggi?.[id] || {};
    ripristinato.personaggi[id] = {
      ...scheda,
      ...(corrente.ritratto ? { ritratto: corrente.ritratto } : {}),
      ...(corrente.mappaCampagna ? { mappaCampagna: corrente.mappaCampagna } : {}),
    };
  }
  return ripristinato;
}

/** Non lasciare che una sincronizzazione (cloud) senza immagine cancelli
 *  quella già visibile su questo dispositivo per lo stesso personaggio: il
 *  cloud vince solo se porta davvero un'immagine, altrimenti resta la locale. */
export function preservaImmaginiSeMancanti(rosterIncoming, rosterCorrente) {
  const risultato = { ...rosterIncoming, personaggi: { ...(rosterIncoming?.personaggi || {}) } };
  for (const [id, scheda] of Object.entries(risultato.personaggi)) {
    const corrente = rosterCorrente?.personaggi?.[id] || {};
    risultato.personaggi[id] = {
      ...scheda,
      ...(!scheda?.ritratto && corrente.ritratto ? { ritratto: corrente.ritratto } : {}),
      ...(!scheda?.mappaCampagna && corrente.mappaCampagna ? { mappaCampagna: corrente.mappaCampagna } : {}),
    };
  }
  return risultato;
}

const DB_IMMAGINI = 'tavolo-dei-dadi-immagini';
const STORE_IMMAGINI = 'personaggi';
const TIMEOUT_INDEXED_DB_MS = 4000;

function apriDbImmagini() {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') return reject(new Error('IndexedDB non disponibile'));
    const richiesta = indexedDB.open(DB_IMMAGINI, 1);
    let conclusa = false;
    const termina = (azione, valore) => {
      if (conclusa) return;
      conclusa = true;
      clearTimeout(timer);
      azione(valore);
    };
    const timer = setTimeout(
      () => termina(reject, new Error('IndexedDB non risponde')),
      TIMEOUT_INDEXED_DB_MS,
    );
    richiesta.onupgradeneeded = () => richiesta.result.createObjectStore(STORE_IMMAGINI);
    richiesta.onsuccess = () => termina(resolve, richiesta.result);
    richiesta.onerror = () => termina(reject, richiesta.error);
    richiesta.onblocked = () => termina(reject, new Error('IndexedDB bloccato'));
  });
}

/** Salva le immagini fuori dal localStorage, indicizzate per personaggio. */
export async function salvaImmaginiRoster(roster) {
  const db = await apriDbImmagini();
  await new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_IMMAGINI, 'readwrite');
    const store = tx.objectStore(STORE_IMMAGINI);
    for (const [id, scheda] of Object.entries(roster?.personaggi || {})) {
      if (scheda?.ritratto) store.put(scheda.ritratto, `${id}:ritratto`);
      if (scheda?.mappaCampagna) store.put(scheda.mappaCampagna, `${id}:mappaCampagna`);
    }
    tx.oncomplete = resolve;
    tx.onerror = () => reject(tx.error);
  });
  db.close();
}

/** Recupera le immagini persistenti e le riaggancia al roster in memoria. */
export async function caricaImmaginiRoster(roster) {
  const db = await apriDbImmagini();
  const risultato = { ...roster, personaggi: { ...(roster?.personaggi || {}) } };
  await Promise.all(Object.entries(risultato.personaggi).map(async ([id, scheda]) => {
    const leggi = (chiave) => new Promise((resolve) => {
      const req = db.transaction(STORE_IMMAGINI, 'readonly').objectStore(STORE_IMMAGINI).get(chiave);
      req.onsuccess = () => resolve(req.result || '');
      req.onerror = () => resolve('');
    });
    const [ritratto, mappaCampagna] = await Promise.all([leggi(`${id}:ritratto`), leggi(`${id}:mappaCampagna`)]);
    risultato.personaggi[id] = {
      ...scheda,
      ...(scheda.ritratto || !ritratto ? {} : { ritratto }),
      ...(scheda.mappaCampagna || !mappaCampagna ? {} : { mappaCampagna }),
    };
  }));
  db.close();
  return risultato;
}

export async function rimuoviImmaginePersonaggio(id, campo) {
  const db = await apriDbImmagini();
  await new Promise((resolve) => {
    const tx = db.transaction(STORE_IMMAGINI, 'readwrite');
    tx.objectStore(STORE_IMMAGINI).delete(`${id}:${campo}`);
    tx.oncomplete = resolve;
    tx.onerror = resolve;
  });
  db.close();
}
