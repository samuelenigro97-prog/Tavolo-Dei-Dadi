// Calcoli 5e derivati dalla scheda: CA da equipaggiamento, bonus abilità e TS.
// Funzioni pure (nessun React, nessuno stato): testabili in isolamento.
import { modificatore, bonusCompetenzaDaLivello } from './dadi.js';
import { ABILITA } from '../data/caratteristiche.js';
import { bonusPotereBersaglio, soglieDebitoAttive } from './poteri.js';

export function formattaNomePg(nome) {
  if (!nome || typeof nome !== 'string') return '';
  const pulito = nome.trim();
  if (!pulito) return '';
  return pulito.replace(/(^|[\s\-(/'"])[a-zà-öø-ÿ]/gu, (m) => m.toUpperCase());
}

export function formattaTitoloVoce(str) {
  if (!str || typeof str !== 'string') return '';
  const pulito = str.trim();
  if (!pulito) return '';
  const base = (pulito === pulito.toUpperCase() && /[A-ZÀ-ÖØ-ß]/.test(pulito))
    ? pulito.toLowerCase()
    : pulito;

  const minuscole = new Set(['di', 'a', 'da', 'in', 'con', 'su', 'per', 'tra', 'fra', 'il', 'lo', 'la', 'i', 'gli', 'le', 'del', 'dello', 'della', 'dei', 'degli', 'delle', 'al', 'allo', 'alla', 'ai', 'agli', 'alle', 'dal', 'dallo', 'dalla', 'dai', 'dagli', 'dalle', 'nel', 'nello', 'nella', 'nei', 'negli', 'nelle', 'sul', 'sullo', 'sulla', 'sui', 'sugli', 'sulle', 'e', 'ed', 'o', 'od', 'of', 'and', 'the', 'in', 'on', 'at', 'to', 'for', 'with', 'by']);

  return base.split(/(\s+|[-/()])/).map((token, idx) => {
    if (!token || /^\s+$/.test(token) || /^[-/()]$/.test(token)) return token;
    const lower = token.toLowerCase();
    if (idx > 0 && minuscole.has(lower)) {
      return lower;
    }
    return lower.charAt(0).toUpperCase() + lower.slice(1);
  }).join('');
}

function nomeNormalizzato(v) {
  return String(v || '').toLocaleLowerCase('it').replace(/[^a-zà-ÿ0-9]/gi, ' ').replace(/\s+/g, ' ').trim();
}

/** Un effetto dell'inventario funziona solo se l'oggetto è indossato e,
 * quando richiesto, occupa anche uno degli slot di sintonia. */
export function oggettiConEffettoAttivo(scheda) {
  const sintonia = Array.isArray(scheda?.sintonia) ? scheda.sintonia : (scheda?.sintonia ? [scheda.sintonia] : []);
  return (Array.isArray(scheda?.inventario) ? scheda.inventario : []).filter((o) => {
    if (!o?.equip || !o.effettoMeccanico) return false;
    if (!o.richiedeSintonia) return true;
    const nome = nomeNormalizzato(o.nome);
    return sintonia.some((s) => {
      const voce = nomeNormalizzato(s);
      return nome && voce && (nome.includes(voce) || voce.includes(nome));
    });
  });
}

export function bonusClasseArmaturaOggetti(scheda) {
  return oggettiConEffettoAttivo(scheda).reduce((tot, o) => {
    if (o.effettoMeccanico === 'classe_armatura_tiri_salvezza_1') return tot + 1;
    const m = /^classe_armatura_([123])$/.exec(o.effettoMeccanico);
    return tot + (m ? Number(m[1]) : 0);
  }, 0);
}

export function bonusTiriSalvezzaOggetti(scheda) {
  return oggettiConEffettoAttivo(scheda).reduce((tot, o) => {
    if (o.effettoMeccanico === 'classe_armatura_tiri_salvezza_1') return tot + 1;
    const m = /^tiri_salvezza_([123])$/.exec(o.effettoMeccanico);
    return tot + (m ? Number(m[1]) : 0);
  }, 0);
}

/**
 * Trasformazione attualmente attiva (Forma Bestiale o Metamorfosi), al più
 * una alla volta. Metamorfosi (l'incantesimo Polymorph) sostituisce anche le
 * caratteristiche mentali; Forma Bestiale (il privilegio Druido) no: chi la
 * usa resta se stesso per Int/Sag/Car (Regole 5e PHB).
 */
export function trasformazioneAttiva(scheda) {
  if (scheda?.metamorfosi?.attiva) return { campo: 'metamorfosi', dati: scheda.metamorfosi, tutteLeCaratteristiche: true };
  if (scheda?.formaBestiale?.attiva) return { campo: 'formaBestiale', dati: scheda.formaBestiale, tutteLeCaratteristiche: false };
  return null;
}

export function punteggioCaratteristica(scheda, caratteristica) {
  // Forma Bestiale: solo Forza/Destrezza/Costituzione sostituite dalla bestia
  // (Regole 5e PHB). Metamorfosi: tutte e sei le caratteristiche, comprese
  // quelle mentali (Polymorph sostituisce l'intero blocco della creatura).
  const forma = trasformazioneAttiva(scheda);
  if (forma && (forma.tutteLeCaratteristiche || ['forza', 'destrezza', 'costituzione'].includes(caratteristica))) {
    const valForma = forma.dati.car?.[caratteristica];
    if (valForma != null) return Number(valForma);
  }
  const base = Number(scheda?.caratteristiche?.[caratteristica]) || 0;
  const valori = oggettiConEffettoAttivo(scheda)
    .map((o) => new RegExp(`^${caratteristica}_impostata_(\\d+)$`).exec(o.effettoMeccanico))
    .filter(Boolean)
    .map((m) => Number(m[1]));
  return valori.length ? Math.max(base, ...valori) : base;
}

export const TIPI_COPERTURA_5E = [
  { key: 'nessuna', labelIt: 'Nessuna Copertura', labelEn: 'No Cover', ca: 0, tsDes: 0, descIt: 'Bersaglio in campo aperto, nessuna protezione.', descEn: 'Target in open field, no protection.' },
  { key: 'mezza', labelIt: 'Mezza (+2 CA/TS)', labelEn: 'Half Cover (+2)', ca: 2, tsDes: 2, descIt: '+2 a CA e TS Destrezza (muretto, cassa, tronco o altra creatura).', descEn: '+2 to AC and Dex saves (low wall, crate, tree trunk, or another creature).' },
  { key: 'tre_quarti', labelIt: 'Tre Quarti (+5 CA/TS)', labelEn: 'Three-Quarters (+5)', ca: 5, tsDes: 5, descIt: '+5 a CA e TS Destrezza (feritoia, saracinesca, muro parziale).', descEn: '+5 to AC and Dex saves (arrow slit, portcullis, partial wall).' },
  { key: 'totale', labelIt: 'Copertura Totale', labelEn: 'Total Cover', ca: 0, tsDes: 0, descIt: 'Completamente celato da ostacoli: non bersagliabile direttamente da attacchi o incantesimi.', descEn: 'Completely concealed: cannot be targeted directly by attacks or spells.' },
];

export function bonusCopertura(scheda) {
  const tipo = scheda?.copertura || 'nessuna';
  const match = TIPI_COPERTURA_5E.find((c) => c.key === tipo) || TIPI_COPERTURA_5E[0];
  return {
    tipo: match.key,
    ca: match.ca,
    tsDes: match.tsDes,
    totale: match.key === 'totale',
    labelIt: match.labelIt,
    labelEn: match.labelEn,
    descIt: match.descIt,
    descEn: match.descEn,
  };
}

/**
 * CA totale in base all'equipaggiamento (regole 5e):
 * se la Forma Bestiale è attiva, usa la CA naturale della bestia;
 * altrimenti a mano = valore scritto · nessuna 10+DES · leggera base+DES ·
 * media base+min(DES,2) · pesante base. In tutti i casi si sommano
 * scudo (+2) ed eventuale bonus magico, più eventuale mezza/tre quarti copertura.
 */
export function caTotale(scheda) {
  const bonusPoteri = bonusPotereBersaglio(scheda, 'ca');
  const forma = trasformazioneAttiva(scheda);
  if (forma && forma.dati.ca != null) {
    return Number(forma.dati.ca) + bonusClasseArmaturaOggetti(scheda) + bonusCopertura(scheda).ca + bonusPoteri;
  }
  const a = scheda.armatura || {};
  const des = modificatore(punteggioCaratteristica(scheda, 'destrezza'));
  let ca;
  if (a.tipo === 'nessuna') ca = 10 + des;
  else if (a.tipo === 'leggera') ca = (a.base || 0) + des;
  else if (a.tipo === 'media') ca = (a.base || 0) + Math.min(des, 2);
  else if (a.tipo === 'pesante') ca = a.base || 0;
  else ca = Number(scheda.ca) || 0; // 'manuale': valore scritto a mano
  return ca + (a.scudo ? 2 : 0) + (Number(a.bonus) || 0) + bonusClasseArmaturaOggetti(scheda) + bonusCopertura(scheda).ca + bonusPoteri;
}

/** Iniziativa totale: mod Destrezza + eventuali bonus dei Poteri personalizzati attivi. */
export function iniziativaTotale(scheda) {
  return modificatore(punteggioCaratteristica(scheda, 'destrezza')) + bonusPotereBersaglio(scheda, 'iniziativa');
}

/** PF massimi effettivi: valore scritto sulla scheda (dimezzato da Sfinimento
 * 2014 di livello 4+) + eventuali bonus dei Poteri attivi. */
export function pfMassimiEffettivi(scheda) {
  const base = Number(scheda?.pfMax) || 0;
  const dimezzato = effettiSfinimento(scheda).pfDimezzati ? Math.floor(base / 2) : base;
  return Math.max(1, dimezzato + bonusPotereBersaglio(scheda, 'pf_massimi'));
}

/**
 * Effetti meccanici del livello di Sfinimento (0–6): nella 5.5 (2024) è
 * un'unica penalità piatta ai tiri di d20 e alla velocità per livello; nella
 * 5.0 (2014) sono soglie cumulative (ogni livello aggiunge un effetto, quelli
 * dei livelli precedenti restano attivi). Il livello 6 uccide in entrambe.
 */
export function effettiSfinimento(scheda) {
  const livello = Math.max(0, Math.min(6, Number(scheda?.sfinimento) || 0));
  // Senza versione il PG segue le regole 2024 (stesso default del resto della scheda).
  const is2024 = scheda?.versione !== '2014';
  return {
    livello,
    morto: livello >= 6,
    penalitaD20: is2024 ? 2 * livello : 0,
    penalitaVelocita: is2024 ? 1.5 * livello : 0,
    svantaggioProve: !is2024 && livello >= 1,
    svantaggioAttacchiSalvezza: !is2024 && livello >= 3,
    velocitaDimezzata: !is2024 && livello >= 2 && livello < 5,
    velocitaZero: !is2024 && livello >= 5,
    pfDimezzati: !is2024 && livello >= 4,
  };
}

/**
 * Sei competente per indossare questo tipo di armatura? 'manuale' e 'nessuna'
 * sono sempre concessi; leggera/media/pesante richiedono la competenza segnata
 * in addestramento (che deriva dalla classe, o si attiva a mano per talenti).
 */
export function competenteInArmatura(scheda, tipo) {
  if (tipo === 'manuale' || tipo === 'nessuna') return true;
  return !!scheda.addestramento?.armature?.[tipo];
}

/**
 * Estrae l'eventuale bonus dell'abilità dalla scheda della bestia (es. "Percezione +3, Furtività +4").
 * Ritorna il numero se presente, altrimenti null.
 */
export function bonusAbilitaBestia(scheda, abilitaKey) {
  if (!scheda?.formaBestiale?.attiva || !scheda.formaBestiale.abilita || scheda.formaBestiale.abilita === '—') return null;
  const def = ABILITA.find((a) => a.key === abilitaKey);
  if (!def) return null;
  const label = def.label;
  const key = def.key;
  const re = new RegExp(`(?:${label}|${key})\\s*([+-]?\\d+)`, 'iu');
  const m = String(scheda.formaBestiale.abilita).match(re);
  return m ? parseInt(m[1], 10) : null;
}

/** Bonus di un'abilità: mod caratteristica + competenza (1x o 2x per maestria), con regola Forma Selvatica. */
export function bonusAbilita(scheda, abilita) {
  const def = ABILITA.find((a) => a.key === abilita);
  if (!def) return 0;
  const livComp = (scheda?.abilita && scheda.abilita[abilita]) || 0;
  // 0 = niente, 1 = competenza (cerchietto ●), 2 = competenza di classe/razza
  // (stellina ★, solo un marcatore d'origine: vale ×1 come la 1), 3 = Maestria
  // /Expertise (✦, doppia competenza — Ladro e Bardo): vale ×2.
  const moltiplicatore = livComp >= 3 ? 2 : livComp >= 1 ? 1 : 0;
  const bonusComp = Number.isFinite(Number(scheda?.bonusCompetenza))
    ? Number(scheda.bonusCompetenza)
    : bonusCompetenzaDaLivello(scheda?.livello || 1);
  const bonusBase = modificatore(punteggioCaratteristica(scheda, def.car)) + moltiplicatore * bonusComp;

  // Regola 5e PHB Forma Selvatica: usa il bonus della bestia se superiore
  if (scheda?.formaBestiale?.attiva) {
    const bonusBestia = bonusAbilitaBestia(scheda, abilita);
    if (bonusBestia != null) {
      return Math.max(bonusBase, bonusBestia);
    }
  }
  return bonusBase;
}

/** Bonus di un tiro salvezza: mod caratteristica + eventuale competenza + bonus copertura (su Des). */
export function bonusTiroSalvezza(scheda, car) {
  const bonusComp = Number.isFinite(Number(scheda?.bonusCompetenza))
    ? Number(scheda.bonusCompetenza)
    : bonusCompetenzaDaLivello(scheda?.livello || 1);
  const bonusCop = car === 'destrezza' ? bonusCopertura(scheda).tsDes : 0;
  return (
    modificatore(punteggioCaratteristica(scheda, car)) +
    (scheda?.tiriSalvezza?.[car] ? bonusComp : 0) +
    bonusTiriSalvezzaOggetti(scheda) +
    bonusCop
  );
}

export const SCALE_TAGLIE_5E = ['Minuscola', 'Piccola', 'Media', 'Grande', 'Enorme', 'Mastodontica'];

export const MOLTIPLICATORI_TAGLIA = {
  Minuscola: 0.5,
  Piccola: 1,
  Media: 1,
  Grande: 2,
  Enorme: 4,
  Mastodontica: 8,
};

export const SPAZIO_TAGLIA_5E = {
  Minuscola: '75 cm (1/4 quadretto)',
  Piccola: '1,5 m (1 quadretto)',
  Media: '1,5 m (1 quadretto)',
  Grande: '3 m × 3 m (4 quadretti)',
  Enorme: '4,5 m × 4,5 m (9 quadretti)',
  Mastodontica: '6 m × 6 m o più (16+ quadretti)',
};

export const LOTTA_MAX_TAGLIA_5E = {
  Minuscola: 'Piccola',
  Piccola: 'Media',
  Media: 'Grande',
  Grande: 'Enorme',
  Enorme: 'Mastodontica',
  Mastodontica: 'Mastodontica+',
};

/**
 * Calcola la taglia effettiva del personaggio considerando:
 * 1. Forma Bestiale attiva (prende la taglia della bestia)
 * 2. Incantesimo Ingrandire/Ridurre o condizione 'Ingrandito' / 'Ridotto'
 * 3. Taglia base della scheda
 */
export function tagliaEffettiva(scheda) {
  const forma = trasformazioneAttiva(scheda);
  if (forma && forma.dati.taglia) {
    return forma.dati.taglia;
  }
  const base = scheda?.taglia || 'Media';
  const idx = SCALE_TAGLIE_5E.indexOf(base);
  if (idx === -1) return base;

  if (scheda?.effettoTaglia === 'ingrandito' || (Array.isArray(scheda?.condizioni) && scheda.condizioni.includes('Ingrandito'))) {
    return SCALE_TAGLIE_5E[Math.min(SCALE_TAGLIE_5E.length - 1, idx + 1)];
  }
  if (scheda?.effettoTaglia === 'ridotto' || (Array.isArray(scheda?.condizioni) && scheda.condizioni.includes('Ridotto'))) {
    return SCALE_TAGLIE_5E[Math.max(0, idx - 1)];
  }
  return base;
}

/**
 * Parsea una stringa o un oggetto azione di una bestia / mostro 5e,
 * estraendo nome, descrizione, bonus per colpire, formula del danno e CD tiro salvezza.
 */
export function estraiTipoDannoBestia(desc) {
  if (!desc) return '';
  const match = desc.match(/danni?\s+(taglienti|perforanti|contundenti|da veleno|da fuoco|da freddo|necrotici|radiosi|psichici|di forza|da tuono|da acido)/i)
    || desc.match(/(slashing|piercing|bludgeoning|poison|fire|cold|necrotic|radiant|psychic|force|thunder|acid)\s+damage/i);
  if (!match) return '';
  const map = {
    taglienti: 'Tagliente',
    perforanti: 'Perforante',
    contundenti: 'Contundente',
    'da veleno': 'Veleno',
    'da fuoco': 'Fuoco',
    'da freddo': 'Freddo',
    necrotici: 'Necrotico',
    radiosi: 'Radioso',
    psichici: 'Psichico',
    'di forza': 'Forza',
    'da tuono': 'Tuono',
    'da acido': 'Acido',
    slashing: 'Tagliente',
    piercing: 'Perforante',
    bludgeoning: 'Contundente',
    poison: 'Veleno',
    fire: 'Fuoco',
    cold: 'Freddo',
    necrotic: 'Necrotico',
    radiant: 'Radioso',
    psychic: 'Psichico',
    force: 'Forza',
    thunder: 'Tuono',
    acid: 'Acido'
  };
  return map[match[1].toLowerCase()] || match[1];
}

export function parseAzioneBestia(azione) {
  if (!azione) return { nome: 'Azione', desc: '', bonus: null, danno: '', tipoDanno: '', cd: null, testoOriginale: '' };
  const str = typeof azione === 'string' ? azione : (azione.nome || azione.desc || '');
  const colonIdx = str.indexOf(':');
  const nome = colonIdx > -1 ? str.slice(0, colonIdx).trim() : (str.split(/[,.]/)[0] || 'Attacco');
  const desc = colonIdx > -1 ? str.slice(colonIdx + 1).trim() : str;

  // Trova bonus per colpire: es. "+4 al tiro per colpire", "+5 per colpire", "+5 to hit"
  const matchHit = str.match(/([+-]?\d+)\s*(?:al tiro per colpire|per colpire|to hit)/i);
  const bonus = matchHit ? parseInt(matchHit[1], 10) : null;

  // Trova formula danno primaria: es. "1d10+2", "2d6+4", "3d6", "1" (es. "1 danno tagliente")
  const matchDanno = desc.match(/(\d+d\d+(?:\s*[+-]\s*\d+)?|\b\d+\b(?=\s+danno|\s+danni|\s+damage))/i);
  const danno = matchDanno ? matchDanno[1].replace(/\s+/g, '') : '';

  // Trova tipo di danno: es. "danni perforanti", "slashing damage"
  const tipoDanno = estraiTipoDannoBestia(desc);

  // Trova CD: es. "CD 13", "DC 14"
  const matchCD = desc.match(/(?:CD|DC)\s*(\d+)/i);
  const cd = matchCD ? parseInt(matchCD[1], 10) : null;

  return {
    nome,
    desc,
    bonus,
    danno,
    tipoDanno,
    cd,
    testoOriginale: str,
  };
}

/**
 * Analizza un attacco o un'arma per verificare se possiede la proprietà Versatile
 * (con i relativi dadi a 1 mano e a 2 mani) o la proprietà Portata (Reach 3m).
 */
export function analizzaArmaVersatileEPortata(attacco, armaDb = null) {
  if (!attacco) return { isVersatile: false, dado1M: '', dado2M: '', hasReach: false };
  const nome = String(attacco.nome || '').trim().toLowerCase();
  const note = String(attacco.note || '').toLowerCase();
  const arma = armaDb || null;

  // 1. Controllo Versatilità
  let isVersatile = false;
  let dado1M = '';
  let dado2M = '';

  if (arma?.versatile) {
    isVersatile = true;
    dado1M = arma.danno;
    dado2M = arma.versatile;
  } else if (/versatile\s*\((1d\d+)\)/i.test(note)) {
    isVersatile = true;
    const match = note.match(/versatile\s*\((1d\d+)\)/i);
    dado2M = match[1];
    dado1M = dado2M === '1d10' ? '1d8' : '1d6';
  } else if (/spada lunga|longsword|ascia da battaglia|battleaxe|martello da guerra|warhammer|tridente|trident/i.test(nome)) {
    isVersatile = true;
    dado1M = '1d8';
    dado2M = '1d10';
  } else if (/bastone ferrato|quarterstaff|lancia\b|spear\b/i.test(nome) && !/lancia da cavaliere|lance/i.test(nome)) {
    isVersatile = true;
    dado1M = '1d6';
    dado2M = '1d8';
  }

  // 2. Controllo Portata (Reach)
  let hasReach = false;
  if (arma?.reach || arma?.portata) {
    hasReach = true;
  } else if (/portata|reach/i.test(note)) {
    hasReach = true;
  } else if (/alabarda|halberd|falcione|glaive|picca|pike|frusta|whip/i.test(nome)) {
    hasReach = true;
  }

  return { isVersatile, dado1M, dado2M, hasReach };
}

/**
 * Commuta la presa di un'arma versatile tra 1 mano e 2 mani,
 * sostituendo il dado di danno nella formula senza toccare il modificatore fisso.
 */
export function alternaImpugnaturaVersatile(attacco, armaDb = null) {
  const { isVersatile, dado1M, dado2M } = analizzaArmaVersatileEPortata(attacco, armaDb);
  if (!isVersatile) return attacco;

  const aDueManiAttuale = Boolean(attacco.aDueMani);
  const nuovaDueMani = !aDueManiAttuale;
  const vecchioDado = aDueManiAttuale ? dado2M : dado1M;
  const nuovoDado = nuovaDueMani ? dado2M : dado1M;

  let dannoStr = String(attacco.danno || '');
  if (dannoStr.includes(vecchioDado)) {
    dannoStr = dannoStr.replace(vecchioDado, nuovoDado);
  } else if (/^1d\d+/i.test(dannoStr)) {
    dannoStr = dannoStr.replace(/^1d\d+/i, nuovoDado);
  } else {
    dannoStr = nuovoDado;
  }

  return {
    ...attacco,
    aDueMani: nuovaDueMani,
    danno: dannoStr,
  };
}

/**
 * Analizza se un attacco richiede munizioni (arco, balestra, fionda, cerbottana, arma da fuoco)
 * e calcola la scorta residua nell'inventario (compresi oggetti all'interno di contenitori/faretre).
 */
export function analizzaMunizioniArma(attacco, inventario = [], armaDb = null) {
  if (!attacco || attacco.isSpell) return { usaMunizioni: false, totale: 0, nomeMunizione: '', tipoMunizione: '', trovato: false };
  const nome = String(attacco.nome || '').trim().toLowerCase();
  const note = String(attacco.note || '').toLowerCase();
  const arma = armaDb || null;

  const isRangedMunizioni = !!(arma && arma.ranged && /munizion/i.test(arma.note || ''))
    || /arco|balestra|fionda|cerbottana|blowgun|sling|crossbow|shortbow|longbow|pistol|moschetto|musket/i.test(nome)
    || /munizion|ammo|ammunition/i.test(note);

  if (!isRangedMunizioni) {
    return { usaMunizioni: false, totale: 0, nomeMunizione: '', tipoMunizione: '', trovato: false };
  }

  let reMunizione;
  let tipoMunizione = 'Munizioni';
  if (/arco|bow/i.test(nome)) {
    reMunizione = /frecc|arrow/i;
    tipoMunizione = 'Frecce';
  } else if (/balestra|crossbow/i.test(nome)) {
    reMunizione = /(quadrell|verretton|dardo|bolt)/i;
    tipoMunizione = 'Quadrelli';
  } else if (/fionda|sling/i.test(nome)) {
    reMunizione = /(proiettil|pallott|bullet|sling)/i;
    tipoMunizione = 'Proiettili';
  } else if (/cerbottana|blowgun/i.test(nome)) {
    reMunizione = /(aghi|dardi|needle|dart)/i;
    tipoMunizione = 'Aghi';
  } else {
    reMunizione = /(frecc|quadrell|proiettil|dardo|cartucc|pallott|munizion|arrow|bolt|bullet|ammo)/i;
    tipoMunizione = 'Munizioni';
  }

  let totale = 0;
  let nomeMunizione = '';
  let primoItemId = null;
  let primoSubId = null;

  (inventario || []).forEach((o) => {
    if (reMunizione.test(o.nome)) {
      const q = Number(o.qta) || 0;
      totale += q;
      if (!nomeMunizione && q > 0) {
        nomeMunizione = o.nome;
        primoItemId = o.id;
      }
    }
    if (Array.isArray(o.contenuto)) {
      o.contenuto.forEach((sub) => {
        if (reMunizione.test(sub.nome)) {
          const sq = Number(sub.qta) || 0;
          totale += sq;
          if (!nomeMunizione && sq > 0) {
            nomeMunizione = sub.nome;
            primoItemId = o.id;
            primoSubId = sub.id;
          }
        }
      });
    }
  });

  return {
    usaMunizioni: true,
    totale,
    nomeMunizione: nomeMunizione || tipoMunizione,
    tipoMunizione,
    trovato: totale > 0,
    itemId: primoItemId,
    subId: primoSubId,
  };
}

// Palette ridotta: il colore dice il TIPO di dato, non la singola voce.
// Pochi colori funzionali (dove, quando, costo, tiro salvezza, cura, tiro per
// colpire) + un neutro per le etichette descrittive; troppi colori diversi
// sulla stessa riga competono tra loro e nessuno spicca più.
// Coppie chiaro/scuro perché un solo hex non regge sfondo bianco e quasi-nero.
const NEUTRO = { chiaro: '#514d48', scuro: '#d6d3d1' };
const QUANDO = { chiaro: '#0c582b', scuro: '#4ade80' };
// "Come si lancia": Concentrazione (fucsia) e Rituale (viola), due tinte che nessun
// altro chip usa (le scuole sono neutre): con il grigio neutro la Concentrazione
// si confondeva con la scuola di magia accanto, e il Rituale deve distinguersi
// dalla Concentrazione.
// CONTRASTO: tutti i colori di questa palette sono calcolati per avere almeno 5,6:1 come
// testo sul chip (sfondo = pannello + 12% del colore stesso), nei due temi e anche sui
// pannelli tinti dalla classe: sotto i 4,5:1 (WCAG AA) il testo piccolo non si legge
// (misurato con axe-core: prima il tema chiaro ne mancava il 3,6:1 per il verde "quando").
const CONCENTRAZIONE = { chiaro: '#84178f', scuro: '#f0abfc' };
const RITUALE = { chiaro: '#6123c0', scuro: '#c4b5fd' };

/** Palette per tipo di informazione, condivisa da Combattimento e Incantesimi. */
export const COLORE_CATEGORIA_INFO = {
  gittata:      { chiaro: '#1942b7', scuro: '#93c5fd' }, // dove: gittata, portata, area
  tempo:        QUANDO,                                   // quando: tempo di lancio
  durata:       QUANDO,                                   // quando: durata
  innesco:      QUANDO,                                   // quando: innesco di una reazione
  tiroSalvezza: { chiaro: '#7d3a09', scuro: '#fbbf24' }, // tiro salvezza / CD
  danno:        { chiaro: '#971717', scuro: '#f88686' }, // costo: danno
  guarigione:   { chiaro: '#0c5853', scuro: '#5eead4' }, // cura (non è un danno)
  attacco:      { chiaro: '#704407', scuro: '#fde047' }, // tiro per colpire, non tinto dalla classe
  modificato:   { chiaro: '#1d48aa', scuro: '#93c5fd' }, // valore modificato da Poteri/Sfinimento
  proprieta:    NEUTRO,                                   // descrittivo: Magico, Versatile, Maestria
  effetto:      NEUTRO,                                   // descrittivo: effetto di una reazione
  concentrazione: CONCENTRAZIONE,                         // come si lancia: Concentrazione
  rituale:      RITUALE,                                  // come si lancia: Rituale
  scuola:       NEUTRO,                                   // descrittivo: il nome della scuola basta
};

// Segmenti della nota di un incantesimo che dicono solo "Concentrazione" o
// "Rituale": all'aggiunta dal catalogo finiscono nella nota ("Rituale, Conc."),
// ma la riga mostra già i chip dedicati, quindi qui si tolgono per non
// ripetere la stessa informazione due volte.
const RE_SEGMENTO_CONC = /^(?:conc\.?|concentrazione|concentration)$/i;
const RE_SEGMENTO_RITUALE = /^(?:rituale|ritual)$/i;

/**
 * Separa da una nota di incantesimo i segmenti "Conc."/"Concentrazione" e
 * "Rituale" (separati da virgola, punto e virgola o punto medio).
 * Restituisce la nota restante e se quei segmenti c'erano, così la riga può
 * mostrare il chip una sola volta anche quando il dato viene solo dalla nota.
 */
export function separaNotaIncantesimo(nota) {
  const segmenti = String(nota || '').split(/\s*[,;·]\s*/).map((x) => x.trim()).filter(Boolean);
  let conc = false;
  let rituale = false;
  const resto = segmenti.filter((seg) => {
    if (RE_SEGMENTO_CONC.test(seg)) { conc = true; return false; }
    if (RE_SEGMENTO_RITUALE.test(seg)) { rituale = true; return false; }
    return true;
  });
  // Nessun segmento tolto: la nota resta identica (anche nei separatori).
  if (!conc && !rituale) return { nota: String(nota || '').trim(), conc, rituale };
  return { nota: resto.join(', '), conc, rituale };
}

/** Risolve il colore fisso di una categoria per il tema attivo (chiaro/scuro). */
export function coloreCategoria(categoria, scuro) {
  const coppia = COLORE_CATEGORIA_INFO[categoria];
  if (!coppia) return scuro ? '#a0937f' : '#736858'; // fallback: inkDim
  return scuro ? coppia.scuro : coppia.chiaro;
}

/**
 * Spezza il testo libero di "note" di un attacco/azione in categorie
 * riconoscibili (gittata, durata, tiro salvezza, proprietà) invece di un
 * unico blocco di testo. Non modifica né consuma la nota originale: è solo
 * un riassunto aggiuntivo per la tabella Combattimento — la nota completa
 * resta modificabile com'era prima. Ogni categoria porta la sua CHIAVE
 * (non un colore risolto): sarà il chiamante a scegliere chiaro/scuro con
 * coloreCategoria().
 */
export function estraiCategorieNota(nota) {
  const testo = String(nota || '');
  if (!testo.trim()) return [];
  const categorie = [];

  const gittata = testo.match(/gittata\s+([^,·]+?)(?=,|·|$)/i) || testo.match(/\brange\s+([^,·]+?)(?=,|·|$)/i);
  if (gittata) categorie.push({ icona: '🎯', etichetta: 'Gittata', testo: gittata[1].trim(), categoria: 'gittata' });

  const durata = testo.match(/durata\s+([^,·]+?)(?=,|·|$)/i) || testo.match(/\bduration\s+([^,·]+?)(?=,|·|$)/i);
  if (durata) categorie.push({ icona: '⏱️', etichetta: 'Durata', testo: durata[1].trim(), categoria: 'durata' });

  const ts = testo.match(/\b(?:TS|Saving Throw)\s+(\w+)/i);
  const cdMatch = testo.match(/\bCD\s*(\d+)/i);
  if (ts || cdMatch) {
    categorie.push({
      icona: '🎲',
      etichetta: 'Tiro Salvezza',
      testo: [ts?.[1] || '', cdMatch ? `CD ${cdMatch[1]}` : ''].filter(Boolean).join(' · '),
      categoria: 'tiroSalvezza',
    });
  }

  // "Trucchetto" non è più un badge: la riga lo mostra già con l'icona ✨
  // iniziale (contro 🪄 degli incantesimi con slot), sarebbe un'informazione duplicata.
  // Il testo della proprietà si ferma a virgola/punto medio/"•"/due punti e
  // a parentesi non bilanciate: "Trucchetto (Attacco Magico): trascina 3m"
  // dà "Magico", non "Magico): trascina 3m"; "Magico con SAG (Randello/Bastone)"
  // e "Versatile (1d8)" restano interi (parentesi complete).
  const proprieta = testo.match(/\b(Magico(?:\s+con\s+[A-Za-zÀ-ÿ]+(?:\s*\([^()]*\))?)?|Versatile(?:\s*\([^()]*\)|\s+\d*d\d+(?:\s*[+-]\s*\d+)?)?|Maestria:\s*[^,·•:()]+(?:\([^()]*\))?)/i);
  if (proprieta) categorie.push({ icona: '🏷️', etichetta: 'Proprietà', testo: proprieta[1].trim(), categoria: 'proprieta' });

  return categorie;
}

/**
 * Regole PF 0 / danno massiccio (PHB 2014 p.197): subire danno mentre si è
 * già a 0 PF costa un fallimento automatico ai Tiri Salvezza contro la
 * Morte; se il danno "in eccesso" (quello che avanza dopo aver azzerato i
 * PF) è pari o superiore ai PF massimi, la morte è istantanea. Pura logica,
 * nessuno stato React: chi chiama applica il risultato con aggiorna().
 *
 * @param {number} pfMax PF massimi del personaggio
 * @param {number} pfPrima PF attuali prima di subire questo danno (>= 0)
 * @param {number} dannoReale danno che arriva davvero ai PF (dopo i PF temporanei)
 * @param {{successi:number, fallimenti:number}} tsMortePrima stato attuale dei TS Morte
 * @returns {{pfDopo:number, istantaneo:boolean, tsMorteDopo:{successi:number,fallimenti:number}|null}}
 *   tsMorteDopo è null quando questo colpo non tocca i Tiri Salvezza contro la Morte
 *   (il personaggio non era già a 0 PF e non ci è arrivato con un eccesso letale).
 */
export function esitoDannoPf0(pfMax, pfPrima, dannoReale, tsMortePrima) {
  const max = Math.max(1, Number(pfMax) || 1);
  const prima = Math.max(0, Number(pfPrima) || 0);
  const danno = Math.max(0, Number(dannoReale) || 0);
  const pfDopo = Math.max(0, prima - danno);
  const eccesso = danno - prima; // quanto danno avanza dopo aver azzerato i PF (può essere negativo)

  if (pfDopo > 0 || danno <= 0) {
    return { pfDopo, istantaneo: false, tsMorteDopo: null };
  }
  if (eccesso >= max) {
    return { pfDopo: 0, istantaneo: true, tsMorteDopo: { successi: 0, fallimenti: 3 } };
  }
  if (prima === 0) {
    // Danno subito mentre si è già a 0 PF: un fallimento automatico.
    const fallimenti = Math.min(3, (Number(tsMortePrima?.fallimenti) || 0) + 1);
    return { pfDopo: 0, istantaneo: fallimenti >= 3, tsMorteDopo: { successi: Number(tsMortePrima?.successi) || 0, fallimenti } };
  }
  // Ha appena toccato 0 PF senza eccesso letale: nessun fallimento automatico
  // (le regole lo prevedono solo per il danno subito mentre si è GIÀ a 0 PF).
  return { pfDopo: 0, istantaneo: false, tsMorteDopo: null };
}


/**
 * Cosa cambia da solo quando i PF passano da sopra 0 a 0, o tornano sopra 0
 * (qualunque sia la via: tasti rapidi, Combat Tracker, PF scritti a mano, cure):
 * - a 0 PF: condizione Privo di sensi e fine della concentrazione (sei incapacitato);
 * - di nuovo sopra 0: via Privo di sensi e TS contro morte azzerati (PHB: si
 *   azzerano quando recuperi PF).
 * Restituisce la patch da applicare, o null. Nessun livello di sfinimento: le
 * regole (2014 e 2024) non lo danno per essere scesi a 0 PF.
 */
export function patchTransizionePf(scheda, pfPrima) {
  const prima = Math.max(0, Number(pfPrima) || 0);
  const dopo = Math.max(0, Number(scheda?.pfAttuali) || 0);
  const condizioni = Array.isArray(scheda?.condizioni) ? scheda.condizioni : [];
  const patch = {};
  if (prima > 0 && dopo === 0) {
    if (!condizioni.includes('Privo di sensi')) patch.condizioni = [...condizioni, 'Privo di sensi'];
    if (scheda?.concentrazione) patch.concentrazione = '';
  } else if (prima === 0 && dopo > 0) {
    if (condizioni.includes('Privo di sensi')) patch.condizioni = condizioni.filter((c) => c !== 'Privo di sensi');
    const ts = scheda?.tsMorte || {};
    if ((Number(ts.successi) || 0) > 0 || (Number(ts.fallimenti) || 0) > 0) patch.tsMorte = { successi: 0, fallimenti: 0 };
  }
  return Object.keys(patch).length ? patch : null;
}

/** CD del TS di Concentrazione dopo un danno: 10 o metà danno (il più alto); nella 5.5 al massimo 30. */
export function cdConcentrazione(danno, versione) {
  const cd = Math.max(10, Math.floor((Number(danno) || 0) / 2));
  return versione === '2014' ? cd : Math.min(30, cd);
}

/**
 * Dadi Vita recuperati con un riposo lungo, per edizione:
 * - 5.0 (PHB 2014): metà dei Dadi Vita totali (minimo 1);
 * - 5.5 (PHB 2024): tutti i Dadi Vita spesi.
 * Senza versione vale la 2024 (stesso default del resto della scheda).
 */
export function dadiVitaRecuperatiRiposoLungo(livelloTotale, versione) {
  const liv = Math.max(1, Math.floor(Number(livelloTotale) || 1));
  return String(versione) === '2014' ? Math.max(1, Math.floor(liv / 2)) : liv;
}


// --- Danno ad area: resistenze, immunità e vulnerabilità ----------------------

/** Radici dei tipi di danno (per riconoscerli nei testi: "danni da fuoco", "contundenti"...). */
const RADICI_DANNO = {
  Acido: 'acid', Contundente: 'contundent', Freddo: 'fredd', Fuoco: 'fuoc', Fulmine: 'fulmin',
  Necrotico: 'necrotic', Perforante: 'perforant', Psichico: 'psichic', Radiante: 'radiant',
  Tagliente: 'taglient', Tuono: 'tuon', Veleno: 'velen', Forza: 'forza',
};

/**
 * Legge da un testo libero (resistenze del PG, tratti di un mostro o di un alleato)
 * come la creatura reagisce a un tipo di danno: 'immune', 'resistente', 'vulnerabile'
 * o 'normale'. Riconosce frasi come "Resistenze: freddo; contundente... da attacchi
 * non magici. Immunità ai danni: necrotico, veleno" o "Vulnerabile ai danni contundenti".
 * Le resistenze "da attacchi non magici" non valgono per un incantesimo (`magico`).
 * Resistenza + vulnerabilità insieme si annullano; l'immunità vince su tutto.
 */
export function difesaControDanno(testo, tipoDanno, { magico = true } = {}) {
  const radice = RADICI_DANNO[tipoDanno];
  const t = String(testo || '').toLowerCase();
  if (!radice || !t) return 'normale';
  const re = /(immun[\wàèéìòù]*|resisten[\wàèéìòù]*|vulnerabil[\wàèéìòù]*)/g;
  const trovati = [];
  let m;
  while ((m = re.exec(t))) trovati.push({ parola: m[1], da: m.index, inizioAmbito: m.index + m[1].length });
  let immune = false;
  let resistente = false;
  let vulnerabile = false;
  trovati.forEach((k, i) => {
    const fineFrase = t.slice(k.inizioAmbito).search(/\.(\s|$)/);
    const limiteFrase = fineFrase < 0 ? t.length : k.inizioAmbito + fineFrase;
    const limite = Math.min(limiteFrase, i + 1 < trovati.length ? trovati[i + 1].da : t.length);
    // Le condizioni ("Immunità alle condizioni: avvelenato", "...e condizioni Avvelenato")
    // non riguardano i danni: l'ambito si ferma lì.
    const ambito = t.slice(k.inizioAmbito, limite).split(/condizion/)[0];
    // Il tipo di danno può stare in una parte con "da attacchi non magici": allora vale solo se il danno non è magico.
    const parti = ambito.split(';');
    const colpito = parti.some((p) => p.includes(radice) && (!magico || !/non magic/.test(p)));
    if (!colpito) return;
    if (k.parola.startsWith('immun')) immune = true;
    else if (k.parola.startsWith('resisten')) resistente = true;
    else vulnerabile = true;
  });
  if (immune) return 'immune';
  if (resistente && vulnerabile) return 'normale';
  if (resistente) return 'resistente';
  if (vulnerabile) return 'vulnerabile';
  return 'normale';
}

/**
 * Danno finale di un effetto ad area su una creatura: prima il dimezzamento per il
 * tiro salvezza superato (per difetto), poi resistenza (metà, per difetto),
 * vulnerabilità (doppio) o immunità (0).
 */
export function dannoConDifesa(danno, difesa, tsSuperato = false) {
  let d = Math.max(0, Math.floor(Number(danno) || 0));
  if (tsSuperato) d = Math.floor(d / 2);
  if (difesa === 'immune') return 0;
  if (difesa === 'resistente') return Math.floor(d / 2);
  if (difesa === 'vulnerabile') return d * 2;
  return d;
}

/**
 * Un attacco salvato di un INCANTESIMO è ancora valido? Segue la lista incantesimi:
 * compare solo se l'incantesimo c'è ed è preparato (trucchetti, sempre preparati, bonus,
 * o classi che non preparano). Se cambi gli incantesimi, l'attacco sparisce da solo e
 * torna se l'incantesimo torna. Con la lista vuota (scheda importata senza lista) non si
 * nasconde nulla. Le armi non passano di qui: spariscono già al disequipaggiamento.
 */
export function attaccoIncantesimoAttivo(att, incantesimiLista, preparaIncantesimi) {
  const lista = Array.isArray(incantesimiLista) ? incantesimiLista : [];
  if (!lista.length) return true;
  const pulito = String(att?.nome || '').replace(/^✨\s*/, '').replace(/\s*\((shillelagh|bastone incantato)\)/gi, '').trim().toLowerCase();
  const voce = lista.find((x) => String(x?.nome || '').trim().toLowerCase() === pulito);
  if (!voce) return false;
  return voce.livello === 0 || Boolean(voce.preparato || voce.semprePreparato || voce.bonus) || !preparaIncantesimi;
}

/**
 * Verifica se un testo contiene parole chiave associate a una determinata abilità 5e.
 */
function matchAbilitaNelTesto(abilitaKey, testo) {
  if (!testo || typeof testo !== 'string') return false;
  switch (abilitaKey) {
    case 'percezione':
      return /(percezion|perception|vista\s*acuta|olfatto\s*acuto|udito\s*acuto|sensi\s*acuti|vista\s*e\s*olfatto|udito\s*e\s*vista|udito\s*e\s*olfatto|ecolocalizz)/i.test(testo);
    case 'furtivita':
      return /(furtivit|stealth|mimetismo)/i.test(testo);
    case 'atletica':
      return /(atletic|athletic)/i.test(testo);
    case 'acrobazia':
      return /(acrobaz|acrobatic)/i.test(testo);
    case 'sopravvivenza':
      return /(sopravvivenz|survival|tracciamento|fiuto)/i.test(testo);
    case 'intuizione':
      return /(intuizion|insight)/i.test(testo);
    case 'indagare':
      return /(indagar|investiga)/i.test(testo);
    case 'addestrareAnimali':
      return /(addestrare\s*animal|animal\s*handling)/i.test(testo);
    case 'rapiditaDiMano':
      return /(rapidit[àa]\s*di\s*mano|sleight\s*of\s*hand)/i.test(testo);
    case 'arcano':
      return /(arcana|arcano)/i.test(testo);
    case 'storia':
      return /(storia|history)/i.test(testo);
    case 'natura':
      return /(natur)/i.test(testo);
    case 'religione':
      return /(religion)/i.test(testo);
    case 'medicina':
      return /(medicin)/i.test(testo);
    case 'inganno':
      return /(ingann|deception)/i.test(testo);
    case 'intimidire':
      return /(intimid)/i.test(testo);
    case 'intrattenere':
      return /(intratten|performance|esibizion)/i.test(testo);
    case 'persuasione':
      return /(persuas)/i.test(testo);
    default:
      return false;
  }
}

/**
 * Individua se il personaggio gode di vantaggio automatico per una data abilità
 * da trasformazioni (Forma Bestiale / Metamorfosi), soglie di debito Araldi,
 * poteri attivi o privilegi del personaggio.
 *
 * Restituisce:
 * {
 *   attivo: true,
 *   fonte: string,
 *   fonteEn?: string,
 *   dettaglio: string,
 *   tipo: 'forma' | 'debito' | 'potere' | 'privilegio'
 * } | null
 */
export function trovaVantaggioAbilita(scheda, abilitaKey) {
  if (!scheda || !abilitaKey) return null;

  // 1. Ira Barbarica (PHB: vantaggio alle prove di Forza se non in armatura pesante)
  if (scheda.inIra && scheda.armatura?.tipo !== 'pesante') {
    const abilDef = ABILITA.find((ab) => ab.key === abilitaKey);
    if (abilDef?.car === 'forza') {
      return {
        attivo: true,
        fonte: 'Ira Barbarica',
        fonteEn: 'Barbarian Rage',
        dettaglio: 'Vantaggio a tutte le prove di Forza mentre sei in Ira.',
        tipo: 'privilegio',
      };
    }
  }

  // 2. Oggetti Equipaggiati nell'Inventario
  const oggettiEquip = (Array.isArray(scheda.inventario) ? scheda.inventario : []).filter((o) => o?.equip);
  for (const o of oggettiEquip) {
    const nomeO = String(o.nome || '').toLowerCase();
    const noteO = String(o.note || '').toLowerCase();
    const effO = String(o.effettoMeccanico || '').toLowerCase();
    const testoO = `${nomeO} ${noteO} ${effO}`;

    if (abilitaKey === 'furtivita' && (testoO.includes('stivali elfici') || testoO.includes('mantello elfico') || testoO.includes('boots of elvenkind') || testoO.includes('cloak of elvenkind'))) {
      return {
        attivo: true,
        fonte: o.nome,
        dettaglio: 'Vantaggio alle prove di Furtività concesso da questo oggetto.',
        tipo: 'oggetto',
      };
    }
    if (abilitaKey === 'percezione' && (testoO.includes("occhi dell'aquila") || testoO.includes('eyes of the eagle'))) {
      return {
        attivo: true,
        fonte: o.nome,
        dettaglio: 'Vantaggio alle prove di Percezione basate sulla vista.',
        tipo: 'oggetto',
      };
    }
    if (abilitaKey === 'atletica' && (testoO.includes('guanti del nuotare') || testoO.includes('gloves of swimming'))) {
      return {
        attivo: true,
        fonte: o.nome,
        dettaglio: 'Vantaggio alle prove di Atletica per nuotare o scalare.',
        tipo: 'oggetto',
      };
    }
    if (/(vantaggio|advantage)/i.test(testoO) && matchAbilitaNelTesto(abilitaKey, testoO)) {
      return {
        attivo: true,
        fonte: o.nome,
        dettaglio: o.note || o.effettoMeccanico || 'Vantaggio concesso da oggetto equipaggiato.',
        tipo: 'oggetto',
      };
    }
  }

  // 3. Trasformazione Attiva (Forma Bestiale o Metamorfosi)
  const forma = trasformazioneAttiva(scheda);
  if (forma && forma.dati) {
    const tratti = Array.isArray(forma.dati.tratti)
      ? forma.dati.tratti
      : (forma.dati.tratti ? [forma.dati.tratti] : []);

    for (const tr of tratti) {
      const strTratto = String(tr || '').trim();
      if (!strTratto) continue;
      if (!/(vantaggio|advantage)/i.test(strTratto)) continue;

      if (matchAbilitaNelTesto(abilitaKey, strTratto)) {
        const parti = strTratto.split(':');
        const nomeTratto = parti.length > 1 ? parti[0].trim() : strTratto.slice(0, 30).trim();
        const nomeForma = forma.dati.nome || (forma.campo === 'metamorfosi' ? 'Metamorfosi' : 'Forma Bestiale');
        return {
          attivo: true,
          fonte: `${nomeTratto} (${nomeForma})`,
          fonteEn: `${nomeTratto} (${nomeForma})`,
          dettaglio: strTratto,
          tipo: 'forma',
        };
      }
    }
  }

  // 2. Soglie Debito Araldi del Segreto
  const soglie = soglieDebitoAttive(scheda);
  if (abilitaKey === 'intuizione' && soglie.voceOmbra) {
    return {
      attivo: true,
      fonte: "Voce nell'Ombra (Debito 5)",
      fonteEn: "Voice in the Shadows (Debt 5)",
      dettaglio: "Vantaggio permanente a tutte le prove di Intuizione.",
      tipo: 'debito',
    };
  }
  if ((abilitaKey === 'percezione' || abilitaKey === 'indagare') && soglie.occhioRisvegliato) {
    return {
      attivo: true,
      fonte: "Occhio Risvegliato (Debito 15)",
      fonteEn: "Awakened Eye (Debt 15)",
      dettaglio: `Vantaggio permanente alle prove di ${abilitaKey === 'percezione' ? 'Percezione' : 'Indagare'}.`,
      tipo: 'debito',
    };
  }

  // 3. Poteri Attivi
  if (Array.isArray(scheda.poteri)) {
    for (const pot of scheda.poteri) {
      if (!pot?.attivo) continue;
      const testo = `${pot.nome || ''} ${pot.descrizione || ''} ${pot.effetto || ''}`.toLowerCase();
      if (/(vantaggio|advantage)/i.test(testo) && matchAbilitaNelTesto(abilitaKey, testo)) {
        return {
          attivo: true,
          fonte: pot.nome || 'Potere attivo',
          dettaglio: pot.effetto || pot.descrizione || 'Vantaggio da potere attivo.',
          tipo: 'potere',
        };
      }
    }
  }

  // 4. Privilegi, Tratti o Talenti del PG
  const testoPrivilegi = `${scheda.privilegi || ''}\n${scheda.privilegiSottoclasse || ''}\n${scheda.tratti || ''}\n${scheda.talenti || ''}`;
  if (/(vantaggio|advantage)/i.test(testoPrivilegi)) {
    const righe = testoPrivilegi.split('\n');
    for (const riga of righe) {
      if (/(vantaggio|advantage)/i.test(riga) && matchAbilitaNelTesto(abilitaKey, riga)) {
        const parti = riga.split(':');
        const nome = parti.length > 1 ? parti[0].trim() : 'Tratto';
        return {
          attivo: true,
          fonte: nome,
          dettaglio: riga.trim(),
          tipo: 'privilegio',
        };
      }
    }
  }

  return null;
}

/**
 * Individua se il personaggio gode di vantaggio su un dato Tiro Salvezza (per caratteristica).
 * Restituisce i dettagli e l'eventuale condizione contestuale (es. contro spaventato, contro veleno, contro magia).
 */
export function trovaVantaggioTiroSalvezza(scheda, carattKey) {
  if (!scheda || !carattKey) return null;

  // 1. Ira Barbarica (TS Forza mentre in ira, se non in armatura pesante)
  if (scheda.inIra && carattKey === 'forza' && scheda.armatura?.tipo !== 'pesante') {
    return {
      attivo: true,
      fonte: 'Ira Barbarica',
      fonteEn: 'Barbarian Rage',
      dettaglio: 'Vantaggio ai tiri salvezza su Forza mentre sei in Ira.',
      tipo: 'privilegio',
      condizionale: 'in ira',
      badgeText: '🔥 Vant. Ira',
    };
  }

  // 2. Azione di Schivata attiva nel turno (vantaggio ai TS su Destrezza)
  if (scheda.turnoAzioni?.tatticaAttiva === 'schivata' && carattKey === 'destrezza') {
    return {
      attivo: true,
      fonte: 'Azione: Schivata',
      fonteEn: 'Action: Dodge',
      dettaglio: 'Vantaggio ai tiri salvezza su Destrezza grazie all\'azione di Schivata.',
      tipo: 'privilegio',
      condizionale: 'schivata attiva',
      badgeText: '💨 Vant. Schivata',
    };
  }

  // 3. Debito Araldi (Coraggio, Debito 35 -> Saggezza contro spaventato)
  const soglie = soglieDebitoAttive(scheda);
  if (carattKey === 'saggezza' && soglie.coraggio) {
    return {
      attivo: true,
      fonte: "Coraggio (Debito 35)",
      fonteEn: "Courage (Debt 35)",
      dettaglio: "Vantaggio ai tiri salvezza contro l'essere spaventato.",
      tipo: 'debito',
      condizionale: 'spaventato',
      badgeText: '🦁 Vant. Spaventato',
    };
  }

  // 2. Trasformazioni Attive
  const forma = trasformazioneAttiva(scheda);
  if (forma && forma.dati) {
    const tratti = Array.isArray(forma.dati.tratti)
      ? forma.dati.tratti
      : (forma.dati.tratti ? [forma.dati.tratti] : []);

    for (const tr of tratti) {
      const str = String(tr || '');
      // Resistenza alla magia (vale per tutti i TS)
      if (/(resistenza\s+alla\s+magia|magic\s+resistance)/i.test(str)) {
        return {
          attivo: true,
          fonte: `Resistenza alla Magia (${forma.dati.nome || 'Bestia'})`,
          dettaglio: "Vantaggio ai tiri salvezza contro incantesimi e altri effetti magici.",
          tipo: 'forma',
          condizionale: 'magia',
          badgeText: '✨ Vant. Magia',
        };
      }
      // Piedi saldi (TS Forza / Destrezza contro caduta o spinta)
      if (/(piedi\s+saldi|sure-footed)/i.test(str) && (carattKey === 'forza' || carattKey === 'destrezza')) {
        return {
          attivo: true,
          fonte: `Piedi saldi (${forma.dati.nome || 'Bestia'})`,
          dettaglio: "Vantaggio a TS e prove contro l'essere atterrato o spinto.",
          tipo: 'forma',
          condizionale: 'atterrato/spinto',
          badgeText: '▲ Vant. Prono/Spinto',
        };
      }
    }
  }

  // 3. Tratti razziali e Privilegi di classe
  const testo = `${scheda.classe || ''}\n${scheda.razza || ''}\n${scheda.privilegi || ''}\n${scheda.privilegiSottoclasse || ''}\n${scheda.tratti || ''}\n${scheda.talenti || ''}`.toLowerCase();

  // Barbaro: Percezione del Pericolo (Danger Sense) -> TS Destrezza
  if (carattKey === 'destrezza' && (testo.includes('percezione del pericolo') || testo.includes('danger sense') || (testo.includes('barbaro') && (Number(scheda.livello) || 1) >= 2))) {
    return {
      attivo: true,
      fonte: "Percezione del Pericolo",
      fonteEn: "Danger Sense",
      dettaglio: "Vantaggio ai tiri salvezza su Destrezza contro effetti visibili (trappole, incantesimi ad area).",
      tipo: 'privilegio',
      condizionale: 'effetti visibili',
      badgeText: '▲ Vant. Pericolo',
    };
  }

  // Nano: Resistenza Nanica (Dwarven Resilience) -> TS Costituzione contro veleno
  if (carattKey === 'costituzione' && (testo.includes('resistenza nanica') || testo.includes('dwarven resilience') || testo.includes('nano'))) {
    return {
      attivo: true,
      fonte: "Resistenza Nanica",
      fonteEn: "Dwarven Resilience",
      dettaglio: "Vantaggio ai tiri salvezza contro veleno.",
      tipo: 'razza',
      condizionale: 'veleno',
      badgeText: '🛡️ Vant. Veleno',
    };
  }

  // Elfo / Mezzelfo: Ascendenza Fatata (Fey Ancestry) -> TS Saggezza contro affascinato
  if (carattKey === 'saggezza' && (testo.includes('ascendenza fatata') || testo.includes('fey ancestry'))) {
    return {
      attivo: true,
      fonte: "Ascendenza Fatata",
      fonteEn: "Fey Ancestry",
      dettaglio: "Vantaggio ai tiri salvezza per evitare o interrompere l'essere affascinato.",
      tipo: 'razza',
      condizionale: 'affascinato',
      badgeText: '✨ Vant. Affascinato',
    };
  }

  // Gnomo: Astuzia Gnomesca (Gnome Cunning) -> TS Int, Sag, Car contro magia
  if (['intelligenza', 'saggezza', 'carisma'].includes(carattKey) && (testo.includes('astuzia gnomesca') || testo.includes('gnome cunning') || testo.includes('gnomo'))) {
    return {
      attivo: true,
      fonte: "Astuzia Gnomesca",
      fonteEn: "Gnome Cunning",
      dettaglio: "Vantaggio a tutti i tiri salvezza di Intelligenza, Saggezza e Carisma contro la magia.",
      tipo: 'razza',
      condizionale: 'magia',
      badgeText: '✨ Vant. Magia',
    };
  }

  return null;
}

/**
 * Individua se il PG ha vantaggio sui tiri di Iniziativa (Destrezza).
 * Es. Istinto Ferino (Barbaro 7+), Arma di Avvertimento, tratti.
 */
export function haVantaggioIniziativa(scheda) {
  if (!scheda) return null;
  const testo = `${scheda.classe || ''}\n${scheda.privilegi || ''}\n${scheda.privilegiSottoclasse || ''}\n${scheda.tratti || ''}\n${scheda.talenti || ''}`.toLowerCase();
  
  if (testo.includes('istinto ferino') || testo.includes('feral instinct') || (testo.includes('barbaro') && (Number(scheda.livello) || 1) >= 7)) {
    return {
      attivo: true,
      fonte: "Istinto Ferino (Barbaro)",
      dettaglio: "Vantaggio alle prove di iniziativa.",
      tipo: 'privilegio',
    };
  }

  if (testo.includes('benedizione della veglia') || testo.includes('vigilant blessing')) {
    return {
      attivo: true,
      fonte: "Benedizione della Veglia",
      dettaglio: "Vantaggio alle prove di iniziativa.",
      tipo: 'privilegio',
    };
  }

  // Poteri attivi o privilegi espliciti con vantaggio all'iniziativa
  if (Array.isArray(scheda.poteri)) {
    for (const p of scheda.poteri) {
      if (!p?.attivo) continue;
      const tP = `${p.nome || ''} ${p.descrizione || ''} ${p.effetto || ''}`.toLowerCase();
      if (/(vantaggio|advantage).*(iniziativa|initiative)/i.test(tP)) {
        return {
          attivo: true,
          fonte: p.nome || 'Potere attivo',
          dettaglio: p.effetto || p.descrizione || 'Vantaggio all\'iniziativa.',
          tipo: 'potere',
        };
      }
    }
  }

  if (/(vantaggio|advantage).*(iniziativa|initiative)/i.test(testo)) {
    return {
      attivo: true,
      fonte: 'Privilegio/Tratto',
      dettaglio: 'Vantaggio all\'iniziativa concesso da privilegi o talenti.',
      tipo: 'privilegio',
    };
  }

  const oggetti = oggettiConEffettoAttivo(scheda);
  const armaAvv = oggetti.find((o) => /(avvertimento|warning)/i.test(o.nome || ''));
  if (armaAvv) {
    return {
      attivo: true,
      fonte: armaAvv.nome,
      dettaglio: "Vantaggio all'iniziativa mentre l'arma è sintonizzata e indossata.",
      tipo: 'oggetto',
    };
  }

  return null;
}

/**
 * Rileva se il PG subisce svantaggio automatico su un Tiro Salvezza (es. Trattenuto su Destrezza,
 * o armatura senza competenza su Forza e Destrezza).
 */
export function trovaSvantaggioTiroSalvezza(scheda, carattKey) {
  if (!scheda || !carattKey) return null;

  const condizioni = Array.isArray(scheda.condizioni) ? scheda.condizioni : (scheda.condizioni ? [scheda.condizioni] : []);
  const condNomi = condizioni.map((c) => String(typeof c === 'string' ? c : c?.nome || '').toLowerCase());

  // Trattenuto (Restrained): svantaggio ai TS su Destrezza
  if (carattKey === 'destrezza' && condNomi.some((c) => c.includes('trattenut') || c.includes('restrained'))) {
    return {
      attivo: true,
      fonte: 'Condizione: Trattenuto',
      fonteEn: 'Condition: Restrained',
      dettaglio: 'Svantaggio ai tiri salvezza su Destrezza.',
      tipo: 'condizione',
      badgeText: '⛓️ Svant. Trattenuto',
    };
  }

  // Mancata competenza in armatura: svantaggio a TS Forza e Destrezza (PHB p. 144)
  const tipoArm = scheda.armatura?.tipo || 'nessuna';
  if ((carattKey === 'forza' || carattKey === 'destrezza') && !competenteInArmatura(scheda, tipoArm)) {
    return {
      attivo: true,
      fonte: 'Armatura non competente',
      fonteEn: 'Non-proficient Armor',
      dettaglio: 'Svantaggio ai tiri salvezza di Forza e Destrezza per armatura indossata senza competenza.',
      tipo: 'armatura',
      badgeText: '▼ Svant. Armatura',
    };
  }

  return null;
}

/**
 * Rileva se il PG gode di vantaggio automatico ai tiri per colpire (es. condizione Invisibile).
 */
export function trovaVantaggioAttacco(scheda, attacco = null) {
  if (!scheda) return null;
  const condizioni = Array.isArray(scheda.condizioni) ? scheda.condizioni : (scheda.condizioni ? [scheda.condizioni] : []);
  const condNomi = condizioni.map((c) => String(typeof c === 'string' ? c : c?.nome || '').toLowerCase());

  // Invisibile (Invisible): gli attacchi hanno vantaggio
  if (condNomi.some((c) => c.includes('invisibil') || c.includes('invisible'))) {
    return {
      attivo: true,
      fonte: 'Condizione: Invisibile',
      fonteEn: 'Condition: Invisible',
      dettaglio: 'Vantaggio ai tiri per colpire poiché invisibile.',
      tipo: 'condizione',
    };
  }

  return null;
}

/**
 * Rileva se il PG subisce svantaggio automatico ai tiri per colpire (es. Avvelenato, Spaventato, Prono, Accecato, Trattenuto, o armatura non competente).
 */
export function trovaSvantaggioAttacco(scheda, attacco = null) {
  if (!scheda) return null;
  const condizioni = Array.isArray(scheda.condizioni) ? scheda.condizioni : (scheda.condizioni ? [scheda.condizioni] : []);
  const condNomi = condizioni.map((c) => String(typeof c === 'string' ? c : c?.nome || '').toLowerCase());

  const condSvant = [
    { k: 'avvelenat', en: 'poisoned', label: 'Avvelenato' },
    { k: 'spaventat', en: 'frightened', label: 'Spaventato' },
    { k: 'pron', en: 'prone', label: 'Prono' },
    { k: 'accecat', en: 'blinded', label: 'Accecato' },
    { k: 'trattenut', en: 'restrained', label: 'Trattenuto' },
  ];

  for (const cs of condSvant) {
    if (condNomi.some((c) => c.includes(cs.k) || c.includes(cs.en))) {
      return {
        attivo: true,
        fonte: `Condizione: ${cs.label}`,
        fonteEn: `Condition: ${cs.en}`,
        dettaglio: `Svantaggio ai tiri per colpire per la condizione ${cs.label}.`,
        tipo: 'condizione',
      };
    }
  }

  // Armatura indossata senza competenza (svantaggio ai tiri per colpire con Forza o Destrezza)
  const tipoArm = scheda.armatura?.tipo || 'nessuna';
  if (!competenteInArmatura(scheda, tipoArm)) {
    return {
      attivo: true,
      fonte: 'Armatura non competente',
      fonteEn: 'Non-proficient Armor',
      dettaglio: 'Svantaggio ai tiri per colpire per armatura indossata senza competenza.',
      tipo: 'armatura',
    };
  }

  return null;
}

/**
 * Individua se il PG subisce svantaggio automatico per una data abilità
 * da armatura pesante/media rumorosa (es. Cotta di maglia su Furtività),
 * mancata competenza nelle armature, o condizioni debilitanti attive (Avvelenato, Spaventato, Sfinimento 2014).
 */
export function trovaSvantaggioAbilita(scheda, abilitaKey) {
  if (!scheda || !abilitaKey) return null;

  // 1. Condizioni attive (Avvelenato e Spaventato impongono svantaggio a tutte le prove di caratteristica 5e)
  const condizioni = Array.isArray(scheda.condizioni) ? scheda.condizioni : (scheda.condizioni ? [scheda.condizioni] : []);
  const condNomi = condizioni.map((c) => String(typeof c === 'string' ? c : c?.nome || '').toLowerCase());
  
  if (condNomi.some((c) => c.includes('avvelenat') || c.includes('poisoned'))) {
    return {
      attivo: true,
      fonte: 'Condizione: Avvelenato',
      fonteEn: 'Condition: Poisoned',
      dettaglio: 'Svantaggio a tutte le prove di caratteristica e ai tiri per colpire.',
      tipo: 'condizione',
    };
  }

  if (condNomi.some((c) => c.includes('spaventat') || c.includes('frightened'))) {
    return {
      attivo: true,
      fonte: 'Condizione: Spaventato',
      fonteEn: 'Condition: Frightened',
      dettaglio: 'Svantaggio a tutte le prove di caratteristica finché la fonte della paura è in vista.',
      tipo: 'condizione',
    };
  }

  // 2. Sfinimento (regole 2014, grado 1+)
  const sfin = effettiSfinimento(scheda);
  if (sfin.svantaggioProve) {
    return {
      attivo: true,
      fonte: `Sfinimento (Grado ${sfin.livello})`,
      fonteEn: `Exhaustion (Level ${sfin.livello})`,
      dettaglio: 'Svantaggio a tutte le prove di caratteristica.',
      tipo: 'sfinimento',
    };
  }

  // 3. Mancanza di Competenza nell'Armatura indossata (PHB p. 144: svantaggio a prove FOR/DES)
  const abilitaInfo = ABILITA.find((a) => a.key === abilitaKey);
  const carLegata = abilitaInfo?.car || '';
  const tipoArm = scheda.armatura?.tipo || 'nessuna';
  if ((carLegata === 'forza' || carLegata === 'destrezza') && !competenteInArmatura(scheda, tipoArm)) {
    return {
      attivo: true,
      fonte: 'Armatura non competente',
      fonteEn: 'Non-proficient Armor',
      dettaglio: 'Svantaggio alle prove di Forza e Destrezza per armatura indossata senza competenza.',
      tipo: 'armatura',
    };
  }

  // 4. Svantaggio a Furtività da Armatura
  if (abilitaKey === 'furtivita') {
    const nomeArm = String(scheda.armatura?.nome || '').toLowerCase();
    const haSvantaggioEsplicito = Boolean(scheda.armatura?.svantaggioFurtivita);
    const armatureConSvantaggio = /(cotta\s+di\s+maglia|corazza\s+a\s+strisce|corazza\s+a\s+piastre|armatura\s+a\s+scaglie|mezza\s+armatura|armatura\s+a\s+riquadri|chain\s*mail|splint|plate|scale\s*mail|half\s*plate|ring\s*mail)/i;
    
    // Il talento Maestro delle Armature Medie rimuove lo svantaggio a furtività per le armature medie
    const testoTalenti = `${scheda.talenti || ''}\n${scheda.privilegi || ''}`.toLowerCase();
    const haMaestroMedie = testoTalenti.includes('maestro delle armature medie') || testoTalenti.includes('medium armor master');
    const isMedia = scheda.armatura?.tipo === 'media' || /(armatura\s+a\s+scaglie|mezza\s+armatura|scale\s*mail|half\s*plate)/i.test(nomeArm);

    if ((haSvantaggioEsplicito || armatureConSvantaggio.test(nomeArm)) && !(isMedia && haMaestroMedie)) {
      return {
        attivo: true,
        fonte: scheda.armatura?.nome || 'Armatura pesante/media',
        fonteEn: scheda.armatura?.nome || 'Heavy/medium armor',
        dettaglio: 'Questa armatura impone svantaggio alle prove di Furtività.',
        tipo: 'armatura',
      };
    }
  }

  return null;
}

/**
 * Calcola il punteggio passivo 5e di un'abilità (PHB Cap. 7, Prove Passive).
 * Punteggio = 10 + bonusAbilita (+5 con Vantaggio, -5 con Svantaggio, +5 Talento Osservatore su Percezione/Indagare).
 */
export function calcolaPunteggioPassivo(scheda, abilitaKey) {
  if (!scheda || !abilitaKey) return 10;
  let passivo = 10 + bonusAbilita(scheda, abilitaKey);

  const vant = trovaVantaggioAbilita(scheda, abilitaKey);
  const svant = trovaSvantaggioAbilita(scheda, abilitaKey);

  if (vant && !svant) {
    passivo += 5;
  } else if (!vant && svant) {
    passivo -= 5;
  }

  // Talento Osservatore (Observant): +5 a Percezione Passiva e Indagare Passivo
  if (abilitaKey === 'percezione' || abilitaKey === 'indagare') {
    const testo = `${scheda.talenti || ''}\n${scheda.privilegi || ''}\n${scheda.tratti || ''}`.toLowerCase();
    if (testo.includes('osservatore') || testo.includes('observant')) {
      passivo += 5;
    }
  }

  return passivo;
}

/**
 * Rileva eventuali tratti di vantaggio all'attacco per una forma bestiale attiva.
 * Es. Tattiche di branco (Pack Tactics), Fiuto del sangue (Blood Frenzy).
 */
export function trattiVantaggioAttaccoBestia(forma) {
  if (!forma || !forma.dati) return [];
  const tratti = Array.isArray(forma.dati.tratti)
    ? forma.dati.tratti
    : (forma.dati.tratti ? [forma.dati.tratti] : []);

  const ris = [];
  for (const tr of tratti) {
    const s = String(tr || '');
    if (/tattiche\s+di\s+branco|pack\s+tactics/i.test(s)) {
      ris.push({
        id: 'tattiche_branco',
        label: '▲ Tattiche di Branco',
        labelEn: '▲ Pack Tactics',
        tooltip: 'Vantaggio al tiro per colpire se almeno un alleato è entro 1,5 m dal bersaglio.',
        tooltipEn: 'Advantage on attack roll if at least one ally is within 5 ft of the target.',
      });
    }
    if (/fiuto\s+del\s+sangue|blood\s+frenzy/i.test(s)) {
      ris.push({
        id: 'fiuto_sangue',
        label: '▲ Fiuto del Sangue',
        labelEn: '▲ Blood Frenzy',
        tooltip: 'Vantaggio al tiro per colpire contro creature con meno del massimo dei PF.',
        tooltipEn: 'Advantage on attack roll against creatures with less than maximum HP.',
      });
    }
  }
  return ris;
}
