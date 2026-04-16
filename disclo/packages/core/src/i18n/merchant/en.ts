import { merchantHintsEn } from "./hints-en.js";

/** Merchant-facing English strings (embedded app + shared server errors). */
export const merchantMessagesEn = {
  support: {
    withEmail: (email: string) =>
      `If this keeps happening, email ${email} and briefly describe what you were doing.`,
    withoutEmail:
      "If this keeps happening, contact whoever installed Disclo for your store.",
  },

  scan: {
    queueUnavailable:
      "We can't queue scans right now because the background job service is not responding. Wait a few minutes, then tap Start full scan again.",
    serverMisconfigured:
      "Disclo is still starting on our servers. Try again in a few minutes. If this keeps happening, contact whoever runs Disclo for your store.",
    shopMissing:
      "This store is not in Disclo yet. In Shopify admin, open Settings → Apps and sales channels, search for Disclo, and install or open it once. If Disclo is missing, install it from the Shopify App Store first, then try again.",
    planNotSynced:
      "Your plan has not synced to Disclo yet. In Shopify admin, open Settings → Apps and sales channels → Disclo, confirm the free tier or paid plan loads, wait one minute, then return here and start a scan again.",
    noProducts:
      "There are no products to scan. Add at least one product in Shopify admin, then start a scan again.",
    productGone:
      "We could not load that product from Shopify. It may have been removed. Open the product in Shopify admin, save it, then update the listing again.",
    catalogLoadFailed:
      "Shopify did not return your catalog. Open Disclo from Shopify admin. If this repeats, reinstall Disclo.",
    unexpectedFullScan:
      "We could not start your scan. Wait a minute, then tap Start full scan again.",
    unexpectedIncremental:
      "We could not queue a scan for that product. Wait a minute, then save the product in Shopify admin again.",
  },

  oauth: {
    serverNotReady:
      "Disclo cannot store your session yet because server encryption is not configured. Try again later, or contact whoever installed the app.",
    databaseNotReady:
      "Disclo is missing required database data (for example the free plan row). Whoever runs Disclo should run database seed, then you can try installing again.",
    missingAccessToken:
      "Sign-in did not finish. In Shopify admin, open Settings → Apps and sales channels → Disclo, or open Disclo from the Apps list, and complete install again.",
  },

  dashboard: {
    titleBar: "Disclo",
    unknownAction:
      "That request was not recognized. Reload the page, then save target markets again.",
    shopMissingMarkets:
      "We couldn't find this shop in Disclo. Reinstall the app, then choose target markets again.",
    marketsRequired:
      "Choose at least one region so we know which rules apply. Pick EU, US, or a state, then save.",
    setupBannerTitle: "Finish setup",
    setupBannerBody: (shopDomain: string) =>
      `This shop is not linked in Disclo yet. Close the app, open it again from Shopify admin so sign-in can finish, then refresh this page. Domain: ${shopDomain}.`,
    onboardingHeading: "Getting started",
    onboardingLinked: "App installed and shop linked",
    onboardingLinkShop: "Link your shop",
    onboardingMarketsOk: "Target markets selected",
    onboardingMarketsTodo: "Choose target markets below",
    onboardingScanOk: "First scan completed",
    onboardingScanTodo: "Run a scan to see compliance scores",
    activeScanTitle: "Your scan is running",
    activeScanBody: (processed: number, total: string) =>
      `Processed ${processed} of ${total} products.`,
    openLiveProgress: "Open live progress",
    scanFailedTitle: "Your scan did not start",
    marketsFailedTitle: "Target markets did not save",
    complianceHeading: "Compliance score",
    complianceUnavailable: "Not available yet",
    complianceHelp:
      "0–100 from your latest finished scan. While a scan runs, the previous score stays visible.",
    planHeading: "Plan",
    lastScanHeading: "Last scan",
    noScansYet: "No scans yet",
    lastScanStatus: (status: string) => `Status: ${status}`,
    riskHeading: "Risk breakdown (last completed scan)",
    riskHelp: "Counts by the highest severity we assigned to each item.",
    riskHigh: (n: number, pct: number) => `High: ${n} (${pct}%)`,
    riskReview: (n: number, pct: number) => `Review: ${n} (${pct}%)`,
    riskClear: (n: number, pct: number) => `Clear: ${n} (${pct}%)`,
    regulationsHeading: "Applicable regulations",
    regulationsHelp:
      "Derived from target markets. Badge and disclosure copy follow these rules.",
    regAi: "AI Act Compliance",
    regGreen: "Green claims",
    marketsHeading: "Target markets",
    marketsHelp: "Picks which regulations apply. Changes apply to the next scan.",
    choiceListTitle: "Markets",
    saving: "Saving…",
    quickActionsHeading: "Quick actions",
    startFullScan: "Start full scan",
    quickActionsHelp: (merchantSupportEmail: string | null) => {
      const base =
        "Queues your whole catalog; your plan may cap how many items run. After you start, we open the live progress screen.";
      if (merchantSupportEmail) {
        return `${base} Questions? Email ${merchantSupportEmail}.`;
      }
      return `${base} Questions? Contact whoever installed Disclo for your store.`;
    },
  },

  scansList: {
    titleBar: "Scans",
    intro:
      "Narrow the list when at least one item matched a regulation. Sort by when each scan started. Export selected scan IDs as CSV for your records.",
    filterLabel: "Regulation on items",
    filterAria: "Filter scans by regulation code on items",
    allRegulations: "All regulations",
    applyRegulationFilter: "Apply regulation filter",
    tableStarted: "Started",
    tableType: "Type",
    tableStatus: "Status",
    tableItems: "Items",
    tableScore: "Score",
    tableFlagged: "Flagged",
    tableActions: "Actions",
    openRow: "Open",
    exportCsv: "Export scan IDs (CSV)",
    emptyTitle: "No scans match this view",
    emptyDescription:
      "Run a full scan from the dashboard, or clear the regulation filter if one is set.",
    footnote:
      "Per-item labels and reviewer actions are coming soon. Open a scan row to see progress and scores for that run.",
    openDashboard: "Open dashboard",
  },

  scanProgress: {
    backScans: "Scans",
    titleBar: "Live scan progress",
    scanIdLine: (id: string) => `Scan ID: ${id}`,
    completedTitle: "Your scan finished",
    completedBody: (score: string, flagged: string) =>
      `Compliance score: ${score}. Flagged items: ${flagged}.`,
    runningTitle: "Still scanning your catalog",
    runningBody:
      "This screen refreshes every few seconds. We run text, image, and green-claims checks together for each product.",
    overallHeading: "Overall",
    overallProcessed: (processed: number, total: string) =>
      `Processed ${processed} of ${total} products`,
    pipelineHeading: "Pipeline stages",
    pipelineHelp:
      "All three run in one pass per product. Bars track the same overall progress.",
    stageText: "Text detection",
    stageImage: "Image detection",
    stageClaims: "Green claims",
    openDashboard: "Open dashboard",
    invalidLink: "That scan link is invalid.",
    scanNotFound:
      "We couldn't find that scan for this shop. Open Scans from the menu and pick a recent run.",
  },

  scanAction: {
    wrongMethod:
      "Use the Start full scan button on the dashboard. If you bookmarked this URL, go back to the app home.",
  },

  settings: {
    pageTitle: "Shop settings",
    titleBar: "Settings",
    languageHeading: "Language",
    languageBody:
      "Pick a language for Disclo in this browser. Your choice is saved here until you change it. Browser default follows your system or browser language when we support it.",
    languageLabel: "App language",
    languageSave: "Save language",
    languageBrowserDefault: "Browser default",
    languageSaved: "Language saved.",
    marketsHeading: "Target markets",
    marketsBody:
      "Regions drive which rules apply (EU AI Act, Florida, New York, federal US, EU green claims). Use the dashboard Target markets list to change live values; this field is a preview only (default EU).",
    marketsFieldLabel: "Target markets (comma-separated)",
    marketsHelpText: "Use EU, US, US-FL, or US-NY. Example: EU, US-FL",
  },

  auth: {
    heading: "Sign in to Disclo",
    shopLabel: "Shop domain",
    shopHelp:
      "Use your .myshopify.com domain, for example your-store.myshopify.com",
    submit: "Sign in with Shopify",
    missingShop:
      "Enter your .myshopify.com domain, then press Sign in with Shopify.",
    invalidShop:
      "That domain does not look like a Shopify shop. Check spelling and use your-store.myshopify.com.",
  },

  marketing: {
    heading: "Disclo",
    tagline:
      "AI Act Compliance and Green-claims checks for your Shopify catalog. Open the app from Shopify admin to get started.",
    shopExample: "Example: your-store.myshopify.com",
    bulletScans:
      "Scans: run your catalog through text, image, and green-claims checks in one flow.",
    bulletScores:
      "Scores: see a compliance score and which rules apply from the regions you sell into.",
    bulletDisclosures:
      "Disclosures: keep labels aligned with EU AI Act and green-claims expectations as you ship them in the product.",
  },

  hints: merchantHintsEn,

  nav: {
    dashboard: "Dashboard",
    scans: "Scans",
    settings: "Settings",
  },

  footer: {
    language: "Language",
    languageLabel: "App language",
  },
};
