import { test } from 'node:test';
import assert from 'node:assert/strict';
import { difesaControDanno, dannoConDifesa } from '../src/rules/scheda.js';
import { MOSTRI_5E, EVOCAZIONI_ARALDI } from '../src/data/bestiario.js';

test('danno ad area: resistenze, immunità e vulnerabilità lette dai testi (v4.102.0)', () => {
  const scheletro = MOSTRI_5E.find((m) => m.nome === 'Scheletro').tratti.join(' ');
  assert.equal(difesaControDanno(scheletro, 'Contundente'), 'vulnerabile');
  assert.equal(difesaControDanno(scheletro, 'Veleno'), 'immune');
  assert.equal(difesaControDanno(scheletro, 'Fuoco'), 'normale');
  const myrdhal = EVOCAZIONI_ARALDI.find((m) => m.nome === 'Myrdhal').tratti.join(' ');
  assert.equal(difesaControDanno(myrdhal, 'Freddo'), 'resistente');
  assert.equal(difesaControDanno(myrdhal, 'Necrotico'), 'immune');
  assert.equal(difesaControDanno(myrdhal, 'Psichico'), 'immune');
  // Contundente "da attacchi non magici": non vale contro un incantesimo, vale contro un masso.
  assert.equal(difesaControDanno(myrdhal, 'Contundente'), 'normale');
  assert.equal(difesaControDanno(myrdhal, 'Contundente', { magico: false }), 'resistente');
  // "Immunità alle condizioni: avvelenato" non dà immunità ai danni da veleno.
  assert.equal(difesaControDanno('Immunità alle condizioni: avvelenato, spaventato.', 'Veleno'), 'normale');
  assert.equal(difesaControDanno('Resistenza al veleno (Nano)', 'Veleno'), 'resistente');
  assert.equal(difesaControDanno('', 'Fuoco'), 'normale');
});

test('danno ad area: TS superato dimezza, poi resistenza/vulnerabilità/immunità', () => {
  assert.equal(dannoConDifesa(28, 'normale'), 28);
  assert.equal(dannoConDifesa(28, 'normale', true), 14);
  assert.equal(dannoConDifesa(27, 'resistente'), 13);
  assert.equal(dannoConDifesa(27, 'resistente', true), 6, '27 → 13 (TS) → 6 (resistenza)');
  assert.equal(dannoConDifesa(27, 'vulnerabile', true), 26);
  assert.equal(dannoConDifesa(27, 'immune'), 0);
});
