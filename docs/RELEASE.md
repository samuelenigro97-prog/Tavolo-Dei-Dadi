# Release — Tavolo dei Dadi

## Cosa succede in automatico

1. Ogni pull request verso `main` e ogni push su `main` avviano il workflow
   **CI** (`.github/workflows/ci.yml`): `npm run lint` (gli warning non
   bloccano), `npm test`, `npm run build`, smoke test (`node test/smoke.mjs`)
   e `npm run test:e2e`.
2. Quando la CI finisce **con successo su un push a `main`**, parte
   `deploy.yml`: ricostruisce quello stesso commit e lo pubblica su GitHub
   Pages. Se la CI fallisce, il deploy non parte e resta online la versione
   precedente. `deploy.yml` si può anche avviare a mano (*Run workflow*).

La base della build (`/Tavolo-Dei-Dadi/`) la ricava `vite.config.js` dal nome
del repository (`GITHUB_REPOSITORY`); il deploy controlla che `dist/index.html`
punti davvero a quel percorso.

## Verifica locale

1. `npm ci`
2. `npm run lint && npm test && npm run build`
3. `node test/smoke.mjs` (dopo la build) e `npm run test:e2e` se la modifica
   tocca l'interfaccia.

## Versione

Per ogni modifica: `APP_VERSION` in `src/App.jsx` (e `version` in
`package.json`), voce in cima a `CHANGELOG.md`, e una voce IT/EN in
`src/data/novita.js` solo se il cambiamento è visibile ai giocatori.

## Release su GitHub (facoltativa)

1. Tag semver, es. `git tag v4.49.0 && git push origin v4.49.0`.
2. Crea la Release dal tag e copia nel corpo la sezione di `CHANGELOG.md`.
3. Facoltativo: allega `dist/` compresso.

Dopo la pubblicazione, verifica l'app: https://samuelenigro97-prog.github.io/Tavolo-Dei-Dadi/
