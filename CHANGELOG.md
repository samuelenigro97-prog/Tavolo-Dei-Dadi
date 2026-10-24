# Changelog

Formato ispirato a [Keep a Changelog](https://keepachangelog.com/it/1.1.0/).

## [4.113.4] – 2026-10-24

### Modificato
- **Indicatore versione (Watermark in basso a destra)**: incrementata leggermente la visibilità (dimensione 10px, opacità 0.42, sfondo semitrasparente discreto) per garantire leggibilità su sfondi chiari e scuri senza disturbare. Aggiunto controllo aggiornamenti al tocco.

## [4.113.3] – 2026-10-24

### Corretto
- **Allineamento e collegamento totale contatori e risorse di classe**:
  - **Ira Barbarica**: il pulsante di attivazione in Combattimento si sincronizza in tempo reale con il contatore `Ira` in `Risorse di classe` scalando l'uso e riflettendo le risorse disponibili.
  - **Ispirazione Bardica**: il pulsante di tiro in Combattimento scala 1 uso dal contatore `Ispirazione Bardica` in `Risorse di classe` e mostra gli utilizzi rimanenti.
  - **Punizione Divina (Smite)**: corretto il consumo dello slot incantesimo su `scheda.slotIncantesimo` al momento del colpo.
  - **Riposo Breve per Warlock Multiclasse**: garantito il recupero degli slot di Magia del Patto (fino al 5° cerchio) anche se il Warlock è una classe secondaria nel multiclasse.

### Modificato
- **Barra in alto a scomparsa - Ritorno alle emoticon classiche**: ripristinate le amate emoji tradizionali (`🆙`, `🗑`, `🎲`, `🔍`, `🌗`/`☀️`/`🌙`, `📜`, `🗺️`, `⚔️`, `☁️`) su tutti i pulsanti della barra superiore desktop e mobile hub.
- **Forma Selvatica / Metamorfosi - Rimozione statistiche caratteristiche dal banner superiore**: rimosso il riquadro ridondante delle 6 caratteristiche dal banner in alto, ora consultabili e tirabili direttamente nella colonna caratteristiche aggiornata sulla destra con badge dedicato.

## [4.113.1] – 2026-10-24

### Modificato
- **Forma Selvatica / Metamorfosi - Rimozione PF duplicati**: rimossa completamente la barra dei Punti Ferita e i pulsanti rapidi dal banner superiore della trasformazione. Tutti i PF (forma animale vs base PG) sono gestiti esclusivamente nel box vitale in basso.
- **Banner superiore dedicato a bonus e attacchi**: il banner superiore conserva e valorizza i bonus delle 6 caratteristiche della bestia (con tiri d20 interattivi), i sensi e tratti speciali, e le schede delle azioni/attacchi della trasformazione (tiri per colpire, danni diretti e CD salvezza).

## [4.113.0] – 2026-10-24

### Aggiunto
- **Integrazione nativa di Forma Selvatica e Metamorfosi**: rimossa la schermata/banner separata ridondante e trasferite tutte le statistiche nelle sezioni native della scheda.
- **Punti Ferita dedicati della Forma**: i PF della bestia sono tracciati direttamente nella sezione nativa Punti Ferita, mantenendo chiaramente distinti e preservati i PF base del personaggio umanoide.
- **Auto-ritrasformazione a 0 PF (Regola PHB 5e)**: quando i PF della forma animale scendono a 0 o meno (tramite pulsanti rapidi, modifica manuale o danni subiti), il personaggio ritorna automaticamente alla forma umanoide normale, applicando eventuali danni in eccesso direttamente ai PF base del druido.
- **Caratteristiche nelle Caratteristiche**: la griglia delle 6 caratteristiche mostra i valori sostituiti dalla bestia (FOR, DES, COS) contrassegnati con badge dedicato `🐾 Forma`, mentre le caratteristiche mentali (INT, SAG, CAR) e quelle base rimangono intatte.
- **Azioni e Combattimento adattabili**: in forma animale la tabella combattimento nasconde le armi e gli incantesimi umanoidi non utilizzabili, mostrando invece le azioni e gli attacchi della bestia con tiri per colpire e danni diretti.
- **Reazione Attacco di Opportunità della Bestia**: calcolato automaticamente l'attacco di opportunità con il morso/becco/artigli della bestia con portata e danni corretti, escludendo gli incantesimi di reazione.
- **Avviso sezione Incantesimi**: banner informativo nella sezione magia che segnala l'indisponibilità del lancio degli incantesimi in forma animale preservando la concentrazione attiva.

## [4.112.6] – 2026-10-24

### Modificato
- **Testi completi degli incantesimi (100% ufficiali D&D)**: arricchito l'intero database (`INCANTESIMI_DB`) con i testi originali e integrali del manuale/SRD ufficiale in italiano, inclusi tutti i paragrafi di regole, opzioni, tiri salvezza e scaling "Ai Livelli Superiori" / "Potenziamento per i Trucchetti".
- **Nuvolette incantesimi non troncate**: eliminato il limite di 2 frasi / 320 caratteri per gli incantesimi sia nella lista degli incantesimi sia nella tabella combattimento, mostrando la descrizione integrale e completa.
- **Finestra di dettaglio nuvoletta**: allargata la larghezza massima del modal info (`maxWidth: 500px`) per una lettura confortevole e scorrevole dei testi completi.

## [4.112.5] – 2026-10-24

### Modificato
- **Forma Selvatica**: rimosso il pulsante `[ ? ]` dalle Risorse di Classe per uniformità e pulizia visiva con tutte le altre risorse.
- **Catalogo Bestie ed Evocazioni**: i nomi delle creature non vengono più troncati con ellissi (`...`), supportando il testo a capo su due righe e larghezza minima aumentata (`150px`).

## [4.112.4] – 2026-10-24

### Modificato
- **Azioni e attacchi della bestia in Forma Selvatica**: disposti su griglia a due colonne responsive (`repeat(auto-fit, minmax(280px, 1fr))`), mantenendo le azioni descrittive o a piena descrizione (es. Attacco Multiplo) a tutta larghezza.
- **Badge Tiro Salvezza (CD)**: spostato dalla testata della scheda della bestia direttamente sulla riga delle azioni di attacco, allineato con "Tiro per colpire" e "Danni", sia nella scheda principale sia nel modal di dettaglio bestia.
- **Taglia del personaggio**: rimosso il badge ridondante `[Bestia]` / `[Metamorfosi]` accanto alla taglia.
- **Allineamento reazioni nella tabella combattimento**: rimosso il pulsante rosso `[ ✕ ]` dalle righe di reazione per mantenere un perfetto allineamento verticale dei tasti `[ Usa ]`.
- **Anagrafica profilo**: rimosso `overflow-wrap: anywhere;` per impedire la sillabazione errata a metà parola (es. `BACKGROUN-D`, `Gran-de`), impostando `white-space: nowrap` sulle etichette e `overflow-wrap: break-word` sui valori.
- **Araldi del Segreto**: rimosso il pulsante modifica `✎` accanto ai privilegi di campagna per evitare caratteri spuri.

## [4.112.3] – 2026-10-21

### Modificato
- **Tema del personaggio al posto del generico** per barra in alto e combat tracker: fondo e bordo seguono i
  colori della classe del PG aperto (`--c-bordo-barra`). Il menu iniziale resta sul tema generico.
- **Stessa larghezza da ridotti**: il combat tracker ha ora la larghezza della barra in alto (prima, sotto
  i 1100 px di finestra, era 8 px più largo).
- **Combat tracker**: tolto il tasto ▲ per ridurlo (si riduce con ⚔️ nella barra).
- **Tiro con vantaggio/svantaggio**: tolto il punto iniziale, dadi tra parentesi tonde — `vantaggio (13, 11) → 13` —
  e riga un po' più in basso.

- **Menu iniziale**: "Ripristina backup" → "Ripristina" ed "Esporta backup" → "Esporta".

### Corretto
- Il test dell'animazione della barra a scomparsa non dipende più dal fotogramma (era instabile in CI).

## [4.112.2] – 2026-10-21

### Modificato
- **"I miei personaggi" nel menu a tendina del personaggio**: l'ultima voce del menu a tendina in cima alla
  scheda ("I miei personaggi…") apre il menu iniziale con l'elenco dei personaggi (colore di classe e
  cestino per eliminarli). Nel menu iniziale è sparito il pulsante "I miei personaggi ▾": dalla 🏠 il
  menu si apre senza elenco. Scegliere la voce non cambia il personaggio attivo.

## [4.112.1] – 2026-10-21

### Risolto
- **Sblocco overlay di caricamento dal cloud**:
  - Aggiunto timeout di sicurezza automatico di 4,5s sull'overlay di sincronizzazione per impedire che l'app rimanga bloccata all'infinito su "Caricamento dei personaggi dal cloud…".
  - Aggiunto pulsante esplicito "Chiudi e continua" e chiusura al tocco sullo sfondo per permettere sempre di proseguire immediatamente con i personaggi locali.
  - Applicato timeout di rete a 4,5s alle chiamate di sincronizzazione con il Worker (`fetchConTimeout`).
- **Sblocco test E2E e CI/CD**:
  - Escluso l'indicatore watermark discreto dai controlli automatici di contrasto WCAG (essendo un elemento decorativo/incidentale a bassissima opacità su richiesta).
  - Allineati i test Playwright delle finestre alla rimozione del pulsante Cronologia dalla home.

## [4.112.0] – 2026-10-20

### Aggiunto & Ottimizzato
- **Scala tipografica unificata per tutta la scheda**:
  - **Intestazioni sezioni principali**: allineate a `16px` con font classico pergamena (`Cinzel` / `var(--font-title)`).
  - **Sottocategorie e gruppi**: unificate a `12px` in maiuscoletto/uppercase con contrasto e colore tema (Trucchetti, Incantesimi, Cerchi, Azioni, Azioni Bonus, Reazioni, Privilegi di Classe/Sottoclasse, Tratti di Specie, Talenti, Sintonia, Monete, Soglie e Poteri).
  - **Nomi degli elementi**: unificati a `13px` in grassetto pieno (`700`) per incantesimi, armi/attacchi, oggetti dell'inventario, invocazioni e privilegi.
- **Icone e simboli a dimensione uniforme in tutte le sezioni**:
  - Tutti i badge grafici tematici (`IconaAzione`, `IconaOggetto`, `IconaRunica`, `IconaFantasy`) uniformati a `22px` con padding e contenitori allineati in ogni riga della scheda.
- **Apertura e transizione ultra-rapida di Combat Tracker e barre a scomparsa**:
  - Eliminato ogni delay artificiale (rimossi i 250ms di ritardo transizione) e velocizzata l'animazione di scorrimento su/giù a `0.14s cubic-bezier(0, 0, 0.2, 1)`, rendendo l'apertura e chiusura del Combat Tracker e delle barre fisse istantanee e scattanti.

## [4.111.2] – 2026-10-20

### Risolto
- **Risolto blocco deploy GitHub Pages in CI**:
  - Corretto avviso ESLint `no-misleading-character-class` e ripulite variabili in `IconaFantasy.jsx` che causavano il fallimento del job di linting in GitHub Actions CI, sbloccando così l'esecuzione del workflow di deploy automatico su GitHub Pages.

### Modificato
- **Scritta della versione copiabile con un tocco**:
  - La scritta della versione in basso a destra è ora selezionabile (`user-select: all`) e cliccabile/toccabile per copiare all'istante `v4.111.2` negli appunti, con feedback visivo temporaneo `(copiato!)` in verde e controllo immediato per forzare l'aggiornamento.

## [4.111.1] – 2026-10-20

### Modificato
- **Rinominata la sezione della scheda da "Equipaggiamento" a "Inventario"**:
  - Aggiornata l'etichetta del titolo della sezione della scheda (`sez.equipaggiamento`) in **"Inventario"** (e **"Inventory"** per la lingua inglese), in perfetta sintonia con la struttura dati e la terminologia GDR.

## [4.111.0] – 2026-10-20

### Aggiunto
- **Lista apribile a tendina dei manuali e fonti direttamente nella home**:
  - Il pulsante `Manuali e fonti` nel menu iniziale si espande ora come una comoda lista a fisarmonica (`▴` / `▾`) con tutti i manuali di gioco (PHB 2024, PHB 2014, Tasha, Xanathar, Fizban & Mostri, Araldi del Segreto).
  - Possibilità di attivare e disattivare i singoli manuali con un solo tocco istantaneo direttamente dall'elenco inline, con link diretto per preset rapidi e dettagli avanzati.

### Rimosso
- **Rimossa la cronologia delle versioni dalla home**:
  - Eliminato il pulsante "Cronologia versioni" dalla sezione Backup del menu iniziale per una home ancora più pulita, essenziale e focalizzata sui personaggi e sulle azioni di gioco.

## [4.110.5] – 2026-10-20

### Ottimizzato
- **Indicatore versione invisibile ad atmosfera intatta & Riconfigurazione Araldi**:
  - **Watermark versione in basso a destra**: eliminato il bordo e lo sfondo a scatola; il testo si adatta ora in modo quasi trasparente (`opacity: 0.18`) e si fonde perfettamente su qualunque sfondo (foresta, pergamena, caverna, temi scuri o chiari) senza distrarre dall'atmosfera di gioco; al passaggio del cursore torna temporaneamente a piena leggibilità.
  - **Pannello Araldi del Segreto nel tema della classe**: rimosse le cornici marroni opache; le scatole e le intestazioni adottano lo stile nativo della classe e della scheda, mentre l'arancione ambra luminoso (`#ff9f1a` con glow) valorizza selettivamente i rombi dei Segreti, la barra del Debito, le perle/pallini d'uso dei privilegi e i badge di soglia.

## [4.110.4] – 2026-10-20

### Ottimizzato
- **Rimosso bordo e sfondo arancione invasivo sulle righe degli incantesimi con poteri del Patrono / Araldi**:
  - Le righe degli incantesimi mantengono ora la sobria eleganza standard del resto della scheda (nessun contorno né sfondo arancione/marrone che appesantisca la visuale).
  - Il riconoscimento visivo dei poteri e incantesimi del Patrono / Araldi è affidato esclusivamente all'**icona dell'Occhio Runico Onnisciente**.
  - **L'Occhio Runico del Patrono** è stato reso ultra-luminoso e incandescente (ambra aranciata solare brillante `#ff9f1a` / ciano etereo `#00f5ff` con glow multilivello e drop-shadow vibrante), risaltando immediatamente sul tema scuro o chiaro senza sporcare la riga.

## [4.110.3] – 2026-10-20

### Aggiunto
- **Icone differenziate per Trucchetti e Incantesimi di livello con colorazione elementale dinamica**:
  - **Trucchetti (livello 0)**: utilizzano icone vettoriali dedicate con silhouette a scintilla/stella a 4 punte, cristallo elementale o freccia/globo compatto.
  - **Incantesimi di livello (1° - 9°)**: utilizzano icone vettoriali avanzate ad alta definizione (fiamme complesse, comete/meteoriti, sfere celesti solari, nubi tossiche dense, vortici psionici, sigilli arcani complessi).
  - **Colorazione per tipo di danno ed elemento**:
    - Fuoco: arancione brace viva (`#ff6b35`).
    - Freddo/Gelo: ciano ghiaccio glaciale (`#00d2d3`).
    - Fulmine: giallo saetta (`#fed330`).
    - Tuono: azzurro d'urto atmosferico (`#45aaf2`).
    - Acido / Veleno: verde smeraldo tossico (`#20bf6b` / `#26de81`).
    - Necrotico: viola spettrale profondo (`#a55eea`).
    - Radioso: oro radiante celestiale (`#f7b731`).
    - Forza: ametista/fucsia cinetico (`#d980fa`).
    - Psichico: corallo cremisi mentale (`#fc5c65`).
    - Cura / Rigenerazione: verde smeraldo sacro con Cuore (`#38ef7d`).
    - Arcano Trucchetto: azzurro cielo astrale (`#70a1ff`).
    - Arcano Incantesimo di livello: oro dorato nobile (`#d4a017`).
  - Integrazione automatica con il catalogo SRD `datiIncantesimo` per rilevare livello e tipo di danno su qualsiasi incantesimo, sia nella lista magie che nel pannello combattimento/azioni.

## [4.110.2] – 2026-10-20

### Ottimizzato
- **Apertura ultra-rapida e fluida di Combat Tracker, barra a scomparsa e menu**:
  - Eliminato il ritardo artificiale (delay di 100ms e 240ms) sull'opacità e sull'animazione dei controlli interni del Combat Tracker e della barra superiore: ora la finestra risponde all'istante al click o all'avvicinamento del cursore.
  - Velocizzata la transizione di salita/discesa (`transform`) da `0.38s` a uno scattante `0.20s` con curva `cubic-bezier(0.16, 1, 0.3, 1)` ad alta reattività e senza scatti.
  - Aggiunta animazione di ingresso immediata con accelerazione hardware (`modal-scivola-su`) per il menu mobile e i pannelli a comparsa.

## [4.110.1] – 2026-10-20

### Corretto
- **Uniformità dimensionale delle icone a tema (22px) in tutte le sezioni**:
  - Standardizzata la grandezza dei badge vettoriali su `22px` (`DIMENSIONE_ICONA_SEZIONE`) in tutte le aree della scheda: Azioni, Incantesimi, Invocazioni Occulte, Poteri del Patrono, Araldi del Segreto, Inventario ed Equipaggiamento, Reazioni e Popup di dettaglio.
  - Implementata la logica di priorità a cascata per i simboli:
    - **Cure e ripristino PF** ricevono sempre il **Cuore** verde smeraldo vivo (sia incantesimi come *Cura Ferite*, che tratti come *Imposizione delle Mani* o pozioni).
    - **Poteri del Patrono, Invocazioni Occulte e Araldi** ricevono l'**Occhio Runico Onnisciente** con bagliore arcano ciano/viola.
    - **Reazioni e difese** ricevono lo **Scudo**.
    - **Magie elementali** seguono il proprio elemento (fuoco, gelo, fulmine, radioso, necrotico, veleno).
    - **Trucchetti generici** usano la Scintilla Arcana, mentre gli incantesimi di livello generici usano il Grimorio runico.

## [4.110.0] – 2026-10-20

### Aggiunto
- **Sostituzione completa emoji con icone fantasy vettoriali (Game-Icons / SVG a tema)**:
  - Eliminazione di tutte le emoji generiche di sistema nei popup di dettaglio azioni/incantesimi (es. Morsa del Gelo, reazioni, magie), sostituite da icone SVG a tema scalabili con colori coerenti (es. ciano per gelo, oro per sacro, cremisi per fuoco/sangue).
  - Nuove icone vettoriali RPG per la barra superiore e mobile hub (`IconaUI` per dado d20, livello, cestino, cerca, pergamena, tema, mappa, spade incrociate, cloud).
  - Combat Tracker completamente vettoriale: token iniziativa (`dado`), area (`esplosione`), pedine combattenti (`mago`, `bestia`, `teschio`), ferite e tiri salvezza contro morte (`teschio`), punti ferita temporanei (`scudo`).
  - Filigrana caratteristiche nei blocchi scheda rigenerata con glifi vettoriali eleganti al posto delle emoji giganti.
  - Pulizia automatica residuale `rimuoviEmoji` per titoli e descrizioni per garantire la totale assenza di emoji native anche su testi storici o personalizzati.

## [4.109.4] – 2026-10-20

### Corretto
- **Apertura automatica del Combat Tracker da sotto**:
  - Quando il combat tracker è aperto (`combat.aperto`), si apre ed emerge in automatico da sotto con il bordo radioso dorato e resta visibile e accessibile sullo schermo.
  - Cliccando sul pulsante ⚔️ (dalla barra superiore o direttamente dalla sezione Combattimento nella scheda Azioni) o toccando la striscia/maniglia inferiore, il tracker si auto-apre immediatamente e fluidamente.
  - Quando ridotto con `▲` o ⚔️, scivola morbidamente in basso lasciando solo la discreta maniglia dorata, continuando a fare capolino al passaggio del cursore.

## [4.109.3] – 2026-10-20

### Corretto
- **Contrasto badge versione per accessibilità WCAG AA/AAA**: fondo solido ad alto contrasto (`#12171f`), testo oro chiaro (`#f0c050`) e bordo definito (`#7c5c16`) con contrasto superiore a 10:1 su qualsiasi ambientazione (chiara e scura), garantendo il passaggio istantaneo dei test di accessibilità axe-core in CI.

## [4.109.2] – 2026-10-20

### Aggiunto
- **Indicatore versione fluttuante in basso a destra**: badge compatto, discreto e leggibile su qualsiasi sfondo (`v4.109.2`) visibile in modo permanente nell'angolo inferiore destro dello schermo per verificare a colpo d'occhio l'allineamento della versione dell'app.

## [4.109.1] – 2026-10-20

### Corretto
- **Allineamento e2e e tempi di transizione barra e combat tracker**: ottimizzati i tempi di dissolvenza opacità e l'innesco di scorrimento (18px) per garantire il passaggio immediato della pipeline CI e il deploy automatico su GitHub Pages.

## [4.109.0] – 2026-10-20

### Aggiunto
- **Formula ibrida per le icone fantasy (Game-Icons.net + Glifi Runici)**:
  - **Armi, Attacchi e Azioni di Combattimento**: icone vettoriali Game-Icons.net in micro-badge ad altissima definizione per tutte le tipologie di armi (spadone a due mani, stocco, pugnale, ascia da guerra, martello, lancia, balestra, arco, bastone, armi ad asta e spade incrociate). Il tocco/clic sull'icona apre istantaneamente il selettore per cambiare arma o consultare i dettagli.
  - **Incantesimi e Trucchetti**: silhouette Game-Icons.net coordinate per elemento e scuola (palla di fuoco, dardi incantati, gelo, fulmine, cura/sacro, necrotico, veleno, arcano e grimorio) presenti sia nella sezione combattimento che nel catalogo degli incantesimi.
  - **Oggetti e Inventario**: icone chiare in stile Game-Icons per pozioni, pergamene, armature, armi e manufatti magici.
  - **Glifi Runici (Neon Arcani)**: sigilli cosmici ed esoterici per la sezione *Poteri / Debito del Patrono / Araldi del Segreto* (Runa del Disfacimento, Sigillo dell'Occhio Onnisciente, Patto di Sangue e Salvezza Arcana) con bagliore neon ciano/viola che risalta l'aura aliena e misteriosa dei poteri occulti.

## [4.108.6] – 2026-10-20

### Modificato
- **Sporgenza simmetrica combat tracker e barra in alto**: a riposo la maniglia del combat tracker sul fondo sporge esattamente di 14 px come quella superiore, con maniglia orizzontale dorata simmetrica e perfettamente centrata.
- **Bordo di attivazione combat tracker**: all'apertura il combat tracker attiva un bordo dorato radioso con aura e bagliore superiore (`box-shadow` e riflesso interno 3D) che ne sottolinea visivamente l'entrata in combattimento.
- **Fluidità massima a 60/120 fps**: transizioni con curva a molla naturale `cubic-bezier(0.16, 1, 0.3, 1)`, accelerazione hardware GPU (`translate3d`, `will-change`), dissolvenza del contenuto sincronizzata al movimento e zone di innesco mouse allargate a 24 px per un'apertura istantanea e senza esitazioni.

## [4.108.5] – 2026-10-20

### Aggiunto
- **Combat tracker a scomparsa (stile barra in alto)**: quando il combattimento è attivo (`combat.attivo`), il tracker in basso adotta la stessa elegante meccanica a scomparsa della barra superiore. A riposo resta visibile solo una discreta striscia con la maniglia centrata sul bordo inferiore; avvicinando il cursore (o passando il mouse/Tab sul fondo), il tracker scorre fluidamente verso l'alto ed è subito pronto per azioni, turni e danni. Quando il cursore si allontana, scivola morbidamente indietro liberando la visuale della scheda.

## [4.108.4] – 2026-10-20

### Modificato
- **Combat tracker a larghezza scheda**: il combat tracker aperto si allinea alla larghezza massima della scheda (1080 px), centrato a schermo con angoli superiori arrotondati.
- **Controlli combat tracker**: ordinati con chiarezza sulla destra con cluster strumenti tattici (Iniziative, Ordina, Area) e comandi di gestione finestra.
- **Rimozione barra/pillola ridotta in basso**: rimosso l'indicatore d'iniziativa fluttuante in basso a destra; il combat tracker si apre e si gestisce unicamente dalla sezione dedicata nella barra dei menu in alto (tasto ⚔️).
- **Nome file backup roster**: il download del backup completo dei personaggi ora usa il formato compatto con data e versione `AAAAMMGG_TDD_ALL_vX.X.json` (es. `20261020_TDD_ALL_v4.108.4.json`).

## [4.108.3] – 2026-10-16

### Modificato
- **Combat tracker, frecce**: aperto, il tasto per ridurlo è un ▲ al posto del "−"; ridotto, la pillola mostra
  ▼. Come nel resto dell'app: ▲ = aperto (si chiude), ▼ = chiuso (si apre).

## [4.108.2] – 2026-10-15

### Corretto
- **Barra a scomparsa, animazione vera**: lo stile in linea della sezione (`styles.panel`) aveva una sua
  `transition` che vinceva su quella del CSS, così la barra scattava di colpo invece di scorrere e le icone
  restavano visibili nella striscia mentre sfumavano. Ora le transizioni della barra sono `!important`:
  chiudendo, prima spariscono le icone e poi la barra sale; aprendo, la barra scende vuota e le icone
  compaiono alla fine. Nuovo test che campiona l'animazione fotogramma per fotogramma.

## [4.108.1] – 2026-10-15

### Modificato
- **Barra a scomparsa più pulita**: chiudendosi, le icone spariscono prima che la barra salga (prima
  per un attimo se ne vedevano i pezzi nella striscia). Angoli tutti arrotondati.
- **Barra in alto e combat tracker sul fondo della scheda del PG corrente** (`--c-pg-panel`), tasti
  della barra compresi; il bordo resta quello del tema generico. Il menu iniziale resta sul tema base.
- **Combat tracker ridotto più corto**: "Round 1 · Vaelion" senza "Turno di"; largo al massimo quanto il
  margine accanto alla scheda, così non le finisce sopra (il nome lungo va in ellissi).

## [4.108.0] – 2026-10-15

### Aggiunto
- **Barra in alto a scomparsa** (computer col mouse): resta una striscia sottile con una maniglia;
  avvicinando il cursore alla cima dello schermo la barra scende con un'animazione e risale poco dopo
  che il cursore se ne va (anche col Tab da tastiera si apre). La scheda sale nello spazio liberato.
  Su telefono e tablet la barra resta sempre visibile. Test in `e2e/barra-scomparsa.spec.js`.

### Modificato
- **Sfondi più vivi**: lo sfondo vaga su un percorso a più tappe (50 s invece di 70 s, spostamenti e
  zoom più ampi, con margine sempre sufficiente ai bordi) e sopra scorre una luce morbida. Solo
  trasformazioni e opacità; fermo con "riduci movimento".
- **Tasti della barra in alto**: tutti con il fondo della barra e un sottile bordo del colore del bordo
  della barra, in ogni stato. Sincronizzazione e combattimento in corso sono un pallino colorato
  nell'angolo del tasto; il campanello degli avvisi suona ma non lampeggia più d'oro. Su telefono anche
  ☁️, 🎲, ⚔️ e Menu seguono lo stesso stile.

## [4.107.4] – 2026-10-15

### Corretto
- **Worker, modelli Gemini**: provato con una chiave vera, `gemini-2.5-flash` è ritirato (404) e
  `gemini-flash-latest` a volte risponde 503; ora si parte da `gemini-3.8-flash` (una scheda letta in
  circa 20 secondi). Se i nomi noti non rispondono, la ricerca automatica prova prima i
  `gemini-<versione>-flash` stabili dal più nuovo e solo dopo omni/preview, che sul piano gratuito danno 429.

## [4.107.3] – 2026-10-15

### Modificato
- **Menu iniziale, bordi unificati**: tutti i tasti del menu hanno il bordo del tema generico (lo stesso
  del pannello, della barra in alto e del combat tracker). Il tasto della sincronizzazione non cambia più
  bordo e colore del testo: lo stato (attiva, da inviare, spenta) è un pallino colorato accanto alla scritta.
- **Etichette più corte**: "Backup e sincronizzazione" → "Backup", "Avvisi (!)" → "Avvisi",
  "Manuali e fonti (N attivi)" → "Manuali e fonti (N)".

## [4.107.2] – 2026-10-15

### Modificato
- **Tema generico unico**: menu iniziale, barra in alto e combat tracker (aperto e ridotto) usano lo
  stesso grigio e lo stesso bordo, quelli del menu iniziale (`--c-tema-sfondo`, `--c-tema-bordo` in
  `stileTemaBase`). Tolto il grigio a parte della barra in tema scuro e il bordo oro del tracker.
- **Menu iniziale tutto nello schermo**: niente barra di scorrimento; tasti affiancati (Personaggio
  casuale e Manuali, Importa ed esporta e Backup, Dati e backup su una riga), spaziature più strette,
  il pannello parte sotto la barra fissa (prima su telefono la barra copriva il titolo). Sugli schermi
  bassi i tasti si stringono ancora un po'.

## [4.107.1] – 2026-10-15

### Aggiunto
- **Import con Google Gemini, gratis**: il Worker ora usa come primo fornitore Gemini (piano gratuito di
  AI Studio, solo una chiave `GEMINI_API_KEY`, nessuna carta), che legge immagini e PDF a più pagine in una
  richiesta sola ed è molto più preciso dei modelli gratuiti di Workers AI sulle icone e sulle tabelle.
  Cascata di modelli (`GEMINI_MODEL` o predefiniti), passaggio al successivo su 404/429, e se nessun nome
  noto risponde il Worker elenca i modelli e prova i "flash" più recenti da solo (`trascriviGemini`,
  `estraiJsonScheda`, test con `fetch` finto). Ordine: Gemini → Workers AI → Ollama → Anthropic.
  Va ripubblicato il Worker; istruzioni in `worker/LEGGIMI.md`.

## [4.107.0] – 2026-10-15

### Corretto
- **Import da PDF/immagini: la Maestria andava persa.** Il Worker scrive la Maestria come "2", ma nell'app
  il 2 è solo un marcatore d'origine (vale ×1) e la Maestria è il 3 (×2): le doppie competenze (es. Inganno
  +8 e Furtività +13 di Elevorn) arrivavano come competenze semplici. Ora si converte.

### Aggiunto
- **Le icone si controllano con i numeri** (`src/rules/importSchede.js`): il Worker ora legge anche i totali
  stampati sulla scheda (`abilitaTotali`, `tiriSalvezzaTotali`) e l'app ricava da sola chi è competente
  (totale − modificatore = 0, competenza o il doppio) senza fidarsi di stelle e cerchietti. Senza totali, se
  quasi tutte le abilità risultano accese si azzerano (errore sulle stelle) e valgono le competenze del
  background. A fine import un avviso elenca cosa è stato corretto.
- **Unione delle schermate prima del controllo**: Main + Skills dello stesso personaggio si uniscono e solo
  dopo si verificano i totali (la tab Skills da sola non ha i punteggi); i totali di schermate diverse si
  fondono.
- **"Fighter 1 / Ranger 6 / Rogue 3"** e le diciture italiane tipo "Spadaccino 4 / Warlock 1" (sottoclasse al
  posto della classe → Ladro, Spadaccino) si leggono in classe, livello e multiclasse.
- **Prompt del Worker**: regola "numeri prima delle icone", niente 10 o livello 1 inventati su schermate
  parziali, guida per la scheda cartacea italiana a 4 pagine. **Per usarlo va ripubblicato il Worker**
  (`cd worker && npx wrangler deploy`); le correzioni dell'app funzionano anche col Worker vecchio.

### Modificato
- **Combat tracker**: "−" (minimizza) e "✕" (chiudi) hanno la stessa forma tonda con contorno della ✕
  della pillola ridotta.

## [4.106.1] – 2026-10-15

### Aggiunto
- **Sfondo con un leggero movimento**: un "respiro" lentissimo (zoom e scivolamento di pochi punti
  percentuali, 70 secondi avanti e indietro) sul livello dello sfondo, solo con trasformazioni
  (GPU, costo minimo). Si ferma con "riduci movimento" del sistema.

### Modificato
- **Classe Armatura**: il menu Copertura ha la stessa larghezza del menu del tipo di armatura
  (88% del riquadro, a tutta larghezza sul telefono), e "base 14", scudo e "+1" sono più distanziati.

## [4.106.0] – 2026-10-15

### Aggiunto
- **Il manuale Araldi del Segreto si accende solo con una password** (te la dà il Master), da
  Menu → Manuali e fonti: il tasto chiede la password; spegnerlo no. Si confronta l'impronta
  SHA-256 della password in minuscolo (`passwordAraldiGiusta` in `dati5e.js`), senza distinguere
  le maiuscole: è una barriera leggera, l'app gira nel browser.

### Modificato
- **Il riquadro "Poteri" sotto le Risorse di classe esiste solo col manuale Araldi attivo**
  (altrimenti non c'è nemmeno vuoto). Il pulsante "Ripristina i Poteri della campagna" compare solo
  col manuale; il manuale non si accende più da solo (né all'apertura di una scheda con i poteri
  degli Araldi, né col ripristino) e la lista ampliata si aggiunge solo col manuale attivo.
- **Sezioni aperte**: aprendo un personaggio Competenze e Risorse di classe sono sempre aperte;
  Poteri parte chiusa e poi ricorda l'ultima scelta.
- **Classe Armatura**: l'ordine è Copertura (più stretta), tipo di armatura, riga "base 14 / scudo".
  Tolta la voce "CA Manuale" dal menu del tipo di armatura (resta solo ai personaggi che già la usano).
- **Combat tracker**: solo l'iniziativa e il nome del personaggio hanno i colori della sua classe
  (nella scheda del tracker e nella pillola ridotta nel suo turno); il resto è sul tema base.
- **"CA +valore" sempre così** sugli oggetti: "(CA +14)" per le armature (prima "(CA 14)"), "(CA +2)",
  "(CA +1)"; un "(CA 14)" scritto a mano nel nome si legge da lì e si mostra uguale, e il compendio
  dice "(CA +11)" invece di "(CA base 11)".

## [4.105.7] – 2026-10-14

### Corretto
- **"Artefice" compariva due volte** nella scelta della classe in creazione del personaggio:
  era già nell'elenco base (`NOMI_CLASSI`) e il codice lo aggiungeva ancora col manuale Tasha.
  Ora un solo elenco (`classiDisponibili`): l'Artefice c'è una volta sola e solo col manuale
  Tasha attivo (prima, con Tasha spento, compariva lo stesso). Vale anche per multiclasse,
  Level Up e "Personaggio casuale".

## [4.105.6] – 2026-10-14

### Modificato
- **Riquadro Classe Armatura**: il numero della CA è centrato nello spazio libero fra il titolo e i
  controlli sotto, e il menu "Copertura" è più stretto (78%) e centrato.

## [4.105.5] – 2026-10-14

### Aggiunto
- **✕ sulla pillola del combat tracker ridotto** per chiudere il combattimento, con la stessa
  conferma del tracker aperto; il clic non riapre il tracker.
- **Sfondo blu per gli oggetti magici** (token `--c-magico`): sulla riga dell'inventario, sulla
  sua riga dell'effetto e negli slot di "Oggetti magici sintonizzati". È magico un oggetto con un
  effetto meccanico, che richiede sintonia o che è sintonizzato.

### Modificato
- **Barra in alto grigio scuro** nel tema scuro (non più nera), così si stacca dallo sfondo
  della scheda.
- **Anagrafica sempre leggibile per intero**: etichette (BACKGROUND, ALLINEAMENTO...) e valori
  (Sottoclasse, Classe...) vanno a capo invece di tagliarsi con "…"; le etichette si
  rimpiccioliscono con la larghezza (container query); la colonna di Allineamento è più larga e
  su tablet il blocco PE non esce più dal bordo. Misurato da 390 a 1920 px con i testi più lunghi.
- **Contorno di focus dei tasti della barra neutro** (grigio) invece che dorato: l'anello dorato
  dopo una conferma o un tasto da tastiera sembrava un tasto "acceso" (es. giorno/notte).
- **Menu iniziale**: tolto il secondo titolo "I miei personaggi" sopra la lista.
- **Pillola del combat tracker sempre sul tema base**, anche quando è il turno del personaggio.
- **Niente più ✕ per eliminare gli attacchi** di armi e incantesimi: spariscono da soli. L'arma
  se disequipaggi o togli l'oggetto (già così); l'incantesimo se lo togli dalla lista o non è più
  preparato, e torna se l'incantesimo torna (`attaccoIncantesimoAttivo`). Gli incantesimi che
  prima si "nascondevano" a mano tornano visibili. La ✕ resta solo per un attacco "orfano" (non è
  un incantesimo e non c'è l'oggetto in inventario, es. aggiunto dal compendio).

## [4.105.4] – 2026-10-14

### Modificato
- **Barra in alto sul tema base dell'app**, come il menu e il combat tracker, non coi colori
  della classe del personaggio.
- **Modificatore e punteggio delle caratteristiche nel colore del loro bordo** (il "4" di
  Forza e il "4 → 19", il "2" di Destrezza...), leggermente avvicinati all'inchiostro del tema
  per restare leggibili su ogni ambientazione.

## [4.105.3] – 2026-10-14

### Modificato
- **Combat tracker sul tema base dell'app**, non sui colori della classe: lo stesso tema del
  menu iniziale (`stileTemaBase`). Prendono i colori della classe solo i riferimenti al
  personaggio: la sua scheda nel tracker e la pillola ridotta quando è il suo turno
  (`stileColoriPg`, dalle variabili `--c-pg-*`). Nemici, alleati e le pillole del loro turno
  restano sul tema base.

## [4.105.2] – 2026-10-14

### Modificato
- **Lista dei personaggi nel menu nei colori della classe**: ogni riga ha la barra a sinistra,
  il fondo appena tinto e il nome della classe nel colore della sua classe (verde Druido,
  rosa Bardo, viola Stregone, arancio Guerriero, blu Mago...), leggibile su tema chiaro e scuro.

## [4.105.1] – 2026-10-14

### Modificato
- **Card "Ultimo usato" del menu nei colori della classe** del personaggio (verde per il
  Druido, arancio per il Guerriero...): è l'unica parte del menu che li usa, il resto resta
  sul tema base. La scheda esporta i colori della classe in variabili `--c-pg-*` che il tema
  base del menu non ridefinisce.

## [4.105.0] – 2026-10-14

### Modificato
- **Menu iniziale col tema base del progetto** (oro "Classica"), non coi colori della classe
  del personaggio corrente: le variabili del tema vengono ridefinite sul contenitore del
  menu (`stileTemaBase` in `App.jsx`, da `BASE_TEMA`).
- **Bordi delle caratteristiche più forti**: 1,5 px, colore quasi pieno anche a riposo.
- **TS nel colore della caratteristica**: i badge "Costituzione · CD 17" (incantesimi e
  attacchi), le CD delle azioni delle creature ("Saggezza · CD 20", lette da "TS Saggezza")
  e la CD del TS di concentrazione (Costituzione) prendono il colore del riquadro della
  caratteristica (`chiaveCaratteristica`, `caratteristicaDaTesto`, `coloreCaratteristica` in
  `componenti.jsx`).

## [4.104.0] – 2026-10-14

### Modificato
- **Caratteri uniformati in tutto il progetto**:
  - due famiglie sole: Cinzel per titoli ed etichette, Georgia per il testo. Le etichette
    della barra (SISTEMA, SCHEDA, SESSIONE) e dei titoletti del menu non sono più in
    monospace; le schermate d'errore non usano più il carattere di sistema; pulsanti e voci
    delle tendine ereditano Georgia. Il monospace resta solo nei codici di sincronizzazione e
    delle stanze, dove serve a distinguere 0 da O;
  - una scala di dimensioni: 10 · 11 · 12 · 13 · 14 · 16 · 18 · 22 px, più i numeri grandi
    (CA, PF, dadi). I valori fuori scala (9; 10,5; 11,5; 12,5; 13,5; 15; 19; 20; 21) sono
    stati portati al gradino più vicino; le voci delle tendine a 13 px invece dei 13,33 del
    browser;
  - menu iniziale: tutti i pulsanti con la stessa dimensione e lo stesso peso, solo "Nuovo
    personaggio" in evidenza; "Ultimo usato" con lo stesso titoletto delle sezioni.

## [4.103.1] – 2026-10-14

### Aggiunto
- **Un colore per ogni caratteristica** sul bordo del riquadro: Forza rosso mattone,
  Destrezza verde muschio, Costituzione ocra, Intelligenza blu, Saggezza viola, Carisma oro
  rosato (token `--c-car-*`, tema chiaro e scuro). A riposo il bordo è smorzato, al
  passaggio del cursore si accende con l'alone dello stesso colore.

### Modificato
- **Anagrafica in quattro colonne uguali** (schermi da 1100 px in su): le colonne passano in
  `stili.js` (`.anagrafica-riga-1/2`) e sono le stesse nelle due righe, quindi Sesso sta
  sopra Background, Razza sopra Classe, Taglia sopra Sottoclasse e Allineamento sopra i PE.
  Su tablet restano le colonne proporzionate (quelle uguali taglierebbero Sottoclasse e
  Allineamento).
- **Modificatore della caratteristica senza "+" e senza tiro**: il numero grande accanto a
  Forza, Destrezza... è solo da leggere; i TS si tirano dalla riga "Tiro salvezza", le prove
  dalle abilità.

### Rimosso
- La matita accanto alla velocità: la velocità la calcola l'app (specie, Poteri,
  sfinimento) e non si modifica a mano. Il clic sul valore apre movimento e salti.

## [4.103.0] – 2026-10-14

### Aggiunto
- **CA tra parentesi accanto agli oggetti** dell'equipaggiamento: "(CA 14)" per le armature,
  "(CA +2)" per gli scudi, "(CA +1)" per gli oggetti magici che danno CA; un +1/+2/+3 nel
  nome si somma (`etichettaCaOggetto`). Se il nome la riporta già non si ripete.
- **Scudo in Legnoferro** nel catalogo degli oggetti (3 kg, CA +2).
- **Colonne del Profilo allineate** (`src/ui/useAllineaProfilo.js`): Competenze finisce con
  Punti Ferita, Risorse di classe con CA/Riposo, Poteri con l'ultima fila dei riquadri. Si
  allunga il riquadro più corto; quello centrale solo di pochi pixel, così aprendo una sezione
  a sinistra la colonna centrale non viene stirata. Su mobile non cambia nulla.
- **Luce al passaggio del cursore** anche su Punti Ferita, CA, Riposo e le caselle sotto, come
  già per le sezioni e le caratteristiche.

### Corretto
- **Debito sparito dai Poteri**: il contatore Debito degli Araldi del Segreto stava solo nel
  "Potere del Patrono"; se quel potere mancava o era spento il Debito non compariva più, e il
  pulsante di ripristino restava nascosto perché gli Araldi c'erano. Ora torna da solo nel
  potere "Segreti e Debito" con l'ultimo valore noto (`garantisciDebitoAraldi`).
- **Taglia allineata a Sottoclasse** nell'anagrafica: le prime due colonne delle due righe
  sommano alla stessa larghezza.
- **Solo le bestie si assumono**: nella scheda di una creatura i tasti Forma Selvatica e
  Metamorfosi compaiono solo per le bestie del catalogo (non per evocazioni come Myrdhal,
  elementali, spiriti, famigli o mostri) e restano spenti, con il motivo, oltre i limiti:
  GS del livello da druido e volo/nuoto per la Forma Selvatica (`esitoFormaSelvatica`),
  GS fino al livello per la Metamorfosi (`esitoMetamorfosi`). La Forma Selvatica compare
  solo a chi ha livelli da druido.
- Test e2e della finestra Movimento: si apre dal valore della velocità (4.102.2).

### Modificato
- "Evoca / Aggiungi" diventa **"Evoca"** (scheda creatura, catalogo e sezione Compagni).
- **PE a filo del bordo destro**, come la tendina di Allineamento sopra (desktop).

### Rimosso
- Il pulsante "Recupera i Poteri dalla cronologia" nel riquadro Poteri (la Cronologia
  versioni resta nel menu).
- Il "+ 0" del bonus CA manuale accanto allo scudo: la CA extra la danno gli oggetti (✨).
  Resta visibile solo se una scheda vecchia ha un valore diverso da 0.

## [4.102.2] – 2026-10-14

### Modificato
- Velocità cliccabile per aprire il calcolatore di movimento, senza l'etichetta "Movimenti".
- "Archivio del Master" si chiama ora "Archivio".

## [4.102.1] – 2026-10-13

### Corretto
- **Versione nel menu**: attaccata alla "i" finale di "Tavolo dei Dadi" e sulla stessa linea
  di base delle lettere (niente spazio nel markup, `margin-left: 5px`), anche su iPhone dove
  lo spazio diventava largo.

## [4.102.0] – 2026-10-12

### Aggiunto
- **Danno ad area nel combat tracker**: il tasto "Area" apre una finestra con danno (numero
  o dadi, es. 8d6, tirabili lì), tipo di danno, "magico" e la lista di tutti i combattenti,
  nemici, te e i tuoi alleati, da spuntare (scorciatoie: tutti i nemici, io e alleati, tutti,
  nessuno). Per ognuno propone resistenza, immunità o vulnerabilità lette dai tratti della
  creatura, dalle resistenze/tratti di specie del PG o dalla scheda dell'alleato
  (`difesaControDanno` in `src/rules/scheda.js`; la difesa si può cambiare a mano), il TS
  superato dimezza, e si vede il danno finale riga per riga. Un solo aggiornamento applica
  PF temporanei, PF, TS contro morte e concentrazione del PG e i PF degli alleati.
- Il tasto per ridurre il combat tracker è un "−".

### Corretto
- Un PG nel combat tracker senza TS contro morte salvati mandava in errore la scheda.

## [4.101.1] – 2026-10-12

### Corretto
- **Combat tracker ridotto**: "Round 1 · Turno di Vaelion" al posto di "Di turno: Vaelion".

## [4.101.0] – 2026-10-12

### Corretto
- **Nuvolette che partivano a metà frase** (es. Chiaroveggenza: ") entro 1,5 km…"): il
  riassunto delle descrizioni cercava le frasi con una regex che scartava in silenzio
  quelle in cui il punto era seguito da ")" o da una cifra ("boschetto...)", "(5.5)").
  Nuovo `src/utils/testo.js` (`dividiFrasi`, `riassumiDescrizione`): un punto chiude la
  frase solo fuori dalle parentesi, seguito da uno spazio, e non dopo abbreviazioni
  (es., ecc., liv.); il riassunto è sempre l'inizio del testo. Controllo su tutto il
  progetto: 227 testi colpiti col vecchio metodo, 0 con il nuovo (test su tutti i testi
  di `src/data` e `src/dati`).
- **Talenti di Xanathar**: le 15 descrizioni dei talenti razziali erano tagliate a 300
  caratteri con "..."; ora sono complete.

### Cambiato
- **Avvisi e novità**: la versione dell'app è scritta accanto alla X; tolto il tasto
  "Ricarica l'applicazione" in fondo.

## [4.100.0] – 2026-10-12

### Aggiunto
- **Combat tracker ridotto**: accanto a "Round · Di turno" c'è il riquadro **Iniz. N**
  con l'iniziativa di chi è di turno, ben in vista.

## [4.99.0] – 2026-10-12

### Corretto
- **Tolto il +3 m di velocità della "Maschera"** dal Potere del Patrono di Vaelion: non è
  più una regola della campagna, ma era rimasto nei dati dal 21/09 (e "Ripristina i Poteri
  della campagna" lo rimetteva). Via dal personaggio di esempio, dai Poteri della
  campagna e, con una migrazione, dalle schede già salvate. La velocità di Vaelion è
  10,5 m (Elfo dei Boschi).

## [4.98.0] – 2026-10-12

### Cambiato
- **Equipaggiamento, righe tutte uguali**: ogni oggetto mostra solo "⋯" e il cestino;
  "⋯" apre e chiude le icone (anche per gli oggetti con contenitore, effetto o
  utilizzi già attivi, che prima le mostravano sempre). Le righe "Effetto"/"Utilizzi"
  degli oggetti che li usano restano visibili.

### Aggiunto
- **✎ Rinomina l'oggetto**, fra le icone aperte da "⋯".

## [4.97.0] – 2026-10-12

### Corretto
- **Velocità di Vaelion**: la base torna a **10,5 m** (Elfo dei Boschi, 35 ft, in entrambe
  le edizioni). La 4.95 l'aveva portata a 9 m, anche sulle schede salvate: la migrazione
  ora riporta 9 → 10,5. Il totale mostrato resta base + Poteri attivi (Maschera +3 m →
  13,5 m, in blu, dettaglio nel tooltip).

### Cambiato
- **Menu iniziale**: i titoletti delle sezioni (Azioni rapide, Dati e backup,
  Informazioni) hanno lo stesso stile delle etichette della barra (Sistema, Scheda,
  Sessione); la versione poggia sulla linea di base della scritta "Tavolo dei Dadi".
- **Tolta la scelta delle cornici** dal menu: seguono sempre la classe del personaggio.

## [4.96.0] – 2026-10-12

Controllo completo delle regole automatiche (PF, TS contro morte, riposi, sfinimento,
concentrazione, critici). Già corretti e coperti da test: PF temporanei assorbiti per
primi, fallimento automatico per danno a 0 PF, danno massiccio = morte istantanea,
20 naturale ai TS contro morte = 1 PF, 1 naturale = due fallimenti, riposo lungo (PF,
PF temporanei, slot, dadi vita per edizione, risorse, −1 sfinimento, TS contro morte),
riposo breve (risorse "breve" e slot del Patto del Warlock), sfinimento 5.5 (−2 ai d20 e
−1,5 m per livello) e 5.0 (effetti cumulativi, PF massimi dimezzati al 4°), critico che
raddoppia solo i dadi.

### Corretto
- **A 0 PF** la scheda aggiunge da sola la condizione **Privo di sensi** e interrompe la
  **concentrazione** (prima restava attiva e poteva comparire perfino il TS di
  concentrazione). Vale da qualunque parte arrivi il danno: tasti rapidi, Combat
  Tracker, PF scritti a mano (`patchTransizionePf`).
- **Recuperando PF da 0** si toglie Privo di sensi e i **TS contro morte si azzerano**
  (prima restavano i successi/fallimenti di prima: bastavano meno fallimenti per morire).
- **CD della concentrazione** nella 5.5 al massimo 30 (`cdConcentrazione`).
- **Sfinimento 6** mostra "Morte" anche con le regole 2024 (prima "−12").

### Nota
- Scendere a 0 PF **non** dà livelli di sfinimento né nelle regole 2014 né nelle 2024:
  la scheda non li aggiunge.

## [4.95.4] – 2026-10-12

### Corretto
- **"Errore di Visualizzazione Scheda — startsWith is not a function"**: il controllo
  degli incantesimi degli Araldi (`isAraldiSpell`) chiamava `s.id?.startsWith(...)`, ma
  gli incantesimi delle schede più vecchie hanno un id numerico e la scheda andava in
  errore all'apertura. Ora l'id viene letto come testo (`String(s.id ?? '')`).
  Test e2e con incantesimi a id numerico.
- **CI di nuovo verde** (era rossa dalla 4.95.0, per cui il sito non si aggiornava da
  solo): il colore "cuoio" degli Araldi nel tema chiaro (`--c-araldi`) passa da
  `#8c4a1e` a `#6e3612`, perché sugli sfondi chiari delle ambientazioni non arrivava al
  contrasto minimo 4.5:1; il test della build controlla la scheda senza errori invece
  della versione, che ora compare solo nel menu iniziale.

## [4.95.3] – 2026-10-11

### Cambiato
- Versione dell'app rimossa dalla barra superiore/intestazione e visibile unicamente nel menu iniziale (Home) con font coerente e allineamento ribassato.
- Supporto manuale homebrew Araldi del Segreto con palette in cuoio antico, mezza scheda evocazioni e token originali nel Combat Tracker.

## [4.95.2] – 2026-10-09

### Cambiato
- Ripristinati i fondi quasi neri delle sezioni nel tema scuro, mantenendo il colore della classe su titoli, bordi e controlli. Tema chiaro invariato.
- Verificata la leggibilità degli accenti anche sui pulsanti con fondo ambrato.

## [4.95.1] – 2026-10-09

### Corretto
- Tipo di azione e distanza visibili direttamente nelle righe di Azioni, Azioni Bonus e Reazioni, anche su mobile.
- Forma Bestiale e Forma Selvatica riconosciute come lo stesso contatore del Druido, conservando gli utilizzi spesi e il recupero corretto per edizione.

## [4.95.0] – 2026-10-08

### Cambiato
- **Colore della classe**: fondi e bordi dei riquadri hanno una tinta più riconoscibile sia di giorno sia di notte.
- **Titoli e statistiche**: usano il colore della classe anche al passaggio del mouse, anziché tornare al testo neutro.

## [4.94.1] – 2026-10-08

### Cambiato
- **Colore della classe più presente**: diventa l'accento dei titoli, dei controlli
  principali e delle cornici della scheda; i fondi rimangono sobri e leggibili.
- **Menu iniziale**: in cima compare subito l'ultimo personaggio usato, con ritratto,
  classe e livello, per riprendere rapidamente la scheda giusta.

## [4.94.0] – 2026-10-08

### Cambiato
- **Menu iniziale ben distinguibile dalla scheda**: sfondo più scuro e sfocato, pannello
  più chiaro del fondo (miscela di `--c-panel-light` e inchiostro), bordo più marcato e
  ombra profonda; i pulsanti restano a contrasto con il pannello sia in scuro sia in
  chiaro. Prima il pannello (#0e0e11) si confondeva con la scheda scura dietro.

## [4.93.0] – 2026-10-07

### Cambiato
- **Versione nell'intestazione** un po' più in alto: ora poggia sulla stessa linea di
  base di "Tavolo dei Dadi" (prima era abbassata di 2 px).

## [4.92.0] – 2026-10-07

### Cambiato
- **Incantesimi: tornano i chip colorati** come prima della 4.79.0 e come nelle
  Azioni (stessi colori e stesso ordine): tempo di lancio, distanza, area,
  Concentrazione, Rituale, nota e **scuola di magia** (chip a parte). Il testo
  semplice della 4.91.0 è tolto; il dettaglio resta nella nuvoletta del nome.
- **Avvio**: di base all'apertura si mostra il menu iniziale con il selettore dei
  personaggi, invece di caricare l'ultima scheda (utile aprendo da più dispositivi,
  dove "l'ultima" può essere rimasta indietro). Nel menu c'è la casella "All'avvio
  apri subito l'ultima scheda" per chi preferisce il comportamento di prima
  (`CHIAVE_AVVIO_DIRETTO`, `src/utils/avvio.js`).
- **Versione nell'intestazione**: cifre allineate sulla stessa riga (niente numeri
  "a onde" del Georgia), sulla linea di base del titolo, un po' più in basso e
  attaccata alla scritta "Tavolo dei Dadi".

## [4.91.0] – 2026-10-07

### Cambiato
- **Via i bordi gialli** da nome del personaggio, ritratto, barra dei PF, pulsante
  Riposo Lungo e pulsanti "✨ +n" dei bonus ai tiri salvezza; in Risorse di classe
  il nome di Forma Selvatica è neutro come gli altri. Restano i bordi neutri del tema.
- **Righe degli incantesimi**: tornano le informazioni a colpo d'occhio, come testo
  semplice e piccolo accanto al nome (tempo di lancio · distanza · area · durata ·
  Conc. · Rit.), senza riquadri colorati; il dettaglio resta nella nuvoletta del nome.
  Nella 4.79.0 erano finite solo nella nuvoletta.

## [4.90.0] – 2026-10-07

### Corretto
- **Myrdhal nel catalogo rapido** di "Compagni, famigli ed evocazioni": con il
  manuale Araldi del Segreto attivo compare per primo (prima il catalogo mostrava
  solo 16 creature senza di lui, e il conteggio non lo includeva).

## [4.89.0] – 2026-10-07

### Corretto
- **Myrdhal non prende i bonus di classe dell'evocatore**: l'Evocatore Possente
  di Vaelion (+2 PF per dado vita) lo portava a 250 PF. Le creature dei manuali di
  campagna (`manuale` nel catalogo) hanno ora un blocco fisso, in
  `calcolaPfCompagno`: 210 PF. Un Myrdhal già evocato con 250 PF torna a 210.
  Le altre evocazioni continuano a ricevere l'Evocatore Possente.

## [4.88.0] – 2026-10-07

### Aggiunto
- **"Questa è la versione giusta: sostituisci quella online"** (Sincronizzazione):
  carica su codice la copia di questo dispositivo senza confronti, anche se
  online c'è una copia che sembra più recente. La copia online sostituita va
  prima in Cronologia versioni; gli altri dispositivi la ricevono da soli. Serve
  per riallineare tutto partendo dal dispositivo che ha i dati giusti.
- **Lista ampliata del manuale Araldi fra gli incantesimi conosciuti**
  (`src/data/incantesimiAraldi.js`): i 10 incantesimi dei cerchi 1-5 entrano
  nella scheda, solo per i cerchi già sbloccati, segnati "bonus" (non contano nei
  limiti di classe) con la nota su Segreti e Debito. Si aggiungono da soli una
  volta per personaggio che usa gli Araldi; il pannello Araldi ha il pulsante
  "Aggiungi gli incantesimi del manuale ai conosciuti" per rimettere quelli
  mancanti.
- Il manuale Araldi del Segreto si accende da solo una volta sui dispositivi
  dove un personaggio ha i poteri degli Araldi, anche con "Ripristina i Poteri della campagna" (poi si può spegnere).
- Nuovi incantesimi nel catalogo: Chiaroveggenza, Occhio Arcano, Localizza
  Creatura, Storia Leggendaria; alias "Charme su persone" e "Camuffare sé stessi".
- La finestra di conferma può avere un'etichetta propria per il pulsante.

## [4.87.0] – 2026-10-07

### Aggiunto
- **Myrdhal come creatura evocabile** (`EVOCAZIONI_ARALDI` in
  `src/data/bestiario.js`): blocco completo dal manuale Araldi del Segreto 1.1
  (CA 20, 210 PF, caratteristiche, tratti, Lama del Vuoto, Dardo di Terrore,
  Sguardo Atterrente, incantesimi innati, Passo d'Ombra, azioni leggendarie).
  Compare in "Evoca / Aggiungi Compagno" (Tutti ed Evocazioni) **solo con il
  manuale Araldi del Segreto attivo**: spegnendo il manuale sparisce dal
  catalogo, mentre quello già evocato resta sulla scheda.

## [4.86.0] – 2026-10-07

### Cambiato
- **Manuale Araldi del Segreto aggiornato alla versione Player 1.1**
  (`src/data/modelliPoteri.js`): la Veglia (Debito 70) ora dà "Vista Pura 9 m"
  al posto di "Truesight 9 m"; "Messaggio" con la maiuscola; il Mercato ha il
  testo completo del manuale; nuova spesa di Segreti **Myrdhal** (10 Segreti,
  anche di gruppo: "Evocate Myrdhal per 1d6 turni").
- Nel pannello Araldi, fra "Spendere i Segreti": pulsante **Myrdhal (−10)**,
  attivo con almeno 10 Segreti, e **Segreto per Myrdhal (−1)** per mettere un
  Segreto nel fondo comune del gruppo.
- I poteri degli Araldi già sulle schede si aggiornano da soli ai testi nuovi
  (`aggiornaTestiAraldi`): solo se portano ancora le vecchie diciture, le
  descrizioni modificate a mano non si toccano.
- Manuali e fonti: l'elenco indica "Player 1.1".

## [4.85.0] – 2026-10-07

### Corretto
- **Tasto della sincronizzazione**: diventa arancione appena modifichi la scheda
  e resta arancione finché le modifiche non sono online (il salvataggio
  automatico parte 10 secondi dopo l'ultima modifica), poi torna verde. Prima
  diventava arancione solo per l'istante dell'invio e non si notava. Stato
  `inAttesaSync` (impronta del roster diversa dalla base dei canali attivi),
  attributo `data-in-attesa` sui tasti della barra.

## [4.84.0] – 2026-10-07

### Corretto
- **Una copia online vecchia non cancella più le modifiche recenti**
  (`decidiSync`, politica `recente`): nei conflitti di sincronizzazione vince la
  modifica fatta per ultima. Ogni dispositivo ricorda l'ora dell'ultima modifica
  fatta a mano (solo cambi subito dopo un tocco o un tasto: caricamenti e
  automatismi all'avvio non contano); se è più recente della copia online
  vincono i campi di qui, altrimenti quelli online. La copia che perde va in
  Cronologia versioni. Prima vinceva sempre l'online: un dispositivo rimasto
  indietro poteva riportare PF, slot e risorse di giorni prima.
- **Worker**: un salvataggio senza `baseUpdatedAt` (app vecchie rimaste aperte)
  non sovrascrive più una copia esistente (409).

### Aggiunto
- **Storico online** (Worker, `sync-storia:<codice>`): la copia sostituita entra
  nello storico (senza immagini) al massimo ogni 15 minuti; si tengono una copia
  ogni 15 minuti per 3 ore, ogni 3 ore per 2 giorni, una al giorno per 2
  settimane. `GET /sync/<codice>/storia`; in app: Cronologia versioni → "Mostra
  le copie online". Serve il redeploy del Worker.
- **Cronologia versioni più lunga** (`src/utils/cronologia.js`): le ultime 10,
  poi una all'ora per 2 giorni e una al giorno per 2 settimane; le copie salvate
  prima di una sincronizzazione restano 30 giorni. Ogni voce mostra PF e slot
  rimasti dei personaggi e il motivo.
- **Poteri della campagna incompleti**: "Ripristina i Poteri della campagna"
  compare anche quando c'è solo il Debito; unisce i poteri tenendo il valore
  attuale dei contatori. "Recupera i Poteri dalla cronologia" compare quando una
  copia salvata ha più poteri di quelli attuali.

## [4.83.0] – 2026-10-07

### Aggiunto
- **Ripristino dei Poteri della campagna** (`src/data/poteriCampagna.js`): se il
  personaggio non ha Poteri, il riquadro Poteri (sotto Risorse di classe) e la
  sezione Poteri mostrano "Ripristina i Poteri della campagna". Rimette il
  Potere del Patrono (contatore Debito, Velocità +3 m dalla Maschera) e tutti i
  poteri del modello Araldi del Segreto (Segreti, soglie, Occhio Risvegliato,
  Veglia, Affabilità, Inquisire, Trasferire Empatico, Braccare!) con un solo
  Debito condiviso, e attiva il manuale di campagna se era spento. Resta anche
  il recupero dalla Cronologia versioni quando ne esiste una copia.

## [4.82.0] – 2026-10-07

### Corretto
- **Limite giornaliero di Cloudflare KV**: il piano gratuito ammette 1.000
  scritture al giorno. Il limite di richieste del Worker (senza il binding
  `ROOM_RATE_LIMITER`) teneva il contatore su KV, quindi OGNI richiesta, anche
  una semplice lettura della sincronizzazione, costava una scrittura; con il
  controllo ogni 45 s introdotto nella 4.77.0 due dispositivi aperti
  arrivavano al 50% in poche ore.
  - Worker: contatore del limite in memoria dell'istanza (nessuna operazione KV);
    il PUT di `/sync` legge il valore esistente una volta sola invece di due.
    **Richiede di ripubblicare il Worker** (`cd worker && npx wrangler deploy`).
  - App: controllo periodico della copia online ogni 10 minuti (non 45 s) e al
    ritorno sull'app al massimo una volta al minuto; salvataggio automatico a
    codice 10 s dopo l'ultima modifica (una raffica di clic = un salvataggio);
    deposito nell'Archivio DM 3 minuti dopo l'ultima modifica (prima 45 s).
  - Se all'avvio il caricamento della copia online coincide con una modifica
    automatica della scheda, si riprova dopo 1,5 s (massimo 3 volte al minuto)
    invece di aspettare il salvataggio successivo.
- Test: il limite di richieste del Worker non scrive su KV.

## [4.81.0] – 2026-10-06

### Aggiunto
- **Nuvolette delle risorse di classe**: il nome di ogni risorsa apre la
  nuvoletta unica con usi, ricarica (breve / 1 uso con breve / lungo / a mano) e
  spiegazione. `spiegazioneRisorsaScheda` la cerca nelle spiegazioni note, poi
  nelle righe "Nome: descrizione" di tratti e privilegi della scheda, nella nota
  di un attacco omonimo e nell'incantesimo con lo stesso nome ("Paura (3/giorno)").
  Forma Selvatica tiene il catalogo sul nome e ha un "?" per la spiegazione.
- **Recupero dei Poteri**: il riquadro Poteri sotto Risorse di classe è sempre
  visibile; se il personaggio non ha più Poteri ma la Cronologia versioni ne ha
  una copia, un pulsante li ripristina (con i valori dei contatori).

### Corretto
- **Poteri persi collegando un dispositivo**: con "Usa codice" la copia online
  sostituiva i personaggi locali con lo stesso id; se online i Poteri mancavano,
  sparivano anche qui. Ora quelli locali restano (e poi vengono inviati).
- Tolti i menu "Aggiungi…" (barre bianche) sotto ogni livello di incantesimi:
  compaiono solo, in verde, quando mancano incantesimi da scegliere.
- La sezione **Compagni, famigli ed evocazioni** compare solo a chi può averne
  (`puoAvereCompagni`): compagni già presenti, incantesimi di evocazione/famiglio,
  Patto della Catena, Ranger con compagno, Artefice, Druido 2024 (Compagno
  Selvatico), Paladino 2024 dal 5° (Destriero Fedele), privilegi che parlano di
  famiglio, compagno animale o destriero.

## [4.80.0] – 2026-10-06

### Corretto
- **Classi non riconosciute** (mostri trasformati in personaggio, es. il Myrdhal):
  `calcolaFormulaDadiVita` non inventa più dei d8 per una classe sconosciuta
  senza multiclasse; resta il dado vita della scheda (es. 20d10), anche al
  caricamento, al cambio classe e al passaggio di livello.
- Le azioni senza danno e con bonus 0 (es. Sguardo Atterrente, Passo d'Ombra)
  non mostrano più il badge "Attacco +0" in nessuna sezione del Combattimento.

## [4.79.0] – 2026-10-06

### Cambiato
- **Nuvoletta unica dei dettagli** (`testoNuvoletta`, `riassumiDescrizione`):
  in Combattimento (Azioni, Azioni Bonus, Reazioni) e nelle righe degli
  Incantesimi niente più chip descrittivi (tempo, distanza, area, durata,
  concentrazione, rituale, scuola, proprietà, note) né suggerimenti al
  passaggio del mouse: la riga mostra nome, tiri e pulsanti d'uso. Il tocco sul
  nome apre la stessa nuvoletta ovunque: righe essenziali (azione / tempo di
  lancio, distanza, area, durata, concentrazione, rituale, attacco o CD, danno,
  proprietà, munizioni, impugnatura) e poi al massimo due frasi di descrizione.
- Reazioni senza danno (es. Totem Spirituale) non mostrano più "Attacco +0".

### Corretto
- **Riposo breve**: l'elenco "Ricarica automatica" leggeva un campo inesistente
  (`ricarica`) e diceva sempre "Nessuna risorsa"; ora usa `reset` e segna
  "+1 uso" per le risorse 2024 che recuperano un solo uso (Forma Selvatica, Ira,
  Recuperare Energie, Incanalare Divinità). Il recupero vero era già corretto.
- **Privilegi a usi limitati mancanti** in `risorseAutoClasse`: Senso Divino
  (Paladino 2014, 1 + CAR, lungo), Astuzia Magica (Warlock 2024, 2°, lungo; il
  Contatto Mistico resta per la 2014), Metabolismo Prodigioso (Monaco 2024),
  Ripristino Stregonesco (Stregone 2024, 5°), Intervento Divino (Chierico 2024,
  10°), Instancabile e Velo della Natura (Ranger 2024, 10° e 14°, SAG usi), con
  le loro spiegazioni.

## [4.78.0] – 2026-10-06

### Cambiato
- **Reazioni senza riquadri colorati**: tolti i chip di Innesco ed Effetto (e
  quello "Reazione", già detto dal titolo). La riga mostra icona, nome, tiri e
  "Usa". Tocco sul nome o sull'icona → nuvoletta con l'essenziale: tipo di
  azione, distanza (anche la portata in mischia di 1,5 m dell'Attacco di
  Opportunità), durata e concentrazione, innesco, effetto, attacco o CD, danno,
  munizioni, più due frasi di descrizione quando non c'è innesco/effetto.
- **Niente rinomina**: in Combattimento (Azioni, Azioni Bonus, Reazioni) il
  nome è un pulsante che apre la nuvoletta, non un campo; tolti anche i campi
  liberi di danno e nota. Nell'inventario il nome dell'oggetto non si modifica
  (tocco = descrizione); le risorse di classe hanno il nome fisso. Restano
  scrivibili solo i nomi delle cose create a mano (Poteri homebrew, nemici del
  tracker di combattimento).

## [4.77.0] – 2026-10-06

### Cambiato
- **Nessuna finestra di conflitto: vince l'ultima versione online.** Nuova
  politica `POLITICA_SYNC = 'online'` passata a `decidiSync`: quando lo stesso
  campo è cambiato su due dispositivi, `unisciTreVie(..., { vince: 'remoto' })`
  tiene il valore online e conserva le altre modifiche locali (che poi vengono
  inviate); senza il contenuto della base (dispositivi aggiornati da versioni
  vecchie) si carica la versione online. Prima di ogni sostituzione la copia
  locale finisce in Cronologia versioni. Un personaggio eliminato da una parte
  e modificato dall'altra si tiene (meglio uno in più che uno perso).
- Se un altro dispositivo salva nello stesso istante (409 dal Worker) si
  rilegge e si riprova da soli (massimo 3 volte di fila).
- Controllo della copia online più frequente: al ritorno sull'app ogni 10 s al
  massimo (prima 30 s) e ogni 45 s con l'app aperta in primo piano.
- La finestra di conflitto e `decidiSync` con politica `chiedi` restano nel
  codice (e nei test unitari) se un giorno si volesse tornare a chiedere.

## [4.76.0] – 2026-10-06

### Corretto
- **iPhone fermo sulla versione vecchia**: quando `version.json` annunciava una
  build nuova, l'app ricaricava subito, spesso prima che il nuovo service
  worker fosse attivo, e Safari ripresentava la pagina dalla cache. Ora
  `forzaAggiornamento` chiede al browser il nuovo worker
  (`attendiNuovoServiceWorker`) e aspetta il `controllerchange` (max 8 s) prima
  di ricaricare. Al terzo tentativo per la stessa versione svuota solo le cache
  del service worker e lo deregistra (`svuotaCacheProgramma`): personaggi,
  immagini e impostazioni non si toccano. Dopo tre tentativi automatici si
  ferma: niente ricariche infinite.
- Test sulla build di produzione: con una versione annunciata che non arriva
  mai, la pagina prova ad aggiornarsi e poi smette (al massimo 3 ricariche).

## [4.75.0] – 2026-10-06

### Corretto
- **Ritratti e mappe non si sincronizzavano**: l'impronta usata per capire se
  qualcosa è cambiato escludeva le immagini, quindi un ritratto nuovo non veniva
  mai inviato e l'altro dispositivo non lo scaricava. Ora `improntaRoster`
  include un'impronta breve di ogni immagine (calcolata una volta e ricordata).
  Le basi salvate dalle versioni precedenti (senza contenuto) restano
  riconosciute con `improntaRosterSenzaImmagini`, senza falsi conflitti.
- Dopo aver caricato la copia online la base è esattamente quella copia: se qui
  resta un'immagine che online manca, viene inviata al salvataggio successivo.

### Aggiunto
- **Unione automatica a tre vie** (`unisciTreVie`, `contenutoBase`): la base
  conserva anche il contenuto della versione online (senza immagini, con le loro
  impronte). Se i due dispositivi hanno cambiato campi diversi della scheda le
  modifiche si sommano da sole (nuova azione `unisci` di `decidiSync`); la
  finestra di conflitto resta solo quando lo stesso campo è cambiato in modo
  diverso da entrambe le parti. Evita i falsi conflitti dovuti ai ritocchi
  automatici che l'app fa alle schede appena scaricate.
- Test: unit per impronta con immagini, basi vecchie, unione a tre vie;
  e2e "un ritratto nuovo caricato su un dispositivo arriva anche sull'altro".

## [4.74.0] – 2026-10-06

### Corretto
- **Mancava il pulsante per creare il codice di sincronizzazione**: la funzione
  `creaCodiceSync` esisteva ma nessun pulsante la chiamava, quindi due
  dispositivi non si potevano collegare se non si aveva già un codice. La scheda
  Online ora guida in due passi: "Crea un codice e salva online questi
  personaggi" sul dispositivo con la scheda giusta, poi inserire lo stesso
  codice sull'altro. Se il codice era stato disattivato c'è "Riattiva il codice".

### Aggiunto
- Su telefono, icona della sincronizzazione nella barra in alto (stessi colori
  di stato del desktop): apre direttamente la scheda Online.
- La finestra si apre sulla scheda Online quando la sincronizzazione non è
  ancora configurata (pulsante nuvola e avviso "Attiva la sincronizzazione").
- Test e2e `collega-dispositivi.spec.js`: due dispositivi simulati, il primo crea
  il codice, il secondo lo inserisce e riceve la scheda giusta.

## [4.73.0] – 2026-10-06

### Cambiato
- **Colore della classe a tocchi**: la base resta generica (oro e neutri per
  testi, bordi, pulsanti), mentre il colore della classe torna come accento su
  titoli delle sezioni e dell'app, nome del personaggio (`--c-title`), angoli
  decorati (nuova variabile `--c-classe`) e alone leggero attorno alle sezioni
  e ai margini. Rispetta la scelta "Cornici" (classe fissa o disattivato) e il
  contrasto minimo automatico dei titoli.

## [4.72.0] – 2026-10-06

### Aggiunto
- **Riquadro Poteri sotto Risorse di classe** (`src/ui/PoteriRisorse.jsx`): i
  contatori dei Poteri in gioco (Segreti, Debito, usi dei privilegi degli
  Araldi o di qualsiasi potere) tornano nella colonna sinistra, in un riquadro
  separato dalle risorse di classe, una riga per contatore: perle per gli usi
  (un tocco = usa, con il Debito del manuale; tocco su una perla spenta =
  ripristina), − / + per i contatori senza massimo, prossima soglia del Debito.
  Nuova funzione `contatoriInGioco` in `src/rules/poteri.js`.
- **Pannello Araldi**: soglie del Debito in elenco con il loro effetto (quelle
  raggiunte evidenziate), barra di avanzamento verso la prossima soglia,
  Segreti come rombi pieni/vuoti, Segreti e Debito scrivibili a mano, azioni
  del manuale accanto ai privilegi (Inquisire → Cervello +1 Segreto,
  Trasferire Empatico → Nemico ucciso +1 Segreto, Braccare! → Ora in più −1 e
  Teletrasporto −3), suggerimento su come ottenere Segreti quando sono 0.
- Sezione Poteri: titolo con lo stesso stile degli altri riquadri, gruppi
  "Araldi del Segreto" / "Altri poteri"; nelle schede degli altri poteri
  Segreti e Debito compaiono in sola lettura (si gestiscono nel pannello), così
  non sono più duplicati.

### Cambiato
- **Un solo tema**: né la classe né l'ambientazione ricolorano più testi, bordi,
  titoli e pulsanti. L'ambientazione cambia scena (immagine e luci ai margini) e
  audio; la classe resta riconoscibile dalla forma degli angoli delle sezioni,
  ora sempre nel colore del tema (maschere CSS invece di SVG colorati). Il
  riquadro del ritratto usa lo sfondo del pannello.
- Il contrasto minimo automatico vale anche per oro, oro scuro e titoli.
- Tolto il filetto doppio sotto la barra superiore.
- Griglia del profilo: la colonna sinistra occupa anche una seconda riga
  elastica, così un riquadro Poteri lungo non stira i riquadri dei PF e delle
  caratteristiche.

## [4.71.0] – 2026-10-06

### Manutenzione
- **Altre 11 finestre fuori da App.jsx** (`src/ui/modali/`): Avvisi e novità,
  Atmosfera e audio, Importa ed esporta, Menu dei personaggi, Menu e strumenti
  su telefono, Guida di benvenuto, Note legali, Sostieni il progetto, Versioni
  precedenti, Scelta della versione, Privilegi di sottoclasse. `App.jsx` scende
  a ~17.400 righe (da ~21.500). Nessun cambiamento visibile.
- Nuovo `src/utils/ambiente.js` con gli indirizzi dei servizi online, l'ordine
  delle ambientazioni e gli aiuti `iconaAmbientazione` / `nuovoId`.
- `e2e/finestre.spec.js` ora copre 18 finestre (anche menu, note legali,
  donazioni, cronologia versioni, tutorial e menu del telefono).

## [4.70.0] – 2026-10-06

### Manutenzione
- **App.jsx più piccolo**: 13 finestre (Tavolo dei dadi, Diario, Ispirazione e
  background, Aggiungi compagno, Ritratto della bestia, Manuali e fonti, Guida
  delle abilità, Inneschi e reazioni, Movimento, Esperienza, Sincronizzazione,
  Concentrazione, Dettaglio creatura) sono state spostate in `src/ui/modali/`,
  una per file. Il file principale passa da ~21.500 a ~18.800 righe. Nessun
  cambiamento visibile.
- Nuovo `src/utils/idUnici.js` per generare identificativi fuori dal rendering.
- Nuovo test `e2e/finestre.spec.js`: apre ognuna delle finestre estratte e
  verifica che non si generino errori JavaScript.

## [4.69.0] – 2026-10-06

### Accessibilità
- **Intestazioni cliccabili senza pulsanti annidati**: le 7 intestazioni che
  contenevano altri pulsanti (livelli degli incantesimi con i bollini degli
  slot, Trucchetti, ritratto) ora hanno il ruolo "pulsante" solo sull'etichetta
  (con `aria-expanded`); il clic sull'intera riga funziona come prima. Il
  ritratto ha un vero pulsante nascosto "Cambia il ritratto" per tastiera e
  screen reader (`.solo-sr`).
- L'area scorrevole dei chip di un incantesimo (telefono) è raggiungibile da
  tastiera. Il testo del pulsante Menu e degli altri pulsanti dorati segue
  `--c-on-gold`.
- Il test axe-core ora controlla anche i controlli annidati e un'esecuzione
  con schermo da telefono (390 px): 15 test, zero violazioni.

## [4.68.0] – 2026-10-06

### Accessibilità (misurata con axe-core, WCAG 2 AA)
- **Contrasto dei testi**: prima 600–700 testi per schermata sotto la soglia di
  leggibilità (4,5:1), soprattutto chip di gittata/tempo/scuola e righe
  incantesimo "non preparate". Ora **zero violazioni** in tema chiaro e scuro,
  con tutte le ambientazioni provate.
  - Palette dei chip (`scheda.js`) ricalcolata per avere almeno 5,6:1 sul chip
    stesso (nel tema chiaro i verdi, ambra, blu e rossi erano troppo chiari).
  - Gli incantesimi non preparati non sono più "sbiaditi" (opacità 0,5, che
    abbassava il contrasto di ogni chip) ma hanno il bordo tratteggiato; stessa
    cosa per le abilità/TS non competenti (testo attenuato invece di opacità).
  - `--c-ink-dim`, verde e rosso del tema sono garantiti leggibili su tutti gli
    sfondi: se un'ambientazione o la tinta della classe li renderebbe troppo
    tenui, vengono scuriti/schiariti da soli (`garantisciContrastoTema`). Il
    testo sui pulsanti dorati sceglie da solo bianco o nero (`--c-on-gold`):
    dopo l'attenuazione della tinta di classe (4.64) il bianco su accento
    chiaro non si leggeva.
- **Campi a tendina senza nome** (12 sulla scheda: personaggio attivo, tipo di
  armatura, "Aggiungi incantesimo" per livello, effetto e ricarica degli
  oggetti): ora hanno `aria-label`.
- Nuovo test e2e `accessibilita.spec.js` (axe-core): 14 combinazioni
  tema × ambientazione (le più tenui) senza violazioni di contrasto, nomi dei
  campi, pulsanti senza nome.
- Resta da fare: 7 intestazioni cliccabili che contengono altri pulsanti
  (ritratto, titoli di sezione, livelli incantesimi), che per gli screen reader
  sono "interattivi annidati".

## [4.67.0] – 2026-10-06

### Sicurezza (Worker + app)
- **Archivio del Master: limite di richieste sulle scritture aperte** (`POST /pg`
  e la cancellazione della propria copia): 30 al minuto per IP senza il binding
  nativo (best-effort sul KV), il limite configurato con `ROOM_RATE_LIMITER`
  con il binding. Prima chiunque conoscesse l'indirizzo poteva riempire il KV
  e consumare la quota di scritture giornaliera (1000 sul piano gratuito).
- **La chiave DM viaggia nell'header** `x-dm-key` e non più nell'indirizzo
  (`?key=…` finiva nei log del server e nella cronologia). Il Worker accetta
  ancora l'indirizzo per le app già installate. Confronto della chiave a tempo
  costante.
- Test del Worker per archivio, limite e chiavi (`archivio-worker.test.mjs`).
- **Da fare a mano su Cloudflare**: ripubblicare il Worker (`wrangler deploy`)
  per attivare il limite; vedi `worker/LEGGIMI.md`. L'app funziona anche prima.

## [4.66.0] – 2026-10-06

### Cambiato
- **Avvio più leggero**: le spiegazioni in inglese (~200 KB, 58 KB compressi)
  non fanno più parte del caricamento iniziale: il file
  `spiegazioni.en` si scarica solo quando l'interfaccia è in inglese (e
  viene messo in cache per l'uso offline). Chi usa l'italiano scarica l'8% di
  JavaScript in meno (data5e: 247 → 190 KB compressi). Nuova
  `caricaSpiegazioniEn()` in `spiegazioni.js`; finché non è pronta valgono i
  testi italiani, poi l'app si ridisegna da sola. Test e2e: l'italiano non
  scarica il file, l'inglese mostra le spiegazioni inglesi.

## [4.65.0] – 2026-10-06

### Aggiunto (test e CI, nessun cambio per chi usa l'app)
- **Test end-to-end sulla build di produzione** (`e2e-build/pwa.spec.js`,
  `playwright.build.config.js`, `npm run test:e2e:build`): versione mostrata =
  versione del codice, `version.json` presente, service worker installato che
  prende il controllo, app che si riapre **offline**, nessun errore JS
  all'avvio. Parte in CI dopo la suite principale. Prima nessun test copriva la
  PWA vera (i test giravano solo sul server di sviluppo).

### Cambiato
- Suite e2e principale: limite di 45 s per test e di 12 minuti in totale in CI
  (con report), invece di bloccarsi fino ai 15 minuti del job e venire
  annullata senza spiegazioni; `apriScheda()` attende l'app e il benvenuto
  invece di tempi fissi (da 5 attese a 1).

## [4.64.0] – 2026-10-06

### Cambiato
- **Colore della classe meno marcato**: la tinta della classe pesa ora la metà
  (`INTENSITA_CLASSE = 0.5` in `App.jsx`, un solo numero da regolare: 1 =
  vecchia intensità). Sfondi, bordi, aloni e il segnaposto del ritratto sono
  più discreti; i colori di titoli e accenti sono attenuati verso il colore
  del testo, quindi restano riconoscibili ma non gridano. Il codice che applica
  la tinta, prima duplicato in due punti, è una sola funzione
  (`applicaTintaClasse`).

### Corretto
- **Riposo breve nelle regole 2024** per Ira (Barbaro), Recuperare Energie
  (Guerriero) e Incanalare Divinità (Chierico e Paladino): restituisce **un
  solo uso**, il riposo lungo tutti (prima tornavano tutti con il riposo
  breve; Paladino 2014 si ricaricava solo con il lungo). Nella 2014 restano:
  Ira solo a riposo lungo, gli altri interi con breve o lungo.
- **Incanalare Divinità**: Chierico 2024 arriva a 4 usi al 18° (prima 3);
  Paladino 2014 ha 1 uso (prima 2 dal 18°), che torna con riposo breve o lungo.
  Spiegazioni delle risorse allineate.
- `risorseAutoClasse` spostata in `regole.js` ed esportata: ora le risorse di
  classe per edizione hanno un test unitario.

## [4.63.0] – 2026-10-05

### Cambiato
- **Araldi del Segreto nel formato "Panoramica dei privilegi"**: i privilegi
  sono righe per livello (Liv. 1, 6, 10, 14) con il nome sottolineato
  (un tocco apre la spiegazione), gli usi come perle, Usa / Recupera sulla
  stessa riga, e i livelli non ancora raggiunti sbiaditi con
  "— non ancora raggiunto", come nella panoramica dei privilegi di classe.
- I poteri degli Araldi aggiunti con una versione precedente si portano
  **da soli** alla versione attuale (livelli, condizione automatica del
  Debito, ricariche, massimi) e mostrano il pannello anche se il manuale di
  campagna è spento: il manuale controlla solo la disponibilità del modello
  "Da modello", non i poteri già sulla scheda.

### Corretto
- **Segreti e Debito senza totale**: i contatori senza massimo accettano
  qualsiasi numero scritto a mano (es. 1000) e il + non si blocca; non serve
  più impostare un totale. (Il blocco veniva dall'elenco Risorse di classe,
  da cui i contatori dei Poteri sono usciti nella 4.61.0.) Aggiunti test.

## [4.62.0] – 2026-10-05

### Cambiato
- **Rituale** ha ora un colore suo (viola: #6d28d9 chiaro, #a78bfa scuro):
  prima condivideva il fucsia della Concentrazione, quindi due chip diversi
  sembravano lo stesso. Il test sulla palette verifica che Concentrazione e
  Rituale siano diversi tra loro e da ogni altra categoria.
- **Riquadri statistica** (CA, Riposo, Bonus di competenza, Iniziativa,
  Velocità, Sfinimento, Visione, Percezione passiva, Resistenze, Condizioni):
  tolto il **doppio bordo**, ora hanno un solo bordo luminoso (il filetto
  interno resta solo sulle sezioni grandi).

## [4.61.0] – 2026-10-05

### Cambiato
- **Poteri separati da Risorse di classe**: i contatori dei Poteri (Segreti,
  Debito, usi dei privilegi...) non compaiono più nell'elenco "Risorse di
  classe", che torna a contenere solo le risorse di classe (Forma Selvatica,
  Totem Spirituale...). Vivono nella sezione Poteri; riposi e ripristini
  continuano a funzionare. Le schede dei poteri generici hanno ora i pulsanti
  − / + sui contatori; nel pannello Araldi il nome del privilegio spiega cosa
  fa al passaggio del mouse.
- **Colori dei testi uniformati**: verdi (#2e9d4d, #10b981, #2e7d32, #2e8b57) e
  rossi (#ef4444, #c0392b, #b03a2e, #d32f2f) scritti a mano in 131 punti
  dell'app usano ora gli stessi colori del tema (`C.green`, `C.red`), quindi
  seguono tema chiaro/scuro e ambientazione. Restano com'erano gli sfondi pieni
  con testo bianco, le barre dei PF e i colori delle condizioni.

## [4.60.0] – 2026-10-05

### Aggiunto
- **Pannello Araldi del Segreto** (compare nei Poteri con il manuale di campagna
  attivo e i suoi poteri sulla scheda), pensato per giocare al tavolo:
  - **Segreti e Debito** con − / + (massimo Segreti = il doppio della
    competenza, calcolato da solo);
  - **Soglie del Debito** (5, 15, 35, 70, 150) che si accendono da sole, con la
    prossima soglia e quanto manca; il **+1 CA di Occhio Risvegliato scatta
    automaticamente a Debito 15** (e Veglia a 70);
  - **Spendere i Segreti**: Aprire, Leva, Mercato e Incantare con i segreti
    (cerchio e incantesimo della lista ampliata, costo = cerchio, +1 Debito),
    con voce nel registro;
  - **Privilegi per livello** (1°, 6°, 10°, 14°) con lucchetto finché non si
    sbloccano, **perle cliccabili** per gli usi (una perla piena = usa, una
    spenta = ripristina), Debito aggiunto in automatico (Inquisire +1,
    Trasferire Empatico +2, Braccare! +1), Recupera con Segreti, dettagli
    comprimibili e "Modifica".
- **Poteri più potenti** (valgono per qualsiasi potere homebrew): contatore con
  massimo calcolato dalla competenza (1× o 2×), ricarica con riposo breve o
  lungo, e potere con **condizione automatica** su un contatore ("si applica
  solo se Debito ≥ 15"). Nuovi campi nell'editor del potere.
- "Da modello" riusa un contatore già presente (es. il Debito del proprio
  Potere del Patrono) invece di crearne un secondo, e "Aggiorna al nuovo
  modello" porta a questa versione i poteri degli Araldi aggiunti prima.

### Corretto
- Modificare "attuali" di un contatore dall'editor del potere ora cambia davvero
  anche la risorsa collegata (prima restava il valore vecchio); l'editor
  mostra il valore reale della risorsa.
- **Colori delle Reazioni** unificati sulla palette dei chip: "Disponibile" e
  "Usa" nel verde "quando" (non più un verde diverso), "Usata" in neutro (il
  rosso resta per i danni), "Inneschi e reazioni" neutro invece che oro, e
  niente più pallini 🟢/🔴 colorati.

## [4.59.0] – 2026-10-05

### Aggiunto
- **Manuale di campagna "Araldi del Segreto"** (🗝️, codice "Campagna") nel
  pannello Manuali e fonti: contenuto del solo tavolo, **spento di base** per
  tutti i personaggi. Si attiva a mano; finché è spento il modello degli
  Araldi non compare nei Poteri. Lo stato dei manuali viaggia con la
  sincronizzazione delle preferenze. Nuovo `manualeAttivo()` in `dati5e.js`
  per i manuali spenti di base; i preset rapidi non lo accendono né lo
  spengono. I poteri già aggiunti restano sul personaggio anche se il manuale
  viene spento.
- **Poteri comprimibili**: un clic sul titolo "Poteri" chiude la sezione
  (resta il numero dei poteri e il pulsante si riapre con un clic); la scelta
  si ricorda su questo dispositivo.

## [4.58.0] – 2026-10-05

### Aggiunto
- **Forma Selvatica / Metamorfosi: 24 creature in più**, tutte le bestie SRD
  fino a GS 1/2 che mancavano: Cervo, Aquila, Scarabeo di fuoco gigante, Capra,
  Iena, Sciacallo, Quipper, Scorpione, Cavalluccio marino, Ragno, Avvoltoio,
  Donnola (GS 0); Falco di sangue, Cammello, Granchio gigante, Ratto gigante,
  Donnola gigante, Mulo (GS 1/8); Becco d'ascia, Cavallo da tiro, Gufo gigante,
  Ragno lupo gigante, Pteranodonte (GS 1/4); Cavalluccio marino gigante
  (GS 1/2). Rispettano i limiti di nuoto e volo della Forma Selvatica. Il
  catalogo passa da 62 a 86 bestie, con traduzione inglese dei nomi.
- **Poteri sbloccati per livello**, come i privilegi di classe: ogni potere
  ha un campo "Disponibile dal livello" (0 = sempre). Prima di quel livello il
  potere resta in elenco con il lucchetto (🔒 14° liv.) ma non applica
  modificatori e non crea risorse; al livello giusto si attiva da solo
  (conta il livello totale, anche multiclasse). Nel modello Araldi del
  Segreto: Segreti, Soglie e Affabilità dal 1°, Inquisire dal 6°, Trasferire
  Empatico dal 10°, Braccare! dal 14°. Chi li aveva già aggiunti trova in "Da
  modello" il pulsante "Imposta i livelli".
- **Risorse di classe**: passando il mouse su una risorsa nata da un Potere
  (Inquisire, Affabilità...) si legge la descrizione di quel potere; un tocco
  la apre in finestra.

## [4.57.0] – 2026-10-05

### Corretto
- **Forma Selvatica (regole 2024)**: un riposo breve ora restituisce **un solo
  uso** speso, il riposo lungo tutti (prima il riposo breve li restituiva
  tutti, come nella 5.0). Nella 5.0 resta com'era: 2 usi, entrambi i riposi li
  restituiscono tutti. Nuovo tipo di ricarica `breve-uno` in
  `risorseDopoRiposo` (`regole.js`), mostrato come "1 a riposo breve, tutti a
  lungo"; le schede 2024 già esistenti si aggiornano da sole. Descrizioni in
  italiano e inglese allineate.

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
