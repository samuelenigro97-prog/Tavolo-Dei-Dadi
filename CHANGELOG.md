# Changelog

Formato ispirato a [Keep a Changelog](https://keepachangelog.com/it/1.1.0/).

## [4.56.1] – 2026-10-05

### Cambiato
- **Riga dei Dadi Vita** (sotto i Punti Ferita): numero e tipo di dado
  ("10 × d8") e pulsante "Usa" passano dal verde al colore del testo
  (bianco nel tema scuro, scuro in quello chiaro).

## [4.56.0] – 2026-10-05

### Cambiato
- **Riquadri statistica** (Classe Armatura, Riposo, Bonus di competenza,
  Iniziativa, Velocità, Sfinimento, Visione, Percezione passiva, Resistenze,
  Condizioni):
  - il titolo "Bonus di competenza" usciva dal riquadro: ora le etichette
    stanno sempre dentro (11px, 10px sotto i 1100px, mai parole spezzate);
  - etichetta sempre alta due righe, quindi i valori (+4, +2, 13.5 m, 0) stanno
    alla stessa altezza in tutta la riga;
  - il pulsante "Movimenti" è ancorato in basso e non sposta più in alto il
    valore della Velocità;
  - stessa cornice luminosa delle sezioni e dei blocchi caratteristica.
  Classe `.vital-box` in `stili.js`; nessun cambio di comportamento.

## [4.55.0] – 2026-10-05

### Cambiato
- **Blocchi delle caratteristiche** (Forza, Destrezza, Costituzione,
  Intelligenza, Saggezza, Carisma) con la stessa cornice delle sezioni
  (Competenze, Risorse di classe...): bordo verde luminoso, filetto interno e
  alone, con reazione al passaggio del mouse. Prima avevano un bordo sottile
  grigio che sembrava più debole accanto al resto. Solo CSS (`.blocco-car`
  in `stili.js`), segue tema chiaro/scuro e ambientazione.

## [4.54.0] – 2026-10-05

### Cambiato
- **TS contro morte** riordinati su una griglia: etichette, caselle e
  pulsanti condividono le stesse colonne, quindi Successi e Fallimenti
  restano allineati (prima la riga dei Fallimenti slittava a destra perché
  l'etichetta era più larga). Caselle più grandi (32px, prima 22px), pulsanti
  Reset/Tira affiancati e centrati sulle due righe, font più leggibili.
  Nessun cambio di comportamento.

## [4.53.0] – 2026-10-05

### Aggiunto
- **Poteri → "Da modello"**: nuovo pulsante accanto ad "Aggiungi potere" che
  inserisce in un tocco un gruppo di poteri già scritti
  (`src/data/modelliPoteri.js`). Primo modello: **Araldi del Segreto**, dal
  manuale del tavolo, con 7 poteri: Segreti e Debito (contatori, spese dei
  Segreti, lista ampliata), Soglie del Debito, Occhio Risvegliato (+1 CA, già
  pronto ma spento finché il Debito non arriva a 15), Affabilità (1°),
  Inquisire (6°), Trasferire Empatico (10°) e Braccare! (14°). I contatori
  creano da soli le risorse collegate. I poteri già presenti (stesso nome)
  non vengono duplicati.
- Su schermi stretti l'intestazione dei Poteri porta i pulsanti sotto il
  titolo, che resta centrato.

## [4.52.1] – 2026-10-05

### Corretto
- Sincronizzazione dopo l'aggiornamento alla 4.52.0: la "base" salvata dai
  dispositivi usava l'impronta senza preferenze, quindi appariva sempre
  diversa dal roster locale. Se un altro dispositivo aveva già salvato una
  versione più recente (per esempio con un nuovo Potere), compariva una
  finestra di conflitto anche se qui i personaggi non erano stati toccati,
  e scegliere "Mantieni la mia" avrebbe sovrascritto il lavoro online. Ora
  `decidiSync` riconosce l'impronta precedente (`improntaRosterLegacy`) e in
  quel caso carica la versione online.

## [4.52.0] – 2026-10-05

### Aggiunto
- **Le preferenze di aspetto e audio ora si sincronizzano** insieme ai
  personaggi (Gist e codice): tema (auto/chiaro/scuro), ambientazione,
  cornici, audio di sottofondo e volumi, effetti sonori, lingua, versione
  delle regole, manuali attivi e ordine delle sezioni. Prima restavano nel
  `localStorage` del singolo dispositivo e Mac, iPad e iPhone finivano con
  temi diversi. Restano locali: token e codici di sincronizzazione, stato del
  combattimento, guida e date di backup.
- Le preferenze viaggiano nel campo `preferenze: { ts, valori }` del roster
  (`src/utils/preferenze.js`). `ts` è l'istante dell'ultimo cambio fatto
  dall'utente: la scelta casuale del primo avvio e i valori ricevuti dal
  cloud non lo aggiornano.

### Cambiato
- `decidiSync` (`conflittiSync.js`): se i personaggi sono identici e
  differiscono solo le preferenze non c'è conflitto, vince la copia cambiata
  più di recente. L'impronta del roster include i valori delle preferenze (non
  il `ts`); il confronto dei soli personaggi ignora gli id degli attacchi, che
  l'importazione rigenera a ogni normalizzazione.
- Primo aggiornamento: la prima sincronizzazione di ogni dispositivo invia
  anche le preferenze; il resto non cambia per chi non tocca nulla.

## [4.51.0] – 2026-10-05

### Rimosso
- **Il dado 🎲 dal logo nella barra in alto**, in versione desktop e
  mobile: il titolo "Tavolo dei Dadi" parte ora direttamente dal bordo
  sinistro della barra (circa 24px più a sinistra), liberando spazio per
  i pulsanti a destra su schermi stretti. Il margine della barra non è
  cambiato: ha l'angolo arrotondato a sinistra e il testo lo toccherebbe.

## [4.50.0] – 2026-10-05

### Rimosso
- **Titolo "Profilo" in cima alla sezione profilo**: la scritta non
  serviva (anagrafica, ritratto e punti ferita si riconoscono da soli) e
  occupava una riga. Il nome resta come `aria-label` della sezione, così
  i lettori di schermo la annunciano ancora come "Profilo".

## [4.49.0] – 2026-10-03

### Aggiunto
- **CI sui test prima della pubblicazione**: nuovo workflow
  `.github/workflows/ci.yml` su ogni pull request verso `main` e ogni push
  su `main`. Esegue lint (gli warning non bloccano), test unitari, build,
  smoke test (`test/smoke.mjs`: l'app costruita si apre in Chromium senza
  errori JS) e test end-to-end Playwright; in caso di errore allega il
  report di Playwright alla run.

### Cambiato
- **Il deploy su GitHub Pages aspetta la CI**: `deploy.yml` parte solo
  quando la CI finisce con successo su un push a `main` (`workflow_run`) e
  pubblica esattamente quel commit; resta avviabile a mano.
- Tolto da `deploy.yml` il vecchio `BASE_PATH: /tavolo-dei-dadi/`: la base
  `/Tavolo-Dei-Dadi/` la ricava `vite.config.js` dal nome del repository, e
  il deploy controlla che `dist/index.html` la usi davvero. La base del CI
  vale solo per build e preview: il dev server (e2e) resta su `./`.
- `test/smoke.mjs` usa la stessa regola per la base.
- Documentato come verificare in locale e cosa significa la spunta verde o
  la croce rossa (README, `docs/RELEASE.md`, `CLAUDE.md`).
- `version` in `package.json` allineata alla versione dell'app.

## [4.48.0] – 2026-10-03

### Aggiunto
- **Promemoria backup visibile quando la sincronizzazione è spenta**: un
  banner in alto (non più solo nel pannello Avvisi) ricorda di scaricare un
  backup se non se ne fa uno da oltre 7 giorni, con "Scarica backup",
  "Attiva la sincronizzazione", "Più tardi" (3 giorni) e ✕ (fino al
  prossimo avvio). Con la sincronizzazione attiva tace; si ricontrolla ogni
  ora; per chi installa l'app ora il conto parte dal primo avvio. Logica in
  `deveRicordareBackup` (`src/utils/persistenza.js`).
- **Spazio del browser pieno**: se il salvataggio fallisce per quota
  esaurita, l'app sacrifica prima gli snapshot automatici più vecchi e
  riprova (`salvaJsonLiberandoSpazio`); se ancora non basta mostra un avviso
  rosso (`role="alert"`) con "Scarica backup". Prima l'errore veniva
  calcolato ma mai mostrato. All'avvio si chiede anche
  `navigator.storage.persist()`, così il browser non svuota i dati quando lo
  spazio scarseggia.
- **Tastiera**: Escape chiude il livello in cima (Menu Hub, menu iniziale,
  modali, menu a tendina) come un tocco sullo sfondo; nei campi di testo il
  primo Escape esce dal campo. Chip, badge e intestazioni cliccabili (circa
  40 elementi `span`/`div`) hanno `role="button"`, sono raggiungibili con
  Tab e si attivano con Invio/Spazio (`src/utils/accessibilita.js`).

### Cambiato
- **App più leggera da installare**: audio (~9 MB) e sfondi delle
  ambientazioni (~14 MB) non sono più nella precache del service worker
  (da 71 voci / ~24,8 MB a 16 voci / ~2,2 MB). Si scaricano al primo uso e
  restano in cache (CacheFirst, con supporto Range per l'audio); al primo
  ascolto di un loop se ne scarica una copia completa in sottofondo così
  funziona anche offline.
- **Menu iniziale solo al primo avvio**: non si riapre più a ogni apertura
  se il personaggio attivo è vuoto (flag
  `scheda-interattiva:menu-iniziale-visto`); resta raggiungibile dal Menu.
- **Pulsanti più grandi sulle righe incantesimo** su touch (Prep., Elimina,
  Aggiungi, Evoca, Metamorfosi…): almeno 36×44 px e più distanziati.
- **Traduzione inglese completata per l'interfaccia**: chip di lancio,
  gittata e area ("1 Azione" → "1 Action", "Tocco" → "Touch", "Sfera" →
  "Sphere"), tipo di danno e caratteristica dei riquadri di tiro
  ("Costituzione · CD 17" → "Constitution · DC 17"), circa 240 messaggi,
  toast, stati della sincronizzazione, titoli e aria-label rimasti in
  italiano, monete (MO → GP), tooltip della taglia. Nuove funzioni `tr()` e
  `traduciCaratteristica()` in `src/i18n.js`.

### Corretto
- **Combattimento su telefono**: i chip "Disponibile" e "Inneschi e
  reazioni" non si sovrappongono più al titolo "Reazioni" (vanno su una
  riga propria sotto il titolo); i chip di innesco ed effetto delle
  reazioni vanno a capo invece di essere tagliati.

### Manutenzione
- Rimossi i file di istruzioni per agenti AI di terze parti aggiunti con
  l'"antislop" (`skills/`, `anti-slop/`, `antislop.md`, script Python) e i
  relativi blocchi in `CLAUDE.md`/`GEMINI.md`; le istruzioni proprie del
  progetto restano.
- `npm test` funziona anche con Node 20 (`node --test test/*.test.mjs`).
- Ripristinati alcuni commenti esplicativi tolti in precedenza: regola dei
  dadi vita, protezione dai conflitti di sincronizzazione, archivio DM,
  mappa della campagna, effetti sonori.
- Nuovi test: unitari per salvataggio con quota esaurita, promemoria
  backup, Escape/tastiera, `tr()`; e2e in `e2e/robustezza.spec.js`.

## [4.47.0] – 2026-10-03

### Cambiato
- **Concentrazione e Rituale con un colore proprio**: fucsia (`#a21caf` sul
  tema chiaro, `#f0abfc` sullo scuro; contrasto ≈6,6:1 e ≈11:1), una tinta
  non usata da altri chip né dalle scuole. Prima erano grigio neutro come
  scuola e proprietà. Nuova costante `LANCIO` in `src/rules/scheda.js`.
- **Regola sulle icone, applicata a tutta l'app**: un'icona resta solo se si
  riconosce prima del testo o se manca lo spazio. Restano: i pulsanti solo
  icona della barra in alto (con `aria-label`), l'icona del tipo di danno o
  cura sui riquadri di tiro, i pallini degli slot incantesimo, il cestino
  solo dentro un menu o dietro conferma. Tolte: ⏱️/🎯 su tempo di lancio e
  gittata, le icone sui chip con etichetta (Prep., Concentrazione, Conc.,
  Evoca, Metamorfosi, Aggiungi, Catalogo), le emoji decorative dei titoli
  di sezione e dei gruppi del menu, le emoji nelle voci di menu e nelle
  opzioni dei selettori, quelle all'inizio di messaggi, avvisi e voci del
  registro (circa 100 testi in `i18n.js` e 250 righe in JSX). In una riga
  incantesimo resta al massimo un'icona: il tipo di danno.
- **Riquadri di tiro**: il tiro per colpire mostra "Attacco +9" invece di 🎯;
  il danno usa l'icona del suo tipo (🔥, ❄️, 💀…, 💚 per la cura) e perde il
  🎲 finale; il tiro salvezza perde il 🎲.
- **Titoli in maiuscoletto anziché tutto maiuscolo**: titoli dei pannelli,
  intestazioni di livello ("4° livello"), sottotitoli di Privilegi, Poteri e
  dei gruppi del menu, titoli dorati delle sottosezioni. Le piccole
  etichette dei campi (CA, PF, intestazioni di tabella) restano maiuscole.
- In Combattimento "📏 3m" diventa "Portata 3m" e "🏹 12" diventa
  "Frecce: 12".

### Corretto
- **"Conc." non compare più due volte**: se la nota di un incantesimo
  contiene solo "Conc."/"Concentrazione"/"Rituale" (anche in inglese), il
  segmento viene tolto dalla nota e l'incantesimo è trattato come
  concentrazione/rituale (chip, filtro Rituali, scheda informativa). Nuova
  funzione `separaNotaIncantesimo`.
- **Eliminare un incantesimo è più difficile per sbaglio**: il pulsante dice
  "Elimina" (o "Rimuovi" se in eccesso), è neutro e diventa rosso solo al
  passaggio/focus, è distanziato da Prep. e chiede sempre conferma con testo
  tradotto.
- `aria-label` tradotte per "Cloud Sync" e "Combat Tracker"; aggiunte
  `aria-label` ai pulsanti solo icona dell'intestazione e a Evoca/Metamorfosi.
- I campi numerici vuoti mostrano "—" invece di "-", che sembrava un segno
  meno (anche il GS vuoto nel Compendio).

## [4.46.1] – 2026-10-03

### Corretto
- **Sito di nuovo online dopo la rinomina del repository** in
  `Tavolo-Dei-Dadi`: GitHub Pages ora serve l'app da
  `/Tavolo-Dei-Dadi/` (il percorso distingue le maiuscole), ma la build
  cercava ancora i file in `/tavolo-dei-dadi/` e la pagina restava bianca.
  Ora `vite.config.js`, in GitHub Actions, ricava la base dal nome attuale
  del repo (`GITHUB_REPOSITORY`), con precedenza sul `BASE_PATH` del
  workflow: una futura rinomina non rompe più il sito. Aggiornati anche i link a
  repository e sito (README, link GitHub nel menu, documenti in `docs/`).
  Il vecchio indirizzo in minuscolo non funziona più: chi aveva installato
  la PWA da lì deve aprirla dal nuovo indirizzo e reinstallarla. I dati
  (localStorage e IndexedDB) sono legati all'origine
  `samuelenigro97-prog.github.io`, non al percorso, quindi restano.
- Test e2e riallineati alle modifiche del 02/10: il pulsante della guida
  iniziale ora si chiama "Inizia a giocare" e in Combattimento il chip del
  tempo di lancio precede quello della gittata.

## [4.46.0] – 2026-09-30

Applicate a Combattimento e Incantesimi le indicazioni del mockup
"anti-slop" (github.com/miqdadbadjuber/anti-slop).

### Cambiato
- **Palette ridotta**: il colore dice il tipo di dato, non la singola voce.
  Restano i colori funzionali (blu = dove: gittata/portata/area; verde =
  quando: tempo di lancio, durata, innesco; rosso = danno; ambra = tiro
  salvezza; verde acqua = cura; oro = tiro per colpire) più un neutro per
  le etichette descrittive (proprietà, effetto, Concentrazione, Rituale e
  scuola di magia, che si distinguono per testo o icona). Prima c'erano
  circa 13 tinte diverse, 8 solo per le scuole. Rimossi `COLORE_SCUOLA` e
  `coloreScuola`, non più usati.
- **La cura non è più rossa come il danno**: Parola di Guarigione, Cura
  Ferite ecc. usano un colore proprio e l'icona 💚 invece di 💥.
- **Filtri rapidi di Incantesimi**: angoli a 4px invece della "pillola" da
  16px, un solo stile attivo (l'accento oro) invece di 5 colori diversi,
  tolte le emoji che contraddicevano il resto (🎯 su "Tutti", che nell'app
  vuol dire gittata; ⚡/⏳/🛡️ diversi da quelli del tracker azioni).
- **Pulsanti di riga sincronizzati tra Combattimento e Incantesimi**: nuovo
  stile condiviso `buttonRiga` (11px, padding 2/7, angoli 4) usato da
  tiro per colpire, danno, tiro salvezza, Usa, Prep., Evoca, Metamorfosi,
  Ingrandisci/Riduci, Aggiungi ed elimina (× e 🗑). Misurati dal vivo: ora
  sono tutti alti 17px in entrambe le sezioni (prima il × era 25px e il 🗑
  20px), come i chip accanto. Il 🗑 ha ora il bordo rosso come il ×.
- Il chip "📏 3m" (portata) usa il colore della gittata invece di un blu
  scritto a mano.

## [4.45.0] – 2026-09-28

### Corretto
- **Icona incantesimi: libro, non bacchetta**: il simbolo per "questo è un
  incantesimo (non un trucchetto)" era stato allineato nella direzione
  sbagliata nella v4.43.0 — la richiesta era usare 📖 ovunque, non 🪄.
  Corretto in Combattimento (riga dell'incantesimo), nel filtro per
  livello e nel menu "Azione Bonus" di Combattimento; il filtro livello
  torna a 📖 com'era prima. Le 3 occorrenze di 🪄 rimaste (icona di
  "correzione automatica applicata" nel Level Up) non sono lo stesso
  concetto e restano invariate.
- **Riquadri di tiro per colpire/danno e il bottone × più squadrati dei
  chip a fianco**: `BadgeTiroColpire`, `BadgeTiroDanno` e
  `BadgeTiroSalvezza` (condivisi da Combattimento e Incantesimi)
  ereditavano `border-radius: 6` da `buttonMini`, mentre i chip (gittata,
  tempo, scuola…) usano `border-radius: 4`. Uniformati a 4 insieme al
  bottone di eliminazione (× in Combattimento, 🗑 in Incantesimi), che
  usava lo stesso 6 di base.

## [4.44.0] – 2026-09-28

### Aggiunto
- **Icona del tipo di azione in Combattimento**: ogni riga (Azione/Azione
  Bonus/Reazione) mostra ora un chip "⏱ 1 Azione/Azione Bonus/Reazione"
  (stessa icona e stesso colore verde del chip "tempo" di Incantesimi),
  subito dopo la gittata — che resta sempre il primo chip, invariato.
- **Concentrazione e Rituale scritti per intero, con un colore proprio**:
  prima un incantesimo con concentrazione mostrava solo un'abbreviazione
  "Conc." in un chip neutro senza colore (il testo libero della nota).
  Ora "Concentrazione" e "Rituale" sono due chip dedicati, con la stessa
  icona usata nei filtri rapidi (🧠/📜) e un colore proprio (categorie
  `concentrazione` e `rituale` in `COLORE_CATEGORIA_INFO`).

### Corretto
- **Colore delle scuole di magia non più fisso tra i due temi**: come già
  per `COLORE_CATEGORIA_INFO`, `COLORE_SCUOLA` ora ha una coppia
  chiaro/scuro per ogni scuola invece di un hex unico — Necromanzia (la
  più segnalata) restava troppo tenue e si perdeva nel tema chiaro perché
  lo stesso verde chiaro doveva reggere sia lo sfondo bianco sia quello
  quasi nero. Aggiornati anche gli altri 7 hex per la stessa ragione.
- **Filtri rapidi di Incantesimi di altezze diverse** ("Tutti", "Solo
  Preparati", "Azione", "Azione Bonus", "Reazione", "Concentrazione",
  "Rituali"): senza `white-space: nowrap` alcuni pill andavano a capo su
  due righe a seconda dello spazio ricevuto dal flex-wrap del contenitore,
  diventando più alti degli altri. Ora restano sempre su una riga.

## [4.43.0] – 2026-09-28

### Cambiato
- **Emoji dei filtri Incantesimi allineate al resto dell'app**: nel menu a
  tendina del livello, gli incantesimi con slot usavano 📖 mentre in
  Combattimento e ovunque altrove il simbolo per "incantesimo (non
  trucchetto)" è 🪄 — ora è lo stesso in entrambi i posti. Rimossa anche
  l'emoji 🔮 da "Tutti i livelli" e "Tutte le scuole" (era un'icona
  generica senza un vero significato lì).
- **Verificato dal vivo** (misura dei computed style, non solo lettura del
  codice) che le dimensioni dei chip/badge (gittata, scuola, tempo…) sono
  già identiche pixel per pixel tra Combattimento e Incantesimi/Trucchetti
  — la differenza percepita nei due screenshot era dovuta allo zoom/alla
  larghezza finestra diversa tra le due catture, non a un bug di stile.

## [4.42.0] – 2026-09-28

### Cambiato
- **Ordine dei chip allineato tra Incantesimi e Combattimento**: la scuola
  di magia (che non ha un equivalente in Combattimento) si spostava prima
  dei chip comuni (tempo, gittata…), rompendo l'allineamento tra le due
  sezioni. Ora la scuola sta subito prima dei bottoni di tiro
  attacco/danno, sulla destra — i chip comuni restano nello stesso ordine
  in entrambe le sezioni.

## [4.41.0] – 2026-09-28

### Aggiunto
- **Divisori per Grado di Sfida** nel catalogo "Evoca/Aggiungi Compagno o
  Famiglio" (scheda Bestie): le creature sono raggruppate in "cartelle"
  per GS crescente, in ordine alfabetico dentro ogni gruppo, come nel
  catalogo Forma Selvatica/Metamorfosi. Le altre schede (Famigli,
  Evocazioni, Tutti) restano in ordine alfabetico semplice.

### Cambiato
- **Colore Necromanzia**: era identico al colore del tempo di lancio "1
  Azione" (stesso verde), rendendo i due badge indistinguibili sulla riga
  di un incantesimo di quella scuola. Ora usa un verde-lime diverso.
- **Bottoni Riposo Breve/Lungo** ingranditi e impilati verticalmente
  (Breve sopra, Lungo sotto) invece che affiancati in piccolo.
- Rimosso il numero percentuale che spuntava fuori dal riquadro dei P.E.
  nel Profilo: la barra di progresso sotto basta da sola.

### Rimosso
- **Bottone matita (✎) accanto al cestino** di ogni incantesimo/trucchetto:
  apriva un modulo per modificare a mano nome, scuola, danno ecc. di un
  incantesimo, in contrasto con il resto dell'app dove le magie sono
  automatiche e prese dal manuale (la sezione Poteri resta l'unico posto
  per le regole personalizzate).

### Corretto
- **Test e2e "Velocità in blu" instabile**: il test confrontava il colore
  con l'hex del tema chiaro senza forzarlo, e il tema di default "auto"
  passa al tema scuro di notte (`eNotte`: 20-7) — il test falliva o meno a
  seconda dell'ora reale di esecuzione. Ora il test forza esplicitamente
  il tema chiaro.

## [4.40.0] – 2026-09-26

### Corretto
- **La sincronizzazione non sovrascrive più in silenzio una versione online
  più recente.** Il 26/09 un dispositivo con dati locali vecchi ha rimandato
  online (16:06-16:07) un roster superato, annullando correzioni e
  ricreando/cancellando personaggi. Causa: prima di scrivere l'app rileggeva
  la copia online solo per preservare le immagini, senza chiedersi se fosse
  più recente; all'avvio l'auto-salvataggio (es. dopo il caricamento delle
  immagini da IndexedDB) poteva partire prima del caricamento dal cloud, e una
  scheda rimasta aperta per ore non ricontrollava mai il cloud.

### Aggiunto
- **Rilevamento dei conflitti** (`src/utils/conflittiSync.js`), per il backup
  su GitHub (Gist) e per il codice di sincronizzazione (Worker):
  - ogni dispositivo ricorda la "base", cioè la versione online da cui partono
    le sue modifiche (revisione del Gist o `updatedAt` del Worker, più
    un'impronta del roster locale in quel momento);
  - prima di ogni invio rilegge la copia online: se nessun altro l'ha
    cambiata invia; se è cambiata e qui non ci sono modifiche la carica da
    sola; se è cambiata e ci sono modifiche anche qui **non invia** e apre la
    finestra "Versione online più recente" con: *Carica la versione online*
    (la versione locale resta in Cronologia versioni), *Mantieni la mia
    versione* (con conferma esplicita), *Scarica entrambe le versioni*,
    *Decidi più tardi* (sincronizzazione in pausa, segnalata nel pannello e
    nell'icona della barra);
  - all'avvio si legge sempre prima la copia online e gli auto-salvataggi
    aspettano la fine della verifica; al ritorno sull'app (scheda visibile,
    finestra a fuoco, connessione tornata) si ricontrolla (max 1 volta ogni
    30 s);
  - offline o con risposta illeggibile non si scrive mai: si riprova dopo;
  - niente più revisioni inutili del Gist quando il roster non è cambiato.
- **Worker `/sync`**: il PUT accetta `baseUpdatedAt` e risponde `409
  SYNC_CONFLICT` se la copia salvata è cambiata nel frattempo (compatibile con
  le versioni precedenti dell'app; va ridistribuito il Worker per attivarlo).
- Test: `test/conflitti-sync.test.mjs` (scenario del 26/09 riprodotto passo
  passo, migrazione dalla v4.39, Worker) ed `e2e/sync-conflitto.spec.js`
  (Gist e codice simulati).

## [4.39.0] – 2026-09-26

### Modificato
- **Testi dell'interfaccia più professionali (prima parte della
  proposta di revisione dei testi)**: revisione di menu, impostazioni,
  pulsanti, finestre, toast, stati vuoti e tooltip, in italiano e in
  inglese. La terminologia di regolamento D&D resta invariata (inclusa
  "Razza" per le schede 5.0).
  - **Glossario unico**: Compendio (era "Ricerca Rapida"), Combattimento
    (era "Scontro"/"Combat Tracker"), Avanzamento di livello / Sali di
    livello (era "Level Up"/"Passaggio di Livello"), Backup e
    sincronizzazione (era "Sincronizzazione Cloud"/"Backup automatico"),
    Esporta backup / Ripristina backup (erano "Esporta tutto", "Backup
    Completo (Tutti i PG)", "Scarica Archivio Completo"), Cronologia
    versioni (era "Versioni"), Archivio del Master (era "Archivio PG"),
    Avvisi e novità (era "Bacheca & Notifiche"), Atmosfera (era
    "Ambientazione"), Sessione condivisa / codice (era "Stanza
    temporanea"), I miei personaggi, Personaggio casuale, sezione
    Incantesimi (era "Magia") e Aspetto e storia (era "Background"). In
    inglese DM al posto di GM, "DM archive" al posto di "PG Archive".
  - **Maiuscole solo a inizio frase** (Title Case all'inglese rimosso:
    "Salva Scheda", "Media Fissa", "Tira Ora"…), niente maiuscolo gridato
    ("📥 IMPORTA", "👉 IN TURNO", "Tira danni RADDOPPIATI", "Backup Cloud
    NON ATTIVO"…), "e" al posto di "&", "…" al posto di "...".
  - **Tono sobrio**: niente frasi colloquiali ("Tre gesti e sei operativo",
    "Ho capito, cominciamo" → "Inizia", "Un attimo di pazienza", "Offrimi
    un caffè") né punti esclamativi nei messaggi; errori e toast della
    sincronizzazione riscritti; abbreviazioni sciolte dove c'è spazio
    ("Percezione passiva", "Bonus di competenza", "PE" al posto di "P.E.").
  - **Refusi e correzioni**: "Converti in MR/MA" → "Converti in MO";
    accenti mancanti ("ed è contrassegnato", "metà dei danni… se
    superiore"); inglese "Increase / Feat", "let us start", "Movements",
    "Overloaded" corretti; l'onboarding ora descrive il gesto principale
    (tieni premuto per tirare).
  - **Nessuna affermazione "ufficiale"**: la stampa è ora "Scheda
    stampabile in formato A4" (prima "Scheda ufficiale cartacea" e "formato
    scheda ufficiale D&D").
  - Numeri: 355 chiavi i18n modificate (314 valori IT, 302 EN su 823
    chiavi) e circa 150 stringhe inline in `App.jsx`, `PoteriSezione.jsx`,
    `componenti.jsx`, `CompendioModal.jsx`, `dati5e.js`.
  - Non inclusi (PR successive): riorganizzazione di barra/menu e
    spostamento delle stringhe inline in i18n; riscrittura delle Novità
    passate.
- Test e2e aggiornati ai nuovi testi (pulsante "Inizia", "1° livello",
  "Compagni, famigli ed evocazioni").

## [4.38.0] – 2026-09-26

### Corretto
- **Azioni Bonus vuota anche con incantesimi ad azione bonus**: un
  incantesimo salvato tra gli attacchi (es. Randello Incantato) finiva
  sempre in Combattimento, perché la sezione veniva dal campo `categoria`
  (che l'import imposta ad "Azione" di default) invece che dal tempo di
  lancio. Ora la sezione di ogni incantesimo viene dal suo **tempo di
  lancio** (voce della lista → database → descrizione), riconosciuto in
  modo tollerante (`categoriaDaTempoLancio`: maiuscole, spazi, accenti,
  "1 Azione Bonus", "AZ BONUS", "Bonus Action", "REAZ"…). Randello
  Incantato non è più duplicato in Combattimento.
- **Cure ad azione bonus**: le cure con un tiro (es. Parola di Guarigione
  2d4) compaiono in Azioni Bonus, senza un bonus per colpire finto. In
  Combattimento (Azione) le cure restano fuori come prima.
- **Gittata sempre primo chip**: in Combattimento, Azioni Bonus e Reazioni
  la gittata/portata (🎯 Tocco, 9m, 18m, gittata delle armi a distanza) è
  sempre il primo chip dopo il nome, anche quando la nota non la scrive
  (es. Inaridire mostrava solo la CD). Rimosso il chip "📏 3m" di portata
  che compariva per errore su Frusta di Spine (la portata è delle armi).
- **Velocità**: il riquadro mostrava la velocità base (10,5m) con un
  piccolo "+3m" sotto. Ora mostra il **totale vero** (base + Poteri, con lo
  Sfinimento applicato: 13,5m) in **blu** quando è modificato, con il
  dettaglio nel tooltip; 1 click modifica sempre la velocità base. Anche
  il movimento del turno (sezione Azioni) usa ora il totale.
- **Randello Incantato: stesso danno ovunque**: in Combattimento c'era
  "1d8+5" (valore salvato a mano) e in Trucchetti "1d8". Ora entrambi usano
  un'unica fonte di verità, `dannoRandelloIncantato`: dado dai dati
  dell'incantesimo + modificatore della caratteristica da incantatore (5e:
  Shillelagh usa la caratteristica da incantatore per attacco E danni), con
  attacco = competenza + mod. Un "+K" salvato vecchio viene ignorato.
- **Incantesimi a tiro salvezza senza tiro per colpire**: l'attacco salvato
  di Morsa del Gelo mostrava "+9" per colpire. Ora ogni incantesimo a TS
  (salvato o dalla lista, anche in Trucchetti/Incantesimi) mostra solo il
  badge della CD (🎲 Costituzione · CD 17, calcolata `8 + competenza + mod`),
  che sostituisce anche il chip CD ripetuto nella nota.
- **Chip proprietà pulito**: da "Trucchetto (Attacco Magico): trascina 3m"
  usciva il chip "Magico): trascina 3m". `estraiCategorieNota` ora si ferma
  a parentesi/due punti/"•" (→ "Magico"), mantenendo interi "Magico con SAG
  (Randello/Bastone)", "Versatile (1d8)", "Versatile 1d8-3", "Maestria: …".
- **Trucchetti scalati col livello anche nella lista Trucchetti**: la lista
  mostrava il danno base (Frusta di Spine 1d6) mentre Combattimento lo
  scalava (2d6 al 10°). Ora una sola funzione, `dannoTrucchettoScalato`,
  calcola il danno di tutti i trucchetti in entrambe le sezioni (e nel tiro):
  danno di base dalla voce della lista/dati dell'incantesimo
  (`dannoBaseTrucchetto`, il valore salvato nell'attacco è solo un ripiego)
  × 1/2/3/4 dadi al 1°/5°/11°/17°. Per Vaelion l'attacco salvato di Morsa del
  Gelo passa da "2d8" (dado sbagliato) a "2d6", come i dati (1d6 freddo).
- **Randello Incantato scala con le regole 2024**: `dadoRandelloIncantato`
  segue l'edizione del personaggio — 5.0 (2014): d8 fisso, come i dati
  dell'incantesimo nel repo; 5.5 (2024): d8 → d10 al 5° → d12 all'11° → 2d6
  al 17° — sempre + modificatore da incantatore, uguale in Azioni Bonus e
  Trucchetti. Vaelion è 5.0 (forzato da `migrazioneRegoleVaelion`), quindi
  resta 1d8+5.
- `categoriaAttaccoSalvato` (pura, testata su tutti gli incantesimi "Azione
  Bonus" del database): un incantesimo ad azione bonus non compare mai in
  Azione, anche se salvato con `categoria: 'Azione'`.
- **Regole per edizione del personaggio (5.0 = PHB 2014, 5.5 = PHB 2024)**
  — audit completo; ogni PG usa le regole della propria edizione:
  - **Incantesimi con varianti per edizione** (`VARIANTI_EDIZIONE_INCANTESIMI`
    + `setEdizioneIncantesimi`, sincronizzata da `setEdizioneAttuale`): il
    database mescolava le edizioni (Cura Ferite 2d8 della 2024 accanto a
    Tocco Gelido 36m della 2014). Ora dadi, tempo, gittata, concentrazione
    e testo seguono l'edizione del PG: Cura Ferite 1d8/2d8, Parola di
    Guarigione 1d4/2d4, Parola di Guarigione di Massa 1d4/2d4, Cura Ferite
    di Massa 3d8/5d8, Tocco Gelido 36m 1d8 / tocco 1d10, Produrre Fiamma
    azione 9m / azione bonus 18m, Colpo Accurato (2014: vantaggio, niente
    danni), Arma Spirituale e Interdizione alle Lame (concentrazione solo
    2024), Marchio del Cacciatore (forza nella 2024), Sonno (5d8 PF / TS
    Saggezza), Guida e Resistenza (effetto diverso; Guida è un'azione con
    concentrazione in entrambe le edizioni), Randello Incantato. Anche il
    Compendio applica le varianti.
  - **Valori salvati dell'altra edizione** (`valoreIncantesimoPerEdizione`):
    un valore salvato che coincide con quello dell'altra edizione (es.
    "Cura Ferite 2d8" rimasto su un PG 5.0) viene mostrato con il valore
    della propria edizione; un valore personalizzato resta. I dati salvati
    non vengono modificati.
  - **Cure + modificatore**: Cura Ferite, Parola di Guarigione (anche di
    Massa), Cura Ferite di Massa e Preghiera di Guarigione sommano il
    modificatore da incantatore al tiro (Vaelion: Parola di Guarigione
    1d4+5, Cura Ferite 1d8+5) — `dannoCuraConModificatore`. Nella lista
    incantesimi una cura non mostra più un tiro per colpire finto.
  - **Riposo lungo**: recuperava sempre metà dei Dadi Vita; nella 5.5 si
    recuperano tutti (`dadiVitaRecuperatiRiposoLungo`). Testi aggiornati.
  - **Sfinimento**: senza `versione` il PG era trattato come 2014, mentre
    il resto della scheda usa la 2024: ora il default è coerente.
  - **Controllo sottoclasse**: il controllo "sottoclasse prima del livello
    di sblocco" non scattava mai (argomenti sbagliati a
    `sottoclasseLivPer`); ora usa il livello dell'edizione del PG (es.
    Druido 2° nella 5.0, 3° nella 5.5).
  - **Privilegi di sottoclasse 5.0** (`SUBCLASS_PRIVILEGI_2014`): la tabella
    era solo 2024 anche per i PG 5.0 (es. Campione con "Guerriero Eroico"
    al 10° invece di "Stile di Combattimento Aggiuntivo"). Aggiunte le
    versioni 2014 di Campione, Berserker, Cacciatore, Signore delle Bestie,
    Assassino, Collegio della Sapienza, Circolo della Terra/Luna,
    Giuramento di Devozione, Stregoneria Draconica/Magia Selvaggia;
    elenco senza doppioni (privilegi ripetuti al 2°/3° livello).
  - **Invocazioni del Warlock**: il massimo usava le regole globali invece
    dell'edizione del PG.
  - **Maestria nelle armi** (solo 2024): una nota salvata "Maestria: …" su
    un PG 5.0 non diventa più un chip in Combattimento.
  - **Specie/razze per edizione** (`SPECIE_DATI_2014`): velocità e tratti
    automatici erano solo 2024 (o misti). Nella 5.0 nani, gnomi e halfling
    hanno 7,5 m (le sottorazze solo 5.0 — Halfling Piedelesto/Tozzo, Nano
    delle Colline/Montagne — ora 7,5 m sempre), il Dragonide non ha
    scurovisione, l'Elfo Alto/dei Boschi/Drow mantiene i tratti 2014
    (Addestramento nelle Armi Elfiche, trucchetto da mago…). Nella 5.5 gli
    elfi e gli gnomi ricevono il **Lignaggio** (con spiegazione) invece dei
    tratti 2014.
  - **Privilegi della Scuola di Invocazione 5.0** (Trucchetto Potente al 6°).
- **Personaggi forniti con l'app** (`src/data/esempi.js`), controllati uno a
  uno con le regole della loro edizione:
  - Vaelion: Randello e Bastone Ferrato usavano FOR 4 (+1, 1d4-3) ignorando
    i Guanti della Forza Orchesca (FOR 19): ora +8, 1d4+4 / 1d6+4 (1d8+4);
    attacco salvato di Morsa del Gelo 2d6 (era 2d8); competenza nei randelli.
  - Wendell: Arco Corto 1d6+3 (era 1d8); tolto il contatore separato "Manto
    di Ispirazione" (spende un uso di Ispirazione Bardica); Kit da Falsario
    del Ciarlatano.
  - Flyora (5.5): tratti dell'Elfo 2024 (niente Addestramento nelle Armi
    Elfiche/trucchetto da mago 2014, sì Lignaggio Elfico); la spada corta
    è un'arma da guerra senza competenza (+2, era +4); Metamagia e
    privilegi della Magia Selvaggia nel posto giusto; edizione esplicita.
  - Boddynock e Lyrian: edizione 5.0 esplicita (tratti Gnomo delle Rocce
    2014, Lama Iettatrice e Forestiero esistono solo nella 5.0; senza
    campo erano trattati come 5.5). Boddynock: +1 della Bacchetta della
    Guerra Magica ai tiri con incantesimo, privilegi di sottoclasse
    separati. Lyrian: "Colpo Ardente" (Paladino/Ranger) sostituito da
    "Colpo Irato" della lista della Lama Iettatrice; giavellotto con la
    Forza (+3, 1d6; non è accurato); privilegi di sottoclasse separati.
  - Elevorn: aggiunti i privilegi mancanti (Lancio di Incantesimi,
    Consapevolezza Primordiale, Attacco Extra, Maestria).
- **Condizioni per edizione** (`effettiCondizione(nome, versione)` in
  `condizioni.js`, usata da `riepilogoCondizioni` e dal Compendio): nella
  5.5 Afferrato dà svantaggio agli attacchi contro chi non ti afferra e ti
  permette di trascinare; Incapacitato toglie anche le azioni bonus, la
  parola e dà svantaggio all'iniziativa (ereditato da Paralizzato,
  Pietrificato, Privo di sensi e Stordito); Invisibile dà vantaggio
  all'iniziativa; Stordito non azzera più la velocità. Nella 5.0 restano gli
  effetti 2014. Nuovi effetti: vantaggio agli attacchi, niente azioni bonus,
  concentrazione interrotta, vantaggio/svantaggio all'iniziativa. I chip
  delle condizioni nella scheda mostrano nel tooltip gli effetti
  dell'edizione del PG.
- **Ranger 5.0: Sensi Primordiali (Consapevolezza Primordiale) costa uno
  slot incantesimo**: non viene più creato il contatore "Sensi Primordiali"
  (mod. SAG usi / riposo lungo) che non esiste nelle regole 2014; spiegazione
  aggiornata (1 minuto per livello dello slot, 1,5 km / 9 km nel terreno
  prescelto). Un contatore già salvato su una scheda non viene toccato: si
  può eliminare a mano.
- **Colpo Accurato 5.5**: il danno radiante extra parte dal 5° livello
  (1d6, 2d6 all'11°, 3d6 al 17°); ai livelli 1-4 non c'è danno extra
  (prima mostrava 1d6 dal 1° e 2d6 al 5°). Nella 5.0 non fa danni.
- **Testi inglesi degli incantesimi per edizione**: Cura Ferite, Parola di
  Guarigione (anche di Massa), Cura Ferite di Massa, Tocco Gelido, Produrre
  Fiamma, Colpo Accurato, Arma Spirituale, Sonno, Guida, Resistenza,
  Interdizione alle Lame e Randello Incantato hanno in inglese il testo
  2014 o 2024 secondo l'edizione del PG (`EN_VARIANTI_INCANTESIMI`), come
  già in italiano.
- **Incantesimi senza tiro per colpire**: Assorbire Elementi (il danno va
  sul tuo prossimo colpo in mischia), Marchio del Cacciatore, Maledizione e
  Dardo Incantato (colpisce sempre) non mostrano più il badge 🎯 nella
  lista Incantesimi né un bonus d'attacco in Combattimento.
- **Tabelle delle sottoclassi separate 5.0/5.5**
  (`tabellaPrivilegiSottoclasse`): le tabelle che mescolavano la riga 5.0
  (1°/2° livello) con quella 5.5 (3° livello) mostrano solo quella giusta.
  5.0: Domini (1°, 2°, 6°, 8°, 17°; Incantesimi del Dominio al 1°), Circoli
  (2°), Scuole di magia (2°), Origini stregonesche e Patroni (1°) senza il
  doppione del 3°. 5.5 (sottoclassi del Manuale 2024): solo dal 3°, e i
  Domini senza l'8°. Le sottoclassi solo 5.0 restano complete anche su un
  PG 5.5. Tabelle 2014 proprie per Collegio del Valore (Competenze Bonus),
  Guerriero della Mano Aperta (11° Tranquillità; 5.5: Passo Lesto),
  Guerriero dell'Ombra (11° Manto di Ombre, 17° Opportunista; 5.5: Passo
  d'Ombra Migliorato / Manto di Ombre), Giuramento degli Antichi (Scacciare
  l'Infedele solo 5.0) e Giuramento di Vendetta (Abiurare Nemico, 5.0).
  Anche il riepilogo del passaggio di livello usa la tabella dell'edizione.
- **Stregone con dado vita d6**: `DADO_VITA_CLASSE` dava d8 allo Stregone
  (d6 sia nella 5.0 sia nella 5.5); i dadi vita, ricalcolati a ogni
  caricamento, tornavano sempre 4d8 per Flyora.
- **Stregoneria Esplosiva è il trucchetto 1d8 (Sorcerous Burst, 5.5)**: nel
  database c'erano i dati di Onda di Caos (1° livello, 2d8+1d6); ora è un
  trucchetto da 1d8 (36m, tipo a scelta, ogni 8 fa tirare un d8 in più) che
  scala a 2d8/3d8/4d8 al 5°/11°/17°. Onda di Caos resta com'era.
- **Rimossi `public/Vaelion.json` e `public/Flyora.json`**: non erano usati
  dall'app (nessun riferimento nel codice) ed erano superati dai personaggi
  di esempio in `src/data/esempi.js`.

### Cambiato
- **Tiro per colpire e danni con gli stessi badge di Incantesimi**:
  Combattimento, Azioni Bonus e Reazioni usano ora le stesse "pillole" di
  Trucchetti/Incantesimi (🎯 +9 giallo fisso, 💥 1d6 Perforante 🎲 rosso),
  componenti condivisi `BadgeTiroColpire`/`BadgeTiroDanno`. 1 click = tiro.

## [4.37.0] – 2026-09-24

### Cambiato
- **Tiro per colpire sempre giallo**: il bottone/valore del tiro per
  colpire (Combattimento, Incantesimi, statblock Bestiario/Compagni) usava
  `C.goldDark`, tinto dal colore di classe — su un Druido diventava verde
  invece di oro/giallo, con una sfumatura diversa da personaggio a
  personaggio. Ora usa un giallo fisso, uguale per tutti i personaggi e in
  ogni sezione, distinto dal tiro salvezza (ambra) e dalla proprietà (oro).

## [4.36.0] – 2026-09-24

### Aggiunto
- **Sezione "Azioni Bonus" sempre visibile in Combattimento**, posizionata
  prima di Reazioni (era già lì nell'ordine interno, ma spariva del tutto
  se il personaggio non aveva nessun attacco/incantesimo a danno con tempo
  "Azione Bonus" equipaggiato/preparato). Ora, come Azione e Reazioni,
  mostra sempre il proprio titolo, con un messaggio chiaro quando è vuota
  invece di nascondersi.

## [4.35.0] – 2026-09-24

### Corretto
- **La vera differenza rimasta tra Combattimento e Incantesimi**: ogni riga
  di Incantesimi è una "scheda" con bordo e sfondo (`C.panelLight`) propri,
  non solo un separatore in basso — questo era sfuggito ai controlli
  precedenti (avevo verificato badge e bottoni, non il riquadro dell'intera
  riga). Ora `.attacchi-riga` ha lo stesso bordo/sfondo/padding/border-radius,
  identico in entrambe le sezioni.
- **Font del nome del personaggio**: usava il font di base invece del font
  decorativo del titolo (lo stesso usato per il badge "5.0"/"5.5" accanto).
  Ora coincidono.

## [4.34.0] – 2026-09-24

### Rimosso
- **Matita (✎) per modificare la nota di un attacco/reazione quando i badge
  la riassumono già**: Combattimento non ha campi liberi modificabili a
  mano per principio — i valori vengono dalle regole/manuali D&D, non da
  testo scritto a mano (le uniche regole personalizzate ammesse vivono
  nella sezione Poteri). Quando i badge riassumono già la nota, ora non
  c'è più alcun modo per "modificarla" a testo libero.

## [4.33.0] – 2026-09-24

### Corretto
- **Ultima differenza reale tra Combattimento e Incantesimi**: i bottoni di
  tiro per colpire/danno in Combattimento erano grigi/neutri, mentre in
  Incantesimi sono colorati (oro per il tiro d'attacco — tinto dal colore
  di classe come tutto il resto — rosso per il danno). Ora usano
  esattamente lo stesso stile in entrambe le sezioni.

## [4.32.0] – 2026-09-24

### Corretto
- **Campo "Background" nel Profilo troncato** ("BACKGR…"): la colonna della
  griglia era troppo stretta per la parola intera. Allargata.
- **Righe Reazioni troppo alte**: i badge Innesco/Effetto contenevano la
  frase intera (anche 80+ caratteri), molto più larghi dei badge brevi di
  Incantesimi ("Tocco", "1 Azione"). Ora sono troncati con "…" a una
  larghezza fissa, col testo completo nel tooltip.
- **Badge scuola di magia (Trasmutazione, Abiurazione...) di forma diversa
  dagli altri badge**: bordo semitrasparente, meno padding verticale e un
  bagliore che gli altri chip non hanno. Uniformato allo stesso stile.
- **Ordine di Bonus/Danno in Combattimento**: comparivano subito dopo il
  nome, prima delle note — in Incantesimi invece badge/note vengono prima
  e i bottoni di tiro dopo. Stesso ordine ora in entrambe le sezioni.
- **Badge "Trucchetto" ridondante in Combattimento**: la riga mostra già
  l'icona ✨ per i trucchetti (contro 🪄 per gli incantesimi con slot); il
  badge ripeteva la stessa informazione. Rimosso (restano "Magico",
  "Versatile", "Maestria" quando pertinenti).

## [4.31.0] – 2026-09-24

### Corretto
- **Combattimento/Reazioni ancora "diverse" da Incantesimi**: la conversione
  a schede di v4.28.0 aveva dato loro un formato TUTTO SUO (riquadro con
  bordo/ombra, etichette maiuscole "BONUS ATT."/"DANNO E TIPO"/"NOTE") che
  non esisteva affatto nelle righe di Incantesimi. Ora entrambe le sezioni
  usano la stessa identica riga fluida: nome + badge che scorrono in
  un'unica riga con separatore in basso, senza riquadro né etichette (le
  icone bastano). Come effetto collaterale si risolve anche il bottone "×"
  di eliminazione che sembrava incollato ai danni: ora è sempre isolato
  all'estrema destra della riga.
- **Icona 🔮 sul badge della scuola di magia** (Trasmutazione, Abiurazione,
  ecc.) rimossa: il colore e il nome bastano, l'icona era ridondante.

## [4.30.0] – 2026-09-24

### Migliorato
- **Import da PDF più completo**: il Worker ora chiede all'IA di estrarre
  l'inventario come lista di oggetti strutturati (nome, quantità, peso,
  equipaggiato, categoria, utilizzi, sintonia, effetto) invece di un unico
  blocco di testo — dopo l'import la sezione Equipaggiamento è già pronta
  invece di dover essere reinserita a mano. Estrae anche il campo "Sesso" e,
  per ogni incantesimo, se è preparato/richiede concentrazione/è un rituale.
  **Richiede un ridistribuzione manuale del Worker** (`worker/
  transcribe-worker.js`) per chi lo ha già pubblicato — vedi `worker/
  LEGGIMI.md`; l'app lato client supportava già questi dati, mancava solo
  che il Worker li chiedesse.

## [4.29.0] – 2026-09-24

### Corretto
- **Contrasto dei badge viola/blu illeggibile in tema scuro**: la palette per
  tipo di informazione introdotta in v4.27.0 usava un solo colore fisso per
  chiaro e scuro — ok per blu/rosso/ambra/oro, ma il viola (Durata/Effetto)
  era sotto la soglia di leggibilità su sfondo quasi-nero. Ora ogni colore
  ha una variante chiara e una scura scelte per il contrasto giusto in
  entrambi i temi.
- **Innesco e Gittata non condividono più lo stesso blu**: sono due concetti
  diversi (una condizione di innesco reazione contro una distanza/portata di
  incantesimo) e ora hanno colori distinti; il "Tempo di lancio" (Azione/
  Bonus/Reazione) aveva anche lui il colore di Durata per errore, ora è
  un colore a parte.
- **Reazioni senza attacco/danno reali non mostrano più "+0" o testo
  fuori posto**: "Totem Spirituale (Falco)" (concede solo Vantaggio) e
  "Assorbire Elementi" (il danno si applica al TUO prossimo attacco, non è
  un tiro proprio) mostravano un bonus attacco fittizio e/o il testo
  dell'effetto ripetuto nella colonna Danno. Corretta anche la causa nei
  dati (un incantesimo-reazione con *qualsiasi* danno associato veniva
  scambiato per un attacco).

## [4.28.0] – 2026-09-24

### Migliorato
- **Combattimento e Reazioni ora sono "schede" come Incantesimi**: ogni
  attacco/reazione è una riga autonoma con nome, badge e pulsanti che si
  dispongono liberamente (etichette Bonus Att./Danno e Tipo/Note davanti al
  valore), non più celle di tabella rigide — stesso linguaggio visivo della
  sezione Magia, su ogni dimensione di schermo.

### Corretto
- **"Forma Selvatica" in Risorse di Classe sembrava un font diverso**: era
  in realtà lo stesso carattere ma in grassetto pesante e sottolineato
  invece che nel peso normale delle altre risorse. Uniformato al peso delle
  altre voci cliccabili (spiegazioni); rimossa anche l'icona 🐾 non più
  necessaria per distinguerlo.

## [4.27.0] – 2026-09-24

### Corretto
- **Colore del badge "CD" incoerente in Combattimento**: nella colonna
  Bonus Att., gli incantesimi a tiro salvezza mostravano "CD X" con il
  colore dorato di classe (che per un Druido diventa verde) mentre la
  colonna Note mostrava la stessa informazione ("Costituzione · CD 17") in
  rosso fisso — la stessa CD appariva due volte con due colori diversi.
  Ora entrambi usano lo stesso colore fisso (ambra), non tinto dalla classe.

### Migliorato
- **Palette unica per tipo di informazione**, condivisa da Combattimento e
  Incantesimi: Gittata/Portata/Area sempre blu, Durata sempre viola, Tiro
  Salvezza/CD sempre ambra, Danno sempre rosso, Proprietà (Trucchetto,
  Magico, Versatile) sempre oro/marrone. In precedenza i badge di
  Incantesimi erano tutti neutri (nessun colore) mentre quelli di
  Combattimento usavano già dei colori, ma non condivisi.
- **Colori attacco/danno uniformati** nelle card di Bestiario/Compagni
  (Forma Selvatica, Evocazioni): bottone "Tiro per Colpire" sempre oro,
  bottone "Danni" sempre rosso, come nelle righe di Incantesimi (prima
  usavano tinte diverse tra loro: oro pieno, rosso Material, rosso Tailwind).
- **Filtri rapidi di Incantesimi** (Tutti/Solo Preparati/Azione/Bonus/
  Reazione/Concentrazione/Rituali) ora occupano tutta la larghezza
  disponibile nella riga, invece di restare compressi a sinistra.
- **Titoli delle sezioni principali più grandi** (Profilo, Combattimento,
  Magia, Azioni, Equipaggiamento...): distinti visivamente dai titoli delle
  sottosezioni interne (Trucchetti, Bonus, Reazione...), che restano più
  piccoli.

## [4.26.0] – 2026-09-24

### Sviluppo
- **`README.md` riscritto**: nome aggiornato a "Tavolo dei Dadi", rimossi i
  riferimenti a un server Express locale che non esiste più, elenco
  funzionalità allineato allo stato reale (Trasformazioni, poteri homebrew,
  temi/Luoghi, condivisione a codice stanza, test), aggiunti due screenshot
  della scheda (tema chiaro e scuro) sotto `docs/screenshots/`.

## [4.25.0] – 2026-09-24

### Sviluppo
- **`CLAUDE.md` riscritto da zero**: era rimasto fermo a una versione
  precedente del progetto (tema chiaro "foglio di carta", nome "Scheda
  Interattiva", un backend Express che non esiste più, un solo personaggio
  d'esempio). Aggiornato con lo stato reale: nome "Tavolo dei Dadi", tema
  vintage chiaro+scuro, nessun server locale (solo Worker Cloudflare per la
  trascrizione PDF), moduli estratti in `src/ui`/`src/rules`/`src/data`/
  `src/dati`/`src/utils`, roster d'esempio a 4 personaggi (Vaelion attivo di
  default), suite di test e2e, pattern "Altre opzioni"/"⋯" per la densità
  delle righe, riferimento corretto a `docs/BACKLOG.md`.

## [4.24.0] – 2026-09-24

### Migliorato
- **Equipaggiamento meno affollato**: un oggetto senza contenitore, effetto o
  utilizzi attivi ora mostra solo il cestino e un bottone "⋯" invece delle 4
  icone (🎒✨⚡🗑) sempre visibili — le azioni si aprono solo quando servono.
  Gli oggetti già attivi (contenitori, effetti attivi, con usi) continuano a
  mostrare tutte le icone come prima.

## [4.23.0] – 2026-09-24

### Verificato
- **Audit dati esteso a incantesimi, privilegi di classe e talenti Tasha/Xanathar**:
  329 incantesimi e 226 alias controllati (nessun duplicato, nessun alias
  rotto); privilegi di classe per livello (2014 e 2024) controllati per
  ripetizioni sospette — quelle trovate sono tutte legittime (features che
  scalano su più livelli, es. Indomito, Metamagia, Arcano Mistico). Non
  esiste un catalogo di oggetti magici nell'app (sono testo libero
  nell'inventario): niente da controllare lì.

### Corretto
- **Contrasto colori sotto la soglia WCAG AA**: nel tema chiaro base e in 2
  preset ambientazione (Mare, Montagna), il colore del testo secondario
  (`inkDim`, usato per etichette e note attenuate) aveva un contrasto sotto
  4.5:1 sul pannello. Scurito leggermente nei 3 casi per rientrare nella
  soglia, senza cambiare la palette generale.
- **Bottoni con la sola icona senza nome per screen reader**: 25 bottoni
  "chiudi" (✕) e alcuni bottoni di rimozione avevano un `title` (tooltip per
  il mouse) ma nessun `aria-label` — uno screen reader legge il glifo
  dell'emoji al posto del titolo. Aggiunto `aria-label` a tutti.
- Confermati già presenti gli stili `:focus-visible` su bottoni/input/select
  (contorno dorato visibile alla navigazione da tastiera): nessuna modifica
  necessaria lì.

### Nota
- Una copertura completa `aria-label` su OGNI bottone a sola icona
  dell'app (probabilmente 150+) resta lavoro più ampio, non fatto qui:
  quello coperto in questo giro sono i pattern più diffusi e ad alto
  traffico (chiudi modal, rimuovi, cancella filtro).

## [4.22.0] – 2026-09-24

### Sviluppo
- **Suite di test end-to-end** (`@playwright/test`, cartella `e2e/`, un file
  per sezione della scheda): 21 test coprono i comportamenti introdotti in
  questa sessione — pannello "Altre opzioni" in Azioni, Randello Incantato
  che nasconde l'arma non incantata, colonna Note senza testo ripetuto, slot
  incantesimo e "Preparati" nell'intestazione del 1° Livello, sparizione del
  bottone "Scegli in Level Up", sezione Poteri (titolo "regole homebrew" e
  bersaglio libero nei modificatori), filtri Equipaggiamento su una riga,
  Trasformazioni integrate (niente bottoni dedicati), tasto ℹ️ delle Abilità
  sostituito dal click sul nome, angoli decorati delle sezioni corretti a
  sezione chiusa. `npm run test:e2e` per lanciarla (vedi `e2e/README.md`).

## [4.21.0] – 2026-09-24

### Corretto
- **Talenti duplicati**: tre talenti comparivano due volte nell'elenco sotto
  nomi diversi, per lo stesso identico effetto — "Vigile"/"Allerta" (Alert),
  "Attaccante Selvaggio"/"Mente Rapida" (Savage Attacker), "Grande Maestro
  d'Armi"/"Maestro delle Armi Grandi" (Great Weapon Master). Tenuto un nome
  corretto e verificato per talento (confermati via fonti online), rimossa
  la voce duplicata; aggiornati i suggerimenti per background e i tag di
  provenienza (PHB 2014/2024) che puntavano alla voce tolta. L'automazione
  del bonus Iniziativa di "Allerta" continua a funzionare.
- Verificati tutti i tratti di specie (21 razze) contro il PHB 2024: nessuna
  voce inventata trovata, "Passo Celere" (Elfo dei Boschi) è corretto.

### Modificato
- **Scala dei font consolidata**: da 24 taglie diverse (spesso a scaglioni
  di mezzo pixel senza una vera gerarchia) a una decina di taglie fisse
  (11/12/13/14/15/16/18/20 + poche taglie grandi per numeri in evidenza).

## [4.20.0] – 2026-09-23

### Corretto
- **Angoli decorati ancora rotti a sezione chiusa (fix precedente incompleto)**:
  il `display:block !important` non bastava — quando `<details>` è chiuso il
  browser toglie dal flusso di layout tutto tranne `<summary>` a un livello
  più basso di un semplice CSS, e gli angoli "bottom" finivano posizionati
  SOPRA quelli "top" invece che sotto. Spostati fuori da `<details>` (in un
  contenitore che lo avvolge): ora seguono sempre l'altezza reale della
  sezione, aperta o chiusa.
- **Filtri Equipaggiamento su due righe con "Tutti" ripetuto due volte**:
  uniti in un'unica riga (ricerca, vista Tutti/Indossati/Zaino, tipo
  Tutti i tipi/Armi/Pozioni/Magici/Attrezzi, pulizia esauriti); le due
  "Tutti" ora hanno icone diverse (📍 vista, 🗂️ tipo) per distinguerle a
  colpo d'occhio.

### Modificato
- **Trasformazioni integrate invece di bottoni dedicati**: tolti i due
  bottoni "Forma Selvatica"/"Metamorfosi" in Azioni. Forma Selvatica si
  apre ora cliccando la sua risorsa in Risorse di Classe (dove si "spende"
  davvero un uso); Metamorfosi si apre da un bottone sulla riga
  dell'incantesimo stesso in Incantesimi.
- **Randello Incantato**: nasconde nella tabella Combattimento anche
  "Bastone Ferrato" oltre a "Randello" (arma non incantata ridondante).
- **Font minimi alzati a 10,5px**: circa 190 punti dell'app (badge, chip,
  colonna Note, filtri) usavano testo sotto i 10px, il punto più debole
  per la leggibilità segnalato. Primo passo di un lavoro più ampio sui
  font (la scala resta da consolidare in un giro successivo).

## [4.19.0] – 2026-09-23

### Aggiunto
- **Randello Incantato nasconde l'arma non incantata**: se hai il trucchetto
  Randello Incantato (Shillelagh) nella lista attacchi, "Randello" e
  "Bastone Ferrato" (le versioni non incantate della stessa arma) spariscono
  automaticamente dalla tabella Combattimento, così restano solo attacchi
  che userai davvero.

### Modificato
- **Incantesimi, slot più visibili**: gli slot del 1° Livello (e di ogni
  livello) ora mostrano anche una frazione leggibile (es. "3/4") accanto al
  titolo del livello, non solo i pallini cliccabili. Il conteggio
  "(Preparati: X/Y)", prima nell'intestazione "Incantesimi", è sceso
  nell'intestazione del 1° Livello, al posto lasciato libero dagli slot.
- **Abilità, tolto il tasto ℹ️ ridondante**: apriva un modal con guida CD e
  sinergie strumenti — contenuto diverso dal tooltip al passaggio del
  mouse (che mostra solo le istruzioni d'uso). Ora lo stesso modal si apre
  cliccando sul nome dell'abilità, senza un pulsante separato.

## [4.18.0] – 2026-09-23

### Rimosso
- **Bottone "Scegli in Level Up" nei Trucchetti**: era sempre visibile anche a
  scelte già complete. Resta solo l'avviso quando c'è ancora qualche
  trucchetto da scegliere (indica comunque il Level Up come unico posto dove
  farlo); il bottone-scorciatoia in più è sparito.

### Aggiunto
- **Sezione Poteri, bersaglio libero per i modificatori**: prima un
  modificatore poteva agire solo su Velocità/CA/Iniziativa/PF Massimi. Ora
  c'è anche "Altro (personalizzato)…", con un campo di testo libero per
  descrivere qualunque effetto homebrew (es. "Vantaggio ai TS Carisma").
  Nella scheda del potere, l'etichetta del bersaglio (es. "CA", "Velocità" o
  quella scritta a mano) ora è sempre visibile nel chip, non solo al
  passaggio del mouse.
- **Sezione Poteri, chiarito lo scopo**: il titolo ora specifica "(regole
  homebrew)" per chiarire che è il posto per le regole inventate al tavolo
  (patti, benedizioni, maledizioni...), non per contenuti ufficiali.

## [4.17.0] – 2026-09-23

### Corretto
- **Colonna Note di Combattimento/Reazioni ripetuta due volte**: i badge
  colorati (Tocco, Gittata, Tiro Salvezza, Innesco/Effetto...) riassumono già
  la nota, ma subito accanto veniva mostrato di nuovo lo stesso testo per
  esteso. Ora, quando i badge coprono già l'informazione, il testo libero si
  riduce a una sola matita ✏️ cliccabile (resta comunque modificabile con un
  click, nessun dato perso).
- **Nuvoletta che si sovrapponeva alle intestazioni vicine**: la soglia sotto
  la quale il tooltip si apre verso il basso invece che verso l'alto era
  troppo bassa (48px), causando sovrapposizioni con titoli di sezione appena
  sopra la riga; alzata a 90px.

## [4.16.0] – 2026-09-23

### Modificato
- **Sezione "Azioni" semplificata**: restano sempre visibili solo Azione,
  Azione Bonus, Reazione, Movimento e Nuovo Turno. Interazione Oggetto,
  Tattiche (Schiva/Disimpegno/Scatto/Nascondersi/Aiuto), Copertura e i
  Potenziamenti di Classe (Attacco Furtivo/Ira/Punizione Divina/Ispirazione)
  sono ora dentro un pannello "Altre opzioni" a comparsa, chiuso di default,
  con un'etichetta "attive" quando contiene qualcosa di acceso. Prima erano
  15-20 pulsanti sempre impilati prima ancora della tabella degli attacchi.
  Primo passo del redesign di semplificazione, sezione per sezione.

## [4.15.0] – 2026-09-23

### Rimosso
- **Sezione "Accessibilità" (Lettura Facilitata + Modalità Minimale + Dimensione
  Testo)** tolta del tutto, su richiesta esplicita: era percepita come un'altra
  cosa da configurare invece di una soluzione. Il lavoro di semplificazione
  prosegue ora alla radice, sezione per sezione, invece che con un'opzione a
  parte da attivare.

### Corretto
- **Titoli di sezione non sempre centrati.** Incantesimi/Trucchetti/
  Combattimento/Reazioni e le etichette di Privilegi/Sottoclasse/Talenti/Poteri
  ora sono SEMPRE centrati, anche a sezione ridotta.
- **Angoli decorati che sparivano a sezione chiusa**: erano fratelli del titolo
  dentro l'accordion e il browser li nascondeva insieme al contenuto quando la
  sezione era ridotta. Ora restano visibili anche chiusa.
- **Nuvoletta (tooltip) dei tasti che "saltava" da sopra a sotto**: quando il
  tooltip doveva comparire sotto il tasto (vicino al bordo alto dello schermo),
  l'animazione di comparsa era comunque quella pensata per "sopra", quindi per
  un istante appariva sopra e poi scattava sotto a fine animazione. Ora ci sono
  due animazioni distinte in base al lato.

## [4.14.0] – 2026-09-23

### Aggiunto
- **Trucchetti scelti nel Level Up, non più con un bottone a parte in
  Incantesimi.** Quando sali di livello e guadagni nuovi trucchetti (o ne hai
  di arretrati da scegliere), il modal Passaggio di Livello mostra ora un
  selettore con i trucchetti suggeriti per la classe: li scegli lì, si
  aggiungono confermando il livello. Il bottone "aggiungi trucchetto" nella
  sezione Incantesimi è sparito, sostituito da un rimando diretto al Level Up.

### Corretto
- **PF 0 / danno massiccio (PHB p.197) non era automatico.** Subire danno
  mentre si è già a 0 PF ora costa in automatico un fallimento ai Tiri
  Salvezza contro la Morte; se il danno in eccesso è pari o superiore ai PF
  massimi, la morte è istantanea (3 fallimenti). Prima nessuno dei due tasti
  danno (scheda e Tracker di Combattimento) lo applicava: un personaggio a
  0 PF poteva incassare colpo dopo colpo senza che i Tiri Salvezza contro la
  Morte se ne accorgessero mai.
- **TS di Concentrazione mancante nel Tracker di Combattimento**: applicare
  danno da lì (a differenza dei tasti rapidi in scheda) non proponeva mai il
  tiro salvezza per mantenere la concentrazione. Corretto.
- **"Tavolo dei Dadi vX" duplicato nel footer del Menu Iniziale**: compariva
  sia nel titolo in alto che di nuovo nel footer in basso. Tolto dal footer,
  resta solo il link alla licenza.

### Modificato
- La sezione "Trasformazioni" non è più un pannello a scomparsa (accordion):
  i due bottoni Forma Selvatica/Metamorfosi sono sempre visibili senza dover
  aprire nulla.

### Verificato
- **Audit delle automazioni di regole** (PF temporanei, Concentrazione,
  Sfinimento sui tiri, Reazioni una volta a round, Riposo Breve/Lungo
  incluso il caso speciale del Warlock, Ispirazione, vantaggio/svantaggio da
  condizioni, munizioni): tutto corretto e collegato ai bottoni giusti,
  tranne il caso PF 0/danno massiccio sopra, ora sistemato. Vantaggio/
  svantaggio da condizioni (Prono, Afferrato, ecc.) resta manuale per scelta:
  le condizioni sono tracciate ma non forzano automaticamente il tiro.

## [4.13.0] – 2026-09-23

### Aggiunto
- **Nuovo interruttore "Modalità Minimale"** (Sistema → Leggibilità, accanto
  a "Lettura facilitata"). Da provare, non ancora un cambiamento permanente:
  quando attivo, le righe di Combattimento e Incantesimi — tra le più dense
  della scheda — nascondono i dettagli tecnici secondari (gittata, tempo,
  scuola, note) dietro un click, mostrando solo nome, bonus e danno, e il
  testo delle righe si ingrandisce leggermente. Nulla viene eliminato: i
  dettagli restano raggiungibili cliccando il nome dell'incantesimo/attacco
  per aprirne la scheda completa. Come "Lettura facilitata", resta opzionale:
  chi preferisce vedere tutto a colpo d'occhio non perde nulla lasciandolo
  spento.

## [4.12.0] – 2026-09-23

### Aggiunto
- **Creature raggruppate per GS nei popup Forma Selvatica/Metamorfosi.**
  Invece di un'unica griglia piatta, le creature disponibili sono ora in
  "cartelle" apribili per Grado di Sfida crescente (GS 0, GS 1/8, GS 1/4...),
  ciascuna con le creature in ordine alfabetico al suo interno — così puoi
  saltare direttamente al GS che ti interessa invece di scorrere tutto.

### Verificato
- **Copertura del catalogo creature**: per la Forma Selvatica il GS massimo
  raggiungibile è 6 (Circolo della Luna, livello 20) — il catalogo (GS 0-8)
  la copre interamente, nessuna lacuna. Per la Metamorfosi invece il limite
  è "GS ≤ livello del personaggio", quindi ai livelli 9+ le regole
  permetterebbero GS superiori a quelli presenti in catalogo (si ferma a
  GS 8, Tirannosauro Rex): un personaggio di alto livello non troverebbe
  nuove opzioni oltre il livello 8. Segnalato all'utente, in attesa di
  decidere se/quante creature di GS alto aggiungere.

## [4.11.0] – 2026-09-23

### Aggiunto
- **Bottone "🐾 Evoca" sugli incantesimi di evocazione.** Sulla riga di ogni
  incantesimo il cui nome richiama un'evocazione (Evoca/Evocare Animali,
  Evoca Elementale, Trova Destriero, Spiriti Guardiani, ecc.) compare ora un
  bottone che apre direttamente il catalogo "Evoca/Aggiungi Compagno" già
  esistente nella sezione Compagni, Famigli & Evocazioni — pre-filtrato sulla
  categoria giusta: "Bestie" per gli incantesimi tipo Evoca/Conjure Animali
  (dove scegli tra le creature normali, come per la Forma Selvatica), oppure
  "Evocazioni" per elementali/destrieri/spiriti specifici. Riusa la stessa
  logica/dati già presenti (nessun nuovo catalogo creato): un click in meno
  per passare dall'incantesimo alla scheda della creatura da evocare.

## [4.10.0] – 2026-09-23

### Modificato
- **Trasformazioni: da griglia sempre aperta a due popup separati.** La
  sezione "Trasformazioni" mostrava sempre in scheda l'intera griglia di
  40-60 creature (con un toggle per passare da Forma Selvatica a
  Metamorfosi), occupando molto spazio verticale anche quando non serviva.
  Ora la sezione è compatta: due soli bottoni, "🐾 Forma Selvatica" e
  "🔮 Metamorfosi", ciascuno con il conteggio delle creature disponibili.
  Cliccandone uno si apre un popup dedicato con la lista filtrata secondo
  le regole di quella specifica trasformazione (GS massimo, nuoto/volo per
  la Forma Selvatica; GS ≤ livello senza restrizioni per la Metamorfosi) —
  due "schede" indipendenti invece di una sola lista condivisa. Cliccare una
  creatura nel popup apre come prima il dettaglio con le statistiche e i
  bottoni per assumerla. Il banner "Forma Attiva" (quando una trasformazione
  è in corso) non è stato toccato: resta sempre visibile come prima.

## [4.9.0] – 2026-09-23

### Aggiunto
- **Note di Combattimento in categorie**: nella tabella Combattimento, invece
  di un unico blocco di testo, le note di attacchi/incantesimi mostrano ora
  piccoli tag separati per Gittata, Durata, Tiro Salvezza e Proprietà
  (Trucchetto/Magico/Versatile/Maestria) quando riconoscibili nel testo. Le
  Reazioni con Innesco/Effetto già strutturati (es. Assorbire Elementi, Totem
  Spirituale) li mostrano come due tag distinti invece che come testo unico.
  Il testo completo resta comunque visibile e modificabile come prima:
  è un riassunto visivo aggiuntivo, non sostituisce i dati esistenti.

### Corretto
- **Metamorfosi non raggiungibile dai Druidi**: il tab per sfogliare le
  creature di Metamorfosi (Polymorph) richiedeva Bardo/Stregone/Mago —
  escludeva il Druido, che invece ha Metamorfosi nella propria lista
  incantesimi. Un Druido non poteva mai vedere/scegliere creature oltre il
  limite GS della Forma Selvatica (es. Gorilla Gigante, Tirannosauro Rex),
  pur avendo i bottoni per usarle una volta aperto il dettaglio.
- **Contatore Forma Selvatica/Metamorfosi che non calava mai**: il bottone
  "Assumi Forma Selvatica" scalava un campo (`usi`) diverso da quello letto
  altrove nell'app (`attuali`), quindi il contatore in Risorse di Classe non
  si aggiornava mai cliccandolo. Corretto; ora se hai esaurito gli utilizzi
  il bottone si disabilita e si ingrigisce invece di restare cliccabile.
- **Elenco creature Forma Selvatica/Metamorfosi ora alfabetico** invece che
  per Grado di Sfida crescente.
- **Leggibilità campi Profilo**: Sesso e Specie/Razza potevano troncarsi
  (es. "Maschio" tagliato) nella colonna più stretta della riga anagrafica;
  ora usano lo stesso meccanismo "testo compatto" già in uso per Classe/
  Sottoclasse/Allineamento, più margini minimi di colonna garantiti.

### Modificato
- Tolta la parola "Assumi" dal bottone Forma Selvatica; tolto il bottone
  "Chiudi" dal modal di dettaglio creatura (restano il tasto ✕ in alto e il
  click fuori dal modal) a favore di più spazio per i due bottoni azione.
- Uniformato l'allineamento dei titoli di sotto-sezione (es. "Combattimento",
  "Reazioni", "Incantesimi") a sinistra, come le altre etichette dell'app,
  invece di alcuni centrati e altri a sinistra senza un criterio unico.

## [4.8.0] – 2026-09-23

### Modificato
- **Il tocco "vecchio manuale" (4.7.0) non è più un'Ambientazione a scelta:
  ora è fisso, sempre presente, indipendente dai colori/scena che scegli in
  Luogo → Ambientazione.** Rimossa la voce "📜 Vintage" dal menu Ambientazione
  (tornano ad essere 13 come prima). Al suo posto, su tutta l'app, sempre:
  titoli delle sezioni e intestazione in font Cinzel (autoospitato, offline
  come sempre), pannelli con texture carta leggerissima e doppio filetto
  interno, filetto oro doppio sotto la barra superiore — indipendentemente
  da quale Ambientazione/colore hai scelto. I colori restano personalizzabili
  come prima (Taverna, Dungeon, Tempio Arcano...): quella è "atmosfera",
  questa è l'identità fissa dell'app.

## [4.7.0] – 2026-09-22

### Aggiunto
- **Nuova Ambientazione "📜 Vintage"** (Luogo → Ambientazione): palette
  ispirata ai vecchi manuali italiani ed americani di D&D (pergamena
  invecchiata, rosso bordeaux, oro), con i titoli delle sezioni e l'intestazione
  dell'app in un font serif decorativo (Cinzel) invece del sans-serif di
  sistema. Il font è autoospitato (nessun CDN) e precacheato dal service
  worker, quindi resta disponibile offline come tutto il resto; l'accessibilità
  "lettura facilitata" continua a forzare i caratteri di sistema come prima,
  Vintage compreso. Nessun impatto sugli altri 13 preset: senza un font
  dedicato continuano a usare il font di sistema di sempre.

## [4.6.3] – 2026-09-22

### Corretto
- **"Forma Bestiale" e "Forma Selvatica" erano due nomi per la stessa cosa.**
  Il tasto/banner/modale di trasformazione del Druido diceva "Forma
  Bestiale", mentre la risorsa di classe generata automaticamente (usi per
  riposo breve) si chiama "Forma Selvatica" — il termine ufficiale del
  Manuale del Giocatore 2014. Chi non lo sapeva poteva aggiungere a mano una
  seconda risorsa "Forma Bestiale" pensando fosse un'abilità diversa,
  ritrovandosi due contatori scollegati per lo stesso privilegio. Uniformato
  tutto il testo visibile (tasto, banner, titolo modale illustrazione, testo
  alternativo immagine, tooltip taglia) su "Forma Selvatica"/"Wild Shape".
  Non tocca il nome del campo dati (`scheda.formaBestiale`) né le schede
  esistenti: se avevi già creato a mano una risorsa "Forma Bestiale"
  duplicata, resta lì finché non la elimini tu da Risorse di Classe.

## [4.6.2] – 2026-09-22

### Corretto
- **Coerenza delle sagome Forma Bestiale/Metamorfosi**: le 15 icone originali
  (Orso, Lupo, Aquila, Gufo, Ragno, Cinghiale, Serpente, Pantera, Coccodrillo,
  Squalo, Polpo, Alce, Dinosauro, Pipistrello, Tasso) erano in realtà forme
  generiche quasi identiche tra loro (un "pupazzo di neve" con due occhi),
  non vere icone — molto meno dettagliate delle 12 aggiunte in 4.6.1, quindi
  visivamente incoerenti se affiancate. Sostituite tutte con icone reali
  game-icons.net (stessa fonte, stesso stile), inclusi Coccodrillo e Squalo
  che prima non avevano mai avuto un'icona vera. In più, tre sagome erano
  scambiate per errore tra loro (Pipistrello/Tasso/Dinosauro): corretto.

## [4.6.1] – 2026-09-22

### Modificato
- **Illustrazioni Forma Bestiale/Metamorfosi: sagome vere invece di categorie
  riciclate.** La correzione precedente (4.6.0) rimappava una quindicina di
  creature senza icona dedicata sulla categoria esistente più vicina (es.
  Rana → sagoma coccodrillo, Elefante → sagoma cinghiale). Ora hanno una
  silhouette propria, presa da game-icons.net (CC BY 3.0, autori lorc,
  delapouite, skoll) come le altre: Rana/Rospo, Granchio, Millepiedi, Vespa,
  Scimmia/Gorilla, Capra, Rinoceronte, Elefante, Mammut, Triceratopo, Ratto,
  Cavallo/Pony.

## [4.6.0] – 2026-09-22

### Corretto
- **In Forma Bestiale/Metamorfosi ora si vedono tutte e sei le caratteristiche.**
  Prima il pannello mostrava solo quelle sostituite dalla forma (3 per la
  Forma Bestiale); ora mostra sempre tutte e sei, con quelle non sostituite
  ("Tua") in chiaro ma leggermente attenuate, così non serve scendere alla
  scheda per controllarle mentre si è trasformati.
- Il tasto per tornare alla forma normale si chiamava "Ritorna Umanoide": per
  un elfo o uno gnomo suonava strano. Ora è "Torna alla Forma Normale".
- Icone e illustrazioni generate mancavano per una quindicina di creature del
  catalogo (Rana/Rospo, Granchio, Millepiedi, Vespa, Scimmia/Gorilla, Capra,
  Rinoceronte, Elefante, Mammut, Triceratopo...): finivano tutte con la
  sagoma del lupo. Mappate sulla categoria esistente più vicina.

### Aggiunto
- **Sezione "Trasformazioni" con due liste separate.** Forma Bestiale e
  Metamorfosi hanno regole di Grado di Sfida diverse (la prima segue la
  tabella Forma Selvatica del Druido; la seconda, per Bardo/Stregone/Mago,
  segue "GS ≤ livello del personaggio", senza limiti di nuoto/volo): ora un
  interruttore 🐾 Forma Animale / 🔮 Metamorfosi mostra la lista giusta per
  ciascuna. Compare per il Druido (Forma Animale), per Bardo/Stregone/Mago
  (Metamorfosi con Polymorph in lista), o entrambi i tab se il personaggio è
  idoneo a entrambe.
- **Gorilla Gigante (GS 7) e Tirannosauro Rex (GS 8)** aggiunti al catalogo
  creature: erano gli unici assenti nella fascia alta, raggiungibile solo con
  la Metamorfosi (la tabella Forma Selvatica del Druido non arriva così in
  alto nel gioco normale).

## [4.5.0] – 2026-09-22

### Aggiunto
- **Metamorfosi** (l'incantesimo Polymorph), come nuova trasformazione a fianco
  della Forma Bestiale già esistente. Riusa lo stesso meccanismo affidabile
  della Forma Bestiale — sostituzione diretta delle statistiche via
  `trasformazioneAttiva()` (`src/rules/scheda.js`), non un livello di badge —
  ma con due differenze chiave dettate dalle regole 2014:
  - **Tutte e sei le caratteristiche** vengono sostituite, comprese quelle
    mentali (Forma Bestiale sostituisce solo For/Des/Cos, non Int/Sag/Car).
    Ogni calcolo derivato (prove, tiri salvezza, CD, CA, iniziativa) si
    aggiorna da solo perché tutti passano dalla stessa funzione
    `punteggioCaratteristica`.
  - Un pool di PF separato per la nuova forma, con lo stesso danno in
    eccesso che torna al personaggio quando scende a 0 (regola PHB), la
    stessa barra vita, lo stesso ritratto sostituibile (illustrazione
    ufficiale, upload o link) e lo stesso pannello statistiche/azioni/tratti
    della bestia già visti per la Forma Bestiale — includono già la
    sostituzione automatica dell'immagine in base alla forma assunta.
  - Attivabile dalla stessa scheda creatura del Bestiario/Compendio (nuovo
    tasto "🔮 Metamorfosi" accanto a "🐾 Assumi Forma Bestiale"): le due
    trasformazioni sono mutuamente esclusive, attivarne una disattiva l'altra.
  - Personaggi esistenti non cambiano: senza `scheda.metamorfosi` il
    personaggio si comporta esattamente come prima.

## [4.4.0] – 2026-09-22

### Aggiunto
- **Effetti dello Sfinimento automatici sui tiri.** Prima il contatore Sfinimento
  mostrava solo un promemoria testuale nel 2014; ora applica davvero le regole,
  in `src/rules/scheda.js` (`effettiSfinimento`) e `src/rules/dadi.js`
  (`modalitaEffettiva`):
  - **5.5 (2024):** −2 ai tiri di d20 per livello (attacchi, prove, salvezze,
    iniziativa) e −1,5m di velocità per livello, entrambi applicati solo ai
    tiri/valori del personaggio (non a quelli di alleati o creature del
    bestiario, tirati con lo stesso pulsante ma per conto terzi).
  - **5.0 (2014):** soglie cumulative, come da Manuale del Giocatore — livello
    1 svantaggio alle prove di caratteristica (inclusa l'Iniziativa), livello
    2 velocità dimezzata, livello 3 svantaggio anche ad attacchi e tiri
    salvezza (compresi TS contro morte e di Concentrazione, incluso il
    vantaggio di Incantatore da Guerra: si annullano a vicenda, come da
    regola 5e), livello 4 PF massimi dimezzati, livello 5 velocità a 0.
  - Badge "Sfin." accanto a Velocità e PF Massimi quando l'effetto è attivo,
    sullo stesso modello dei badge dei Poteri personalizzati.
  - Il livello 6 (morte) resta segnalato solo a testo: non uccide il
    personaggio in automatico.

## [4.3.0] – 2026-09-21

### Corretto
- **Trucchetti/incantesimi già salvati non sparivano più.** Il filtro classe
  in cima alla sezione Incantesimi (`filtroClasseInc`) si applica in
  automatico alla classe del personaggio a ogni apertura/cambio scheda
  (`src/App.jsx`, `useEffect` righe ~4182). Se il catalogo (`src/data/incantesimi.js`)
  non elencava quella classe per un incantesimo già salvato, l'incantesimo
  spariva dalla lista pur restando conteggiato (es. Vaelion, Druido 10:
  contatore 4/4 Trucchetti ma solo 3 mostrati, mancava Morsa del Gelo). Il
  filtro ora si applica solo alle proposte del catalogo (`s.catalogo === true`),
  mai a un incantesimo già presente sul personaggio (`src/App.jsx:15406`).
- Aggiunta la classe Druido a Morsa del Gelo (Frostbite) nel catalogo
  (`src/data/incantesimi.js:23`): è un trucchetto Druido/Mago/Stregone/Warlock
  fin da Xanathar's Guide to Everything (5.0) ed è rimasto tale nel 5.5.
- Un riposo lungo ricaricava per errore qualunque risorsa con un `reset`
  diverso da vuoto, non solo `'breve'`/`'lungo'` (`risorseDopoRiposo`,
  `src/rules/regole.js`): correzione necessaria perché i contatori dei nuovi
  Poteri (reset `'manuale'`) restassero davvero manuali.

### Aggiunto
- **Nuova sottosezione "Poteri"** dentro "Privilegi, Tratti & Talenti": regole
  personalizzate del tavolo (patti, benedizioni, maledizioni...) non coperte
  da classi/talenti ufficiali. Modello dati per personaggio (`scheda.poteri`,
  vedi `src/rules/poteri.js`): un array di `{ id, nome, descrizione, attivo,
  contatori: [{ nome, attuali, max }], modificatori: [{ bersaglio, valore, fonte }] }`.
  - Una scheda per potere (`src/ui/PoteriSezione.jsx`) con chip per contatori
    e modificatori, descrizione, tasto "+" tratteggiato per aggiungere un
    effetto e clic sulla scheda per aprire dettagli/modifica (elimina, riordina).
  - Ogni contatore genera/aggiorna una voce in `scheda.risorse` con
    `reset: 'manuale'` (mai toccata da riposo breve/lungo), sincronizzata nei
    due sensi: un +/- fatto da "Risorse di Classe" si riflette sulla scheda
    del potere e viceversa (`sincronizzaRisorsePoteri`, `valoreContatore`).
  - I modificatori (bersagli: Velocità, CA, Iniziativa, PF Massimi) si sommano
    ai valori corrispondenti della scheda (`caTotale`, `calcolaMovimentoESalti`,
    `iniziativaTotale`, `pfMassimiEffettivi`) e mostrano la fonte con un badge
    accanto al valore; spariscono se il potere viene disattivato o eliminato.
  - Inclusi in export/import del roster, nella condivisione via link e nel
    codice stanza (nessun cambiamento richiesto: entrambi serializzano la
    scheda per intero); i personaggi esistenti restano invariati (`poteri`
    di default `[]`).
  - Potere di prova su Vaelion Leafwhisper: "Potere del Patrono" (contatore
    Debito 5, modificatore +3m Velocità con fonte "Maschera").

## [4.0.55] – 2026-09-03
### Aggiunto / Modificato (da v3.9.49)
- Toolbar a 3 blocchi, anagrafica proporzionale, diario in modale, Artefice/Warlock/Manuali, pozioni/movimento/reazioni/turn economy, audit D&D.
- Fix 4.0.55: rimosse emoticon da sesso/razza/taglia/allineamento e da Compagni/Famigli/Evocazioni, bordi uniformati su tutte le tendine (`src/ui/stili.js:53`), titolo Movimento/Salti dinamico 5.5/5e per PG (`src/App.jsx:8056`), combattimento solo incantesimi con danni+tiro/CD (`src/rules/regole.js:490`), monete tasti rinominati Converti in MR/MA / Converti in MP senza diamante (`src/i18n.js:469`).

## [4.0.53] – 2026-09-03 (allineamento a origin/main)
- Rebase 03/09: allineato locale (2 commit) su `origin/main` 9de633f, version bump a 4.0.55, docs allineati.

## [Unreleased]

### Aggiunto
- Pagina di recupero PWA che rimuove soltanto service worker e cache obsolete, preservando personaggi e immagini locali.
- Inventario con sintonia ed effetti meccanici degli oggetti: bonus alla Classe Armatura e ai tiri salvezza, caratteristiche impostate e oggetti magici preconfigurati.
- Campo Punti Esperienza nel Profilo e gestione degli utilizzi/ricariche degli oggetti.
- Le classi preparatrici mostrano automaticamente tutti gli incantesimi di classe lanciabili; quelli preparati sono stellinati e ordinati per primi a ogni livello.
- Condivisione temporanea di una scheda tramite codice stanza, senza account o token GitHub.
- Endpoint Cloudflare Worker `/room` con snapshot immutabili, scadenza, validazione e rate limiting.
- Licenza MIT (`LICENSE.md`).
- Template GitHub per bug report, feature request e pull request.
- Note di sviluppo spostate in `docs/`.
- Runbook release manuale in `docs/RELEASE.md`.

### Modificato
- Aggiornamenti PWA automatici una sola volta per build, con protezione anti-loop, timeout Safari e un unico banner di stato.
- Rifinitura estetica 2.93: versione integrata nel titolo, pulsanti superiori uniformi, pannelli con gerarchia più netta e inventario mobile trasformato in schede compatte senza scorrimento orizzontale.
- Il caricamento cloud e IndexedDB ora hanno un timeout: su Safari un servizio non responsivo non può più lasciare la scheda bloccata sull'overlay.
- Corretto il ciclo infinito di aggiornamento PWA: la nuova versione viene segnalata senza ricaricare automaticamente e il comando manuale esegue una sola navigazione.
- Vaelion corretto come Druido del Circolo del Pastore; competenze nelle armi con iniziale maiuscola e immagini cloud riagganciate all’archivio locale prima della sincronizzazione.
- Addestramento nelle armi mostrato in riquadri separati; menu testuali e inventario ordinati alfabeticamente.
- Profilo, risorse di classe, ritratto e disposizione mobile resi più compatti e coerenti.
- Nel pannello Monete, conversione e riepilogo sono allineati rispettivamente a sinistra e a destra sopra le valute.
- Ridotto il bagliore chiaro sopra gli sfondi giorno/notte; i sottofondi partono direttamente dal tocco su iOS; nel menu Luogo le voci diventano “Mare” e “Pioggia”.
- Ridisegnato il pannello Monete: titolo coerente, conversione centrata e moneta d'oro al posto del diamante.
- Il pin della mappa salva automaticamente la posizione anche quando Safari mobile interrompe il trascinamento, mantenendola a ogni riapertura.
- Il menu "Ambientazione" diventa "Luogo", non mostra più il preset tecnico "Classica" e attenua il bagliore del tema giorno.
- Rimossa dalla repository la cartella `scratchpad/` già ignorata da `.gitignore`.

### Da automatizzare quando il permesso `workflow` sarà attivo
- Workflow `test.yml` separato da deploy.
- Generazione changelog da commit/PR.
- Release GitHub con artifact build PWA (`dist`).
