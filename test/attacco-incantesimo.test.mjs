// Gli attacchi degli incantesimi seguono la lista incantesimi, senza tasto per eliminarli.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { attaccoIncantesimoAttivo } from '../src/rules/scheda.js';

const lista = [
  { nome: 'Frusta di Spine', livello: 0 },
  { nome: 'Dardo Incantato', livello: 1, preparato: true },
  { nome: 'Palla di Fuoco', livello: 3, preparato: false },
  { nome: 'Armatura Magica', livello: 1, semprePreparato: true },
];

test('trucchetti e incantesimi preparati compaiono, quelli non preparati spariscono', () => {
  assert.equal(attaccoIncantesimoAttivo({ nome: 'Frusta di Spine' }, lista, true), true);
  assert.equal(attaccoIncantesimoAttivo({ nome: '✨ Dardo Incantato' }, lista, true), true);
  assert.equal(attaccoIncantesimoAttivo({ nome: 'Armatura Magica' }, lista, true), true);
  assert.equal(attaccoIncantesimoAttivo({ nome: 'Palla di Fuoco' }, lista, true), false);
});

test('un incantesimo tolto dalla lista non ha più attacco; se torna, l\'attacco torna', () => {
  assert.equal(attaccoIncantesimoAttivo({ nome: 'Fulmine' }, lista, true), false);
  assert.equal(attaccoIncantesimoAttivo({ nome: 'Fulmine' }, [...lista, { nome: 'Fulmine', livello: 3, preparato: true }], true), true);
});

test('le classi che non preparano mostrano tutto ciò che è in lista; lista vuota: nessun filtro', () => {
  assert.equal(attaccoIncantesimoAttivo({ nome: 'Palla di Fuoco' }, lista, false), true);
  assert.equal(attaccoIncantesimoAttivo({ nome: 'Qualsiasi' }, [], true), true);
  assert.equal(attaccoIncantesimoAttivo({ nome: 'Qualsiasi' }, undefined, true), true);
});

test('Randello Incantato con la dicitura (Bastone Incantato) segue l\'incantesimo base', () => {
  assert.equal(attaccoIncantesimoAttivo({ nome: 'Randello Incantato (Bastone Incantato)' }, [{ nome: 'Randello Incantato', livello: 0 }], true), true);
});
