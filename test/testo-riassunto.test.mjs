import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync } from 'node:fs';
import { dividiFrasi, riassumiDescrizione } from '../src/utils/testo.js';

test('riassunto: non salta le frasi con "...)" o numeri decimali (v4.101.0)', () => {
  const chiaro = 'Crei un sensore invisibile in un luogo a te familiare o ovvio (dietro una porta, in un boschetto...) entro 1,5 km: per la durata vedi o senti attraverso di esso. Il sensore non può spostarsi.';
  assert.equal(riassumiDescrizione(chiaro, 1), 'Crei un sensore invisibile in un luogo a te familiare o ovvio (dietro una porta, in un boschetto...) entro 1,5 km: per la durata vedi o senti attraverso di esso.');
  assert.equal(riassumiDescrizione('Azione bonus (5.5) / Azione (5.0): recuperi 2d4 + 2 PF.', 1), 'Azione bonus (5.5) / Azione (5.0): recuperi 2d4 + 2 PF.');
  assert.deepEqual(dividiFrasi('Una. Due (es. tre). Quattro, es. cinque!'), ['Una.', 'Due (es. tre).', 'Quattro, es. cinque!']);
  assert.equal(riassumiDescrizione('Testo senza punto finale'), 'Testo senza punto finale');
  assert.equal(riassumiDescrizione(''), '');
});

test('riassunto: in tutti i testi di src/data e src/dati è sempre l\'inizio del testo, mai a metà', async () => {
  const testi = [];
  const raccogli = (v) => {
    if (typeof v === 'string') { if (v.length >= 40) testi.push(v); return; }
    if (v && typeof v === 'object') for (const k of Object.keys(v)) raccogli(v[k]);
  };
  for (const cartella of ['data', 'dati']) {
    const dir = new URL(`../src/${cartella}/`, import.meta.url);
    for (const f of readdirSync(dir).filter((x) => x.endsWith('.js'))) raccogli(await import(new URL(f, dir).href));
  }
  assert.ok(testi.length > 1000, `testi trovati: ${testi.length}`);
  const sbagliati = testi.filter((t) => {
    const r = riassumiDescrizione(t).replace(/…$/, '');
    return !t.replace(/\s+/g, ' ').trim().startsWith(r) || /^[)\],;:.!?]/.test(r);
  });
  assert.deepEqual(sbagliati.slice(0, 5), []);
});

test('talenti di Xanathar: descrizioni complete, non tagliate con "..."', async () => {
  const { TALENTI_XANATHAR } = await import('../src/dati/talenti-xanathar.js');
  assert.equal(TALENTI_XANATHAR.filter((t) => /\.\.\.$|…$/.test(String(t.desc).trim())).length, 0);
});
