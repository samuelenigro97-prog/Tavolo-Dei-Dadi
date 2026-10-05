// Sottosezione "Poteri": regole personalizzate del tavolo (patti, benedizioni,
// maledizioni...) dentro "Privilegi, Tratti & Talenti". Una scheda per potere
// con chip per contatori e modificatori; clic sulla scheda apre i dettagli
// (modifica, eliminazione, riordino). Vedi src/rules/poteri.js per il modello
// dati e la sincronizzazione con `scheda.risorse`.
import { useEffect, useState } from 'react';
import { t } from '../i18n.js';
import { C } from './tema.js';
import { styles } from './stili.js';
import { Editable, AreaTesto } from './componenti.jsx';
import { conSegno } from '../rules/dadi.js';
import {
  BERSAGLI_MODIFICATORE_POTERE,
  BERSAGLIO_LIBERO,
  nuovoPotere,
  nuovoContatore,
  nuovoModificatore,
  normalizzaPoteri,
  valoreContatore,
  sincronizzaRisorsePoteri,
  modificatoriPoteriAttivi,
  livelloTotaleScheda,
  potereSbloccato,
  trovaContatore,
  idRisorsaContatore,
} from '../rules/poteri.js';
import { MODELLI_POTERI } from '../data/modelliPoteri.js';
import { AraldiPannello } from './AraldiPannello.jsx';
import { manualeAttivo } from '../data/dati5e.js';

function unitaBersaglio(chiave) {
  return BERSAGLI_MODIFICATORE_POTERE.find((b) => b.chiave === chiave)?.unita || '';
}
// Per un bersaglio libero (homebrew, non in elenco) l'etichetta è il testo scritto
// a mano nel modificatore stesso, non una voce fissa: va passata da chi chiama.
function labelBersaglio(chiave, lingua, bersaglioLibero) {
  if (chiave === BERSAGLIO_LIBERO) return bersaglioLibero || (lingua === 'en' ? 'Other' : 'Altro');
  const b = BERSAGLI_MODIFICATORE_POTERE.find((x) => x.chiave === chiave);
  return b ? (lingua === 'en' ? b.labelEn : b.label) : chiave;
}

/**
 * Badge da affiancare a un valore della scheda (velocità, CA, iniziativa,
 * PF massimi) quando un Potere attivo lo modifica: mostra il totale del
 * bonus e, al passaggio del mouse, la fonte di ciascun contributo — così
 * il bonus "si somma... mostrando la fonte" anche fuori dalla scheda del
 * potere. Restituisce null se nessun potere tocca quel bersaglio.
 */
export function BadgePotere({ scheda, bersaglio, unita }) {
  const mods = modificatoriPoteriAttivi(scheda).filter((m) => m.bersaglio === bersaglio);
  if (!mods.length) return null;
  const tot = mods.reduce((s, m) => s + (Number(m.valore) || 0), 0);
  if (!tot) return null;
  const u = unita ?? unitaBersaglio(bersaglio);
  const fonti = mods.map((m) => `${conSegno(Number(m.valore) || 0)}${u} (${m.fonte})`).join(', ');
  return (
    <span style={{ fontSize: 11, fontWeight: 700, color: C.goldDark, marginLeft: 4 }} title={fonti}>
      {conSegno(tot)}{u}
    </span>
  );
}

const chipStile = {
  background: 'rgba(0,0,0,0.04)',
  border: `1px solid ${C.border}`,
  borderRadius: 6,
  padding: '3px 8px',
  fontSize: 12,
  color: C.ink,
  display: 'inline-flex',
  alignItems: 'center',
  gap: 4,
  whiteSpace: 'nowrap',
};

const miniPm = { ...styles.buttonMini, padding: '0 6px', fontSize: 12, lineHeight: 1.3, margin: '0 2px' };

/** Una scheda compatta per potere: titolo, chip di contatori/modificatori, descrizione. */
function PotereCard({ potere, scheda, indice, totale, onApri, lingua }) {
  const [sceltaEffetto, setSceltaEffetto] = useState(false);
  const bloccato = !potereSbloccato(potere, livelloTotaleScheda(scheda));
  return (
    <div
      onClick={() => onApri(potere.id)}
      style={{
        background: C.panelLight,
        border: `1px solid ${potere.attivo ? C.border : C.inkDim}`,
        borderRadius: 8,
        padding: '10px 12px',
        cursor: 'pointer',
        opacity: potere.attivo && !bloccato ? 1 : 0.6,
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
        transition: 'border-color 0.15s ease',
      }}
      title={lingua === 'en' ? 'Click for details, edit, delete or reorder' : 'Clicca per dettagli, modifica, eliminazione o riordino'}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6 }}>
        <strong style={{ fontSize: 13, color: C.ink }}>
          {potere.nome || (lingua === 'en' ? 'Unnamed power' : 'Potere senza nome')}
        </strong>
        <span style={{ display: 'inline-flex', gap: 5, alignItems: 'center' }}>
          {potere.livelloMin > 0 && (
            <span
              style={{ fontSize: 11, fontWeight: 700, color: bloccato ? C.inkDim : C.goldDark, border: `1px solid ${bloccato ? C.border : C.goldDark}`, borderRadius: 6, padding: '1px 6px', whiteSpace: 'nowrap' }}
              title={bloccato
                ? (lingua === 'en' ? `Unlocks at level ${potere.livelloMin}` : `Si sblocca al ${potere.livelloMin}° livello`)
                : (lingua === 'en' ? `Unlocked at level ${potere.livelloMin}` : `Sbloccato al ${potere.livelloMin}° livello`)}
            >
              {bloccato ? '🔒 ' : ''}{lingua === 'en' ? `Level ${potere.livelloMin}` : `${potere.livelloMin}° liv.`}
            </span>
          )}
          {!potere.attivo && (
            <span style={{ fontSize: 11, fontWeight: 700, color: C.inkDim, border: `1px solid ${C.border}`, borderRadius: 6, padding: '1px 6px' }}>
              {lingua === 'en' ? 'Off' : 'Disattivato'}
            </span>
          )}
        </span>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, alignItems: 'center' }}>
        {potere.contatori.map((c, i) => {
          const { attuali, max } = valoreContatore(scheda, potere.id, i, c);
          return (
            <span key={i} style={chipStile} onClick={(e) => e.stopPropagation()} title={potere.descrizione ? `${c.nome}: ${potere.descrizione}` : c.nome}>
              {c.nome || (lingua === 'en' ? 'Counter' : 'Contatore')}{' '}
              <button type="button" style={miniPm} disabled={attuali <= 0} aria-label={`${c.nome} −1`} onClick={() => onApri(potere.id, { tipo: 'contatore', indice: i, patch: { attuali: Math.max(0, attuali - 1) } })}>−</button>
              <Editable
                value={attuali}
                tipo="numero"
                width={26}
                style={{ fontSize: 12, fontWeight: 700 }}
                onChange={(v) => onApri(potere.id, { tipo: 'contatore', indice: i, patch: { attuali: v } })}
              />
              <button type="button" style={miniPm} disabled={max != null && attuali >= max} aria-label={`${c.nome} +1`} onClick={() => onApri(potere.id, { tipo: 'contatore', indice: i, patch: { attuali: max != null ? Math.min(max, attuali + 1) : attuali + 1 } })}>+</button>
              {max != null ? ` / ${max}` : ' (?)'}
            </span>
          );
        })}
        {potere.modificatori.map((m, i) => (
          <span key={i} style={{ ...chipStile, borderColor: C.goldDark, color: C.goldDark, fontWeight: 700 }} title={m.fonte || potere.nome}>
            {labelBersaglio(m.bersaglio, lingua, m.bersaglioLibero)} {conSegno(Number(m.valore) || 0)}{unitaBersaglio(m.bersaglio)} ({m.fonte || potere.nome})
          </span>
        ))}
        {sceltaEffetto ? (
          <span style={{ display: 'inline-flex', gap: 4 }} onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              style={{ ...styles.buttonMini, fontSize: 11 }}
              onClick={() => { onApri(potere.id, { tipo: 'aggiungi-contatore' }); setSceltaEffetto(false); }}
            >
              {lingua === 'en' ? 'Counter' : 'Contatore'}
            </button>
            <button
              type="button"
              style={{ ...styles.buttonMini, fontSize: 11 }}
              onClick={() => { onApri(potere.id, { tipo: 'aggiungi-modificatore' }); setSceltaEffetto(false); }}
            >
              {lingua === 'en' ? 'Modifier' : 'Modificatore'}
            </button>
          </span>
        ) : (
          <button
            type="button"
            style={{ ...chipStile, borderStyle: 'dashed', color: C.goldDark, cursor: 'pointer', fontWeight: 700 }}
            onClick={(e) => { e.stopPropagation(); setSceltaEffetto(true); }}
            title={lingua === 'en' ? 'Add an effect (counter or modifier)' : 'Aggiungi un effetto (contatore o modificatore)'}
          >
            {lingua === 'en' ? 'Add…' : 'Aggiungi…'}
          </button>
        )}
      </div>

      {potere.descrizione && (
        <div style={{ ...styles.detail, fontSize: 12, whiteSpace: 'pre-wrap' }}>{potere.descrizione}</div>
      )}
    </div>
  );
}

/** Modale di dettaglio/modifica per un singolo potere: campi, contatori, modificatori, elimina, riordina. */
function PotereModal({ potere, scheda, indice, totale, onChiudi, onAggiorna, onElimina, onSposta, lingua }) {
  const setCampo = (patch) => onAggiorna(potere.id, patch);
  const setContatore = (i, patch) => setCampo({ contatori: potere.contatori.map((c, idx) => (idx === i ? { ...c, ...patch } : c)) });
  const rimuoviContatore = (i) => setCampo({ contatori: potere.contatori.filter((_, idx) => idx !== i) });
  const aggiungiContatore = () => setCampo({ contatori: [...potere.contatori, nuovoContatore({ nome: lingua === 'en' ? 'New counter' : 'Nuovo contatore' })] });
  const setModificatore = (i, patch) => setCampo({ modificatori: potere.modificatori.map((m, idx) => (idx === i ? { ...m, ...patch } : m)) });
  const rimuoviModificatore = (i) => setCampo({ modificatori: potere.modificatori.filter((_, idx) => idx !== i) });
  const aggiungiModificatore = () => setCampo({ modificatori: [...potere.modificatori, nuovoModificatore()] });

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: 'fixed', inset: 0, zIndex: 2500,
        background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(3px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onChiudi(); }}
    >
      <div style={{ ...styles.panel, width: '100%', maxWidth: 520, maxHeight: '90vh', overflowY: 'auto', padding: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <input
            value={potere.nome}
            onChange={(e) => setCampo({ nome: e.target.value })}
            placeholder={lingua === 'en' ? 'Power name' : 'Nome del potere'}
            style={{ ...styles.inlineInput, flex: 1, fontSize: 14, fontWeight: 700, padding: '6px 8px' }}
          />
          <button type="button" style={styles.buttonMini} onClick={onChiudi} title={lingua === 'en' ? 'Close' : 'Chiudi'}>✕</button>
        </div>

        <label style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10, fontSize: 12, cursor: 'pointer' }}>
          <input type="checkbox" checked={potere.attivo} onChange={(e) => setCampo({ attivo: e.target.checked })} />
          {lingua === 'en' ? 'Active (inactive: modifiers stop applying and counters keep their value but are hidden from resources)' : 'Attivo (disattivato: i modificatori smettono di applicarsi e i contatori restano con il loro valore ma spariscono da Risorse)'}
        </label>

        <label style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10, fontSize: 12 }}>
          {lingua === 'en' ? 'Available from level' : 'Disponibile dal livello'}
          <input
            type="number"
            min={0}
            max={20}
            value={potere.livelloMin || 0}
            onChange={(e) => setCampo({ livelloMin: Math.max(0, Math.min(20, Math.floor(Number(e.target.value) || 0))) })}
            style={{ ...styles.inlineInput, width: 56, fontSize: 12, padding: '4px 6px' }}
            title={lingua === 'en' ? '0 = always. Before that level the power is locked: no modifiers, no resources.' : '0 = sempre. Prima di quel livello il potere è bloccato: niente modificatori né risorse.'}
          />
          <span style={{ ...styles.detail, fontSize: 11 }}>{lingua === 'en' ? '(0 = always)' : '(0 = sempre)'}</span>
        </label>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10, fontSize: 12, flexWrap: 'wrap' }}>
          {lingua === 'en' ? 'Applies only if counter' : 'Si applica solo se il contatore'}
          <input
            value={potere.condizione?.contatore || ''}
            onChange={(e) => setCampo({ condizione: e.target.value.trim() ? { contatore: e.target.value, minimo: potere.condizione?.minimo || 1 } : null })}
            placeholder={lingua === 'en' ? 'e.g. Debt' : 'es. Debito'}
            style={{ ...styles.inlineInput, width: 110, fontSize: 12, padding: '4px 6px' }}
          />
          {potere.condizione && (
            <>
              ≥
              <input
                type="number"
                min={0}
                value={potere.condizione.minimo}
                onChange={(e) => setCampo({ condizione: { ...potere.condizione, minimo: Number(e.target.value) || 0 } })}
                style={{ ...styles.inlineInput, width: 64, fontSize: 12, padding: '4px 6px' }}
              />
            </>
          )}
          <span style={{ ...styles.detail, fontSize: 11 }}>{lingua === 'en' ? '(empty = always)' : '(vuoto = sempre)'}</span>
        </div>

        <div style={{ marginBottom: 10 }}>
          <div style={{ ...styles.detail, fontWeight: 700, marginBottom: 4 }}>{lingua === 'en' ? 'Description' : 'Descrizione'}</div>
          <AreaTesto value={potere.descrizione} onChange={(v) => setCampo({ descrizione: v })} placeholder={lingua === 'en' ? 'What this power does…' : 'Cosa fa questo potere…'} />
        </div>

        <div style={{ marginBottom: 10 }}>
          <div style={{ ...styles.detail, fontWeight: 700, marginBottom: 4 }}>{lingua === 'en' ? 'Counters' : 'Contatori'}</div>
          {potere.contatori.map((c, i) => (
            <div key={i} style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 6 }}>
              <input
                value={c.nome}
                onChange={(e) => setContatore(i, { nome: e.target.value })}
                placeholder={lingua === 'en' ? 'Name (e.g. Debt)' : 'Nome (es. Debito)'}
                style={{ ...styles.inlineInput, flex: 1, fontSize: 12, padding: '4px 6px' }}
              />
              <input
                type="number"
                value={valoreContatore(scheda, potere.id, i, c).attuali}
                onChange={(e) => setContatore(i, { attuali: Number(e.target.value) || 0 })}
                title={lingua === 'en' ? 'Current' : 'Attuali'}
                style={{ ...styles.inlineInput, width: 56, fontSize: 12, padding: '4px 6px', textAlign: 'center' }}
              />
              <span style={{ fontSize: 11, color: C.inkDim }}>/</span>
              <input
                type="number"
                value={c.max === null ? '' : c.max}
                onChange={(e) => setContatore(i, { max: e.target.value === '' ? null : Number(e.target.value) })}
                placeholder="∞"
                title={lingua === 'en' ? 'Maximum (empty = no cap)' : 'Massimo (vuoto = nessun tetto)'}
                style={{ ...styles.inlineInput, width: 56, fontSize: 12, padding: '4px 6px', textAlign: 'center' }}
              />
              <select
                value={c.maxAuto || ''}
                onChange={(e) => setContatore(i, { maxAuto: e.target.value || undefined })}
                title={lingua === 'en' ? 'Maximum from proficiency bonus' : 'Massimo calcolato dalla competenza'}
                style={{ ...styles.inlineInput, fontSize: 11, padding: '4px 4px', width: 'auto' }}
              >
                <option value="">{lingua === 'en' ? 'Fixed max' : 'Max fisso'}</option>
                <option value="competenza">{lingua === 'en' ? 'Max = proficiency' : 'Max = competenza'}</option>
                <option value="doppia-competenza">{lingua === 'en' ? 'Max = 2× proficiency' : 'Max = 2× competenza'}</option>
              </select>
              <select
                value={c.ricarica || ''}
                onChange={(e) => setContatore(i, { ricarica: e.target.value || undefined })}
                title={lingua === 'en' ? 'When it recharges' : 'Quando si ricarica'}
                style={{ ...styles.inlineInput, fontSize: 11, padding: '4px 4px', width: 'auto' }}
              >
                <option value="">{lingua === 'en' ? 'Manual' : 'A mano'}</option>
                <option value="breve">{lingua === 'en' ? 'Short rest' : 'Riposo breve'}</option>
                <option value="lungo">{lingua === 'en' ? 'Long rest' : 'Riposo lungo'}</option>
              </select>
              <button type="button" style={{ ...styles.buttonMini, color: C.red }} onClick={() => rimuoviContatore(i)} title={lingua === 'en' ? 'Remove' : 'Rimuovi'}>🗑</button>
            </div>
          ))}
          <button type="button" style={{ ...styles.buttonMini, borderStyle: 'dashed' }} onClick={aggiungiContatore}>
            {lingua === 'en' ? 'Add counter' : 'Aggiungi contatore'}
          </button>
        </div>

        <div style={{ marginBottom: 10 }}>
          <div style={{ ...styles.detail, fontWeight: 700, marginBottom: 4 }}>{lingua === 'en' ? 'Modifiers' : 'Modificatori'}</div>
          {potere.modificatori.map((m, i) => (
            <div key={i} style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 6, flexWrap: 'wrap' }}>
              <select
                value={m.bersaglio}
                onChange={(e) => setModificatore(i, { bersaglio: e.target.value })}
                style={{ ...styles.inlineInput, fontSize: 12, padding: '4px 6px' }}
              >
                {BERSAGLI_MODIFICATORE_POTERE.map((b) => (
                  <option key={b.chiave} value={b.chiave}>{lingua === 'en' ? b.labelEn : b.label}</option>
                ))}
                <option value={BERSAGLIO_LIBERO}>{lingua === 'en' ? 'Other (custom)…' : 'Altro (personalizzato)…'}</option>
              </select>
              {m.bersaglio === BERSAGLIO_LIBERO && (
                <input
                  value={m.bersaglioLibero}
                  onChange={(e) => setModificatore(i, { bersaglioLibero: e.target.value })}
                  placeholder={lingua === 'en' ? 'What does it affect? (e.g. Advantage on CHA saves)' : 'Su cosa agisce? (es. Vantaggio ai TS Carisma)'}
                  style={{ ...styles.inlineInput, flex: 1, minWidth: 120, fontSize: 12, padding: '4px 6px' }}
                />
              )}
              <input
                type="number"
                value={m.valore}
                onChange={(e) => setModificatore(i, { valore: Number(e.target.value) || 0 })}
                title={lingua === 'en' ? 'Numeric value (use 0 or 1 for a yes/no effect, e.g. Advantage)' : 'Valore numerico (usa 0 o 1 per un effetto sì/no, es. Vantaggio)'}
                style={{ ...styles.inlineInput, width: 56, fontSize: 12, padding: '4px 6px', textAlign: 'center' }}
              />
              <input
                value={m.fonte}
                onChange={(e) => setModificatore(i, { fonte: e.target.value })}
                placeholder={lingua === 'en' ? 'Source (e.g. Mask)' : 'Fonte (es. Maschera)'}
                style={{ ...styles.inlineInput, flex: 1, minWidth: 90, fontSize: 12, padding: '4px 6px' }}
              />
              <button type="button" style={{ ...styles.buttonMini, color: C.red }} onClick={() => rimuoviModificatore(i)} title={lingua === 'en' ? 'Remove' : 'Rimuovi'}>🗑</button>
            </div>
          ))}
          <button type="button" style={{ ...styles.buttonMini, borderStyle: 'dashed' }} onClick={aggiungiModificatore}>
            {lingua === 'en' ? 'Add modifier' : 'Aggiungi modificatore'}
          </button>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 8, borderTop: `1px solid ${C.border}` }}>
          <div style={{ display: 'flex', gap: 4 }}>
            <button type="button" style={styles.buttonMini} disabled={indice === 0} onClick={() => onSposta(potere.id, -1)} title={lingua === 'en' ? 'Move up' : 'Sposta su'}>▲</button>
            <button type="button" style={styles.buttonMini} disabled={indice === totale - 1} onClick={() => onSposta(potere.id, 1)} title={lingua === 'en' ? 'Move down' : 'Sposta giù'}>▼</button>
          </div>
          <button
            type="button"
            style={{ ...styles.buttonMini, color: C.red, borderColor: C.red }}
            onClick={() => { if (window.confirm(lingua === 'en' ? 'Delete this power? Its counters and modifiers will disappear from the sheet too.' : 'Eliminare questo potere? Spariscono dalla scheda anche i suoi contatori e modificatori.')) onElimina(potere.id); }}
          >
            🗑 {lingua === 'en' ? 'Delete power' : 'Elimina potere'}
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Sezione "Poteri": elenco di schede + pulsante per aggiungerne una nuova.
 * `scheda`/`aggiorna` sono le stesse props usate in tutto il resto della UI.
 */
export function SezionePoteri({ scheda, aggiorna, lingua = 'it', manualiAttivi = {}, registra, mostraInfo }) {
  const [potereApertoId, setPotereApertoId] = useState(null);
  const [mostraModelli, setMostraModelli] = useState(false);
  // Sezione comprimibile: la scelta resta su questo dispositivo.
  const [chiusa, setChiusa] = useState(() => {
    try { return localStorage.getItem('scheda-interattiva:poteri-chiusi') === '1'; } catch { return false; }
  });
  function alternaChiusa() {
    setChiusa((v) => {
      try { localStorage.setItem('scheda-interattiva:poteri-chiusi', v ? '0' : '1'); } catch { /* niente */ }
      return !v;
    });
  }
  const poteri = normalizzaPoteri(scheda?.poteri);
  // I modelli dei manuali di campagna compaiono solo se il manuale è attivato a mano.
  const modelliDisponibili = MODELLI_POTERI.filter((m) => !m.manuale || manualeAttivo(manualiAttivi, m.manuale));
  // Con il manuale degli Araldi attivo e i suoi poteri sulla scheda, un pannello dedicato
  // sostituisce nell'elenco le singole schede dei poteri del modello (restano in effetto).
  const haPoteriAraldi = poteri.some((p) => p.modello === 'araldi-del-segreto');
  const pannelloAraldi = (manualeAttivo(manualiAttivi, 'araldi') || haPoteriAraldi) && Boolean(trovaContatore(scheda, 'Segreti')) && Boolean(trovaContatore(scheda, 'Debito'));
  const potereAperto = poteri.find((p) => p.id === potereApertoId) || null;
  const poteriInLista = pannelloAraldi ? poteri.filter((p) => p.modello !== 'araldi-del-segreto') : poteri;

  function salvaPoteri(nuoviPoteri) {
    let risorse = sincronizzaRisorsePoteri(nuoviPoteri, scheda.risorse, livelloTotaleScheda(scheda), scheda.bonusCompetenza);
    // Un valore "attuali" cambiato a mano sul contatore vince su quello già nella
    // risorsa collegata (che altrimenti, essendo la fonte più recente, lo annullerebbe).
    const modificati = new Map();
    for (const p of normalizzaPoteri(nuoviPoteri)) {
      const prima = poteri.find((x) => x.id === p.id);
      if (!prima) continue;
      p.contatori.forEach((c, i) => {
        if (prima.contatori[i] && c.attuali !== prima.contatori[i].attuali) modificati.set(idRisorsaContatore(p.id, i), c.attuali);
      });
    }
    if (modificati.size) {
      risorse = risorse.map((r) => (modificati.has(r.id)
        ? { ...r, attuali: Math.max(0, r.max === null || r.max === undefined ? modificati.get(r.id) : Math.min(modificati.get(r.id), r.max)) }
        : r));
    }
    aggiorna({ poteri: nuoviPoteri, risorse });
  }

  function aggiungiPotere() {
    const nuovo = nuovoPotere({ nome: lingua === 'en' ? 'New power' : 'Nuovo potere' });
    salvaPoteri([...poteri, nuovo]);
    setPotereApertoId(nuovo.id);
  }

  /** Poteri del modello già presenti (stesso nome) ma aggiunti con una versione precedente del modello. */
  function daAllineareAlModello(modello) {
    return modello.poteri.filter((mp) => poteri.some((p) => p.nome === mp.nome && p.modello !== modello.id));
  }

  /** Porta all'ultima versione del modello i poteri già presenti (stesso nome): livello di
   *  sblocco, condizioni automatiche, ricariche con i riposi e massimi dalla competenza. */
  function alignaEsistenti(modello) {
    const daAllineare = new Map(daAllineareAlModello(modello).map((mp) => [mp.nome, mp]));
    return {
      cambiati: daAllineare.size,
      lista: poteri.map((p) => {
        const mp = daAllineare.get(p.nome);
        if (!mp || p.modello === modello.id) return p;
        return {
          ...p,
          modello: modello.id,
          livelloMin: mp.livelloMin || 0,
          condizione: mp.condizione || null,
          ...(mp.condizione ? { attivo: true } : {}),
          contatori: p.contatori.map((c) => {
            const mc = (mp.contatori || []).find((x) => x.nome === c.nome);
            return mc ? { ...c, ...(mc.ricarica ? { ricarica: mc.ricarica } : {}), ...(mc.maxAuto ? { maxAuto: mc.maxAuto } : {}) } : c;
          }),
        };
      }),
    };
  }

  /** Aggiunge i poteri di un modello (saltando quelli già presenti, stesso nome) e allinea gli altri. */
  function aggiungiModello(modello) {
    const presenti = new Set(poteri.map((p) => p.nome));
    // Un contatore con lo stesso nome già presente in un altro potere (es. il Debito del
    // proprio Potere del Patrono) resta l'unico: non se ne crea un secondo.
    const nomiContatori = new Set(poteri.flatMap((p) => p.contatori.map((c) => String(c.nome).trim().toLowerCase())));
    const nuovi = modello.poteri.filter((p) => !presenti.has(p.nome)).map((p) => nuovoPotere({
      ...p,
      modello: modello.id,
      contatori: (p.contatori || []).filter((c) => !nomiContatori.has(String(c.nome).trim().toLowerCase())),
    }));
    const { cambiati, lista } = alignaEsistenti(modello);
    if (!nuovi.length && !cambiati) return;
    salvaPoteri([...lista, ...nuovi]);
    setMostraModelli(false);
  }

  // Poteri degli Araldi aggiunti con una versione precedente (prima dei livelli, delle
  // condizioni e del pannello): si portano da soli alla versione attuale.
  useEffect(() => {
    for (const m of MODELLI_POTERI) {
      const { cambiati, lista } = alignaEsistenti(m);
      if (cambiati) { salvaPoteri(lista); break; }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(poteri.map((p) => [p.nome, p.modello]))]);

  function aggiornaPotere(id, patch) {
    salvaPoteri(poteri.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  }

  function eliminaPotere(id) {
    salvaPoteri(poteri.filter((p) => p.id !== id));
    setPotereApertoId(null);
  }

  function spostaPotere(id, direzione) {
    const lista = [...poteri];
    const idx = lista.findIndex((p) => p.id === id);
    const nuovoIdx = idx + direzione;
    if (idx < 0 || nuovoIdx < 0 || nuovoIdx >= lista.length) return;
    [lista[idx], lista[nuovoIdx]] = [lista[nuovoIdx], lista[idx]];
    salvaPoteri(lista);
  }

  // Dalla card arrivano sia "apri il potere" (nessuna azione) sia scorciatoie
  // rapide (contatore modificato inline, o "aggiungi subito un effetto").
  function gestisciAzioneCard(id, azione) {
    if (!azione) { setPotereApertoId(id); return; }
    const p = poteri.find((x) => x.id === id);
    if (!p) return;
    if (azione.tipo === 'contatore') {
      aggiornaPotere(id, { contatori: p.contatori.map((c, idx) => (idx === azione.indice ? { ...c, ...azione.patch } : c)) });
      return;
    }
    if (azione.tipo === 'aggiungi-contatore') {
      aggiornaPotere(id, { contatori: [...p.contatori, nuovoContatore({ nome: lingua === 'en' ? 'New counter' : 'Nuovo contatore' })] });
      setPotereApertoId(id);
      return;
    }
    if (azione.tipo === 'aggiungi-modificatore') {
      aggiornaPotere(id, { modificatori: [...p.modificatori, nuovoModificatore()] });
      setPotereApertoId(id);
    }
  }

  return (
    <div style={{ background: C.panelLight, border: `1px solid ${C.border}`, borderRadius: 8, padding: '10px 12px' }}>
      <div className="poteri-intestazione" style={{ display: 'grid', gridTemplateColumns: 'minmax(28px, 1fr) auto minmax(28px, 1fr)', alignItems: 'center', columnGap: 6, marginBottom: chiusa ? 0 : 8 }}>
        <div />
        <div
          role="button"
          data-testid="poteri-titolo"
          tabIndex={0}
          aria-expanded={!chiusa}
          onClick={alternaChiusa}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); alternaChiusa(); } }}
          style={{ fontSize: 12, fontWeight: 700, color: C.goldDark, letterSpacing: 0.5, textAlign: 'center', cursor: 'pointer', userSelect: 'none' }}
          title={chiusa
            ? (lingua === 'en' ? 'Click to expand the Powers' : 'Clicca per espandere i Poteri')
            : (lingua === 'en' ? 'Click to collapse the Powers. For rules invented at the table (not in the official books): pacts, blessings, curses, magic items with custom effects...' : 'Clicca per rimpicciolire i Poteri. Per le regole inventate al tavolo (non nei manuali ufficiali): patti, benedizioni, maledizioni, oggetti magici con effetti custom...')}
        >
          <span aria-hidden style={{ fontSize: 10, marginRight: 4 }}>{chiusa ? '▸' : '▾'}</span>
          {lingua === 'en' ? 'Powers' : 'Poteri'} <span style={{ textTransform: 'none', fontWeight: 500, letterSpacing: 'normal', color: C.inkDim, fontSize: 11 }}>({lingua === 'en' ? 'homebrew rules' : 'regole homebrew'})</span>
          {chiusa && poteri.length > 0 && <span style={{ fontWeight: 500, color: C.inkDim, fontSize: 11 }}> · {poteri.length}</span>}
        </div>
        {chiusa ? <div /> : (
          <div style={{ display: 'flex', gap: 6, justifySelf: 'end' }}>
            {modelliDisponibili.length > 0 && (
              <button type="button" style={{ ...styles.buttonMini, borderStyle: 'dashed' }} onClick={() => setMostraModelli((v) => !v)} aria-expanded={mostraModelli}>
                {lingua === 'en' ? 'From template' : 'Da modello'}
              </button>
            )}
            <button type="button" style={{ ...styles.buttonMini, borderStyle: 'dashed' }} onClick={aggiungiPotere}>
              {lingua === 'en' ? 'Add power' : 'Aggiungi potere'}
            </button>
          </div>
        )}
      </div>

      {!chiusa && mostraModelli && (
        <div data-testid="modelli-poteri" style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 8 }}>
          {modelliDisponibili.map((m) => {
            const presenti = new Set(poteri.map((p) => p.nome));
            const mancanti = m.poteri.filter((p) => !presenti.has(p.nome)).length;
            const daAllineare = daAllineareAlModello(m).length;
            return (
              <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 8, border: `1px solid ${C.border}`, borderRadius: 6, padding: '6px 8px' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: C.ink }}>{lingua === 'en' ? m.nomeEn : m.nome}</div>
                  <div style={{ ...styles.detail, fontSize: 11 }}>{lingua === 'en' ? m.descrizioneEn : m.descrizione}</div>
                </div>
                <button type="button" style={styles.buttonMini} disabled={!mancanti && !daAllineare} onClick={() => aggiungiModello(m)}>
                  {mancanti
                    ? (lingua === 'en' ? `Add ${mancanti} powers` : `Aggiungi ${mancanti} poteri`)
                    : daAllineare
                      ? (lingua === 'en' ? 'Update to the new template' : 'Aggiorna al nuovo modello')
                      : (lingua === 'en' ? 'Already added' : 'Già aggiunto')}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {!chiusa && pannelloAraldi && (
        <AraldiPannello scheda={scheda} aggiorna={aggiorna} lingua={lingua} registra={registra} onModifica={setPotereApertoId} onInfo={mostraInfo} />
      )}

      {chiusa ? null : poteriInLista.length === 0 && !pannelloAraldi ? (
        <div style={{ ...styles.detail, fontSize: 12, textAlign: 'center', padding: '10px 0' }}>
          {lingua === 'en' ? 'No custom powers yet.' : 'Nessun potere personalizzato per ora.'}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {poteriInLista.map((p, i) => (
            <PotereCard key={p.id} potere={p} scheda={scheda} indice={i} totale={poteri.length} onApri={gestisciAzioneCard} lingua={lingua} />
          ))}
        </div>
      )}

      {potereAperto && (
        <PotereModal
          potere={potereAperto}
          scheda={scheda}
          indice={poteri.findIndex((p) => p.id === potereAperto.id)}
          totale={poteri.length}
          onChiudi={() => setPotereApertoId(null)}
          onAggiorna={aggiornaPotere}
          onElimina={eliminaPotere}
          onSposta={spostaPotere}
          lingua={lingua}
        />
      )}
    </div>
  );
}
