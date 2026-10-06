// Estratto da App.jsx (finestra "GuidaModal"): riceve dall'App lo stato che usa, tutto il resto è importato.
import { C } from '../tema.js';
import { styles } from '../stili.js';
import { t } from '../../i18n';
import { URL_ARCHIVIO_PG } from '../../utils/ambiente.js';

export function GuidaModal({ chiudiGuida }) {
  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 1010, padding: 16, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      onClick={(e) => { if (e.target === e.currentTarget) chiudiGuida(); }}
    >
      <div style={{ background: C.panel, border: `1px solid ${C.gold}`, borderRadius: 12, padding: '18px 20px', maxWidth: 460, width: '100%', maxHeight: '86vh', overflowY: 'auto', boxShadow: '0 10px 40px rgba(0,0,0,0.45)' }}>
        <h2 style={{ ...styles.title, fontSize: 22, margin: '0 0 4px', textAlign: 'center' }}>{t('guida.titolo')}</h2>
        <p style={{ ...styles.detail, textAlign: 'center', margin: '0 0 14px' }}>{t('guida.sottotitolo')}</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            ['👆', t('guida.click_t'), t('guida.click_d')],
            ['👆👆', t('guida.doppio_t'), t('guida.doppio_d')],
            ['🎲', t('guida.dadi_t'), t('guida.dadi_d')],
            ['🛟', t('guida.backup_t'), t('guida.backup_d')],
            ...(URL_ARCHIVIO_PG ? [['🗄️', t('guida.archivio_t'), t('guida.archivio_d')]] : []),
          ].map(([icona, titolo, desc]) => (
            <div key={titolo} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', background: C.panelLight, border: `1px solid ${C.border}`, borderRadius: 8, padding: '8px 10px' }}>
              <span style={{ fontSize: 20, lineHeight: 1.2, flexShrink: 0 }} aria-hidden>{icona}</span>
              <span style={{ minWidth: 0 }}>
                <strong style={{ color: C.ink, fontSize: 14 }}>{titolo}</strong>
                <span style={{ ...styles.detail, display: 'block', fontSize: 13 }}>{desc}</span>
              </span>
            </div>
          ))}
        </div>
        <button style={{ ...styles.buttonPrimary, width: '100%', marginTop: 16 }} onClick={chiudiGuida}>
          {t('guida.ok')}
        </button>
      </div>
    </div>
  );
}
