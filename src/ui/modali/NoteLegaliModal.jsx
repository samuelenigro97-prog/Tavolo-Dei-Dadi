// Estratto da App.jsx (finestra "NoteLegaliModal"): riceve dall'App lo stato che usa, tutto il resto è importato.
import { C } from '../tema.js';
import { styles } from '../stili.js';
import { t } from '../../i18n';

export function NoteLegaliModal({ setMostraNoteLegali }) {
  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 1010, padding: 16, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      onClick={(e) => { if (e.target === e.currentTarget) setMostraNoteLegali(false); }}
    >
      <div style={{ background: C.panel, border: `1px solid ${C.gold}`, borderRadius: 12, padding: '18px 20px', maxWidth: 480, width: '100%', maxHeight: '86vh', overflowY: 'auto', boxShadow: '0 10px 40px rgba(0,0,0,0.45)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <h2 style={{ ...styles.title, fontSize: 20, margin: 0 }}>{t('legali.titolo')}</h2>
          <button style={styles.buttonMini} onClick={() => setMostraNoteLegali(false)} title={t('tip.chiudi')} aria-label={t('tip.chiudi')}>✕</button>
        </div>
    
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: 13, lineHeight: 1.5 }}>
          <div style={{ background: C.panelLight, border: `1px solid ${C.border}`, borderRadius: 8, padding: '10px 12px' }}>
            <strong style={{ color: C.goldDark, display: 'block', marginBottom: 4 }}>{t('legali.srd_titolo')}</strong>
            <p style={{ margin: 0, color: C.ink }}>{t('legali.srd_testo')}</p>
          </div>
    
          <div style={{ background: C.panelLight, border: `1px solid ${C.border}`, borderRadius: 8, padding: '10px 12px' }}>
            <strong style={{ color: C.goldDark, display: 'block', marginBottom: 4 }}>{t('legali.wotc_titolo')}</strong>
            <p style={{ margin: 0, color: C.ink }}>{t('legali.wotc_testo')}</p>
          </div>
    
          <div style={{ background: C.panelLight, border: `1px solid ${C.border}`, borderRadius: 8, padding: '10px 12px' }}>
            <strong style={{ color: C.goldDark, display: 'block', marginBottom: 4 }}>🔒 {t('legali.privacy_titolo')}</strong>
            <p style={{ margin: 0, color: C.ink }}>{t('legali.privacy_testo')}</p>
          </div>
        </div>
    
        <button style={{ ...styles.buttonPrimary, width: '100%', marginTop: 16 }} onClick={() => setMostraNoteLegali(false)}>
          {t('common.chiudi')}
        </button>
      </div>
    </div>
  );
}
