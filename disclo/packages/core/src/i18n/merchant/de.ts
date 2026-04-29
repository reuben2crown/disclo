import type { MerchantMessages } from "./types.js";

/** Merchant-facing German strings. */
export const merchantMessagesDe: MerchantMessages = {
  support: {
    withEmail: (email: string) =>
      `Wenn das weiter passiert, schreiben Sie an ${email} und sagen Sie kurz, was Sie gerade getan haben.`,
    withoutEmail:
      "Wenn das weiter passiert, wenden Sie sich an die Person, die Disclo für Ihren Shop installiert hat.",
  },

  scan: {
    queueUnavailable:
      "Wir können Scans gerade nicht einreihen: Der Hintergrunddienst antwortet nicht. Warten Sie ein paar Minuten und tippen Sie erneut auf Vollständigen Scan starten.",
    serverMisconfigured:
      "Disclo startet auf unseren Servern noch. Versuchen Sie es in ein paar Minuten erneut. Wenn es wieder passiert, wenden Sie sich an die Person, die Disclo für Ihren Shop betreibt.",
    shopMissing:
      "Dieser Shop ist noch nicht in Disclo. Öffnen Sie im Shopify-Admin Einstellungen → Apps und Vertriebskanäle, suchen Sie nach Disclo, und installieren Sie die App oder öffnen Sie sie einmal. Fehlt Disclo, installieren Sie sie zuerst aus dem Shopify App Store, und versuchen Sie es erneut.",
    planNotSynced:
      "Ihr Plan ist noch nicht mit Disclo synchron. Öffnen Sie im Shopify-Admin Einstellungen → Apps und Vertriebskanäle → Disclo, prüfen Sie, dass der kostenlose oder kostenpflichtige Plan lädt, warten Sie eine Minute, kehren Sie hierher zurück und starten Sie den Scan erneut.",
    noProducts:
      "Es gibt keine Produkte zum Scannen. Legen Sie mindestens ein Produkt im Shopify-Admin an und starten Sie den Scan erneut.",
    productGone:
      "Wir konnten dieses Produkt nicht von Shopify laden. Es wurde vielleicht entfernt. Öffnen Sie das Produkt im Shopify-Admin, speichern Sie es und aktualisieren Sie die Anzeige erneut.",
    catalogLoadFailed:
      "Shopify hat Ihren Katalog nicht zurückgegeben. Öffnen Sie Disclo aus dem Shopify-Admin. Wenn es wieder passiert, installieren Sie Disclo neu.",
    unexpectedFullScan:
      "Wir konnten Ihren Scan nicht starten. Warten Sie eine Minute und tippen Sie erneut auf Vollständigen Scan starten.",
    unexpectedIncremental:
      "Wir konnten keinen Scan für dieses Produkt einreihen. Warten Sie eine Minute und speichern Sie das Produkt im Shopify-Admin erneut.",
  },

  oauth: {
    serverNotReady:
      "Disclo kann Ihre Sitzung noch nicht speichern: Serververschlüsselung ist nicht eingerichtet. Versuchen Sie es später erneut oder wenden Sie sich an die Person, die die App installiert hat.",
    databaseNotReady:
      "In der Datenbank fehlen nötige Daten (z. B. die Zeile für den kostenlosen Plan). Die Person, die Disclo betreibt, muss die Datenbank seeden; danach können Sie die Installation erneut versuchen.",
    missingAccessToken:
      "Die Anmeldung ist nicht fertig. Öffnen Sie im Shopify-Admin Einstellungen → Apps und Vertriebskanäle → Disclo, oder öffnen Sie Disclo aus der App-Liste, und schließen Sie die Installation erneut ab.",
  },

  dashboard: {
    titleBar: "Disclo KI-Compliance",
    unknownAction:
      "Diese Aktion wurde nicht erkannt. Laden Sie die Seite neu und speichern Sie die Zielmärkte erneut.",
    shopMissingMarkets:
      "Wir haben diesen Shop in Disclo nicht gefunden. Installieren Sie die App neu und wählen Sie die Zielmärkte erneut.",
    marketsRequired:
      "Wählen Sie mindest eine Region, damit wir wissen, welche Regeln gelten. Wählen Sie EU, USA oder einen US-Bundesstaat und speichern Sie.",
    setupBannerTitle: "Einrichtung abschließen",
    setupBannerBody: (shopDomain: string) =>
      `Dieser Shop ist in Disclo noch nicht verknüpft. Schließen Sie die App, öffnen Sie sie erneut aus dem Shopify-Admin, damit die Anmeldung fertig wird, und laden Sie diese Seite neu. Domain: ${shopDomain}.`,
    onboardingHeading: "Erste Schritte",
    onboardingLinked: "App installiert und Shop verknüpft",
    onboardingLinkShop: "Shop verknüpfen",
    onboardingMarketsOk: "Zielmärkte gewählt",
    onboardingMarketsTodo: "Wählen Sie unten die Zielmärkte",
    onboardingScanOk: "Erster Scan abgeschlossen",
    onboardingScanTodo: "Starten Sie einen Scan, um Compliance-Scores zu sehen",
    activeScanTitle: "Ihr Scan läuft",
    activeScanBody: (processed: number, total: string) =>
      `${processed} von ${total} Produkten verarbeitet.`,
    openLiveProgress: "Live-Fortschritt öffnen",
    scanFailedTitle: "Ihr Scan hat nicht gestartet",
    marketsFailedTitle: "Zielmärkte wurden nicht gespeichert",
    complianceHeading: "Compliance-Score",
    complianceUnavailable: "Noch nicht verfügbar",
    complianceHelp:
      "0–100 aus Ihrem letzten abgeschlossenen Scan. Während ein Scan läuft, bleibt der vorherige Score sichtbar.",
    planHeading: "Plan",
    lastScanHeading: "Letzter Scan",
    noScansYet: "Noch keine Scans",
    lastScanStatus: (status: string) => `Status: ${status}`,
    riskHeading: "Risikoübersicht (letzter abgeschlossener Scan)",
    riskHelp: "Zählung nach der höchsten Schwere, die wir je Artikel vergeben haben.",
    riskHigh: (n: number, pct: number) => `Hoch: ${n} (${pct}%)`,
    riskReview: (n: number, pct: number) => `Prüfen: ${n} (${pct}%)`,
    riskClear: (n: number, pct: number) => `Unauffällig: ${n} (${pct}%)`,
    regulationsHeading: "Geltende Vorschriften",
    regulationsHelp:
      "Abgeleitet von den Zielmärkten. Badge und Hinweistexte folgen diesen Regeln.",
    regAi: "Compliance für KI-Inhalte",
    regGreen: "Umweltclaims",
    marketsHeading: "Zielmärkte",
    marketsHelp: "Legt fest, welche Vorschriften gelten. Änderungen gelten für den nächsten Scan.",
    choiceListTitle: "Märkte",
    saving: "Speichern…",
    quickActionsHeading: "Schnellaktionen",
    startFullScan: "Vollständigen Scan starten",
    quickActionsHelp: (merchantSupportEmail: string | null) => {
      const base =
        "Reiht Ihren ganzen Katalog ein; Ihr Plan kann begrenzen, wie viele Artikel laufen. Nach dem Start öffnen wir den Live-Fortschritt.";
      if (merchantSupportEmail) {
        return `${base} Fragen? Schreiben Sie an ${merchantSupportEmail}.`;
      }
      return `${base} Fragen? Wenden Sie sich an die Person, die Disclo für Ihren Shop installiert hat.`;
    },
  },

  scansList: {
    titleBar: "Scans",
    intro:
      "Filtern Sie die Liste, wenn mindestens ein Artikel zu einer Vorschrift passt. Sortieren Sie nach Scan-Start. Exportieren Sie gewählte Scan-IDs als CSV.",
    filterLabel: "Vorschrift auf Artikeln",
    filterAria: "Scans nach Vorschriftencode auf Artikeln filtern",
    allRegulations: "Alle Vorschriften",
    applyRegulationFilter: "Vorschriftfilter anwenden",
    tableStarted: "Gestartet",
    tableType: "Typ",
    tableStatus: "Status",
    tableItems: "Artikel",
    tableScore: "Score",
    tableFlagged: "Markiert",
    tableActions: "Aktionen",
    openRow: "Öffnen",
    exportCsv: "Scan-IDs exportieren (CSV)",
    emptyTitle: "Keine Scans für diese Ansicht",
    emptyDescription:
      "Starten Sie einen vollständigen Scan vom Dashboard oder entfernen Sie den Vorschriftfilter.",
    footnote:
      "Etiketten pro Artikel und Prüfaktionen folgen bald. Öffnen Sie eine Zeile, um Fortschritt und Scores dieses Laufs zu sehen.",
    openDashboard: "Dashboard öffnen",
  },

  scanProgress: {
    backScans: "Scans",
    titleBar: "Live-Scan-Fortschritt",
    scanIdLine: (id: string) => `Scan-ID: ${id}`,
    completedTitle: "Ihr Scan ist fertig",
    completedBody: (score: string, flagged: string) =>
      `Compliance-Score: ${score}. Markierte Artikel: ${flagged}.`,
    runningTitle: "Ihr Katalog wird noch gescannt",
    runningBody:
      "Diese Seite aktualisiert sich alle paar Sekunden. Wir prüfen Text, Bild und Umweltclaims gemeinsam pro Produkt.",
    overallHeading: "Gesamt",
    overallProcessed: (processed: number, total: string) =>
      `${processed} von ${total} Produkten verarbeitet`,
    pipelineHeading: "Pipeline-Stufen",
    pipelineHelp:
      "Alle drei laufen in einem Durchgang pro Produkt. Die Balken zeigen denselben Gesamtfortschritt.",
    stageText: "Texterkennung",
    stageImage: "Bilderkennung",
    stageClaims: "Umweltclaims",
    openDashboard: "Dashboard öffnen",
    invalidLink: "Dieser Scan-Link ist ungültig.",
    scanNotFound:
      "Wir haben diesen Scan für diesen Shop nicht gefunden. Öffnen Sie Scans im Menü und wählen Sie einen aktuellen Lauf.",
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
      "Nutzen Sie die Schaltfläche Vollständigen Scan starten im Dashboard. Wenn Sie diese URL gespeichert haben, gehen Sie zur App-Startseite zurück.",
  },

  settings: {
    pageTitle: "Shop-Einstellungen",
    titleBar: "Einstellungen",
    languageHeading: "Sprache",
    languageBody:
      "Wählen Sie eine Sprache für Disclo in diesem Browser. Die Wahl bleibt, bis Sie sie ändern. Browser-Standard folgt System oder Browser, wenn wir die Sprache unterstützen.",
    languageLabel: "App-Sprache",
    languageSave: "Sprache speichern",
    languageBrowserDefault: "Browser-Standard",
    languageSaved: "Sprache gespeichert.",
    marketsHeading: "Zielmärkte",
    marketsBody:
      "Regionen steuern, welche Regeln gelten (EU-KI-Verordnung, Florida, New York, US-Bundesebene, EU-Umweltclaims). Nutzen Sie die Zielmarktliste im Dashboard für live Werte; dieses Feld ist nur Vorschau (Standard EU).",
    marketsFieldLabel: "Zielmärkte (kommagetrennt)",
    marketsHelpText: "Nutzen Sie EU, US, US-FL oder US-NY. Beispiel: EU, US-FL",
  },

  auth: {
    heading: "Bei Disclo anmelden",
    shopLabel: "Shop-Domain",
    shopHelp:
      "Nutzen Sie Ihre .myshopify.com-Domain, z. B. ihr-shop.myshopify.com",
    submit: "Mit Shopify anmelden",
    missingShop:
      "Geben Sie Ihre .myshopify.com-Domain ein und tippen Sie auf Mit Shopify anmelden.",
    invalidShop:
      "Diese Domain sieht nicht nach einem Shopify-Shop aus. Prüfen Sie die Schreibweise und nutzen Sie ihr-shop.myshopify.com.",
  },

  marketing: {
    heading: "Disclo - Compliance für KI-Inhalte",
    tagline:
      "Compliance für KI-Inhalte und Prüfung von Umweltclaims für Ihren Shopify-Katalog. Öffnen Sie die App im Shopify-Admin, um zu starten.",
    shopExample: "Beispiel: ihr-shop.myshopify.com",
    bulletScans:
      "Scans: Katalog durchläuft Text-, Bild- und Umweltclaims-Prüfung in einem Ablauf.",
    bulletScores:
      "Scores: Compliance-Score und geltende Regeln nach Ihren Verkaufsregionen.",
    bulletDisclosures:
      "Hinweise: Halten Sie Etiketten im Einklang mit EU-KI-Act und Umweltclaims-Erwartungen beim Ausrollen im Produkt.",
  },

  hints: {
    openAppsToManagePlan: "Apps und Vertriebskanäle öffnen",
  },

  nav: {
    dashboard: "Disclo KI-Compliance",
    scans: "Scans",
    audit: "Audit log",
    billing: "Plans & billing",
    settings: "Einstellungen",
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
    language: "Sprache",
    languageLabel: "App-Sprache",
  },
};
