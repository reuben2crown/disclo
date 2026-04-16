import type { MerchantMessages } from "./types.js";

/** Merchant-facing Italian strings. */
export const merchantMessagesIt: MerchantMessages = {
  support: {
    withEmail: (email: string) =>
      `Se il problema continua, scrivi a ${email} e spiega brevemente cosa stavi facendo.`,
    withoutEmail:
      "Se il problema continua, contatta chi ha installato Disclo per il tuo negozio.",
  },

  scan: {
    queueUnavailable:
      "Non possiamo mettere in coda le scansioni: il servizio di job in background non risponde. Attendi qualche minuto e tocca di nuovo Avvia scansione completa.",
    serverMisconfigured:
      "Disclo si sta ancora avviando sui nostri server. Riprova tra qualche minuto. Se si ripete, contatta chi gestisce Disclo per il tuo negozio.",
    shopMissing:
      "Questo negozio non è ancora in Disclo. Nell’admin Shopify apri Impostazioni → App e canali di vendita, cerca Disclo e installala o aprila una volta. Se Disclo non c’è, installala prima dallo Shopify App Store e riprova.",
    planNotSynced:
      "Il tuo piano non è ancora sincronizzato con Disclo. Nell’admin Shopify apri Impostazioni → App e canali di vendita → Disclo, verifica che si carichi il piano gratuito o a pagamento, attendi un minuto, torna qui e riavvia una scansione.",
    noProducts:
      "Non ci sono prodotti da scansionare. Aggiungi almeno un prodotto nell’admin Shopify e riavvia una scansione.",
    productGone:
      "Non siamo riusciti a caricare quel prodotto da Shopify. Potrebbe essere stato rimosso. Apri il prodotto nell’admin Shopify, salvalo e aggiorna di nuovo la scheda.",
    catalogLoadFailed:
      "Shopify non ha restituito il tuo catalogo. Apri Disclo dall’admin Shopify. Se si ripete, reinstalla Disclo.",
    unexpectedFullScan:
      "Non siamo riusciti ad avviare la scansione. Attendi un minuto e tocca di nuovo Avvia scansione completa.",
    unexpectedIncremental:
      "Non siamo riusciti a mettere in coda una scansione per quel prodotto. Attendi un minuto e salva di nuovo il prodotto nell’admin Shopify.",
  },

  oauth: {
    serverNotReady:
      "Disclo non può ancora salvare la sessione: la crittografia lato server non è configurata. Riprova più tardi o contatta chi ha installato l’app.",
    databaseNotReady:
      "Mancano dati obbligatori nel database (ad es. la riga del piano gratuito). Chi opera Disclo deve eseguire il seed del database; poi potrai reinstallare.",
    missingAccessToken:
      "L’accesso non è terminato. Nell’admin Shopify apri Impostazioni → App e canali di vendita → Disclo, oppure apri Disclo dall’elenco App, e completa di nuovo l’installazione.",
  },

  dashboard: {
    titleBar: "Disclo",
    unknownAction:
      "Richiesta non riconosciuta. Ricarica la pagina e salva di nuovo i mercati di destinazione.",
    shopMissingMarkets:
      "Non abbiamo trovato questo negozio in Disclo. Reinstalla l’app e scegli di nuovo i mercati di destinazione.",
    marketsRequired:
      "Scegli almeno una regione per sapere quali regole si applicano. Seleziona UE, Stati Uniti o uno stato USA, poi salva.",
    setupBannerTitle: "Completa la configurazione",
    setupBannerBody: (shopDomain: string) =>
      `Questo negozio non è ancora collegato in Disclo. Chiudi l’app, riaprila dall’admin Shopify per completare l’accesso, poi aggiorna questa pagina. Dominio: ${shopDomain}.`,
    onboardingHeading: "Per iniziare",
    onboardingLinked: "App installata e negozio collegato",
    onboardingLinkShop: "Collega il negozio",
    onboardingMarketsOk: "Mercati di destinazione selezionati",
    onboardingMarketsTodo: "Scegli i mercati di destinazione qui sotto",
    onboardingScanOk: "Prima scansione completata",
    onboardingScanTodo: "Esegui una scansione per vedere i punteggi di conformità",
    activeScanTitle: "La scansione è in corso",
    activeScanBody: (processed: number, total: string) =>
      `Elaborati ${processed} di ${total} prodotti.`,
    openLiveProgress: "Apri avanzamento in tempo reale",
    scanFailedTitle: "La scansione non è partita",
    marketsFailedTitle: "Mercati di destinazione non salvati",
    complianceHeading: "Punteggio di conformità",
    complianceUnavailable: "Non ancora disponibile",
    complianceHelp:
      "Da 0 a 100 dall’ultima scansione completata. Durante una scansione resta visibile il punteggio precedente.",
    planHeading: "Piano",
    lastScanHeading: "Ultima scansione",
    noScansYet: "Ancora nessuna scansione",
    lastScanStatus: (status: string) => `Stato: ${status}`,
    riskHeading: "Ripartizione del rischio (ultima scansione completata)",
    riskHelp: "Conteggi per la gravità massima assegnata a ogni articolo.",
    riskHigh: (n: number, pct: number) => `Alta: ${n} (${pct}%)`,
    riskReview: (n: number, pct: number) => `Da rivedere: ${n} (${pct}%)`,
    riskClear: (n: number, pct: number) => `Nessun problema: ${n} (${pct}%)`,
    regulationsHeading: "Normative applicabili",
    regulationsHelp:
      "Derivate dai mercati di destinazione. Badge e testi informativi seguono queste regole.",
    regAi: "Conformità all'AI Act",
    regGreen: "Claim ambientali",
    marketsHeading: "Mercati di destinazione",
    marketsHelp: "Definisce quali normative si applicano. Le modifiche valgono per la prossima scansione.",
    choiceListTitle: "Mercati",
    saving: "Salvataggio…",
    quickActionsHeading: "Azioni rapide",
    startFullScan: "Avvia scansione completa",
    quickActionsHelp: (merchantSupportEmail: string | null) => {
      const base =
        "Mette in coda tutto il catalogo; il tuo piano può limitare quanti articoli girano. Dopo l’avvio apriamo la schermata di avanzamento in tempo reale.";
      if (merchantSupportEmail) {
        return `${base} Domande? Scrivi a ${merchantSupportEmail}.`;
      }
      return `${base} Domande? Contatta chi ha installato Disclo per il tuo negozio.`;
    },
  },

  scansList: {
    titleBar: "Scansioni",
    intro:
      "Restringi l’elenco quando almeno un articolo corrisponde a una normativa. Ordina per inizio scansione. Esporta gli ID selezionati in CSV.",
    filterLabel: "Normativa sugli articoli",
    filterAria: "Filtra scansioni per codice normativa sugli articoli",
    allRegulations: "Tutte le normative",
    applyRegulationFilter: "Applica filtro normativa",
    tableStarted: "Avviata",
    tableType: "Tipo",
    tableStatus: "Stato",
    tableItems: "Articoli",
    tableScore: "Punteggio",
    tableFlagged: "Segnalati",
    tableActions: "Azioni",
    openRow: "Apri",
    exportCsv: "Esporta ID scansione (CSV)",
    emptyTitle: "Nessuna scansione in questa vista",
    emptyDescription:
      "Esegui una scansione completa dalla dashboard o rimuovi il filtro normativa se attivo.",
    footnote:
      "Etichette per articolo e azioni revisore arriveranno presto. Apri una riga per vedere avanzamento e punteggi di quell’esecuzione.",
    openDashboard: "Apri dashboard",
  },

  scanProgress: {
    backScans: "Scansioni",
    titleBar: "Avanzamento scansione in tempo reale",
    scanIdLine: (id: string) => `ID scansione: ${id}`,
    completedTitle: "Scansione completata",
    completedBody: (score: string, flagged: string) =>
      `Punteggio di conformità: ${score}. Articoli segnalati: ${flagged}.`,
    runningTitle: "Scansione del catalogo in corso",
    runningBody:
      "Questa schermata si aggiorna ogni pochi secondi. Eseguiamo testo, immagine e claim ambientali insieme per ogni prodotto.",
    overallHeading: "Complessivo",
    overallProcessed: (processed: number, total: string) =>
      `Elaborati ${processed} di ${total} prodotti`,
    pipelineHeading: "Fasi della pipeline",
    pipelineHelp:
      "Le tre fasi girano in un’unica passata per prodotto. Le barre seguono lo stesso avanzamento complessivo.",
    stageText: "Rilevamento testo",
    stageImage: "Rilevamento immagini",
    stageClaims: "Claim ambientali",
    openDashboard: "Apri dashboard",
    invalidLink: "Questo link alla scansione non è valido.",
    scanNotFound:
      "Non abbiamo trovato quella scansione per questo negozio. Apri Scansioni dal menu e scegli un’esecuzione recente.",
  },

  scanAction: {
    wrongMethod:
      "Usa il pulsante Avvia scansione completa nella dashboard. Se hai salvato questa URL nei preferiti, torna alla home dell’app.",
  },

  settings: {
    pageTitle: "Impostazioni negozio",
    titleBar: "Impostazioni",
    languageHeading: "Lingua",
    languageBody:
      "Scegli una lingua per Disclo in questo browser. Resta salvata finché non la cambi. La lingua del browser segue sistema o browser quando la supportiamo.",
    languageLabel: "Lingua dell’app",
    languageSave: "Salva lingua",
    languageBrowserDefault: "Lingua del browser",
    languageSaved: "Lingua salvata.",
    marketsHeading: "Mercati di destinazione",
    marketsBody:
      "Le regioni definiscono quali regole si applicano (AI Act UE, Florida, New York, USA federali, claim ambientali UE). Usa l’elenco mercati nella dashboard per i valori attivi; questo campo è solo anteprima (default UE).",
    marketsFieldLabel: "Mercati di destinazione (separati da virgola)",
    marketsHelpText: "Usa EU, US, US-FL o US-NY. Esempio: EU, US-FL",
  },

  auth: {
    heading: "Accedi a Disclo",
    shopLabel: "Dominio del negozio",
    shopHelp:
      "Usa il dominio .myshopify.com, ad esempio il-tuo-negozio.myshopify.com",
    submit: "Accedi con Shopify",
    missingShop:
      "Inserisci il dominio .myshopify.com e premi Accedi con Shopify.",
    invalidShop:
      "Questo dominio non sembra un negozio Shopify. Controlla l’ortografia e usa il-tuo-negozio.myshopify.com.",
  },

  marketing: {
    heading: "Disclo",
    tagline:
      "Conformità all'AI Act e verifica dei claim ambientali per il catalogo Shopify. Apri l’app dall’admin Shopify per iniziare.",
    shopExample: "Esempio: il-tuo-negozio.myshopify.com",
    bulletScans:
      "Scansioni: il catalogo passa da controlli su testo, immagine e claim ambientali in un flusso unico.",
    bulletScores:
      "Punteggi: vedi un punteggio di conformità e quali regole valgono in base alle regioni in cui vendi.",
    bulletDisclosures:
      "Informative: allinea le etichette all’AI Act UE e alle attese sui claim ambientali mentre pubblichi nel prodotto.",
  },

  hints: {
    openAppsToManagePlan: "Apri App e canali di vendita",
  },

  nav: {
    dashboard: "Dashboard",
    scans: "Scansioni",
    settings: "Impostazioni",
  },

  footer: {
    language: "Lingua",
    languageLabel: "Lingua dell’app",
  },
};
