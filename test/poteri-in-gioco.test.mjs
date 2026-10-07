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

test('Poteri della campagna: incompleti con il solo Debito, uniti tenendo il valore del Debito (v4.84.0)', async () => {
  const { poteriCampagnaIncompleti, unisciPoteriCampagna } = await import('../src/data/poteriCampagna.js');
  const { ID_MODELLO_ARALDI } = await import('../src/data/modelliPoteri.js');
  const soloDebito = [{ id: 'x', nome: 'Debito', attivo: true, contatori: [{ nome: 'Debito', attuali: 6, max: 100 }] }];
  const altro = { id: 'y', nome: 'Benedizione del mare', attivo: true, contatori: [{ nome: 'Onde', attuali: 2, max: 3 }] };
  assert.equal(poteriCampagnaIncompleti({ poteri: [] }), true);
  assert.equal(poteriCampagnaIncompleti({ poteri: soloDebito }), true);
  assert.equal(poteriCampagnaIncompleti({ poteri: [altro] }), false, 'altri personaggi con poteri propri: nessun pulsante');
  const uniti = unisciPoteriCampagna([...soloDebito, altro]);
  assert.equal(poteriCampagnaIncompleti({ poteri: uniti }), false);
  assert.ok(uniti.some((p) => p.modello === ID_MODELLO_ARALDI), 'tornano gli Araldi del Segreto');
  const debiti = uniti.flatMap((p) => p.contatori).filter((c) => c.nome === 'Debito');
  assert.equal(debiti.length, 1, 'un solo Debito');
  assert.equal(debiti[0].attuali, 6, 'il Debito tiene il valore attuale');
  assert.ok(uniti.some((p) => p.nome === 'Benedizione del mare'), 'gli altri poteri restano');
  assert.ok(!uniti.some((p) => p.id === 'x'), 'il Debito generico viene sostituito da quello del Patrono');
});

test('manuale Araldi 1.1: testi aggiornati (Vista Pura, Myrdhal) sui poteri già presenti, senza toccare quelli modificati a mano (v4.86.0)', async () => {
  const { aggiornaTestiAraldi, MODELLI_POTERI, ID_MODELLO_ARALDI, SOGLIE_DEBITO_ARALDI, SEGRETI_MYRDHAL_ARALDI } = await import('../src/data/modelliPoteri.js');
  const modello = MODELLI_POTERI.find((m) => m.id === ID_MODELLO_ARALDI);
  const tutti = modello.poteri.map((p) => p.descrizione).join('\n');
  assert.ok(!/Truesight/.test(tutti), 'niente più Truesight nei testi italiani');
  assert.ok(/Vista Pura 9 m/.test(tutti));
  assert.equal(SOGLIE_DEBITO_ARALDI.find((s) => s.soglia === 70).effetto, 'Vista Pura 9 m per 1 ora al giorno; +1 ai tiri per colpire.');
  assert.equal(SEGRETI_MYRDHAL_ARALDI, 10);
  const segreti = modello.poteri.find((p) => p.nome.endsWith('Segreti e Debito'));
  assert.ok(/Myrdhal \(10 Segreti, anche di gruppo\)/.test(segreti.descrizione));
  // Una scheda con i testi vecchi viene aggiornata.
  const vecchi = [
    { id: 'a', nome: segreti.nome, modello: ID_MODELLO_ARALDI, descrizione: '• Mercato (in gioco): i Segreti sono moneta; venderne uno lo consuma.' },
    { id: 'b', nome: 'Araldi del Segreto · Soglie del Debito', modello: ID_MODELLO_ARALDI, descrizione: '70: Veglia: Truesight 9 m per 1 ora al giorno' },
    { id: 'c', nome: 'Affabilità (1° livello)', modello: ID_MODELLO_ARALDI, descrizione: 'Testo scritto a mano' },
  ];
  const nuovi = aggiornaTestiAraldi(vecchi);
  assert.equal(nuovi[0].descrizione, segreti.descrizione);
  assert.ok(/Vista Pura/.test(nuovi[1].descrizione));
  assert.equal(nuovi[2].descrizione, 'Testo scritto a mano', 'modificata a mano: resta');
  // Idempotente: niente da aggiornare = stesso array.
  assert.equal(aggiornaTestiAraldi(nuovi), nuovi);
});
