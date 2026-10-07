import { test } from 'node:test';
import assert from 'node:assert/strict';
import { potaSnapshot, riassuntoPgSnapshot } from '../src/utils/cronologia.js';

const ORA = 3600e3;

test('cronologia: oltre alle ultime 10, una versione all\'ora per 2 giorni e una al giorno per 2 settimane (v4.84.0)', () => {
  const ora = Date.UTC(2026, 9, 7, 20, 0);
  // Una versione ogni 5 minuti per 6 ore, più alcune di giorni fa.
  const snaps = [];
  for (let i = 0; i < 72; i++) snaps.push({ ts: ora - i * 5 * 60e3, roster: { personaggi: { a: { nome: `v${i}` } } } });
  snaps.push({ ts: ora - 3 * 24 * ORA, roster: { personaggi: {} } });
  snaps.push({ ts: ora - 3 * 24 * ORA - ORA, roster: { personaggi: {} } });
  snaps.push({ ts: ora - 20 * 24 * ORA, roster: { personaggi: {} } });
  const tenuti = potaSnapshot(snaps, ora);
  assert.ok(tenuti.length <= 30);
  assert.equal(tenuti[0].ts, ora, 'la più recente resta');
  assert.ok(tenuti.some((s) => s.ts <= ora - 5 * ORA), 'resta una versione di 5-6 ore fa');
  assert.equal(tenuti.filter((s) => s.ts < ora - 2 * 24 * ORA && s.ts > ora - 14 * 24 * ORA).length, 1, 'una al giorno');
  assert.ok(!tenuti.some((s) => s.ts === ora - 20 * 24 * ORA), 'oltre 2 settimane si scarta');
});

test('cronologia: le copie salvate prima di una sincronizzazione restano più a lungo', () => {
  const ora = Date.UTC(2026, 9, 7, 20, 0);
  const snaps = [];
  for (let i = 0; i < 40; i++) snaps.push({ ts: ora - i * 60e3, roster: { personaggi: {} } });
  snaps.push({ ts: ora - 50 * 60e3 - 30e3, motivo: 'prima-sync', roster: { personaggi: {} } });
  assert.ok(potaSnapshot(snaps, ora).some((s) => s.motivo === 'prima-sync'));
});

test('cronologia: riassunto con PF e slot rimasti', () => {
  const pg = { nome: 'Vaelion', pfAttuali: 20, pfMax: 45, slotIncantesimo: { 1: { totale: 4, spesi: 3 }, 2: { totale: 3, spesi: 0 } } };
  assert.equal(riassuntoPgSnapshot(pg), 'Vaelion · PF 20/45 · slot 4/7');
});
