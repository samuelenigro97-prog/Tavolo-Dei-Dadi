// Estratto da App.jsx (finestra "MenuPersonaggiModal"): riceve dall'App lo stato che usa, tutto il resto è importato.
import { useState } from 'react';
import { styles } from '../stili.js';
import { C } from '../tema.js';
import { t } from '../../i18n';
import { URL_ARCHIVIO_PG } from '../../utils/ambiente.js';
import { IconaUI } from '../IconaFantasy.jsx';
import { MANUALI_INFO, manualeAttivo } from '../../data/dati5e.js';

/** Titoletti delle sezioni del menu: stesso stile delle etichette della barra (SISTEMA, SCHEDA, SESSIONE). */
// Tasti del menu in griglia: tutti alti uguali, testo su due righe se serve (mai tagliato),
// bordo del tema generico (lo stesso del pannello, della barra in alto e del combat tracker).
const bordoTema = '1.5px solid var(--c-tema-bordo)';
const tastoGriglia = {
  border: bordoTema, width: '100%', minHeight: 34, padding: '4px 8px', display: 'flex', alignItems: 'center', justifyContent: 'center',
  gap: 6, textAlign: 'center', lineHeight: 1.2, boxSizing: 'border-box',
};
const griglia2 = { display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 6 };
const etichettaSezione = {
  fontSize: 11, fontWeight: 700, letterSpacing: 0.6, textTransform: 'uppercase',
  color: 'color-mix(in srgb, var(--c-gold-dark) 60%, var(--c-ink))', fontFamily: 'var(--font-title)', userSelect: 'none', marginBottom: 6,
};

export function MenuPersonaggiModal({ APP_VERSION, stileTemaBase, coloreClassePg, apriNotifiche, erroreImport, esportaBackupCompleto, generaPgCasuale, idDispositivo, isCloudAttivo, jsonRef, leggiSnapshots, lingua, manualiAttivi, setManualiAttivi, mostraListaCarica, roster, scheda, setBozzaCrea, setCloudStatus, setConferma, setLingua, setMostraArchivioDm, setMostraCloud, setMostraCrea, setMostraDonazioni, setMostraListaCarica, setMostraMenu, setMostraMenuEsporta, setMostraModalManuali, setMostraNoteLegali, setMostraRipristino, setPosEsporta, setRoster, setSchedaSolaLettura, setTemaCornici, statoColoreCloud, statoGlowCloud, temaCornici }) {
  const [mostraListaManuali, setMostraListaManuali] = useState(false);
  // `attivo` viene salvato nel roster: è quindi anche l'ultimo personaggio effettivamente usato.
  const ultimoPersonaggio = roster?.personaggi?.[roster?.attivo] || scheda;
  const apriUltimoPersonaggio = () => {
    if (roster?.attivo && roster?.personaggi?.[roster.attivo]) {
      setRoster((r) => ({ ...r, attivo: r.attivo }));
    }
    setSchedaSolaLettura(null);
    setMostraMenu(false);
  };
  return (
    <div
      className="menu-iniziale-sfondo"
      style={{
        // Tema base del progetto, non quello del personaggio corrente.
        // Spazio in alto (in stili.js) per non finire sotto la barra fissa.
        ...stileTemaBase,
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(3px)', WebkitBackdropFilter: 'blur(3px)', display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
      onClick={(e) => { if (e.target === e.currentTarget) setMostraMenu(false); }}
    >
      {/* Il menu si stacca dalla scheda dietro: sfondo scurito e sfocato, pannello più chiaro (scuro) o più caldo (chiaro), bordo ben visibile. */}
      <div
        data-testid="menu-iniziale"
        className="menu-iniziale"
        style={{
          // Pensato per stare tutto nello schermo: niente barra di scorrimento (resta lo
          // scorrimento col dito solo se si apre una lista lunga di personaggi).
          ...styles.panel, maxWidth: 460, width: '100%', maxHeight: '100%', overflowY: 'auto', scrollbarWidth: 'none', marginBottom: 0,
          // Grigio e bordo del tema generico (gli stessi della barra in alto e del combat tracker).
          background: 'var(--c-tema-sfondo)',
          border: '1.5px solid var(--c-tema-bordo)',
          boxShadow: '0 14px 44px rgba(0,0,0,0.75), 0 0 0 1px rgba(0,0,0,0.45)',
        }}
      >
        <h1 style={{ ...styles.title, textAlign: 'center', marginBottom: 8, fontSize: 24, fontWeight: 800, color: 'var(--c-title)' }}>
          Tavolo dei Dadi<span className="app-version">v{APP_VERSION}</span>
        </h1>

        {ultimoPersonaggio && (
          <button
            type="button"
            data-testid="continua-ultimo-pg"
            aria-label={t('menu.continua_ultimo', { nome: ultimoPersonaggio.nome || t('menu.senza_nome') })}
            onClick={apriUltimoPersonaggio}
            style={{
              width: '100%', marginBottom: 8, padding: 8, borderRadius: 10, cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 10, textAlign: 'left', fontFamily: 'inherit',
              // Colori della classe del personaggio (--c-pg-*), non quelli base del menu.
              color: C.ink, background: 'color-mix(in srgb, var(--c-pg-gold, var(--c-gold)) 16%, var(--c-panel-light))',
              border: '1.5px solid var(--c-pg-gold, var(--c-gold))', boxShadow: '0 5px 16px color-mix(in srgb, var(--c-pg-gold, var(--c-gold)) 24%, transparent)',
            }}
          >
            <span style={{ width: 40, height: 40, flexShrink: 0, overflow: 'hidden', display: 'grid', placeItems: 'center', borderRadius: 8, border: '1px solid var(--c-pg-gold, var(--c-gold))', background: 'var(--c-panel)', color: 'var(--c-pg-title, var(--c-title))', fontSize: 22, fontWeight: 800 }}>
              {typeof ultimoPersonaggio.ritratto === 'string' && ultimoPersonaggio.ritratto ? (
                <img src={ultimoPersonaggio.ritratto} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (ultimoPersonaggio.nome || '?').trim().slice(0, 1).toUpperCase()}
            </span>
            <span style={{ minWidth: 0, display: 'flex', flex: 1, flexDirection: 'column', gap: 2 }}>
              <span style={{ ...etichettaSezione, color: 'var(--c-pg-gold-dark, var(--c-gold-dark))', marginBottom: 0, lineHeight: 1.1 }}>{t('menu.ultimo_usato')}</span>
              <strong style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: 16 }}>{ultimoPersonaggio.nome || t('menu.senza_nome')}</strong>
              <span style={{ color: C.inkDim, fontSize: 13 }}>{ultimoPersonaggio.classe || '—'} · {t('profilo.livello')} {ultimoPersonaggio.livello || 1}</span>
            </span>
            <span style={{ color: 'var(--c-pg-gold-dark, var(--c-gold-dark))', fontSize: 13, fontWeight: 700, whiteSpace: 'nowrap' }}>{t('menu.riprendi')}</span>
          </button>
        )}

        <button
          style={{ ...styles.buttonPrimary, width: '100%', marginBottom: 8 }}
          onClick={() => { setBozzaCrea({ nome: '', sesso: '', classe: '', sottoclasse: '', specie: '', background: '', livello: 1, metodo: 'auto', pool: null, assegna: {}, competenzeClasse: [], competenzeSpecie: [], maestria: [], talentoOrigine: '', asiTalenti: {}, multiclasseClasse2: '', multiclasseLivello2: 1, sottoclasseMc2: '', multiclasseClasse3: '', multiclasseLivello3: 1, sottoclasseMc3: '', dotazione: 'pacchetto' }); setMostraMenu(false); setMostraCrea(true); }}
        >
          {t('menu.nuovo_personaggio')}
        </button>
        <button
          style={{ ...styles.button, border: bordoTema, width: '100%', marginBottom: 8 }}
          onClick={() => setMostraListaCarica((v) => !v)}
        >
          {t('menu.carica_personaggio')} {mostraListaCarica ? '▴' : '▾'} ({Object.keys(roster.personaggi).length})
        </button>
        {mostraListaCarica && (
          <>
            <div id="lista-carica-pg" style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 8 }}>
              {Object.entries(roster.personaggi).map(([id, p]) => {
                // Ogni personaggio nel colore della sua classe: barra a sinistra, fondo appena tinto,
                // nome della classe leggibile (il colore si avvicina all'inchiostro del tema).
                const col = coloreClassePg?.(p.classe) || '';
                return (
                <div key={id} style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  <button
                    data-testid="menu-pg-riga"
                    data-colore-classe={col || undefined}
                    style={{
                      ...styles.button, flex: 1, display: 'flex', justifyContent: 'space-between', gap: 10, textAlign: 'left',
                      ...(col ? {
                        borderLeft: `5px solid ${col}`,
                        borderColor: `color-mix(in srgb, ${col} 55%, var(--c-border))`,
                        borderLeftColor: col,
                        background: `color-mix(in srgb, ${col} 12%, var(--c-panel-light))`,
                      } : {}),
                    }}
                    onClick={() => { setSchedaSolaLettura(null); setRoster((r) => ({ ...r, attivo: id })); setMostraMenu(false); }}
                  >
                    <span>{p.nome || t('menu.senza_nome')}</span>
                    <span style={{ ...styles.detail, ...(col ? { color: `color-mix(in srgb, ${col} 65%, var(--c-ink))`, fontWeight: 700 } : {}) }}>{p.classe ? `${p.classe}` : '—'}</span>
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
                    <IconaUI nome="cestino" dimensione={13} color={C.red} />
                  </button>
                </div>
                );
              })}
              {Object.keys(roster.personaggi).length === 0 && (
                <span style={styles.detail}>{t('menu.nessun_personaggio')}</span>
              )}
            </div>
          </>
        )}
        <div style={griglia2}>
          <button style={{ ...styles.button, ...tastoGriglia }} onClick={() => generaPgCasuale()} title={t('menu.pg_casuale_tooltip')}>{t('menu.pg_casuale')}</button>
          <button
            style={{ ...styles.button, ...tastoGriglia }}
            onClick={() => setMostraListaManuali((v) => !v)}
            aria-expanded={mostraListaManuali}
            title={lingua === 'it' ? 'Mostra o nascondi i manuali attivi' : 'Show or hide active sourcebooks'}
          >
            <span>{lingua === 'it' ? `Manuali e fonti ${mostraListaManuali ? '▴' : '▾'} (${Object.values(manualiAttivi).filter(Boolean).length})` : `Sourcebooks ${mostraListaManuali ? '▴' : '▾'} (${Object.values(manualiAttivi).filter(Boolean).length})`}</span>
          </button>
        </div>

        {mostraListaManuali && (
          <div
            id="lista-manuali-fonti"
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
              marginTop: 8,
              padding: 8,
              borderRadius: 8,
              background: 'rgba(0,0,0,0.18)',
              border: bordoTema,
            }}
          >
            {Object.entries(MANUALI_INFO).map(([k, m]) => {
              const attivo = manualeAttivo(manualiAttivi, k);
              const toggleManuale = () => {
                if (k === 'araldi' && !attivo) {
                  setMostraModalManuali(true);
                  return;
                }
                if (setManualiAttivi) {
                  setManualiAttivi((prev) => ({ ...prev, [k]: !attivo }));
                }
              };
              return (
                <div
                  key={k}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 8,
                    padding: '6px 10px',
                    borderRadius: 6,
                    background: attivo ? 'color-mix(in srgb, var(--c-panel-light) 75%, transparent)' : 'transparent',
                    border: `1px solid ${attivo ? (m.colore || 'var(--c-gold)') : 'var(--c-border)'}`,
                    borderLeft: `4px solid ${attivo ? (m.colore || 'var(--c-gold)') : 'var(--c-border)'}`,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 0, flex: 1 }}>
                    <span style={{ fontSize: 14 }}>{m.icona}</span>
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: attivo ? 700 : 500,
                        color: attivo ? C.ink : C.inkDim,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                      title={lingua === 'en' ? m.descrizioneEn : m.descrizione}
                    >
                      {lingua === 'en' ? m.nomeEn : m.nome}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={toggleManuale}
                    style={{
                      ...styles.buttonMini,
                      fontSize: 11,
                      fontWeight: 700,
                      padding: '2px 8px',
                      flexShrink: 0,
                      background: attivo ? 'rgba(46, 157, 77, 0.16)' : 'rgba(0,0,0,0.12)',
                      color: attivo ? 'var(--c-green, #2e9d4d)' : C.inkDim,
                      borderColor: attivo ? 'var(--c-green, #2e9d4d)' : C.border,
                      cursor: 'pointer',
                    }}
                    title={attivo ? (lingua === 'en' ? 'Click to disable' : 'Clicca per disattivare') : (lingua === 'en' ? 'Click to enable' : 'Clicca per attivare')}
                  >
                    {attivo ? (lingua === 'en' ? 'Active' : 'Attivo') : (lingua === 'en' ? 'Off' : 'Spento')}
                  </button>
                </div>
              );
            })}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 4 }}>
              <button
                type="button"
                style={{
                  background: 'transparent',
                  border: 'none',
                  padding: '2px 4px',
                  color: 'var(--c-gold-dark, var(--c-gold))',
                  fontSize: 11,
                  fontWeight: 600,
                  cursor: 'pointer',
                  textDecoration: 'underline',
                }}
                onClick={() => setMostraModalManuali(true)}
              >
                {lingua === 'en' ? 'Quick presets & details →' : 'Preset rapidi e dettagli completi →'}
              </button>
            </div>
          </div>
        )}
    
        {/* Specchio tasti header globali nello stesso identico ordine, con le stesse etichette e icone */}
        <div style={{ marginTop: 10, paddingTop: 8, borderTop: `1px solid ${C.border}` }}>
          <div style={etichettaSezione}>{lingua === 'en' ? 'Quick actions' : 'Azioni rapide'}</div>
          <div style={griglia2}>
            <button
              style={{ ...styles.button, ...tastoGriglia }}
              onClick={() => { setMostraMenu(false); setTimeout(() => apriNotifiche(), 50); }}
              title={t('notifiche.titolo')}
            >
              <span>{t('notifiche.titolo_breve')}</span>
            </button>
            <button
              style={{ ...styles.button, ...tastoGriglia }}
              onClick={() => setLingua((l) => (l === 'it' ? 'en' : 'it'))}
              title={t('tooltip.lingua')}
            >
              <span>{t('common.lingua')}</span>
            </button>
            <button
              style={{ ...styles.button, ...tastoGriglia }}
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
                ...tastoGriglia,
              }}
              onClick={() => { setMostraMenu(false); setTimeout(() => { setCloudStatus({ text: '', type: '' }); setMostraCloud(true); }, 50); }}
              title={isCloudAttivo ? (lingua === 'en' ? 'Sync is on' : 'Sincronizzazione attiva') : (lingua === 'en' ? 'Sync is off' : 'Sincronizzazione non attiva')}
            >
              {/* Bordo uguale agli altri tasti: lo stato della sincronizzazione è il pallino. */}
              <span aria-hidden="true" data-testid="menu-backup-stato" style={{ width: 8, height: 8, borderRadius: '50%', flexShrink: 0, background: statoColoreCloud, boxShadow: statoGlowCloud }} />
              <span>Backup</span>
            </button>
          </div>
        </div>
    
        <div style={{ marginTop: 10, paddingTop: 8, borderTop: `1px solid ${C.border}` }}>
          <div style={etichettaSezione}>{t('menu.sezione_backup')}</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(118px, 1fr))', gap: 6 }}>
            <button style={{ ...styles.button, ...tastoGriglia }} onClick={() => jsonRef.current?.click()} title={t('menu.ripristina_tip')}>
              <span>{t('menu.ripristina')}</span>
            </button>
            <button style={{ ...styles.button, ...tastoGriglia }} onClick={esportaBackupCompleto} title={t('menu.esporta_tutto_tip')}>
              <span>{t('menu.esporta_tutto')}</span>
            </button>
            {URL_ARCHIVIO_PG && (
              <button
                style={{ ...styles.button, ...tastoGriglia }}
                onClick={() => { setMostraArchivioDm(true); }}
                title={t('menu.archivio_dm_tip')}
              >
                <span>{t('menu.archivio_dm')}</span>
              </button>
            )}
          </div>
        </div>

        <div style={{ marginTop: 10, paddingTop: 8, borderTop: `1px solid ${C.border}` }}>
          <div style={etichettaSezione}>{lingua === 'en' ? 'About' : 'Informazioni'}</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 6 }}>
            <button
              style={{ ...styles.button, ...tastoGriglia, padding: '0 6px' }}
              onClick={() => { setMostraMenu(false); setMostraNoteLegali(true); }}
              title={t('legali.titolo')}
            >
              <span>{t('menu.note_legali')}</span>
            </button>
            <button
              style={{ ...styles.button, ...tastoGriglia, padding: '0 6px' }}
              onClick={() => { setMostraMenu(false); setMostraDonazioni(true); }}
              title={t('donazioni.titolo')}
            >
              <span>{t('menu.sostieni')}</span>
            </button>
            <a
              href="https://github.com/samuelenigro97-prog/Tavolo-Dei-Dadi"
              target="_blank"
              rel="noopener noreferrer"
              style={{ ...styles.button, textDecoration: 'none', ...tastoGriglia, padding: '0 6px' }}
              title={t('menu.github_tip')}
            >
              <span>{t('menu.github')}</span>
            </a>
          </div>
        </div>
    
        <div style={{ marginTop: 10, paddingTop: 8, borderTop: `1px solid ${C.border}`, display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: 11, color: C.muted }}>
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
