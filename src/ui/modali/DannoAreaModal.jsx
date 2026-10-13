// Finestra "Danno ad area" del combat tracker: un danno, un tipo, più bersagli.
// Per ogni bersaglio propone la difesa letta dai suoi tratti (resistenza, immunità,
// vulnerabilità), modificabile a mano, e il TS superato (metà danno).
import { C } from '../tema.js';
import { styles } from '../stili.js';
import { DANNI_5E } from '../../data/dati5e.js';
import { parseEspressioneDado, tiraDanni } from '../../rules/dadi.js';
import { difesaControDanno, dannoConDifesa } from '../../rules/scheda.js';

const TIPI = [...DANNI_5E, 'Forza'].sort((a, b) => a.localeCompare(b, 'it'));
const DIFESE = ['normale', 'resistente', 'immune', 'vulnerabile'];

export function DannoAreaModal({ area, setArea, combattenti, testoDifese, applica, lingua }) {
  const tr = (it, en) => (lingua === 'en' ? en : it);
  const nomiDifese = {
    normale: tr('Normale', 'Normal'),
    resistente: tr('Resistente (½)', 'Resistant (½)'),
    immune: tr('Immune (0)', 'Immune (0)'),
    vulnerabile: tr('Vulnerabile (×2)', 'Vulnerable (×2)'),
  };
  const testo = String(area.valore ?? '').trim();
  const numerico = /^\d+$/.test(testo);
  const espressione = !numerico && testo ? parseEspressioneDado(testo) : null;
  const base = numerico ? Number(testo) : 0;
  const rilevata = (cb) => difesaControDanno(testoDifese(cb), area.tipo, { magico: area.magico });
  const difesaDi = (cb) => area.difese[cb.id] || rilevata(cb);
  const selezionati = combattenti.filter((cb) => area.sel[cb.id]);
  const imposta = (patch) => setArea({ ...area, ...patch });
  const scegli = (filtro) => imposta({ sel: Object.fromEntries(combattenti.map((cb) => [cb.id, filtro(cb)])) });
  const tira = () => {
    if (!espressione) return;
    const esito = tiraDanni(espressione, false);
    imposta({ valore: String(esito.totale), dettaglio: esito.dettaglio });
  };

  return (
    <div
      data-no-ct-close
      style={{ position: 'fixed', inset: 0, zIndex: 3300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(3px)' }}
      onClick={() => setArea(null)}
    >
      <div
        role="dialog"
        aria-label={tr('Danno ad area', 'Area damage')}
        data-testid="area-modal"
        style={{ ...styles.panel, maxWidth: 520, width: '100%', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 8px 30px rgba(0,0,0,0.4)', borderRadius: 12 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <strong style={{ color: C.goldDark, fontSize: 16 }}>{tr('Danno ad area', 'Area damage')}</strong>
          <button type="button" style={{ ...styles.buttonMini, padding: '2px 8px' }} onClick={() => setArea(null)} aria-label={tr('Chiudi', 'Close')}>×</button>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center', marginBottom: 6 }}>
          <input
            data-testid="area-valore"
            value={area.valore}
            onChange={(e) => imposta({ valore: e.target.value, dettaglio: '' })}
            onKeyDown={(e) => { if (e.key === 'Enter' && espressione) tira(); }}
            placeholder={tr('Danno o dadi (es. 28 o 8d6)', 'Damage or dice (e.g. 28 or 8d6)')}
            style={{ ...styles.inlineInput, width: 150, fontSize: 14, padding: '4px 8px' }}
            autoFocus
          />
          {espressione && (
            <button type="button" data-testid="area-tira" style={{ ...styles.buttonMini, padding: '3px 10px' }} onClick={tira}>
              {tr('Tira', 'Roll')} {testo}
            </button>
          )}
          <select
            data-testid="area-tipo"
            value={area.tipo}
            onChange={(e) => imposta({ tipo: e.target.value, difese: {} })}
            style={{ ...styles.inlineInput, fontSize: 13, padding: '3px 6px' }}
          >
            {TIPI.map((tp) => <option key={tp} value={tp}>{tp}</option>)}
          </select>
          <label style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12, color: C.inkDim, cursor: 'pointer' }}>
            <input type="checkbox" checked={area.magico} onChange={(e) => imposta({ magico: e.target.checked, difese: {} })} />
            {tr('Magico', 'Magical')}
          </label>
        </div>
        {area.dettaglio && <div style={{ fontSize: 11, color: C.inkDim, marginBottom: 6 }}>{area.dettaglio}</div>}

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, margin: '8px 0' }}>
          <button type="button" data-testid="area-tutti-nemici" style={{ ...styles.buttonMini, fontSize: 11 }} onClick={() => scegli((cb) => cb.tipo === 'nemico')}>
            {tr('Tutti i nemici', 'All enemies')}
          </button>
          <button type="button" data-testid="area-io-alleati" style={{ ...styles.buttonMini, fontSize: 11 }} onClick={() => scegli((cb) => cb.tipo !== 'nemico')}>
            {tr('Io e alleati', 'Me and allies')}
          </button>
          <button type="button" style={{ ...styles.buttonMini, fontSize: 11 }} onClick={() => scegli(() => true)}>
            {tr('Tutti', 'Everyone')}
          </button>
          <button type="button" style={{ ...styles.buttonMini, fontSize: 11 }} onClick={() => scegli(() => false)}>
            {tr('Nessuno', 'None')}
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {combattenti.map((cb) => {
            const sel = Boolean(area.sel[cb.id]);
            const difesa = difesaDi(cb);
            const dannoFinale = dannoConDifesa(base, difesa, Boolean(area.ts[cb.id]));
            const coloreTipo = cb.tipo === 'nemico' ? C.red : cb.tipo === 'pg' ? C.goldDark : C.green;
            return (
              <div
                key={cb.id}
                data-testid={`area-riga-${cb.id}`}
                style={{
                  display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8, padding: '5px 8px', borderRadius: 6,
                  border: `1px solid ${sel ? coloreTipo : C.border}`,
                  background: sel ? 'rgba(201,162,39,0.08)' : 'transparent',
                }}
              >
                <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6, flex: '1 1 140px', minWidth: 0, cursor: 'pointer', fontSize: 13, fontWeight: 700, color: C.ink }}>
                  <input
                    type="checkbox"
                    data-testid={`area-sel-${cb.id}`}
                    checked={sel}
                    onChange={(e) => imposta({ sel: { ...area.sel, [cb.id]: e.target.checked } })}
                  />
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{cb.nome}</span>
                  <span style={{ fontSize: 11, fontWeight: 400, color: C.inkDim }}>{cb.pfAttuali}/{cb.pfMax}</span>
                </label>
                <select
                  data-testid={`area-difesa-${cb.id}`}
                  value={difesa}
                  onChange={(e) => imposta({ difese: { ...area.difese, [cb.id]: e.target.value } })}
                  title={difesa === rilevata(cb) && difesa !== 'normale' ? tr('Letta dai tratti della creatura', 'Read from the creature traits') : undefined}
                  style={{ ...styles.inlineInput, fontSize: 11, padding: '1px 4px', color: difesa === 'normale' ? C.ink : difesa === 'vulnerabile' ? C.red : C.green, fontWeight: difesa === 'normale' ? 400 : 700 }}
                >
                  {DIFESE.map((d) => <option key={d} value={d}>{nomiDifese[d]}</option>)}
                </select>
                <label style={{ display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: 11, color: C.inkDim, cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    data-testid={`area-ts-${cb.id}`}
                    checked={Boolean(area.ts[cb.id])}
                    onChange={(e) => imposta({ ts: { ...area.ts, [cb.id]: e.target.checked }, sel: { ...area.sel, [cb.id]: true } })}
                  />
                  {tr('TS superato (½)', 'Save passed (½)')}
                </label>
                <span data-testid={`area-anteprima-${cb.id}`} style={{ minWidth: 36, textAlign: 'right', fontWeight: 800, color: sel ? C.red : C.inkDim, opacity: sel ? 1 : 0.5 }}>
                  −{dannoFinale}
                </span>
              </div>
            );
          })}
        </div>

        <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
          <button
            type="button"
            data-testid="area-applica"
            disabled={!base || selezionati.length === 0}
            style={{ ...styles.button, flex: 1, fontWeight: 700, color: C.red, borderColor: C.red, opacity: !base || selezionati.length === 0 ? 0.5 : 1 }}
            onClick={() => { applica({ ...area, valore: base }); setArea(null); }}
          >
            {selezionati.length
              ? tr(`Applica a ${selezionati.length} ${selezionati.length === 1 ? 'bersaglio' : 'bersagli'}`, `Apply to ${selezionati.length} ${selezionati.length === 1 ? 'target' : 'targets'}`)
              : tr('Scegli i bersagli', 'Choose the targets')}
          </button>
          <button type="button" style={{ ...styles.buttonMini, padding: '4px 12px' }} onClick={() => setArea(null)}>
            {tr('Annulla', 'Cancel')}
          </button>
        </div>
      </div>
    </div>
  );
}
