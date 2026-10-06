// Estratto da App.jsx (finestra "PrivilegiSottoclasseModal"): riceve dall'App lo stato che usa, tutto il resto è importato.
import { styles } from '../stili.js';
import { t, traduciDato } from '../../i18n';
import { C } from '../tema.js';
import { tabellaPrivilegiSottoclasse } from '../../data/dati5e.js';
import { spiegaPrivilegio } from '../../data/spiegazioni.js';

export function PrivilegiSottoclasseModal({ lingua, mostraPrivilegiSub, scheda, setInfo, setMostraPrivilegiSub, versione }) {
  const tutteLeSub = [
    ...(scheda.sottoclasse ? [{ classe: scheda.classe, livello: scheda.livello || 1, sottoclasse: scheda.sottoclasse }] : []),
    ...((scheda.multiclasse || []).filter((m) => m.sottoclasse).map((m) => ({ classe: m.classe, livello: m.livello || 1, sottoclasse: m.sottoclasse }))),
  ];
  const subFiltrate = (typeof mostraPrivilegiSub === 'string')
    ? tutteLeSub.filter((x) => x.sottoclasse === mostraPrivilegiSub)
    : tutteLeSub;
  const subDaMostrare = subFiltrate.length > 0 ? subFiltrate : tutteLeSub;
  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 1003, padding: 16, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      onClick={(e) => { if (e.target === e.currentTarget) setMostraPrivilegiSub(false); }}
    >
      <div style={{ ...styles.panel, maxWidth: 540, width: '100%', maxHeight: '88vh', overflowY: 'auto' }}>
        <h1 style={{ ...styles.title, textAlign: 'center', marginBottom: 4 }}>{t('priv.panoramica_sub')}</h1>
        <div style={{ textAlign: 'center', ...styles.detail, marginBottom: 12 }}>
          {versione === '2024' ? 'D&D 5.5' : 'D&D 5.0'}
        </div>

        {tutteLeSub.length > 1 && (
          <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginBottom: 14, flexWrap: 'wrap' }}>
            <button
              type="button"
              style={{ ...styles.buttonMini, fontSize: 11, padding: '3px 9px', borderRadius: 8, background: mostraPrivilegiSub === true ? 'rgba(200,140,20,0.18)' : C.panel, borderColor: mostraPrivilegiSub === true ? C.goldDark : C.border, fontWeight: mostraPrivilegiSub === true ? 700 : 500 }}
              onClick={() => setMostraPrivilegiSub(true)}
            >
              {lingua === 'en' ? 'All' : 'Tutte'}
            </button>
            {tutteLeSub.map((item, idx) => (
              <button
                key={idx}
                type="button"
                style={{ ...styles.buttonMini, fontSize: 11, padding: '3px 9px', borderRadius: 8, background: mostraPrivilegiSub === item.sottoclasse ? 'rgba(200,140,20,0.18)' : C.panel, borderColor: mostraPrivilegiSub === item.sottoclasse ? C.goldDark : C.border, fontWeight: mostraPrivilegiSub === item.sottoclasse ? 700 : 500 }}
                onClick={() => setMostraPrivilegiSub(item.sottoclasse)}
              >
                {traduciDato(item.sottoclasse)}
              </button>
            ))}
          </div>
        )}

        {subDaMostrare.length === 0 && <p style={styles.detail}>{t('priv.nessuno')}</p>}
        {subDaMostrare.map((item, idx) => {
          const tab = tabellaPrivilegiSottoclasse(item.sottoclasse, versione) || {};
          const righe = [];
          for (let L = 1; L <= 20; L++) if (tab[L]) righe.push({ L, feat: tab[L], futuro: L > item.livello });
          return (
            <div key={idx} style={{ marginBottom: 18, background: 'rgba(0,0,0,0.02)', border: `1px solid ${C.border}`, borderRadius: 8, padding: '10px 12px' }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: C.goldDark, marginBottom: 2 }}>
                {traduciDato(item.sottoclasse)}
              </div>
              <div style={{ fontSize: 11, color: C.inkDim, marginBottom: 8 }}>
                {traduciDato(item.classe)} · Livello {item.livello}
              </div>
              {righe.length === 0 && <p style={{ ...styles.detail, fontSize: 12 }}>{t('priv.nessuno')}</p>}
              {righe.map(({ L, feat, futuro }) => (
                <div key={L} style={{ display: 'flex', gap: 10, padding: '5px 0', borderBottom: `1px solid ${C.border}`, opacity: futuro ? 0.5 : 1 }}>
                  <div style={{ flexShrink: 0, width: 48, fontWeight: 'bold', fontSize: 12, color: futuro ? C.inkDim : C.goldDark }}>
                    {t('priv.livello')} {L}
                  </div>
                  <div style={{ flex: 1, fontSize: 13 }}>
                    {feat.split('\n').map((r, i) => {
                      const sp = spiegaPrivilegio(r);
                      return (
                        <div key={i}>
                          • {sp ? (
                            <span role="button" tabIndex={0}
                              style={{ cursor: 'help', textDecoration: 'underline dotted', textUnderlineOffset: 3 }}
                              title={sp}
                              onClick={() => setInfo({ titolo: r, testo: sp })}
                            >{r}</span>
                          ) : r}
                        </div>
                      );
                    })}
                    {futuro && <span style={{ ...styles.detail, fontStyle: 'italic', fontSize: 11 }}>— {t('priv.futuro')}</span>}
                  </div>
                </div>
              ))}
            </div>
          );
        })}
        <p style={{ ...styles.detail, marginTop: 10, fontSize: 11 }}>{t('priv.aiuto_sub')}</p>
        <button style={{ ...styles.button, width: '100%', marginTop: 6 }} onClick={() => setMostraPrivilegiSub(false)}>{t('modal.chiudi')}</button>
      </div>
    </div>
  );

}
