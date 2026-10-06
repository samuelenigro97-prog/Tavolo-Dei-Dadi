// Estratto da App.jsx (finestra "IspirazioneBgModal"): riceve dall'App lo stato che usa, tutto il resto è importato.
import { t, tr } from '../../i18n';
import { C } from '../tema.js';
import { styles } from '../stili.js';
import { datiTabelleBackground, TABELLE_BACKGROUND } from '../../data/tabelleBackground.js';
import { tiraDado } from '../../rules/dadi.js';

export function IspirazioneBgModal({ applicaIspirazioneBg, bgIspirazioneScelto, bozzaIspirazione, lingua, scheda, setBgIspirazioneScelto, setBozzaIspirazione, setMostraIspirazioneBgModal, tiraTuttoIspirazione }) {
  const bgDati = datiTabelleBackground(bgIspirazioneScelto || scheda.background || 'Accolito', lingua);
  const elencoBg = Object.values(TABELLE_BACKGROUND);

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
      onClick={(e) => { if (e.target === e.currentTarget) setMostraIspirazioneBgModal(false); }}
    >
      <div
        style={{
          ...styles.panel,
          maxWidth: 960,
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          border: `2px solid ${C.goldDark}`,
          borderRadius: 12,
          padding: '16px 20px',
        }}
      >
        {/* Header Modale */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, borderBottom: `1px solid ${C.border}`, paddingBottom: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div>
              <h2 style={{ ...styles.title, margin: 0, fontSize: 18, letterSpacing: 0.5, color: C.ink }}>
                {t('aspetto.ispirazione_titolo')}
              </h2>
              <div style={{ ...styles.detail, fontSize: 12, color: C.goldDark, fontWeight: 600 }}>
                {t('aspetto.ispirazione_sottotitolo')}
              </div>
            </div>
          </div>
          <button
            type="button"
            style={{ ...styles.buttonMini, fontSize: 16, padding: '2px 10px', color: C.inkDim, borderRadius: 6 }}
            onClick={() => setMostraIspirazioneBgModal(false)}
            title={t('modal.chiudi')}
          >
            ✕
          </button>
        </div>

        {/* Selettore Background & Azione Rapida Tira Tutto */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10, marginBottom: 14, background: 'rgba(0,0,0,0.03)', padding: '10px 12px', borderRadius: 8, border: `1px solid ${C.border}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: C.ink }}>{t('aspetto.background')}:</span>
            <select
              style={{ ...styles.inlineInput, fontSize: 13, padding: '4px 8px', fontWeight: 600, minWidth: 160 }}
              value={bgIspirazioneScelto || scheda.background || 'Accolito'}
              onChange={(e) => {
                const nuovoBg = e.target.value;
                setBgIspirazioneScelto(nuovoBg);
                const d = datiTabelleBackground(nuovoBg, lingua);
                if (d) {
                  setBozzaIspirazione({
                    tratto: d.tratti[0] || '',
                    ideale: d.ideali[0] || '',
                    legame: d.legami[0] || '',
                    difetto: d.difetti[0] || '',
                  });
                }
              }}
            >
              {elencoBg.map((bg) => {
                const nomeVisualizzato = lingua === 'en' ? bg.nome_en : bg.nome;
                return (
                  <option key={bg.nome} value={bg.nome}>{nomeVisualizzato}</option>
                );
              })}
            </select>
          </div>
          <button
            type="button"
            style={{ ...styles.button, background: C.gold, color: C.onGold, fontSize: 13, fontWeight: 700, padding: '6px 14px', border: 'none', borderRadius: 6, display: 'flex', alignItems: 'center', gap: 6 }}
            onClick={() => tiraTuttoIspirazione(bgIspirazioneScelto)}
          >
            {t('aspetto.tira_tutto')} (d8, d6, d6, d6)
          </button>
        </div>

        {/* Griglia delle 4 Tabelle */}
        {bgDati && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 12, marginBottom: 16 }}>
            {/* Card 1: Tratto Caratteriale (d8) */}
            <div style={{ background: C.panelLight, border: `1px solid ${C.border}`, borderRadius: 8, padding: '10px 12px', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: C.goldDark }}>{t('aspetto.tratti_caratteriali')} (d8)</span>
                <button
                  type="button"
                  style={{ ...styles.buttonMini, fontSize: 11, padding: '2px 8px', color: C.goldDark, border: `1px solid ${C.gold}`, background: 'rgba(201,162,39,0.12)', fontWeight: 700 }}
                  onClick={() => {
                    const r = tiraDado(8);
                    setBozzaIspirazione((b) => ({ ...b, tratto: bgDati.tratti[r - 1] || '' }));
                  }}
                >
                  {t('aspetto.tira_dado')} d8
                </button>
              </div>
              <textarea
                style={{ ...styles.areaTesto, fontSize: 12, minHeight: 48, marginBottom: 8, padding: '6px 8px' }}
                value={bozzaIspirazione.tratto}
                onChange={(e) => setBozzaIspirazione((b) => ({ ...b, tratto: e.target.value }))}
                placeholder={t('aspetto.tratti_caratteriali_ph')}
              />
              <div style={{ fontSize: 11, fontWeight: 600, color: C.inkDim, marginBottom: 4 }}>{tr('Opzioni della tabella (1-8):', 'Table options (1-8):')}</div>
              <div style={{ maxHeight: 130, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 4, paddingRight: 4 }}>
                {bgDati.tratti.map((tVoce, idx) => {
                  const sel = bozzaIspirazione.tratto === tVoce;
                  return (
                    <div role="button" tabIndex={0}
                      key={idx}
                      style={{
                        fontSize: 12,
                        padding: '4px 6px',
                        borderRadius: 4,
                        cursor: 'pointer',
                        background: sel ? 'rgba(201,162,39,0.18)' : 'transparent',
                        border: sel ? `1px solid ${C.gold}` : '1px solid transparent',
                        color: sel ? C.goldDark : C.ink,
                        fontWeight: sel ? 700 : 400,
                      }}
                      onClick={() => setBozzaIspirazione((b) => ({ ...b, tratto: tVoce }))}
                    >
                      <strong>{idx + 1}.</strong> {tVoce}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Card 2: Ideale (d6) */}
            <div style={{ background: C.panelLight, border: `1px solid ${C.border}`, borderRadius: 8, padding: '10px 12px', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: C.goldDark }}>{t('aspetto.ideali')} (d6)</span>
                <button
                  type="button"
                  style={{ ...styles.buttonMini, fontSize: 11, padding: '2px 8px', color: C.goldDark, border: `1px solid ${C.gold}`, background: 'rgba(201,162,39,0.12)', fontWeight: 700 }}
                  onClick={() => {
                    const r = tiraDado(6);
                    setBozzaIspirazione((b) => ({ ...b, ideale: bgDati.ideali[r - 1] || '' }));
                  }}
                >
                  {t('aspetto.tira_dado')} d6
                </button>
              </div>
              <textarea
                style={{ ...styles.areaTesto, fontSize: 12, minHeight: 48, marginBottom: 8, padding: '6px 8px' }}
                value={bozzaIspirazione.ideale}
                onChange={(e) => setBozzaIspirazione((b) => ({ ...b, ideale: e.target.value }))}
                placeholder={t('aspetto.ideali_ph')}
              />
              <div style={{ fontSize: 11, fontWeight: 600, color: C.inkDim, marginBottom: 4 }}>{tr('Opzioni della tabella (1-6):', 'Table options (1-6):')}</div>
              <div style={{ maxHeight: 130, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 4, paddingRight: 4 }}>
                {bgDati.ideali.map((iVoce, idx) => {
                  const sel = bozzaIspirazione.ideale === iVoce;
                  return (
                    <div role="button" tabIndex={0}
                      key={idx}
                      style={{
                        fontSize: 12,
                        padding: '4px 6px',
                        borderRadius: 4,
                        cursor: 'pointer',
                        background: sel ? 'rgba(201,162,39,0.18)' : 'transparent',
                        border: sel ? `1px solid ${C.gold}` : '1px solid transparent',
                        color: sel ? C.goldDark : C.ink,
                        fontWeight: sel ? 700 : 400,
                      }}
                      onClick={() => setBozzaIspirazione((b) => ({ ...b, ideale: iVoce }))}
                    >
                      <strong>{idx + 1}.</strong> {iVoce}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Card 3: Legame (d6) */}
            <div style={{ background: C.panelLight, border: `1px solid ${C.border}`, borderRadius: 8, padding: '10px 12px', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: C.goldDark }}>{t('aspetto.legami')} (d6)</span>
                <button
                  type="button"
                  style={{ ...styles.buttonMini, fontSize: 11, padding: '2px 8px', color: C.goldDark, border: `1px solid ${C.gold}`, background: 'rgba(201,162,39,0.12)', fontWeight: 700 }}
                  onClick={() => {
                    const r = tiraDado(6);
                    setBozzaIspirazione((b) => ({ ...b, legame: bgDati.legami[r - 1] || '' }));
                  }}
                >
                  {t('aspetto.tira_dado')} d6
                </button>
              </div>
              <textarea
                style={{ ...styles.areaTesto, fontSize: 12, minHeight: 48, marginBottom: 8, padding: '6px 8px' }}
                value={bozzaIspirazione.legame}
                onChange={(e) => setBozzaIspirazione((b) => ({ ...b, legame: e.target.value }))}
                placeholder={t('aspetto.legami_ph')}
              />
              <div style={{ fontSize: 11, fontWeight: 600, color: C.inkDim, marginBottom: 4 }}>{tr('Opzioni della tabella (1-6):', 'Table options (1-6):')}</div>
              <div style={{ maxHeight: 130, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 4, paddingRight: 4 }}>
                {bgDati.legami.map((lVoce, idx) => {
                  const sel = bozzaIspirazione.legame === lVoce;
                  return (
                    <div role="button" tabIndex={0}
                      key={idx}
                      style={{
                        fontSize: 12,
                        padding: '4px 6px',
                        borderRadius: 4,
                        cursor: 'pointer',
                        background: sel ? 'rgba(201,162,39,0.18)' : 'transparent',
                        border: sel ? `1px solid ${C.gold}` : '1px solid transparent',
                        color: sel ? C.goldDark : C.ink,
                        fontWeight: sel ? 700 : 400,
                      }}
                      onClick={() => setBozzaIspirazione((b) => ({ ...b, legame: lVoce }))}
                    >
                      <strong>{idx + 1}.</strong> {lVoce}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Card 4: Difetto (d6) */}
            <div style={{ background: C.panelLight, border: `1px solid ${C.border}`, borderRadius: 8, padding: '10px 12px', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: C.goldDark }}>{t('aspetto.difetti')} (d6)</span>
                <button
                  type="button"
                  style={{ ...styles.buttonMini, fontSize: 11, padding: '2px 8px', color: C.goldDark, border: `1px solid ${C.gold}`, background: 'rgba(201,162,39,0.12)', fontWeight: 700 }}
                  onClick={() => {
                    const r = tiraDado(6);
                    setBozzaIspirazione((b) => ({ ...b, difetto: bgDati.difetti[r - 1] || '' }));
                  }}
                >
                  {t('aspetto.tira_dado')} d6
                </button>
              </div>
              <textarea
                style={{ ...styles.areaTesto, fontSize: 12, minHeight: 48, marginBottom: 8, padding: '6px 8px' }}
                value={bozzaIspirazione.difetto}
                onChange={(e) => setBozzaIspirazione((b) => ({ ...b, difetto: e.target.value }))}
                placeholder={t('aspetto.difetti_ph')}
              />
              <div style={{ fontSize: 11, fontWeight: 600, color: C.inkDim, marginBottom: 4 }}>{tr('Opzioni della tabella (1-6):', 'Table options (1-6):')}</div>
              <div style={{ maxHeight: 130, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 4, paddingRight: 4 }}>
                {bgDati.difetti.map((dVoce, idx) => {
                  const sel = bozzaIspirazione.difetto === dVoce;
                  return (
                    <div role="button" tabIndex={0}
                      key={idx}
                      style={{
                        fontSize: 12,
                        padding: '4px 6px',
                        borderRadius: 4,
                        cursor: 'pointer',
                        background: sel ? 'rgba(201,162,39,0.18)' : 'transparent',
                        border: sel ? `1px solid ${C.gold}` : '1px solid transparent',
                        color: sel ? C.goldDark : C.ink,
                        fontWeight: sel ? 700 : 400,
                      }}
                      onClick={() => setBozzaIspirazione((b) => ({ ...b, difetto: dVoce }))}
                    >
                      <strong>{idx + 1}.</strong> {dVoce}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Footer Modale con Azioni */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 10, borderTop: `1px solid ${C.border}`, paddingTop: 12 }}>
          <button
            type="button"
            style={{ ...styles.button, fontSize: 13, padding: '6px 14px' }}
            onClick={() => setMostraIspirazioneBgModal(false)}
          >
            {t('modal.chiudi')}
          </button>
          <button
            type="button"
            style={{ ...styles.button, background: C.gold, color: C.onGold, fontSize: 13, fontWeight: 700, padding: '6px 18px' }}
            onClick={applicaIspirazioneBg}
          >
            {t('aspetto.applica')}
          </button>
        </div>
      </div>
    </div>
  );
      }
