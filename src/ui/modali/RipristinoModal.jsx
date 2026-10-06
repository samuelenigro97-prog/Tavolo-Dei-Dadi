// Estratto da App.jsx (finestra "RipristinoModal"): riceve dall'App lo stato che usa, tutto il resto è importato.
import { styles } from '../stili.js';
import { C } from '../tema.js';
import { t, tr } from '../../i18n';

export function RipristinoModal({ leggiSnapshots, ripristinaSnapshot, setConferma, setMostraRipristino }) {
  const snaps = leggiSnapshots();
  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 1005, padding: 16, background: 'rgba(0,0,0,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      onClick={(e) => { if (e.target === e.currentTarget) setMostraRipristino(false); }}
    >
      <div style={{ ...styles.panel, maxWidth: 460, width: '100%', maxHeight: '80vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <strong style={{ color: C.goldDark, fontSize: 16 }}>Versioni precedenti</strong>
          <button style={styles.buttonMini} onClick={() => setMostraRipristino(false)} title={t('tip.chiudi')} aria-label={t('tip.chiudi')}>✕</button>
        </div>
        <p style={{ ...styles.detail, marginTop: 0 }}>
          {tr('Ripristini automatici salvati su questo dispositivo (senza immagini). Utile per annullare una cancellazione o una modifica sbagliata. Ripristinando, lo stato attuale viene comunque salvato.', 'Automatic restore points saved on this device (without images). Useful to undo a deletion or a wrong change. Restoring still saves the current state first.')}
          
        </p>
        {snaps.length === 0 && <p style={styles.detail}>{tr('Nessuna versione salvata.', 'No saved versions.')}</p>}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {snaps.map((s, i) => {
            const nomi = Object.values(s.roster?.personaggi || {}).map((p) => p.nome || '—').slice(0, 4).join(', ');
            const quando = new Date(s.ts).toLocaleString('it-IT', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
            return (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, border: `1px solid ${C.border}`, borderRadius: 8, padding: '6px 10px' }}>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>{quando} · {s.n} personagg{s.n === 1 ? 'io' : 'i'}</div>
                  <div style={{ ...styles.detail, fontSize: 11, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{nomi}</div>
                </div>
                <button
                  style={{ ...styles.buttonMini, borderColor: C.gold, color: C.goldDark, flexShrink: 0 }}
                  onClick={() => setConferma({
                    titolo: tr('Ripristinare questa versione?', 'Restore this version?'),
                    testo: tr(`Sostituirai i personaggi attuali con la versione del ${quando}. Lo stato di adesso verrà salvato tra le versioni, così puoi tornare indietro.`, `Your current characters will be replaced with the version from ${quando}. The current state is saved among the versions, so you can go back.`),
                    onConferma: () => ripristinaSnapshot(s),
                  })}
                >Ripristina</button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

}
