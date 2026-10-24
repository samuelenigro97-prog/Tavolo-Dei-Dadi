// Estratto da App.jsx (finestra "ConcentrazioneModal"): riceve dall'App lo stato che usa, tutto il resto è importato.
import { t } from '../../i18n';
import { C } from '../tema.js';
import { styles } from '../stili.js';
import { BadgeTiroSalvezza } from '../componenti.jsx';
import { conSegno, modalitaEffettiva } from '../../rules/dadi.js';
import { calcolaTsConcentrazione } from '../../rules/regole.js';
import { effettiSfinimento, trovaVantaggioTiroSalvezza } from '../../rules/scheda.js';

export function ConcentrazioneModal({ aggiorna, checkConc, lingua, registra, scheda, setCheckConc }) {
  const tsInfo = calcolaTsConcentrazione(scheda, checkConc.danno);
  const sfin = effettiSfinimento(scheda);
  const penSfin = sfin ? sfin.penalitaD20 : 0;
  const bonusCon = tsInfo.bonus - penSfin;
  const esito = checkConc.esito;
  const vTsCos = trovaVantaggioTiroSalvezza(scheda, 'costituzione');
  const haVantConc = Boolean(tsInfo.haIncantatoreDaGuerra || vTsCos?.condizionale === 'magia');

  const eseguiTiroConc = (vantaggio = 0) => {
    const modBase = vantaggio === 1 ? 'vantaggio' : vantaggio === -1 ? 'svantaggio' : 'normale';
    const modUsata = modalitaEffettiva(modBase, sfin.svantaggioAttacchiSalvezza);

    const d1 = Math.floor(Math.random() * 20) + 1;
    const d2 = Math.floor(Math.random() * 20) + 1;
    const d20 = modUsata === 'vantaggio' ? Math.max(d1, d2) : modUsata === 'svantaggio' ? Math.min(d1, d2) : d1;
    const tot = d20 + bonusCon;
    const passa = d20 === 20 ? true : d20 === 1 ? false : tot >= checkConc.cd;
    const etichVant = modUsata === 'vantaggio' ? ' (Vantaggio)' : modUsata === 'svantaggio' ? ' (Svantaggio)' : '';
    const dettDadi = modUsata !== 'normale' ? `2d20 [${d1}, ${d2}] -> [${d20}] ${conSegno(bonusCon)}` : `d20 [${d20}] ${conSegno(bonusCon)}`;

    registra({
      etichetta: `${t('conc.ts')}${etichVant}`,
      tipo: 'd20',
      naturale: d20,
      totale: tot,
      dettaglio: `${dettDadi} = ${tot} · CD ${checkConc.cd} (${checkConc.spell})${penSfin ? ` · sfin. −${penSfin}` : ''} → ${passa ? 'Mantenuta' : 'Persa'}`,
      critico: d20 === 20,
      fumble: d20 === 1,
    });

    if (!passa) {
      aggiorna({ concentrazione: '' });
    }
    setCheckConc({ ...checkConc, esito: { d20, tot, passa, d1, d2, vantaggio: modUsata === 'vantaggio' ? 1 : modUsata === 'svantaggio' ? -1 : 0 } });
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 3300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(3px)' }} onClick={() => setCheckConc(null)}>
      <div style={{ ...styles.panel, maxWidth: 420, width: '100%', boxShadow: '0 8px 30px rgba(0,0,0,0.4)', borderRadius: 12 }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <strong style={{ color: C.goldDark, fontSize: 16, display: 'flex', alignItems: 'center', gap: 6 }}>
            {t('conc.auto_titolo')}
          </strong>
          {/* TS di Costituzione: il colore della Costituzione, come il suo riquadro. */}
          <BadgeTiroSalvezza cd={checkConc.cd} caratteristica="Costituzione" colore={C.goldDark} />
        </div>

        <div style={{ fontSize: 13, lineHeight: 1.45, color: C.ink, marginBottom: 10 }}>
          {lingua === 'en'
            ? `You took ${checkConc.danno} damage while concentrating on `
            : `Hai subito ${checkConc.danno} danni mentre ti concentri su `}
          <strong style={{ color: C.goldDark }}>{checkConc.spell}</strong>.
          <div style={{ fontSize: 11, color: C.inkDim, marginTop: 4 }}>
            {tsInfo.spiegazioneCd}
          </div>
        </div>

        {haVantConc && !esito && (
          <div style={{ fontSize: 12, background: 'rgba(46,157,77,0.12)', border: '1px solid var(--c-green)', borderRadius: 6, padding: '5px 8px', marginBottom: 10, color: C.green, fontWeight: 600 }}>
            <strong>{lingua === 'en' ? 'War Caster / Eldritch Mind / Advantage' : 'Incantatore da Guerra / Mente Occulta / Vantaggio'}</strong>: {lingua === 'en' ? 'You have Advantage on concentration saves!' : 'Hai Vantaggio sui TS di concentrazione!'}
          </div>
        )}

        {!esito ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 10 }}>
            <button
              type="button"
              style={{
                ...styles.button,
                width: '100%',
                fontWeight: 700,
                background: haVantConc ? 'rgba(46,157,77,0.15)' : 'rgba(201,162,39,0.18)',
                borderColor: haVantConc ? C.green : C.gold,
                color: haVantConc ? C.green : C.goldDark,
              }}
              onClick={() => eseguiTiroConc(haVantConc ? 1 : 0)}
            >
              {haVantConc ? (lingua === 'en' ? 'Roll with Advantage' : 'Tira con Vantaggio') : t('conc.ts')} ({conSegno(bonusCon)})
            </button>
            <div style={{ display: 'flex', gap: 6 }}>
              <button
                type="button"
                style={{ ...styles.buttonMini, flex: 1, fontSize: 11 }}
                onClick={() => eseguiTiroConc(1)}
              >
                {lingua === 'en' ? 'Advantage' : 'Con Vantaggio'}
              </button>
              <button
                type="button"
                style={{ ...styles.buttonMini, flex: 1, fontSize: 11 }}
                onClick={() => eseguiTiroConc(-1)}
              >
                {lingua === 'en' ? 'Disadvantage' : 'Con Svantaggio'}
              </button>
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center', marginBottom: 12, padding: '10px', background: C.panelLight, borderRadius: 8, border: `1px solid ${esito.passa ? C.green : C.red}` }}>
            <div style={{ fontSize: 13, color: C.inkDim }}>
              {esito.vantaggio !== 0 ? `2d20 [${esito.d1}, ${esito.d2}] -> [${esito.d20}]` : `d20 [${esito.d20}]`} {conSegno(bonusCon)} = <strong style={{ fontSize: 14, color: C.ink }}>{esito.tot}</strong> · CD {checkConc.cd}
            </div>
            <div style={{ fontSize: 16, fontWeight: 800, marginTop: 6, color: esito.passa ? C.green : C.red }}>
              {esito.passa
                ? `${lingua === 'en' ? 'Concentration maintained' : 'Concentrazione mantenuta'}`
                : `${lingua === 'en' ? 'Concentration lost' : 'Concentrazione persa'}`}
            </div>
          </div>
        )}
        <button type="button" style={{ ...styles.buttonMini, width: '100%' }} onClick={() => setCheckConc(null)}>{t('modal.chiudi')}</button>
      </div>
    </div>
  );
      }
