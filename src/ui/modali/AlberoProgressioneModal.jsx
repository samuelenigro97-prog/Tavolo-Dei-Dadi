// Modale Albero di Progressione e Abilità (Skill Tree / Progression Tree stile RPG)
import { useState } from 'react';
import { styles } from '../stili.js';
import { C } from '../tema.js';
import { t, traduciDato } from '../../i18n';
import { privilegiClasseLivello, asiAlLivello } from '../../rules/regole.js';
import { tabellaPrivilegiSottoclasse } from '../../data/dati5e.js';
import { spiegaPrivilegio } from '../../data/spiegazioni.js';

export function AlberoProgressioneModal({ lingua, onChiudi, scheda, setInfo, versione }) {
  const classiDisponibili = [
    {
      tipo: 'principale',
      classe: scheda.classe || 'Guerriero',
      livello: Number(scheda.livello) || 1,
      sottoclasse: scheda.sottoclasse || '',
    },
    ...(Array.isArray(scheda.multiclasse)
      ? scheda.multiclasse.filter((m) => m?.classe).map((m) => ({
          tipo: 'multiclasse',
          classe: m.classe,
          livello: Number(m.livello) || 1,
          sottoclasse: m.sottoclasse || '',
        }))
      : []),
  ];

  const [indiceClasseSel, setIndiceClasseSel] = useState(0);
  const classeCorrente = classiDisponibili[indiceClasseSel] || classiDisponibili[0];
  const { classe, livello: livelloAttuale, sottoclasse } = classeCorrente;
  const tabSub = sottoclasse ? (tabellaPrivilegiSottoclasse(sottoclasse, versione) || {}) : {};

  // Costruiamo i 20 livelli
  const livelliData = [];
  for (let lv = 1; lv <= 20; lv++) {
    const privClasse = privilegiClasseLivello(classe, lv, versione);
    const privSub = tabSub[lv] || '';
    const isAsi = asiAlLivello(classe, lv);
    const privTotali = [privClasse, privSub].filter(Boolean).join('\n');
    const sbloccato = lv <= livelloAttuale;
    const eLivelloCorrente = lv === livelloAttuale;
    const eBivio = isAsi || Boolean(privSub) || lv === 3;

    livelliData.push({
      livello: lv,
      sbloccato,
      eLivelloCorrente,
      eBivio,
      isAsi,
      privilegi: privTotali,
    });
  }

  return (
    <div
      className="modal-backdrop"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1005,
        padding: 16,
        background: 'rgba(5, 5, 8, 0.82)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onChiudi();
      }}
    >
      <div
        className="anim-modal-rapida albero-progressione-panel"
        style={{
          ...styles.panel,
          maxWidth: 780,
          width: '100%',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          background: 'color-mix(in srgb, var(--c-panel) 96%, transparent)',
          border: '1.5px solid var(--c-gold-dark, #c9a227)',
          boxShadow: '0 16px 48px rgba(0,0,0,0.65), 0 0 20px rgba(201,162,39,0.2)',
          padding: 16,
          boxSizing: 'border-box',
          overflow: 'hidden',
        }}
      >
        {/* Header con titolo e selettore classi */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, borderBottom: `1px solid ${C.border}`, paddingBottom: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 24 }}>🌳</span>
            <div>
              <div style={{ ...styles.title, fontSize: 18, lineHeight: 1.1, margin: 0, color: C.goldDark, fontFamily: 'var(--font-title)' }}>
                {lingua === 'en' ? 'Skill & Progression Tree' : 'Albero delle Abilità & Progressione'}
              </div>
              <div style={{ fontSize: 11, color: C.inkDim, marginTop: 2 }}>
                {traduciDato(classe)} {sottoclasse ? `· ${traduciDato(sottoclasse)}` : ''} · {lingua === 'en' ? `Level ${livelloAttuale}/20` : `Livello ${livelloAttuale}/20`} ({versione === '2024' ? 'D&D 5.5' : 'D&D 5.0'})
              </div>
            </div>
          </div>
          <button
            type="button"
            style={{ ...styles.buttonMini, padding: '4px 8px', fontSize: 13, color: C.inkDim }}
            onClick={onChiudi}
            title={t('modal.chiudi')}
          >
            ✕
          </button>
        </div>

        {/* Tab multi-classe se presenti */}
        {classiDisponibili.length > 1 && (
          <div style={{ display: 'flex', gap: 6, marginBottom: 12, overflowX: 'auto', paddingBottom: 4 }}>
            {classiDisponibili.map((c, i) => (
              <button
                key={i}
                type="button"
                style={{
                  ...styles.buttonMini,
                  padding: '5px 12px',
                  borderRadius: 8,
                  fontWeight: indiceClasseSel === i ? 800 : 500,
                  background: indiceClasseSel === i ? 'rgba(201,162,39,0.22)' : 'rgba(0,0,0,0.03)',
                  borderColor: indiceClasseSel === i ? C.goldDark : C.border,
                  color: indiceClasseSel === i ? C.goldDark : C.ink,
                  fontSize: 12,
                }}
                onClick={() => setIndiceClasseSel(i)}
              >
                {traduciDato(c.classe)} {c.sottoclasse ? `(${traduciDato(c.sottoclasse)})` : ''} — Liv. {c.livello}
              </button>
            ))}
          </div>
        )}

        {/* Mappa a costellazione nodi scorrimento verticale */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '10px 14px',
            position: 'relative',
          }}
        >
          {/* Linea continua dello skill tree */}
          <div
            style={{
              position: 'absolute',
              left: 45,
              top: 24,
              bottom: 24,
              width: 3,
              background: `linear-gradient(180deg, var(--c-gold, #c9a227) ${Math.min(100, (livelloAttuale / 20) * 100)}%, rgba(255,255,255,0.12) ${Math.min(100, (livelloAttuale / 20) * 100)}%)`,
              zIndex: 1,
              borderRadius: 2,
            }}
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, position: 'relative', zIndex: 2 }}>
            {livelliData.map((nodo) => {
              const { livello: lv, sbloccato, eLivelloCorrente, eBivio, isAsi, privilegi } = nodo;
              const listaVoci = privilegi.split('\n').filter(Boolean);

              return (
                <div
                  key={lv}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 16,
                    opacity: sbloccato ? 1 : 0.65,
                    filter: sbloccato ? 'none' : 'grayscale(35%)',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {/* Nodo icona livello */}
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: '50%',
                      flexShrink: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: sbloccato
                        ? (eLivelloCorrente ? 'var(--c-gold, #c9a227)' : 'rgba(201,162,39,0.18)')
                        : 'rgba(30,30,35,0.85)',
                      border: `2px solid ${sbloccato ? 'var(--c-gold, #c9a227)' : 'rgba(255,255,255,0.2)'}`,
                      color: sbloccato ? (eLivelloCorrente ? '#1a1608' : C.goldDark) : C.inkDim,
                      fontWeight: 800,
                      fontSize: 13,
                      boxShadow: eLivelloCorrente
                        ? '0 0 16px rgba(201,162,39,0.8), 0 0 4px rgba(201,162,39,0.9)'
                        : sbloccato
                        ? '0 0 8px rgba(201,162,39,0.25)'
                        : 'none',
                      position: 'relative',
                    }}
                    title={sbloccato ? (eLivelloCorrente ? 'Livello attuale' : 'Sbloccato') : 'Livello futuro'}
                  >
                    {lv}
                  </div>

                  {/* Scheda privilegi del livello */}
                  <div
                    style={{
                      flex: 1,
                      background: sbloccato
                        ? (eLivelloCorrente ? 'rgba(201,162,39,0.08)' : 'rgba(0,0,0,0.02)')
                        : 'rgba(0,0,0,0.03)',
                      border: `1px solid ${eLivelloCorrente ? C.goldDark : sbloccato ? 'rgba(201,162,39,0.3)' : C.border}`,
                      borderRadius: 10,
                      padding: '8px 12px',
                      boxShadow: eLivelloCorrente ? '0 2px 10px rgba(201,162,39,0.15)' : 'none',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4, flexWrap: 'wrap', gap: 4 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ fontSize: 12, fontWeight: 800, color: sbloccato ? C.goldDark : C.inkDim, fontFamily: 'var(--font-title)' }}>
                          {lingua === 'en' ? `LEVEL ${lv}` : `LIVELLO ${lv}`}
                        </span>
                        {eLivelloCorrente && (
                          <span style={{ fontSize: 10, fontWeight: 800, padding: '1px 6px', borderRadius: 4, background: 'var(--c-gold, #c9a227)', color: '#1a1608' }}>
                            {lingua === 'en' ? 'CURRENT' : 'ATTUALE'}
                          </span>
                        )}
                        {eBivio && (
                          <span style={{ fontSize: 10, fontWeight: 700, padding: '1px 5px', borderRadius: 4, background: 'rgba(120,50,220,0.15)', color: '#b388ff', border: '1px solid rgba(120,50,220,0.4)' }}>
                            {isAsi ? (lingua === 'en' ? 'ASI / FEAT' : 'AUMENTO CARATT. / TALENTO') : (lingua === 'en' ? 'BRANCH CHOICE' : 'BIVIO / SOTTOCLASSE')}
                          </span>
                        )}
                      </div>
                      {!sbloccato && (
                        <span style={{ fontSize: 11, color: C.inkDim, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                          🔒 {lingua === 'en' ? 'Locked' : 'Bloccato'}
                        </span>
                      )}
                    </div>

                    {listaVoci.length === 0 ? (
                      <div style={{ fontSize: 12, color: C.inkDim, fontStyle: 'italic' }}>
                        {isAsi
                          ? (lingua === 'en' ? 'Ability Score Improvement or Feat' : 'Aumento dei Punteggi di Caratteristica o Talento')
                          : (lingua === 'en' ? 'Hit Die & Spell Slot Progression' : 'Progressione Dadi Vita e Slot Incantesimi')}
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 4 }}>
                        {listaVoci.map((voce, vIdx) => {
                          const sp = spiegaPrivilegio(voce);
                          return (
                            <div key={vIdx} style={{ fontSize: 12.5, lineHeight: 1.35, display: 'flex', alignItems: 'baseline', gap: 6 }}>
                              <span style={{ color: sbloccato ? C.goldDark : C.inkDim }}>✦</span>
                              {sp ? (
                                <span
                                  role="button"
                                  tabIndex={0}
                                  style={{
                                    cursor: 'help',
                                    color: sbloccato ? C.ink : C.inkDim,
                                    fontWeight: 600,
                                    textDecoration: 'underline dotted',
                                    textUnderlineOffset: 3,
                                  }}
                                  title={sp}
                                  onClick={() => setInfo({ titolo: voce, testo: sp })}
                                >
                                  {voce}
                                </span>
                              ) : (
                                <span style={{ color: sbloccato ? C.ink : C.inkDim, fontWeight: 600 }}>{voce}</span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ paddingTop: 10, borderTop: `1px solid ${C.border}`, display: 'flex', justifyContent: 'flex-end' }}>
          <button type="button" style={{ ...styles.button, minWidth: 100 }} onClick={onChiudi}>
            {t('modal.chiudi')}
          </button>
        </div>
      </div>
    </div>
  );
}
