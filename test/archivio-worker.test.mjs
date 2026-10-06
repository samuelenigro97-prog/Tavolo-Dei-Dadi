// Archivio del Master (Worker, rotte /pg): limite di richieste sulle scritture
// aperte, chiave DM nell'header (e ancora nell'indirizzo per le vecchie app).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import worker from '../worker/transcribe-worker.js';

class KvFinto {
  constructor() { this.dati = new Map(); this.puts = []; }
  async get(k) { return this.dati.get(k) ?? null; }
  async put(k, v, o) { this.dati.set(k, v); this.puts.push({ k, v, o }); }
  async delete(k) { this.dati.delete(k); }
  async list({ prefix = '' } = {}) { return { keys: [...this.dati.keys()].filter((k) => k.startsWith(prefix)).map((name) => ({ name, metadata: { nome: 'X' } })), list_complete: true }; }
}

const req = (path, init = {}) => new Request(`https://worker.example${path}`, {
  ...init,
  headers: { 'Content-Type': 'application/json', 'cf-connecting-ip': '203.0.113.9', ...(init.headers || {}) },
});
const scheda = { nome: 'Lyra', classe: 'Mago', livello: 3 };
const deposita = (env, id = 'pg-1') => worker.fetch(req('/pg', { method: 'POST', body: JSON.stringify({ dispositivo: 'dev1', id, scheda }) }), env);

test('/pg: le scritture aperte hanno un limite per IP (senza il binding, sul KV)', async () => {
  const env = { SCHEDE: new KvFinto(), DM_KEY: 'segreto' };
  let ultimo = 0;
  for (let i = 0; i < 31; i++) ultimo = (await deposita(env)).status;
  assert.equal(ultimo, 429, 'la 31ª scrittura in un minuto va rifiutata');
  // Un altro IP non è toccato.
  const altro = await worker.fetch(req('/pg', { method: 'POST', headers: { 'cf-connecting-ip': '198.51.100.7' }, body: JSON.stringify({ dispositivo: 'dev2', id: 'pg-9', scheda }) }), env);
  assert.equal(altro.status, 200);
});

test('/pg: con il binding del rate limiter, se rifiuta la scrittura è 429 e non scrive nulla', async () => {
  const kv = new KvFinto();
  const env = { SCHEDE: kv, DM_KEY: 'segreto', ROOM_RATE_LIMITER: { limit: async () => ({ success: false }) } };
  const res = await deposita(env);
  assert.equal(res.status, 429);
  assert.equal(kv.puts.length, 0);
});

test('/pg: la chiave DM nell\'header funziona, quella sbagliata no, e l\'indirizzo resta accettato', async () => {
  const kv = new KvFinto();
  const env = { SCHEDE: kv, DM_KEY: 'segreto', ROOM_RATE_LIMITER: { limit: async () => ({ success: true }) } };
  assert.equal((await deposita(env)).status, 200);
  assert.equal((await worker.fetch(req('/pg', { headers: { 'x-dm-key': 'segreto' } }), env)).status, 200);
  assert.equal((await worker.fetch(req('/pg', { headers: { 'x-dm-key': 'sbagliata' } }), env)).status, 401);
  assert.equal((await worker.fetch(req('/pg'), env)).status, 401);
  assert.equal((await worker.fetch(req('/pg?key=segreto'), env)).status, 200, 'compatibilità con le app già installate');
  const senzaChiaveConfigurata = { SCHEDE: kv, ROOM_RATE_LIMITER: { limit: async () => ({ success: true }) } };
  assert.equal((await worker.fetch(req('/pg', { headers: { 'x-dm-key': '' } }), senzaChiaveConfigurata)).status, 401);
});

test('/pg: la lettura (con chiave) non consuma il limite delle scritture', async () => {
  const env = { SCHEDE: new KvFinto(), DM_KEY: 'segreto' };
  await deposita(env);
  for (let i = 0; i < 40; i++) {
    const res = await worker.fetch(req('/pg', { headers: { 'x-dm-key': 'segreto' } }), env);
    assert.equal(res.status, 200);
  }
});
