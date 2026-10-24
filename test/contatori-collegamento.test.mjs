import { test } from 'node:test';
import assert from 'node:assert/strict';
import { risorseDopoRiposo } from '../src/rules/regole.js';

test('contatori: riposo breve e lungo resettano le risorse di classe secondo le regole', () => {
  const risorse = [
    { id: 'auto-barbaro-ira', nome: 'Ira', attuali: 0, max: 3, reset: 'breve-uno' },
    { id: 'auto-bardo-ispirazione', nome: 'Ispirazione Bardica', attuali: 1, max: 4, reset: 'breve' },
    { id: 'auto-druido-forma-selvatica', nome: 'Forma Selvatica', attuali: 0, max: 2, reset: 'breve-uno' },
    { id: 'auto-paladino-imposizione', nome: 'Imposizione delle Mani', attuali: 5, max: 25, reset: 'lungo' },
    { id: 'potere-araldi-debito', nome: 'Debito', attuali: 15, max: null, reset: 'manuale' },
  ];

  // Riposo Breve: breve torna a max, breve-uno guadagna +1, manuale e lungo non toccati
  const postBreve = risorseDopoRiposo(risorse, 'breve');
  assert.equal(postBreve.find((r) => r.nome === 'Ira').attuali, 1);
  assert.equal(postBreve.find((r) => r.nome === 'Ispirazione Bardica').attuali, 4);
  assert.equal(postBreve.find((r) => r.nome === 'Forma Selvatica').attuali, 1);
  assert.equal(postBreve.find((r) => r.nome === 'Imposizione delle Mani').attuali, 5);
  assert.equal(postBreve.find((r) => r.nome === 'Debito').attuali, 15);

  // Riposo Lungo: tutte tranne manuale tornano a max
  const postLungo = risorseDopoRiposo(risorse, 'lungo');
  assert.equal(postLungo.find((r) => r.nome === 'Ira').attuali, 3);
  assert.equal(postLungo.find((r) => r.nome === 'Ispirazione Bardica').attuali, 4);
  assert.equal(postLungo.find((r) => r.nome === 'Forma Selvatica').attuali, 2);
  assert.equal(postLungo.find((r) => r.nome === 'Imposizione delle Mani').attuali, 25);
  assert.equal(postLungo.find((r) => r.nome === 'Debito').attuali, 15);
});
