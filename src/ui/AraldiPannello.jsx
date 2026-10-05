// Pannello dedicato al manuale di campagna "Araldi del Segreto": Segreti e
// Debito con un tocco, soglie del Debito che si accendono da sole, spese dei
// Segreti (Aprire, Leva, Incantare, Mercato) e i privilegi sbloccati per
// livello con i loro usi. Legge e scrive gli stessi contatori dei Poteri
// (nessun dato nuovo): le risorse collegate, i riposi e i modificatori
// (+1 CA a Debito 15...) continuano a funzionare come per qualsiasi potere.
import { useState } from 'react';
import { C } from './tema.js';
import { styles } from './stili.js';
import {
  normalizzaPoteri,
  trovaContatore,
  patchVariaContatori,
  livelloTotaleScheda,
  potereSbloccato,
} from '../rules/poteri.js';
import { SOGLIE_DEBITO_ARALDI, LISTA_AMPLIATA_ARALDI } from '../data/modelliPoteri.js';

const ID_MODELLO = 'araldi-del-segreto';
// Debito che si guadagna a ogni uso di un privilegio (dal manuale).
const DEBITO_PER_USO = { 'Inquisire': 1, 'Trasferire Empatico': 2, 'Braccare!': 1 };
// Recupero di un uso spendendo Segreti (dal manuale).
const RECUPERO_CON_SEGRETI = { 'Affabilità': 1, 'Trasferire Empatico': 2 };
const NOMI_BASE = ['Segreti', 'Debito'];

const scatola = { border: `1px solid ${C.border}`, borderRadius: 8, padding: '8px 10px', background: C.panelLight };
const etichetta = { fontSize: 11, fontWeight: 700, color: C.inkDim, textTransform: 'uppercase', letterSpacing: 0.5 };

function Contatore({ titolo, valore, max, onMeno, onPiu, sotto, suggerimento }) {
  return (
    <div style={{ ...scatola, flex: '1 1 150px', minWidth: 140, textAlign: 'center' }} title={suggerimento}>
      <div style={etichetta}>{titolo}</div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, margin: '4px 0' }}>
        <button type="button" style={{ ...styles.buttonMini, padding: '2px 10px', fontSize: 15 }} onClick={onMeno} disabled={valore <= 0} aria-label={`${titolo} −1`}>−</button>
        <span style={{ fontSize: 26, fontWeight: 800, color: C.ink, minWidth: 34, fontVariantNumeric: 'tabular-nums' }}>
          {valore}{max != null && <span style={{ fontSize: 14, fontWeight: 600, color: C.inkDim }}> / {max}</span>}
        </span>
        <button type="button" style={{ ...styles.buttonMini, padding: '2px 10px', fontSize: 15 }} onClick={onPiu} disabled={max != null && valore >= max} aria-label={`${titolo} +1`}>+</button>
      </div>
      {sotto && <div style={{ fontSize: 11, color: C.inkDim }}>{sotto}</div>}
    </div>
  );
}

export function AraldiPannello({ scheda, aggiorna, lingua = 'it', registra, onModifica }) {
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

  return (
    <div data-testid="araldi-pannello" style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 10 }}>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <Contatore
          titolo={en ? 'Secrets' : 'Segreti'}
          valore={valSegreti}
          max={segreti.max}
          sotto={en ? 'Max twice your proficiency bonus' : 'Massimo: il doppio della competenza'}
          suggerimento={en ? 'Secrets you hold. Spend them below.' : 'I Segreti che possiedi. Spendili qui sotto.'}
          onMeno={() => applica([{ nome: 'Segreti', delta: -1 }])}
          onPiu={() => applica([{ nome: 'Segreti', delta: 1 }])}
        />
        <Contatore
          titolo={en ? 'Debt' : 'Debito'}
          valore={valDebito}
          sotto={prossima
            ? (en ? `Next threshold: ${prossima.soglia} (${prossima.nomeEn}) · ${prossima.soglia - valDebito} to go` : `Prossima soglia: ${prossima.soglia} (${prossima.nome}) · mancano ${prossima.soglia - valDebito}`)
            : (en ? 'All thresholds reached' : 'Tutte le soglie raggiunte')}
          suggerimento={en ? 'Debt grows when you use Secrets and some features.' : 'Il Debito cresce usando i Segreti e alcuni privilegi.'}
          onMeno={() => applica([{ nome: 'Debito', delta: -1 }])}
          onPiu={() => applica([{ nome: 'Debito', delta: 1 }])}
        />
      </div>

      <div style={scatola}>
        <div style={{ ...etichetta, marginBottom: 6 }}>{en ? 'Debt thresholds' : 'Soglie del Debito'}</div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {SOGLIE_DEBITO_ARALDI.map((s) => {
            const raggiunta = valDebito >= s.soglia;
            return (
              <span
                key={s.soglia}
                title={`${en ? s.nomeEn : s.nome}: ${en ? s.effettoEn : s.effetto}`}
                style={{
                  fontSize: 12, fontWeight: 700, padding: '2px 8px', borderRadius: 4, cursor: 'help',
                  border: `1px ${raggiunta ? 'solid' : 'dashed'} ${raggiunta ? C.goldDark : C.border}`,
                  background: raggiunta ? 'rgba(201,162,39,0.14)' : 'transparent',
                  color: raggiunta ? C.goldDark : C.inkDim,
                }}
              >
                {raggiunta ? '✓ ' : ''}{s.soglia} · {en ? s.nomeEn : s.nome}
              </span>
            );
          })}
        </div>
      </div>

      <div style={scatola}>
        <div style={{ ...etichetta, marginBottom: 6 }}>{en ? 'Spend Secrets' : 'Spendere i Segreti'}</div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
          {spesa(1, en ? 'Open' : 'Aprire', en ? 'Open a seal: the DM guarantees the information is true and useful.' : 'Rompi il sigillo: il DM garantisce che l\'informazione sia vera e utile.')}
          {spesa(1, en ? 'Lever' : 'Leva', en ? 'Use the Secret against its source: an automatic Charisma success (max DC 20).' : 'Usi il Segreto contro la sua fonte: prova di Carisma con successo automatico (CD massima 20).')}
          {spesa(1, en ? 'Market' : 'Mercato', en ? 'Sell a Secret: it is consumed.' : 'Vendi un Segreto: viene consumato.')}
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
      </div>

      {privilegi.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={etichetta}>{en ? 'Features by level' : 'Privilegi per livello'}</div>
          {privilegi.map((p) => {
            const bloccato = !potereSbloccato(p, livello);
            const indice = p.contatori.findIndex((c) => !NOMI_BASE.includes(c.nome));
            const c = p.contatori[indice];
            const t = bloccato ? null : trovaContatore(scheda, c.nome);
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
              <div key={p.id} style={{ ...scatola, opacity: bloccato ? 0.6 : 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <strong style={{ fontSize: 13 }}>{nomeBreve}</strong>
                  <span style={{ fontSize: 11, fontWeight: 700, color: bloccato ? C.inkDim : C.goldDark, border: `1px solid ${bloccato ? C.border : C.goldDark}`, borderRadius: 6, padding: '1px 6px' }}>
                    {bloccato ? '🔒 ' : ''}{en ? `Level ${p.livelloMin}` : `${p.livelloMin}° liv.`}
                  </span>
                  {bloccato ? (
                    <span style={{ fontSize: 11, color: C.inkDim }}>{en ? `Unlocks at level ${p.livelloMin}` : `Si sblocca al ${p.livelloMin}° livello`}</span>
                  ) : (
                    <>
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
                              style={{ width: 16, height: 16, padding: 0, borderRadius: '50%', cursor: 'pointer', border: `2px solid ${C.goldDark}`, background: disponibile ? C.goldDark : 'transparent', transition: 'all 0.15s ease' }}
                            />
                          );
                        })}
                      </span>
                      <span style={{ fontSize: 12, color: C.inkDim }}>{usi}{maxUsi != null ? ` / ${maxUsi}` : ''}</span>
                      <span style={{ fontSize: 11, color: C.inkDim }} title={en ? 'Restored by resting' : 'Si ripristina con il riposo'}>↻ {c.ricarica === 'breve' ? (en ? 'short rest' : 'riposo breve') : (en ? 'long rest' : 'riposo lungo')}</span>
                      <span style={{ marginLeft: 'auto', display: 'inline-flex', gap: 5, flexWrap: 'wrap' }}>
                        <button
                          type="button"
                          style={styles.buttonMini}
                          disabled={usi <= 0}
                          onClick={usaUno}
                          title={debitoUso ? (en ? `Using it adds ${debitoUso} Debt` : `Usarlo fa guadagnare ${debitoUso} Debito`) : undefined}
                        >
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
                      </span>
                    </>
                  )}
                </div>
                <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                  <button type="button" style={{ background: 'none', border: 0, padding: 0, color: C.goldDark, cursor: 'pointer', fontSize: 11, fontWeight: 600 }} onClick={() => setAperti((a) => ({ ...a, [p.id]: !a[p.id] }))} aria-expanded={Boolean(aperti[p.id])}>
                    {aperti[p.id] ? '▾' : '▸'} {en ? 'Details' : 'Dettagli'}
                  </button>
                  {onModifica && (
                    <button type="button" style={{ background: 'none', border: 0, padding: 0, color: C.inkDim, cursor: 'pointer', fontSize: 11 }} onClick={() => onModifica(p.id)}>
                      ✎ {en ? 'Edit' : 'Modifica'}
                    </button>
                  )}
                </div>
                {aperti[p.id] && <div style={{ ...styles.detail, fontSize: 12, whiteSpace: 'pre-wrap', marginTop: 4 }}>{p.descrizione}</div>}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
