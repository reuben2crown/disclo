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
    titleBar: "Disclo conformità IA",
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
    regAi: "Conformità dei contenuti IA",
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

  scanItemDetail: {
    titleBar: "Scan item",
    backScan: "Back to scan",
    productId: (id: string) => `Product ID: ${id}`,
    fieldLabel: "Field",
    aiProbability: "AI probability",
    riskLevel: "Risk level",
    status: "Status",
    regulationsHeading: "Regulations",
    claimsHeading: "Green claims signals",
    noClaims: "No green-claim keywords flagged on this text.",
    auditHeading: "Audit history",
    noAudit: "No actions yet.",
    previewHeading: "Product text (from Shopify)",
    previewUnavailable:
      "Live product text preview is unavailable. Values above still reflect your scan.",
    applyLabel: "Apply AI disclosure label",
    applyLabelHelp:
      "Writes the disclosure metafield for this product. Your theme shows it when the app block is enabled.",
    applyLabelSuccess: "Label saved to the product.",
    itemNotFound: "We could not find that scan item.",
    itemStillScanning:
      "This item is still scanning. Open live progress and wait until it finishes.",
    itemExempted:
      "This item is marked human-reviewed. Labels are not required.",
    noAiRegulations:
      "No AI disclosure regulation applies to this item for your target markets. Green-claims-only items use evidence and edits instead of the storefront disclosure badge.",
    applyLabelQueueUnavailable:
      "We cannot apply labels right now because background services are unavailable. Wait a few minutes, then try again.",
    applyLabelServerError:
      "Disclo cannot write labels until server configuration is fixed. Contact whoever runs Disclo for your store.",
    applyLabelAdapterFailed: (detail: string) =>
      `Shopify did not accept the label update: ${detail}`,
    applyLabelStale:
      "This item changed in Shopify after you opened the page. Close this screen, run a fresh scan, then try again.",
    viewItem: "View item",
    itemsHeading: "Products in this scan",
    itemsIntro:
      "Open a product to see AI probability, regulations, claims signals, and audit history.",
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
    heading: "Disclo - Conformità dei contenuti IA",
    tagline:
      "Conformità dei contenuti IA e verifica dei claim ambientali per il catalogo Shopify. Apri l’app dall’admin Shopify per iniziare.",
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
    dashboard: "Disclo conformità IA",
    scans: "Scansioni",
    audit: "Audit log",
    billing: "Plans & billing",
    settings: "Impostazioni",
  },

  billing: {
    titleBar: "Plans & billing",
    pageTitle: "Plans & billing",
    intro:
      "Pick a plan for your catalog size and compliance needs. Checkout runs in Shopify; approve the charge there, then return to Disclo.",
    currentPlanHeading: "Current plan",
    perMonth: "/ month",
    maxItemsLabel: "Max products per scan",
    unlimited: "Unlimited",
    highlightsBasic:
      "Label fixes, audit log, PDF export, monthly auto-scan, image detection",
    highlightsPro: "Everything in Basic, plus rewrite engine and higher limits",
    highlightsAgency: "Higher limits, white-label reports, API access",
    highlightsEnterprise: "Custom limits, dedicated support",
    subscribe: "Subscribe in Shopify",
    switchPlan: "Switch plan",
    currentBadge: "Current",
    downgrade: "Cancel subscription",
    downgradeHelp:
      "Cancels through Shopify and moves this shop to the Free plan. You can subscribe again anytime.",
    checkoutReturn:
      "Thanks for completing checkout. If your plan still looks wrong after a minute, refresh this page.",
    downgradeReturn: "You are on the Free plan now.",
    errorGeneric: "Something went wrong. Reload and try again.",
    enterpriseBlurb:
      "Enterprise is normally custom-priced. Subscribing here uses a standard monthly charge so you can complete checkout in a dev store; contact us for production terms.",
  },
  auditLog: {
    titleBar: "Audit log",
    intro:
      "Chronological record of reviewer actions (labels, human-reviewed, rewrites, and more). Filter by regulation that applies to the product at scan time. Export a PDF for your records when your plan includes PDF export.",
    filterLabel: "Regulation on product",
    allRegulations: "All regulations",
    applyFilter: "Apply filter",
    exportPdf: "Export PDF",
    exportPdfHelp:
      "Downloads a PDF with a SHA-256 digest of the included entries. Uses the same regulation filter as the list.",
    emptyTitle: "No audit entries yet",
    emptyDescription:
      "Actions from scans (such as applying a disclosure label) appear here.",
    emptyFilter:
      "No entries match this regulation filter. Clear the filter or pick another code.",
    upgradeTitle: "Audit log is not on your plan",
    upgradeBody:
      "Upgrade in Shopify admin to keep a full audit trail and export PDFs.",
    tableWhen: "When",
    tableAction: "Action",
    tableProduct: "Product ID",
    tableNotes: "Notes",
  },


  footer: {
    language: "Lingua",
    languageLabel: "Lingua dell’app",
  },
};
