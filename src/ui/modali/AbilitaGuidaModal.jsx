// Estratto da App.jsx (finestra "AbilitaGuidaModal"): riceve dall'App lo stato che usa, tutto il resto è importato.
import { t, tr } from '../../i18n';
import { C } from '../tema.js';
import { styles } from '../stili.js';
import { bonusAbilita } from '../../rules/scheda.js';
import { CARATTERISTICHE } from '../../data/caratteristiche.js';
import { conSegno, tiraDado } from '../../rules/dadi.js';
import { dettagliAbilita } from '../../rules/regole.js';

export function AbilitaGuidaModal({ conAnimazione, lingua, modalAbilitaGuida, registra, scheda, setModalAbilitaGuida, setTiro }) {
  const infoAb = dettagliAbilita(modalAbilitaGuida, scheda);
  if (!infoAb) return null;
  const bonus = bonusAbilita(scheda, modalAbilitaGuida);
  const liv = scheda.abilita?.[modalAbilitaGuida] || 0;
  const carAbbr = (CARATTERISTICHE.find((c) => c.key === infoAb.car)?.abbr || infoAb.car).toUpperCase();

  const eseguiTiro = (vantaggio = 0) => {
    setModalAbilitaGuida(null);
    const d1 = tiraDado(20);
    const d2 = tiraDado(20);
    const d = vantaggio === 1 ? Math.max(d1, d2) : vantaggio === -1 ? Math.min(d1, d2) : d1;
    const tot = d + bonus;
    const etichVant = vantaggio === 1 ? ' (Vantaggio)' : vantaggio === -1 ? ' (Svantaggio)' : '';
    const dettVant = vantaggio === 1
      ? `2d20 [${d1}, ${d2}] max -> [${d}] ${conSegno(bonus)}`
      : vantaggio === -1
        ? `2d20 [${d1}, ${d2}] min -> [${d}] ${conSegno(bonus)}`
        : `1d20 [${d}] ${conSegno(bonus)}`;

    conAnimazione(() => {
      setTiro({
        etichetta: `${t('skill.' + modalAbilitaGuida)}${etichVant}`,
        naturale: d,
        dadi: vantaggio === 0 ? [d1] : [d1, d2],
        bonus,
        totale: tot,
        modalita: vantaggio === 1 ? 'vantaggio' : vantaggio === -1 ? 'svantaggio' : 'normale',
      });
      registra({
        etichetta: `${t('skill.' + modalAbilitaGuida)}${etichVant}`,
        tipo: 'prova',
        totale: tot,
        dettaglio: dettVant,
      });
    }, d);
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0,0,0,0.6)',
        backdropFilter: 'blur(3px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: 16,
      }}
      onClick={(e) => { if (e.target === e.currentTarget) setModalAbilitaGuida(null); }}
    >
      <div
        style={{
          background: C.panel,
          border: `1px solid ${C.border}`,
          borderRadius: 12,
          maxWidth: 620,
          width: '100%',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 8px 30px rgba(0,0,0,0.3)',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div style={{ padding: '14px 18px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: C.panelLight }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div>
              <strong style={{ fontSize: 16, color: C.ink }}>
                {lingua === 'en' ? infoAb.nomeEn : infoAb.nomeIt}
              </strong>
              <span style={{ fontSize: 11, color: C.inkDim, marginLeft: 8 }}>
                ({carAbbr}) • {liv === 3 ? tr('✦ Maestria', '✦ Expertise') : liv === 2 ? tr('★ Competenza razza/classe', '★ Species/class proficiency') : liv === 1 ? tr('● Competente', '● Proficient') : tr('○ Non competente', '○ Not proficient')}
              </span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <strong style={{ fontSize: 16, color: C.goldDark, background: 'rgba(201,162,39,0.12)', padding: '2px 8px', borderRadius: 6, border: `1px solid ${C.gold}` }}>
              {conSegno(bonus)}
            </strong>
            <button
              type="button"
              onClick={() => setModalAbilitaGuida(null)}
              style={{ ...styles.buttonMini, fontSize: 13, padding: '2px 8px' }}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Pulsanti di Tiro Rapido */}
        <div style={{ padding: '12px 18px', background: C.panelLight, borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => eseguiTiro(0)}
            style={{ ...styles.buttonMini, fontSize: 12, fontWeight: 700, padding: '5px 12px', background: 'rgba(201,162,39,0.15)', borderColor: C.gold, color: C.goldDark }}
          >
            {lingua === 'en' ? 'Normal Roll' : 'Tiro Normale'} ({conSegno(bonus)})
          </button>
          <button
            type="button"
            onClick={() => eseguiTiro(1)}
            style={{ ...styles.buttonMini, fontSize: 12, fontWeight: 700, padding: '5px 12px', background: 'rgba(46,157,77,0.15)', borderColor: C.green, color: C.green }}
          >
            {lingua === 'en' ? 'Advantage' : 'Con Vantaggio'}
          </button>
          <button
            type="button"
            onClick={() => eseguiTiro(-1)}
            style={{ ...styles.buttonMini, fontSize: 12, fontWeight: 700, padding: '5px 12px', background: 'rgba(239,68,68,0.12)', borderColor: C.red, color: C.red }}
          >
            {lingua === 'en' ? 'Disadvantage' : 'Con Svantaggio'}
          </button>
        </div>

        {/* Corpo Modale: Descrizione, CD e Sinergie */}
        <div style={{ padding: '16px 18px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Descrizione 5e */}
          <div style={{ fontSize: 13, color: C.ink, lineHeight: 1.45, background: C.panel, padding: '10px 12px', borderRadius: 8, border: `1px solid ${C.border}` }}>
            {lingua === 'en' ? infoAb.descrizioneEn : infoAb.descrizioneIt}
          </div>

          {/* Tabella CD di Riferimento */}
          <div>
            <h4 style={{ fontSize: 12, letterSpacing: 0.5, color: C.goldDark, marginBottom: 6 }}>
              {lingua === 'en' ? 'Official Reference DCs (Difficulty Class)' : 'Classi di Difficoltà Ufficiali (CD)'}
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {(infoAb.esempiCd || []).map((ex) => (
                <div
                  key={ex.cd}
                  style={{
                    display: 'flex',
                    alignItems: 'baseline',
                    gap: 8,
                    fontSize: 12,
                    padding: '4px 8px',
                    background: C.panelLight,
                    borderRadius: 6,
                    border: `1px solid ${C.border}`,
                  }}
                >
                  <strong style={{ width: 44, color: ex.cd >= 25 ? C.red : ex.cd >= 20 ? C.goldDark : C.green, flexShrink: 0 }}>
                    CD {ex.cd}
                  </strong>
                  <span style={{ width: 85, color: C.inkDim, fontSize: 11, flexShrink: 0, fontWeight: 600 }}>
                    ({lingua === 'en' ? ex.diffEn : ex.diffIt})
                  </span>
                  <span style={{ color: C.ink, lineHeight: 1.3 }}>
                    {lingua === 'en' ? ex.esEn : ex.esIt}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Sinergie con Strumenti (Xanathar p. 78-85) */}
          {(infoAb.sinergie || []).length > 0 && (
            <div>
              <h4 style={{ fontSize: 12, letterSpacing: 0.5, color: C.goldDark, marginBottom: 6 }}>
                {lingua === 'en' ? 'Tool Synergies (Xanathar\'s Guide)' : 'Sinergie con gli Strumenti (Xanathar)'}
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {infoAb.sinergie.map((syn) => (
                  <div
                    key={syn.strumento}
                    style={{
                      padding: '8px 10px',
                      borderRadius: 8,
                      background: syn.posseduto ? 'rgba(46,157,77,0.08)' : C.panelLight,
                      border: `1px solid ${syn.posseduto ? C.green : C.border}`,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 3,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6 }}>
                      <strong style={{ fontSize: 12, color: syn.posseduto ? C.green : C.ink }}>
                        {syn.strumento}
                      </strong>
                      {syn.posseduto ? (
                        <span style={{ fontSize: 11, fontWeight: 700, color: C.green, background: 'rgba(46,157,77,0.15)', padding: '1px 6px', borderRadius: 4 }}>
                          ✓ {lingua === 'en' ? 'Possessed / Proficient' : 'Posseduto / Addestrato'}
                        </span>
                      ) : (
                        <span style={{ fontSize: 11, color: C.inkDim }}>
                          {lingua === 'en' ? 'Not in inventory' : 'Non posseduto'}
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: 11, color: C.inkDim, lineHeight: 1.35 }}>
                      {lingua === 'en' ? syn.beneficioEn : syn.beneficioIt}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
      }
