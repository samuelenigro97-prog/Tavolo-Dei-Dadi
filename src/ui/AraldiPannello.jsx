// Pannello dedicato al manuale di campagna "Araldi del Segreto": Segreti e
// Debito con un tocco, soglie del Debito che si accendono da sole, spese dei
// Segreti (Aprire, Leva, Incantare, Mercato) e i privilegi sbloccati per
// livello con i loro usi. Legge e scrive gli stessi contatori dei Poteri
// (nessun dato nuovo): le risorse collegate, i riposi e i modificatori
// (+1 CA a Debito 15...) continuano a funzionare come per qualsiasi potere.
import { useState } from 'react';
import { C } from './tema.js';
import { styles } from './stili.js';
import { Editable } from './componenti.jsx';
import {
  normalizzaPoteri,
  trovaContatore,
  patchVariaContatori,
  livelloTotaleScheda,
  potereSbloccato,
} from '../rules/poteri.js';
import {
  SOGLIE_DEBITO_ARALDI,
  LISTA_AMPLIATA_ARALDI,
  ID_MODELLO_ARALDI as ID_MODELLO,
  DEBITO_PER_USO_ARALDI as DEBITO_PER_USO,
  RECUPERO_CON_SEGRETI_ARALDI as RECUPERO_CON_SEGRETI,
  AZIONI_PRIVILEGI_ARALDI,
  SEGRETI_MYRDHAL_ARALDI,
} from '../data/modelliPoteri.js';
import { incantesimiAraldiMancanti } from '../data/incantesimiAraldi.js';
import { EVOCAZIONI_ARALDI } from '../data/bestiario.js';
import { parseAzioniCompagno, coloreClasse } from '../rules/regole.js';
import { generaAvatarBestia } from '../ritratti.js';
import { IconaRunica } from './IconaFantasy.jsx';

const NOMI_BASE = ['Segreti', 'Debito'];

const scatola = { border: `1px solid ${C.border}`, borderRadius: 8, padding: '8px 10px', background: C.panelLight };
const etichetta = { fontSize: 12, fontWeight: 700, color: 'var(--c-gold, #d4a017)', textTransform: 'uppercase', letterSpacing: 0.6 };

function Contatore({ titolo, valore, max, onMeno, onPiu, onImposta, sotto, suggerimento, coloreTitolo, children }) {
  return (
    <div style={{ ...scatola, flex: '1 1 200px', minWidth: 160, textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 4 }} title={suggerimento}>
      <div style={{ ...etichetta, color: coloreTitolo || etichetta.color }}>{titolo}</div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
        <button type="button" style={{ ...styles.buttonMini, padding: '2px 10px', fontSize: 14 }} onClick={onMeno} disabled={valore <= 0} aria-label={`${titolo} −1`}>−</button>
        <span style={{ fontSize: 26, fontWeight: 800, color: C.ink, minWidth: 34, fontVariantNumeric: 'tabular-nums', display: 'inline-flex', alignItems: 'baseline', gap: 2 }}>
          <Editable value={valore} tipo="numero" width={46} style={{ fontSize: 26, fontWeight: 800, textAlign: 'center' }} onChange={(v) => onImposta(Math.max(0, Math.floor(Number(v) || 0)))} title={`${titolo}: clicca per scrivere il valore`} />
          {max != null && <span style={{ fontSize: 14, fontWeight: 600, color: C.inkDim }}>/ {max}</span>}
        </span>
        <button type="button" style={{ ...styles.buttonMini, padding: '2px 10px', fontSize: 14 }} onClick={onPiu} disabled={max != null && valore >= max} aria-label={`${titolo} +1`}>+</button>
      </div>
      {children}
      {sotto && <div style={{ fontSize: 11, color: C.inkDim }}>{sotto}</div>}
    </div>
  );
}

export function AraldiPannello({ scheda, aggiorna, lingua = 'it', registra, onModifica, onInfo }) {
  const [aperti, setAperti] = useState({});
  const [cerchio, setCerchio] = useState(1);
  const [incanto, setIncanto] = useState(0);
  const en = lingua === 'en';
  const livello = livelloTotaleScheda(scheda);
  const segreti = trovaContatore(scheda, 'Segreti');
  const debito = trovaContatore(scheda, 'Debito');
  if (!segreti || !debito) return null;

  const poteri = normalizzaPoteri(scheda.poteri).filter((p) => p.modello === ID_MODELLO);
  const privilegi = poteri
    .filter((p) => !p.condizione && p.contatori.some((c) => !NOMI_BASE.includes(c.nome)))
    .sort((a, b) => a.livelloMin - b.livelloMin);

  const gruppiPerLivello = [];
  for (const p of privilegi) {
    const g = gruppiPerLivello.find((x) => x.livelloMin === p.livelloMin);
    if (g) g.lista.push(p); else gruppiPerLivello.push({ livelloMin: p.livelloMin, lista: [p] });
  }

  // Cerchi sbloccati: quelli per cui il personaggio ha slot (se non ne ha, nessun limite).
  const slot = scheda.slotIncantesimo || {};
  const maxCerchio = Math.max(0, ...Object.entries(slot).filter(([, v]) => (Number(v?.totale) || 0) > 0).map(([k]) => Number(k)));
  const cerchiDisponibili = [1, 2, 3, 4, 5].filter((n) => !maxCerchio || n <= maxCerchio);
  const cerchioScelto = cerchiDisponibili.includes(cerchio) ? cerchio : cerchiDisponibili[0] || 1;
  const incantiDelCerchio = LISTA_AMPLIATA_ARALDI[cerchioScelto] || [];
  const incantoScelto = incantiDelCerchio[incanto] ? incanto : 0;

  const applica = (variazioni, titolo, dettaglio) => {
    const patch = patchVariaContatori(scheda, variazioni);
    if (!patch) return;
    aggiorna(patch);
    if (registra && titolo) registra({ etichetta: titolo, tipo: 'privilegio', dettaglio });
  };

  const valSegreti = segreti.attuali;
  const valDebito = debito.attuali;
  const prossima = SOGLIE_DEBITO_ARALDI.find((s) => valDebito < s.soglia);

  const mancantiIncanti = incantesimiAraldiMancanti(scheda);
  const aggiungiIncanti = () => {
    if (!mancantiIncanti.length) return;
    aggiorna({ incantesimiLista: [...(scheda.incantesimiLista || []), ...mancantiIncanti] });
    if (registra) registra({ etichetta: en ? 'Handbook spells added' : 'Incantesimi del manuale aggiunti', tipo: 'privilegio', dettaglio: mancantiIncanti.map((x) => x.nome).join(', ') });
  };

  const spesa = (costo, titolo, dettaglio, extra = []) => (
    <button
      type="button"
      style={styles.buttonMini}
      disabled={valSegreti < costo}
      onClick={() => applica([{ nome: 'Segreti', delta: -costo }, ...extra], titolo, dettaglio)}
      title={en ? `Spend ${costo} Secret` : `Spendi ${costo} Segreto`}
    >
      {titolo} <span style={{ color: C.inkDim }}>(−{costo})</span>
    </button>
  );

  const imposta = (nome, attuale) => (v) => applica([{ nome, delta: v - attuale }]);
  const precedente = [...SOGLIE_DEBITO_ARALDI].reverse().find((s) => valDebito >= s.soglia);
  const baseBarra = precedente ? precedente.soglia : 0;
  const percentuale = prossima ? Math.max(0, Math.min(100, ((valDebito - baseBarra) / (prossima.soglia - baseBarra)) * 100)) : 100;

  const cClasse = coloreClasse(scheda?.classe);
  const coloreClasseTema = cClasse?.scuro || 'var(--c-gold, #d4a017)';

  return (
    <div data-testid="araldi-pannello" style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 10 }}>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <Contatore
          titolo={en ? 'Secrets' : 'Segreti'}
          coloreTitolo={coloreClasseTema}
          valore={valSegreti}
          max={segreti.max}
          sotto={en ? 'Max twice your proficiency bonus' : 'Massimo: il doppio della competenza'}
          suggerimento={en ? 'Secrets you hold. Spend them below.' : 'I Segreti che possiedi. Spendili qui sotto.'}
          onMeno={() => applica([{ nome: 'Segreti', delta: -1 }])}
          onPiu={() => applica([{ nome: 'Segreti', delta: 1 }])}
          onImposta={imposta('Segreti', valSegreti)}
        >
          {segreti.max > 0 && segreti.max <= 12 && (
            <div style={{ display: 'flex', gap: 5, justifyContent: 'center', flexWrap: 'wrap', marginTop: 3 }} aria-hidden>
              {Array.from({ length: segreti.max }, (_, i) => {
                const attivo = i < valSegreti;
                return (
                  <span
                    key={i}
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: 2,
                      transform: 'rotate(45deg)',
                      border: attivo ? '1.5px solid #ff9f1a' : '1.5px solid rgba(255, 159, 26, 0.45)',
                      background: attivo ? '#ff9f1a' : 'transparent',
                      boxShadow: attivo ? '0 0 6px rgba(255, 159, 26, 0.65)' : 'none',
                      transition: 'all 0.15s ease',
                    }}
                  />
                );
              })}
            </div>
          )}
        </Contatore>
        <Contatore
          titolo={en ? 'Debt' : 'Debito'}
          coloreTitolo={coloreClasseTema}
          valore={valDebito}
          sotto={prossima
            ? (en ? `Next: ${prossima.soglia} · ${prossima.nomeEn} (${prossima.soglia - valDebito} to go)` : `Prossima: ${prossima.soglia} · ${prossima.nome} (mancano ${prossima.soglia - valDebito})`)
            : (en ? 'All thresholds reached' : 'Tutte le soglie raggiunte')}
          suggerimento={en ? 'Debt grows when you use Secrets and some features.' : 'Il Debito cresce usando i Segreti e alcuni privilegi.'}
          onMeno={() => applica([{ nome: 'Debito', delta: -1 }])}
          onPiu={() => applica([{ nome: 'Debito', delta: 1 }])}
          onImposta={imposta('Debito', valDebito)}
        >
          <div
            role="progressbar"
            aria-valuemin={baseBarra}
            aria-valuemax={prossima ? prossima.soglia : valDebito}
            aria-valuenow={valDebito}
            aria-label={en ? 'Progress to the next Debt threshold' : 'Avanzamento verso la prossima soglia del Debito'}
            style={{ height: 6, borderRadius: 3, background: C.border, overflow: 'hidden', margin: '4px 8px 0' }}
          >
            <div style={{ width: `${percentuale}%`, height: '100%', background: 'linear-gradient(90deg, #ff9f1a, #ff6b35)', boxShadow: '0 0 6px rgba(255, 159, 26, 0.45)', transition: 'width 0.25s ease' }} />
          </div>
        </Contatore>
      </div>

      <div style={scatola}>
        <div style={{ ...etichetta, color: coloreClasseTema, marginBottom: 6 }}>{en ? 'Debt thresholds' : 'Soglie del Debito'}</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {SOGLIE_DEBITO_ARALDI.map((s) => {
            const raggiunta = valDebito >= s.soglia;
            const eProssima = prossima && prossima.soglia === s.soglia;
            const badgeSezione = s.soglia === 5 ? (en ? 'Bonus Action & Insight' : 'Azione Bonus e Intuizione')
              : s.soglia === 15 ? (en ? '+1 AC, Perception & Investigation' : '+1 CA, Percezione e Indagare')
              : s.soglia === 35 ? (en ? 'Save vs Frightened' : 'TS contro Spaventato')
              : s.soglia === 70 ? (en ? 'Action, True Sight & +1 to Hit' : 'Azione, Vista Pura e +1 Colpire')
              : (en ? 'Reaction at 0 HP' : 'Reazione a 0 PF');
            return (
              <div
                key={s.soglia}
                data-testid={`soglia-${s.soglia}`}
                data-raggiunta={raggiunta ? 'si' : 'no'}
                style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 12, opacity: raggiunta || eProssima ? 1 : 0.55, flexWrap: 'wrap' }}
              >
                <span style={{
                  flexShrink: 0, minWidth: 42, textAlign: 'center', fontWeight: 800, padding: '2px 6px', borderRadius: 4,
                  border: `1px ${raggiunta ? 'solid' : 'dashed'} ${raggiunta ? '#ff9f1a' : C.border}`,
                  color: raggiunta ? '#ff9f1a' : C.inkDim,
                  background: raggiunta ? 'rgba(255, 159, 26, 0.14)' : 'transparent',
                  boxShadow: raggiunta ? '0 0 6px rgba(255, 159, 26, 0.25)' : 'none',
                }}>{raggiunta ? '✓ ' : ''}{s.soglia}</span>
                <span style={{ minWidth: 0, flex: 1, display: 'inline-flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                  <IconaRunica nome={s.nome} isAraldi={true} dimensione={22} />
                  <strong style={{ color: raggiunta ? C.ink : C.inkDim, fontSize: 13, fontWeight: 700 }}>{en ? s.nomeEn : s.nome}</strong>
                  <span style={{ color: C.inkDim }}> — {en ? s.effettoEn : s.effetto}</span>
                  {raggiunta && (
                    <span style={{
                      marginLeft: 6,
                      fontSize: 10,
                      fontWeight: 700,
                      padding: '2px 6px',
                      borderRadius: 4,
                      background: 'rgba(255, 159, 26, 0.14)',
                      color: '#ff9f1a',
                      border: '1px solid rgba(255, 159, 26, 0.55)',
                      boxShadow: '0 0 6px rgba(255, 159, 26, 0.2)',
                      whiteSpace: 'nowrap',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 3,
                    }}>
                      ✓ {badgeSezione}
                    </span>
                  )}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div style={scatola}>
        <div style={{ ...etichetta, color: coloreClasseTema, marginBottom: 6 }}>{en ? 'Spend Secrets' : 'Spendere i Segreti'}</div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
          {spesa(1, en ? 'Open' : 'Aprire', en ? 'Open a seal: the DM guarantees the information is true and useful.' : 'Rompi il sigillo: il DM garantisce che l\'informazione sia vera e utile.')}
          {spesa(1, en ? 'Lever' : 'Leva', en ? 'Use the Secret against its source: an automatic Charisma success (max DC 20).' : 'Usi il Segreto contro la sua fonte: prova di Carisma con successo automatico (CD massima 20).')}
          {spesa(1, en ? 'Market' : 'Mercato', en ? 'Sell a Secret: it is consumed.' : 'Vendi un Segreto: viene consumato.')}
          <button
            type="button"
            style={styles.buttonMini}
            disabled={valSegreti < SEGRETI_MYRDHAL_ARALDI}
            onClick={() => {
              const giaPresente = (scheda.alleati || []).some((a) => a.nome === 'Myrdhal' || a.nomeOriginale === 'Myrdhal');
              let alleatiNuovi = scheda.alleati || [];
              if (!giaPresente) {
                const m = EVOCAZIONI_ARALDI.find((c) => c.nome === 'Myrdhal') || EVOCAZIONI_ARALDI[0];
                if (m) {
                  const nuovo = {
                    id: `all-${Date.now()}-myrdhal`,
                    nome: 'Myrdhal',
                    nomeOriginale: 'Myrdhal',
                    tipo: m.tipo || 'Non morto (Evocazione Araldi del Segreto)',
                    taglia: m.taglia || 'Grande',
                    ca: Number(m.ca) || 20,
                    pfMax: 210,
                    pfAttuali: 210,
                    velocita: '12m',
                    sensi: m.sensi || '',
                    abilita: m.abilita || '',
                    tratti: Array.isArray(m.tratti) ? m.tratti : [],
                    azioni: parseAzioniCompagno(m.azioni || []),
                    note: m.note || 'Evocato per 1d6 turni (10 Segreti).',
                    car: m.car || { forza: 20, destrezza: 22, costituzione: 20, intelligenza: 14, saggezza: 18, carisma: 22 },
                    gs: m.gs || '17',
                    ritratto: m.ritratto || generaAvatarBestia(m),
                  };
                  alleatiNuovi = [...alleatiNuovi, nuovo];
                }
              }
              const patch = patchVariaContatori(scheda, [{ nome: 'Segreti', delta: -SEGRETI_MYRDHAL_ARALDI }]);
              aggiorna({ ...(patch || {}), alleati: alleatiNuovi });
              if (registra) registra({ etichetta: 'Myrdhal', tipo: 'evoca', dettaglio: en ? 'Summoned Myrdhal for 1d6 turns (−10 Secrets).' : 'Evocato Myrdhal per 1d6 turni (−10 Segreti).' });
            }}
            title={en ? 'Summon Myrdhal for 1d6 turns (10 Secrets, the group can pool them).' : 'Evocate Myrdhal per 1d6 turni (10 Segreti, anche di gruppo).'}
          >
            Myrdhal <span style={{ color: C.inkDim }}>(−{SEGRETI_MYRDHAL_ARALDI})</span>
          </button>
          {spesa(1, en ? 'Secret for Myrdhal' : 'Segreto per Myrdhal', en ? 'Put 1 Secret into the group pool to summon Myrdhal (10 in total).' : 'Metti 1 Segreto nel fondo comune del gruppo per evocare Myrdhal (10 in tutto).')}
          <span style={{ ...styles.detail, fontSize: 11 }} data-testid="myrdhal-gruppo">
            {en ? 'Myrdhal costs 10 Secrets: the group can pool them.' : 'Myrdhal costa 10 Segreti: si possono mettere in comune nel gruppo.'}
          </span>
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center', marginTop: 8 }}>
          <span style={{ fontSize: 12, fontWeight: 700 }}>{en ? 'Enchant with secrets' : 'Incantare con i segreti'}</span>
          <select value={cerchioScelto} onChange={(e) => { setCerchio(Number(e.target.value)); setIncanto(0); }} style={{ ...styles.inlineInput, fontSize: 12, padding: '3px 6px' }} aria-label={en ? 'Spell level' : 'Cerchio'}>
            {cerchiDisponibili.map((n) => <option key={n} value={n}>{n}°</option>)}
          </select>
          <select value={incantoScelto} onChange={(e) => setIncanto(Number(e.target.value))} style={{ ...styles.inlineInput, fontSize: 12, padding: '3px 6px' }} aria-label={en ? 'Spell' : 'Incantesimo'}>
            {incantiDelCerchio.map((n, i) => <option key={n} value={i}>{n}</option>)}
          </select>
          <button
            type="button"
            style={styles.buttonMini}
            disabled={valSegreti < cerchioScelto}
            onClick={() => applica(
              [{ nome: 'Segreti', delta: -cerchioScelto }, { nome: 'Debito', delta: 1 }],
              incantiDelCerchio[incantoScelto],
              en ? `Cast without a slot: −${cerchioScelto} Secrets, +1 Debt` : `Lanciato senza slot: −${cerchioScelto} Segreti, +1 Debito`,
            )}
            title={en ? 'No spell slot used; you gain 1 Debt.' : 'Non usa slot; guadagni 1 Debito.'}
          >
            {en ? 'Cast' : 'Lancia'} <span style={{ color: C.inkDim }}>(−{cerchioScelto}, +1 {en ? 'Debt' : 'Debito'})</span>
          </button>
        </div>
        {mancantiIncanti.length > 0 && (
          <div style={{ marginTop: 8 }}>
            <button
              type="button"
              data-testid="aggiungi-incantesimi-araldi"
              style={{ ...styles.buttonMini, fontWeight: 700, color: '#ff9f1a', borderColor: 'rgba(255, 159, 26, 0.6)', background: 'rgba(255, 159, 26, 0.12)' }}
              onClick={aggiungiIncanti}
              title={en ? 'Adds the handbook\'s expanded spell list (levels 1-5) to the known spells.' : 'Aggiunge agli incantesimi conosciuti la lista ampliata del manuale (cerchi 1-5).'}
            >
              {en ? `Add the handbook spells to known spells (${mancantiIncanti.length})` : `Aggiungi gli incantesimi del manuale ai conosciuti (${mancantiIncanti.length})`}
            </button>
          </div>
        )}
        {valSegreti === 0 && (
          <p style={{ ...styles.detail, fontSize: 11, margin: '8px 0 0' }}>
            {en
              ? 'No Secrets yet: you gain them with Inquire (Brain), by killing with Empathic Transfer, or from the DM.'
              : 'Nessun Segreto: li ottieni con Inquisire (Cervello), uccidendo con Trasferire Empatico o dal DM.'}
          </p>
        )}
      </div>

      {privilegi.length > 0 && (
        <div style={scatola} data-testid="araldi-privilegi">
          <div style={{ ...etichetta, color: coloreClasseTema, textAlign: 'center', marginBottom: 6 }}>{en ? 'Features overview' : 'Panoramica dei privilegi'}</div>
          {gruppiPerLivello.map(({ livelloMin, lista }) => {
            const futuro = !potereSbloccato(lista[0], livello);
            return (
              <div key={livelloMin} style={{ display: 'flex', gap: 10, padding: '8px 0', borderBottom: `1px solid ${C.border}`, opacity: futuro ? 0.5 : 1 }}>
                <div style={{ flexShrink: 0, width: 62, fontWeight: 'bold', color: futuro ? C.inkDim : coloreClasseTema }}>
                  {en ? 'Lvl' : 'Liv.'} {livelloMin}
                </div>
                <div style={{ flex: 1, minWidth: 0, fontSize: 13, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {lista.map((p) => {
                    const indice = p.contatori.findIndex((c) => !NOMI_BASE.includes(c.nome));
                    const c = p.contatori[indice];
                    const t = futuro ? null : trovaContatore(scheda, c.nome);
                    const usi = t ? t.attuali : 0;
                    const maxUsi = t ? t.max : null;
                    const debitoUso = DEBITO_PER_USO[c.nome] || 0;
                    const costoRecupero = RECUPERO_CON_SEGRETI[c.nome] || 0;
                    const nomeBreve = p.nome.replace(/\s*\(.*?\)\s*$/, '');
                    const usaUno = () => applica(
                      [{ nome: c.nome, delta: -1 }, ...(debitoUso ? [{ nome: 'Debito', delta: debitoUso }] : [])],
                      nomeBreve,
                      debitoUso ? (en ? `Used: +${debitoUso} Debt` : `Usato: +${debitoUso} Debito`) : (en ? 'Used' : 'Usato'),
                    );
                    return (
                      <div key={p.id}>
                        <div>
                          •{' '}
                          <span
                            role="button"
                            tabIndex={0}
                            title={p.descrizione}
                            onClick={() => (onInfo ? onInfo({ titolo: nomeBreve, testo: p.descrizione }) : setAperti((x) => ({ ...x, [p.id]: !x[p.id] })))}
                            style={{ cursor: 'help', textDecoration: 'underline dotted', textUnderlineOffset: 3, fontWeight: 700, fontSize: 13 }}
                          >{nomeBreve}</span>
                          {onModifica && (
                            <button type="button" style={{ background: 'none', border: 0, padding: '0 0 0 8px', color: C.inkDim, cursor: 'pointer', fontSize: 11 }} onClick={() => onModifica(p.id)} title={en ? 'Edit' : 'Modifica'}>✎</button>
                          )}
                        </div>
                        {futuro ? (
                          <span style={{ ...styles.detail, fontStyle: 'italic' }}>— {en ? 'not reached yet' : 'non ancora raggiunto'}</span>
                        ) : (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginTop: 4 }}>
                            <span style={{ display: 'inline-flex', gap: 4 }} role="group" aria-label={`${usi}/${maxUsi}`}>
                              {Array.from({ length: maxUsi || 0 }, (_, i) => {
                                const disponibile = i < usi;
                                return (
                                  <button
                                    key={i}
                                    type="button"
                                    data-testid={`perla-${c.nome}`}
                                    aria-pressed={!disponibile}
                                    onClick={() => (disponibile ? usaUno() : applica([{ nome: c.nome, delta: 1 }], nomeBreve, en ? 'Use restored' : 'Uso ripristinato'))}
                                    title={disponibile
                                      ? (debitoUso ? (en ? `Use it (+${debitoUso} Debt)` : `Usalo (+${debitoUso} Debito)`) : (en ? 'Use it' : 'Usalo'))
                                      : (en ? 'Spent: click to restore' : 'Speso: clicca per ripristinarlo')}
                                    style={{
                                      width: 16,
                                      height: 16,
                                      padding: 0,
                                      borderRadius: '50%',
                                      cursor: 'pointer',
                                      border: disponibile ? '2px solid #ff9f1a' : '2px solid rgba(255, 159, 26, 0.45)',
                                      background: disponibile ? '#ff9f1a' : 'transparent',
                                      boxShadow: disponibile ? '0 0 6px rgba(255, 159, 26, 0.65)' : 'none',
                                      transition: 'all 0.15s ease',
                                    }}
                                  />
                                );
                              })}
                            </span>
                            <span style={{ fontSize: 12, color: C.inkDim }}>{usi}{maxUsi != null ? ` / ${maxUsi}` : ''}</span>
                            <span style={{ fontSize: 11, color: C.inkDim }} title={en ? 'Restored by resting' : 'Si ripristina con il riposo'}>↻ {c.ricarica === 'breve' ? (en ? 'short rest' : 'riposo breve') : (en ? 'long rest' : 'riposo lungo')}</span>
                            <span style={{ marginLeft: 'auto', display: 'inline-flex', gap: 5, flexWrap: 'wrap' }}>
                              <button type="button" style={styles.buttonMini} disabled={usi <= 0} onClick={usaUno} title={debitoUso ? (en ? `Using it adds ${debitoUso} Debt` : `Usarlo fa guadagnare ${debitoUso} Debito`) : undefined}>
                                {en ? 'Use' : 'Usa'}{debitoUso ? <span style={{ color: C.inkDim }}> (+{debitoUso} {en ? 'Debt' : 'Debito'})</span> : null}
                              </button>
                              {costoRecupero > 0 && (
                                <button
                                  type="button"
                                  style={styles.buttonMini}
                                  disabled={usi >= (maxUsi ?? 0) || valSegreti < costoRecupero}
                                  onClick={() => applica([{ nome: c.nome, delta: 1 }, { nome: 'Segreti', delta: -costoRecupero }], nomeBreve, en ? `Use restored for ${costoRecupero} Secrets` : `Uso recuperato spendendo ${costoRecupero} Segreti`)}
                                  title={en ? `Regain a use by spending ${costoRecupero} Secrets` : `Recupera un uso spendendo ${costoRecupero} Segreti`}
                                >
                                  {en ? 'Regain' : 'Recupera'} <span style={{ color: C.inkDim }}>(−{costoRecupero})</span>
                                </button>
                              )}
                              {(AZIONI_PRIVILEGI_ARALDI[c.nome] || []).map((az) => {
                                const costo = az.variazioni.filter((v) => v.nome === 'Segreti' && v.delta < 0).reduce((t, v) => t - v.delta, 0);
                                const guadagno = az.variazioni.filter((v) => v.nome === 'Segreti' && v.delta > 0).reduce((t, v) => t + v.delta, 0);
                                const pieno = guadagno > 0 && segreti.max != null && valSegreti >= segreti.max;
                                return (
                                  <button
                                    key={az.etichetta}
                                    type="button"
                                    style={styles.buttonMini}
                                    disabled={valSegreti < costo || pieno}
                                    onClick={() => applica(az.variazioni, `${nomeBreve} · ${en ? az.etichettaEn : az.etichetta}`, en ? az.spiegazioneEn : az.spiegazione)}
                                    title={(en ? az.spiegazioneEn : az.spiegazione) + (pieno ? (en ? ' (Secrets already at max)' : ' (Segreti già al massimo)') : '')}
                                  >
                                    {en ? az.etichettaEn : az.etichetta} <span style={{ color: C.inkDim }}>({costo ? `−${costo}` : `+${guadagno}`})</span>
                                  </button>
                                );
                              })}
                            </span>
                          </div>
                        )}
                        {!onInfo && aperti[p.id] && <div style={{ ...styles.detail, fontSize: 12, whiteSpace: 'pre-wrap', marginTop: 4 }}>{p.descrizione}</div>}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
          <p style={{ ...styles.detail, marginTop: 8, marginBottom: 0, fontSize: 11 }}>
            {en ? 'Click a name for details; the pearls are the uses (click = use / restore).' : 'Tocca un nome per i dettagli; le perle sono gli usi (un tocco = usa / ripristina).'}
          </p>
        </div>
      )}
    </div>
  );
}
