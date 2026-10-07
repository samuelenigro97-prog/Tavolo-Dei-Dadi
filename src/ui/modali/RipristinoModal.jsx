// Estratto da App.jsx (finestra "RipristinoModal"): riceve dall'App lo stato che usa, tutto il resto è importato.
import { useState } from 'react';
import { styles } from '../stili.js';
import { C } from '../tema.js';
import { t, tr, linguaAttuale } from '../../i18n';
import { MOTIVI_SNAPSHOT, riassuntoPgSnapshot } from '../../utils/cronologia.js';

function quandoVersione(ts) {
  return new Date(ts).toLocaleString('it-IT', { weekday: 'short', day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
}

/**
 * Cronologia versioni: i punti di ripristino salvati su questo dispositivo e,
 * con un codice di sincronizzazione attivo, le copie online precedenti
 * conservate dal servizio. Ogni voce mostra PF e slot dei personaggi, così si
 * riconosce a colpo d'occhio la versione giusta.
 */
export function RipristinoModal({ leggiSnapshots, ripristinaSnapshot, setConferma, setMostraRipristino, caricaStoriaOnline }) {
  const snaps = leggiSnapshots();
  const en = linguaAttuale === 'en';
  const [online, setOnline] = useState({ stato: 'chiuso', voci: [] });

  const apriOnline = async () => {
    setOnline({ stato: 'carica', voci: [] });
    try { setOnline({ stato: 'ok', voci: await caricaStoriaOnline() }); }
    catch { setOnline({ stato: 'errore', voci: [] }); }
  };

  const voce = (s, i, daServer) => {
    const pgs = Object.values(s.roster?.personaggi || {});
    const quando = quandoVersione(s.ts);
    const motivo = MOTIVI_SNAPSHOT[s.motivo];
    return (
      <div key={`${daServer ? 'o' : 'l'}${i}`} data-testid={daServer ? 'versione-online' : 'versione-locale'} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, border: `1px solid ${C.border}`, borderRadius: 8, padding: '6px 10px' }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontWeight: 600, fontSize: 13 }}>{quando}{motivo ? <span style={{ ...styles.detail, fontWeight: 400, fontSize: 11 }}> · {en ? motivo.en : motivo.it}</span> : null}</div>
          {pgs.slice(0, 4).map((pg, j) => (
            <div key={j} style={{ ...styles.detail, fontSize: 11, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{riassuntoPgSnapshot(pg)}</div>
          ))}
          {pgs.length > 4 && <div style={{ ...styles.detail, fontSize: 11 }}>+{pgs.length - 4}</div>}
        </div>
        <button
          style={{ ...styles.buttonMini, borderColor: C.gold, color: C.goldDark, flexShrink: 0 }}
          onClick={() => setConferma({
            titolo: tr('Ripristinare questa versione?', 'Restore this version?'),
            testo: tr(`Sostituirai i personaggi attuali con la versione del ${quando}. Lo stato di adesso verrà salvato tra le versioni, così puoi tornare indietro.`, `Your current characters will be replaced with the version from ${quando}. The current state is saved among the versions, so you can go back.`),
            onConferma: () => ripristinaSnapshot(s),
          })}
        >{tr('Ripristina', 'Restore')}</button>
      </div>
    );
  };

  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 1005, padding: 16, background: 'rgba(0,0,0,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      onClick={(e) => { if (e.target === e.currentTarget) setMostraRipristino(false); }}
    >
      <div style={{ ...styles.panel, maxWidth: 460, width: '100%', maxHeight: '80vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <strong style={{ color: C.goldDark, fontSize: 16 }}>{tr('Versioni precedenti', 'Previous versions')}</strong>
          <button style={styles.buttonMini} onClick={() => setMostraRipristino(false)} title={t('tip.chiudi')} aria-label={t('tip.chiudi')}>✕</button>
        </div>
        <p style={{ ...styles.detail, marginTop: 0 }}>
          {tr('Ripristini automatici salvati su questo dispositivo (senza immagini): le ultime versioni, poi una all\'ora per due giorni e una al giorno per due settimane. Ripristinando, lo stato attuale viene comunque salvato.', 'Automatic restore points saved on this device (without images): the latest versions, then one per hour for two days and one per day for two weeks. Restoring still saves the current state first.')}
        </p>
        {snaps.length === 0 && <p style={styles.detail}>{tr('Nessuna versione salvata.', 'No saved versions.')}</p>}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {snaps.map((s, i) => voce(s, i, false))}
        </div>
        {caricaStoriaOnline && (
          <div style={{ marginTop: 12 }}>
            <strong style={{ color: C.goldDark, fontSize: 14 }}>{tr('Copie online precedenti', 'Previous online copies')}</strong>
            <p style={{ ...styles.detail, margin: '4px 0 6px' }}>
              {tr('Il servizio di sincronizzazione conserva le versioni del tuo codice (una ogni 15 minuti di gioco, poi meno fitte, fino a due settimane).', 'The sync service keeps the versions of your code (one every 15 minutes of play, then sparser, up to two weeks).')}
            </p>
            {online.stato === 'chiuso' && (
              <button type="button" data-testid="carica-storia-online" style={{ ...styles.buttonMini, width: '100%', padding: '5px 8px' }} onClick={apriOnline}>
                {tr('Mostra le copie online', 'Show the online copies')}
              </button>
            )}
            {online.stato === 'carica' && <p style={styles.detail}>{tr('Caricamento…', 'Loading…')}</p>}
            {online.stato === 'errore' && <p style={styles.detail}>{tr('Copie online non raggiungibili: riprova più tardi.', 'Online copies unreachable: try again later.')}</p>}
            {online.stato === 'ok' && online.voci.length === 0 && <p style={styles.detail}>{tr('Ancora nessuna copia online precedente.', 'No previous online copies yet.')}</p>}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {online.voci.map((s, i) => voce(s, i, true))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
