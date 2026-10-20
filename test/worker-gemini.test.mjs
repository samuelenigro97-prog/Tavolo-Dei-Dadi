// Worker: trascrizione con Gemini (gratis) con modelli di riserva e scoperta dei modelli.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { trascriviGemini, estraiJsonScheda } from '../worker/transcribe-worker.js';

const rispostaOk = (obj) => ({ ok: true, status: 200, json: async () => ({ candidates: [{ content: { parts: [{ text: '```json\n' + JSON.stringify(obj) + '\n```' }] } }] }), text: async () => '' });
const errore = (status, testo = 'errore') => ({ ok: false, status, text: async () => testo, json: async () => ({}) });

test('estraiJsonScheda legge il JSON anche dentro ```json e testo attorno', () => {
  assert.deepEqual(estraiJsonScheda('Ecco:\n```json\n{"nome":"Frost"}\n```\nfine'), { nome: 'Frost' });
  assert.throws(() => estraiJsonScheda('niente json'), /JSON/);
});

test('Gemini: usa x-goog-api-key, manda il file e il prompt, chiede JSON a temperatura 0', async () => {
  let visto;
  const fetchFn = async (url, init) => { visto = { url, init }; return rispostaOk({ nome: 'Frost' }); };
  const scheda = await trascriviGemini({ GEMINI_API_KEY: 'k' }, 'QUJD', 'image/png', fetchFn);
  assert.deepEqual(scheda, { nome: 'Frost' });
  assert.match(visto.url, /generativelanguage\.googleapis\.com\/v1beta\/models\/gemini-3\.8-flash:generateContent$/);
  assert.equal(visto.init.headers['x-goog-api-key'], 'k');
  const corpo = JSON.parse(visto.init.body);
  assert.equal(corpo.contents[0].parts[0].inline_data.mime_type, 'image/png');
  assert.equal(corpo.contents[0].parts[0].inline_data.data, 'QUJD');
  assert.match(corpo.contents[0].parts[1].text, /abilitaTotali/);
  assert.equal(corpo.generationConfig.temperature, 0);
  assert.equal(corpo.generationConfig.responseMimeType, 'application/json');
});

test('Gemini legge anche i PDF (stesso formato, application/pdf)', async () => {
  let mime;
  const fetchFn = async (url, init) => { mime = JSON.parse(init.body).contents[0].parts[0].inline_data.mime_type; return rispostaOk({ nome: 'Lyrian' }); };
  await trascriviGemini({ GEMINI_API_KEY: 'k' }, 'QUJD', 'application/pdf', fetchFn);
  assert.equal(mime, 'application/pdf');
});

test('Gemini: GEMINI_MODEL ha la precedenza, e su 429/404 si passa al modello successivo', async () => {
  const provati = [];
  const fetchFn = async (url) => {
    provati.push(url.match(/models\/([^:]+):/)[1]);
    if (provati.length === 1) return errore(429, 'quota');
    if (provati.length === 2) return errore(404, 'modello ritirato');
    return rispostaOk({ nome: 'Ok' });
  };
  const scheda = await trascriviGemini({ GEMINI_API_KEY: 'k', GEMINI_MODEL: 'gemini-x, gemini-y' }, 'QUJD', 'image/png', fetchFn);
  assert.deepEqual(provati, ['gemini-x', 'gemini-y', 'gemini-3.8-flash']);
  assert.deepEqual(scheda, { nome: 'Ok' });
});

test('Gemini: chiave sbagliata (403) si ferma subito, senza insistere con gli altri modelli', async () => {
  let chiamate = 0;
  const fetchFn = async () => { chiamate++; return errore(403, 'API key not valid'); };
  await assert.rejects(trascriviGemini({ GEMINI_API_KEY: 'sbagliata' }, 'QUJD', 'image/png', fetchFn), /403/);
  assert.equal(chiamate, 1);
});

test('Gemini: se nessun nome noto risponde, elenca i modelli e prova i flash più recenti', async () => {
  const provati = [];
  const fetchFn = async (url) => {
    if (/\/models\?/.test(url)) {
      return { ok: true, status: 200, text: async () => '', json: async () => ({ models: [
        { name: 'models/gemini-3.5-flash', supportedGenerationMethods: ['generateContent'] },
        { name: 'models/gemini-omni-flash-preview', supportedGenerationMethods: ['generateContent'] },
        { name: 'models/gemini-3.9-flash', supportedGenerationMethods: ['generateContent'] },
        { name: 'models/gemini-3.9-flash-lite', supportedGenerationMethods: ['generateContent'] },
        { name: 'models/gemini-embedding-001', supportedGenerationMethods: ['embedContent'] },
      ] }) };
    }
    const m = url.match(/models\/([^:]+):/)[1];
    provati.push(m);
    return m === 'gemini-3.5-flash' ? rispostaOk({ nome: 'Nuovo' }) : errore(404);
  };
  const scheda = await trascriviGemini({ GEMINI_API_KEY: 'k' }, 'QUJD', 'image/png', fetchFn);
  assert.deepEqual(scheda, { nome: 'Nuovo' });
  // Prima le versioni numeriche dalla più nuova, gli "omni"/preview dopo; i lite mai.
  assert.deepEqual(provati, ['gemini-3.8-flash', 'gemini-flash-latest', 'gemini-3.9-flash', 'gemini-3.5-flash']);
});

test('Gemini: senza chiave dà un errore chiaro', async () => {
  await assert.rejects(trascriviGemini({}, 'QUJD', 'image/png', async () => errore(500)), /GEMINI_API_KEY/);
});
