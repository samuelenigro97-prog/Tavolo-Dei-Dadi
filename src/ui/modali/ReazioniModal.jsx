// Estratto da App.jsx (finestra "ReazioniModal"): riceve dall'App lo stato che usa, tutto il resto è importato.
import { eseguiEffettoSonoro } from '../../utils/audioAmbiente';
import { C } from '../tema.js';
import { styles } from '../stili.js';
import { REAZIONI_5E } from '../../data/dati5e.js';
import { trovaReazioniDisponibili } from '../../rules/regole.js';
import { idUnico } from '../../utils/idUnici.js';

export function ReazioniModal({ aggiorna, lingua, registra, scheda, setInfo, setMostraModalReazioni, suoniEffOn, versione, volumeEffetti }) {
  const reazioniDisponibili = trovaReazioniDisponibili(scheda);
  const reazioneUsata = Boolean(scheda.reazioneUsata);

  const eseguiReazione = (r) => {
    aggiorna({ reazioneUsata: true });
    const desc = lingua === 'en' ? (r.effettoEn || r.innescoEn) : (r.effettoIt || r.innescoIt);
    registra({ etichetta: `${r.nome}`, tipo: 'reazione', dettaglio: `${r.nome} (${lingua === 'en' ? r.innescoEn : r.innescoIt}): ${desc}` });
    if (suoniEffOn) eseguiEffettoSonoro(r.tipo === 'incantesimo' ? 'magia' : 'arma', volumeEffetti);
    setMostraModalReazioni(false);
    setInfo({
      titolo: `${r.nome}`,
      testo: `${lingua === 'en' ? 'Trigger' : 'Innesco'}: ${lingua === 'en' ? r.innescoEn : r.innescoIt}\n\n🛡️ ${lingua === 'en' ? 'Effect' : 'Effetto'}: ${lingua === 'en' ? r.effettoEn : r.effettoIt}`,
    });
  };

  const aggiungiAgliAttacchi = (r) => {
    const matchDb = REAZIONI_5E.find((x) => x.nome.toLowerCase() === r.nome.toLowerCase());
    const nuovo = {
      id: idUnico('att'),
      nome: r.nome,
      categoria: 'Reazione',
      bonus: 0,
      danno: matchDb?.danno || '',
      tipoDanno: matchDb?.tipoDanno || '',
      note: lingua === 'en' ? `${r.innescoEn} • ${r.effettoEn}` : `${r.innescoIt} • ${r.effettoIt}`,
    };
    aggiorna({ attacchi: [...(scheda.attacchi || []), nuovo] });
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
      onClick={(e) => { if (e.target === e.currentTarget) setMostraModalReazioni(false); }}
    >
      <div
        style={{
          background: C.panel,
          border: `1px solid ${C.border}`,
          borderRadius: 12,
          maxWidth: 580,
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
            <strong style={{ fontSize: 15, color: C.goldDark }}>
              {lingua === 'en' ? `Reactions and combat triggers (${versione === '2024' ? '5.5' : '5e'})` : `Reazioni e inneschi in combattimento (${versione === '2024' ? '5.5' : '5e'})`}
            </strong>
          </div>
          <button
            type="button"
            onClick={() => setMostraModalReazioni(false)}
            style={{ ...styles.buttonMini, fontSize: 13, padding: '2px 8px' }}
          >
            ✕
          </button>
        </div>

        {/* Stato Reazione del Round */}
        <div style={{ padding: '10px 18px', background: reazioneUsata ? 'rgba(239,68,68,0.1)' : 'rgba(46,157,77,0.12)', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 18 }}>{reazioneUsata ? '🔴' : '🟢'}</span>
            <div>
              <strong style={{ fontSize: 13, color: reazioneUsata ? C.red : C.green }}>
                {reazioneUsata
                  ? (lingua === 'en' ? 'Reaction used this round' : 'Reazione già usata in questo round')
                  : (lingua === 'en' ? 'Reaction available' : 'Reazione disponibile')}
              </strong>
              <div style={{ fontSize: 11, color: C.inkDim }}>
                {lingua === 'en' ? 'Max 1 reaction per round. Resets at start of your turn.' : 'Massimo 1 reazione per round. Si ripristina all\'inizio del tuo turno.'}
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => aggiorna({ reazioneUsata: !reazioneUsata })}
            style={{
              ...styles.buttonMini,
              fontSize: 11,
              padding: '3px 9px',
              borderColor: reazioneUsata ? C.green : C.border,
              color: reazioneUsata ? C.green : C.ink,
            }}
          >
            {reazioneUsata ? (lingua === 'en' ? '↺ Reset Reaction' : '↺ Ripristina Reazione') : (lingua === 'en' ? 'Mark as Used' : 'Segna come Usata')}
          </button>
        </div>

        {/* Lista Reazioni Rilevate */}
        <div style={{ padding: '16px 18px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {reazioniDisponibili.map((r) => {
            const giaInAttacchi = (scheda.attacchi || []).some((a) => (a.nome || '').toLowerCase() === r.nome.toLowerCase() && a.categoria === 'Reazione');
            return (
              <div
                key={r.nome}
                style={{
                  background: C.panelLight,
                  border: `1px solid ${C.border}`,
                  borderRadius: 8,
                  padding: '10px 12px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 6,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 14 }}>{r.tipo === 'incantesimo' ? '📖' : r.tipo === 'privilegio' ? '🛡️' : r.tipo === 'talento' ? '⭐' : '⚔️'}</span>
                    <strong style={{ fontSize: 13, color: C.ink }}>{r.nome}</strong>
                    <span style={{ fontSize: 11, textTransform: 'uppercase', padding: '1px 5px', borderRadius: 4, background: 'rgba(0,0,0,0.06)', color: C.inkDim, fontWeight: 700 }}>
                      {r.tipo}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    {!giaInAttacchi && (
                      <button
                        type="button"
                        onClick={() => aggiungiAgliAttacchi(r)}
                        style={{ ...styles.buttonMini, fontSize: 11, padding: '2px 6px' }}
                        title={lingua === 'en' ? 'Add to quick attacks list' : 'Aggiungi alla tabella attacchi/reazioni'}
                      >
                        {lingua === 'en' ? 'Pin' : 'Aggiungi'}
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => eseguiReazione(r)}
                      disabled={reazioneUsata}
                      style={{
                        ...styles.buttonMini,
                        fontSize: 11,
                        fontWeight: 700,
                        padding: '2px 8px',
                        background: reazioneUsata ? 'rgba(0,0,0,0.05)' : 'rgba(46,157,77,0.12)',
                        color: reazioneUsata ? C.inkDim : C.green,
                        borderColor: reazioneUsata ? C.border : C.green,
                        cursor: reazioneUsata ? 'not-allowed' : 'pointer',
                      }}
                    >
                      {lingua === 'en' ? 'Trigger' : 'Usa Reazione'}
                    </button>
                  </div>
                </div>

                {/* Innesco */}
                <div style={{ fontSize: 12, color: C.goldDark, background: 'rgba(201,162,39,0.08)', padding: '4px 8px', borderRadius: 6, lineHeight: 1.3 }}>
                  <strong>{lingua === 'en' ? 'Trigger' : 'Innesco'}:</strong> {lingua === 'en' ? r.innescoEn : r.innescoIt}
                </div>

                {/* Effetto */}
                <div style={{ fontSize: 11, color: C.inkDim, lineHeight: 1.35, paddingLeft: 4 }}>
                  <strong>{lingua === 'en' ? 'Effect' : 'Effetto'}:</strong> {lingua === 'en' ? r.effettoEn : r.effettoIt}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
      }
