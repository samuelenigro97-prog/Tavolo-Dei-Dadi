// Estratto da App.jsx (finestra "AggiungiCompagnoModal"): riceve dall'App lo stato che usa, tutto il resto è importato.
import { C } from '../tema.js';
import { styles } from '../stili.js';
import { BESTIE, FAMIGLI, EVOCAZIONI, raggruppaPerGS } from '../../data/bestiario.js';
import { calcolaPfCompagno, parseAzioniCompagno } from '../../rules/regole.js';

export function AggiungiCompagnoModal({ aggiorna, cercaCompagnoText, filtroCompagnoCat, lingua, registra, scheda, setBestiaDettaglio, setCercaCompagnoText, setFiltroCompagnoCat, setMostraModalAggiungiCompagno }) {
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
      onClick={(e) => { if (e.target === e.currentTarget) setMostraModalAggiungiCompagno(false); }}
    >
      <div
        style={{
          background: C.panel,
          border: `1px solid ${C.border}`,
          borderRadius: 12,
          maxWidth: 620,
          width: '100%',
          maxHeight: '85vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 8px 30px rgba(0,0,0,0.3)',
          overflow: 'hidden',
        }}
      >
        {/* Header Modale */}
        <div style={{ padding: '14px 18px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <strong style={{ fontSize: 15, color: C.goldDark }}>
            {lingua === 'en' ? 'Summon / Add Companion or Familiar' : 'Evoca / Aggiungi Compagno o Famiglio'}
          </strong>
          <button
            type="button"
            onClick={() => setMostraModalAggiungiCompagno(false)}
            style={{ ...styles.buttonMini, fontSize: 13, padding: '2px 8px' }}
          >
            ✕
          </button>
        </div>

        {/* Filtri e Ricerca */}
        <div style={{ padding: '12px 18px 8px', display: 'flex', flexDirection: 'column', gap: 8, borderBottom: `1px solid ${C.border}`, background: C.panelLight }}>
          <input
            type="text"
            placeholder={lingua === 'en' ? 'Search creature name...' : 'Cerca nome creatura...'}
            value={cercaCompagnoText}
            onChange={(e) => setCercaCompagnoText(e.target.value)}
            style={{ ...styles.inlineInput, width: '100%', padding: '6px 10px', fontSize: 13 }}
          />
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            {[
              { id: 'tutti', label: lingua === 'en' ? 'All' : 'Tutti' },
              { id: 'famigli', label: lingua === 'en' ? 'Familiars' : 'Famigli' },
              { id: 'compagni', label: lingua === 'en' ? 'Class Companions' : 'Compagni di Classe' },
              { id: 'evocazioni', label: lingua === 'en' ? 'Summons' : 'Evocazioni' },
              { id: 'bestie', label: lingua === 'en' ? 'Beasts' : 'Bestie' },
              { id: 'custom', label: lingua === 'en' ? 'Custom' : 'Personalizzato' },
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setFiltroCompagnoCat(cat.id)}
                style={{
                  ...styles.buttonMini,
                  fontSize: 11,
                  padding: '2px 8px',
                  background: filtroCompagnoCat === cat.id ? C.goldDark : 'transparent',
                  color: filtroCompagnoCat === cat.id ? '#fff' : C.ink,
                  borderColor: filtroCompagnoCat === cat.id ? C.goldDark : C.border,
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Elenco Creature */}
        <div style={{ padding: 16, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
          {filtroCompagnoCat === 'custom' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: 12, background: C.panelLight, borderRadius: 8, border: `1px solid ${C.border}` }}>
              <div style={{ fontWeight: 700, fontSize: 13, color: C.goldDark }}>
                {lingua === 'en' ? 'Create Custom Creature / Ally' : 'Crea Creatura / Alleato Personalizzato'}
              </div>
              <button
                type="button"
                onClick={() => {
                  const idNuovo = `all-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
                  const nuovo = {
                    id: idNuovo,
                    nome: `Creatura ${(scheda.alleati || []).length + 1}`,
                    tipo: 'Personalizzato',
                    taglia: 'Media',
                    ca: 12,
                    pfMax: 15,
                    pfAttuali: 15,
                    velocita: '9m',
                    azioni: [{ id: 'az-1', nome: 'Attacco Base', bonusAttacco: 3, danno: '1d6+1', tipoDanno: 'contundente', testoCompleto: 'Attacco Base: +3 a colpire, 1d6+1 danni' }],
                  };
                  aggiorna({ alleati: [...(scheda.alleati || []), nuovo] });
                  setMostraModalAggiungiCompagno(false);
                }}
                style={{ ...styles.buttonMini, fontSize: 12, padding: '6px 14px', background: C.goldDark, color: C.onGold, alignSelf: 'flex-start', fontWeight: 700 }}
              >
                {lingua === 'en' ? 'Add Empty Custom Creature' : 'Aggiungi Creatura Vuota'}
              </button>
            </div>
          ) : (
            (() => {
              const q = cercaCompagnoText.trim().toLowerCase();
              let elenco = [];
              if (filtroCompagnoCat === 'famigli') elenco = FAMIGLI;
              else if (filtroCompagnoCat === 'compagni') elenco = FAMIGLI.filter((c) => /compagno|artificiere|difensore/i.test(c.nome || c.tipo || ''));
              else if (filtroCompagnoCat === 'evocazioni') elenco = EVOCAZIONI;
              else if (filtroCompagnoCat === 'bestie') elenco = BESTIE;
              else elenco = [...FAMIGLI, ...EVOCAZIONI, ...BESTIE];

              if (q) {
                elenco = elenco.filter((c) => (c.nome || '').toLowerCase().includes(q) || (c.nomeEn || '').toLowerCase().includes(q) || (c.tipo || '').toLowerCase().includes(q));
              }

              if (elenco.length === 0) {
                return (
                  <div style={{ textAlign: 'center', padding: 24, color: C.inkDim, fontSize: 12 }}>
                    {lingua === 'en' ? 'No creatures found matching search.' : 'Nessuna creatura trovata con questo filtro.'}
                  </div>
                );
              }

              const scheda_card = (c, i) => {
                const pfCalc = calcolaPfCompagno(c, scheda);
                return (
                  <div
                    key={c.nome + i}
                    style={{
                      background: C.panelLight,
                      border: `1px solid ${C.border}`,
                      borderRadius: 8,
                      padding: '8px 10px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 4,
                      justifyContent: 'space-between',
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 13, color: C.ink }}>
                        {lingua === 'en' ? c.nomeEn : c.nome}
                      </div>
                      <div style={{ fontSize: 11, color: C.inkDim }}>
                        CA {c.ca} · {pfCalc} PF {c.pfFormula ? `(${c.pfFormula})` : ''} · {typeof c.velocita === 'object' ? Object.entries(c.velocita).map(([k, v]) => `${k} ${v}m`).join(', ') : c.velocita}
                      </div>
                      {c.tipo && (
                        <div style={{ fontSize: 11, color: C.goldDark, marginTop: 1 }}>
                          {c.tipo}
                        </div>
                      )}
                    </div>

                    <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
                      <button
                        type="button"
                        onClick={() => {
                          const pfCalc = calcolaPfCompagno(c, scheda);
                          const azioniParsed = parseAzioniCompagno(c.azioni || []);
                          const idNuovo = `all-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
                          const nuovo = {
                            id: idNuovo,
                            nome: c.nome,
                            nomeOriginale: c.nome,
                            tipo: c.tipo || c.taglia || 'Compagno',
                            taglia: c.taglia || 'Media',
                            ca: Number(c.ca) || 12,
                            pfMax: pfCalc,
                            pfAttuali: pfCalc,
                            velocita: c.velocita ? (typeof c.velocita === 'object' ? Object.entries(c.velocita).map(([k, v]) => `${k} ${v}m`).join(', ') : c.velocita) : '9m',
                            sensi: c.sensi || '',
                            abilita: c.abilita || '',
                            tratti: Array.isArray(c.tratti) ? c.tratti : [],
                            azioni: azioniParsed,
                            note: c.note || '',
                          };
                          aggiorna({ alleati: [...(scheda.alleati || []), nuovo] });
                          setMostraModalAggiungiCompagno(false);
                          registra({ etichetta: `${c.nome}`, tipo: 'evoca', dettaglio: `Evocato/aggiunto compagno: ${c.nome} (${pfCalc} PF, CA ${c.ca})` });
                        }}
                        style={{ ...styles.buttonMini, fontSize: 11, padding: '3px 8px', background: C.goldDark, color: C.onGold, fontWeight: 700, flex: 1 }}
                      >
                        {lingua === 'en' ? 'Summon / Add' : 'Evoca / Aggiungi'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setBestiaDettaglio(c)}
                        style={{ ...styles.buttonMini, fontSize: 11, padding: '3px 8px' }}
                      >
                        {lingua === 'en' ? 'Info' : 'Dettagli'}
                      </button>
                    </div>
                  </div>
                );
              };

              // Bestie ha un Grado di Sfida: raggruppa in "cartelle" GS crescente
              // con un divisore tra un GS e il successivo, alfabetico dentro ogni gruppo
              // (stesso pattern del catalogo Forma Selvatica/Metamorfosi).
              if (filtroCompagnoCat === 'bestie') {
                return (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {raggruppaPerGS(elenco).map((gruppo) => (
                      <details key={gruppo.gsNum} open>
                        <summary
                          style={{
                            cursor: 'pointer',
                            fontSize: 12, fontWeight: 700, color: C.goldDark,
                            background: 'rgba(200,140,20,0.10)',
                            border: `1px solid ${C.border}`,
                            borderRadius: 6,
                            padding: '4px 8px',
                            marginBottom: 6,
                            listStyle: 'none',
                            userSelect: 'none',
                          }}
                        >
                          GS {gruppo.gs} <span style={{ fontWeight: 500, color: C.inkDim }}>· {gruppo.creature.length} {gruppo.creature.length === 1 ? (lingua === 'en' ? 'creature' : 'creatura') : (lingua === 'en' ? 'creatures' : 'creature')}</span>
                        </summary>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 8, marginBottom: 10 }}>
                          {gruppo.creature.map((c, i) => scheda_card(c, i))}
                        </div>
                      </details>
                    ))}
                  </div>
                );
              }

              const elencoOrdinato = [...elenco].sort((a, b) => (lingua === 'en' ? (a.nomeEn || a.nome) : a.nome).localeCompare(lingua === 'en' ? (b.nomeEn || b.nome) : b.nome, lingua === 'en' ? 'en' : 'it'));

              return (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 8 }}>
                  {elencoOrdinato.map((c, i) => scheda_card(c, i))}
                </div>
              );
            })()
          )}
        </div>
      </div>
    </div>
  );
}
