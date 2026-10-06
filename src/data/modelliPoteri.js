// Modelli di Poteri pronti da aggiungere con un tocco dalla sezione Poteri.
// Ogni potere ha la stessa forma di quelli scritti a mano (vedi
// src/rules/poteri.js): l'id viene generato all'aggiunta, i contatori creano
// da soli le risorse collegate (reset "manuale").

/** Soglie del Debito: effetto narrativo/meccanico mostrato dal pannello dedicato. */
export const SOGLIE_DEBITO_ARALDI = [
  { soglia: 5, nome: 'Voce nell\'Ombra', nomeEn: 'Voice in the Shadows', effetto: 'Messaggio a volontà come azione bonus e vantaggio alle prove di Intuizione.', effettoEn: 'Message at will as a bonus action and advantage on Insight checks.' },
  { soglia: 15, nome: 'Occhio Risvegliato', nomeEn: 'Awakened Eye', effetto: 'Vantaggio a Percezione e Indagare; +1 CA (applicato in automatico).', effettoEn: 'Advantage on Perception and Investigation; +1 AC (applied automatically).' },
  { soglia: 35, nome: 'Coraggio', nomeEn: 'Courage', effetto: 'Vantaggio ai TS contro spaventato.', effettoEn: 'Advantage on saves against being frightened.' },
  { soglia: 70, nome: 'Veglia', nomeEn: 'Vigil', effetto: 'Truesight 9 m per 1 ora al giorno; +1 ai tiri per colpire.', effettoEn: 'Truesight 30 ft for 1 hour a day; +1 to attack rolls.' },
  { soglia: 150, nome: 'Non questa volta', nomeEn: 'Not This Time', effetto: 'Una volta nella vita, a 0 PF resti a 1 PF; puoi riutilizzare il privilegio solo chiedendolo a Tim.', effettoEn: 'Once in your life, at 0 HP you stay at 1 HP; you can reuse it only by asking Tim.' },
];

/** Id del modello degli Araldi (campo `modello` dei poteri aggiunti da lì). */
export const ID_MODELLO_ARALDI = 'araldi-del-segreto';

/** Debito guadagnato a ogni uso di un privilegio degli Araldi (dal manuale). */
export const DEBITO_PER_USO_ARALDI = { 'Inquisire': 1, 'Trasferire Empatico': 2, 'Braccare!': 1 };

/** Segreti da spendere per recuperare un uso di un privilegio (dal manuale). */
export const RECUPERO_CON_SEGRETI_ARALDI = { 'Affabilità': 1, 'Trasferire Empatico': 2 };

/**
 * Azioni rapide legate a un privilegio, oltre a "Usa": gli effetti del manuale
 * che toccano Segreti o Debito (es. Inquisire → Cervello dà 1 Segreto).
 * `variazioni` è nel formato di patchVariaContatori.
 */
export const AZIONI_PRIVILEGI_ARALDI = {
  'Inquisire': [
    { etichetta: 'Cervello', etichettaEn: 'Brain', variazioni: [{ nome: 'Segreti', delta: 1 }], spiegazione: 'Prova superata, scegli Cervello: prendi un ricordo della creatura e ottieni 1 Segreto.', spiegazioneEn: 'Save succeeded, choose Brain: take a memory from the creature and gain 1 Secret.' },
  ],
  'Trasferire Empatico': [
    { etichetta: 'Nemico ucciso', etichettaEn: 'Enemy slain', variazioni: [{ nome: 'Segreti', delta: 1 }], spiegazione: 'Se con quest\'azione il nemico muore prendi 1 Segreto.', spiegazioneEn: 'If the enemy dies from this action you take 1 Secret.' },
  ],
  'Braccare!': [
    { etichetta: 'Ora in più', etichettaEn: 'Extra hour', variazioni: [{ nome: 'Segreti', delta: -1 }], spiegazione: 'Spendi 1 Segreto per ogni ora di durata del marchio dopo la prima (massimo 8 ore).', spiegazioneEn: 'Spend 1 Secret for each hour of the mark after the first (max 8 hours).' },
    { etichetta: 'Teletrasporto', etichettaEn: 'Teleport', variazioni: [{ nome: 'Segreti', delta: -3 }], spiegazione: 'Con un\'azione spendi 3 Segreti per teletrasportarti entro 1,5 m dalla creatura marchiata.', spiegazioneEn: 'As an action, spend 3 Secrets to teleport within 5 ft of the marked creature.' },
  ],
};

/** Incantesimi della lista ampliata per cerchio (si lanciano spendendo Segreti). */
export const LISTA_AMPLIATA_ARALDI = {
  1: ['Charme su persone', 'Camuffare sé stessi'],
  2: ['Individuazione dei pensieri', 'Cecità/Sordità'],
  3: ['Parlare con i morti', 'Chiaroveggenza'],
  4: ['Occhio arcano', 'Localizza creatura'],
  5: ['Dominare persone', 'Storia leggendaria'],
};

export const MODELLI_POTERI = [
  {
    id: 'araldi-del-segreto',
    manuale: 'araldi', // visibile solo con il manuale di campagna attivato (Manuali e fonti)
    nome: 'Araldi del Segreto',
    nomeEn: 'Heralds of the Secret',
    descrizione: 'Segreti, Debito e i privilegi del 1°, 6°, 10° e 14° livello: si sbloccano da soli al livello giusto, come i privilegi di classe.',
    descrizioneEn: 'Secrets, Debt and the level 1, 6, 10 and 14 features: they unlock on their own at the right level, like class features.',
    poteri: [
      {
        nome: 'Araldi del Segreto · Segreti e Debito',
        livelloMin: 1,
        descrizione: [
          'Spendere i Segreti (massimo pari al doppio del bonus di competenza):',
          '• Aprire (1 Segreto): rompi il sigillo e leggi l\'informazione; il DM garantisce che sia vera e utile.',
          '• Leva (1 Segreto): usi il Segreto contro la sua fonte, o contro chi ne è coinvolto, in un\'interazione sociale: una prova di Carisma contro di lei ha successo automatico (CD massima 20).',
          '• Incantare con i segreti (1 Segreto per livello dell\'incantesimo): lanci un incantesimo della lista ampliata senza spendere slot e guadagni 1 Debito.',
          '• Mercato (in gioco): i Segreti sono moneta; venderne uno lo consuma.',
          '',
          'Lista ampliata (si sblocca col relativo cerchio):',
          '1°: charme su persone, camuffare sé stessi',
          '2°: individuazione dei pensieri, cecità/sordità',
          '3°: parlare con i morti, chiaroveggenza',
          '4°: occhio arcano, localizza creatura',
          '5°: dominare persone, storia leggendaria',
        ].join('\n'),
        attivo: true,
        contatori: [
          { nome: 'Segreti', attuali: 0, max: null, maxAuto: 'doppia-competenza' },
          { nome: 'Debito', attuali: 0, max: null },
        ],
        modificatori: [],
      },
      {
        nome: 'Araldi del Segreto · Soglie del Debito',
        livelloMin: 1,
        descrizione: [
          '5: Voce nell\'Ombra: messaggio a volontà come azione bonus e vantaggio alle prove di Intuizione.',
          '15: Occhio Risvegliato: vantaggio a Percezione e Indagare; +1 CA (vedi il potere dedicato, da attivare al raggiungimento).',
          '35: Coraggio: vantaggio ai TS contro spaventato.',
          '70: Veglia: Truesight 9 m per 1 ora al giorno; +1 ai tiri per colpire.',
          '150: Non questa volta: 1 volta nella vita a 0 PF resti a 1 PF; puoi riutilizzare questo privilegio solo chiedendolo a Tim.',
        ].join('\n'),
        attivo: true,
        contatori: [],
        modificatori: [],
      },
      {
        nome: 'Debito 15 · Occhio Risvegliato (+1 CA)',
        descrizione: 'Scatta da solo quando il Debito arriva a 15: vantaggio a Percezione e Indagare, +1 alla CA.',
        attivo: true,
        condizione: { contatore: 'Debito', minimo: 15 },
        contatori: [],
        modificatori: [{ bersaglio: 'ca', bersaglioLibero: '', valore: 1, fonte: 'Occhio Risvegliato' }],
      },
      {
        nome: 'Debito 70 · Veglia (+1 colpire)',
        descrizione: 'Scatta da solo quando il Debito arriva a 70: Truesight 9 m per 1 ora al giorno e +1 ai tiri per colpire.',
        attivo: true,
        condizione: { contatore: 'Debito', minimo: 70 },
        contatori: [],
        modificatori: [{ bersaglio: 'altro', bersaglioLibero: 'Tiri per colpire', valore: 1, fonte: 'Veglia' }],
      },
      {
        nome: 'Affabilità (1° livello)',
        livelloMin: 1,
        descrizione: [
          'Usi: una volta per riposo breve. Puoi recuperare l\'uso spendendo 1 Segreto.',
          'Ottieni successo automatico in una prova di Carisma (Inganno, Persuasione o Intimidire) quando la CD stabilita dal DM sarebbe 15 o meno. Contro CD più alte, tiri con vantaggio. Non funziona su una creatura ostile in combattimento, né per ottenere qualcosa contrario alla natura del bersaglio. La discrezione del DM ha l\'ultima parola.',
        ].join('\n'),
        attivo: true,
        contatori: [{ nome: 'Affabilità', attuali: 1, max: 1, ricarica: 'breve' }],
        modificatori: [],
      },
      {
        nome: 'Inquisire (6° livello)',
        livelloMin: 6,
        descrizione: [
          'Usi: un numero di volte pari al tuo bonus di competenza per riposo lungo (aggiorna il massimo quando sale). Guadagni 1 Debito a ogni uso.',
          'Con un\'azione bonus, scegli una creatura che vedi entro 18 metri e che abbia Intelligenza 4 o superiore. Effettua un TS su Carisma contro la CD del nemico.',
          'Se fallisce: subisce 1d6 danni psichici ogni 2 livelli del personaggio.',
          'Se superi la prova scegli:',
          '• Occhi: hai vantaggio ai tiri per colpire contro di essa fino alla fine del tuo prossimo turno.',
          '• Cervello: prendi un ricordo della creatura; ottieni 1 Segreto conosciuto dalla creatura (massimo Segreti pari al doppio della competenza).',
          '• Cuore: recuperi 2d6 + il tuo livello PF (solo se la creatura non è un costrutto né un non morto).',
        ].join('\n'),
        attivo: true,
        contatori: [{ nome: 'Inquisire', attuali: 3, max: 3, maxAuto: 'competenza', ricarica: 'lungo' }],
        modificatori: [],
      },
      {
        nome: 'Trasferire Empatico (10° livello)',
        livelloMin: 10,
        descrizione: [
          'Usi: 1 per riposo lungo. Dopo un riposo breve puoi spendere 2 Segreti per recuperare l\'uso. Guadagni 2 Debiti a ogni uso.',
          'Con un\'azione, scegli una creatura che vedi entro 18 metri. Dichiara quanti PF in ferite vuoi trasferire (massimo la metà del tuo massimale) ed effettua un TS su Carisma contro la CD del nemico.',
          'Se fallisce: subisce metà di quell\'ammontare in danni necrotici.',
          'Se riesce: trasferisci quell\'ammontare di ferite al bersaglio in danni necrotici e ti curi di metà di quelle ferite. Se con quest\'azione il nemico muore prendi 1 Segreto.',
        ].join('\n'),
        attivo: true,
        contatori: [{ nome: 'Trasferire Empatico', attuali: 1, max: 1, ricarica: 'lungo' }],
        modificatori: [],
      },
      {
        nome: 'Braccare! (14° livello)',
        livelloMin: 14,
        descrizione: [
          'Usi: un numero di volte pari al tuo bonus di competenza per riposo lungo (aggiorna il massimo quando sale). Guadagni 1 Debito a ogni uso.',
          'Con un\'azione bonus marchi una creatura che vedi entro 18 metri. Spendi 1 Segreto per ogni ora di durata dopo la prima che vuoi (massimo 8 ore). Finché il marchio dura:',
          '• conosci le sue resistenze, immunità e vulnerabilità;',
          '• conosci la sua posizione esatta, finché si trova sul tuo stesso piano di esistenza;',
          '• non può diventare invisibile ai tuoi occhi;',
          '• con un\'azione puoi spendere 3 Segreti per teletrasportarti in uno spazio libero entro 1,5 metri dalla creatura marchiata.',
        ].join('\n'),
        attivo: true,
        contatori: [{ nome: 'Braccare!', attuali: 5, max: 5, maxAuto: 'competenza', ricarica: 'lungo' }],
        modificatori: [],
      },
    ],
  },
];
