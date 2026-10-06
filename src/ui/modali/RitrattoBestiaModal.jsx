// Estratto da App.jsx (finestra "RitrattoBestiaModal"): riceve dall'App lo stato che usa, tutto il resto è importato.
import { GALLERIA_BESTIE_PRESET, generaAvatarBestia } from '../../ritratti';
import { t } from '../../i18n';
import { C } from '../tema.js';
import { styles } from '../stili.js';

export function RitrattoBestiaModal({ aggiorna, campoForma, formaAttiva, lingua, ritrattoBestiaRef, setMostraModalRitrattoBestia, setUrlRitrattoBestiaInput, urlRitrattoBestiaInput }) {
  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 1150, padding: 16,
        background: 'rgba(0,0,0,0.65)', display: 'flex', alignItems: 'center', justifyContent: 'center',
        backdropFilter: 'blur(3px)',
      }}
      onClick={(e) => { if (e.target === e.currentTarget) setMostraModalRitrattoBestia(false); }}
    >
      <div style={{ ...styles.panel, maxWidth: 540, width: '100%', maxHeight: '90vh', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 14, boxShadow: '0 12px 48px rgba(0,0,0,0.55)' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `1px solid ${C.border}`, paddingBottom: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div>
              <h2 style={{ ...styles.title, margin: 0, fontSize: 18, lineHeight: 1.2 }}>
                {campoForma === 'metamorfosi'
                  ? (lingua === 'en' ? 'Polymorph Artwork' : 'Illustrazione Metamorfosi')
                  : (lingua === 'en' ? 'Wild Shape Beast Artwork' : 'Illustrazione Forma Selvatica')}
              </h2>
              <div style={{ ...styles.detail, fontSize: 12, color: C.inkDim, marginTop: 2 }}>
                {formaAttiva?.dati?.nome || 'Bestia'} · {lingua === 'en' ? 'Choose official artwork, upload image, or paste URL' : 'Scegli illustrazioni ufficiali, carica un file o incolla un link'}
              </div>
            </div>
          </div>
          <button
            style={{ ...styles.buttonMini, padding: '4px 8px', fontSize: 14 }}
            onClick={() => setMostraModalRitrattoBestia(false)}
          >
            ✕
          </button>
        </div>

        {/* Anteprima Corrente */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, background: 'rgba(0,0,0,0.03)', padding: 12, borderRadius: 10, border: `1px solid ${C.border}` }}>
          <div style={{ width: 84, height: 84, borderRadius: 10, overflow: 'hidden', border: '2px solid #52b788', flexShrink: 0, background: '#1b4332' }}>
            <img
              src={generaAvatarBestia(formaAttiva?.dati)}
              alt="Anteprima"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 800, fontSize: 14, color: C.ink }}>
              {formaAttiva?.dati?.nome?.toUpperCase()}
            </div>
            <div style={{ fontSize: 12, color: C.inkDim, marginTop: 2 }}>
              {formaAttiva?.dati?.ritratto ? (lingua === 'en' ? 'Custom portrait active' : 'Ritratto personalizzato attivo') : (lingua === 'en' ? 'Standard D&D vector artwork active' : 'Illustrazione vettoriale standard attiva')}
            </div>
            {formaAttiva?.dati?.ritratto && (
              <button
                type="button"
                style={{ ...styles.buttonMini, marginTop: 6, fontSize: 11, borderColor: C.red, color: C.red }}
                onClick={() => {
                  aggiorna({
                    [campoForma]: {
                      ...formaAttiva.dati,
                      ritratto: null,
                    },
                  });
                }}
              >
                {lingua === 'en' ? 'Reset to Vector Art' : 'Ripristina grafica originale'}
              </button>
            )}
          </div>
        </div>

        {/* Opzione 1: Carica dal Dispositivo */}
        <div style={{ border: `1px solid ${C.border}`, borderRadius: 10, padding: 12 }}>
          <strong style={{ display: 'block', fontSize: 13, color: C.ink, marginBottom: 4 }}>
            {lingua === 'en' ? 'Upload from your device' : 'Carica immagine dal tuo dispositivo'}
          </strong>
          <div style={{ fontSize: 12, color: C.inkDim, marginBottom: 8 }}>
            {lingua === 'en' ? 'Upload any PNG, JPG or WebP image from your computer or phone.' : 'Supporta qualsiasi immagine PNG, JPG o WebP dal tuo computer o smartphone.'}
          </div>
          <button
            type="button"
            style={{ ...styles.button, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontWeight: 700 }}
            onClick={() => ritrattoBestiaRef.current?.click()}
          >
            <span>{lingua === 'en' ? 'Select File...' : 'Scegli File...'}</span>
          </button>
        </div>

        {/* Opzione 2: Incolla Link da Internet / Immagine Generata */}
        <div style={{ border: `1px solid ${C.border}`, borderRadius: 10, padding: 12 }}>
          <strong style={{ display: 'block', fontSize: 13, color: C.ink, marginBottom: 4 }}>
            {lingua === 'en' ? 'Paste image URL (Internet / AI generated)' : 'Incolla link da internet o immagine generata'}
          </strong>
          <div style={{ fontSize: 12, color: C.inkDim, marginBottom: 8 }}>
            {lingua === 'en' ? 'Paste any direct image URL from D&D Beyond, Pinterest, Midjourney, etc.' : 'Incolla il link diretto di un’illustrazione da Pinterest, Google Immagini, D&D Beyond o generatore AI.'}
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            <input
              type="text"
              placeholder="https://.../bestia.jpg"
              value={urlRitrattoBestiaInput}
              onChange={(e) => setUrlRitrattoBestiaInput(e.target.value)}
              style={{ ...styles.inlineInput, flex: 1, padding: '7px 10px', fontSize: 13 }}
            />
            <button
              type="button"
              style={{ ...styles.buttonPrimary, padding: '6px 14px', fontSize: 12 }}
              onClick={() => {
                const u = urlRitrattoBestiaInput.trim();
                if (!u) return;
                if (formaAttiva) {
                  aggiorna({
                    [campoForma]: {
                      ...formaAttiva.dati,
                      ritratto: u,
                    },
                  });
                }
                setUrlRitrattoBestiaInput('');
                setMostraModalRitrattoBestia(false);
              }}
            >
              {lingua === 'en' ? 'Apply' : 'Applica'}
            </button>
          </div>
        </div>

        {/* Opzione 3: Galleria Token & Illustrazioni D&D 5e */}
        <div style={{ border: `1px solid ${C.border}`, borderRadius: 10, padding: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <strong style={{ fontSize: 13, color: C.ink }}>
              {lingua === 'en' ? 'D&D 5e Fantasy Artwork Presets' : 'Galleria Illustrazioni & Token D&D 5e'}
            </strong>
            <span style={{ fontSize: 11, color: C.inkDim }}>{GALLERIA_BESTIE_PRESET.length} opzioni</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(135px, 1fr))', gap: 8, maxHeight: 220, overflowY: 'auto', paddingRight: 4 }}>
            {GALLERIA_BESTIE_PRESET.map((g) => {
              const avatarSvg = generaAvatarBestia({ nome: g.bestia });
              return (
                <div role="button" tabIndex={0}
                  key={g.id}
                  onClick={() => {
                    if (formaAttiva) {
                      aggiorna({
                        [campoForma]: {
                          ...formaAttiva.dati,
                          ritratto: avatarSvg,
                        },
                      });
                    }
                    setMostraModalRitrattoBestia(false);
                  }}
                  style={{
                    background: C.panelLight,
                    border: `1.5px solid ${C.border}`,
                    borderRadius: 8,
                    padding: 6,
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 4,
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#52b788'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.transform = 'none'; }}
                >
                  <div style={{ width: 56, height: 56, borderRadius: 8, overflow: 'hidden', background: '#1b4332' }}>
                    <img src={avatarSvg} alt={g.nome} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div style={{ fontSize: 11, fontWeight: 700, textAlign: 'center', color: C.ink, lineHeight: 1.2 }}>
                    {g.nome}
                  </div>
                  <div style={{ fontSize: 11, color: C.inkDim, textAlign: 'center' }}>
                    {g.tag}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: 6, borderTop: `1px solid ${C.border}` }}>
          <button
            type="button"
            style={{ ...styles.buttonPrimary, padding: '8px 18px', fontSize: 13 }}
            onClick={() => setMostraModalRitrattoBestia(false)}
          >
            {t('common.chiudi')}
          </button>
        </div>
      </div>
    </div>
  );
}
