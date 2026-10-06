// Tema e palette: costanti statiche condivise da tutta l'app.
// Estratto da App.jsx per tenere il componente principale più leggero.

export const C = {
  bg: 'var(--c-bg)',
  panel: 'var(--c-panel)',
  panelLight: 'var(--c-panel-light)',
  border: 'var(--c-border)',
  ink: 'var(--c-ink)',
  inkDim: 'var(--c-ink-dim)',
  gold: 'var(--c-gold)',
  goldDark: 'var(--c-gold-dark)',
  onGold: 'var(--c-on-gold)', // testo leggibile sopra gold/goldDark (bianco o quasi nero, scelto dal contrasto)
  red: 'var(--c-red)',
  green: 'var(--c-green)',
  title: 'var(--c-title)',
};

// Un colore per ogni tipo di dado.
export const COLORE_DADO = {
  4: '#2e8b57',
  6: '#1f6fb2',
  8: '#7d4cb0',
  10: '#c0392b',
  12: '#d97b12',
  20: '#b8860b',
  100: '#5b6770',
};

// Palette base del tema (chiaro/scuro): i preset qui sotto la sovrascrivono, e la
// tinta per classe agisce sopra. NON rimuovere: è usata per costruire il tema.
export const BASE_TEMA = {
  chiaro: { bg: '#f4f1ea', panel: '#ffffff', panelLight: '#f7f4ee', border: '#ddd5c6', ink: '#2b2620', inkDim: '#61564a', gold: '#b8860b', goldDark: '#8a6508', red: '#b03a2e', green: '#3e7d32', title: '#9e2b25' },
  scuro: { bg: '#050506', panel: '#0e0e11', panelLight: '#16161b', border: '#24242d', ink: '#ebecee', inkDim: '#8e8e98', gold: '#c9a227', goldDark: '#dcb84f', red: '#d0685a', green: '#7fb069', title: '#de8f88' },
};

// Preset di colori aggiuntivi (Temi di Ambientazione D&D):
// sovrascrivono i valori di palette, il meccanismo tinta-classe funziona sopra come prima.
// Ogni preset è un'AMBIENTAZIONE completa: palette colori (chiaro/scuro) +
// audio abbinato (id di AMBIENTI_AUDIO) + sfondo atmosferico per i margini
// pagina (gradienti CSS leggeri, offline). Un solo controllo li applica insieme.
export const PRESET_COLORI = [
  {
    id: 'default', nome: '🟤 Classica', audio: 'spento', sfondo: '',
    chiaro: {},
    scuro: {},
  },
  {
    id: 'taverna', nome: '🍺 Taverna', audio: 'taverna',
    sfondo: 'radial-gradient(55% 60% at 0% 20%, rgba(210,120,40,0.15), transparent 62%), radial-gradient(55% 60% at 100% 80%, rgba(180,90,20,0.13), transparent 62%)',
    chiaro: { bg: '#f7f1e8', panel: '#fdfbfa', panelLight: '#f2e8dc', border: '#d8c0a4', ink: '#321c10', inkDim: '#885c40', gold: '#b86214', goldDark: '#8c440a', title: '#8c440a' },
    scuro:  { bg: '#060505', panel: '#110e0c', panelLight: '#1a1512', border: '#302016', ink: '#ede8e3', inkDim: '#968478', gold: '#d47620', goldDark: '#f09440', title: '#f09440' },
  },
  {
    id: 'mercato', nome: '🏪 Mercato', audio: 'mercato',
    sfondo: 'radial-gradient(55% 55% at 0% 15%, rgba(220,160,50,0.16), transparent 62%), radial-gradient(55% 55% at 100% 85%, rgba(200,110,40,0.13), transparent 62%)',
    chiaro: { bg: '#f9f2e2', panel: '#fffcf4', panelLight: '#f5ead2', border: '#dcc596', ink: '#3a2810', inkDim: '#8a6a3a', gold: '#c07818', goldDark: '#94540c', title: '#94540c' },
    scuro:  { bg: '#060504', panel: '#110f0a', panelLight: '#1a1610', border: '#302614', ink: '#edeae2', inkDim: '#96896e', gold: '#e08820', goldDark: '#ffab44', title: '#ffab44' },
  },
  {
    id: 'citta', nome: '🏘️ Città', audio: 'citta',
    sfondo: 'radial-gradient(52% 55% at 0% 25%, rgba(150,120,90,0.15), transparent 62%), radial-gradient(52% 55% at 100% 75%, rgba(120,100,80,0.14), transparent 62%)',
    chiaro: { bg: '#f3efe8', panel: '#fbf9f5', panelLight: '#ebe5da', border: '#c8bca8', ink: '#2c2820', inkDim: '#726a58', gold: '#a07838', goldDark: '#785424', title: '#785424' },
    scuro:  { bg: '#060606', panel: '#10100f', panelLight: '#181815', border: '#2a2822', ink: '#eceae4', inkDim: '#8e897e', gold: '#c89848', goldDark: '#e4b464', title: '#e4b464' },
  },
  {
    id: 'dungeon', nome: '⛓️ Dungeon', audio: 'dungeon',
    sfondo: 'radial-gradient(50% 60% at 0% 30%, rgba(70,90,120,0.16), transparent 62%), radial-gradient(50% 60% at 100% 70%, rgba(45,60,90,0.16), transparent 62%)',
    chiaro: { bg: '#eef0f2', panel: '#f6f7f9', panelLight: '#e4e7ec', border: '#b0b8c4', ink: '#1c222c', inkDim: '#546070', gold: '#b87d1a', goldDark: '#8a5a0c', title: '#8a5a0c' },
    scuro:  { bg: '#050608', panel: '#0a0d13', panelLight: '#111620', border: '#1a2230', ink: '#e2e8f2', inkDim: '#687892', gold: '#d4982a', goldDark: '#f0b440', title: '#f0b440' },
  },
  {
    id: 'foresta', nome: '🌲 Foresta', audio: 'foresta',
    sfondo: 'radial-gradient(55% 50% at 0% 0%, rgba(60,140,50,0.14), transparent 62%), radial-gradient(55% 50% at 100% 100%, rgba(40,110,40,0.14), transparent 62%)',
    chiaro: { bg: '#eef3ec', panel: '#f5faf4', panelLight: '#edf7eb', border: '#a3cba0', ink: '#182b17', inkDim: '#4e6d49', gold: '#4d7c30', goldDark: '#355c1d', title: '#355c1d' },
    scuro:  { bg: '#040604', panel: '#090e09', panelLight: '#0f180f', border: '#182c18', ink: '#dcefd8', inkDim: '#65905d', gold: '#5caa3b', goldDark: '#7dcf5a', title: '#7dcf5a' },
  },
  {
    id: 'palude', nome: '🐸 Palude', audio: 'palude',
    sfondo: 'radial-gradient(58% 55% at 0% 12%, rgba(73,120,78,0.18), transparent 62%), radial-gradient(58% 55% at 100% 88%, rgba(72,92,48,0.16), transparent 62%)',
    chiaro: { bg: '#edf1e6', panel: '#f8faf3', panelLight: '#e5ecd8', border: '#a9b88c', ink: '#24301d', inkDim: '#667451', gold: '#74852e', goldDark: '#52621d', title: '#52621d' },
    scuro:  { bg: '#040604', panel: '#0a0e08', panelLight: '#10170d', border: '#202d18', ink: '#dfebd4', inkDim: '#728660', gold: '#8ea64a', goldDark: '#b2c96b', title: '#b2c96b' },
  },
  {
    id: 'mare', nome: '🌊 Mare', audio: 'mare',
    sfondo: 'radial-gradient(55% 60% at 0% 15%, rgba(30,150,170,0.15), transparent 62%), radial-gradient(55% 60% at 100% 85%, rgba(40,170,190,0.13), transparent 62%)',
    chiaro: { bg: '#e8f5f4', panel: '#f4fcfb', panelLight: '#dcf0ee', border: '#96ccc8', ink: '#0e2c2a', inkDim: '#347068', gold: '#0e9088', goldDark: '#066660', title: '#066660' },
    scuro:  { bg: '#030606', panel: '#07100e', panelLight: '#0c1916', border: '#122e2a', ink: '#cef0ea', inkDim: '#4e948c', gold: '#20b0a4', goldDark: '#50d0c4', title: '#50d0c4' },
  },
  {
    id: 'tundra', nome: '❄️ Ghiacciaio', audio: 'tundra',
    sfondo: 'radial-gradient(55% 60% at 0% 15%, rgba(60,160,230,0.15), transparent 62%), radial-gradient(55% 60% at 100% 85%, rgba(90,190,255,0.13), transparent 62%)',
    chiaro: { bg: '#ebf4fa', panel: '#f5fbff', panelLight: '#e0f0fa', border: '#9cc4e0', ink: '#102436', inkDim: '#447294', gold: '#1474b0', goldDark: '#0a5280', title: '#0a5280' },
    scuro:  { bg: '#030508', panel: '#070d17', panelLight: '#0c1626', border: '#14243a', ink: '#d4eaf8', inkDim: '#5084aa', gold: '#2aa2f0', goldDark: '#60c0ff', title: '#60c0ff' },
  },
  {
    id: 'montagna', nome: '⛰️ Montagna', audio: 'montagna',
    sfondo: 'radial-gradient(58% 58% at 0% 18%, rgba(112,132,150,0.18), transparent 62%), radial-gradient(58% 58% at 100% 82%, rgba(72,92,108,0.16), transparent 62%)',
    chiaro: { bg: '#edf1f3', panel: '#f9fbfc', panelLight: '#e4eaee', border: '#aebdc7', ink: '#202b32', inkDim: '#5b6e79', gold: '#657f8f', goldDark: '#405c6d', title: '#405c6d' },
    scuro:  { bg: '#050608', panel: '#090d12', panelLight: '#10161e', border: '#1c2630', ink: '#dee7ec', inkDim: '#6c828e', gold: '#7899ad', goldDark: '#a2bed0', title: '#a2bed0' },
  },
  {
    id: 'tempesta', nome: '🌧️ Pioggia', audio: 'tempesta',
    sfondo: 'radial-gradient(55% 60% at 0% 15%, rgba(90,110,140,0.17), transparent 62%), radial-gradient(55% 60% at 100% 85%, rgba(70,90,120,0.15), transparent 62%)',
    chiaro: { bg: '#edeff2', panel: '#f6f8fa', panelLight: '#e2e6ec', border: '#aeb8c6', ink: '#1e242e', inkDim: '#586474', gold: '#5878a0', goldDark: '#3a5678', title: '#3a5678' },
    scuro:  { bg: '#040508', panel: '#080b11', panelLight: '#0e131d', border: '#18202d', ink: '#dbe2ec', inkDim: '#606e84', gold: '#6890c0', goldDark: '#88acd8', title: '#88acd8' },
  },
  {
    id: 'accampamento', nome: '🔥 Accampamento', audio: 'accampamento',
    sfondo: 'radial-gradient(70% 55% at 50% 115%, rgba(220,110,30,0.20), transparent 60%), radial-gradient(45% 50% at 0% 0%, rgba(230,130,40,0.12), transparent 60%)',
    chiaro: { bg: '#f9efe5', panel: '#fff8f2', panelLight: '#f4e4d4', border: '#dcb890', ink: '#3a2410', inkDim: '#8c6038', gold: '#c86818', goldDark: '#96460c', title: '#96460c' },
    scuro:  { bg: '#060403', panel: '#110b07', panelLight: '#1a110a', border: '#321d0d', ink: '#eee2d4', inkDim: '#9a7042', gold: '#e07818', goldDark: '#ff9c3c', title: '#ff9c3c' },
  },
  {
    id: 'deserto', nome: '🏜️ Deserto', audio: 'deserto',
    sfondo: 'radial-gradient(60% 55% at 0% 100%, rgba(210,170,60,0.15), transparent 62%), radial-gradient(60% 55% at 100% 0%, rgba(190,150,40,0.13), transparent 62%)',
    chiaro: { bg: '#f8f2e4', panel: '#fffdf9', panelLight: '#f2e8d4', border: '#d4be94', ink: '#342814', inkDim: '#8a7244', gold: '#b89020', goldDark: '#8a6a10', title: '#8a6a10' },
    scuro:  { bg: '#060503', panel: '#110e07', panelLight: '#1a140a', border: '#2e2310', ink: '#ede6d4', inkDim: '#928050', gold: '#d4aa30', goldDark: '#f0c850', title: '#f0c850' },
  },
  {
    id: 'tempio', nome: '🔮 Tempio Arcano', audio: 'tempio',
    sfondo: 'radial-gradient(60% 60% at 12% 8%, rgba(150,90,220,0.20), transparent 60%), radial-gradient(60% 60% at 88% 92%, rgba(110,60,180,0.18), transparent 60%)',
    chiaro: { bg: '#f0eaf8', panel: '#faf6ff', panelLight: '#f3eeff', border: '#c8b0e0', ink: '#1e1030', inkDim: '#7a5a9a', gold: '#7030b0', goldDark: '#521888', title: '#521888' },
    scuro:  { bg: '#050308', panel: '#0d0816', panelLight: '#140d22', border: '#241438', ink: '#e8dcf4', inkDim: '#8664a8', gold: '#a060e0', goldDark: '#c890ff', title: '#c890ff' },
  },
];

/**
 * Restituisce un'ambientazione casuale tra quelle scenografiche (esclude 'default').
 */
export function ambientazioneCasuale() {
  const opzioni = PRESET_COLORI.filter((p) => p.id && p.id !== 'default').map((p) => p.id);
  const idx = Math.floor(Math.random() * opzioni.length);
  return opzioni[idx] || 'foresta';
}
