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

test('il Debito ha sempre max: null e non si azzera mai a 0 per cap errato', async () => {
  const { maxContatore, valoreContatore, sincronizzaRisorsePoteri, patchVariaContatori } = await import('../src/rules/poteri.js');

  // maxContatore su Debito restituisce sempre null, anche se passato con max: 0 o max: ""
  assert.equal(maxContatore({ nome: 'Debito', max: 0 }, 4), null);
  assert.equal(maxContatore({ nome: 'Debito', max: '' }, 4), null);
  assert.equal(maxContatore({ nome: 'Debito', max: null }, 4), null);

  // valoreContatore su Debito ignora max: 0
  const cDebito = { nome: 'Debito', attuali: 6, max: 0 };
  const v = valoreContatore({ poteri: [{ id: 'p', contatori: [cDebito] }], risorse: [{ id: 'potere-p-0', nome: 'Debito', attuali: 6, max: 0 }] }, 'p', 0, cDebito);
  assert.equal(v.attuali, 6);
  assert.equal(v.max, null);

  // sincronizzaRisorsePoteri non tappa Debito a 0
  const res = sincronizzaRisorsePoteri([{ id: 'p', attivo: true, contatori: [cDebito] }], [], 10, 4);
  assert.equal(res[0].attuali, 6);
  assert.equal(res[0].max, null);
  assert.equal(res[0].reset, 'manuale');

  // patchVariaContatori aggiunge correttamente a Debito senza bloccarlo su max 0
  const patch = patchVariaContatori({ poteri: [{ id: 'p', contatori: [cDebito] }], risorse: res }, [{ nome: 'Debito', delta: 1 }]);
  assert.equal(patch.poteri[0].contatori[0].attuali, 7);
  assert.equal(patch.poteri[0].contatori[0].max, null);
  assert.equal(patch.risorse[0].attuali, 7);
  assert.equal(patch.risorse[0].max, null);
});

test('garantisciDebitoAraldi deduplica contatori multipli di Debito preservando il valore massimo', () => {
  const p1 = { id: 'p1', nome: 'Potere del Patrono', attivo: true, contatori: [{ nome: 'Debito', attuali: 6, max: null }] };
  const p2 = { id: 'p2', modello: 'araldi-del-segreto', nome: 'Araldi del Segreto · Segreti e Debito', attivo: true, contatori: [{ nome: 'Segreti', attuali: 2, max: 8 }, { nome: 'Debito', attuali: 0, max: 0 }] };
  const esito = garantisciDebitoAraldi([p1, p2], []);

  // Deve esistere un solo contatore Debito con valore 6 e max null
  const debitti = esito.flatMap((p) => p.contatori.filter((c) => c.nome === 'Debito'));
  assert.equal(debitti.length, 1);
  assert.equal(debitti[0].attuali, 6);
  assert.equal(debitti[0].max, null);
});
