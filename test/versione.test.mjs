// Coerenza della versione: App, package.json, CHANGELOG e Novità devono dire la
// stessa cosa. Evita il "ho pubblicato ma il numero non è cambiato" che confonde
// chi controlla se la PWA si è aggiornata.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { NOVITA } from '../src/data/novita.js';

const app = /const APP_VERSION = '([^']+)'/.exec(readFileSync('src/App.jsx', 'utf8'))?.[1];
const pkg = JSON.parse(readFileSync('package.json', 'utf8')).version;
const changelog = /^## \[(\d+\.\d+\.\d+)\]/m.exec(readFileSync('CHANGELOG.md', 'utf8'))?.[1];

const confrontaVersioni = (a, b) => {
  const x = a.split('.').map(Number); const y = b.split('.').map(Number);
  for (let i = 0; i < 3; i++) if (x[i] !== y[i]) return x[i] - y[i];
  return 0;
};

test('APP_VERSION, package.json e prima voce del CHANGELOG coincidono', () => {
  assert.ok(app, 'APP_VERSION non trovata');
  assert.equal(pkg, app, 'package.json non allineato ad APP_VERSION');
  assert.equal(changelog, app, 'la prima voce del CHANGELOG non è la versione corrente');
});

test('le Novità in-app: versioni in ordine decrescente e nessuna oltre la versione corrente', () => {
  assert.ok(NOVITA.length > 0);
  for (let i = 1; i < NOVITA.length; i++) {
    assert.ok(confrontaVersioni(NOVITA[i - 1].versione, NOVITA[i].versione) > 0, `ordine errato: ${NOVITA[i - 1].versione} prima di ${NOVITA[i].versione}`);
  }
  assert.ok(confrontaVersioni(NOVITA[0].versione, app) <= 0, `la voce ${NOVITA[0].versione} supera la versione corrente ${app}`);
  for (const v of NOVITA) {
    assert.ok(v.voci?.it?.length && v.voci?.en?.length, `${v.versione}: servono voci in italiano e inglese`);
    assert.equal(v.voci.it.length, v.voci.en.length, `${v.versione}: voci IT/EN in numero diverso`);
  }
});
