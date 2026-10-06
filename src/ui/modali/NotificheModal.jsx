// Estratto da App.jsx (finestra "NotificheModal"): riceve dall'App lo stato che usa, tutto il resto è importato.
import { C } from '../tema.js';
import { t, tr } from '../../i18n';
import { styles } from '../stili.js';
import { novitaRecenti } from '../../data/novita.js';

export function NotificheModal({ APP_VERSION, aggiorna, avvisoBackup, controlliAttivi, correggiTuttiControlli, eseguiCorrezione, esportaBackupCompleto, lingua, nuvolettaCorrezioni, posNotifiche, rimandaBackup, scheda, setMostraNotifiche, setNuvolettaCorrezioni }) {
  return (
    <div onClick={() => setMostraNotifiche(false)} style={{ position: 'fixed', inset: 0, zIndex: 1400, background: 'transparent' }}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="no-stampa"
        style={{
          position: 'fixed', top: posNotifiche.top, left: posNotifiche.left,
          width: 'min(340px, calc(100vw - 16px))', maxHeight: 'min(75vh, 600px)', overflowY: 'auto',
          background: C.panel, border: `1px solid ${C.gold}`, borderRadius: 10,
          boxShadow: '0 10px 30px rgba(0,0,0,0.45)', padding: '12px 14px', zIndex: 1401,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <strong style={{ color: C.goldDark, fontSize: 15, marginRight: 'auto' }}>{t('notifiche.titolo')}</strong>
          <button style={{ ...styles.buttonMini, padding: '2px 7px' }} onClick={() => setMostraNotifiche(false)} title={t('tip.chiudi')} aria-label={t('tip.chiudi')}>✕</button>
        </div>
    
        {/* SEZIONE 1: CONTROLLO E REGOLE DELLA SCHEDA */}
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.goldDark, letterSpacing: 0.5, marginBottom: 6 }}>
            {t('notifiche.sezione_scheda')}
          </div>
    
          {/* Nuvoletta feedback differenze applicate */}
          {nuvolettaCorrezioni && (
            <div style={{
              marginBottom: 10,
              padding: '9px 11px',
              background: 'color-mix(in srgb, var(--c-panel) 84%, #2e9d4d)',
              border: '1.5px solid var(--c-green)',
              borderRadius: 8,
              boxShadow: '0 3px 12px rgba(46,157,77,0.25)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6, marginBottom: 6 }}>
                <strong style={{ fontSize: 12, color: C.green, display: 'flex', alignItems: 'center', gap: 5 }}>
                  {nuvolettaCorrezioni.titolo}
                </strong>
                <button
                  style={{ ...styles.buttonMini, padding: '1px 6px', fontSize: 11, lineHeight: 1 }}
                  onClick={() => setNuvolettaCorrezioni(null)}
                  title={lingua === 'en' ? 'Close' : 'Chiudi'}
                  aria-label={lingua === 'en' ? 'Close' : 'Chiudi'}
                >✕</button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                {nuvolettaCorrezioni.voci.map((v, idx) => (
                  <div key={idx} style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 6, padding: '6px 8px', fontSize: 11 }}>
                    <div style={{ fontWeight: 700, color: C.ink, marginBottom: 3, display: 'flex', alignItems: 'center', gap: 4 }}>
                      <span>{v.icona}</span>
                      <span>{v.campo}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, flexWrap: 'wrap' }}>
                      <span style={{ textDecoration: 'line-through', opacity: 0.8, color: C.red }}>{v.prima}</span>
                      <span style={{ color: C.green, fontWeight: 800 }}>➔</span>
                      <span style={{ color: C.green, fontWeight: 700 }}>{v.dopo}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
    
          {scheda ? (
            <>
              {/* Nessuna incongruenza attiva: scheda in regola */}
              {controlliAttivi.length === 0 && (
                <div style={{ border: `1px solid var(--c-green)`, borderRadius: 8, padding: '8px 10px', background: 'rgba(46, 157, 77, 0.12)' }}>
                  <div style={{ fontSize: 12, color: C.ink, display: 'flex', alignItems: 'flex-start', gap: 6, lineHeight: 1.4 }}>
                    <span>{t('notifiche.scheda_ok')}</span>
                  </div>
                  {(scheda.controlliIgnorati || []).length > 0 && (
                    <div style={{ marginTop: 6, paddingTop: 6, borderTop: `1px solid rgba(46, 157, 77, 0.25)`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6 }}>
                      <span style={{ ...styles.detail, fontSize: 11 }}>{t('notifiche.controlli_ignorati', { n: scheda.controlliIgnorati.length })}</span>
                      <button
                        style={{ ...styles.buttonMini, fontSize: 11, padding: '2px 5px' }}
                        onClick={() => aggiorna({ controlliIgnorati: [] })}
                      >
                        {t('notifiche.mostra_ignorati')}
                      </button>
                    </div>
                  )}
                </div>
              )}
    
              {/* Elenco incongruenze e verifiche attive */}
              {controlliAttivi.length > 0 && (() => {
                const certi = controlliAttivi.filter((r) => r.gravita === 'certo').length;
                const ignorati = scheda.controlliIgnorati || [];
                const haCorreggibili = controlliAttivi.some((r) => r.correggibile && r.tipo !== 'vai_a_sezione');
                return (
                  <div style={{ border: `1px solid ${certi ? C.red : C.gold}`, borderRadius: 8, padding: '8px 10px', background: certi ? 'color-mix(in srgb, var(--c-panel) 88%, #c83c3c)' : 'color-mix(in srgb, var(--c-panel) 88%, #c88c14)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6, marginBottom: 6 }}>
                      <div style={{ fontSize: 13, color: C.ink, fontWeight: 700 }}>
                        {lingua === 'en' ? 'Things to check' : 'Cose da verificare'}
                      </div>
                      {haCorreggibili && (
                        <button
                          style={{ ...styles.buttonMini, fontSize: 11, padding: '3px 7px', background: '#2e9d4d', color: '#fff', borderColor: '#2e9d4d', fontWeight: 700, boxShadow: '0 2px 5px rgba(46,157,77,0.35)' }}
                          onClick={correggiTuttiControlli}
                          title={lingua === 'en' ? 'Apply all fixes with one click' : 'Applica tutte le correzioni con un click'}
                        >
                          {lingua === 'en' ? 'Fix all' : 'Correggi tutto'}
                        </button>
                      )}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {controlliAttivi.map((r) => (
                        <div key={r.id} style={{ display: 'flex', flexDirection: 'column', gap: 5, background: C.panel, border: `1px solid ${C.border}`, borderRadius: 6, padding: '7px 9px' }}>
                          <div style={{ fontSize: 12, color: C.ink, lineHeight: 1.4 }}>
                            {r.gravita === 'certo' ? '🔴' : '🟡'} {r.testo}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 6, marginTop: 2, paddingTop: 4, borderTop: `1px solid ${C.border}`, opacity: 0.95 }}>
                            {r.correggibile && (
                              <button
                                style={{
                                  ...styles.buttonMini,
                                  fontSize: 11,
                                  padding: '2px 8px',
                                  background: r.tipo === 'vai_a_sezione' ? '#8b5cf6' : (r.tipo === 'rimuovi_abilita' ? '#d97706' : '#2e9d4d'),
                                  color: '#fff',
                                  borderColor: r.tipo === 'vai_a_sezione' ? '#8b5cf6' : (r.tipo === 'rimuovi_abilita' ? '#d97706' : C.green),
                                  fontWeight: 700,
                                  boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                                }}
                                title={
                                  r.tipo === 'vai_a_sezione'
                                    ? (lingua === 'en' ? `Go to ${r.sezione || 'section'}` : `Vai alla sezione ${r.sezione === 'incantesimi' ? 'Magia' : (r.sezione === 'addestramento' ? 'Addestramento' : 'Sezione')}`)
                                    : (r.tipo === 'rimuovi_abilita' ? (lingua === 'en' ? 'Remove extra skill' : 'Rimuovi competenza extra') : (lingua === 'en' ? 'Apply fix' : 'Applica correzione'))
                                }
                                onClick={() => eseguiCorrezione(r)}
                              >
                                {r.tipo === 'vai_a_sezione'
                                  ? `${lingua === 'en' ? 'Go to Section' : 'Vai a ' + (r.sezione === 'incantesimi' ? 'Magia' : (r.sezione === 'addestramento' ? 'Addestramento' : 'Sezione'))}`
                                  : `${lingua === 'en' ? 'Fix' : 'Correggi'}`}
                              </button>
                            )}
                            <button
                              style={{ ...styles.buttonMini, fontSize: 11, padding: '2px 8px' }}
                              title={lingua === 'en' ? 'Do not show this again for this character' : 'Non segnalarlo più per questo personaggio'}
                              onClick={() => aggiorna({ controlliIgnorati: [...ignorati, r.id] })}
                            >
                              {lingua === 'en' ? 'Ignore' : 'Ignora'}
                            </button>
                          </div>
                        </div>
                      ))}
                      {ignorati.length > 0 && (
                        <button
                          style={{ ...styles.buttonMini, fontSize: 11, alignSelf: 'flex-start', marginTop: 3 }}
                          onClick={() => aggiorna({ controlliIgnorati: [] })}
                        >↺ {lingua === 'en' ? `Show ${ignorati.length} ignored` : `Mostra anche i ${ignorati.length} ignorati`}</button>
                      )}
                    </div>
                  </div>
                );
              })()}
            </>
          ) : (
            <div style={{ ...styles.detail, padding: '8px', textAlign: 'center', background: C.panelLight, borderRadius: 6 }}>
              {t('notifiche.nessuna_scheda')}
            </div>
          )}
        </div>
    
        {/* SEZIONE 2: PROMEMORIA BACKUP */}
        {avvisoBackup && (
          <div style={{ border: `1px solid ${C.gold}`, borderRadius: 8, padding: '8px 10px', marginBottom: 12, background: 'color-mix(in srgb, var(--c-panel) 88%, #c88c14)' }}>
            <div style={{ fontSize: 12, color: C.ink, marginBottom: 6 }}>
              <strong>{tr('Fai un backup dei tuoi personaggi.', 'Back up your characters.')}</strong>{' '}
              {tr('I dati sono salvati solo su questo dispositivo: un backup ti protegge se cambi telefono o svuoti la cache.', 'Your data is stored only on this device: a backup protects you if you change phone or clear the cache.')}
            </div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              <button style={{ ...styles.buttonPrimary, fontSize: 11, padding: '4px 10px' }} onClick={esportaBackupCompleto}>
                {tr('Scarica backup', 'Download backup')}
              </button>
              <button
                style={{ ...styles.buttonMini, fontSize: 11 }}
                onClick={rimandaBackup}
                title={tr('Ricordamelo tra qualche giorno', 'Remind me in a few days')}
              >{tr('Più tardi', 'Later')}</button>
            </div>
          </div>
        )}
    
        {/* SEZIONE 3: NOVITÀ DELL'APPLICAZIONE */}
        <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 10, marginBottom: 10 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.goldDark, letterSpacing: 0.5, marginBottom: 6 }}>
            {t('notifiche.sezione_novita')}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {novitaRecenti(3).map((n) => (
              <div key={n.versione} style={{ background: C.panelLight, border: `1px solid ${C.border}`, borderRadius: 6, padding: '6px 8px' }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: C.goldDark, marginBottom: 3 }}>
                  v{n.versione}{n.versione === APP_VERSION ? (lingua === 'en' ? ' · Current Version' : ' · Versione Attuale') : ''}
                </div>
                <ul style={{ margin: 0, paddingLeft: 16 }}>
                  {(lingua === 'en' ? n.voci.en : n.voci.it).map((v, i) => (
                    <li key={i} style={{ fontSize: 12, color: C.ink, lineHeight: 1.4 }}>{v}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
    
        {/* SEZIONE 4: RICARICA / AGGIORNAMENTO PWA */}
        <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 8 }}>
          <button
            style={{ ...styles.button, width: '100%', fontSize: 12, padding: '6px 10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
            onClick={() => {
              if ('serviceWorker' in navigator) {
                navigator.serviceWorker.getRegistrations().then((regs) => {
                  for (const r of regs) r.update();
                });
              }
              window.location.reload();
            }}
            title={t('aggiorna.ricarica_desc')}
          >
            <span>{t('aggiorna.ricarica_app')}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
