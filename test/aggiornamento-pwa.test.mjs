import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const app = readFileSync(join(process.cwd(), 'src/App.jsx'), 'utf8');
const persistenza = readFileSync(join(process.cwd(), 'src/utils/persistenza.js'), 'utf8');

test('aggiornamento PWA: non combina il reload del worker con location.replace', () => {
  assert.match(app, /updateServiceWorker\(false\)/);
  assert.doesNotMatch(app, /window\.location\.replace\(/);
});

test('aggiornamento PWA: tenta automaticamente in ogni browser, al massimo 3 volte per versione', () => {
  assert.match(app, /setTimeout\(\(\) => forzaAggiornamento\(true\), 1200\)/);
  // Il limite vale solo per i tentativi automatici e per la stessa build: mai un ciclo infinito.
  assert.match(app, /automatico && leggiTentativiAggiornamento\(aggiornamentoPronto\) >= 3/);
});

test('aggiornamento PWA: aspetta il nuovo service worker prima di ricaricare (iPhone)', () => {
  assert.match(app, /addEventListener\('controllerchange'/);
  assert.match(app, /await attendiNuovoServiceWorker\(8000\)/);
  // Terzo tentativo: si svuota solo la cache del programma (non IndexedDB né localStorage).
  assert.match(app, /await svuotaCacheProgramma\(\)/);
  assert.doesNotMatch(app, /indexedDB\.deleteDatabase|localStorage\.clear\(/);
});

test('aggiornamento PWA: Safari non può restare bloccato su Aggiornamento', () => {
  assert.match(app, /setTimeout\(ricaricaUnaVolta, 9000\)/);
  assert.match(app, /let navigazioneAvviata = false/);
});

test('avvio: cloud e IndexedDB non possono bloccare indefinitamente la scheda', () => {
  assert.match(app, /function fetchConTimeout/);
  // Dalla v4.40.0 l'avvio passa da salvaSuCloud (lettura prima di ogni invio).
  assert.match(app, /fetchConTimeout\(`https:\/\/api\.github\.com\/gists\/\$\{nuovoId\}`/);
  assert.match(persistenza, /richiesta\.onblocked/);
  assert.match(persistenza, /IndexedDB non risponde/);
});
