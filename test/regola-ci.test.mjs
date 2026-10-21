// La "Regola d'oro" (CI verde prima di ogni push) deve stare, identica, nei file letti dalle diverse IA:
// se una copia resta indietro, un assistente lavora con regole vecchie e il sito smette di aggiornarsi.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const FILE = ['AGENTS.md', 'CLAUDE.md', 'GEMINI.md', '.github/copilot-instructions.md', '.cursorrules', '.windsurfrules', '.clinerules'];
const blocco = (f) => {
  const t = readFileSync(new URL(`../${f}`, import.meta.url), 'utf8');
  const m = /<!-- ci-verde:start -->\n([\s\S]*?)<!-- ci-verde:end -->/.exec(t);
  assert.ok(m, `${f}: manca il blocco ci-verde`);
  return m[1];
};

test('la regola "CI verde" è presente e identica in tutti i file delle IA', () => {
  const riferimento = blocco('AGENTS.md');
  assert.match(riferimento, /npm run verifica/);
  for (const f of FILE) assert.equal(blocco(f), riferimento, `${f}: copia diversa da AGENTS.md`);
});
