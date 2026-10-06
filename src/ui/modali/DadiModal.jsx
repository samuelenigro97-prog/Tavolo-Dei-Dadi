// Estratto da App.jsx (finestra "DadiModal"): riceve dall'App lo stato che usa, tutto il resto è importato.
import { t, tr } from '../../i18n';
import { C } from '../tema.js';
import { styles } from '../stili.js';

export function DadiModal({ erroreEspressione, espressioneLibera, lingua, modalita, setErroreEspressione, setEspressioneLibera, setModalita, setMostraDadiModal, setStorico, storico, tiroEspressione, tiroLibero }) {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 2500,
        padding: 16,
        background: 'rgba(0,0,0,0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      onClick={(e) => { if (e.target === e.currentTarget) setMostraDadiModal(false); }}
    >
      <div
        style={{
          ...styles.panel,
          maxWidth: 560,
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          border: `2px solid ${C.goldDark}`,
          borderRadius: 12,
          padding: '16px 20px',
          gap: 16,
        }}
      >
        {/* Header Modale Dadi */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `1px solid ${C.border}`, paddingBottom: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div>
              <h2 style={{ ...styles.title, margin: 0, fontSize: 18, color: C.ink }}>
                {t('roll.tavolo_dadi')}
              </h2>
              <div style={{ ...styles.detail, fontSize: 12, color: C.inkDim }}>
                {lingua === 'en' ? 'Quick rolls, advantage and custom formulas' : 'Tiri rapidi, vantaggio/svantaggio e formule'}
              </div>
            </div>
          </div>
          <button
            type="button"
            style={{ ...styles.buttonMini, fontSize: 16, padding: '2px 10px', color: C.inkDim, borderRadius: 6 }}
            onClick={() => setMostraDadiModal(false)}
            title={t('modal.chiudi')}
          >
            ✕
          </button>
        </div>

        {/* Modalità di tiro (Normale / Vantaggio / Svantaggio) */}
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, color: C.inkDim, marginBottom: 6 }}>
            {lingua === 'en' ? 'D20 Roll Mode' : 'Modalità tiro d20'}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
            {['normale', 'vantaggio', 'svantaggio'].map((m) => (
              <button
                key={m}
                style={{
                  ...styles.modeButton(modalita === m),
                  width: '100%',
                  padding: '8px 4px',
                  fontSize: 13,
                  fontWeight: 700,
                  textAlign: 'center',
                }}
                onClick={() => setModalita(m)}
              >
                {m === 'normale' ? t('roll.normale') : m === 'vantaggio' ? t('roll.vantaggio') : t('roll.svantaggio')}
              </button>
            ))}
          </div>
        </div>

        {/* Dadi Cliccabili SVG */}
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, color: C.inkDim, marginBottom: 6 }}>
            {t('roll.dado')}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6, flexWrap: 'wrap', background: 'rgba(0,0,0,0.03)', padding: '10px 12px', borderRadius: 8, border: `1px solid ${C.border}` }}>
            {[4, 6, 8, 10, 12, 20, 100].map((facce) => {
              let pts = "";
              if (facce === 4) pts = "20,4 36,36 4,36";
              else if (facce === 6) pts = "6,6 34,6 34,34 6,34";
              else if (facce === 8) pts = "20,4 36,20 20,36 4,20";
              else if (facce === 10) pts = "20,4 36,16 20,36 4,16";
              else if (facce === 12) pts = "20,4 36,14 30,36 10,36 4,14";
              else if (facce === 20) pts = "10,4 30,4 38,20 30,36 10,36 2,20";
              return (
                <button
                  key={facce}
                  className="dado-btn"
                  onClick={() => {
                    tiroLibero(facce);
                    setMostraDadiModal(false);
                  }}
                  title={tr(`Tira 1d${facce}`, `Roll 1d${facce}`)}
                  style={{
                    position: 'relative', width: 44, height: 44, background: 'none', border: 'none', cursor: 'pointer',
                    padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform 0.1s'
                  }}
                  onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.9)'}
                  onMouseUp={(e) => e.currentTarget.style.transform = 'none'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'none'}
                >
                  <svg width="44" height="44" viewBox="0 0 40 40" style={{ position: 'absolute', top: 0, left: 0 }}>
                    {facce === 100 ? (
                      <circle cx="20" cy="20" r="16" fill="var(--c-gold)" stroke="var(--c-gold-dark)" strokeWidth="2" />
                    ) : (
                      <polygon points={pts} fill="var(--c-gold)" stroke="var(--c-gold-dark)" strokeWidth="2" strokeLinejoin="round" />
                    )}
                  </svg>
                  <span style={{ position: 'relative', zIndex: 1, fontWeight: 800, color: '#fff', fontSize: 12, marginTop: facce === 4 ? 4 : facce === 10 ? 2 : 0, textShadow: '0 1px 2px rgba(0,0,0,0.7)' }}>
                    d{facce}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Espressione Personalizzata */}
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, color: C.inkDim, marginBottom: 6 }}>
            {lingua === 'en' ? 'Custom Formula / Expression' : 'Formula personalizzata'}
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <input
              style={{
                ...styles.inlineInput,
                flex: 1,
                padding: '8px 12px',
                fontSize: 14,
                height: 38,
                borderRadius: 6,
                border: `1px solid ${erroreEspressione ? C.red : C.border}`,
              }}
              placeholder={t('roll.espr_placeholder') || 'Es. 3d6+2, 1d12+5, 4d8'}
              value={espressioneLibera}
              onChange={(e) => {
                setEspressioneLibera(e.target.value);
                setErroreEspressione(false);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  tiroEspressione();
                  setMostraDadiModal(false);
                }
              }}
            />
            <button
              style={{ ...styles.buttonPrimary, height: 38, padding: '0 18px', fontSize: 14 }}
              onClick={() => {
                tiroEspressione();
                setMostraDadiModal(false);
              }}
            >
              {t('roll.tira')}
            </button>
          </div>
          {erroreEspressione && (
            <div style={{ color: C.red, fontSize: 12, marginTop: 4 }}>
              {t('roll.espr_invalida')}
            </div>
          )}
        </div>

        {/* Cronologia Tiri */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, color: C.inkDim }}>
              {t('roll.cronologia')} ({storico.length})
            </div>
            {storico.length > 0 && (
              <button style={{ ...styles.buttonMini, color: C.red, fontSize: 11, padding: '2px 8px' }} onClick={() => setStorico([])}>
                {t('log.svuota')}
              </button>
            )}
          </div>
          {storico.length === 0 ? (
            <div style={{ ...styles.detail, fontSize: 12, padding: '8px 0', textAlign: 'center' }}>
              {t('roll.nessun_tiro')}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 180, overflowY: 'auto' }}>
              {storico.map((voce) => {
                const isObj = voce && typeof voce === 'object';
                if (!isObj) return <div key={String(voce)} style={styles.detail}>{voce}</div>;
                const colore = voce.critico ? C.green : voce.fumble ? C.red : voce.tipo === 'cura' ? C.green : C.gold;
                const ora = voce.ts ? new Date(voce.ts).toLocaleTimeString(lingua === 'it' ? 'it-IT' : 'en-GB', { hour: '2-digit', minute: '2-digit' }) : '';
                return (
                  <div key={voce.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 8px', borderRadius: 6, background: 'rgba(0,0,0,0.03)', border: `1px solid ${voce.critico ? C.green : voce.fumble ? C.red : C.border}` }}>
                    <div style={{ minWidth: 32, textAlign: 'center', fontSize: 18, fontWeight: 800, color: colore }}>
                      {voce.totale != null ? voce.totale : '—'}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: C.ink, display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap' }}>
                        <span>{voce.etichetta}</span>
                        {voce.critico && <span style={styles.badge(C.green)}>{t('log.critico')}</span>}
                        {voce.fumble && <span style={styles.badge(C.red)}>{t('log.fallimento')}</span>}
                      </div>
                      <div style={{ ...styles.detail, fontSize: 11 }}>
                        {ora}{voce.personaggio ? ` · ${voce.personaggio}` : ''}{voce.dettaglio ? ` · ${voce.dettaglio}` : ''}
                      </div>
                    </div>
                    <button style={{ ...styles.buttonMini, color: C.red, padding: '1px 6px', fontSize: 12 }} onClick={() => setStorico((s) => s.filter((x) => x.id !== voce.id))}>×</button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
