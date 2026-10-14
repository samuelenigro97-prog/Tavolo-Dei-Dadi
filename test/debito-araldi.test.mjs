// Il Debito degli Araldi del Segreto non sparisce se il potere che lo conteneva
// (es. Potere del Patrono) viene tolto o spento.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { garantisciDebitoAraldi, contatoriInGioco, idRisorsaContatore } from '../src/rules/poteri.js';
import { costruisciPoteriCampagna } from '../src/data/poteriCampagna.js';

const nomi = (scheda) => contatoriInGioco(scheda).map((v) => v.contatore.nome);

test('senza Potere del Patrono il Debito torna nel potere Segreti e Debito', () => {
  const soloAraldi = costruisciPoteriCampagna().filter((p) => p.modello === 'araldi-del-segreto');
  const scheda = { livello: 10, poteri: soloAraldi, risorse: [] };
  assert.ok(!nomi(scheda).includes('Debito'));
  const poteri = garantisciDebitoAraldi(scheda.poteri, scheda.risorse);
  assert.ok(nomi({ ...scheda, poteri }).includes('Debito'));
  const segreti = poteri.find((p) => p.contatori.some((c) => c.nome === 'Segreti'));
  assert.ok(segreti.contatori.some((c) => c.nome === 'Debito'));
});

test('con il Patrono spento si recupera il suo ultimo valore di Debito', () => {
  const campagna = costruisciPoteriCampagna();
  const patrono = campagna.find((p) => p.contatori.some((c) => c.nome === 'Debito'));
  const poteri = campagna.map((p) => (p === patrono ? { ...p, attivo: false } : p));
  const risorse = [{ id: idRisorsaContatore(patrono.id, 0), nome: 'Debito', attuali: 12, max: null }];
  const esito = garantisciDebitoAraldi(poteri, risorse);
  const debito = esito.flatMap((p) => (p.attivo ? p.contatori : [])).find((c) => c.nome === 'Debito');
  assert.equal(debito.attuali, 12);
});

test('con il Debito già attivo, o senza Araldi, la lista non cambia', () => {
  const campagna = costruisciPoteriCampagna();
  assert.equal(garantisciDebitoAraldi(campagna, []), campagna);
  const altri = [{ id: 'x', nome: 'Altro', contatori: [{ nome: 'Usi', attuali: 1, max: 2 }] }];
  assert.equal(garantisciDebitoAraldi(altri, []), altri);
});
