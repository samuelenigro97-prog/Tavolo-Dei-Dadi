import { test } from 'node:test';
import assert from 'node:assert/strict';
import worker, { gestisciSync } from '../worker/transcribe-worker.js';
import { salvaSync, caricaSync, caricaStoriaSync, normalizzaCodiceSync, generaCodiceSync, messaggioErroreSync } from '../src/utils/sync.js';

class KvFinto {
  constructor() { this.dati = new Map(); this.puts = []; }
  async get(k) { return this.dati.get(k) ?? null; }
  async put(k, v, opzioni) { this.dati.set(k, v); this.puts.push({ k, v, opzioni }); }
}

const headers = { 'Content-Type': 'application/json' };
const codice = '23456ABCDE';
const roster = { attivo: 'pg-1', personaggi: { 'pg-1': { nome: 'Vaelion', classe: 'Druido' } } };

function req(path, init = {}) {
  return new Request(`https://worker.example${path}`, { headers: { ...headers, 'cf-connecting-ip': '203.0.113.9', ...(init.headers || {}) }, ...init });
}

test('sync worker: salva e rilegge un roster con lo stesso codice', async () => {
  const kv = new KvFinto();
  const env = { SCHEDE: kv, ROOM_RATE_LIMITER: { limit: async () => ({ success: true }) } };
  const salvato = await worker.fetch(req(`/sync/${codice}`, { method: 'PUT', body: JSON.stringify({ roster, updatedAt: 111 }) }), env);
  assert.equal(salvato.status, 200);
  assert.equal(kv.puts[0].opzioni.expirationTtl, 180 * 24 * 3600);
  const letto = await worker.fetch(req(`/sync/${codice}`), env);
  assert.equal(letto.status, 200);
  const dati = await letto.json();
  assert.deepEqual(dati.roster, roster);
  assert.equal(dati.updatedAt, 111);
});

test('sync worker: codice mai usato -> 404', async () => {
  const env = { SCHEDE: new KvFinto(), ROOM_RATE_LIMITER: { limit: async () => ({ success: true }) } };
  const res = await gestisciSync(req(`/sync/${codice}`), env, headers, `/sync/${codice}`);
  assert.equal(res.status, 404);
});

test('sync worker: codice malformato -> 400', async () => {
  const env = { SCHEDE: new KvFinto(), ROOM_RATE_LIMITER: { limit: async () => ({ success: true }) } };
  const res = await gestisciSync(req('/sync/troppocorto'), env, headers, '/sync/troppocorto');
  assert.equal(res.status, 400);
});

test('sync worker: corpo senza roster valido -> 400', async () => {
  const env = { SCHEDE: new KvFinto(), ROOM_RATE_LIMITER: { limit: async () => ({ success: true }) } };
  const res = await worker.fetch(req(`/sync/${codice}`, { method: 'PUT', body: JSON.stringify({ roster: { attivo: 'x' } }) }), env);
  assert.equal(res.status, 400);
  const res2 = await worker.fetch(req(`/sync/${codice}`, { method: 'PUT', body: JSON.stringify({}) }), env);
  assert.equal(res2.status, 400);
});

test('sync worker: roster troppo grande -> 413', async () => {
  const env = { SCHEDE: new KvFinto(), ROOM_RATE_LIMITER: { limit: async () => ({ success: true }) } };
  const enorme = { attivo: 'pg-1', personaggi: { 'pg-1': { ritratto: 'x'.repeat(5 * 1024 * 1024) } } };
  const res = await worker.fetch(req(`/sync/${codice}`, { method: 'PUT', body: JSON.stringify({ roster: enorme }) }), env);
  assert.equal(res.status, 413);
});

test('sync worker: KV mancante -> 500', async () => {
  const res = await gestisciSync(req(`/sync/${codice}`), {}, headers, `/sync/${codice}`);
  assert.equal(res.status, 500);
});

test('sync worker: rate limit -> 429', async () => {
  const env = { SCHEDE: new KvFinto(), ROOM_RATE_LIMITER: { limit: async () => ({ success: false }) } };
  const res = await gestisciSync(req(`/sync/${codice}`), env, headers, `/sync/${codice}`);
  assert.equal(res.status, 429);
});

test('sync client: salva e carica senza alcun token GitHub, non tocca nulla di GitHub', async () => {
  const chiamate = [];
  let salvato = null;
  const fakeFetch = async (url, init) => {
    chiamate.push({ url, init });
    if (init?.method === 'PUT') { salvato = JSON.parse(init.body); return new Response(JSON.stringify({ ok: true, updatedAt: salvato.updatedAt }), { status: 200, headers }); }
    return new Response(JSON.stringify(salvato), { status: 200, headers });
  };
  await salvaSync('https://worker.example', codice, roster, 222, fakeFetch);
  assert.doesNotMatch(chiamate[0].url, /github/i);
  assert.doesNotMatch(chiamate[0].init.body, /github|token/i);
  const ricaricato = await caricaSync('https://worker.example', normalizzaCodiceSync(codice), fakeFetch);
  assert.deepEqual(ricaricato.roster, roster);
  assert.equal(ricaricato.updatedAt, 222);
});

test('sync client: codice generato ha sempre 10 caratteri nell\'alfabeto atteso', () => {
  for (let i = 0; i < 20; i++) {
    const c = generaCodiceSync();
    assert.match(c, /^[2-9A-HJ-NP-Z]{10}$/);
  }
});

test('sync client: messaggi di errore coprono tutti i codici usati dal worker', () => {
  for (const codiceErrore of ['SYNC_NOT_FOUND', 'SYNC_TOO_LARGE', 'SYNC_RATE_LIMITED', 'SYNC_INVALID_CODE', 'SYNC_INVALID_PAYLOAD', 'SYNC_SERVICE_UNAVAILABLE', 'qualcosa_di_ignoto']) {
    assert.equal(typeof messaggioErroreSync(codiceErrore), 'string');
    assert.ok(messaggioErroreSync(codiceErrore).length > 0);
  }
});

test('sync worker: chi non dichiara la versione di partenza non sovrascrive una copia esistente (v4.84.0)', async () => {
  const env = { SCHEDE: new KvFinto() };
  const c = '23456ABCDF';
  assert.equal((await worker.fetch(req(`/sync/${c}`, { method: 'PUT', body: JSON.stringify({ roster, updatedAt: 100 }) }), env)).status, 200, 'la prima copia si crea');
  const vecchia = await worker.fetch(req(`/sync/${c}`, { method: 'PUT', body: JSON.stringify({ roster: { ...roster, attivo: 'x' }, updatedAt: 200 }) }), env);
  assert.equal(vecchia.status, 409);
  assert.equal(JSON.parse(await (await worker.fetch(req(`/sync/${c}`), env)).text()).updatedAt, 100);
  assert.equal((await worker.fetch(req(`/sync/${c}`, { method: 'PUT', body: JSON.stringify({ roster, updatedAt: 300, baseUpdatedAt: 100 }) }), env)).status, 200);
});

test('sync worker: la copia sostituita entra nello storico (senza immagini), al massimo una ogni 15 minuti (v4.84.0)', async () => {
  const env = { SCHEDE: new KvFinto() };
  const c = '23456ABCDG';
  const t0 = Date.now() - 3600e3;
  const conRitratto = { attivo: 'pg-1', personaggi: { 'pg-1': { nome: 'Vaelion', pfAttuali: 40, ritratto: `data:image/png;base64,${'A'.repeat(5000)}` } } };
  await worker.fetch(req(`/sync/${c}`, { method: 'PUT', body: JSON.stringify({ roster: conRitratto, updatedAt: t0 }) }), env);
  const dopo = { attivo: 'pg-1', personaggi: { 'pg-1': { nome: 'Vaelion', pfAttuali: 20 } } };
  await worker.fetch(req(`/sync/${c}`, { method: 'PUT', body: JSON.stringify({ roster: dopo, updatedAt: Date.now(), baseUpdatedAt: t0 }) }), env);
  const attuale = JSON.parse(env.SCHEDE.dati.get(`sync:${c}`));
  await worker.fetch(req(`/sync/${c}`, { method: 'PUT', body: JSON.stringify({ roster: { ...dopo, attivo: 'pg-1' }, updatedAt: attuale.updatedAt + 1, baseUpdatedAt: attuale.updatedAt }) }), env);
  const storia = await caricaStoriaSync('https://worker.example', c, (url, init) => worker.fetch(new Request(url, { ...init, headers: { 'cf-connecting-ip': '203.0.113.9' } }), env));
  assert.equal(storia.length, 1, 'il secondo salvataggio ravvicinato non aggiunge copie');
  assert.equal(storia[0].updatedAt, t0);
  assert.equal(storia[0].roster.personaggi['pg-1'].pfAttuali, 40);
  assert.equal(storia[0].roster.personaggi['pg-1'].ritratto, '', 'niente immagini nello storico');
});
