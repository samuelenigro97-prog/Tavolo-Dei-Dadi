import { test } from 'node:test';
import assert from 'node:assert/strict';
import { byteUtf8, salvaJson, rosterSenzaImmagini, riagganciaImmagini } from '../src/utils/persistenza.js';

test('persistenza: misura correttamente il testo UTF-8', () => {
  assert.equal(byteUtf8('abc'), 3);
  assert.equal(byteUtf8('🗺️'), new TextEncoder().encode('🗺️').length);
});

test('persistenza: segnala il salvataggio riuscito', () => {
  const dati = new Map();
  const storage = { setItem: (k, v) => dati.set(k, v) };
  const esito = salvaJson(storage, 'pg', { nome: 'Eroe' });
  assert.equal(esito.ok, true);
  assert.equal(dati.get('pg'), '{"nome":"Eroe"}');
});

test('persistenza: non nasconde una quota esaurita', () => {
  const storage = { setItem: () => { throw new DOMException('pieno', 'QuotaExceededError'); } };
  const esito = salvaJson(storage, 'pg', { mappa: 'x'.repeat(100) });
  assert.equal(esito.ok, false);
  assert.equal(esito.errore, 'QuotaExceededError');
  assert.ok(esito.bytes > 100);
});

test('persistenza: gli snapshot non duplicano ritratto e mappa', () => {
  const roster = { attivo: 'pg-1', personaggi: { 'pg-1': {
    nome: 'Eroe', ritratto: 'data:image/jpeg;base64,FOTO',
    mappaCampagna: 'data:image/jpeg;base64,MAPPA', mappaMarker: { x: 20, y: 30 },
  } } };
  const leggero = rosterSenzaImmagini(roster);
  assert.equal(leggero.personaggi['pg-1'].ritratto, undefined);
  assert.equal(leggero.personaggi['pg-1'].mappaCampagna, undefined);
  assert.deepEqual(leggero.personaggi['pg-1'].mappaMarker, { x: 20, y: 30 });
});

test('persistenza: ripristinare uno snapshot conserva le immagini correnti del PG', () => {
  const snapshot = { attivo: 'pg-1', personaggi: { 'pg-1': { nome: 'Eroe prima' } } };
  const corrente = { attivo: 'pg-1', personaggi: { 'pg-1': {
    nome: 'Eroe adesso', ritratto: 'data:image/jpeg;base64,FOTO',
    mappaCampagna: 'data:image/jpeg;base64,MAPPA',
  } } };
  const ripristinato = riagganciaImmagini(snapshot, corrente);
  assert.equal(ripristinato.personaggi['pg-1'].nome, 'Eroe prima');
  assert.equal(ripristinato.personaggi['pg-1'].ritratto, corrente.personaggi['pg-1'].ritratto);
  assert.equal(ripristinato.personaggi['pg-1'].mappaCampagna, corrente.personaggi['pg-1'].mappaCampagna);
});

test('ambientazione: al primo accesso sceglie un preset casuale scenografico e mai default (scheda bianca)', async () => {
  const { PRESET_COLORI, ambientazioneCasuale } = await import('../src/ui/tema.js');
  assert.ok(Array.isArray(PRESET_COLORI));
  assert.ok(PRESET_COLORI.length >= 10);

  const ambientazioniScenografiche = PRESET_COLORI.filter((p) => p.id && p.id !== 'default').map((p) => p.id);
  for (let i = 0; i < 50; i++) {
    const scelta = ambientazioneCasuale();
    assert.notEqual(scelta, 'default', 'Non deve mai restituire la scheda bianca (default)');
    assert.ok(ambientazioniScenografiche.includes(scelta), `Deve essere una delle ambientazioni scenografiche note: ${scelta}`);
  }
});


test('persistenza: a quota esaurita libera gli snapshot e riprova', async () => {
  const { salvaJsonLiberandoSpazio, CHIAVE_SNAPSHOT } = await import('../src/utils/persistenza.js');
  const dati = new Map([[CHIAVE_SNAPSHOT, JSON.stringify(Array.from({ length: 8 }, (_, i) => ({ ts: i })))]]);
  const storage = {
    getItem: (k) => dati.get(k) ?? null,
    removeItem: (k) => dati.delete(k),
    setItem: (k, v) => {
      if (k === 'pg' && dati.has(CHIAVE_SNAPSHOT) && JSON.parse(dati.get(CHIAVE_SNAPSHOT)).length > 2) {
        throw new DOMException('pieno', 'QuotaExceededError');
      }
      dati.set(k, v);
    },
  };
  const esito = salvaJsonLiberandoSpazio(storage, 'pg', { nome: 'Eroe' });
  assert.equal(esito.ok, true);
  assert.equal(esito.snapshotRimossi, 6);
  assert.equal(JSON.parse(dati.get(CHIAVE_SNAPSHOT)).length, 2);
  assert.equal(JSON.parse(dati.get(CHIAVE_SNAPSHOT))[0].ts, 0, 'tiene i più recenti (in testa)');
});

test('persistenza: se anche senza snapshot non basta, segnala l\'errore', async () => {
  const { salvaJsonLiberandoSpazio, CHIAVE_SNAPSHOT } = await import('../src/utils/persistenza.js');
  const dati = new Map([[CHIAVE_SNAPSHOT, '[{"ts":1},{"ts":2}]']]);
  const storage = {
    getItem: (k) => dati.get(k) ?? null,
    removeItem: (k) => dati.delete(k),
    setItem: (k, v) => { if (k === 'pg') throw new DOMException('pieno', 'QuotaExceededError'); dati.set(k, v); },
  };
  const esito = salvaJsonLiberandoSpazio(storage, 'pg', { nome: 'Eroe' });
  assert.equal(esito.ok, false);
  assert.equal(esito.errore, 'QuotaExceededError');
  assert.equal(dati.has(CHIAVE_SNAPSHOT), false);
});

test('persistenza: errori diversi dalla quota non toccano gli snapshot', async () => {
  const { salvaJsonLiberandoSpazio, CHIAVE_SNAPSHOT } = await import('../src/utils/persistenza.js');
  const dati = new Map([[CHIAVE_SNAPSHOT, '[{"ts":1}]']]);
  const storage = {
    getItem: (k) => dati.get(k) ?? null,
    removeItem: (k) => dati.delete(k),
    setItem: () => { throw new DOMException('no', 'SecurityError'); },
  };
  const esito = salvaJsonLiberandoSpazio(storage, 'pg', {});
  assert.equal(esito.ok, false);
  assert.equal(dati.get(CHIAVE_SNAPSHOT), '[{"ts":1}]');
});

test('persistenza: promemoria backup solo senza sync, dopo 7 giorni e fuori dallo snooze', async () => {
  const { deveRicordareBackup } = await import('../src/utils/persistenza.js');
  const giorno = 24 * 3600 * 1000;
  const ora = 100 * giorno;
  assert.equal(deveRicordareBackup({ ora, pgReali: 1 }), true, 'mai fatto un backup');
  assert.equal(deveRicordareBackup({ ora, pgReali: 0 }), false, 'nessun PG reale');
  assert.equal(deveRicordareBackup({ ora, pgReali: 2, syncAttivo: true }), false, 'sync attivo');
  assert.equal(deveRicordareBackup({ ora, pgReali: 1, ultimoBackup: ora - 3 * giorno }), false, 'backup recente');
  assert.equal(deveRicordareBackup({ ora, pgReali: 1, ultimoBackup: ora - 8 * giorno }), true, 'backup vecchio');
  assert.equal(deveRicordareBackup({ ora, pgReali: 1, ultimoBackup: ora - 8 * giorno, snoozeFino: ora + giorno }), false, 'in snooze');
  assert.equal(deveRicordareBackup({ ora, pgReali: 1, ultimoBackup: String(ora - 8 * giorno), snoozeFino: String(ora - 1) }), true, 'valori letti come stringhe');
  assert.equal(deveRicordareBackup({ ora, pgReali: 1, primoAvvio: ora - 2 * giorno }), false, 'appena installata');
  assert.equal(deveRicordareBackup({ ora, pgReali: 1, primoAvvio: ora - 9 * giorno }), true, 'installata da più di 7 giorni');
  assert.equal(deveRicordareBackup({ ora, pgReali: 1, primoAvvio: ora - 9 * giorno, ultimoBackup: ora - giorno }), false, 'il backup vale più del primo avvio');
});
