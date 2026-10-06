// Indirizzi dei servizi online, ordine delle ambientazioni e piccoli aiuti condivisi dall'App e dalle sue finestre.
import { PRESET_COLORI } from '../ui/tema.js';

/**
 * Archivio schede del DM (Cloudflare Worker + KV, vedi worker/LEGGIMI.md).
 * Quando è impostato, l'app deposita da sola una copia delle schede (senza
 * immagini) così il DM può consultarle dalla vista "Archivio DM".
 * L'URL non è un segreto: la lettura richiede la chiave DM e il Worker accetta
 * chiamate solo dall'origine del sito. Lasciandolo vuoto la funzione è spenta.
 */
export const URL_ARCHIVIO_PG = (
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_ARCHIVIO_PG_URL) || 'https://tavolo-dei-dadi-transcribe.stremioflixmanager.workers.dev'
).trim();
export const URL_STANZE = (
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_STANZE_URL) || URL_ARCHIVIO_PG
).trim();
export const ORDINE_AMBIENTAZIONI = ['default', 'taverna', 'mercato', 'citta', 'accampamento', 'foresta', 'palude', 'montagna', 'tundra', 'deserto', 'mare', 'tempesta', 'dungeon', 'tempio'];

export function iconaAmbientazione(id) {
  if (!id || id === 'default') return '📍';
  const nome = PRESET_COLORI.find((p) => p.id === id)?.nome || '';
  return nome.split(' ')[0] || '🎨';
}

export function nuovoId() {
  return 'pg-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}
