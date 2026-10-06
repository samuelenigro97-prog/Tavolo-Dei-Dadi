// Estratto da App.jsx (finestra "PeModal"): riceve dall'App lo stato che usa, tutto il resto è importato.
import { t } from '../../i18n';
import { C } from '../tema.js';
import { styles } from '../stili.js';
import { Editable } from '../componenti.jsx';
import { PE_PER_LIVELLO } from '../../data/dati5e.js';
import { conSegno, bonusCompetenzaDaLivello } from '../../rules/dadi.js';
import { dettagliEsperienza } from '../../rules/regole.js';

export function PeModal({ aggiorna, inputAggiungiPe, lingua, registra, scheda, setInputAggiungiPe, setMostraLevelUp, setMostraModalPe, versione }) {
  const livTotale = (Number(scheda.livello) || 1) + ((scheda.multiclasse || []).reduce((a, m) => a + (Number(m.livello) || 0), 0));
  const infoPe = dettagliEsperienza(scheda.pe, livTotale);

  const aggiungiPeDelta = (delta) => {
    const num = Math.max(0, Math.floor(Number(delta) || 0));
    if (num === 0) return;
    const pePrec = Math.max(0, Number(scheda.pe) || 0);
    const nuovoTotale = pePrec + num;
    aggiorna({ pe: nuovoTotale });
    setInputAggiungiPe('');
    registra({
      etichetta: `Punti Esperienza`,
      tipo: 'pe',
      totale: num,
      dettaglio: `Guadagnati +${num.toLocaleString()} PE (Totale: ${nuovoTotale.toLocaleString()} PE)`,
    });
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0,0,0,0.6)',
        backdropFilter: 'blur(3px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: 16,
      }}
      onClick={(e) => { if (e.target === e.currentTarget) setMostraModalPe(false); }}
    >
      <div
        style={{
          background: C.panel,
          border: `1px solid ${C.border}`,
          borderRadius: 12,
          maxWidth: 540,
          width: '100%',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 8px 30px rgba(0,0,0,0.3)',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div style={{ padding: '14px 18px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <strong style={{ fontSize: 15, color: C.goldDark, display: 'flex', alignItems: 'center', gap: 6 }}>
            {lingua === 'en' ? 'Experience Points (XP Tracker)' : 'Tracciatore Punti Esperienza (PE)'}
          </strong>
          <button
            type="button"
            onClick={() => setMostraModalPe(false)}
            style={{ ...styles.buttonMini, fontSize: 13, padding: '2px 8px' }}
          >
            ✕
          </button>
        </div>

        {/* Contenuto Modale */}
        <div style={{ padding: '16px 18px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 14 }}>
                
          {/* Scheda Riepilogo Livello e Barra Progresso */}
          <div style={{ background: C.panelLight, border: `1px solid ${C.border}`, borderRadius: 10, padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 6 }}>
              <div style={{ textAlign: 'center', flex: 1 }}>
                <div style={{ fontSize: 11, color: C.inkDim, textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 700 }}>
                  {lingua === 'en' ? 'Current Level' : 'Livello Attuale'}
                </div>
                <div style={{ fontSize: 18, fontWeight: 800, color: C.ink }}>
                  {t('profilo.livello')} {livTotale}
                </div>
              </div>
              <div style={{ textAlign: 'center', flex: 1 }}>
                <div style={{ fontSize: 11, color: C.inkDim, textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 700 }}>
                  {lingua === 'en' ? 'Next Level Goal' : 'Prossimo Livello'}
                </div>
                <div style={{ fontSize: 18, fontWeight: 800, color: C.goldDark }}>
                  {livTotale >= 20 ? 'Max (Liv. 20)' : `${t('profilo.livello')} ${livTotale + 1}`}
                </div>
              </div>
            </div>

            {/* Barra di Avanzamento */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 700 }}>
                <span style={{ color: C.ink }}>
                  {Number(scheda.pe || 0).toLocaleString()} PE
                </span>
                <span style={{ color: infoPe.puoSalire ? C.green : C.goldDark }}>
                  {infoPe.percentuale}% {livTotale < 20 ? `(${infoPe.peGuadagnatiNelLivello.toLocaleString()} / ${infoPe.peNecessariDelta.toLocaleString()} PE)` : ''}
                </span>
              </div>
              <div style={{ height: 10, width: '100%', background: 'rgba(0,0,0,0.08)', borderRadius: 5, overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    width: `${infoPe.percentuale}%`,
                    background: infoPe.puoSalire ? 'linear-gradient(90deg, #10b981, #059669)' : `linear-gradient(90deg, ${C.gold}, ${C.goldDark})`,
                    transition: 'width 0.3s ease',
                  }}
                />
              </div>
            </div>

            {/* Informazioni Dettagliate — allineata con Livello Attuale */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: 12, color: C.inkDim, background: C.panel, padding: '8px 10px', borderRadius: 6, border: `1px solid ${C.border}`, textAlign: 'center' }}>
              <div>
                {lingua === 'en' ? 'Threshold for current level:' : 'Soglia livello attuale:'} <strong>{infoPe.peMinLivello.toLocaleString()} PE</strong>
              </div>
              <div>
                {lingua === 'en' ? 'Threshold for next level:' : 'Soglia del prossimo livello:'} <strong>{livTotale >= 20 ? '—' : `${infoPe.peProssimoLivello.toLocaleString()} PE`}</strong>
              </div>
              <div>
                {lingua === 'en' ? 'XP to next level:' : 'PE mancanti al prossimo livello:'} <strong style={{ color: infoPe.puoSalire ? C.green : C.ink }}>{infoPe.puoSalire ? (lingua === 'en' ? 'Ready to level up' : 'Puoi salire di livello') : `${infoPe.peMancanti.toLocaleString()} PE`}</strong>
              </div>
              <div>
                {lingua === 'en' ? 'Theoretical Level by XP:' : 'Livello teorico da PE:'} <strong>Liv. {infoPe.livelloTeorico}</strong>
              </div>
            </div>

            {/* Pulsante Level Up se idoneo — animato come campanello */}
            {infoPe.puoSalire && (
              <button
                type="button"
                onClick={() => {
                  setMostraModalPe(false);
                  setMostraLevelUp(true);
                }}
                className="icona-campanello"
                style={{
                  ...styles.button,
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  color: '#fff',
                  fontWeight: 800,
                  fontSize: 13,
                  padding: '10px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  boxShadow: '0 4px 12px rgba(16,185,129,0.3)',
                }}
              >
                {lingua === 'en' ? 'Ready to level up: open the level-up guide' : 'Puoi salire di livello: apri l’avanzamento'}
              </button>
            )}
          </div>

          {/* Sezione Aggiungi Rapido P.E. */}
          <div style={{ background: C.panelLight, border: `1px solid ${C.border}`, borderRadius: 10, padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: C.goldDark, letterSpacing: 0.5 }}>
              {lingua === 'en' ? 'Add Session / Encounter XP' : 'Aggiungi Punti Esperienza'}
            </div>
                  
            {/* Input personalizzato */}
            <div style={{ display: 'flex', gap: 6 }}>
              <input
                type="number"
                placeholder={lingua === 'en' ? 'Amount of XP to add (e.g. 450)...' : 'Quantità PE da aggiungere (es. 450)...'}
                value={inputAggiungiPe}
                onChange={(e) => setInputAggiungiPe(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    aggiungiPeDelta(inputAggiungiPe);
                  }
                }}
                style={{ ...styles.inlineInput, flex: 1, padding: '6px 10px', fontSize: 13 }}
              />
              <button
                type="button"
                onClick={() => aggiungiPeDelta(inputAggiungiPe)}
                disabled={!inputAggiungiPe || Number(inputAggiungiPe) <= 0}
                style={{
                  ...styles.buttonMini,
                  background: C.goldDark,
                  color: C.onGold,
                  fontSize: 12,
                  fontWeight: 700,
                  padding: '6px 14px',
                  opacity: (!inputAggiungiPe || Number(inputAggiungiPe) <= 0) ? 0.5 : 1,
                }}
              >
                {lingua === 'en' ? 'Add XP' : 'Aggiungi'}
              </button>
            </div>

            {/* Pulsanti Rapidi */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 2 }}>
              {[50, 100, 250, 500, 1000, 2500, 5000].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => aggiungiPeDelta(val)}
                  style={{
                    ...styles.buttonMini,
                    fontSize: 11,
                    padding: '3px 8px',
                    color: C.goldDark,
                    borderColor: C.gold,
                    background: 'rgba(201,162,39,0.08)',
                    fontWeight: 600,
                  }}
                >
                  +{val.toLocaleString()} PE
                </button>
              ))}
            </div>
          </div>

          {/* Modifica Manuale P.E. Totali */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: C.panelLight, borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 12 }}>
            <span style={{ color: C.inkDim }}>{lingua === 'en' ? 'Set Total XP manually:' : 'Imposta PE totali a mano:'}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Editable
                value={Math.max(0, Number(scheda.pe) || 0)}
                tipo="numero"
                width={90}
                style={{ textAlign: 'right', fontWeight: 700 }}
                onChange={(v) => aggiorna({ pe: Math.max(0, v) })}
              />
              <span style={{ color: C.inkDim }}>PE</span>
            </div>
          </div>

          {/* Tabella Ufficiale Soglie D&D 5e */}
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: C.goldDark, marginBottom: 6 }}>
              {lingua === 'en' ? `Official XP Progression Table (${versione === '2024' ? '5.5' : '5e'})` : `Tabella Ufficiale Soglie PE (${versione === '2024' ? '5.5' : '5e'})`}
            </div>
            <div style={{ maxHeight: 180, overflowY: 'auto', border: `1px solid ${C.border}`, borderRadius: 6 }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11, textAlign: 'left' }}>
                <thead>
                  <tr style={{ background: C.panelLight, borderBottom: `1px solid ${C.border}`, color: C.inkDim }}>
                    <th style={{ padding: '4px 8px' }}>{t('profilo.livello')}</th>
                    <th style={{ padding: '4px 8px' }}>{lingua === 'en' ? 'Min XP' : 'PE Minimi'}</th>
                    <th style={{ padding: '4px 8px' }}>{lingua === 'en' ? 'Prof. Bonus' : 'Bonus Comp.'}</th>
                    <th style={{ padding: '4px 8px' }}>{lingua === 'en' ? 'Status' : 'Stato'}</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: 20 }, (_, i) => i + 1).map((l) => {
                    const soglia = PE_PER_LIVELLO[l];
                    const bc = bonusCompetenzaDaLivello(l);
                    const isAttuale = l === livTotale;
                    const isRaggiunto = Number(scheda.pe || 0) >= soglia;

                    return (
                      <tr
                        key={l}
                        style={{
                          background: isAttuale ? 'rgba(201,162,39,0.14)' : l % 2 === 0 ? 'rgba(0,0,0,0.02)' : 'transparent',
                          fontWeight: isAttuale ? 700 : 400,
                          borderBottom: `1px solid ${C.border}`,
                        }}
                      >
                        <td style={{ padding: '4px 8px', color: isAttuale ? C.goldDark : C.ink }}>
                          {isAttuale ? '👉 ' : ''}Livello {l}
                        </td>
                        <td style={{ padding: '4px 8px', color: C.ink }}>
                          {soglia.toLocaleString()} PE
                        </td>
                        <td style={{ padding: '4px 8px', color: C.inkDim }}>
                          {conSegno(bc)}
                        </td>
                        <td style={{ padding: '4px 8px', fontSize: 11 }}>
                          {isAttuale ? (
                            <span style={{ color: C.goldDark, fontWeight: 700 }}>● {lingua === 'en' ? 'Current' : 'Attuale'}</span>
                          ) : isRaggiunto ? (
                            <span style={{ color: C.green }}>✓ {lingua === 'en' ? 'Reached' : 'Raggiunto'}</span>
                          ) : (
                            <span style={{ color: C.inkDim }}>—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
      }
