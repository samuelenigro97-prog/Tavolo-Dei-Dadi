// Estratto da App.jsx (finestra "SceltaVersioneModal"): riceve dall'App lo stato che usa, tutto il resto è importato.
import { styles } from '../stili.js';
import { t } from '../../i18n';
import { C } from '../tema.js';
import { IconaUI } from '../IconaFantasy.jsx';

export function SceltaVersioneModal({ eseguiImportConVersione, importPending, setImportPending, setMostraSceltaVersione }) {
  return (
    <div
      className="modal-backdrop"
      style={{
        position: 'fixed', inset: 0, zIndex: 1003, padding: 16,
        background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
      onClick={(e) => { if (e.target === e.currentTarget) { setMostraSceltaVersione(false); setImportPending(null); } }}
    >
      <div className="anim-modal-rapida" style={{ ...styles.panel, maxWidth: 420, width: '100%' }}>
        <h1 style={{ ...styles.title, textAlign: 'center', marginBottom: 8 }}>{t('importa.titolo')}</h1>
        <p style={{ ...styles.detail, textAlign: 'center', marginBottom: 16, lineHeight: 1.5 }}>
          {t('importa.selezionati', { n: importPending?.files?.length || 0 })}
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
          <button style={{ ...styles.button, padding: '14px 10px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }} onClick={() => eseguiImportConVersione('2014')}>
            <IconaUI nome="pergamena" dimensione={26} color={C.goldDark} />
            <span>D&D 5e</span>
            <span style={{ fontSize: 11, fontWeight: 400 }}>(2014)</span>
          </button>
          <button style={{ ...styles.button, padding: '14px 10px', borderColor: C.gold, color: C.goldDark, fontWeight: 700, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }} onClick={() => eseguiImportConVersione('2024')}>
            <IconaUI nome="arcano" dimensione={26} color={C.goldDark} />
            <span>D&D 5.5</span>
            <span style={{ fontSize: 11, fontWeight: 400 }}>(2024)</span>
          </button>
        </div>
        <button style={{ ...styles.button, width: '100%' }} onClick={() => { setMostraSceltaVersione(false); setImportPending(null); }}>{t('modal.annulla')}</button>
      </div>
    </div>
  );
}
