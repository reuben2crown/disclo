import type { MerchantMessages } from "./types.js";

/** Merchant-facing Dutch strings. */
export const merchantMessagesNl: MerchantMessages = {
  support: {
    withEmail: (email: string) =>
      `Als dit zo blijft, mail ${email} en beschrijf kort wat je deed.`,
    withoutEmail:
      "Als dit zo blijft, neem contact op met wie Disclo voor je winkel heeft geïnstalleerd.",
  },

  scan: {
    queueUnavailable:
      "We kunnen nu geen scans in de wachtrij zetten: de achtergrondtaakdienst reageert niet. Wacht een paar minuten en tik opnieuw op Volledige scan starten.",
    serverMisconfigured:
      "Disclo start nog op onze servers. Probeer het over een paar minuten opnieuw. Blijft het gebeuren, neem contact op met wie Disclo voor je winkel beheert.",
    shopMissing:
      "Deze winkel staat nog niet in Disclo. Open in Shopify-admin Instellingen → Apps en verkoopkanalen, zoek naar Disclo en installeer of open de app een keer. Ontbreekt Disclo, installeer deze eerst via de Shopify App Store en probeer het opnieuw.",
    planNotSynced:
      "Je abonnement is nog niet gesynchroniseerd met Disclo. Open in Shopify-admin Instellingen → Apps en verkoopkanalen → Disclo, controleer of het gratis of betaalde plan laadt, wacht een minuut, kom hier terug en start de scan opnieuw.",
    noProducts:
      "Er zijn geen producten om te scannen. Voeg minstens één product toe in Shopify-admin en start de scan opnieuw.",
    productGone:
      "We konden dat product niet van Shopify laden. Het is misschien verwijderd. Open het product in Shopify-admin, sla het op en werk de weergave opnieuw bij.",
    catalogLoadFailed:
      "Shopify gaf je catalogus niet terug. Open Disclo vanuit Shopify-admin. Blijft het gebeuren, installeer Disclo opnieuw.",
    unexpectedFullScan:
      "We konden je scan niet starten. Wacht een minuut en tik opnieuw op Volledige scan starten.",
    unexpectedIncremental:
      "We konden geen scan voor dat product in de wachtrij zetten. Wacht een minuut en sla het product in Shopify-admin opnieuw op.",
  },

  oauth: {
    serverNotReady:
      "Disclo kan je sessie nog niet opslaan: serverversleuteling is niet ingesteld. Probeer het later opnieuw of neem contact op met wie de app heeft geïnstalleerd.",
    databaseNotReady:
      "Er ontbreken verplichte gegevens in de database (bijv. de rij voor het gratis abonnement). Wie Disclo beheert moet de database seeden; daarna kun je opnieuw installeren.",
    missingAccessToken:
      "Inloggen is niet afgerond. Open in Shopify-admin Instellingen → Apps en verkoopkanalen → Disclo, of open Disclo vanuit de Apps-lijst, en rond de installatie opnieuw af.",
  },

  dashboard: {
    titleBar: "Disclo AI-compliance",
    unknownAction:
      "Dat verzoek herkenden we niet. Laad de pagina opnieuw en sla de doelmarkten opnieuw op.",
    shopMissingMarkets:
      "We vonden deze winkel niet in Disclo. Installeer de app opnieuw en kies de doelmarkten opnieuw.",
    marketsRequired:
      "Kies minstens één regio zodat we weten welke regels gelden. Kies EU, VS of een Amerikaanse staat en sla op.",
    setupBannerTitle: "Instelling afronden",
    setupBannerBody: (shopDomain: string) =>
      `Deze winkel is nog niet gekoppeld in Disclo. Sluit de app, open hem opnieuw vanuit Shopify-admin zodat inloggen kan afronden, en ververs deze pagina. Domein: ${shopDomain}.`,
    onboardingHeading: "Aan de slag",
    onboardingLinked: "App geïnstalleerd en winkel gekoppeld",
    onboardingLinkShop: "Koppel je winkel",
    onboardingMarketsOk: "Doelmarkten gekozen",
    onboardingMarketsTodo: "Kies hieronder de doelmarkten",
    onboardingScanOk: "Eerste scan voltooid",
    onboardingScanTodo: "Start een scan om compliancescores te zien",
    activeScanTitle: "Je scan loopt",
    activeScanBody: (processed: number, total: string) =>
      `${processed} van ${total} producten verwerkt.`,
    openLiveProgress: "Live voortgang openen",
    scanFailedTitle: "Je scan is niet gestart",
    marketsFailedTitle: "Doelmarkten niet opgeslagen",
    complianceHeading: "Compliancescore",
    complianceUnavailable: "Nog niet beschikbaar",
    complianceHelp:
      "0–100 van je laatst voltooide scan. Tijdens een scan blijft de vorige score zichtbaar.",
    planHeading: "Abonnement",
    lastScanHeading: "Laatste scan",
    noScansYet: "Nog geen scans",
    lastScanStatus: (status: string) => `Status: ${status}`,
    riskHeading: "Risico-overzicht (laatst voltooide scan)",
    riskHelp: "Aantallen per hoogste ernst die we per item hebben gegeven.",
    riskHigh: (n: number, pct: number) => `Hoog: ${n} (${pct}%)`,
    riskReview: (n: number, pct: number) => `Controleren: ${n} (${pct}%)`,
    riskClear: (n: number, pct: number) => `Geen melding: ${n} (${pct}%)`,
    regulationsHeading: "Van toepassing zijnde regels",
    regulationsHelp:
      "Afgeleid van doelmarkten. Badge en teksten voor vermelding volgen deze regels.",
    regAi: "Compliance voor AI-content",
    regGreen: "Milieubeweringen",
    marketsHeading: "Doelmarkten",
    marketsHelp: "Bepaalt welke regels gelden. Wijzigingen gelden voor de volgende scan.",
    choiceListTitle: "Markten",
    saving: "Opslaan…",
    quickActionsHeading: "Snelle acties",
    startFullScan: "Volledige scan starten",
    quickActionsHelp: (merchantSupportEmail: string | null) => {
      const base =
        "Zet je hele catalogus in de wachtrij; je abonnement kan beperken hoeveel items lopen. Na start openen we het live voortgangsscherm.";
      if (merchantSupportEmail) {
        return `${base} Vragen? Mail ${merchantSupportEmail}.`;
      }
      return `${base} Vragen? Neem contact op met wie Disclo voor je winkel heeft geïnstalleerd.`;
    },
  },

  scansList: {
    titleBar: "Scans",
    intro:
      "Verklein de lijst als minstens één item bij een regel hoort. Sorteer op starttijd van elke scan. Exporteer geselecteerde scan-ID’s als CSV.",
    filterLabel: "Regel op items",
    filterAria: "Scans filteren op regelcode op items",
    allRegulations: "Alle regels",
    applyRegulationFilter: "Regelfilter toepassen",
    tableStarted: "Gestart",
    tableType: "Type",
    tableStatus: "Status",
    tableItems: "Items",
    tableScore: "Score",
    tableFlagged: "Gemarkeerd",
    tableActions: "Acties",
    openRow: "Openen",
    exportCsv: "Scan-ID’s exporteren (CSV)",
    emptyTitle: "Geen scans in deze weergave",
    emptyDescription:
      "Start een volledige scan vanaf het dashboard of wis het regelfilter als die aan staat.",
    footnote:
      "Labels per item en reviewer-acties komen eraan. Open een scanrij om voortgang en scores van die run te zien.",
    openDashboard: "Dashboard openen",
  },

  scanProgress: {
    backScans: "Scans",
    titleBar: "Live scanvoortgang",
    scanIdLine: (id: string) => `Scan-ID: ${id}`,
    completedTitle: "Je scan is klaar",
    completedBody: (score: string, flagged: string) =>
      `Compliancescore: ${score}. Gemarkeerde items: ${flagged}.`,
    runningTitle: "Je catalogus wordt nog gescand",
    runningBody:
      "Dit scherm vernieuwt elke paar seconden. We draaien tekst-, beeld- en milieuclaimcontroles samen per product.",
    overallHeading: "Totaal",
    overallProcessed: (processed: number, total: string) =>
      `${processed} van ${total} producten verwerkt`,
    pipelineHeading: "Pijplijnfasen",
    pipelineHelp:
      "Alle drie lopen in één keer per product. De balken volgen dezelfde totale voortgang.",
    stageText: "Tekstdetectie",
    stageImage: "Beelddetectie",
    stageClaims: "Milieuclaims",
    openDashboard: "Dashboard openen",
    invalidLink: "Die scanlink is ongeldig.",
    scanNotFound:
      "We vonden die scan niet voor deze winkel. Open Scans in het menu en kies een recente run.",
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
      "Gebruik de knop Volledige scan starten op het dashboard. Heb je deze URL opgeslagen, ga terug naar de app-startpagina.",
  },

  settings: {
    pageTitle: "Winkelinstellingen",
    titleBar: "Instellingen",
    languageHeading: "Taal",
    languageBody:
      "Kies een taal voor Disclo in deze browser. Die blijft staan tot je hem wijzigt. Browsertaal volgt systeem of browser als we die ondersteunen.",
    languageLabel: "App-taal",
    languageSave: "Taal opslaan",
    languageBrowserDefault: "Browsertaal",
    languageSaved: "Taal opgeslagen.",
    marketsHeading: "Doelmarkten",
    marketsBody:
      "Regio’s bepalen welke regels gelden (EU AI Act, Florida, New York, federaal VS, EU-milieuclaims). Gebruik de doelmarktenlijst op het dashboard voor live waarden; dit veld is alleen voorbeeld (standaard EU).",
    marketsFieldLabel: "Doelmarkten (kommagescheiden)",
    marketsHelpText: "Gebruik EU, US, US-FL of US-NY. Voorbeeld: EU, US-FL",
  },

  auth: {
    heading: "Inloggen bij Disclo",
    shopLabel: "Winkeldomein",
    shopHelp:
      "Gebruik je .myshopify.com-domein, bijvoorbeeld jouw-winkel.myshopify.com",
    submit: "Inloggen met Shopify",
    missingShop:
      "Vul je .myshopify.com-domein in en tik op Inloggen met Shopify.",
    invalidShop:
      "Dat domein lijkt geen Shopify-winkel. Controleer spelling en gebruik jouw-winkel.myshopify.com.",
  },

  marketing: {
    heading: "Disclo - Compliance voor AI-content",
    tagline:
      "Compliance voor AI-content en controle op milieuclaims voor je Shopify-catalogus. Open de app vanuit Shopify-admin om te beginnen.",
    shopExample: "Voorbeeld: jouw-winkel.myshopify.com",
    bulletScans:
      "Scans: catalogus doorloopt tekst-, beeld- en milieuclaimcontroles in één stroom.",
    bulletScores:
      "Scores: zie een compliancescore en welke regels gelden voor je verkoopregio’s.",
    bulletDisclosures:
      "Vermeldingen: houd labels in lijn met EU AI Act en verwachtingen rond milieuclaims terwijl je uitrolt in het product.",
  },

  hints: {
    openAppsToManagePlan: "Apps en verkoopkanalen openen",
  },

  nav: {
    dashboard: "Disclo AI-compliance",
    scans: "Scans",
    audit: "Audit log",
    billing: "Plans & billing",
    settings: "Instellingen",
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
    language: "Taal",
    languageLabel: "App-taal",
  },
};
