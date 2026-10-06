// Riquadro "Poteri" nella colonna sinistra, subito sotto "Risorse di classe":
// i contatori dei Poteri in gioco (Segreti, Debito, usi dei privilegi...) da
// spendere al volo durante la partita, con lo stesso aspetto delle risorse di
// classe. Legge e scrive gli stessi contatori della sezione Poteri (nessun dato
// nuovo): riposi, soglie e modificatori continuano a funzionare.
import { C } from './tema.js';
import { styles } from './stili.js';
import { contatoriInGioco, patchVariaContatori } from '../rules/poteri.js';
import { DEBITO_PER_USO_ARALDI, ID_MODELLO_ARALDI, SOGLIE_DEBITO_ARALDI } from '../data/modelliPoteri.js';

const PERLE_MASSIME = 10;

function etichettaRicarica(ricarica, en) {
  if (ricarica === 'breve') return en ? 'short rest' : 'riposo breve';
  if (ricarica === 'lungo') return en ? 'long rest' : 'riposo lungo';
  return en ? 'by hand' : 'a mano';
}

/** Elenco dei contatori dei Poteri in gioco; null se non ce ne sono (il riquadro non compare). */
export function PoteriRisorse({ scheda, aggiorna, lingua = 'it', registra, mostraInfo }) {
  const en = lingua === 'en';
  const voci = contatoriInGioco(scheda);
  if (!voci.length) return null;
  const araldi = voci.some((v) => v.potere.modello === ID_MODELLO_ARALDI);

  const applica = (variazioni, titolo, dettaglio) => {
    const patch = patchVariaContatori(scheda, variazioni);
    if (!patch) return;
    aggiorna(patch);
    if (registra && titolo) registra({ etichetta: titolo, tipo: 'privilegio', dettaglio });
  };

  return (
    <div data-testid="poteri-risorse">
      {voci.map(({ potere, contatore, attuali, max }) => {
        const nome = contatore.nome || potere.nome;
        const debitoUso = araldi && potere.modello === ID_MODELLO_ARALDI ? (DEBITO_PER_USO_ARALDI[nome] || 0) : 0;
        const usa = () => applica(
          [{ nome, delta: -1 }, ...(debitoUso ? [{ nome: 'Debito', delta: debitoUso }] : [])],
          debitoUso ? nome : null,
          debitoUso ? (en ? `Used: +${debitoUso} Debt` : `Usato: +${debitoUso} Debito`) : undefined,
        );
        const ripristina = () => applica([{ nome, delta: 1 }]);
        const conPerle = max != null && max > 0 && max <= PERLE_MASSIME;
        const eDebito = araldi && nome.trim().toLowerCase() === 'debito';
        const prossima = eDebito ? SOGLIE_DEBITO_ARALDI.find((s) => attuali < s.soglia) : null;
        const descrizione = potere.descrizione || '';
        const titolo = [descrizione, contatore.ricarica ? `↻ ${etichettaRicarica(contatore.ricarica, en)}` : '', debitoUso ? (en ? `+${debitoUso} Debt per use` : `+${debitoUso} Debito a ogni uso`) : '']
          .filter(Boolean).join('\n');
        return (
          <div key={`${potere.id}-${nome}`} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, padding: '4px 0', borderBottom: `1px dotted ${C.border}`, minHeight: 26 }}>
            <button
              type="button"
              title={titolo || undefined}
              onClick={() => descrizione && mostraInfo?.({ titolo: nome, testo: descrizione })}
              style={{ padding: 0, border: 0, background: 'transparent', color: C.ink, font: 'inherit', fontWeight: 600, textAlign: 'left', cursor: descrizione ? 'help' : 'default', flex: '1 1 auto', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
            >
              {nome}
              {prossima && <span style={{ color: C.inkDim, fontWeight: 400, fontSize: 10.5 }}> → {prossima.soglia}</span>}
            </button>
            {conPerle ? (
              <span style={{ display: 'inline-flex', gap: 3, flexShrink: 0, alignItems: 'center' }} role="group" aria-label={`${nome}: ${attuali}/${max}`}>
                {Array.from({ length: max }, (_, i) => {
                  const disponibile = i < attuali;
                  return (
                    <button
                      key={i}
                      type="button"
                      aria-pressed={!disponibile}
                      aria-label={disponibile ? (en ? `Use ${nome}` : `Usa ${nome}`) : (en ? `Restore ${nome}` : `Ripristina ${nome}`)}
                      onClick={disponibile ? usa : ripristina}
                      title={disponibile
                        ? (debitoUso ? (en ? `Use it (+${debitoUso} Debt)` : `Usalo (+${debitoUso} Debito)`) : (en ? 'Use it' : 'Usalo'))
                        : (en ? 'Spent: click to restore' : 'Speso: clicca per ripristinarlo')}
                      style={{ width: 13, height: 13, padding: 0, borderRadius: '50%', cursor: 'pointer', border: `2px solid ${C.goldDark}`, background: disponibile ? C.goldDark : 'transparent', transition: 'background 0.15s ease' }}
                    />
                  );
                })}
              </span>
            ) : (
              <span style={{ display: 'inline-flex', gap: 4, flexShrink: 0, alignItems: 'center' }}>
                <button type="button" style={{ ...styles.buttonMini, padding: '0 6px' }} disabled={attuali <= 0} onClick={usa} aria-label={`${nome} −1`} title={en ? 'Spend' : 'Spendi'}>−</button>
                <strong style={{ minWidth: 18, textAlign: 'center', color: max != null && attuali === max ? C.goldDark : (attuali === 0 ? C.inkDim : C.ink) }}>{attuali}</strong>
                <button type="button" style={{ ...styles.buttonMini, padding: '0 6px' }} disabled={max != null && attuali >= max} onClick={ripristina} aria-label={`${nome} +1`} title={en ? 'Add' : 'Aggiungi'}>+</button>
                {max != null && <span style={{ ...styles.detail, fontSize: 11 }}>/{max}</span>}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
