# Risposte

## 1. Che cos'è app.routes.ts e cosa contiene

È il file dove si definiscono le route dell'app, cioè quale componente mostrare per ogni url. qui ci sono:

- `/` che rimanda a `/home`
- `/home` mostra `Home`
- `/elenco` mostra `Elenco`
- `/inserimento` mostra `Inserimento`
- `/elenco/:id` mostra `DettaglioStudente`
- `**` cioè qualsiasi altro url, rimanda a `/home`

## 2. Che cos'è un service e perché lo si usa

Un service è una classe che tiene dati e logica da condividere tra più componenti. angular ne crea una sola istanza per tutta l'app e la passa a chi la chiede con `inject()`. gli studenti stanno in `StudentiService` perché li usano più pagine (home, elenco, inserimento, dettaglio) e perché quando cambi pagina il router distrugge il componente, quindi se i dati stessero in `Elenco` andrebbero persi ogni volta

## 3. Come si legge l'id dall'url e perché serve Number

Nel dettaglio si usa `this.route.paramMap.subscribe(...)` e poi `parametri.get('id')`. il valore che arriva dall'url è sempre una stringa, quindi senza `Number` il metodo `trova` confronterebbe '2' con 2 e non troverebbe lo studente

## 4. Perché dati è privato e i componenti leggono studenti

Così i dati li può modificare solo il servizio, passando dai suoi metodi. `studenti` è la versione in sola lettura fatta con `asReadonly()`, si legge ma non ha set o update. se `Elenco` potesse fare set potrebbe sovrascrivere la lista come vuole, magari con id doppi o dati sbagliati, e le regole tipo il calcolo dell'id verrebbero saltate

## 5. Come viene calcolato l'id di un nuovo studente

Prende l'id più grande tra quelli esistenti e aggiunge 1. con "numero di studenti + 1" invece si rompe tutto appena elimini qualcuno: parti con gli id 1 2 3 4 5, elimini il 2 e restano 4 studenti, il nuovo prenderebbe 4 + 1 = 5 che però c'è già. col massimo invece prende 5 + 1 = 6

## 6. Cosa succede quando scrivi una lettera nel filtro

Il `[(ngModel)]` aggiorna subito il signal `filtroClasse`. il computed `filtrati` legge quel signal quindi viene ricalcolato, toglie gli spazi, mette tutto in maiuscolo e filtra gli studenti per classe. il template usa `filtrati()` quindi la tabella si aggiorna da sola, e se non resta nessuno compare l'avviso giallo

## 7. A cosa servono #modulo="ngForm" e [disabled]="modulo.invalid"

`#modulo="ngForm"` crea una variabile che punta all'oggetto con cui angular controlla il form, non al tag html. `[disabled]="modulo.invalid"` tiene il pulsante salva disattivato finché il form non è valido. il form non è valido se il nome o la classe sono vuoti (required) o se la media è vuota, sotto 1 o sopra 10

## 8. Perché router.navigate(['/elenco']) e non un link

Perché il cambio pagina deve succedere dopo il salvataggio, come conseguenza di un'azione nel codice. con un link l'utente dovrebbe cliccare qualcosa e non avresti la certezza che lo studente sia già stato aggiunto

## 9. Input e output di StudenteCard

Ha due input, `studente` che è obbligatorio e `azioni` che è facoltativo e vale true di default, e un output `rimosso` che manda lo studente al padre. la card non chiama il servizio perché così resta riutilizzabile: decide il padre cosa fare, nel dettaglio per esempio rimuove e poi torna all'elenco, mentre nella home il pulsante non c'è proprio

## 10. Perché studente successivo funziona solo con paramMap.subscribe

Passando da `/elenco/2` a `/elenco/3` la route è la stessa e angular riusa il componente senza rieseguire `ngOnInit`. con subscribe il codice riceve ogni nuovo id e aggiorna lo studente. con lo snapshot l'id viene letto una volta sola, quindi l'url cambierebbe ma la scheda resterebbe sullo studente di prima
