// Manichino Equipaggiamento RPG ("Paper Doll Equipment Grid")
import { styles } from './stili.js';
import { C } from './tema.js';

export const SLOT_PAPER_DOLL = [
  { id: 'testa', icon: '👑', labelIt: 'Testa', labelEn: 'Head', regex: /elmo|cappello|corona|diadema|cerchietto|cappuccio|benda|helm|hat|circlet|crown|hood/i },
  { id: 'collo', icon: '📿', labelIt: 'Collo', labelEn: 'Neck', regex: /amuleto|collana|talismano|medaglione|ciondolo|necklace|amulet|pendant|periapt/i },
  { id: 'corpo', icon: '🛡️', labelIt: 'Armatura', labelEn: 'Armor', regex: /armatura|corazza|cotta|giaco|cuoio|imbottita|piastre|pettorale|tunica|vesti|abito|armor|mail|plate|robe|leather/i },
  { id: 'mantello', icon: '🧥', labelIt: 'Mantello', labelEn: 'Cloak', regex: /mantello|cappa|scialle|cloak|cape|mantle/i },
  { id: 'mano_primaria', icon: '🗡️', labelIt: 'Arma / Focus', labelEn: 'Main Hand', regex: /spada|arco|balestra|ascia|pugnale|bastone|martello|lancia|mazza|frusta|randello|bacchetta|focus|verga|sword|bow|dagger|staff|wand|mace/i },
  { id: 'mano_secondaria', icon: '🛡️', labelIt: 'Mano Secondaria', labelEn: 'Off Hand', regex: /scudo|rotella|targone|focus|simbolo sacro|shield|tome|focus/i },
  { id: 'anello1', icon: '💍', labelIt: 'Anello 1', labelEn: 'Ring 1', regex: /anello|ring|fede/i },
  { id: 'anello2', icon: '💍', labelIt: 'Anello 2', labelEn: 'Ring 2', regex: /anello|ring|fede/i },
  { id: 'piedi', icon: '👢', labelIt: 'Stivali', labelEn: 'Boots', regex: /stivali|calzari|scarpe|babbucce|boots|shoes|slippers/i },
];

/** Determina lo slot corretto per un oggetto in base al nome o alla categoria */
export function assegnaSlotPaperDoll(oggetto, slotOccupati = {}) {
  const nome = (oggetto?.nome || '').toLowerCase();
  for (const s of SLOT_PAPER_DOLL) {
    if (s.id === 'anello2') {
      if (s.regex.test(nome) && slotOccupati['anello1'] && slotOccupati['anello1'].id !== oggetto.id) {
        return 'anello2';
      }
      continue;
    }
    if (s.regex.test(nome)) {
      if (!slotOccupati[s.id] || slotOccupati[s.id].id === oggetto.id) {
        return s.id;
      }
    }
  }
  return null;
}

export function ManichinoEquipaggiamento({ inventario, onToggleEquip, lingua, attacchi = [] }) {
  const inv = Array.isArray(inventario) ? inventario : [];
  const slotOccupati = {};

  // 1. Raccoglie gli oggetti equipaggiati
  inv.forEach((o) => {
    const isW = attacchi.some((a) => a.nome === o.nome);
    const equip = isW ? true : !!o.equip;
    if (!equip) return;
    const targetSlot = assegnaSlotPaperDoll(o, slotOccupati);
    if (targetSlot) {
      slotOccupati[targetSlot] = o;
    }
  });

  return (
    <div
      className="paper-doll-container"
      style={{
        background: 'rgba(0,0,0,0.03)',
        border: `1.5px solid ${C.border}`,
        borderRadius: 12,
        padding: '12px 14px',
        marginBottom: 14,
        boxSizing: 'border-box',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10, borderBottom: `1px solid ${C.border}`, paddingBottom: 6 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 16 }}>🥋</span>
          <span style={{ fontSize: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.6, color: C.goldDark, fontFamily: 'var(--font-title)' }}>
            {lingua === 'en' ? 'Equipped Gear (Paper Doll)' : 'Equipaggiamento Indossato'}
          </span>
        </div>
        <span style={{ fontSize: 11, color: C.inkDim }}>
          {Object.keys(slotOccupati).length} / {SLOT_PAPER_DOLL.length} {lingua === 'en' ? 'Slots' : 'Slot'}
        </span>
      </div>

      {/* Griglia a slot RPG */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
          gap: 8,
        }}
      >
        {SLOT_PAPER_DOLL.map((slot) => {
          const item = slotOccupati[slot.id];
          const hasItem = Boolean(item);

          return (
            <div
              key={slot.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '6px 8px',
                borderRadius: 8,
                background: hasItem ? 'rgba(201,162,39,0.09)' : 'rgba(0,0,0,0.02)',
                border: `1.5px solid ${hasItem ? 'var(--c-gold-dark, #c9a227)' : 'rgba(255,255,255,0.08)'}`,
                boxShadow: hasItem ? '0 1px 6px rgba(201,162,39,0.2)' : 'none',
                minHeight: 40,
                boxSizing: 'border-box',
                position: 'relative',
              }}
              title={hasItem ? `${item.nome} (${lingua === 'en' ? 'Click to unequip' : 'Clicca per rimuovere'})` : (lingua === 'en' ? `Empty ${slot.labelEn} slot` : `Slot ${slot.labelIt} vuoto`)}
            >
              {/* Icona dello slot */}
              <div
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: 6,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 14,
                  background: hasItem ? 'rgba(201,162,39,0.2)' : 'rgba(0,0,0,0.04)',
                  flexShrink: 0,
                }}
              >
                {slot.icon}
              </div>

              {/* Informazioni oggetto / etichetta slot */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 9.5, textTransform: 'uppercase', letterSpacing: 0.5, color: C.inkDim, fontWeight: 700 }}>
                  {lingua === 'en' ? slot.labelEn : slot.labelIt}
                </div>
                {hasItem ? (
                  <div
                    style={{
                      fontSize: 11.5,
                      fontWeight: 800,
                      color: C.ink,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {item.nome}
                  </div>
                ) : (
                  <div style={{ fontSize: 11, color: C.inkDim, opacity: 0.6, fontStyle: 'italic' }}>
                    {lingua === 'en' ? 'Empty' : 'Vuoto'}
                  </div>
                )}
              </div>

              {/* Tasto rapido Rimuovi se equipaggiato */}
              {hasItem && (
                <button
                  type="button"
                  style={{
                    ...styles.buttonMini,
                    width: 20,
                    height: 20,
                    padding: 0,
                    fontSize: 10,
                    lineHeight: '18px',
                    borderRadius: '50%',
                    color: C.red,
                    borderColor: 'rgba(239,68,68,0.4)',
                    background: 'rgba(239,68,68,0.08)',
                    flexShrink: 0,
                  }}
                  title={lingua === 'en' ? 'Unequip' : 'Rimuovi'}
                  onClick={() => onToggleEquip(item)}
                >
                  ✕
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
