// Estratto da App.jsx (finestra "MovimentoModal"): riceve dall'App lo stato che usa, tutto il resto è importato.
import { C } from '../tema.js';
import { styles } from '../stili.js';
import { conSegno } from '../../rules/dadi.js';
import { calcolaMovimentoESalti } from '../../rules/regole.js';

export function MovimentoModal({ lingua, scheda, setMostraModalMovimento }) {
  const mov = calcolaMovimentoESalti(scheda);
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
      onClick={(e) => { if (e.target === e.currentTarget) setMostraModalMovimento(false); }}
    >
      <div
        style={{
          background: C.panel,
          border: `1px solid ${C.border}`,
          borderRadius: 12,
          maxWidth: 520,
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
          <strong style={{ fontSize: 15, color: C.goldDark }}>
            {lingua === 'en' ? `Movement, jumping and carrying (${(scheda?.versione || '2024') === '2024' ? '5.5' : '5e'})` : `Movimento, salti e capacità fisiche (${(scheda?.versione || '2024') === '2024' ? '5.5' : '5e'})`}
          </strong>
          <button
            type="button"
            onClick={() => setMostraModalMovimento(false)}
            style={{ ...styles.buttonMini, fontSize: 13, padding: '2px 8px' }}
          >
            ✕
          </button>
        </div>

        {/* Contenuto */}
        <div style={{ padding: '16px 18px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 14 }}>
                
          {/* 1. Modalità di Movimento */}
          <div style={{ background: C.panelLight, border: `1px solid ${C.border}`, borderRadius: 10, padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: C.goldDark, letterSpacing: 0.5 }}>
              {lingua === 'en' ? 'Movement modes per round' : 'Velocità e tipi di movimento'}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 8 }}>
              <div style={{ background: C.panel, padding: '8px 10px', borderRadius: 6, border: `1px solid ${C.border}` }}>
                <div style={{ fontSize: 11, color: C.inkDim }}>{lingua === 'en' ? 'Walking / Base' : 'Camminata / Base'}</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: C.ink }}>{mov.velBase} m</div>
              </div>
              <div style={{ background: C.panel, padding: '8px 10px', borderRadius: 6, border: `1px solid ${C.border}` }}>
                <div style={{ fontSize: 11, color: C.inkDim }}>{lingua === 'en' ? 'Dash (Action)' : 'Scatto (Azione)'}</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: C.goldDark }}>{mov.scatto} m</div>
              </div>
              <div style={{ background: C.panel, padding: '8px 10px', borderRadius: 6, border: `1px solid ${C.border}` }}>
                <div style={{ fontSize: 11, color: C.inkDim }}>{lingua === 'en' ? 'Climbing' : 'Scalata'}</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: C.ink }}>{mov.scalata} m</div>
              </div>
              <div style={{ background: C.panel, padding: '8px 10px', borderRadius: 6, border: `1px solid ${C.border}` }}>
                <div style={{ fontSize: 11, color: C.inkDim }}>{lingua === 'en' ? 'Swimming' : 'Nuoto'}</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: C.ink }}>{mov.nuoto} m</div>
              </div>
              <div style={{ background: C.panel, padding: '8px 10px', borderRadius: 6, border: `1px solid ${C.border}` }}>
                <div style={{ fontSize: 11, color: C.inkDim }}>{lingua === 'en' ? 'Crawling' : 'Strisciata'}</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: C.ink }}>{mov.strisciata} m</div>
              </div>
            </div>
          </div>

          {/* 2. Calcolatore Salti */}
          <div style={{ background: C.panelLight, border: `1px solid ${C.border}`, borderRadius: 10, padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: C.goldDark, letterSpacing: 0.5 }}>
                {lingua === 'en' ? `Jump Calculator (${(scheda?.versione || '2024') === '2024' ? '5.5' : '5e'}) (Strength-Based)` : `Calcolatore Salti (${(scheda?.versione || '2024') === '2024' ? '5.5' : '5e'}) (Basato su Forza)`}
              </div>
              <span style={{ fontSize: 11, color: C.inkDim }}>FOR {mov.forPunteggio} ({conSegno(mov.modFor)})</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {/* Salto in Lungo */}
              <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 8, padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 4 }}>
                <div style={{ fontWeight: 700, fontSize: 12, color: C.ink }}>
                  {lingua === 'en' ? 'Long Jump' : 'Salto in Lungo'}
                </div>
                <div style={{ fontSize: 12, color: C.inkDim, display: 'flex', justifyContent: 'space-between' }}>
                  <span>{lingua === 'en' ? 'With 3m run-up:' : 'Con rincorsa (3m):'}</span>
                  <strong style={{ color: C.goldDark, fontSize: 13 }}>{mov.saltoLungoRincorsa} m</strong>
                </div>
                <div style={{ fontSize: 12, color: C.inkDim, display: 'flex', justifyContent: 'space-between' }}>
                  <span>{lingua === 'en' ? 'Standing jump:' : 'Da fermo:'}</span>
                  <strong style={{ color: C.ink, fontSize: 13 }}>{mov.saltoLungoFermo} m</strong>
                </div>
                <div style={{ fontSize: 11, color: C.inkDim, marginTop: 2, lineHeight: 1.25 }}>
                  {lingua === 'en' ? 'Clear low obstacle: Athletics DC 10. Difficult terrain landing: Acrobatics DC 10 or prone.' : 'Ostacolo basso: Atletica CD 10. Terreno difficile: Acrobazia CD 10 o prono.'}
                </div>
              </div>

              {/* Salto in Alto */}
              <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 8, padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 4 }}>
                <div style={{ fontWeight: 700, fontSize: 12, color: C.ink }}>
                  {lingua === 'en' ? 'High Jump' : 'Salto in Alto'}
                </div>
                <div style={{ fontSize: 12, color: C.inkDim, display: 'flex', justifyContent: 'space-between' }}>
                  <span>{lingua === 'en' ? 'With 3m run-up:' : 'Con rincorsa (3m):'}</span>
                  <strong style={{ color: C.goldDark, fontSize: 13 }}>{mov.saltoAltoRincorsa} m</strong>
                </div>
                <div style={{ fontSize: 12, color: C.inkDim, display: 'flex', justifyContent: 'space-between' }}>
                  <span>{lingua === 'en' ? 'Standing jump:' : 'Da fermo:'}</span>
                  <strong style={{ color: C.ink, fontSize: 13 }}>{mov.saltoAltoFermo} m</strong>
                </div>
                <div style={{ fontSize: 11, color: C.inkDim, borderTop: `1px dashed ${C.border}`, paddingTop: 4, marginTop: 2 }}>
                  {lingua === 'en' ? 'Reach with arms:' : 'Presa a braccia tese:'} <strong style={{ color: C.ink }}>{mov.altezzaRaggiungibile} m</strong>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Capacità Fisiche: Sollevamento & Trascinamento */}
          <div style={{ background: C.panelLight, border: `1px solid ${C.border}`, borderRadius: 10, padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: C.goldDark, letterSpacing: 0.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>{lingua === 'en' ? 'Lifting and dragging' : 'Sollevare, spingere e trascinare'}</span>
              {mov.haCorporaturaPossente && (
                <span style={{ fontSize: 11, color: C.green, background: 'rgba(16,185,129,0.12)', border: '1px solid var(--c-green)', padding: '1px 5px', borderRadius: 4, fontWeight: 700 }}>
                  {lingua === 'en' ? 'Powerful Build ×2' : 'Corporatura Possente ×2'}
                </span>
              )}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <div style={{ background: C.panel, padding: '8px 10px', borderRadius: 6, border: `1px solid ${C.border}` }}>
                <div style={{ fontSize: 11, color: C.inkDim }}>{lingua === 'en' ? 'Max Overhead Lift:' : 'Sollevamento Massimo:'}</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: C.ink }}>{mov.sollevamentoKg} kg</div>
                <div style={{ fontSize: 11, color: C.inkDim }}>{lingua === 'en' ? '(Strength × 15 kg)' : '(Forza × 15 kg)'}</div>
              </div>
              <div style={{ background: C.panel, padding: '8px 10px', borderRadius: 6, border: `1px solid ${C.border}` }}>
                <div style={{ fontSize: 11, color: C.inkDim }}>{lingua === 'en' ? 'Max Push / Drag:' : 'Spinta / Trascinamento Max:'}</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: C.goldDark }}>{mov.spintaKg} kg</div>
                <div style={{ fontSize: 11, color: C.inkDim }}>{lingua === 'en' ? '(Strength × 30 kg)' : '(Forza × 30 kg)'}</div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
      }
