// Estratto da App.jsx (finestra "MenuEsportaModal"): riceve dall'App lo stato che usa, tutto il resto è importato.
import { C } from '../tema.js';
import { t, tr } from '../../i18n';
import { styles } from '../stili.js';
import { decodificaScheda } from '../../utils/condivisione.js';

export function MenuEsportaModal({ aggiorna, condividiLink, esportaBackupCompleto, esportaJson, jsonRef, lingua, normalizeImported, posEsporta, setInfo, setMostraMenuEsporta }) {
  return (
    <div onClick={() => setMostraMenuEsporta(false)} style={{ position: 'fixed', inset: 0, zIndex: 1400, background: 'transparent' }}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="no-stampa"
        style={{
          position: 'fixed', top: posEsporta.top, left: posEsporta.left,
          width: 'min(300px, calc(100vw - 16px))',
          background: C.panel, border: `1.5px solid ${C.gold}`, borderRadius: 12,
          boxShadow: '0 12px 36px rgba(0,0,0,0.55), 0 0 16px rgba(212,175,55,0.2)', padding: '12px 14px', zIndex: 1401,
          display: 'flex', flexDirection: 'column', gap: 6,
          backdropFilter: 'blur(8px)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 }}>
          <strong style={{ color: C.goldDark, fontSize: 14, display: 'flex', alignItems: 'center', gap: 5 }}>
            <span>{t('import_export.titolo')}</span>
          </strong>
          <button style={styles.buttonMini} onClick={() => setMostraMenuEsporta(false)} title={t('tip.chiudi')} aria-label={t('tip.chiudi')}>✕</button>
        </div>
    
        {/* SEZIONE 1: IMPORTA */}
        <div style={{ fontSize: 11, fontWeight: 700, color: C.inkDim, textTransform: 'uppercase', letterSpacing: 0.6, marginTop: 4 }}>
          {t('import_export.sezione_importa')}
        </div>
    
        <button
          style={{ ...styles.button, fontSize: 12, padding: '7px 10px', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 8 }}
          onClick={() => {
            setMostraMenuEsporta(false);
            setTimeout(() => jsonRef.current?.click(), 50);
          }}
          title={t('import_export.carica_file_sub')}
        >
          <div>
            <strong style={{ display: 'block' }}>{t('import_export.carica_file')}</strong>
            <span style={{ fontSize: 11, color: C.inkDim, fontWeight: 'normal' }}>{t('import_export.carica_file_sub')}</span>
          </div>
        </button>
    
        <button
          style={{ ...styles.button, fontSize: 12, padding: '7px 10px', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 8 }}
          onClick={() => {
            setMostraMenuEsporta(false);
            setTimeout(() => {
              const txt = prompt(lingua === 'en' ? 'Paste the sheet text (JSON) or a share link:' : 'Incolla il testo della scheda (JSON) o un link di condivisione:');
              if (txt && txt.trim()) {
                try {
                  let str = txt.trim();
                  if (str.includes('?')) {
                    const url = new URL(str, window.location.href);
                    const p = url.searchParams.get('pg') || url.searchParams.get('s') || url.searchParams.get('p');
                    if (p) {
                      decodificaScheda(p).then((dati) => {
                        if (dati) {
                          const normalizzata = normalizeImported(dati);
                          aggiorna(normalizzata);
                          setInfo({ titolo: tr('Importazione completata', 'Import complete'), testo: tr(`Scheda "${normalizzata.nome || 'Personaggio'}" importata dal link.`, `Sheet "${normalizzata.nome || 'Character'}" imported from the link.`) });
                        }
                      });
                      return;
                    }
                  }
                  const obj = JSON.parse(str);
                  const normalizzata = normalizeImported(obj);
                  aggiorna(normalizzata);
                  setInfo({ titolo: tr('Importazione completata', 'Import complete'), testo: tr(`Scheda "${normalizzata.nome || 'Personaggio'}" importata dal testo.`, `Sheet "${normalizzata.nome || 'Character'}" imported from the text.`) });
                } catch {
                  setInfo({ titolo: tr('Importazione non riuscita', 'Import failed'), testo: tr('Il testo incollato non è un JSON valido o il link non contiene una scheda valida.', 'The pasted text is not valid JSON, or the link does not contain a valid sheet.') });
                }
              }
            }, 50);
          }}
          title={t('import_export.incolla_json_sub')}
        >
          <div>
            <strong style={{ display: 'block' }}>{t('import_export.incolla_json')}</strong>
            <span style={{ fontSize: 11, color: C.inkDim, fontWeight: 'normal' }}>{t('import_export.incolla_json_sub')}</span>
          </div>
        </button>
    
        {/* SEZIONE 2: ESPORTA */}
        <div style={{ borderTop: `1px dashed ${C.border}`, margin: '4px 0 2px' }} />
        <div style={{ fontSize: 11, fontWeight: 700, color: C.inkDim, textTransform: 'uppercase', letterSpacing: 0.6 }}>
          {t('import_export.sezione_esporta')}
        </div>
    
        <button
          style={{ ...styles.button, fontSize: 12, padding: '7px 10px', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 8 }}
          onClick={() => {
            esportaJson();
            setMostraMenuEsporta(false);
          }}
          title={t('esporta.salva_json_tip')}
        >
          <div>
            <strong style={{ display: 'block' }}>{t('esporta.salva_json')}</strong>
            <span style={{ fontSize: 11, color: C.inkDim, fontWeight: 'normal' }}>{t('esporta.salva_json_sub')}</span>
          </div>
        </button>
    
        <button
          style={{ ...styles.buttonPrimary, fontSize: 12, padding: '7px 10px', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 8 }}
          onClick={() => {
            setMostraMenuEsporta(false);
            setTimeout(() => {
              window.print();
            }, 100);
          }}
          title={t('esporta.stampa_pdf_tip')}
        >
          <div>
            <strong style={{ display: 'block' }}>{t('esporta.stampa_pdf')}</strong>
            <span style={{ fontSize: 11, color: '#fff', opacity: 0.9, fontWeight: 'normal' }}>{t('esporta.stampa_pdf_sub')}</span>
          </div>
        </button>
    
        <button
          style={{ ...styles.button, fontSize: 12, padding: '7px 10px', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 8 }}
          onClick={() => {
            condividiLink();
            setMostraMenuEsporta(false);
          }}
          title={t('esporta.condividi_link_tip')}
        >
          <div>
            <strong style={{ display: 'block' }}>{t('esporta.condividi_link')}</strong>
            <span style={{ fontSize: 11, color: C.inkDim, fontWeight: 'normal' }}>{t('esporta.condividi_link_sub')}</span>
          </div>
        </button>
    
        <button
          style={{ ...styles.button, fontSize: 12, padding: '7px 10px', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 8 }}
          onClick={() => {
            esportaBackupCompleto();
            setMostraMenuEsporta(false);
          }}
          title={t('esporta.backup_tutti_tip')}
        >
          <div>
            <strong style={{ display: 'block' }}>{t('esporta.backup_tutti')}</strong>
            <span style={{ fontSize: 11, color: C.inkDim, fontWeight: 'normal' }}>{t('esporta.backup_tutti_sub')}</span>
          </div>
        </button>
      </div>
    </div>
  );
}
