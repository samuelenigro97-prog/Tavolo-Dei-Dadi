// Estratto da App.jsx (finestra "CloudModal"): riceve dall'App lo stato che usa, tutto il resto è importato.
import { t, tr } from '../../i18n';
import { C } from '../tema.js';
import { styles } from '../stili.js';
import { normalizzaCodiceSync, formattaCodiceSync } from '../../utils/sync.js';

export function CloudModal({ autoSyncCodice, codiceSync, codiceSyncInput, conflittoSync, disattivaSyncCodice, esportaBackupCompleto, isCloudAttivo, isCloudConfigurato, lingua, ripristinaArchivioLocale, ripristinaArchivioRef, roster, setCodiceSyncInput, setConflittoSync, setMostraCloud, setSyncCodiceStatus, setTabBackup, sincronizzando, statoBgCloud, statoColoreCloud, statoGlowCloud, syncCodiceStatus, tabBackup, ultimoSyncCodice, usaCodiceSyncEsistente, creaCodiceSync, riattivaCodiceSync }) {
  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 1002, padding: 16,
        background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
      onClick={(e) => { if (e.target === e.currentTarget) setMostraCloud(false); }}
    >
      <div style={{ ...styles.panel, maxWidth: 460, width: '100%', maxHeight: '85vh', overflowY: 'auto' }}>
        <h1 style={{ ...styles.title, textAlign: 'center', marginBottom: 12 }}>{t('cloud.backup_titolo')}</h1>
        {conflittoSync && !conflittoSync.aperto && (
          <div role="status" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, padding: '8px 12px', marginBottom: 12, borderRadius: 8, border: '1px solid #f59e0b', background: 'rgba(245,158,11,0.12)', fontSize: 13 }}>
            <span>{t('conflitto.banner')}</span>
            <button type="button" style={{ ...styles.buttonMini, whiteSpace: 'nowrap' }} onClick={() => setConflittoSync((c) => (c ? { ...c, aperto: true } : c))}>{t('conflitto.risolvi')}</button>
          </div>
        )}

        {/* Selettore Modalità: Locale vs Online */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginBottom: 14, background: 'rgba(0,0,0,0.06)', padding: 3, borderRadius: 8 }}>
          <button
            type="button"
            style={{
              ...styles.button,
              border: 'none',
              background: tabBackup === 'locale' ? C.panel : 'transparent',
              color: tabBackup === 'locale' ? C.goldDark : C.inkDim,
              fontWeight: tabBackup === 'locale' ? 700 : 500,
              boxShadow: tabBackup === 'locale' ? '0 1px 4px rgba(0,0,0,0.15)' : 'none',
              borderRadius: 6,
              padding: '8px 12px',
              fontSize: 13,
            }}
            onClick={() => { setTabBackup('locale'); setSyncCodiceStatus({ text: '', type: '' }); }}
          >
            {tr('Su questo dispositivo', 'On this device')}
          </button>
          <button
            type="button"
            style={{
              ...styles.button,
              border: 'none',
              background: tabBackup === 'online' ? C.panel : 'transparent',
              color: tabBackup === 'online' ? C.goldDark : C.inkDim,
              fontWeight: tabBackup === 'online' ? 700 : 500,
              boxShadow: tabBackup === 'online' ? '0 1px 4px rgba(0,0,0,0.15)' : 'none',
              borderRadius: 6,
              padding: '8px 12px',
              fontSize: 13,
            }}
            onClick={() => { setTabBackup('online'); setSyncCodiceStatus({ text: '', type: '' }); }}
          >
            Online
          </button>
        </div>

        {tabBackup === 'locale' ? (
          <div style={{ padding: 12, borderRadius: 8, background: 'rgba(0,0,0,0.04)', border: `1px solid ${C.border}`, marginBottom: 16 }}>
            <div style={{ ...styles.detail, fontWeight: 'bold', fontSize: 13, marginBottom: 4, color: C.ink }}>
              Backup su file
            </div>
            <p style={{ ...styles.detail, fontSize: 12, marginTop: 0, marginBottom: 12, lineHeight: 1.5 }}>
              {tr('Esporta in un unico file JSON tutti i personaggi salvati su questo dispositivo, oppure ripristina un backup precedente.', 'Export every character saved on this device into a single JSON file, or restore an earlier backup.')}
            </p>

            <div style={{ background: 'rgba(201,162,39,0.08)', border: `1px solid ${C.border}`, borderRadius: 8, padding: '8px 10px', marginBottom: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 12, color: C.ink, fontWeight: 600 }}>
                {tr('Personaggi salvati:', 'Saved characters:')}
              </span>
              <strong style={{ color: C.goldDark, fontSize: 14 }}>
                {Object.keys(roster.personaggi || {}).length}
              </strong>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <button
                type="button"
                style={{ ...styles.buttonPrimary, width: '100%', padding: '9px 12px', fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
                onClick={esportaBackupCompleto}
              >
                {tr('Esporta backup (JSON)', 'Export backup (JSON)')}
              </button>

              <button
                type="button"
                style={{ ...styles.button, width: '100%', padding: '9px 12px', fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
                onClick={() => ripristinaArchivioRef.current?.click()}
              >
                Ripristina backup…
              </button>
              <input
                ref={ripristinaArchivioRef}
                type="file"
                accept=".json,application/json"
                style={{ display: 'none' }}
                onChange={ripristinaArchivioLocale}
              />
            </div>
          </div>
        ) : (
          <div style={{
            padding: 12,
            borderRadius: 8,
            background: statoBgCloud,
            border: `1.5px solid ${statoColoreCloud}`,
            boxShadow: statoGlowCloud,
            marginBottom: 16,
            transition: 'all 0.3s ease',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <div style={{ ...styles.detail, fontWeight: 'bold', color: C.ink }}>{t('cloud.sync_codice_titolo')}</div>
              <span style={{
                fontSize: 11,
                fontWeight: 700,
                color: '#fff',
                background: statoColoreCloud,
                padding: '2px 8px',
                borderRadius: 6,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
              }}>
                {sincronizzando ? tr('Sincronizzazione…', 'Syncing…') : conflittoSync ? tr('In pausa', 'Paused') : isCloudAttivo ? tr('Attiva', 'On') : isCloudConfigurato ? tr('In attesa', 'Waiting') : tr('Non attiva', 'Off')}
              </span>
            </div>
            {codiceSync && autoSyncCodice ? (
              <>
                <p style={{ ...styles.detail, fontSize: 12, marginTop: 0, marginBottom: 8, lineHeight: 1.5 }}>
                  {t('cloud.sync_codice_info')}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <div style={{ color: C.goldDark, fontSize: 20, fontWeight: 800, letterSpacing: 2, fontFamily: 'monospace' }}>{formattaCodiceSync(codiceSync)}</div>
                  <button style={styles.buttonMini} onClick={() => navigator.clipboard?.writeText(formattaCodiceSync(codiceSync))}>📋</button>
                </div>
                {ultimoSyncCodice && <div style={{ ...styles.detail, fontSize: 11, marginBottom: 8 }}>{lingua === 'en' ? 'Last sync:' : 'Ultimo salvataggio:'} {ultimoSyncCodice}</div>}
                <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                  <button style={{ ...styles.button, flex: 1 }} onClick={disattivaSyncCodice}>{t('cloud.disattiva')}</button>
                </div>
              </>
            ) : (
              <>
                <p style={{ ...styles.detail, fontSize: 12, marginTop: 0, marginBottom: 8, lineHeight: 1.5 }}>
                  {t('cloud.crea_desc')}
                </p>
                {codiceSync && !autoSyncCodice && (
                  <button
                    type="button"
                    data-testid="riattiva-codice-sync"
                    style={{ ...styles.button, width: '100%', marginBottom: 8 }}
                    onClick={riattivaCodiceSync}
                  >
                    {tr(`Riattiva il codice ${formattaCodiceSync(codiceSync)}`, `Turn code ${formattaCodiceSync(codiceSync)} back on`)}
                  </button>
                )}
                <div style={{ ...styles.detail, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>
                  {tr('1 · Sul dispositivo con la scheda giusta', '1 · On the device with the right sheet')}
                </div>
                <button
                  type="button"
                  data-testid="crea-codice-sync"
                  style={{ ...styles.buttonPrimary, width: '100%', marginBottom: 10 }}
                  disabled={sincronizzando}
                  onClick={creaCodiceSync}
                >
                  {tr('Crea un codice e salva online questi personaggi', 'Create a code and save these characters online')}
                </button>
                <div style={{ ...styles.detail, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>
                  {tr('2 · Sull\'altro dispositivo: inserisci lo stesso codice', '2 · On the other device: enter the same code')}
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <input
                    type="text"
                    style={{ ...styles.inlineInput, flex: 1, padding: '6px 8px', fontSize: 15, fontFamily: 'monospace', textTransform: 'uppercase' }}
                    placeholder="XXXXX-XXXXX"
                    value={formattaCodiceSync(codiceSyncInput)}
                    onChange={(e) => setCodiceSyncInput(normalizzaCodiceSync(e.target.value))}
                    onKeyDown={(e) => { if (e.key === 'Enter' && normalizzaCodiceSync(codiceSyncInput).length === 10) usaCodiceSyncEsistente(); }}
                  />
                  <button style={{ ...styles.buttonPrimary, disabled: normalizzaCodiceSync(codiceSyncInput).length !== 10 }} onClick={usaCodiceSyncEsistente}>{t('cloud.usa')}</button>
                </div>
              </>
            )}

            {syncCodiceStatus.text && (
              <div style={{ marginTop: 12, padding: 8, borderRadius: 6, background: syncCodiceStatus.type === 'error' ? 'rgba(255,0,0,0.1)' : syncCodiceStatus.type === 'success' ? 'rgba(0,255,0,0.1)' : 'rgba(255,255,255,0.05)', color: syncCodiceStatus.type === 'error' ? C.red : syncCodiceStatus.type === 'success' ? C.green : C.goldDark, fontSize: 12, textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                {syncCodiceStatus.type === 'success' ? <span className="cloud-spinner" style={{ width: 14, height: 14, border: `2px solid ${C.green}`, borderTopColor: 'transparent', borderRadius: '50%', display: 'inline-block' }} /> : null}
                <span>{syncCodiceStatus.text.replace('✅ ', '')}</span>
              </div>
            )}
          </div>
        )}

        <button style={{ ...styles.button, width: '100%' }} onClick={() => setMostraCloud(false)}>{t('modal.chiudi')}</button>
      </div>
    </div>
  );
}
