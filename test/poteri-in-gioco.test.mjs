import test from 'node:test';
import assert from 'node:assert/strict';
import { contatoriInGioco } from '../src/rules/poteri.js';

const scheda = {
  livello: 6,
  bonusCompetenza: 3,
  poteri: [
    { id: 'a', nome: 'Patrono', attivo: true, contatori: [{ nome: 'Debito', attuali: 5, max: null }] },
    { id: 'b', nome: 'Araldi', attivo: true, livelloMin: 1, contatori: [{ nome: 'Segreti', attuali: 2, max: 6 }, { nome: 'debito', attuali: 0, max: null }] },
    { id: 'c', nome: 'Braccare!', attivo: true, livelloMin: 14, contatori: [{ nome: 'Braccare!', attuali: 3, max: 3 }] },
    { id: 'd', nome: 'Spento', attivo: false, contatori: [{ nome: 'Altro', attuali: 1, max: 1 }] },
  ],
  risorse: [{ id: 'potere-b-0', nome: 'Segreti', attuali: 4, max: 6, reset: 'manuale' }],
};

test('contatoriInGioco: un contatore per nome, solo poteri attivi e sbloccati, valori dalle risorse', () => {
  const voci = contatoriInGioco(scheda);
  assert.deepEqual(voci.map((v) => v.contatore.nome), ['Debito', 'Segreti']);
  assert.equal(voci[0].attuali, 5);
  assert.equal(voci[1].attuali, 4, 'il valore della risorsa collegata vince');
  assert.equal(voci[1].max, 6);
});
