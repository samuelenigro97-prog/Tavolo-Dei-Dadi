// Estratto da App.jsx (finestra "MenuHubMobile"): riceve dall'App lo stato che usa, tutto il resto è importato.
import { styles } from '../stili.js';
import { C } from '../tema.js';
import { t } from '../../i18n';
import { modificatore } from '../../rules/dadi.js';
import { punteggioCaratteristica } from '../../rules/scheda.js';

export function MenuHubMobile({ APP_VERSION, aggiungiPgAlCombat, apriNotifiche, combat, controlliAttivi, daNotificare, eliminaPersonaggio, lingua, mappaAperta, mappaCampagna, mappaRef, mostraPannelloAudio, scheda, setBozzaCrea, setCloudStatus, setCombat, setLevelUpBozza, setLingua, setMappaAperta, setMostraCloud, setMostraCompendio, setMostraCrea, setMostraDadiModal, setMostraDiarioModal, setMostraLevelUp, setMostraMenu, setMostraMenuEsporta, setMostraMenuHubMobile, setMostraPannelloAudio, setPosEsporta, setPosPannelloAudio, setSyncCodiceStatus, setTema, statoBgCloud, statoColoreCloud, statoGlowCloud, tema }) {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 2600,
        padding: 14,
        background: 'rgba(0,0,0,0.72)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      onClick={(e) => { if (e.target === e.currentTarget) setMostraMenuHubMobile(false); }}
    >
      <div
        style={{
          ...styles.panel,
          maxWidth: 480,
          width: '100%',
          maxHeight: '88vh',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 12px 40px rgba(0,0,0,0.5)',
          border: `2px solid ${C.goldDark}`,
          borderRadius: 14,
          padding: '16px 18px',
          gap: 14,
        }}
      >
        {/* Header Hub */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `1px solid ${C.border}`, paddingBottom: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            
            <div>
              <h2 style={{ ...styles.title, margin: 0, fontSize: 18, letterSpacing: 0.3, color: C.ink }}>
                {lingua === 'en' ? 'Menu and tools' : 'Menu e strumenti'}
              </h2>
              <div style={{ fontSize: 12, color: 'var(--c-title)', fontWeight: 800, fontFamily: "var(--font-title, Georgia, 'Times New Roman', serif)" }}>
                Tavolo dei Dadi <span style={{ fontSize: 11, color: C.inkDim, opacity: 0.75, fontWeight: 600 }}>v{APP_VERSION}</span>
              </div>
            </div>
          </div>
          <button
            type="button"
            style={{ ...styles.buttonMini, fontSize: 16, padding: '3px 10px', color: C.inkDim, borderRadius: 6 }}
            onClick={() => setMostraMenuHubMobile(false)}
            title={t('modal.chiudi')}
          >
            ✕
          </button>
        </div>
    
        {/* Sezione 1: Scheda Personaggio */}
        <div>
          <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 0.6, color: C.goldDark, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 5 }}>
            <span>{lingua === 'en' ? 'Character sheet' : 'Scheda personaggio'}</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
            <button
              type="button"
              style={{ ...styles.button, display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: 8, padding: '10px 12px', fontSize: 13, fontWeight: 700, borderRadius: 8, background: C.panelLight, border: `1px solid ${C.border}`, color: C.ink }}
              onClick={() => {
                setBozzaCrea({
                  nome: '', sesso: '', classe: '', sottoclasse: '', specie: '', background: '',
                  livello: 1, metodo: 'auto', pool: null, assegna: {}, competenzeClasse: [],
                  competenzeSpecie: [], maestria: [], talentoOrigine: '', asiTalenti: {},
                  multiclasseClasse2: '', multiclasseLivello2: 1, sottoclasseMc2: '',
                  multiclasseClasse3: '', multiclasseLivello3: 1, sottoclasseMc3: '',
                  dotazione: 'pacchetto'
                });
                setMostraCrea(true);
                setMostraMenuHubMobile(false);
              }}
            >
              <span style={{ fontSize: 16 }}>＋</span>
              <span>{t('tip.nuovo_pg')}</span>
            </button>
    
            <button
              type="button"
              style={{ ...styles.button, display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: 8, padding: '10px 12px', fontSize: 13, fontWeight: 700, borderRadius: 8, background: C.panelLight, border: `1px solid ${C.border}`, color: C.ink }}
              onClick={() => {
                const dvMatch = String(scheda.dadiVita || '').match(/d(\d+)/i);
                const facceDV = dvMatch ? parseInt(dvMatch[1]) : 8;
                const modCos = modificatore(punteggioCaratteristica(scheda, 'costituzione') || 10) || 0;
                const avgHpGain = Math.floor(facceDV / 2) + 1 + modCos;
                setLevelUpBozza({
                  metodo: 'media', hpGainMedia: Math.max(1, avgHpGain), facceDV, modCos, tiroFatto: 0,
                  asiMode: 'aumento', asiA: '', asiB: '', talento: '',
                  sottoclasse: scheda.sottoclasse || '',
                });
                setMostraLevelUp(true);
                setMostraMenuHubMobile(false);
              }}
            >
              
              <span>{t('tip.levelup')}</span>
            </button>
    
            <button
              type="button"
              style={{ ...styles.button, display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: 8, padding: '10px 12px', fontSize: 13, fontWeight: 700, borderRadius: 8, background: 'rgba(214,40,40,0.08)', border: '1px solid rgba(214,40,40,0.3)', color: C.red }}
              onClick={() => {
                eliminaPersonaggio();
                setMostraMenuHubMobile(false);
              }}
            >
              
              <span>{t('tip.elimina_pg')}</span>
            </button>
          </div>
        </div>
    
        {/* Sezione 2: Sistema & Dati */}
        <div>
          <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 0.6, color: C.goldDark, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 5 }}>
            <span>{lingua === 'en' ? 'System and data' : 'Sistema e dati'}</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
            <button
              type="button"
              style={{ ...styles.button, display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: 8, padding: '10px 12px', fontSize: 13, fontWeight: 700, borderRadius: 8, background: C.panelLight, border: `1px solid ${C.border}`, color: C.ink }}
              onClick={() => {
                setMostraMenu(true);
                setMostraMenuHubMobile(false);
              }}
            >
              
              <span>{t('tip.menu_iniziale')}</span>
            </button>
    
            <button
              type="button"
              style={{ ...styles.button, display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: 8, padding: '10px 12px', fontSize: 13, fontWeight: 700, borderRadius: 8, background: daNotificare ? 'rgba(201,162,39,0.18)' : C.panelLight, border: `1px solid ${daNotificare ? C.goldDark : C.border}`, color: C.ink }}
              onClick={() => {
                apriNotifiche();
                setMostraMenuHubMobile(false);
              }}
            >
              
              <span>
                {t('notifiche.titolo')}{' '}
                {controlliAttivi.length > 0 ? `(${controlliAttivi.length})` : ''}
              </span>
            </button>
    
            <button
              type="button"
              style={{ ...styles.button, display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: 8, padding: '10px 12px', fontSize: 13, fontWeight: 700, borderRadius: 8, background: C.panelLight, border: `1px solid ${C.border}`, color: C.ink }}
              onClick={() => {
                setLingua((l) => (l === 'it' ? 'en' : 'it'));
              }}
            >
              
              <span>{lingua === 'it' ? 'Italiano (IT)' : 'English (EN)'}</span>
            </button>
    
            <button
              type="button"
              style={{ ...styles.button, display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: 8, padding: '10px 12px', fontSize: 13, fontWeight: 700, borderRadius: 8, background: C.panelLight, border: `1px solid ${C.border}`, color: C.ink }}
              onClick={() => {
                setPosEsporta({ top: 80, left: Math.max(10, (window.innerWidth - 300) / 2) });
                setMostraMenuEsporta(true);
                setMostraMenuHubMobile(false);
              }}
            >
              
              <span>{t('import_export.btn')}</span>
            </button>
    
            <button
              type="button"
              style={{
                ...styles.button,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start',
                gap: 8,
                padding: '10px 12px',
                fontSize: 13,
                fontWeight: 700,
                borderRadius: 8,
                background: statoBgCloud,
                border: `1.5px solid ${statoColoreCloud}`,
                color: statoColoreCloud,
                boxShadow: statoGlowCloud,
                transition: 'all 0.25s ease',
              }}
              onClick={() => {
                setCloudStatus({ text: '', type: '' });
                setSyncCodiceStatus({ text: '', type: '' });
                setMostraCloud(true);
                setMostraMenuHubMobile(false);
              }}
            >
              
              <span>
                {lingua === 'en' ? 'Backup & sync' : 'Backup e sincronizzazione'}
              </span>
            </button>
          </div>
        </div>
    
        {/* Sezione 3: Sessione & Strumenti */}
        <div>
          <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 0.6, color: C.goldDark, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 5 }}>
            <span>{lingua === 'en' ? 'Session and tools' : 'Sessione e strumenti'}</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
            <button
              type="button"
              style={{ ...styles.button, display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: 8, padding: '10px 12px', fontSize: 13, fontWeight: 700, borderRadius: 8, background: C.panelLight, border: `1px solid ${C.border}`, color: C.ink }}
              onClick={() => {
                setMostraDadiModal(true);
                setMostraMenuHubMobile(false);
              }}
            >
              
              <span>{t('roll.tavolo_dadi')}</span>
            </button>
    
            <button
              type="button"
              style={{ ...styles.button, display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: 8, padding: '10px 12px', fontSize: 13, fontWeight: 700, borderRadius: 8, background: C.panelLight, border: `1px solid ${C.border}`, color: C.ink }}
              onClick={() => {
                setMostraCompendio(true);
                setMostraMenuHubMobile(false);
              }}
            >
              
              <span>{t('compendio.titolo')}</span>
            </button>
    
            <button
              type="button"
              style={{ ...styles.button, display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: 8, padding: '10px 12px', fontSize: 13, fontWeight: 700, borderRadius: 8, background: C.panelLight, border: `1px solid ${C.border}`, color: C.ink }}
              onClick={() => {
                setTema(tema === 'auto' ? 'chiaro' : tema === 'chiaro' ? 'scuro' : 'auto');
              }}
            >
              
              <span>{tema === 'auto' ? 'Tema: Auto' : tema === 'chiaro' ? 'Tema: Chiaro' : 'Tema: Scuro'}</span>
            </button>
    
            <button
              type="button"
              style={{ ...styles.button, display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: 8, padding: '10px 12px', fontSize: 13, fontWeight: 700, borderRadius: 8, background: C.panelLight, border: `1px solid ${C.border}`, color: C.ink }}
              onClick={() => {
                setPosPannelloAudio({ top: 80, left: 20 });
                setMostraPannelloAudio(!mostraPannelloAudio);
                setMostraMenuHubMobile(false);
              }}
            >
              <span>{t('luogo.tooltip')}</span>
            </button>
    
            <button
              type="button"
              style={{ ...styles.button, display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: 8, padding: '10px 12px', fontSize: 13, fontWeight: 700, borderRadius: 8, background: C.panelLight, border: `1px solid ${C.border}`, color: C.ink }}
              onClick={() => {
                setMostraDiarioModal(true);
                setMostraMenuHubMobile(false);
              }}
            >
              
              <span>{t('sez.diario')} ({(Array.isArray(scheda.diario) ? scheda.diario.length : 0)})</span>
            </button>
    
    
            <button
              type="button"
              style={{ ...styles.button, display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: 8, padding: '10px 12px', fontSize: 13, fontWeight: 700, borderRadius: 8, background: C.panelLight, border: `1px solid ${C.border}`, color: C.ink }}
              onClick={() => {
                if (mappaCampagna) setMappaAperta((v) => !v);
                else mappaRef.current?.click();
                setMostraMenuHubMobile(false);
              }}
            >
              
              <span>{mappaCampagna ? (mappaAperta ? t('mappa.chiudi') : t('mappa.apri')) : t('mappa.carica')}</span>
            </button>
    
            <button
              type="button"
              data-combat-toggle="true"
              style={{ ...styles.button, display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: 8, padding: '10px 12px', fontSize: 13, fontWeight: 700, borderRadius: 8, background: combat.attivo && combat.aperto ? 'rgba(201,162,39,0.18)' : C.panelLight, border: `1px solid ${C.border}`, color: C.ink }}
              onClick={() => {
                if (combat.attivo && combat.aperto) setCombat((c) => ({ ...c, aperto: false }));
                else if (combat.combattenti.length) setCombat((c) => ({ ...c, attivo: true, aperto: true }));
                else aggiungiPgAlCombat();
                setMostraMenuHubMobile(false);
              }}
            >
              
              <span>{lingua === 'en' ? 'Combat' : 'Combattimento'}</span>
            </button>
          </div>
        </div>
    
        {/* Footer Hub */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', borderTop: `1px solid ${C.border}`, paddingTop: 10 }}>
          <button
            type="button"
            style={{ ...styles.button, fontSize: 13, fontWeight: 700, padding: '6px 16px' }}
            onClick={() => setMostraMenuHubMobile(false)}
          >
            {t('modal.chiudi')}
          </button>
        </div>
      </div>
    </div>
  );
}
