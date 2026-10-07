// Estratto da App.jsx (finestra "MenuPersonaggiModal"): riceve dall'App lo stato che usa, tutto il resto è importato.
import { useState } from 'react';
import { styles } from '../stili.js';
import { C } from '../tema.js';
import { t } from '../../i18n';
import { URL_ARCHIVIO_PG } from '../../utils/ambiente.js';
import { CHIAVE_AVVIO_DIRETTO } from '../../utils/avvio.js';

export function MenuPersonaggiModal({ APP_VERSION, apriNotifiche, erroreImport, esportaBackupCompleto, generaPgCasuale, idDispositivo, isCloudAttivo, jsonRef, leggiSnapshots, lingua, manualiAttivi, mostraListaCarica, novitaNonLette, roster, scheda, setBozzaCrea, setCloudStatus, setConferma, setLingua, setMostraArchivioDm, setMostraCloud, setMostraCrea, setMostraDonazioni, setMostraListaCarica, setMostraMenu, setMostraMenuEsporta, setMostraModalManuali, setMostraNoteLegali, setMostraRipristino, setPosEsporta, setRoster, setSchedaSolaLettura, setTemaCornici, statoBgCloud, statoColoreCloud, statoGlowCloud, temaCornici }) {
  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 1000, padding: 16,
        background: 'rgba(0,0,0,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
      onClick={(e) => { if (e.target === e.currentTarget) setMostraMenu(false); }}
    >
      <div style={{ ...styles.panel, maxWidth: 460, width: '100%', maxHeight: '85vh', overflowY: 'auto' }}>
        <h1 style={{ ...styles.title, textAlign: 'center', marginBottom: 12, fontSize: 24, fontWeight: 800, color: 'var(--c-title)' }}>
          Tavolo dei Dadi <span style={{ fontSize: 11, opacity: 0.65, fontWeight: 600, verticalAlign: 'middle', color: C.inkDim }}>v{APP_VERSION}</span>
        </h1>
    
        <button
          style={{ ...styles.buttonPrimary, width: '100%', marginBottom: 10 }}
          onClick={() => { setBozzaCrea({ nome: '', sesso: '', classe: '', sottoclasse: '', specie: '', background: '', livello: 1, metodo: 'auto', pool: null, assegna: {}, competenzeClasse: [], competenzeSpecie: [], maestria: [], talentoOrigine: '', asiTalenti: {}, multiclasseClasse2: '', multiclasseLivello2: 1, sottoclasseMc2: '', multiclasseClasse3: '', multiclasseLivello3: 1, sottoclasseMc3: '', dotazione: 'pacchetto' }); setMostraCrea(true); }}
        >
          {t('menu.nuovo_personaggio')}
        </button>
        <button
          style={{ ...styles.button, width: '100%', marginBottom: 8 }}
          onClick={() => setMostraListaCarica((v) => !v)}
        >
          {t('menu.carica_personaggio')} {mostraListaCarica ? '▴' : '▾'} ({Object.keys(roster.personaggi).length})
        </button>
        {mostraListaCarica && (
          <>
            <div id="lista-carica-pg" style={{ ...styles.detail, marginBottom: 6, fontWeight: 'bold' }}>{t('menu.carica_personaggio')}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 8 }}>
              {Object.entries(roster.personaggi).map(([id, p]) => (
                <div key={id} style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  <button
                    style={{ ...styles.button, flex: 1, display: 'flex', justifyContent: 'space-between', gap: 10, textAlign: 'left' }}
                    onClick={() => { setSchedaSolaLettura(null); setRoster((r) => ({ ...r, attivo: id })); setMostraMenu(false); }}
                  >
                    <span>{p.nome || t('menu.senza_nome')}</span>
                    <span style={styles.detail}>{p.classe ? `${p.classe}` : '—'}</span>
                  </button>
                  <button
                    style={{ ...styles.buttonDanger, padding: '4px 10px', fontSize: 13, flexShrink: 0 }}
                    title={t('menu.elimina_tooltip', { nome: p.nome || t('menu.senza_nome') })}
                    aria-label={t('menu.elimina_tooltip', { nome: p.nome || t('menu.senza_nome') })}
                    onClick={() => setConferma({
                      titolo: t('menu.elimina_titolo'),
                      testo: `Vuoi eliminare davvero "${p.nome || t('menu.senza_nome')}"? L'azione è irreversibile.`,
                      onConferma: () => {
                        if (URL_ARCHIVIO_PG) {
                          fetch(`${URL_ARCHIVIO_PG.replace(/\/+$/, '')}/pg`, {
                            method: 'DELETE',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ dispositivo: idDispositivo, id }),
                            keepalive: true,
                          }).catch(() => {});
                        }
                        setRoster((r) => {
                          const nuovi = { ...r.personaggi };
                          delete nuovi[id];
                          const nuovoAttivo = r.attivo === id ? (Object.keys(nuovi)[0] ?? '') : r.attivo;
                          if (Object.keys(nuovi).length === 0) setTimeout(() => setMostraMenu(true), 0);
                          return { personaggi: nuovi, attivo: nuovoAttivo };
                        });
                      },
                    })}
                  >
                    🗑️
                  </button>
                </div>
              ))}
              {Object.keys(roster.personaggi).length === 0 && (
                <span style={styles.detail}>{t('menu.nessun_personaggio')}</span>
              )}
            </div>
          </>
        )}
        <button style={{ ...styles.button, width: '100%', marginBottom: 8 }} onClick={() => generaPgCasuale()} title={t('menu.pg_casuale_tooltip')}>{t('menu.pg_casuale')}</button>
        <button
          style={{ ...styles.button, width: '100%', marginBottom: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontWeight: 700, color: C.goldDark, borderColor: C.goldDark }}
          onClick={() => { setMostraModalManuali(true); }}
        >
          
          <span>{lingua === 'it' ? `Manuali e fonti (${Object.values(manualiAttivi).filter(Boolean).length} attivi)` : `Sourcebooks (${Object.values(manualiAttivi).filter(Boolean).length} active)`}</span>
        </button>
    
        {/* Specchio tasti header globali nello stesso identico ordine, con le stesse etichette e icone */}
        <div style={{ marginTop: 14, paddingTop: 12, borderTop: `1px solid ${C.border}` }}>
          <div style={{ ...styles.detail, marginBottom: 8, fontWeight: 700 }}>{lingua === 'en' ? 'Quick actions' : 'Azioni rapide'}</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 8 }}>
            <button
              style={{ ...styles.button, width: '100%', minHeight: 38, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
              onClick={() => { setMostraMenu(false); setTimeout(() => apriNotifiche(), 50); }}
              title={t('notifiche.titolo')}
            >
              <span>{t('notifiche.titolo_breve')}{novitaNonLette ? ' (!)' : ''}</span>
            </button>
            <button
              style={{ ...styles.button, width: '100%', minHeight: 38, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
              onClick={() => setLingua((l) => (l === 'it' ? 'en' : 'it'))}
              title={t('tooltip.lingua')}
            >
              <span>{t('common.lingua')}</span>
            </button>
            <button
              style={{ ...styles.button, width: '100%', minHeight: 38, gridColumn: 'span 2', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
              onClick={() => {
                setMostraMenu(false);
                setTimeout(() => {
                  setPosEsporta({ top: 80, left: Math.max(16, (window.innerWidth - 320) / 2) });
                  setMostraMenuEsporta(true);
                }, 50);
              }}
              title={t('import_export.tip')}
            >
              <span>{t('import_export.btn')}</span>
            </button>
            <button
              style={{
                ...styles.button,
                width: '100%',
                minHeight: 38,
                gridColumn: 'span 2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                border: `1.5px solid ${statoColoreCloud}`,
                background: statoBgCloud,
                color: statoColoreCloud,
                fontWeight: 700,
                boxShadow: statoGlowCloud,
                transition: 'all 0.25s ease',
              }}
              onClick={() => { setMostraMenu(false); setTimeout(() => { setCloudStatus({ text: '', type: '' }); setMostraCloud(true); }, 50); }}
              title={isCloudAttivo ? (lingua === 'en' ? 'Sync is on' : 'Sincronizzazione attiva') : (lingua === 'en' ? 'Sync is off' : 'Sincronizzazione non attiva')}
            >
              
              <span>{lingua === 'en' ? 'Backup & sync' : 'Backup e sincronizzazione'}</span>
            </button>
            <div style={{ gridColumn: 'span 2', marginTop: 4 }}>
              <div style={{ fontSize: 11, color: C.inkDim, marginBottom: 4, fontWeight: 600 }}>
                {lingua === 'en' ? 'Section frames' : 'Cornici delle sezioni'}
              </div>
              <select
                value={temaCornici}
                onChange={(e) => setTemaCornici(e.target.value)}
                style={{ ...styles.inlineInput, width: '100%', height: 32, padding: '4px 8px', borderRadius: 6, background: C.panel, color: C.ink, fontSize: 12, border: `1px solid ${C.border}` }}
                title={lingua === 'en' ? 'Choose the style of the section frames' : 'Scegli lo stile delle cornici delle sezioni'}
              >
                <option value="auto">{lingua === 'en' ? `Automatic (character class: ${scheda.classe || 'default'})` : `Automatiche (classe del personaggio: ${scheda.classe || 'predefinita'})`}</option>
                <option value="druido">Druido (rami e foglie)</option>
                <option value="mago">Mago (rune arcane e stelle)</option>
                <option value="guerriero">Guerriero (piastre rivettate)</option>
                <option value="ladro">Ladro (lame e ombre)</option>
                <option value="chierico">Chierico (reliquiario e luce)</option>
                <option value="paladino">Paladino (scudo araldico)</option>
                <option value="bardo">Bardo (volute barocche e note)</option>
                <option value="barbaro">Barbaro (artigli e zanne)</option>
                <option value="ranger">Ranger (frecce e nodi silvestri)</option>
                <option value="stregone">Stregone (energia arcana e fulmini)</option>
                <option value="warlock">Warlock (spirali occulte e occhi)</option>
                <option value="monaco">Monaco (cerchio zen e giada)</option>
                <option value="artefice">Artefice (ingranaggi e ottone)</option>
                <option value="disattivato">{lingua === 'en' ? 'No frames' : 'Nessuna cornice'}</option>
              </select>
            </div>
          </div>
        </div>
    
        <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${C.border}` }}>
          <div style={{ ...styles.detail, marginBottom: 8, fontWeight: 700 }}>{t('menu.sezione_backup')}</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 8 }}>
            <button style={{ ...styles.button, width: '100%', minHeight: 38, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }} onClick={() => jsonRef.current?.click()} title={t('menu.ripristina_tip')}>
              <span>{t('menu.ripristina')}</span>
            </button>
            <button style={{ ...styles.button, width: '100%', minHeight: 38, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }} onClick={esportaBackupCompleto} title={t('menu.esporta_tutto_tip')}>
              <span>{t('menu.esporta_tutto')}</span>
            </button>
            {leggiSnapshots().length > 0 && (
              <button style={{ ...styles.button, width: '100%', minHeight: 38, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }} onClick={() => setMostraRipristino(true)}>
                <span>{t('menu.versioni')}</span>
              </button>
            )}
            {URL_ARCHIVIO_PG && (
              <button
                style={{ ...styles.button, width: '100%', minHeight: 38, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
                onClick={() => { setMostraArchivioDm(true); }}
                title={t('menu.archivio_dm_tip')}
              >
                <span>{t('menu.archivio_dm')}</span>
              </button>
            )}
          </div>
        </div>
    
        <OpzioneAvvio lingua={lingua} />

        <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${C.border}` }}>
          <div style={{ ...styles.detail, marginBottom: 8, fontWeight: 700 }}>{t('menu.sezione_info')}</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 8 }}>
            <button
              style={{ ...styles.button, width: '100%', height: 38, minHeight: 38, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '0 6px', fontSize: 13, boxSizing: 'border-box' }}
              onClick={() => { setMostraMenu(false); setMostraNoteLegali(true); }}
              title={t('legali.titolo')}
            >
              <span>{t('menu.note_legali')}</span>
            </button>
            <button
              style={{ ...styles.button, width: '100%', height: 38, minHeight: 38, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '0 6px', fontSize: 13, boxSizing: 'border-box' }}
              onClick={() => { setMostraMenu(false); setMostraDonazioni(true); }}
              title={t('donazioni.titolo')}
            >
              <span>{t('menu.sostieni')}</span>
            </button>
            <a
              href="https://github.com/samuelenigro97-prog/Tavolo-Dei-Dadi"
              target="_blank"
              rel="noopener noreferrer"
              style={{ ...styles.button, textDecoration: 'none', width: '100%', height: 38, minHeight: 38, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '0 6px', fontSize: 13, boxSizing: 'border-box' }}
              title={t('menu.github_tip')}
            >
              <span>{t('menu.github')}</span>
            </a>
          </div>
        </div>
    
        <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${C.border}`, display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: 11, color: C.muted }}>
          <a
            href="https://dnd.wizards.com/resources/systems-reference-document"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'inherit', textDecoration: 'underline' }}
          >
            {t('menu.footer_licenza')}
          </a>
        </div>
        {erroreImport && <div style={{ color: C.red, marginTop: 10 }}>{erroreImport}</div>}
      </div>
    </div>
  );
}

/** Scelta di avvio: di base si apre questo menu (per scegliere il personaggio); in alternativa l'ultima scheda. */
function OpzioneAvvio({ lingua }) {
  const [diretto, setDiretto] = useState(() => {
    try { return localStorage.getItem(CHIAVE_AVVIO_DIRETTO) === '1'; } catch { return false; }
  });
  const cambia = (e) => {
    const v = e.target.checked;
    setDiretto(v);
    try { if (v) localStorage.setItem(CHIAVE_AVVIO_DIRETTO, '1'); else localStorage.removeItem(CHIAVE_AVVIO_DIRETTO); } catch { /* niente */ }
  };
  return (
    <label data-testid="avvio-diretto" style={{ ...styles.detail, display: 'flex', alignItems: 'center', gap: 8, marginTop: 12, cursor: 'pointer' }}>
      <input type="checkbox" checked={diretto} onChange={cambia} />
      <span>{lingua === 'en' ? 'Open the last character straight away at start-up (otherwise this menu opens, to pick the character)' : 'All\'avvio apri subito l\'ultima scheda (altrimenti si apre questo menu, per scegliere il personaggio)'}</span>
    </label>
  );
}
