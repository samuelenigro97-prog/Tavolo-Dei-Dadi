// Estratto da App.jsx (finestra "ManualiModal"): riceve dall'App lo stato che usa, tutto il resto è importato.
import { C } from '../tema.js';
import { styles } from '../stili.js';
import { MANUALI_INFO, manualeAttivo } from '../../data/dati5e.js';

export function ManualiModal({ lingua, manualiAttivi, setManualiAttivi, setMostraModalManuali }) {
  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 1100, padding: 16,
        background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
      onClick={(e) => { if (e.target === e.currentTarget) setMostraModalManuali(false); }}
    >
      <div style={{ ...styles.panel, maxWidth: 540, width: '100%', maxHeight: '90vh', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 12, boxShadow: '0 12px 48px rgba(0,0,0,0.5)' }}>
        {/* Titolo e Chiusura */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `1px solid ${C.border}`, paddingBottom: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div>
              <h2 style={{ ...styles.title, margin: 0, fontSize: 18, lineHeight: 1.2 }}>
                {lingua === 'it' ? 'Manuali e fonti' : 'Sourcebooks'}
              </h2>
              <div style={{ ...styles.detail, fontSize: 12, color: C.inkDim, marginTop: 2 }}>
                {lingua === 'it' ? 'Attiva o disattiva i manuali di gioco per personalizzare classi e opzioni.' : 'Enable or disable rule sourcebooks to customize classes and options.'}
              </div>
            </div>
          </div>
          <button
            style={{ ...styles.buttonMini, padding: '4px 8px', fontSize: 14 }}
            onClick={() => setMostraModalManuali(false)}
          >
            ✕
          </button>
        </div>

        {/* Preset Rapidi */}
        <div style={{ background: 'rgba(0,0,0,0.025)', padding: '8px 10px', borderRadius: 8, border: `1px solid ${C.border}` }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.inkDim, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.4 }}>
            {lingua === 'it' ? 'Preset Rapidi:' : 'Quick Presets:'}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            <button
              type="button"
              style={{ ...styles.buttonMini, fontSize: 11, padding: '3px 8px', fontWeight: 600 }}
              onClick={() => setManualiAttivi((prev) => ({ phb2024: true, phb2014: true, tasha: true, xanathar: true, fizban_mm: true, araldi: prev.araldi === true }))}
            >
              {lingua === 'it' ? 'Tutto Attivo (Consigliato)' : 'All Active (Recommended)'}
            </button>
            <button
              type="button"
              style={{ ...styles.buttonMini, fontSize: 11, padding: '3px 8px', fontWeight: 600 }}
              onClick={() => setManualiAttivi((prev) => ({ phb2024: true, phb2014: false, tasha: false, xanathar: false, fizban_mm: false, araldi: prev.araldi === true }))}
            >
              {lingua === 'it' ? 'Solo D&D 2024 (5.5)' : 'Only D&D 2024 (5.5)'}
            </button>
            <button
              type="button"
              style={{ ...styles.buttonMini, fontSize: 11, padding: '3px 8px', fontWeight: 600 }}
              onClick={() => setManualiAttivi((prev) => ({ phb2024: false, phb2014: true, tasha: false, xanathar: false, fizban_mm: false, araldi: prev.araldi === true }))}
            >
              {lingua === 'it' ? 'Solo D&D 2014 (5.0)' : 'Only D&D 2014 (5.0)'}
            </button>
            <button
              type="button"
              style={{ ...styles.buttonMini, fontSize: 11, padding: '3px 8px', fontWeight: 600 }}
              onClick={() => setManualiAttivi((prev) => ({ phb2024: false, phb2014: true, tasha: true, xanathar: true, fizban_mm: true, araldi: prev.araldi === true }))}
            >
              {lingua === 'it' ? '2014 + Tasha & Xanathar' : '2014 + Tasha & Xanathar'}
            </button>
          </div>
        </div>

        {/* Lista Manuali */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {Object.entries(MANUALI_INFO).map(([k, m]) => {
            const attivo = manualeAttivo(manualiAttivi, k);
            return (
              <div
                key={k}
                style={{
                  padding: '10px 12px',
                  borderRadius: 10,
                  border: `1.5px solid ${attivo ? m.colore : C.border}`,
                  background: attivo ? `${m.colore}0d` : 'rgba(0,0,0,0.02)',
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  gap: 12,
                  transition: 'all 0.15s ease',
                }}
              >
                <div style={{ display: 'flex', gap: 10, flex: 1, minWidth: 0 }}>
                  <span style={{ fontSize: 24, lineHeight: 1 }}>{m.icona}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                      <span style={{ fontWeight: 800, fontSize: 14, color: C.ink }}>
                        {lingua === 'it' ? m.nome : m.nomeEn}
                      </span>
                      <span style={{
                        fontSize: 11, fontWeight: 800, padding: '1px 5px', borderRadius: 4,
                        background: m.colore, color: '#ffffff',
                      }}>
                        {m.codice}
                      </span>
                    </div>
                    <div style={{ fontSize: 12, color: C.inkDim, marginTop: 3, lineHeight: 1.35 }}>
                      {lingua === 'it' ? m.descrizione : m.descrizioneEn}
                    </div>
                  </div>
                </div>

                {/* Toggle Switch */}
                <button
                  type="button"
                  onClick={() => setManualiAttivi((prev) => ({ ...prev, [k]: !attivo }))}
                  style={{
                    flexShrink: 0,
                    padding: '6px 12px',
                    borderRadius: 8,
                    fontSize: 12,
                    fontWeight: 800,
                    cursor: 'pointer',
                    border: 'none',
                    background: attivo ? m.colore : 'rgba(0,0,0,0.12)',
                    color: attivo ? '#ffffff' : C.inkDim,
                    transition: 'all 0.15s ease',
                  }}
                >
                  {attivo ? (lingua === 'it' ? '✓ Attivo' : '✓ Active') : (lingua === 'it' ? 'Non attivo' : 'Inactive')}
                </button>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 6, paddingTop: 10, borderTop: `1px solid ${C.border}` }}>
          <button
            type="button"
            style={{ ...styles.buttonPrimary, padding: '8px 18px', fontSize: 13 }}
            onClick={() => setMostraModalManuali(false)}
          >
            {lingua === 'it' ? 'Salva e chiudi' : 'Save and close'}
          </button>
        </div>
      </div>
    </div>
  );
}
