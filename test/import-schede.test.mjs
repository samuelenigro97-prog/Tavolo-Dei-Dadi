// Import delle schede: i totali letti sulla scheda correggono le icone sbagliate (stelle),
// la Maestria arriva come 3 e "Fighter 1 / Ranger 6 / Rogue 3" si legge da solo.
// I numeri sono quelli degli screenshot di Fantasy Grounds di Elevorn DeVille e Frost.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { normalizzaTrascrizione, parseClassiELivelli } from '../src/rules/importSchede.js';

const tuttiUno = Object.fromEntries(['acrobazia', 'addestrareAnimali', 'arcano', 'atletica', 'furtivita', 'indagare', 'inganno', 'intimidire', 'intrattenere', 'intuizione', 'medicina', 'natura', 'percezione', 'persuasione', 'rapiditaDiMano', 'religione', 'sopravvivenza', 'storia'].map((k) => [k, 1]));

const ELEVORN = {
  nome: 'Elevorn DeVille', classe: 'Fighter 1 / Ranger 6 / Rogue 3', livello: 10,
  caratteristiche: { forza: 10, destrezza: 20, costituzione: 14, intelligenza: 10, saggezza: 14, carisma: 11 },
  bonusCompetenza: 4,
  abilita: tuttiUno, // il modello ha letto male le stelle: tutte competenti
  abilitaTotali: { acrobazia: 5, addestrareAnimali: 2, arcano: 0, atletica: 4, furtivita: 13, indagare: 0, inganno: 8, intimidire: 0, intrattenere: 0, intuizione: 6, medicina: 6, natura: 0, percezione: 6, persuasione: 0, rapiditaDiMano: 5, religione: 4, sopravvivenza: 6, storia: 0 },
  tiriSalvezza: { forza: false, destrezza: false, costituzione: true, intelligenza: false, saggezza: false, carisma: false },
  tiriSalvezzaTotali: { forza: 4, destrezza: 9, costituzione: 2, intelligenza: 0, saggezza: 2, carisma: 0 },
};

test('Elevorn: classi e livelli da "Fighter 1 / Ranger 6 / Rogue 3"', () => {
  const { dati } = normalizzaTrascrizione(ELEVORN);
  assert.equal(dati.classe, 'Guerriero');
  assert.equal(dati.livello, 1);
  assert.deepEqual(dati.multiclasse, [{ classe: 'Ranger', livello: 6 }, { classe: 'Ladro', livello: 3 }]);
});

test('Elevorn: dai totali si ricavano competenze e Maestrie (3), anche se le stelle erano tutte lette accese', () => {
  const { dati, correzioni } = normalizzaTrascrizione(ELEVORN);
  const competenti = Object.entries(dati.abilita).filter(([, v]) => v).map(([k]) => k).sort();
  assert.deepEqual(competenti, ['atletica', 'furtivita', 'inganno', 'intuizione', 'medicina', 'percezione', 'religione', 'sopravvivenza']);
  assert.equal(dati.abilita.inganno, 3, 'Inganno +8 = 0 + 2×4: maestria');
  assert.equal(dati.abilita.furtivita, 3, 'Furtività +13 = 5 + 2×4: maestria');
  assert.equal(dati.abilita.atletica, 1);
  assert.equal(dati.abilita.acrobazia, 0, 'Acrobazia +5 = solo il modificatore di Destrezza');
  assert.ok(correzioni.length > 0);
});

test('Elevorn: i tiri salvezza vengono dai totali (Forza e Destrezza competenti, Costituzione no)', () => {
  const { dati } = normalizzaTrascrizione(ELEVORN);
  assert.deepEqual(dati.tiriSalvezza, { forza: true, destrezza: true, costituzione: false, intelligenza: false, saggezza: false, carisma: false });
});

const FROST = {
  nome: 'Frost', classe: 'Fighter', livello: 10,
  caratteristiche: { forza: 14, destrezza: 20, costituzione: 18, intelligenza: 11, saggezza: 14, carisma: 12 },
  abilita: { ...tuttiUno, atletica: 2 }, // maestria letta per sbaglio
  abilitaTotali: { acrobazia: 9, addestrareAnimali: 2, arcano: 0, atletica: 6, furtivita: 5, indagare: 0, inganno: 1, intimidire: 5, intrattenere: 1, intuizione: 6, medicina: 2, natura: 0, percezione: 6, persuasione: 1, rapiditaDiMano: 5, religione: 0, sopravvivenza: 2, storia: 0 },
  tiriSalvezzaTotali: { forza: 6, destrezza: 5, costituzione: 8, intelligenza: 0, saggezza: 2, carisma: 1 },
};

test('Frost (senza bonusCompetenza scritto): si ricava dal livello e le competenze tornano 5, senza maestrie', () => {
  const { dati } = normalizzaTrascrizione(FROST);
  assert.equal(dati.bonusCompetenza, 4);
  const competenti = Object.entries(dati.abilita).filter(([, v]) => v).map(([k]) => k).sort();
  assert.deepEqual(competenti, ['acrobazia', 'atletica', 'intimidire', 'intuizione', 'percezione']);
  assert.ok(Object.values(dati.abilita).every((v) => v === 0 || v === 1));
  assert.deepEqual(Object.entries(dati.tiriSalvezza).filter(([, v]) => v).map(([k]) => k), ['forza', 'costituzione']);
});

test('senza totali: la Maestria "2" del Worker diventa 3 e le competenze non si inventano', () => {
  const { dati } = normalizzaTrascrizione({
    classe: 'Ladro', livello: 5, caratteristiche: { destrezza: 16 },
    abilita: { furtivita: 2, acrobazia: 1, percezione: 1 },
  });
  assert.equal(dati.abilita.furtivita, 3);
  assert.equal(dati.abilita.acrobazia, 1);
  assert.equal(dati.abilita.arcano, 0);
});

test('senza totali e con quasi tutte le abilità accese: si azzerano (errore sulle stelle)', () => {
  const { dati, correzioni } = normalizzaTrascrizione({ classe: 'Guerriero', livello: 3, abilita: tuttiUno });
  assert.ok(Object.values(dati.abilita).every((v) => v === 0));
  assert.ok(correzioni.some((c) => /stelle/.test(c)));
});

test('scheda cartacea italiana: "Spadaccino 4 / Warlock 1" → Ladro (Spadaccino) 4 + Warlock 1', () => {
  assert.deepEqual(parseClassiELivelli('Spadaccino 4 / Warlock 1'), [
    { classe: 'Ladro', livello: 4, sottoclasse: 'Spadaccino' }, { classe: 'Warlock', livello: 1 },
  ]);
  const { dati } = normalizzaTrascrizione({ classe: 'Spadaccino 4 / Warlock 1', livello: 5, sottoclasse: '' });
  assert.equal(dati.classe, 'Ladro');
  assert.equal(dati.sottoclasse, 'Spadaccino');
  assert.equal(dati.livello, 4);
  assert.deepEqual(dati.multiclasse, [{ classe: 'Warlock', livello: 1 }]);
});

test('una classe senza livello o già in italiano non viene toccata', () => {
  assert.deepEqual(parseClassiELivelli('Guerriero'), []);
  const { dati, correzioni } = normalizzaTrascrizione({ classe: 'Druido', livello: 10, multiclasse: [] });
  assert.equal(dati.classe, 'Druido');
  assert.equal(dati.livello, 10);
  assert.deepEqual(correzioni, []);
});
