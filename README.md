# 🎲 Tavolo dei Dadi

[![Licenza MIT](https://img.shields.io/github/license/samuelenigro97-prog/Tavolo-Dei-Dadi)](LICENSE.md)
[![CI](https://github.com/samuelenigro97-prog/Tavolo-Dei-Dadi/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/samuelenigro97-prog/Tavolo-Dei-Dadi/actions/workflows/ci.yml)
[![Deploy](https://github.com/samuelenigro97-prog/Tavolo-Dei-Dadi/actions/workflows/deploy.yml/badge.svg?branch=main)](https://github.com/samuelenigro97-prog/Tavolo-Dei-Dadi/actions/workflows/deploy.yml)
[![Release](https://img.shields.io/github/v/release/samuelenigro97-prog/Tavolo-Dei-Dadi?display_name=tag&sort=semver)](https://github.com/samuelenigro97-prog/Tavolo-Dei-Dadi/releases)

Scheda del personaggio D&D 5e interattiva con tiratore di dadi integrato, nel
formato della scheda ufficiale 2024, tema "vecchio manuale" (chiaro o scuro).
Provala online: <https://samuelenigro97-prog.github.io/Tavolo-Dei-Dadi/>.

La scheda È l'interfaccia: **1 click modifica un valore, tieni premuto (o
doppio click/tap) tira il dado**.

<p>
  <img src="docs/screenshots/scheda-chiara.png" alt="Tavolo dei Dadi, tema chiaro" width="49%">
  <img src="docs/screenshots/scheda-scura.png" alt="Tavolo dei Dadi, tema scuro" width="49%">
</p>

## Cosa fa

- Tutti i tiri 5e: prove di caratteristica, tiri salvezza, 18 abilità (con
  competenza e maestria), iniziativa, attacchi e danni con dettaglio dei dadi
  (sul critico i dadi raddoppiano, il modificatore no), attacco con
  incantesimo (con CD calcolata), dadi vita, TS contro morte.
- Selettore Normale / Vantaggio / Svantaggio valido per ogni tiro di d20.
- Dado libero (d4–d100) ed espressioni a piacere tipo `3d6+2`.
- Sezioni complete: incantesimi (slot cliccabili, trucchetti separati,
  preparati in evidenza), privilegi e tratti, talenti, equipaggiamento con
  contenitori/effetti/sintonia, risorse di classe, poteri homebrew,
  Trasformazioni (Forma Selvatica/Metamorfosi con catalogo di creature),
  combat tracker, diario di sessione, lingue, denari, note.
- Regole 2014 e 2024 selezionabili (`5.0`/`5.5`), incluso lo sfinimento.
- Temi grafici multipli ("Luoghi": Taverna, Mare, Montagna...) con audio
  d'ambiente opzionale, oltre al chiaro/scuro automatico giorno/notte.
- **Più personaggi**: selettore in alto con Nuovo / Duplica / Elimina; ogni
  PG si salva da solo in `localStorage`. Quattro personaggi d'esempio già
  pronti al primo avvio.
- Import automatico della scheda da PDF (via un Worker Cloudflare che usa
  l'API Anthropic) oppure Esporta/Importa JSON per portare una scheda su un
  altro dispositivo.
- Condivisione di una scheda in sola lettura tramite codice stanza.
- PWA installabile: dopo la prima visita funziona anche offline (tranne
  l'import da PDF, che richiede la rete).
- Ottimizzata per desktop e mobile touch.

## Avvio

```bash
npm install
npm run dev
```

L'app è su <http://localhost:5173>. Non serve nessuna chiave/API per usarla:
l'unica funzione che richiede rete è l'import automatico da PDF, che punta a
un endpoint esterno (Worker Cloudflare) configurabile da menu o da
`VITE_TRANSCRIBE_URL` — senza configurarlo, tutto il resto funziona lo stesso
(si può sempre importare/esportare JSON).

### Installazione come PWA (offline)

Dalla versione pubblicata su GitHub Pages l'app è una **PWA installabile**:
apri il sito, usa il menu del browser (⋮ → "Installa app" o "Aggiungi a
Schermo") e l'app si avvia come applicazione nativa. Dopo la prima visita
funziona anche offline, tranne l'import da PDF.

Per forzare l'aggiornamento alla nuova versione: chiudi l'app con **Cmd+Q**
(Mac) o chiudi completamente la finestra e riaprila. Il meccanismo interno
(`version.json` fuori dalla cache + service worker `autoUpdate`) si occupa
di attivare il nuovo worker non appena rilevato; se resti sulla versione
vecchia, il pulsante **🔄 Aggiorna** in testata svuota la cache e ricarica.

### Primo utilizzo

All'avvio trovi già quattro personaggi d'esempio. Per iniziare da zero:

1. Clicca **➕ Nuovo personaggio** nel menu (icona 🏠 in alto).
2. Scegli specie, classe, background e caratteristiche (tutto guidato).
3. Al primo livello ti viene chiesta la sottoclasse.
4. Usa **Level Up** per avanzare di livello (si gestisce automaticamente
   PF, slot, competenze, privilegi).

**Gesti principali:**
- **1 click** su un valore = modifica inline (scrivi e premi Invio).
- **Doppio click / tieni premuto e rilascia** su un valore tirabile
  (caratteristiche, abilità, attacchi, PF, iniziativa…) = tiro del dado.
- **Barra dei dadi** in alto: scegli d4–d100, scrivi espressioni come `3d6+2`,
  imposta Vantaggio/Svantaggio.
- **Riposo Breve/Lungo** nel box PF: ricarica risorse, dadi vita, slot.
- **Esporta / Importa** nel menu: JSON per backup o per spostare la scheda su
  un altro dispositivo.

### Configurazione

- **Import PDF (IA)**: nel menu **☁️ Cloud** → "Configura import da PDF".
  Incolla l'endpoint del Worker o imposta `VITE_TRANSCRIBE_URL` in un file
  `.env` allo sviluppo. Senza endpoint l'import non funziona.
- **Endpoint transcrizione**: salvato in `localStorage`
  (`scheda-interattiva:transcribe-url`).
- **Tema**: Auto (scuro di notte o se il sistema è in modalità scura) /
  Chiaro / Scuro. I colori della scheda seguono la classe del personaggio.
- **Luoghi** (Taverna, Mare, Montagna…): ambientazioni complete con palette,
  sfondo e audio. Tutto offline.

## Test

```bash
npm test          # unitari (Node test runner)
npm run test:e2e  # end-to-end (Playwright, un file per sezione della scheda)
npm run lint       # ESLint
```

### Verificare prima di proporre una modifica

```bash
npm ci
npm run lint && npm test && npm run build
npm run test:e2e   # se la modifica tocca l'interfaccia
```

Gli stessi controlli girano su GitHub (workflow **CI**, `.github/workflows/ci.yml`)
a ogni pull request verso `main` e a ogni push su `main`: lint, test unitari,
build, smoke test (l'app costruita si apre in Chromium senza errori JS) ed e2e.

- **Spunta verde** sulla PR o sul commit: tutti i controlli sono passati.
- **Croce rossa**: almeno un controllo è fallito. Il dettaglio è nella scheda
  *Actions*; se falliscono gli e2e, il report di Playwright è allegato alla run.

Il sito su GitHub Pages si aggiorna solo dopo una CI verde su `main`
(`deploy.yml` parte al termine della CI e pubblica esattamente quel commit):
con la croce rossa resta online la versione precedente.

## Stack

React 18 + Vite per il frontend, **niente backend locale**: la UI vive
soprattutto in `src/App.jsx`, con una parte crescente di moduli estratti in
`src/ui/`, `src/rules/`, `src/data/`, `src/dati/` e `src/utils/`.

Per le convenzioni di sviluppo, la struttura dei moduli e le regole di
dominio D&D vedi [CLAUDE.md](./CLAUDE.md); per lo stato dei lavori e la
roadmap vedi [docs/BACKLOG.md](./docs/BACKLOG.md).

## Contribuire

Prima di aprire una pull request:

1. **Sincronizza** con `main`: `git fetch origin main` e `git rebase origin/main`
   (il repo usa `pull.rebase=true` + `rebase.autoStash=true`).
2. **Verifica**: `npm ci && npm run lint && npm test && npm run build`.
   Se la modifica tocca l'interfaccia, esegui anche `npm run test:e2e`.
3. **Incrementa `APP_VERSION`** in `src/App.jsx` per ogni modifica visibile.
4. **Non modificare contemporaneamente `src/App.jsx`** con altri agenti: è il
   file più a rischio conflitti. La UI è in gran parte già estratta in
   `src/ui/`, `src/rules/`, `src/data/`, `src/utils/`.

I workflow **CI** (`.github/workflows/ci.yml`) e **Deploy**
(`.github/workflows/deploy.yml`) girano a ogni push su `main` e PR: lint,
test unitari, build, smoke test e test e2e. Il sito si aggiorna solo dopo una
CI tutta verde.

## Licenza

CC-BY-4.0 per i contenuti SRD 5.1. Vedi [LICENSE.md](LICENSE.md); i testi
legali e la privacy sono anche inside app (menu **ℹ️ Info, Licenza &
Supporto**).
