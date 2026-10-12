// Riassunto delle descrizioni per le nuvolette: le prime frasi, senza mai saltare
// pezzi di testo. Prima una regex cercava "frasi" che finiscono con . ! ? seguiti da
// uno spazio: se il punto era seguito da ")" (es. "un boschetto...)") quella frase
// veniva scartata in silenzio e la nuvoletta iniziava a metà, da ") entro 1,5 km".

// Abbreviazioni dopo cui il punto non chiude la frase.
const ABBREVIAZIONI = /(?:^|[\s(])(?:es|ecc|cfr|pag|pp|vol|liv|lv|ca|n|nr|p|ad|dott|sig|mr|vs|e\.g|i\.e|etc|ft|lb)$/i;

/** Divide un testo in frasi: un punto chiude la frase solo fuori dalle parentesi e se seguito da uno spazio o dalla fine. */
export function dividiFrasi(testo) {
  const s = String(testo || '').replace(/\s+/g, ' ').trim();
  if (!s) return [];
  const frasi = [];
  let inizio = 0;
  let profondita = 0;
  for (let i = 0; i < s.length; i += 1) {
    const c = s[i];
    if (c === '(' || c === '[') profondita += 1;
    else if ((c === ')' || c === ']') && profondita > 0) profondita -= 1;
    else if ((c === '.' || c === '!' || c === '?') && profondita === 0) {
      let j = i;
      while (j + 1 < s.length && /[.!?»"'”’)]/.test(s[j + 1])) j += 1;
      const fine = j + 1 >= s.length || s[j + 1] === ' ';
      if (!fine) continue;
      // "es. qualcosa", "liv. 3": non è la fine della frase.
      if (c === '.' && j === i && ABBREVIAZIONI.test(s.slice(inizio, i))) continue;
      // "9 m. Poi..." va bene; "1.5" non arriva qui (niente spazio dopo il punto).
      frasi.push(s.slice(inizio, j + 1).trim());
      inizio = j + 1;
      i = j;
    }
  }
  const resto = s.slice(inizio).trim();
  if (resto) frasi.push(resto);
  return frasi;
}

/** Le prime `maxFrasi` frasi, al massimo `maxCaratteri` (con "…" se tagliate). Sempre un inizio del testo originale. */
export function riassumiDescrizione(testo, maxFrasi = 2, maxCaratteri = 320) {
  const frasi = dividiFrasi(testo);
  if (!frasi.length) return '';
  let breve = frasi.slice(0, maxFrasi).join(' ');
  if (breve.length > maxCaratteri) breve = `${breve.slice(0, maxCaratteri - 1).trimEnd()}…`;
  return breve;
}
