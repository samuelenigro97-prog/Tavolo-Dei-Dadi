import { test } from 'node:test';
import assert from 'node:assert/strict';
import { overlayInCima, eCampoModificabile, deveAttivareDaTastiera } from '../src/utils/accessibilita.js';

test('accessibilità: Escape sceglie lo sfondo con z-index più alto', () => {
  const a = { el: 'menu', zIndex: 1000, copreSchermo: true };
  const b = { el: 'hub', zIndex: 2600, copreSchermo: true };
  const c = { el: 'tracker', zIndex: 5000, copreSchermo: false };
  const d = { el: 'sfondo', zIndex: 9999, copreSchermo: true, ignora: true };
  assert.equal(overlayInCima([a, b, c, d]), 'hub');
});

test('accessibilità: a parità di z-index vince l\'ultimo nel DOM', () => {
  assert.equal(overlayInCima([
    { el: 'primo', zIndex: 1000, copreSchermo: true },
    null,
    { el: 'secondo', zIndex: 1000, copreSchermo: true },
  ]), 'secondo');
  assert.equal(overlayInCima([{ el: 'x', zIndex: NaN, copreSchermo: true }]), 'x');
  assert.equal(overlayInCima([]), null);
});

test('accessibilità: i campi di testo tengono il proprio Escape', () => {
  assert.equal(eCampoModificabile({ tagName: 'input' }), true);
  assert.equal(eCampoModificabile({ tagName: 'TEXTAREA' }), true);
  assert.equal(eCampoModificabile({ tagName: 'DIV', isContentEditable: true }), true);
  assert.equal(eCampoModificabile({ tagName: 'BUTTON' }), false);
  assert.equal(eCampoModificabile(null), false);
});

test('accessibilità: Invio e Spazio attivano solo i finti pulsanti', () => {
  assert.equal(deveAttivareDaTastiera({ key: 'Enter', tagName: 'SPAN', role: 'button' }), true);
  assert.equal(deveAttivareDaTastiera({ key: ' ', tagName: 'div', role: 'button' }), true);
  assert.equal(deveAttivareDaTastiera({ key: 'a', tagName: 'SPAN', role: 'button' }), false);
  assert.equal(deveAttivareDaTastiera({ key: 'Enter', tagName: 'SPAN', role: null }), false);
  assert.equal(deveAttivareDaTastiera({ key: 'Enter', tagName: 'BUTTON', role: 'button' }), false, 'il browser lo fa già');
});
