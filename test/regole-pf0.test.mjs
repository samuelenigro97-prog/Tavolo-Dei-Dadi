import { test } from 'node:test';
import assert from 'node:assert/strict';
import { patchTransizionePf, cdConcentrazione, esitoDannoPf0, effettiSfinimento } from '../src/rules/scheda.js';

test('a 0 PF: Privo di sensi e fine della concentrazione, niente sfinimento (v4.96.0)', () => {
  const p = patchTransizionePf({ pfAttuali: 0, condizioni: ['Avvelenato'], concentrazione: 'Benedizione', sfinimento: 0 }, 12);
  assert.deepEqual(p.condizioni, ['Avvelenato', 'Privo di sensi']);
  assert.equal(p.concentrazione, '');
  assert.equal('sfinimento' in p, false, 'le regole non danno sfinimento per scendere a 0 PF');
  // Già Privo di sensi e senza concentrazione: niente da fare.
  assert.equal(patchTransizionePf({ pfAttuali: 0, condizioni: ['Privo di sensi'], concentrazione: '' }, 5), null);
});

test('di nuovo sopra 0 PF: via Privo di sensi e TS contro morte azzerati', () => {
  const p = patchTransizionePf({ pfAttuali: 4, condizioni: ['Privo di sensi', 'Prono'], tsMorte: { successi: 1, fallimenti: 2 } }, 0);
  assert.deepEqual(p.condizioni, ['Prono']);
  assert.deepEqual(p.tsMorte, { successi: 0, fallimenti: 0 });
  // Variazioni sopra 0 non toccano nulla.
  assert.equal(patchTransizionePf({ pfAttuali: 8, condizioni: [], tsMorte: { successi: 0, fallimenti: 0 } }, 12), null);
});

test('CD della concentrazione: 10 o metà danno, massimo 30 nella 5.5', () => {
  assert.equal(cdConcentrazione(7, '2024'), 10);
  assert.equal(cdConcentrazione(31, '2024'), 15);
  assert.equal(cdConcentrazione(90, '2024'), 30);
  assert.equal(cdConcentrazione(90, '2014'), 45, 'nella 5.0 nessun tetto');
});

test('danno a 0 PF: fallimento automatico, danno massiccio = morte istantanea', () => {
  assert.deepEqual(esitoDannoPf0(20, 0, 3, { successi: 1, fallimenti: 1 }).tsMorteDopo, { successi: 1, fallimenti: 2 });
  assert.equal(esitoDannoPf0(20, 5, 25, null).istantaneo, true, '5 PF, 25 danni: avanzano 20 = PF massimi');
  assert.equal(esitoDannoPf0(20, 5, 24, null).tsMorteDopo, null, 'avanzano 19: solo a 0 PF');
});

test('sfinimento: 5.5 −2 per livello ai d20 e −1,5 m, 5.0 effetti cumulativi', () => {
  assert.deepEqual([effettiSfinimento({ sfinimento: 3 }).penalitaD20, effettiSfinimento({ sfinimento: 3 }).penalitaVelocita], [6, 4.5]);
  const v = effettiSfinimento({ sfinimento: 4, versione: '2014' });
  assert.equal(v.pfDimezzati && v.svantaggioAttacchiSalvezza && v.velocitaDimezzata && v.svantaggioProve, true);
  assert.equal(effettiSfinimento({ sfinimento: 6 }).morto, true);
});
