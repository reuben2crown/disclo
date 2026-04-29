import type { MerchantMessages } from "./types.js";

/** Merchant-facing Polish strings. */
export const merchantMessagesPl: MerchantMessages = {
  support: {
    withEmail: (email: string) =>
      `Jeśli problem wraca, napisz na ${email} i krótko opisz, co robiłeś/ałaś.`,
    withoutEmail:
      "Jeśli problem wraca, skontaktuj się z osobą, która zainstalowała Disclo w Twoim sklepie.",
  },

  scan: {
    queueUnavailable:
      "Nie możemy teraz kolejkować skanów: usługa zadań w tle nie odpowiada. Poczekaj kilka minut i ponownie dotknij Uruchom pełny skan.",
    serverMisconfigured:
      "Disclo nadal się uruchamia na naszych serwerach. Spróbuj ponownie za kilka minut. Jeśli się powtarza, skontaktuj się z osobą zarządzającą Disclo dla Twojego sklepu.",
    shopMissing:
      "Ten sklep nie jest jeszcze w Disclo. Zainstaluj Disclo ponownie ze Shopify App Store, otwórz aplikację raz z panelu Shopify i spróbuj ponownie.",
    planNotSynced:
      "Twój plan nie zsynchronizował się jeszcze z Disclo. Otwórz aplikację z panelu Shopify, potwierdź darmowy plan lub subskrypcję, poczekaj minutę i uruchom skan ponownie.",
    noProducts:
      "Brak produktów do skanowania. Dodaj co najmniej jeden produkt w panelu Shopify i uruchom skan ponownie.",
    productGone:
      "Nie udało się wczytać tego produktu z Shopify. Mógł zostać usunięty. Otwórz produkt w panelu Shopify, zapisz go i zaktualizuj kartę ponownie.",
    catalogLoadFailed:
      "Shopify nie zwróciło katalogu. Otwórz Disclo z panelu Shopify. Jeśli się powtarza, zainstaluj Disclo ponownie.",
    unexpectedFullScan:
      "Nie udało się uruchomić skanu. Poczekaj minutę i ponownie dotknij Uruchom pełny skan.",
    unexpectedIncremental:
      "Nie udało się zakolejkować skanu dla tego produktu. Poczekaj minutę i zapisz produkt w panelu Shopify ponownie.",
  },

  oauth: {
    serverNotReady:
      "Disclo nie może jeszcze zapisać sesji: szyfrowanie po stronie serwera nie jest skonfigurowane. Spróbuj później lub skontaktuj się z osobą, która zainstalowała aplikację.",
    databaseNotReady:
      "Brakuje wymaganych danych w bazie (np. wiersza darmowego planu). Osoba obsługująca Disclo musi uruchomić seed bazy; potem możesz ponowić instalację.",
    missingAccessToken:
      "Logowanie się nie zakończyło. W panelu Shopify otwórz Ustawienia → Aplikacje i kanały sprzedaży → Disclo lub Disclo z listy Aplikacje i ponownie dokończ instalację.",
  },

  dashboard: {
    titleBar: "Disclo zgodność AI",
    unknownAction:
      "Nie rozpoznaliśmy tego żądania. Odśwież stronę i zapisz rynki docelowe ponownie.",
    shopMissingMarkets:
      "Nie znaleźliśmy tego sklepu w Disclo. Zainstaluj aplikację ponownie i wybierz rynki docelowe jeszcze raz.",
    marketsRequired:
      "Wybierz co najmniej jeden region, żebyśmy wiedzieli, jakie zasady obowiązują. Wybierz UE, USA lub stan USA i zapisz.",
    setupBannerTitle: "Dokończ konfigurację",
    setupBannerBody: (shopDomain: string) =>
      `Ten sklep nie jest jeszcze połączony w Disclo. Zamknij aplikację, otwórz ją ponownie z panelu Shopify, aby dokończyć logowanie, i odśwież tę stronę. Domena: ${shopDomain}.`,
    onboardingHeading: "Pierwsze kroki",
    onboardingLinked: "Aplikacja zainstalowana i sklep połączony",
    onboardingLinkShop: "Połącz sklep",
    onboardingMarketsOk: "Wybrano rynki docelowe",
    onboardingMarketsTodo: "Wybierz rynki docelowe poniżej",
    onboardingScanOk: "Pierwszy skan zakończony",
    onboardingScanTodo: "Uruchom skan, aby zobaczyć wyniki zgodności",
    activeScanTitle: "Twój skan trwa",
    activeScanBody: (processed: number, total: string) =>
      `Przetworzono ${processed} z ${total} produktów.`,
    openLiveProgress: "Otwórz postęp na żywo",
    scanFailedTitle: "Skan się nie uruchomił",
    marketsFailedTitle: "Nie zapisano rynków docelowych",
    complianceHeading: "Wynik zgodności",
    complianceUnavailable: "Jeszcze niedostępny",
    complianceHelp:
      "0–100 z ostatniego ukończonego skanu. Podczas skanu widoczny pozostaje poprzedni wynik.",
    planHeading: "Plan",
    lastScanHeading: "Ostatni skan",
    noScansYet: "Brak skanów",
    lastScanStatus: (status: string) => `Status: ${status}`,
    riskHeading: "Podział ryzyka (ostatni ukończony skan)",
    riskHelp: "Liczby według najwyższego poziomu ważności przypisanego do każdej pozycji.",
    riskHigh: (n: number, pct: number) => `Wysoki: ${n} (${pct}%)`,
    riskReview: (n: number, pct: number) => `Do sprawdzenia: ${n} (${pct}%)`,
    riskClear: (n: number, pct: number) => `Bez alertu: ${n} (${pct}%)`,
    regulationsHeading: "Obowiązujące przepisy",
    regulationsHelp:
      "Wynikają z rynków docelowych. Odznaka i teksty ujawnień stosują się do tych zasad.",
    regAi: "Zgodność treści AI",
    regGreen: "Twierdzenia środowiskowe",
    marketsHeading: "Rynki docelowe",
    marketsHelp: "Określa, które przepisy obowiązują. Zmiany obowiązują przy następnym skanie.",
    choiceListTitle: "Rynki",
    saving: "Zapisywanie…",
    quickActionsHeading: "Szybkie działania",
    startFullScan: "Uruchom pełny skan",
    quickActionsHelp: (merchantSupportEmail: string | null) => {
      const base =
        "Kolejkuje cały katalog; plan może ograniczać liczbę pozycji. Po starcie otwieramy ekran postępu na żywo.";
      if (merchantSupportEmail) {
        return `${base} Pytania? Napisz na ${merchantSupportEmail}.`;
      }
      return `${base} Pytania? Skontaktuj się z osobą, która zainstalowała Disclo w Twoim sklepie.`;
    },
  },

  scansList: {
    titleBar: "Skany",
    intro:
      "Zawęż listę, gdy co najmniej jedna pozycja pasuje do przepisu. Sortuj według startu skanu. Eksportuj wybrane ID skanów do CSV.",
    filterLabel: "Przepis na pozycjach",
    filterAria: "Filtruj skany według kodu przepisu na pozycjach",
    allRegulations: "Wszystkie przepisy",
    applyRegulationFilter: "Zastosuj filtr przepisu",
    tableStarted: "Rozpoczęto",
    tableType: "Typ",
    tableStatus: "Status",
    tableItems: "Pozycje",
    tableScore: "Wynik",
    tableFlagged: "Oflagowane",
    tableActions: "Działania",
    openRow: "Otwórz",
    exportCsv: "Eksportuj ID skanów (CSV)",
    emptyTitle: "Brak skanów w tym widoku",
    emptyDescription:
      "Uruchom pełny skan z pulpitu lub usuń filtr przepisu, jeśli jest ustawiony.",
    footnote:
      "Etykiety per pozycja i działania recenzenta wkrótce. Otwórz wiersz skanu, aby zobaczyć postęp i wyniki tego uruchomienia.",
    openDashboard: "Otwórz pulpit",
  },

  scanProgress: {
    backScans: "Skany",
    titleBar: "Postęp skanu na żywo",
    scanIdLine: (id: string) => `ID skanu: ${id}`,
    completedTitle: "Skan zakończony",
    completedBody: (score: string, flagged: string) =>
      `Wynik zgodności: ${score}. Oflagowane pozycje: ${flagged}.`,
    runningTitle: "Skanowanie katalogu trwa",
    runningBody:
      "Ten ekran odświeża się co kilka sekund. Uruchamiamy razem tekst, obraz i twierdzenia środowiskowe dla każdego produktu.",
    overallHeading: "Ogółem",
    overallProcessed: (processed: number, total: string) =>
      `Przetworzono ${processed} z ${total} produktów`,
    pipelineHeading: "Etapy potoku",
    pipelineHelp:
      "Wszystkie trzy działają w jednym przebiegu na produkt. Paski pokazują ten sam ogólny postęp.",
    stageText: "Wykrywanie tekstu",
    stageImage: "Wykrywanie obrazu",
    stageClaims: "Twierdzenia środowiskowe",
    openDashboard: "Otwórz pulpit",
    invalidLink: "Ten link do skanu jest nieprawidłowy.",
    scanNotFound:
      "Nie znaleźliśmy tego skanu dla tego sklepu. Otwórz Skany w menu i wybierz ostatnie uruchomienie.",
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
      "Użyj przycisku Uruchom pełny skan na pulpicie. Jeśli zapisałeś ten URL w ulubionych, wróć do strony głównej aplikacji.",
  },

  settings: {
    pageTitle: "Ustawienia sklepu",
    titleBar: "Ustawienia",
    languageHeading: "Język",
    languageBody:
      "Wybierz język Disclo w tej przeglądarce. Zostaje zapisany, dopóki go nie zmienisz. Język przeglądarki podąża za systemem lub przeglądarką, gdy go obsługujemy.",
    languageLabel: "Język aplikacji",
    languageSave: "Zapisz język",
    languageBrowserDefault: "Język przeglądarki",
    languageSaved: "Język zapisany.",
    marketsHeading: "Rynki docelowe",
    marketsBody:
      "Regiony decydują, jakie zasady obowiązują (AI Act UE, Floryda, Nowy Jork, USA federalne, twierdzenia środowiskowe UE). Użyj listy rynków docelowych na pulpicie dla aktywnych wartości; to pole to tylko podgląd (domyślnie UE).",
    marketsFieldLabel: "Rynki docelowe (oddzielone przecinkami)",
    marketsHelpText: "Użyj EU, US, US-FL lub US-NY. Przykład: EU, US-FL",
  },

  auth: {
    heading: "Zaloguj się do Disclo",
    shopLabel: "Domena sklepu",
    shopHelp:
      "Użyj domeny .myshopify.com, np. twoj-sklep.myshopify.com",
    submit: "Zaloguj się przez Shopify",
    missingShop:
      "Wpisz domenę .myshopify.com i naciśnij Zaloguj się przez Shopify.",
    invalidShop:
      "Ta domena nie wygląda na sklep Shopify. Sprawdź pisownię i użyj twoj-sklep.myshopify.com.",
  },

  marketing: {
    heading: "Disclo - Zgodność treści AI",
    tagline:
      "Zgodność treści AI i kontrola twierdzeń środowiskowych dla katalogu Shopify. Otwórz aplikację z panelu Shopify, aby zacząć.",
    shopExample: "Przykład: twoj-sklep.myshopify.com",
    bulletScans:
      "Skany: katalog przechodzi przez tekst, obraz i twierdzenia środowiskowe w jednym przepływie.",
    bulletScores:
      "Wyniki: zobacz wynik zgodności i obowiązujące zasady według regionów sprzedaży.",
    bulletDisclosures:
      "Ujawnienia: trzymaj etykiety zgodne z AI Act UE i oczekiwaniami co do twierdzeń środowiskowych przy wdrażaniu w produkcie.",
  },

  hints: {
    openAppsToManagePlan: "Otwórz Aplikacje i kanały sprzedaży",
  },

  nav: {
    dashboard: "Disclo zgodność AI",
    scans: "Skany",
    audit: "Audit log",
    billing: "Plans & billing",
    settings: "Ustawienia",
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
    language: "Język",
    languageLabel: "Język aplikacji",
  },
};
