// Estratto da App.jsx (finestra "BestiaDettaglioModal"): riceve dall'App lo stato che usa, tutto il resto è importato.
import { t, tr, traduciDato } from '../../i18n';
import { C } from '../tema.js';
import { styles } from '../stili.js';
import { parseAzioneBestia, coloreCategoria } from '../../rules/scheda.js';
import { conSegno } from '../../rules/dadi.js';

export function BestiaDettaglioModal({ aggiorna, bestiaDettaglio, lanciaD20, lanciaDanniDiretti, lingua, notteAttiva, scheda, setBestiaDettaglio }) {
  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 3150, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(5px)', WebkitBackdropFilter: 'blur(5px)' }}
      onClick={() => setBestiaDettaglio(null)}
    >
      <div
        style={{
          ...styles.panel,
          maxWidth: 460,
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          position: 'relative',
          boxShadow: '0 10px 35px rgba(0,0,0,0.5)',
          border: `2px solid ${C.goldDark}`,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: `2px solid ${C.border}`, paddingBottom: 8, marginBottom: 10 }}>
          <div>
            <h2 style={{ fontSize: 18, margin: 0, color: C.goldDark, fontWeight: 800 }}>
              {lingua === 'en' ? bestiaDettaglio.nomeEn : bestiaDettaglio.nome}
            </h2>
            <div style={{ fontSize: 12, color: C.inkDim, fontStyle: 'italic' }}>
              {bestiaDettaglio.taglia} {bestiaDettaglio.tipo || 'bestia'}{bestiaDettaglio.gs != null ? ` · GS ${bestiaDettaglio.gs} (${bestiaDettaglio.gsNum * 200 || 10} PE)` : ''}
            </div>
          </div>
          <button style={styles.buttonMini} onClick={() => setBestiaDettaglio(null)} title={t('tip.chiudi')} aria-label={t('tip.chiudi')}>✕</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6, marginBottom: 12, textAlign: 'center' }}>
          <div style={{ background: C.panelLight, border: `1px solid ${C.border}`, borderRadius: 6, padding: '4px 6px' }}>
            <div style={{ fontSize: 11, color: C.inkDim, textTransform: 'uppercase', fontWeight: 700 }}>{t('armor.classe_armatura')}</div>
            <div style={{ fontSize: 16, fontWeight: 800, color: C.ink }}>{bestiaDettaglio.ca}</div>
          </div>
          <div style={{ background: C.panelLight, border: `1px solid ${C.border}`, borderRadius: 6, padding: '4px 6px' }}>
            <div style={{ fontSize: 11, color: C.inkDim, textTransform: 'uppercase', fontWeight: 700 }}>{t('vital.punti_ferita')}</div>
            <div style={{ fontSize: 16, fontWeight: 800, color: C.ink }}>{bestiaDettaglio.pf} <span style={{ fontSize: 11, fontWeight: 'normal', color: C.inkDim }}>({bestiaDettaglio.pfFormula})</span></div>
          </div>
          <div style={{ background: C.panelLight, border: `1px solid ${C.border}`, borderRadius: 6, padding: '4px 6px' }}>
            <div style={{ fontSize: 11, color: C.inkDim, textTransform: 'uppercase', fontWeight: 700 }}>{t('stat.velocita')}</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.ink, marginTop: 2 }}>
              {bestiaDettaglio.velocita?.terra != null ? `${bestiaDettaglio.velocita.terra}m` : ''}{bestiaDettaglio.velocita?.nuoto ? ` · 🏊${bestiaDettaglio.velocita.nuoto}m` : ''}{bestiaDettaglio.velocita?.volo ? ` · 🦅${bestiaDettaglio.velocita.volo}m` : ''}{bestiaDettaglio.velocita?.scalata ? ` · 🧗${bestiaDettaglio.velocita.scalata}m` : ''}{bestiaDettaglio.velocita?.scavo ? ` · ⛏️${bestiaDettaglio.velocita.scavo}m` : ''}
            </div>
          </div>
        </div>

        {/* Caratteristiche Bestia */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 4, background: C.panelLight, border: `1px solid ${C.border}`, borderRadius: 6, padding: '6px 4px', marginBottom: 12, textAlign: 'center' }}>
          {['forza', 'destrezza', 'costituzione', 'intelligenza', 'saggezza', 'carisma'].map((k) => {
            const val = bestiaDettaglio.car?.[k] || 10;
            const mod = Math.floor((val - 10) / 2);
            return (
              <div key={k}>
                <div style={{ fontSize: 11, textTransform: 'uppercase', fontWeight: 700, color: C.inkDim }}>{k.slice(0, 3)}</div>
                <div style={{ fontSize: 13, fontWeight: 800 }}>{val}</div>
                <div style={{ fontSize: 11, color: C.goldDark, fontWeight: 700 }}>{conSegno(mod)}</div>
              </div>
            );
          })}
        </div>

        {/* Abilità e Sensi */}
        <div style={{ fontSize: 12, marginBottom: 8 }}>
          {bestiaDettaglio.abilita && bestiaDettaglio.abilita !== '—' && (
            <div style={{ marginBottom: 4 }}><strong>{t('bestia.abilita_label')}</strong> {bestiaDettaglio.abilita}</div>
          )}
          {bestiaDettaglio.sensi && (
            <div><strong>{t('bestia.sensi_label')}</strong> {traduciDato(bestiaDettaglio.sensi)}</div>
          )}
        </div>

        {/* Tratti Speciali */}
        {bestiaDettaglio.tratti && bestiaDettaglio.tratti.length > 0 && (
          <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 8, marginTop: 8, marginBottom: 8 }}>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: C.inkDim, marginBottom: 4 }}>{t('bestia.tratti_speciali')}</div>
            {bestiaDettaglio.tratti.map((tItem, idx) => (
              <div key={idx} style={{ fontSize: 12, lineHeight: 1.4, marginBottom: 4 }}>• {tItem}</div>
            ))}
          </div>
        )}

        {/* Azioni e Attacchi */}
        {bestiaDettaglio.azioni && bestiaDettaglio.azioni.length > 0 && (
          <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 8, marginTop: 8 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.goldDark, marginBottom: 6 }}>
              {lingua === 'en' ? 'Actions and attacks' : 'Azioni e attacchi'}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {bestiaDettaglio.azioni.map((azRaw, idx) => {
                const az = parseAzioneBestia(azRaw);
                return (
                  <div
                    key={idx}
                    style={{
                      fontSize: 12,
                      lineHeight: 1.4,
                      background: 'rgba(0,0,0,0.03)',
                      padding: '6px 8px',
                      borderRadius: 6,
                      border: `1px solid ${C.border}`,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 4,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6, flexWrap: 'wrap' }}>
                      <span style={{ fontWeight: 800, color: C.ink }}>{az.nome}</span>
                      {az.cd != null && (
                        <span style={{ fontSize: 11, fontWeight: 700, padding: '1px 5px', background: `${coloreCategoria('tiroSalvezza', notteAttiva)}1f`, color: coloreCategoria('tiroSalvezza', notteAttiva), borderRadius: 4, border: `1px solid ${coloreCategoria('tiroSalvezza', notteAttiva)}` }}>
                          CD {az.cd}
                        </span>
                      )}
                    </div>
                    {az.desc && (
                      <div style={{ fontSize: 12, color: C.ink }}>{az.desc}</div>
                    )}
                    {(az.bonus != null || az.danno) && (
                      <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginTop: 2, paddingTop: 4, borderTop: `1px dashed ${C.border}` }}>
                        {az.bonus != null && (
                          <button
                            type="button"
                            style={{ ...styles.button, fontSize: 11, padding: '3px 8px', borderRadius: 4, fontWeight: 800, borderColor: coloreCategoria('attacco', notteAttiva), color: coloreCategoria('attacco', notteAttiva), background: `${coloreCategoria('attacco', notteAttiva)}1f`, display: 'inline-flex', alignItems: 'center', gap: 3 }}
                            onClick={() => {
                              lanciaD20(`Attacco (${bestiaDettaglio.nome}): ${az.nome}`, az.bonus, {
                                attacco: { nome: `${bestiaDettaglio.nome}: ${az.nome}`, danno: az.danno },
                                suono: 'arma',
                              });
                            }}
                            title={tr(`Tira per colpire: 1d20 ${conSegno(az.bonus)}`, `Attack roll: 1d20 ${conSegno(az.bonus)}`)}
                          >
                            <span>{lingua === 'en' ? 'Attack' : 'Colpisci'} ({conSegno(az.bonus)})</span>
                          </button>
                        )}
                        {az.danno && (
                          <button
                            type="button"
                            style={{ ...styles.button, fontSize: 11, padding: '3px 8px', borderRadius: 4, fontWeight: 800, borderColor: C.red, color: C.red, background: 'transparent', display: 'inline-flex', alignItems: 'center', gap: 3 }}
                            onClick={() => {
                              lanciaDanniDiretti(tr(`Danni (${bestiaDettaglio.nome}): ${az.nome}`, `Damage (${bestiaDettaglio.nome}): ${az.nome}`), az.danno);
                            }}
                            title={tr(`Tira danni: ${az.danno}`, `Roll damage: ${az.danno}`)}
                          >
                            <span>{lingua === 'en' ? 'Damage' : 'Danni'} ({az.danno})</span>
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {bestiaDettaglio.note && (
          <div style={{ fontSize: 11, fontStyle: 'italic', color: C.inkDim, marginTop: 8, borderTop: `1px dashed ${C.border}`, paddingTop: 6 }}>
            {bestiaDettaglio.note}
          </div>
        )}

        {(() => {
          // Usi residui letti dalle risorse di classe (campo reale: `attuali`, non `usi`).
          // Se non esiste una risorsa dedicata, il bottone resta sempre attivo (nessun limite tracciato).
          const risorsaFormaSelvatica = Array.isArray(scheda.risorse)
            ? scheda.risorse.find((r) => /forma\s*(bestiale|selvatica)|wild\s*shape/i.test(r.nome || ''))
            : null;
          const risorsaMetamorfosi = Array.isArray(scheda.risorse)
            ? scheda.risorse.find((r) => /metamorfosi|polymorph/i.test(r.nome || ''))
            : null;
          const formaSelvaticaEsaurita = risorsaFormaSelvatica && Number(risorsaFormaSelvatica.attuali) <= 0;
          const metamorfosiEsaurita = risorsaMetamorfosi && Number(risorsaMetamorfosi.attuali) <= 0;
          return (
        <div style={{ marginTop: 14, display: 'flex', gap: 8 }}>
          {bestiaDettaglio.gs != null && (
            <button
              disabled={formaSelvaticaEsaurita}
              style={{
                ...styles.button, flex: 1, fontWeight: 700,
                ...(formaSelvaticaEsaurita
                  ? { borderColor: C.border, color: C.inkDim, background: C.panelLight, cursor: 'not-allowed', opacity: 0.6 }
                  : { borderColor: C.green || '#3e7d32', color: C.green || '#3e7d32' }),
              }}
              title={formaSelvaticaEsaurita ? (lingua === 'en' ? 'No Wild Shape uses left' : 'Nessun utilizzo di Forma Selvatica rimasto') : undefined}
              onClick={() => {
                if (formaSelvaticaEsaurita) return;
                // Scala 1 uso da Forma Bestiale / Forma Selvatica nelle risorse di classe (se presente)
                let risorseNuove = Array.isArray(scheda.risorse) ? scheda.risorse.map((r) => {
                  if (/forma\s*(bestiale|selvatica)|wild\s*shape/i.test(r.nome || '')) {
                    const att = Number(r.attuali) || 0;
                    return { ...r, attuali: Math.max(0, att - 1) };
                  }
                  return r;
                }) : scheda.risorse;

                const forma = {
                  attiva: true,
                  nome: bestiaDettaglio.nome,
                  nomeEn: bestiaDettaglio.nomeEn || bestiaDettaglio.nome,
                  taglia: bestiaDettaglio.taglia,
                  tipo: bestiaDettaglio.tipo || 'bestia',
                  gs: bestiaDettaglio.gs,
                  ca: bestiaDettaglio.ca,
                  pfMax: bestiaDettaglio.pf,
                  pfAttuali: bestiaDettaglio.pf,
                  pfFormula: bestiaDettaglio.pfFormula,
                  velocita: bestiaDettaglio.velocita || { terra: 9 },
                  car: bestiaDettaglio.car || { forza: 10, destrezza: 10, costituzione: 10 },
                  abilita: bestiaDettaglio.abilita,
                  sensi: bestiaDettaglio.sensi,
                  tratti: bestiaDettaglio.tratti || [],
                  azioni: bestiaDettaglio.azioni || [],
                };

                aggiorna({
                  formaBestiale: forma,
                  ...(scheda.metamorfosi?.attiva ? { metamorfosi: { ...scheda.metamorfosi, attiva: false } } : {}),
                  ...(risorseNuove ? { risorse: risorseNuove } : {})
                });
                setBestiaDettaglio(null);
              }}
            >
              {lingua === 'en' ? `Wild Shape (${bestiaDettaglio.pf} HP)` : `Forma Selvatica (${bestiaDettaglio.pf} PF)`}
            </button>
          )}
          {bestiaDettaglio.gs != null && (
            <button
              disabled={metamorfosiEsaurita}
              style={{
                ...styles.button, flex: 1, fontWeight: 700,
                ...(metamorfosiEsaurita
                  ? { borderColor: C.border, color: C.inkDim, background: C.panelLight, cursor: 'not-allowed', opacity: 0.6 }
                  : { borderColor: '#7b4fb0', color: '#7b4fb0' }),
              }}
              onClick={() => {
                if (metamorfosiEsaurita) return;
                // Scala 1 uso da Metamorfosi nelle risorse di classe (se presente)
                let risorseNuove = Array.isArray(scheda.risorse) ? scheda.risorse.map((r) => {
                  if (/metamorfosi|polymorph/i.test(r.nome || '')) {
                    const att = Number(r.attuali) || 0;
                    return { ...r, attuali: Math.max(0, att - 1) };
                  }
                  return r;
                }) : scheda.risorse;
                const forma = {
                  attiva: true,
                  nome: bestiaDettaglio.nome,
                  nomeEn: bestiaDettaglio.nomeEn || bestiaDettaglio.nome,
                  taglia: bestiaDettaglio.taglia,
                  tipo: bestiaDettaglio.tipo || 'bestia',
                  gs: bestiaDettaglio.gs,
                  ca: bestiaDettaglio.ca,
                  pfMax: bestiaDettaglio.pf,
                  pfAttuali: bestiaDettaglio.pf,
                  pfFormula: bestiaDettaglio.pfFormula,
                  velocita: bestiaDettaglio.velocita || { terra: 9 },
                  car: bestiaDettaglio.car || { forza: 10, destrezza: 10, costituzione: 10, intelligenza: 10, saggezza: 10, carisma: 10 },
                  abilita: bestiaDettaglio.abilita,
                  sensi: bestiaDettaglio.sensi,
                  tratti: bestiaDettaglio.tratti || [],
                  azioni: bestiaDettaglio.azioni || [],
                };
                aggiorna({
                  metamorfosi: forma,
                  ...(scheda.formaBestiale?.attiva ? { formaBestiale: { ...scheda.formaBestiale, attiva: false } } : {}),
                  ...(risorseNuove ? { risorse: risorseNuove } : {}),
                });
                setBestiaDettaglio(null);
              }}
              title={metamorfosiEsaurita
                ? (lingua === 'en' ? 'No Metamorphosis uses left' : 'Nessun utilizzo di Metamorfosi rimasto')
                : (lingua === 'en' ? 'Polymorph: replaces all ability scores, including mental ones' : 'Metamorfosi: sostituisce tutte le caratteristiche, incluse quelle mentali')}
            >
              {lingua === 'en' ? `Metamorphosis (${bestiaDettaglio.pf} HP)` : `Metamorfosi (${bestiaDettaglio.pf} PF)`}
            </button>
          )}
        </div>
          );
        })()}
      </div>
    </div>
  );
}
