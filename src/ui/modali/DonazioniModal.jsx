// Estratto da App.jsx (finestra "DonazioniModal"): riceve dall'App lo stato che usa, tutto il resto è importato.
import { C } from '../tema.js';
import { styles } from '../stili.js';
import { t } from '../../i18n';

export function DonazioniModal({ setMostraDonazioni }) {
  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 1010, padding: 16, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      onClick={(e) => { if (e.target === e.currentTarget) setMostraDonazioni(false); }}
    >
      <div style={{ background: C.panel, border: `1px solid ${C.gold}`, borderRadius: 12, padding: '18px 20px', maxWidth: 460, width: '100%', maxHeight: '86vh', overflowY: 'auto', boxShadow: '0 10px 40px rgba(0,0,0,0.45)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <h2 style={{ ...styles.title, fontSize: 20, margin: 0 }}>{t('donazioni.titolo')}</h2>
          <button style={styles.buttonMini} onClick={() => setMostraDonazioni(false)} title={t('tip.chiudi')} aria-label={t('tip.chiudi')}>✕</button>
        </div>
        <p style={{ ...styles.detail, margin: '0 0 12px' }}>{t('donazioni.sottotitolo')}</p>
    
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 13, lineHeight: 1.5, marginBottom: 14 }}>
          <p style={{ margin: 0, color: C.ink }}>{t('donazioni.testo_1')}</p>
          <div style={{ background: C.panelLight, border: `1px solid ${C.border}`, borderRadius: 8, padding: '10px 12px' }}>
            <p style={{ margin: 0, color: C.inkDim, fontStyle: 'italic' }}>{t('donazioni.testo_2')}</p>
          </div>
    
          {/* Pulsante ufficiale Ko-fi */}
          <a
            href="https://ko-fi.com/samuelenigro"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              background: '#ff5e5b',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: 14,
              padding: '10px 16px',
              borderRadius: 8,
              textDecoration: 'none',
              boxShadow: '0 4px 14px rgba(255, 94, 91, 0.4)',
              margin: '6px 0 2px',
              textAlign: 'center',
            }}
          >
            <span>{t('donazioni.bottone_kofi')}</span>
          </a>
    
          <p style={{ margin: '4px 0 0', fontWeight: 600, color: C.goldDark, textAlign: 'center', fontSize: 12 }}>{t('donazioni.grazie')}</p>
        </div>
    
        <button style={{ ...styles.button, width: '100%' }} onClick={() => setMostraDonazioni(false)}>
          {t('common.chiudi')}
        </button>
      </div>
    </div>
  );
}
