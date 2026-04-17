import type { MerchantMessages } from "./types.js";

/** Merchant-facing Swedish strings. */
export const merchantMessagesSv: MerchantMessages = {
  support: {
    withEmail: (email: string) =>
      `Om det fortsätter, mejla ${email} och beskriv kort vad du gjorde.`,
    withoutEmail:
      "Om det fortsätter, kontakta den som installerade Disclo för din butik.",
  },

  scan: {
    queueUnavailable:
      "Vi kan inte köa skanningar just nu: bakgrundstjänsten svarar inte. Vänta några minuter och tryck på Starta fullständig skanning igen.",
    serverMisconfigured:
      "Disclo startar fortfarande på våra servrar. Försök igen om några minuter. Om det upprepas, kontakta den som hanterar Disclo för din butik.",
    shopMissing:
      "Den här butiken finns inte i Disclo ännu. I Shopify-admin öppnar du Inställningar → Appar och försäljningskanaler, sök efter Disclo och installera eller öppna appen en gång. Saknas Disclo, installera från Shopify App Store först och försök igen.",
    planNotSynced:
      "Din plan har inte synkats till Disclo ännu. I Shopify-admin öppnar du Inställningar → Appar och försäljningskanaler → Disclo, kontrollera att gratis- eller betalplanen laddas, vänta en minut, kom tillbaka hit och starta en skanning igen.",
    noProducts:
      "Det finns inga produkter att skanna. Lägg till minst en produkt i Shopify-admin och starta en skanning igen.",
    productGone:
      "Vi kunde inte ladda den produkten från Shopify. Den kan ha tagits bort. Öppna produkten i Shopify-admin, spara och uppdatera visningen igen.",
    catalogLoadFailed:
      "Shopify returnerade inte din katalog. Öppna Disclo från Shopify-admin. Om det upprepas, installera om Disclo.",
    unexpectedFullScan:
      "Vi kunde inte starta din skanning. Vänta en minut och tryck på Starta fullständig skanning igen.",
    unexpectedIncremental:
      "Vi kunde inte köa en skanning för den produkten. Vänta en minut och spara produkten i Shopify-admin igen.",
  },

  oauth: {
    serverNotReady:
      "Disclo kan inte spara din session än: serverkryptering är inte konfigurerad. Försök senare eller kontakta den som installerade appen.",
    databaseNotReady:
      "Obligatoriska data saknas i databasen (t.ex. raden för gratisplanen). Den som driver Disclo måste köra databassådd; då kan du försöka installera igen.",
    missingAccessToken:
      "Inloggningen blev inte klar. I Shopify-admin öppnar du Inställningar → Appar och försäljningskanaler → Disclo, eller öppna Disclo från app-listan, och slutför installationen igen.",
  },

  dashboard: {
    titleBar: "Disclo AI-efterlevnad",
    unknownAction:
      "Begäran kändes inte igen. Ladda om sidan och spara målmarknader igen.",
    shopMissingMarkets:
      "Vi hittade inte den här butiken i Disclo. Installera om appen och välj målmarknader igen.",
    marketsRequired:
      "Välj minst en region så vi vet vilka regler som gäller. Välj EU, USA eller en amerikansk delstat och spara.",
    setupBannerTitle: "Slutför inställningen",
    setupBannerBody: (shopDomain: string) =>
      `Den här butiken är inte kopplad i Disclo än. Stäng appen, öppna den igen från Shopify-admin så inloggningen kan slutföras, och uppdatera sidan. Domän: ${shopDomain}.`,
    onboardingHeading: "Kom igång",
    onboardingLinked: "App installerad och butik kopplad",
    onboardingLinkShop: "Koppla din butik",
    onboardingMarketsOk: "Målmarknader valda",
    onboardingMarketsTodo: "Välj målmarknader nedan",
    onboardingScanOk: "Första skanningen klar",
    onboardingScanTodo: "Kör en skanning för att se efterlevnadsbetyg",
    activeScanTitle: "Din skanning pågår",
    activeScanBody: (processed: number, total: string) =>
      `Bearbetade ${processed} av ${total} produkter.`,
    openLiveProgress: "Öppna liveförlopp",
    scanFailedTitle: "Din skanning startade inte",
    marketsFailedTitle: "Målmarknader sparades inte",
    complianceHeading: "Efterlevnadsbetyg",
    complianceUnavailable: "Inte tillgängligt än",
    complianceHelp:
      "0–100 från din senast avslutade skanning. Under en skanning syns föregående betyg kvar.",
    planHeading: "Plan",
    lastScanHeading: "Senaste skanning",
    noScansYet: "Inga skanningar än",
    lastScanStatus: (status: string) => `Status: ${status}`,
    riskHeading: "Riskfördelning (senast avslutade skanning)",
    riskHelp: "Antal per högsta allvar vi gav varje artikel.",
    riskHigh: (n: number, pct: number) => `Hög: ${n} (${pct}%)`,
    riskReview: (n: number, pct: number) => `Granska: ${n} (${pct}%)`,
    riskClear: (n: number, pct: number) => `Ingen flagga: ${n} (${pct}%)`,
    regulationsHeading: "Tillämpliga regler",
    regulationsHelp:
      "Härledda från målmarknader. Bricka och upplysningstexter följer dessa regler.",
    regAi: "Efterlevnad av AI-innehåll",
    regGreen: "Miljöpåståenden",
    marketsHeading: "Målmarknader",
    marketsHelp: "Styr vilka regler som gäller. Ändringar gäller nästa skanning.",
    choiceListTitle: "Marknader",
    saving: "Sparar…",
    quickActionsHeading: "Snabbåtgärder",
    startFullScan: "Starta fullständig skanning",
    quickActionsHelp: (merchantSupportEmail: string | null) => {
      const base =
        "Köar hela din katalog; din plan kan begränsa hur många artiklar som körs. Efter start öppnar vi skärmen med liveförlopp.";
      if (merchantSupportEmail) {
        return `${base} Frågor? Mejla ${merchantSupportEmail}.`;
      }
      return `${base} Frågor? Kontakta den som installerade Disclo för din butik.`;
    },
  },

  scansList: {
    titleBar: "Skanningar",
    intro:
      "Förnya listan när minst en artikel matchar en regel. Sortera efter skanningens start. Exportera valda skannings-ID som CSV.",
    filterLabel: "Regel på artiklar",
    filterAria: "Filtrera skanningar efter regelkod på artiklar",
    allRegulations: "Alla regler",
    applyRegulationFilter: "Använd regelfilter",
    tableStarted: "Startad",
    tableType: "Typ",
    tableStatus: "Status",
    tableItems: "Artiklar",
    tableScore: "Betyg",
    tableFlagged: "Flaggade",
    tableActions: "Åtgärder",
    openRow: "Öppna",
    exportCsv: "Exportera skannings-ID (CSV)",
    emptyTitle: "Inga skanningar matchar den här vyn",
    emptyDescription:
      "Kör en fullständig skanning från instrumentpanelen eller ta bort regelfiltret om det är aktivt.",
    footnote:
      "Etiketter per artikel och granskningsåtgärder kommer snart. Öppna en rad för att se förlopp och betyg för den körningen.",
    openDashboard: "Öppna instrumentpanel",
  },

  scanProgress: {
    backScans: "Skanningar",
    titleBar: "Liveförlopp för skanning",
    scanIdLine: (id: string) => `Skannings-ID: ${id}`,
    completedTitle: "Din skanning är klar",
    completedBody: (score: string, flagged: string) =>
      `Efterlevnadsbetyg: ${score}. Flaggade artiklar: ${flagged}.`,
    runningTitle: "Skannar fortfarande din katalog",
    runningBody:
      "Skärmen uppdateras varje par sekunder. Vi kör text-, bild- och miljöpåståendekontroller tillsammans per produkt.",
    overallHeading: "Totalt",
    overallProcessed: (processed: number, total: string) =>
      `Bearbetade ${processed} av ${total} produkter`,
    pipelineHeading: "Pipelinesteg",
    pipelineHelp:
      "Alla tre körs i ett steg per produkt. Staplarna följer samma totala förlopp.",
    stageText: "Textdetektering",
    stageImage: "Bilddetektering",
    stageClaims: "Miljöpåståenden",
    openDashboard: "Öppna instrumentpanel",
    invalidLink: "Den skanningslänken är ogiltig.",
    scanNotFound:
      "Vi hittade inte den skanningen för den här butiken. Öppna Skanningar i menyn och välj en nyligen körning.",
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
      "Använd knappen Starta fullständig skanning på instrumentpanelen. Om du sparat den här URL:en som bokmärke, gå tillbaka till appens startsida.",
  },

  settings: {
    pageTitle: "Butiksinställningar",
    titleBar: "Inställningar",
    languageHeading: "Språk",
    languageBody:
      "Välj språk för Disclo i den här webbläsaren. Valet sparas tills du ändrar det. Webbläsarens språk följer system eller webbläsare när vi stöder det.",
    languageLabel: "Appspråk",
    languageSave: "Spara språk",
    languageBrowserDefault: "Webbläsarens språk",
    languageSaved: "Språk sparat.",
    marketsHeading: "Målmarknader",
    marketsBody:
      "Regioner styr vilka regler som gäller (EU AI Act, Florida, New York, federala USA, EU-miljöpåståenden). Använd målmarknadslistan på instrumentpanelen för livevärden; det här fältet är bara förhandsvisning (standard EU).",
    marketsFieldLabel: "Målmarknader (kommaseparerade)",
    marketsHelpText: "Använd EU, US, US-FL eller US-NY. Exempel: EU, US-FL",
  },

  auth: {
    heading: "Logga in på Disclo",
    shopLabel: "Butiksdomän",
    shopHelp:
      "Använd din .myshopify.com-domän, till exempel din-butik.myshopify.com",
    submit: "Logga in med Shopify",
    missingShop:
      "Ange din .myshopify.com-domän och tryck på Logga in med Shopify.",
    invalidShop:
      "Domänen ser inte ut som en Shopify-butik. Kontrollera stavning och använd din-butik.myshopify.com.",
  },

  marketing: {
    heading: "Disclo - Efterlevnad av AI-innehåll",
    tagline:
      "Efterlevnad av AI-innehåll och kontroll av miljöpåståenden för din Shopify-katalog. Öppna appen från Shopify-admin för att börja.",
    shopExample: "Exempel: din-butik.myshopify.com",
    bulletScans:
      "Skanningar: katalogen körs genom text-, bild- och miljöpåståendekontroller i ett flöde.",
    bulletScores:
      "Betyg: se efterlevnadsbetyg och vilka regler som gäller utifrån var du säljer.",
    bulletDisclosures:
      "Upplysningar: håll etiketter i linje med EU AI Act och förväntningar på miljöpåståenden när du rullar ut i produkten.",
  },

  hints: {
    openAppsToManagePlan: "Öppna appar och försäljningskanaler",
  },

  nav: {
    dashboard: "Disclo AI-efterlevnad",
    scans: "Skanningar",
    settings: "Inställningar",
  },

  footer: {
    language: "Språk",
    languageLabel: "Appspråk",
  },
};
