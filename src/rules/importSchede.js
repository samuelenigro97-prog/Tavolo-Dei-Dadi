// Correzioni sulle schede trascritte dall'IA (PDF, foto, screenshot di Fantasy Grounds).
// Il modello legge bene i numeri e male le icone (stelle grigie/dorate, cerchietti): qui si
// usano i NUMERI per controllare le icone. Funzioni pure, provate in test/import-schede.test.mjs.
import { CARATTERISTICHE, ABILITA } from '../data/caratteristiche.js';
import { bonusCompetenzaDaLivello, modificatore } from './dadi.js';

const CLASSI = {
  fighter: 'Guerriero', guerriero: 'Guerriero', ranger: 'Ranger', rogue: 'Ladro', ladro: 'Ladro',
  wizard: 'Mago', mago: 'Mago', cleric: 'Chierico', chierico: 'Chierico', druid: 'Druido', druido: 'Druido',
  bard: 'Bardo', bardo: 'Bardo', barbarian: 'Barbaro', barbaro: 'Barbaro', monk: 'Monaco', monaco: 'Monaco',
  paladin: 'Paladino', paladino: 'Paladino', sorcerer: 'Stregone', stregone: 'Stregone',
  warlock: 'Warlock', artificer: 'Artefice', artefice: 'Artefice',
};

// Nelle schede cartacee italiane il campo "Classe e livello" a volte porta una SOTTOCLASSE
// al posto della classe (es. "Spadaccino 4 / Warlock 1"): si risale alla classe.
const SOTTOCLASSE_COME_CLASSE = {
  spadaccino: ['Ladro', 'Spadaccino'], swashbuckler: ['Ladro', 'Spadaccino'],
  assassino: ['Ladro', 'Assassino'], assassin: ['Ladro', 'Assassino'],
  campione: ['Guerriero', 'Campione'], champion: ['Guerriero', 'Campione'],
  'maestro di battaglia': ['Guerriero', 'Maestro di Battaglia'], 'battle master': ['Guerriero', 'Maestro di Battaglia'],
  'cavaliere mistico': ['Guerriero', 'Cavaliere Mistico'], 'eldritch knight': ['Guerriero', 'Cavaliere Mistico'],
};

/**
 * Legge "Fighter 1 / Ranger 6 / Rogue 3" o "Spadaccino 4 / Warlock 1" in una lista di classi
 * con livello, nei nomi italiani. Restituisce [] se il testo non ha la forma "classe numero".
 */
export function parseClassiELivelli(testo) {
  if (typeof testo !== 'string') return [];
  const pezzi = testo.split(/\s*(?:\/|\+|,|;|\be\b|\band\b)\s*/i).map((p) => p.trim()).filter(Boolean);
  const out = [];
  for (const p of pezzi) {
    const m = /^(.*?)[\s:.-]*(?:lv\.?|liv\.?|level|livello)?\s*(\d{1,2})$/i.exec(p);
    if (!m || !m[1].trim()) return [];
    const nome = m[1].trim().toLowerCase();
    const livello = Number(m[2]);
    if (CLASSI[nome]) out.push({ classe: CLASSI[nome], livello });
    else if (SOTTOCLASSE_COME_CLASSE[nome]) out.push({ classe: SOTTOCLASSE_COME_CLASSE[nome][0], livello, sottoclasse: SOTTOCLASSE_COME_CLASSE[nome][1] });
    else out.push({ classe: m[1].trim(), livello });
  }
  return out;
}

const eNumero = (v) => typeof v === 'number' && Number.isFinite(v);

/**
 * Prende una trascrizione dell'IA e la rende coerente:
 *  - "classe" scritta come "Fighter 1 / Ranger 6 / Rogue 3" → classe, livello, multiclasse;
 *  - Maestria: il Worker la scrive "2", ma nell'app il 2 è solo un marcatore d'origine (vale ×1)
 *    e la Maestria è il 3 (×2): si converte, altrimenti la doppia competenza andrebbe persa;
 *  - competenze (abilità e tiri salvezza) dedotte dai TOTALI letti sulla scheda quando ci sono
 *    ("abilitaTotali", "tiriSalvezzaTotali"): totale − modificatore = 0, competenza o il doppio.
 * Ritorna { dati, correzioni } con le correzioni fatte, da mostrare a chi importa.
 */
export function normalizzaTrascrizione(rawDati) {
  const correzioni = [];
  if (!rawDati || typeof rawDati !== 'object') return { dati: rawDati, correzioni };
  const dati = { ...rawDati };

  // 1) Classi e livelli scritti in un'unica stringa
  const classi = parseClassiELivelli(dati.classe);
  if (classi.length && (classi.length > 1 || /\d/.test(String(dati.classe)))) {
    dati.classe = classi[0].classe;
    dati.livello = classi[0].livello;
    if (classi[0].sottoclasse && !dati.sottoclasse) dati.sottoclasse = classi[0].sottoclasse;
    const resto = classi.slice(1).map((c) => ({ classe: c.classe, livello: c.livello, ...(c.sottoclasse ? { sottoclasse: c.sottoclasse } : {}) }));
    const gia = Array.isArray(dati.multiclasse) ? dati.multiclasse : [];
    dati.multiclasse = resto.length ? resto : gia;
    correzioni.push(`Classe e livello letti da "${rawDati.classe}": ${classi.map((c) => `${c.classe} ${c.livello}`).join(' / ')}.`);
  }
  const livelloTot = (Number(dati.livello) || 1) + (Array.isArray(dati.multiclasse) ? dati.multiclasse.reduce((a, m) => a + (Number(m?.livello) || 0), 0) : 0);
  const prof = eNumero(Number(dati.bonusCompetenza)) && Number(dati.bonusCompetenza) >= 2 && Number(dati.bonusCompetenza) <= 6
    ? Number(dati.bonusCompetenza) : bonusCompetenzaDaLivello(livelloTot);
  dati.bonusCompetenza = prof;
  const car = dati.caratteristiche || {};
  const mod = (k) => modificatore(Number(car[k]) || 10);

  // 2) Abilità: scala del Worker (0/1/2=maestria) → scala dell'app (0/1/3=maestria)
  const guess = {};
  for (const a of ABILITA) {
    const v = dati.abilita?.[a.key];
    guess[a.key] = v === 3 || v === 2 ? 3 : v === 1 || v === true ? 1 : 0;
  }
  const totali = dati.abilitaTotali && typeof dati.abilitaTotali === 'object' ? dati.abilitaTotali : null;
  let usatiTotali = 0;
  if (totali) {
    for (const a of ABILITA) {
      const tot = totali[a.key];
      if (!eNumero(tot)) continue;
      const diff = tot - mod(a.car);
      let livello = null;
      if (diff === 0) livello = 0;
      else if (diff === prof) livello = 1;
      else if (diff === prof * 2) livello = 3;
      if (livello === null) continue; // bonus vari, mezza competenza...: ci si fida dell'icona
      usatiTotali++;
      if (livello !== guess[a.key]) {
        correzioni.push(`${a.label}: ${guess[a.key] === 3 ? 'maestria' : guess[a.key] ? 'competente' : 'non competente'} → ${livello === 3 ? 'maestria' : livello ? 'competente' : 'non competente'} (totale ${tot >= 0 ? '+' : ''}${tot}).`);
        guess[a.key] = livello;
      }
    }
  }
  // Senza totali non si può verificare: tutte (o quasi) competenti è quasi sempre un errore sulle stelle.
  if (!usatiTotali && Object.values(guess).filter(Boolean).length >= 14) {
    for (const k of Object.keys(guess)) guess[k] = 0;
    correzioni.push('Quasi tutte le abilità risultavano competenti: probabile errore sulle stelle, azzerate (si applicano le competenze del background).');
  }
  dati.abilita = guess;

  // 3) Tiri salvezza dai totali
  const tsTot = dati.tiriSalvezzaTotali && typeof dati.tiriSalvezzaTotali === 'object' ? dati.tiriSalvezzaTotali : null;
  if (tsTot) {
    const ts = { ...(dati.tiriSalvezza || {}) };
    for (const c of CARATTERISTICHE) {
      const tot = tsTot[c.key];
      if (!eNumero(tot)) continue;
      const diff = tot - mod(c.key);
      const competente = diff === prof ? true : diff === 0 ? false : null;
      if (competente === null) continue;
      if (Boolean(ts[c.key]) !== competente) {
        correzioni.push(`Tiro salvezza ${c.label}: ${competente ? 'competente' : 'non competente'} (totale ${tot >= 0 ? '+' : ''}${tot}).`);
        ts[c.key] = competente;
      }
    }
    dati.tiriSalvezza = ts;
  }
  return { dati, correzioni };
}
