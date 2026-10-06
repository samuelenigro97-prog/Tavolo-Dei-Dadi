// Estratto da App.jsx (finestra "DiarioModal"): riceve dall'App lo stato che usa, tutto il resto è importato.
import { t, tr } from '../../i18n';
import { C } from '../tema.js';
import { styles } from '../stili.js';
import { AreaTesto } from '../componenti.jsx';

export function DiarioModal({ aggiorna, filtroDiario, lingua, scheda, setConferma, setFiltroDiario, setMostraDiarioModal, setVociDiarioChiuse, vociDiarioChiuse }) {
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
      onClick={(e) => { if (e.target === e.currentTarget) setMostraDiarioModal(false); }}
    >
      <div
        style={{
          ...styles.panel,
          maxWidth: 900,
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
        {/* Header Modale Diario */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, borderBottom: `1px solid ${C.border}`, paddingBottom: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div>
              <h2 style={{ ...styles.title, margin: 0, fontSize: 20, letterSpacing: 0.5, color: C.ink }}>
                {t('sez.diario')}
              </h2>
              <div style={{ ...styles.detail, fontSize: 12, color: C.goldDark, fontWeight: 700 }}>
                {scheda.nome || (lingua === 'en' ? 'Character' : 'Personaggio')}
              </div>
            </div>
          </div>
          <button
            type="button"
            style={{ ...styles.buttonMini, fontSize: 16, padding: '2px 10px', color: C.inkDim, borderRadius: 6 }}
            onClick={() => setMostraDiarioModal(false)}
            title={t('modal.chiudi')}
          >
            ✕
          </button>
        </div>

        {/* Corpo Diario */}
        {(() => {
          const diario = Array.isArray(scheda.diario) ? scheda.diario : [];
          const modificaVoce = (id, patch) =>
            aggiorna({ diario: diario.map((v) => (v.id === id ? { ...v, ...patch } : v)) });
          const oggi = new Date().toISOString().slice(0, 10);
          const qDiario = filtroDiario.trim().toLowerCase();
          const diarioFiltrato = qDiario
            ? diario.filter((v) => (v.titolo || '').toLowerCase().includes(qDiario) || (v.testo || '').toLowerCase().includes(qDiario) || (v.data || '').includes(qDiario))
            : diario;

          const copiaDiario = () => {
            const testo = diario.map((v, i) => `=== ${tr('Sessione', 'Session')} ${diario.length - i}: ${v.titolo || tr('Senza titolo', 'Untitled')} (${v.data || tr('Nessuna data', 'No date')}) ===\n\n${v.testo || ''}\n`).join('\n---\n\n');
            navigator.clipboard?.writeText(testo);
            alert(lingua === 'en' ? 'Journal copied to the clipboard.' : 'Diario copiato negli appunti.');
          };

          const copiaVoce = (v) => {
            const testo = `${tr('Sessione', 'Session')}: ${v.titolo || tr('Senza titolo', 'Untitled')} (${v.data || tr('Nessuna data', 'No date')})\n\n${v.testo || ''}`;
            navigator.clipboard?.writeText(testo);
            alert(lingua === 'en' ? 'Session copied to the clipboard.' : 'Sessione copiata negli appunti.');
          };

          const scaricaDiario = () => {
            const nomePG = (scheda.nome || 'Personaggio').replace(/[^a-zA-Z0-9_-]/g, '_');
            const righe = diario.map((v, i) => {
              const num = diario.length - i;
              return `# ${tr('Sessione', 'Session')} ${num}: ${v.titolo || tr('Senza titolo', 'Untitled')} (${v.data || tr('Nessuna data', 'No date')})\n\n${v.testo || ''}\n`;
            }).join('\n---\n\n');
            const contenuto = `# ${tr('Diario di viaggio', 'Travel journal')}: ${scheda.nome || tr('Personaggio', 'Character')}\n\n${righe}`;
            const blob = new Blob([contenuto], { type: 'text/markdown;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `Diario_${nomePG}.md`;
            a.click();
            URL.revokeObjectURL(url);
          };

          const TEMPLATE_DIARIO = [
            'Luogo: ',
            '',
            'Mandante: ',
            '',
            'Obiettivo: ',
            '',
            'PNG: ',
            '',
            'Indizio: ',
            '',
            'Combattimento: ',
            '',
            'Bottino: ',
            '',
            'Note: ',
          ].join('\n');

          const toggleTutteVoci = () => {
            const allClosed = diario.every((v) => vociDiarioChiuse[v.id]);
            if (allClosed) setVociDiarioChiuse({});
            else {
              const obj = {};
              diario.forEach((v) => { obj[v.id] = true; });
              setVociDiarioChiuse(obj);
            }
          };

          return (
            <div>
              {/* Toolbar superiore del Diario */}
              <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 14, flexWrap: 'wrap', justifyContent: 'space-between', borderBottom: `1px solid ${C.border}`, paddingBottom: 10 }}>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
                  <button
                    className="no-stampa"
                    style={{ ...styles.buttonPrimary, padding: '6px 14px', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}
                    onClick={() => {
                      const newId = `d-${Date.now()}`;
                      aggiorna({
                        diario: [{ id: newId, data: oggi, titolo: '', testo: TEMPLATE_DIARIO }, ...diario],
                      });
                      setVociDiarioChiuse((prev) => ({ ...prev, [newId]: false }));
                    }}
                  >
                    <strong>{lingua === 'en' ? 'New Chronicle' : 'Nuova Cronaca'}</strong>
                  </button>
                  {diario.length > 0 && (
                    <>
                      <button
                        className="no-stampa"
                        style={{ ...styles.buttonMini, fontSize: 12, padding: '5px 10px' }}
                        onClick={toggleTutteVoci}
                        title={tr('Espandi o comprimi tutte le sessioni', 'Expand or collapse all sessions')}
                      >
                        {diario.every((v) => vociDiarioChiuse[v.id]) ? tr('Espandi tutte', 'Expand all') : tr('Comprimi tutte', 'Collapse all')}
                      </button>
                      <button
                        className="no-stampa"
                        style={{ ...styles.buttonMini, fontSize: 12, padding: '5px 10px' }}
                        onClick={copiaDiario}
                        title={t('diario.copia_tip')}
                      >
                        {lingua === 'en' ? 'Copy all' : 'Copia'}
                      </button>
                      <button
                        className="no-stampa"
                        style={{ ...styles.buttonMini, fontSize: 12, padding: '5px 10px', color: C.goldDark, borderColor: C.goldDark }}
                        onClick={scaricaDiario}
                        title={t('diario.scarica_md_tip')}
                      >
                        {lingua === 'en' ? 'Download' : 'Scarica'}
                      </button>
                    </>
                  )}
                </div>
                {diario.length > 1 && (
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <input
                      value={filtroDiario}
                      onChange={(e) => setFiltroDiario(e.target.value)}
                      placeholder={lingua === 'en' ? '🔍 Filter notes...' : '🔍 Cerca nelle cronache...'}
                      style={{ ...styles.inlineInput, fontSize: 12, padding: '5px 24px 5px 10px', width: 190, borderRadius: 6 }}
                    />
                    {filtroDiario && (
                      <button
                        type="button"
                        onClick={() => setFiltroDiario('')}
                        style={{ position: 'absolute', right: 6, background: 'transparent', border: 0, color: C.inkDim, fontSize: 11, cursor: 'pointer', padding: 2 }}
                        aria-label={lingua === 'en' ? 'Clear filter' : 'Cancella filtro'}
                      >✕</button>
                    )}
                  </div>
                )}
              </div>

              {diario.length === 0 && (
                <div style={{ textAlign: 'center', padding: '36px 16px', background: 'rgba(0,0,0,0.02)', borderRadius: 10, border: `1px dashed ${C.border}`, margin: '12px 0' }}>
                  <div style={{ fontSize: 38, marginBottom: 10, opacity: 0.85 }}>📜</div>
                  <div style={{ fontWeight: 700, fontSize: 15, color: C.ink, marginBottom: 6 }}>
                    {lingua === 'en' ? 'Your Adventurer’s Journal is Empty' : 'Il Diario del tuo Avventuriero è Vuoto'}
                  </div>
                  <div style={{ ...styles.detail, fontSize: 13, maxWidth: 420, margin: '0 auto 16px' }}>
                    {lingua === 'en'
                      ? 'Keep track of encounters, loot, NPC secrets, quests and travel notes during each gaming session.'
                      : 'Traccia incontri, bottini ottenuti, segreti dei PNG, missioni e luoghi esplorati durante ogni sessione al tavolo.'}
                  </div>
                  <button
                    style={{ ...styles.buttonPrimary, padding: '7px 16px', fontSize: 13 }}
                    onClick={() => {
                      const newId = `d-${Date.now()}`;
                      aggiorna({ diario: [{ id: newId, data: oggi, titolo: '', testo: TEMPLATE_DIARIO }] });
                    }}
                  >
                    {lingua === 'en' ? 'Start First Session' : 'Inizia la Prima Sessione'}
                  </button>
                </div>
              )}

              {qDiario && diarioFiltrato.length === 0 && (
                <div style={{ ...styles.detail, fontSize: 13, fontStyle: 'italic', textAlign: 'center', padding: '16px 0' }}>
                  {lingua === 'en' ? `No notes match "${filtroDiario}".` : `Nessuna nota corrisponde a "${filtroDiario}".`}
                </div>
              )}

              {/* Lista Cronache / Sessioni */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {diarioFiltrato.map((v) => {
                  const chiusa = Boolean(vociDiarioChiuse[v.id]);
                  const numSessione = diario.length - diario.indexOf(v);
                  return (
                    <div
                      key={v.id}
                      style={{
                        border: `1px solid ${chiusa ? C.border : C.goldDark}`,
                        borderRadius: 10,
                        background: C.panel,
                        boxShadow: chiusa ? '0 1px 3px rgba(0,0,0,0.05)' : '0 4px 14px rgba(0,0,0,0.1)',
                        overflow: 'hidden',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {/* Header Cronaca */}
                      <div role="button" tabIndex={0}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 8,
                          padding: '8px 12px',
                          background: chiusa ? 'transparent' : 'rgba(200,140,20,0.06)',
                          borderBottom: chiusa ? 'none' : `1px solid ${C.border}`,
                          cursor: 'pointer',
                        }}
                        onClick={() => setVociDiarioChiuse((prev) => ({ ...prev, [v.id]: !prev[v.id] }))}
                      >
                        <span style={{ color: C.goldDark, fontSize: 14, fontWeight: 900, userSelect: 'none' }}>
                          {chiusa ? '▸' : '▾'}
                        </span>

                        <span
                          style={{
                            fontSize: 12,
                            fontWeight: 800,
                            color: C.goldDark,
                            background: 'rgba(218, 165, 32, 0.15)',
                            border: `1px solid ${C.goldDark}`,
                            borderRadius: 5,
                            padding: '2px 7px',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          #{numSessione}
                        </span>

                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flex: 1, minWidth: 0 }} onClick={(e) => e.stopPropagation()}>
                          <input
                            type="date"
                            value={v.data || ''}
                            onChange={(e) => modificaVoce(v.id, { data: e.target.value })}
                            style={{ ...styles.inlineInput, padding: '3px 6px', fontSize: 12, width: 115, borderRadius: 4 }}
                          />
                          <input
                            value={v.titolo || ''}
                            placeholder={t('diario.titolo_ph')}
                            onChange={(e) => modificaVoce(v.id, { titolo: e.target.value })}
                            style={{ ...styles.inlineInput, flex: 1, minWidth: 100, padding: '4px 8px', fontSize: 14, fontWeight: 700, color: C.ink, borderRadius: 4 }}
                          />
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }} onClick={(e) => e.stopPropagation()}>
                          <button
                            type="button"
                            className="no-stampa"
                            style={{ ...styles.buttonMini, padding: '3px 7px', fontSize: 12 }}
                            title={tr('Copia testo di questa sessione', 'Copy the text of this session')}
                            onClick={() => copiaVoce(v)}
                          >
                            📋
                          </button>
                          <button
                            type="button"
                            className="no-stampa"
                            style={{ ...styles.buttonMini, padding: '3px 7px', color: C.red, borderColor: C.red }}
                            title={t('diario.elimina')}
                            onClick={() => setConferma({
                              titolo: t('sez.diario'),
                              testo: t('diario.elimina_conferma'),
                              onConferma: () => aggiorna({ diario: diario.filter((x) => x.id !== v.id) }),
                            })}
                          >
                            ✕
                          </button>
                        </div>
                      </div>

                      {/* Anteprima compressa */}
                      {chiusa ? (
                        <div role="button" tabIndex={0}
                          onClick={() => setVociDiarioChiuse((prev) => ({ ...prev, [v.id]: false }))}
                          style={{
                            fontSize: 13,
                            color: C.inkDim,
                            fontStyle: 'italic',
                            cursor: 'pointer',
                            padding: '6px 12px 10px 32px',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {v.testo ? v.testo.slice(0, 140) + (v.testo.length > 140 ? '…' : '') : (lingua === 'en' ? 'No notes recorded.' : 'Nessun appunto registrato.')}
                        </div>
                      ) : (
                        <div style={{ padding: '12px' }}>
                          <AreaTesto
                            value={v.testo != null ? v.testo : TEMPLATE_DIARIO}
                            placeholder={t('diario.testo_ph')}
                            onChange={(nuovo) => modificaVoce(v.id, { testo: nuovo })}
                            style={{ minHeight: 200, fontSize: 14, lineHeight: 1.55 }}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
}
