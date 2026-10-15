// Import da screenshot: due schermate dello stesso PG (Main + Skills) si uniscono, e le
// competenze si ricavano dai totali letti. L'IA è finta (risposte fisse): si prova solo la parte dell'app.
import { test, expect } from '@playwright/test';
import { apriScheda } from './helpers.js';

const PNG = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR4nGP4z8DwHwAFAAH/q842iQAAAABJRU5ErkJggg==', 'base64');
const TUTTE = ['acrobazia', 'addestrareAnimali', 'arcano', 'atletica', 'furtivita', 'indagare', 'inganno', 'intimidire', 'intrattenere', 'intuizione', 'medicina', 'natura', 'percezione', 'persuasione', 'rapiditaDiMano', 'religione', 'sopravvivenza', 'storia'];

const MAIN = {
  nome: 'Frost', classe: 'Fighter', livello: 10, background: 'Soldier', specie: 'Wood Elf', pfMax: 113, ca: 17, velocita: 9,
  caratteristiche: { forza: 14, destrezza: 20, costituzione: 18, intelligenza: 11, saggezza: 14, carisma: 12 },
  tiriSalvezza: { forza: true, destrezza: false, costituzione: true, intelligenza: false, saggezza: false, carisma: false },
  tiriSalvezzaTotali: { forza: 6, destrezza: 5, costituzione: 8, intelligenza: 0, saggezza: 2, carisma: 1 },
};
const SKILLS = {
  nome: 'Frost',
  // L'IA ha letto male le stelle: tutte accese. I totali dicono la verità.
  abilita: Object.fromEntries(TUTTE.map((k) => [k, 1])),
  abilitaTotali: { acrobazia: 9, addestrareAnimali: 2, arcano: 0, atletica: 6, furtivita: 5, indagare: 0, inganno: 1, intimidire: 5, intrattenere: 1, intuizione: 6, medicina: 2, natura: 0, percezione: 6, persuasione: 1, rapiditaDiMano: 5, religione: 0, sopravvivenza: 2, storia: 0 },
};

test('import da due screenshot: le competenze arrivano dai totali e le correzioni vengono mostrate', async ({ page }) => {
  await apriScheda(page);
  await page.evaluate(() => localStorage.setItem('scheda-interattiva:transcribe-url', 'https://ia-finta.test/trascrivi'));
  let chiamata = 0;
  await page.route('https://ia-finta.test/**', async (route) => {
    const corpo = chiamata++ === 0 ? MAIN : SKILLS;
    await route.fulfill({ status: 200, contentType: 'application/json', headers: { 'access-control-allow-origin': '*' }, body: JSON.stringify(corpo) });
  });
  await apriScheda(page);
  await page.locator('input[type="file"][accept*="application/json"]').first().setInputFiles([
    { name: 'schermata-1.png', mimeType: 'image/png', buffer: PNG },
    { name: 'schermata-2.png', mimeType: 'image/png', buffer: PNG },
  ]);
  await page.getByRole('button', { name: /D&D 5\.5/ }).click();

  await expect.poll(() => page.evaluate(() => {
    const r = JSON.parse(localStorage.getItem('scheda-interattiva:v1'));
    return Object.values(r.personaggi).some((p) => p.nome === 'Frost');
  })).toBe(true);
  const frost = await page.evaluate(() => {
    const r = JSON.parse(localStorage.getItem('scheda-interattiva:v1'));
    return Object.values(r.personaggi).find((p) => p.nome === 'Frost');
  });
  expect(frost.livello).toBe(10);
  expect(frost.classe).toBe('Guerriero');
  const competenti = Object.entries(frost.abilita).filter(([, v]) => v).map(([k]) => k).sort();
  expect(competenti).toEqual(['acrobazia', 'atletica', 'intimidire', 'intuizione', 'percezione']);
  expect(Object.entries(frost.tiriSalvezza).filter(([, v]) => v).map(([k]) => k)).toEqual(['forza', 'costituzione']);
  // L'app dice cosa ha corretto.
  await expect(page.getByText('Import: correzioni automatiche')).toBeVisible();
});
