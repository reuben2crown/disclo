import type { MerchantMessages } from "./types.js";

/** Merchant-facing Danish strings. */
export const merchantMessagesDa: MerchantMessages = {
  support: {
    withEmail: (email: string) =>
      `Hvis det bliver ved, så mail ${email} og beskriv kort, hvad du lavede.`,
    withoutEmail:
      "Hvis det bliver ved, så kontakt den, der installerede Disclo for din butik.",
  },

  scan: {
    queueUnavailable:
      "Vi kan ikke sætte scanninger i kø lige nu: baggrundstjenesten svarer ikke. Vent et par minutter, og tryk på Start fuld scanning igen.",
    serverMisconfigured:
      "Disclo starter stadig på vores servere. Prøv igen om et par minutter. Hvis det gentager sig, så kontakt den, der styrer Disclo for din butik.",
    shopMissing:
      "Denne butik er ikke i Disclo endnu. I Shopify-admin åbner du Indstillinger → Apps og salgskanaler, søg efter Disclo, og installér eller åbn appen én gang. Mangler Disclo, installér den først fra Shopify App Store, og prøv igen.",
    planNotSynced:
      "Din plan er endnu ikke synkroniseret med Disclo. I Shopify-admin åbner du Indstillinger → Apps og salgskanaler → Disclo, bekræft at gratis- eller betaltplanen indlæses, vent et minut, kom tilbage hertil, og start en scanning igen.",
    noProducts:
      "Der er ingen produkter at scanne. Tilføj mindst ét produkt i Shopify-admin, og start en scanning igen.",
    productGone:
      "Vi kunne ikke indlæse det produkt fra Shopify. Det kan være fjernet. Åbn produktet i Shopify-admin, gem det, og opdater visningen igen.",
    catalogLoadFailed:
      "Shopify returnerede ikke dit katalog. Åbn Disclo fra Shopify-admin. Hvis det gentager sig, så geninstaller Disclo.",
    unexpectedFullScan:
      "Vi kunne ikke starte din scanning. Vent et minut, og tryk på Start fuld scanning igen.",
    unexpectedIncremental:
      "Vi kunne ikke sætte en scanning i kø for det produkt. Vent et minut, og gem produktet i Shopify-admin igen.",
  },

  oauth: {
    serverNotReady:
      "Disclo kan ikke gemme din session endnu: serverkryptering er ikke sat op. Prøv senere, eller kontakt den, der installerede appen.",
    databaseNotReady:
      "Der mangler påkrævede data i databasen (fx rækken for gratisplanen). Den, der kører Disclo, skal køre database-seed; så kan du prøve at installere igen.",
    missingAccessToken:
      "Log ind blev ikke færdig. I Shopify-admin åbner du Indstillinger → Apps og salgskanaler → Disclo, eller åbn Disclo fra app-listen, og fuldfør installationen igen.",
  },

  dashboard: {
    titleBar: "Disclo",
    unknownAction:
      "Den handling blev ikke genkendt. Genindlæs siden, og gem målmarkeder igen.",
    shopMissingMarkets:
      "Vi fandt ikke denne butik i Disclo. Geninstaller appen, og vælg målmarkeder igen.",
    marketsRequired:
      "Vælg mindst én region, så vi ved, hvilke regler der gælder. Vælg EU, USA eller en amerikansk delstat, og gem.",
    setupBannerTitle: "Færdiggør opsætning",
    setupBannerBody: (shopDomain: string) =>
      `Denne butik er ikke koblet i Disclo endnu. Luk appen, åbn den igen fra Shopify-admin, så login kan blive færdigt, og opdater siden. Domæne: ${shopDomain}.`,
    onboardingHeading: "Kom godt i gang",
    onboardingLinked: "App installeret og butik koblet",
    onboardingLinkShop: "Kobl din butik",
    onboardingMarketsOk: "Målmarkeder valgt",
    onboardingMarketsTodo: "Vælg målmarkeder nedenfor",
    onboardingScanOk: "Første scanning gennemført",
    onboardingScanTodo: "Kør en scanning for at se overholdelsesscorer",
    activeScanTitle: "Din scanning kører",
    activeScanBody: (processed: number, total: string) =>
      `Behandlet ${processed} af ${total} produkter.`,
    openLiveProgress: "Åbn live-fremskridt",
    scanFailedTitle: "Din scanning startede ikke",
    marketsFailedTitle: "Målmarkeder blev ikke gemt",
    complianceHeading: "Overholdelsesscore",
    complianceUnavailable: "Ikke tilgængelig endnu",
    complianceHelp:
      "0–100 fra din senest afsluttede scanning. Mens en scanning kører, forbliver den forrige score synlig.",
    planHeading: "Plan",
    lastScanHeading: "Seneste scanning",
    noScansYet: "Ingen scanninger endnu",
    lastScanStatus: (status: string) => `Status: ${status}`,
    riskHeading: "Risikofordeling (senest afsluttede scanning)",
    riskHelp: "Antal efter højeste alvor, vi gav hver vare.",
    riskHigh: (n: number, pct: number) => `Høj: ${n} (${pct}%)`,
    riskReview: (n: number, pct: number) => `Gennemgå: ${n} (${pct}%)`,
    riskClear: (n: number, pct: number) => `Ingen markering: ${n} (${pct}%)`,
    regulationsHeading: "Gældende regler",
    regulationsHelp:
      "Udledt af målmarkeder. Badge og oplysningstekster følger disse regler.",
    regAi: "AI Act-overholdelse",
    regGreen: "Miljøpåstande",
    marketsHeading: "Målmarkeder",
    marketsHelp: "Styrer hvilke regler der gælder. Ændringer gælder næste scanning.",
    choiceListTitle: "Markeder",
    saving: "Gemmer…",
    quickActionsHeading: "Hurtige handlinger",
    startFullScan: "Start fuld scanning",
    quickActionsHelp: (merchantSupportEmail: string | null) => {
      const base =
        "Sæt hele dit katalog i kø; din plan kan begrænse, hvor mange varer der kører. Efter start åbner vi skærmen med live-fremskridt.";
      if (merchantSupportEmail) {
        return `${base} Spørgsmål? Mail ${merchantSupportEmail}.`;
      }
      return `${base} Spørgsmål? Kontakt den, der installerede Disclo for din butik.`;
    },
  },

  scansList: {
    titleBar: "Scanninger",
    intro:
      "Indsnævr listen, når mindst én vare matcher en regel. Sortér efter starttidspunkt for hver scanning. Eksporter valgte scannings-ID’er som CSV.",
    filterLabel: "Regel på varer",
    filterAria: "Filtrér scanninger efter regelkode på varer",
    allRegulations: "Alle regler",
    applyRegulationFilter: "Anvend regelfilter",
    tableStarted: "Startet",
    tableType: "Type",
    tableStatus: "Status",
    tableItems: "Varer",
    tableScore: "Score",
    tableFlagged: "Markeret",
    tableActions: "Handlinger",
    openRow: "Åbn",
    exportCsv: "Eksporter scannings-ID’er (CSV)",
    emptyTitle: "Ingen scanninger matcher denne visning",
    emptyDescription:
      "Kør en fuld scanning fra dashboardet, eller fjern regelfilteret, hvis det er sat.",
    footnote:
      "Etiketter pr. vare og anmeldervalg kommer snart. Åbn en række for at se fremskridt og scorer for den kørsel.",
    openDashboard: "Åbn dashboard",
  },

  scanProgress: {
    backScans: "Scanninger",
    titleBar: "Live-fremskridt for scanning",
    scanIdLine: (id: string) => `Scannings-ID: ${id}`,
    completedTitle: "Din scanning er færdig",
    completedBody: (score: string, flagged: string) =>
      `Overholdelsesscore: ${score}. Markerede varer: ${flagged}.`,
    runningTitle: "Scanner stadig dit katalog",
    runningBody:
      "Skærmen opdateres hvert par sekunder. Vi kører tekst-, billede- og miljøpåstandstjek sammen for hvert produkt.",
    overallHeading: "Samlet",
    overallProcessed: (processed: number, total: string) =>
      `Behandlet ${processed} af ${total} produkter`,
    pipelineHeading: "Pipeline-trin",
    pipelineHelp:
      "Alle tre kører i ét gennemløb pr. produkt. Bjælkerne følger samme samlede fremskridt.",
    stageText: "Tekstdetektering",
    stageImage: "Billeddetektering",
    stageClaims: "Miljøpåstande",
    openDashboard: "Åbn dashboard",
    invalidLink: "Det scanningslink er ugyldigt.",
    scanNotFound:
      "Vi fandt ikke den scanning for denne butik. Åbn Scanninger i menuen, og vælg et nyligt kørsel.",
  },

  scanAction: {
    wrongMethod:
      "Brug knappen Start fuld scanning på dashboardet. Har du gemt denne URL som bogmærke, så gå tilbage til appens startside.",
  },

  settings: {
    pageTitle: "Butiksindstillinger",
    titleBar: "Indstillinger",
    languageHeading: "Sprog",
    languageBody:
      "Vælg et sprog til Disclo i denne browser. Det gemmes, indtil du ændrer det. Browsersprog følger system eller browser, når vi understøtter det.",
    languageLabel: "App-sprog",
    languageSave: "Gem sprog",
    languageBrowserDefault: "Browsersprog",
    languageSaved: "Sprog gemt.",
    marketsHeading: "Målmarkeder",
    marketsBody:
      "Regioner styrer, hvilke regler der gælder (EU AI Act, Florida, New York, føderale USA, EU-miljøpåstande). Brug målmarkedslisten på dashboardet til live-værdier; dette felt er kun forhåndsvisning (standard EU).",
    marketsFieldLabel: "Målmarkeder (kommasepareret)",
    marketsHelpText: "Brug EU, US, US-FL eller US-NY. Eksempel: EU, US-FL",
  },

  auth: {
    heading: "Log ind på Disclo",
    shopLabel: "Butiksdomæne",
    shopHelp:
      "Brug dit .myshopify.com-domæne, fx din-butik.myshopify.com",
    submit: "Log ind med Shopify",
    missingShop:
      "Indtast dit .myshopify.com-domæne, og tryk på Log ind med Shopify.",
    invalidShop:
      "Det domæne ligner ikke en Shopify-butik. Tjek stavning, og brug din-butik.myshopify.com.",
  },

  marketing: {
    heading: "Disclo",
    tagline:
      "AI Act-overholdelse og kontrol af miljøpåstande for dit Shopify-katalog. Åbn appen fra Shopify-admin for at komme i gang.",
    shopExample: "Eksempel: din-butik.myshopify.com",
    bulletScans:
      "Scanninger: kataloget gennemgår tekst-, billede- og miljøpåstandstjek i ét forløb.",
    bulletScores:
      "Scorer: se overholdelsesscore og hvilke regler der gælder ud fra dine salgsregioner.",
    bulletDisclosures:
      "Oplysninger: hold etiketter på linje med EU AI Act og forventninger til miljøpåstande, mens du ruller ud i produktet.",
  },

  hints: {
    openAppsToManagePlan: "Åbn Apps og salgskanaler",
  },

  nav: {
    dashboard: "Dashboard",
    scans: "Scanninger",
    settings: "Indstillinger",
  },

  footer: {
    language: "Sprog",
    languageLabel: "App-sprog",
  },
};
