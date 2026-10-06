// Estratto da App.jsx (finestra "PannelloAudioModal"): riceve dall'App lo stato che usa, tutto il resto è importato.
import { C, PRESET_COLORI } from '../tema.js';
import { iconaAmbientazione, ORDINE_AMBIENTAZIONI } from '../../utils/ambiente.js';
import { t, tr } from '../../i18n';
import { styles } from '../stili.js';
import { fermaAmbiente, sbloccaAudio, avviaAmbiente, eseguiEffettoSonoro } from '../../utils/audioAmbiente';

export function PannelloAudioModal({ ambienteAudio, audioAvviatoDaGestoRef, effettiSonoriAttivi, lingua, notteAttiva, posPannelloAudio, presetColori, setAmbienteAudio, setEffettiSonoriAttivi, setMostraPannelloAudio, setPresetColori, setSottofondoAttivo, setVolumeAudio, setVolumeEffetti, sottofondoAttivo, urlCustomAudio, volumeAudio, volumeEffetti }) {
  return (
    <div
      onClick={() => setMostraPannelloAudio(false)}
      style={{
        position: 'fixed', inset: 0, zIndex: 1400,
        background: 'transparent'
      }}
    >
    <div
      onClick={(e) => e.stopPropagation()}
      style={{
        position: 'fixed', top: posPannelloAudio.top, left: posPannelloAudio.left,
        width: 'min(280px, calc(100vw - 16px))',
        maxHeight: `calc(100vh - ${posPannelloAudio.top + 8}px)`,
        background: C.panel, border: `2px solid ${C.goldDark}`, borderRadius: 10,
        padding: '10px 12px', overflowY: 'auto',
        display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13,
        boxShadow: '6px 0 28px rgba(0,0,0,0.48)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
        <div style={{ fontWeight: 'bold', color: C.goldDark, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <span>{iconaAmbientazione(presetColori)} {t('luogo.titolo')}</span>
          <span style={{ fontSize: 11, fontWeight: 'normal', color: C.inkDim }}>{t('luogo.descrizione')}</span>
        </div>
        <button
          style={{ ...styles.btnMini }}
          onClick={() => setMostraPannelloAudio(false)}
          aria-label={tr('Chiudi pannello audio', 'Close audio panel')}
        >✕</button>
      </div>
      {/* Volume del sottofondo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 14, color: C.inkDim }}>🔊</span>
        <input
          type="range" min="0" max="1" step="0.05"
          value={volumeAudio}
          onChange={(e) => setVolumeAudio(e.target.value)}
          style={{ flex: 1, accentColor: C.gold }}
          title={tr('Volume del sottofondo', 'Background volume')}
        />
        <span style={{ minWidth: 38, textAlign: 'right', fontSize: 12, fontWeight: 'bold' }}>{Math.round(volumeAudio * 100)}%</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 14, color: C.inkDim }} title="Volume dadi, armi e magia">🎲</span>
        <input
          type="range" min="0" max="1" step="0.05"
          value={volumeEffetti}
          onChange={(e) => setVolumeEffetti(Number(e.target.value))}
          style={{ flex: 1, accentColor: C.gold }}
          title="Volume degli effetti: dadi, armi e magia"
        />
        <span style={{ minWidth: 38, textAlign: 'right', fontSize: 12, fontWeight: 'bold' }}>{Math.round(volumeEffetti * 100)}%</span>
      </div>
      {/* Due interruttori simmetrici: suoni dei dadi e muto generale (stessa larghezza e griglia dei tasti ambientazione) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 4 }}>
        <button
          onClick={() => setEffettiSonoriAttivi((v) => !v)}
          title={tr('Attiva/disattiva i suoni dei tiri di dado. La barra qui sopra regola invece il volume del sottofondo ambientale.', 'Turn dice roll sounds on/off. The slider above sets the background ambience volume.')}
          style={{
            padding: '6px 4px', minHeight: 32, borderRadius: 6,
            border: `1px solid ${effettiSonoriAttivi ? C.goldDark : C.border}`,
            background: effettiSonoriAttivi ? C.goldDark : C.panelLight,
            color: effettiSonoriAttivi ? '#ffffff' : C.inkDim,
            fontWeight: 'bold', fontSize: 12, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            whiteSpace: 'nowrap', width: '100%', boxSizing: 'border-box',
            transition: 'all 0.15s ease'
          }}
        >
          Suoni dadi: {effettiSonoriAttivi ? 'ON' : 'OFF'}
        </button>
        <button
          onClick={() => {
            if (sottofondoAttivo) {
              fermaAmbiente();
              setSottofondoAttivo(false);
            } else {
              sbloccaAudio();
              audioAvviatoDaGestoRef.current = true;
              const targetAudio = (!ambienteAudio || ambienteAudio === 'spento')
                ? (PRESET_COLORI.find((p) => p.id === presetColori)?.audio || 'taverna')
                : ambienteAudio;
              if (targetAudio && targetAudio !== 'spento') {
                setAmbienteAudio(targetAudio);
                avviaAmbiente(targetAudio, volumeAudio * (notteAttiva ? 0.6 : 1), urlCustomAudio, notteAttiva);
              }
              setSottofondoAttivo(true);
            }
          }}
          title={sottofondoAttivo
            ? (lingua === 'en' ? 'Background audio: ON · click to pause' : 'Sottofondo: ON · clicca per metterlo in pausa')
            : (lingua === 'en' ? 'Background audio: OFF · click to start' : 'Sottofondo: OFF · clicca per avviare l’atmosfera')}
          aria-label={sottofondoAttivo ? 'Sottofondo attivo' : 'Sottofondo disattivato'}
          style={{
            padding: '6px 4px', minHeight: 32, borderRadius: 6,
            border: `1px solid ${sottofondoAttivo ? C.goldDark : C.border}`,
            background: sottofondoAttivo ? C.goldDark : C.panelLight,
            color: sottofondoAttivo ? '#ffffff' : C.inkDim,
            fontWeight: 'bold', fontSize: 12, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            whiteSpace: 'nowrap', width: '100%', boxSizing: 'border-box',
            transition: 'all 0.15s ease'
          }}
        >
          {sottofondoAttivo ? '🔊 Sottofondo: ON' : '🔇 Sottofondo: OFF'}
        </button>
      </div>
    
      {/* Ambientazioni: un click applica palette + sfondo + audio abbinato */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 4 }}>
      {[...PRESET_COLORI].filter((p) => p.id !== 'default').sort((a, b) => ORDINE_AMBIENTAZIONI.indexOf(a.id) - ORDINE_AMBIENTAZIONI.indexOf(b.id)).map((p) => {
          const attivo = presetColori === p.id;
          const conSuono = p.audio && p.audio !== 'spento';
          return (
            <button
              key={p.id}
              onClick={() => {
                sbloccaAudio();
                setPresetColori(p.id);
                setAmbienteAudio(p.audio);
                if (p.audio && p.audio !== 'spento') {
                  audioAvviatoDaGestoRef.current = true;
                  setSottofondoAttivo(true);
                  avviaAmbiente(p.audio, volumeAudio * (notteAttiva ? 0.6 : 1), urlCustomAudio, notteAttiva);
                } else {
                  setSottofondoAttivo(false);
                  fermaAmbiente();
                }
              }}
              title={`${p.nome}${conSuono ? ' · audio ambientale incluso' : ' · silenzio'}`}
              style={{
                padding: '4px 6px', minHeight: 29, borderRadius: 6, border: `1px solid ${attivo ? C.goldDark : C.border}`,
                background: attivo ? C.goldDark : C.panelLight, color: attivo ? '#ffffff' : C.ink,
                cursor: 'pointer', fontWeight: attivo ? 'bold' : 'normal', textAlign: 'left',
                display: 'flex', alignItems: 'center', fontSize: 12, lineHeight: 1.15,
                transition: 'all 0.15s ease', boxShadow: attivo ? '0 2px 8px rgba(0,0,0,0.28)' : '0 1px 2px rgba(0,0,0,0.08)'
              }}
            >
              <span>{p.nome}</span>
            </button>
          );
        })}
      </div>
    
      {/* Soundboard SFX Rapida (effetti one-shot per sessione) */}
      <div style={{ borderTop: `1px dashed ${C.border}`, paddingTop: 6 }}>
        <div style={{ fontSize: 11, fontWeight: 'bold', color: C.goldDark, marginBottom: 4 }}>
          Effetti Sonori Rapidi (SFX)
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 4 }}>
          {[
            { id: 'arma', icona: '⚔️', label: 'Spada' },
            { id: 'arco', icona: '🏹', label: 'Arco' },
            { id: 'magia', icona: '✨', label: 'Magia' },
            { id: 'cura', icona: '💚', label: 'Cura' },
          ].map((sfx) => (
            <button
              key={sfx.id}
              type="button"
              onClick={() => {
                sbloccaAudio();
                eseguiEffettoSonoro(sfx.id, volumeEffetti);
              }}
              title={`Suona effetto: ${sfx.label}`}
              style={{
                ...styles.buttonMini,
                padding: '4px 2px',
                fontSize: 11,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 2,
                background: C.panelLight,
              }}
            >
              <span style={{ fontSize: 13 }}>{sfx.icona}</span>
              <span style={{ fontSize: 11, whiteSpace: 'nowrap' }}>{sfx.label}</span>
            </button>
          ))}
        </div>
      </div>
    
      <div style={{ fontSize: 11, color: C.inkDim, opacity: 0.8, textAlign: 'center' }}>
        Suoni ambientali ed effetti procedurali · Web Audio API & Freesound CC0
      </div>
    </div>
    </div>
  );
}
