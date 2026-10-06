/** Identificatore unico per elementi creati dall'utente (attacchi, voci...): prefisso + tempo + casuale. */
export function idUnico(prefisso = 'id') {
  return `${prefisso}-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`;
}
