import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizzaPreferenze, CHIAVI_PREFERENZE } from '../src/utils/preferenze.js';
import { decidiSync, improntaRoster, improntaPersonaggi } from '../src/utils/conflittiSync.js';

const pg = { nome: 'Vaelion', pfMax: 40 };
const rosterCon = (valori, ts) => ({ attivo: 'a', personaggi: { a: pg }, preferenze: { ts, valori } });

test('normalizzaPreferenze tiene solo chiavi note con valori validi', () => {
  const p = normalizzaPreferenze({
    ts: 123,
    valori: { tema: 'scuro', lingua: 'xx', volumeAudio: 5, volumeEffetti: 0.4, intrusa: 1, effettiSonori: false },
  });
  assert.deepEqual(p, { ts: 123, valori: { tema: 'scuro', volumeEffetti: 0.4, effettiSonori: false } });
  assert.equal(normalizzaPreferenze(null), null);
  assert.equal(normalizzaPreferenze({ ts: 1, valori: { tema: 'rosa' } }), null);
  assert.ok(CHIAVI_PREFERENZE.includes('presetColori'));
});

test('l\'impronta considera i valori delle preferenze ma non il loro timestamp', () => {
  const a = rosterCon({ tema: 'scuro' }, 1);
  assert.equal(improntaRoster(a), improntaRoster(rosterCon({ tema: 'scuro' }, 999)));
  assert.notEqual(improntaRoster(a), improntaRoster(rosterCon({ tema: 'chiaro' }, 1)));
  assert.equal(improntaPersonaggi(a), improntaPersonaggi(rosterCon({ tema: 'chiaro' }, 1)));
  // Senza preferenze l'impronta resta quella di sempre.
  assert.equal(improntaRoster({ attivo: 'a', personaggi: { a: pg } }), improntaPersonaggi(a));
});

test('personaggi uguali e solo preferenze diverse: nessun conflitto, vince la più recente', () => {
  const locale = rosterCon({ tema: 'chiaro' }, 100);
  const base = { rev: 'r1', ts: 10, hash: improntaRoster(rosterCon({ tema: 'auto' }, 1)) };
  const piuRecenteOnline = decidiSync({ base, remoto: { rev: 'r2', ts: 20, roster: rosterCon({ tema: 'scuro' }, 200) }, locale });
  assert.equal(piuRecenteOnline.azione, 'carica');
  const piuRecenteQui = decidiSync({ base, remoto: { rev: 'r2', ts: 20, roster: rosterCon({ tema: 'scuro' }, 50) }, locale });
  assert.equal(piuRecenteQui.azione, 'invia');
});

test('personaggi diversi su entrambi i lati restano un conflitto vero', () => {
  const locale = rosterCon({ tema: 'chiaro' }, 100);
  locale.personaggi = { a: { ...pg, pfMax: 41 } };
  const base = { rev: 'r1', ts: 10, hash: improntaRoster(rosterCon({ tema: 'auto' }, 1)) };
  const d = decidiSync({ base, remoto: { rev: 'r2', ts: 20, roster: rosterCon({ tema: 'scuro' }, 200) }, locale });
  assert.equal(d.azione, 'conflitto');
});

test('cambio di solo tema in locale con online invariato viene inviato', () => {
  const base = { rev: 'r1', ts: 10, hash: improntaRoster(rosterCon({ tema: 'auto' }, 1)) };
  const d = decidiSync({ base, remoto: { rev: 'r1', ts: 10, roster: rosterCon({ tema: 'auto' }, 1) }, locale: rosterCon({ tema: 'scuro' }, 5) });
  assert.equal(d.azione, 'invia');
});

test('gli id degli attacchi (rigenerati a ogni normalizzazione) non contano per i personaggi', () => {
  const con = (id) => ({ attivo: 'a', personaggi: { a: { ...pg, attacchi: [{ id, nome: 'Spada', bonus: 5 }] } } });
  assert.equal(improntaPersonaggi(con(1)), improntaPersonaggi(con(1791221581443)));
  assert.notEqual(improntaPersonaggi(con(1)), improntaPersonaggi({ attivo: 'a', personaggi: { a: { ...pg, attacchi: [{ id: 1, nome: 'Spada', bonus: 6 }] } } }));
});

test('base salvata prima delle preferenze: personaggi non toccati qui, la copia online più nuova si carica (niente finto conflitto)', async () => {
  const { improntaRosterLegacy } = await import('../src/utils/conflittiSync.js');
  const locale = rosterCon({ tema: 'chiaro' }, 100);
  const remotoConPotere = { attivo: 'a', personaggi: { a: { ...pg, poteri: [{ id: 'p1', nome: 'Pugno del Tuono' }] } } };
  const base = { rev: 'r1', ts: 10, hash: improntaRosterLegacy(locale) };
  const d = decidiSync({ base, remoto: { rev: 'r2', ts: 20, roster: remotoConPotere }, locale });
  assert.equal(d.azione, 'carica');
  // Se invece i personaggi sono stati toccati qui, resta un vero conflitto.
  const toccato = { ...locale, personaggi: { a: { ...pg, pfMax: 99 } } };
  assert.equal(decidiSync({ base, remoto: { rev: 'r2', ts: 20, roster: remotoConPotere }, locale: toccato }).azione, 'conflitto');
});
