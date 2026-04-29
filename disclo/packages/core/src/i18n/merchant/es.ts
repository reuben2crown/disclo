import type { MerchantMessages } from "./types.js";

/** Merchant-facing Spanish strings. */
export const merchantMessagesEs: MerchantMessages = {
  support: {
    withEmail: (email: string) =>
      `Si sigue pasando, escribe a ${email} y cuenta brevemente qué estabas haciendo.`,
    withoutEmail:
      "Si sigue pasando, contacta a quien instaló Disclo en tu tienda.",
  },

  scan: {
    queueUnavailable:
      "Ahora no podemos poner análisis en cola: el servicio de tareas en segundo plano no responde. Espera unos minutos y vuelve a pulsar Iniciar análisis completo.",
    serverMisconfigured:
      "Disclo aún está arrancando en nuestros servidores. Vuelve a intentarlo en unos minutos. Si se repite, contacta a quien gestiona Disclo para tu tienda.",
    shopMissing:
      "Esta tienda aún no está en Disclo. En el admin de Shopify, abre Configuración → Aplicaciones y canales de ventas, busca Disclo e instálala o ábrela una vez. Si no aparece Disclo, instálala primero desde Shopify App Store e inténtalo de nuevo.",
    planNotSynced:
      "Tu plan aún no se ha sincronizado con Disclo. En el admin de Shopify, abre Configuración → Aplicaciones y canales de ventas → Disclo, confirma que se carga el plan gratuito o de pago, espera un minuto, vuelve aquí e inicia un análisis de nuevo.",
    noProducts:
      "No hay productos que analizar. Añade al menos un producto en el admin de Shopify y vuelve a iniciar un análisis.",
    productGone:
      "No pudimos cargar ese producto desde Shopify. Puede que se haya eliminado. Abre el producto en el admin de Shopify, guárdalo y actualiza la ficha otra vez.",
    catalogLoadFailed:
      "Shopify no devolvió tu catálogo. Abre Disclo desde el admin de Shopify. Si se repite, reinstala Disclo.",
    unexpectedFullScan:
      "No pudimos iniciar tu análisis. Espera un minuto y vuelve a pulsar Iniciar análisis completo.",
    unexpectedIncremental:
      "No pudimos poner en cola un análisis para ese producto. Espera un minuto y vuelve a guardar el producto en el admin de Shopify.",
  },

  oauth: {
    serverNotReady:
      "Disclo aún no puede guardar tu sesión: el cifrado del servidor no está configurado. Vuelve más tarde o contacta a quien instaló la app.",
    databaseNotReady:
      "Faltan datos obligatorios en la base (por ejemplo la fila del plan gratuito). Quien opera Disclo debe ejecutar la carga inicial de la base; luego podrás reinstalar.",
    missingAccessToken:
      "El inicio de sesión no terminó. En el admin de Shopify, abre Configuración → Aplicaciones y canales de ventas → Disclo, o abre Disclo desde la lista de aplicaciones, y completa de nuevo la instalación.",
  },

  dashboard: {
    titleBar: "Disclo cumplimiento IA",
    unknownAction:
      "No reconocimos esa acción. Recarga la página y vuelve a guardar los mercados objetivo.",
    shopMissingMarkets:
      "No encontramos esta tienda en Disclo. Reinstala la app y elige de nuevo los mercados objetivo.",
    marketsRequired:
      "Elige al menos una región para saber qué normas aplican. Selecciona UE, EE. UU. o un estado, y guarda.",
    setupBannerTitle: "Terminar la configuración",
    setupBannerBody: (shopDomain: string) =>
      `Esta tienda aún no está vinculada en Disclo. Cierra la app, ábrela otra vez desde el admin de Shopify para terminar el acceso, y recarga esta página. Dominio: ${shopDomain}.`,
    onboardingHeading: "Primeros pasos",
    onboardingLinked: "App instalada y tienda vinculada",
    onboardingLinkShop: "Vincula tu tienda",
    onboardingMarketsOk: "Mercados objetivo seleccionados",
    onboardingMarketsTodo: "Elige los mercados objetivo abajo",
    onboardingScanOk: "Primer análisis completado",
    onboardingScanTodo: "Ejecuta un análisis para ver las puntuaciones de cumplimiento",
    activeScanTitle: "Tu análisis está en curso",
    activeScanBody: (processed: number, total: string) =>
      `Procesados ${processed} de ${total} productos.`,
    openLiveProgress: "Abrir progreso en vivo",
    scanFailedTitle: "Tu análisis no se inició",
    marketsFailedTitle: "No se guardaron los mercados objetivo",
    complianceHeading: "Puntuación de cumplimiento",
    complianceUnavailable: "Aún no disponible",
    complianceHelp:
      "De 0 a 100 según tu último análisis terminado. Mientras corre un análisis, sigue visible la puntuación anterior.",
    planHeading: "Plan",
    lastScanHeading: "Último análisis",
    noScansYet: "Aún no hay análisis",
    lastScanStatus: (status: string) => `Estado: ${status}`,
    riskHeading: "Desglose de riesgo (último análisis terminado)",
    riskHelp: "Recuentos por la gravedad más alta que asignamos a cada artículo.",
    riskHigh: (n: number, pct: number) => `Alto: ${n} (${pct}%)`,
    riskReview: (n: number, pct: number) => `Revisar: ${n} (${pct}%)`,
    riskClear: (n: number, pct: number) => `Sin alerta: ${n} (${pct}%)`,
    regulationsHeading: "Normativa aplicable",
    regulationsHelp:
      "Se deriva de los mercados objetivo. La insignia y los textos de divulgación siguen estas normas.",
    regAi: "Cumplimiento del contenido con IA",
    regGreen: "Afirmaciones ambientales",
    marketsHeading: "Mercados objetivo",
    marketsHelp: "Define qué normas aplican. Los cambios valen para el siguiente análisis.",
    choiceListTitle: "Mercados",
    saving: "Guardando…",
    quickActionsHeading: "Acciones rápidas",
    startFullScan: "Iniciar análisis completo",
    quickActionsHelp: (merchantSupportEmail: string | null) => {
      const base =
        "Encola todo tu catálogo; tu plan puede limitar cuántos artículos se ejecutan. Al iniciar, abrimos la pantalla de progreso en vivo.";
      if (merchantSupportEmail) {
        return `${base} ¿Dudas? Escribe a ${merchantSupportEmail}.`;
      }
      return `${base} ¿Dudas? Contacta a quien instaló Disclo en tu tienda.`;
    },
  },

  scansList: {
    titleBar: "Análisis",
    intro:
      "Reduce la lista cuando al menos un artículo coincida con una norma. Ordena por inicio de cada análisis. Exporta los ID seleccionados en CSV para tus registros.",
    filterLabel: "Norma en los artículos",
    filterAria: "Filtrar análisis por código de norma en los artículos",
    allRegulations: "Todas las normas",
    applyRegulationFilter: "Aplicar filtro de norma",
    tableStarted: "Inicio",
    tableType: "Tipo",
    tableStatus: "Estado",
    tableItems: "Artículos",
    tableScore: "Puntuación",
    tableFlagged: "Marcados",
    tableActions: "Acciones",
    openRow: "Abrir",
    exportCsv: "Exportar ID de análisis (CSV)",
    emptyTitle: "Ningún análisis coincide con esta vista",
    emptyDescription:
      "Ejecuta un análisis completo desde el panel, o quita el filtro de norma si está activo.",
    footnote:
      "Las etiquetas por artículo y acciones de revisión llegarán pronto. Abre una fila de análisis para ver el progreso y las puntuaciones de esa ejecución.",
    openDashboard: "Abrir panel",
  },

  scanProgress: {
    backScans: "Análisis",
    titleBar: "Progreso del análisis en vivo",
    scanIdLine: (id: string) => `ID de análisis: ${id}`,
    completedTitle: "Tu análisis terminó",
    completedBody: (score: string, flagged: string) =>
      `Puntuación de cumplimiento: ${score}. Artículos marcados: ${flagged}.`,
    runningTitle: "Siguimos analizando tu catálogo",
    runningBody:
      "Esta pantalla se actualiza cada pocos segundos. Ejecutamos juntos texto, imagen y afirmaciones ambientales por producto.",
    overallHeading: "Resumen",
    overallProcessed: (processed: number, total: string) =>
      `Procesados ${processed} de ${total} productos`,
    pipelineHeading: "Etapas del flujo",
    pipelineHelp:
      "Las tres van en una sola pasada por producto. Las barras siguen el mismo progreso global.",
    stageText: "Detección de texto",
    stageImage: "Detección de imagen",
    stageClaims: "Afirmaciones ambientales",
    openDashboard: "Abrir panel",
    invalidLink: "Ese enlace de análisis no es válido.",
    scanNotFound:
      "No encontramos ese análisis para esta tienda. Abre Análisis en el menú y elige una ejecución reciente.",
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
      "Usa el botón Iniciar análisis completo en el panel. Si guardaste esta URL en favoritos, vuelve al inicio de la app.",
  },

  settings: {
    pageTitle: "Ajustes de la tienda",
    titleBar: "Ajustes",
    languageHeading: "Idioma",
    languageBody:
      "Elige un idioma para Disclo en este navegador. Se guarda aquí hasta que lo cambies. El idioma del navegador sigue al sistema o al navegador cuando lo admitimos.",
    languageLabel: "Idioma de la app",
    languageSave: "Guardar idioma",
    languageBrowserDefault: "Idioma del navegador",
    languageSaved: "Idioma guardado.",
    marketsHeading: "Mercados objetivo",
    marketsBody:
      "Las regiones marcan qué normas aplican (AI Act de la UE, Florida, Nueva York, EE. UU. federal, afirmaciones verdes en la UE). Usa la lista de mercados objetivo del panel para los valores activos; este campo solo es vista previa (UE por defecto).",
    marketsFieldLabel: "Mercados objetivo (separados por comas)",
    marketsHelpText: "Usa EU, US, US-FL o US-NY. Ejemplo: EU, US-FL",
  },

  auth: {
    heading: "Entrar en Disclo",
    shopLabel: "Dominio de la tienda",
    shopHelp:
      "Usa tu dominio .myshopify.com, por ejemplo tu-tienda.myshopify.com",
    submit: "Entrar con Shopify",
    missingShop:
      "Introduce tu dominio .myshopify.com y pulsa Entrar con Shopify.",
    invalidShop:
      "Ese dominio no parece una tienda Shopify. Revisa la ortografía y usa tu-tienda.myshopify.com.",
  },

  marketing: {
    heading: "Disclo - Cumplimiento del contenido con IA",
    tagline:
      "Cumplimiento del contenido con IA y comprobación de afirmaciones ambientales para tu catálogo Shopify. Abre la app desde el admin de Shopify para empezar.",
    shopExample: "Ejemplo: tu-tienda.myshopify.com",
    bulletScans:
      "Análisis: pasa tu catálogo por texto, imagen y afirmaciones ambientales en un solo flujo.",
    bulletScores:
      "Puntuaciones: ve una nota de cumplimiento y qué normas aplican según dónde vendes.",
    bulletDisclosures:
      "Divulgación: alinea etiquetas con el AI Act de la UE y las expectativas de afirmaciones verdes al publicar en el producto.",
  },

  hints: {
    openAppsToManagePlan: "Abrir Aplicaciones y canales de ventas",
  },

  nav: {
    dashboard: "Disclo cumplimiento IA",
    scans: "Análisis",
    audit: "Audit log",
    billing: "Plans & billing",
    settings: "Ajustes",
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
    language: "Idioma",
    languageLabel: "Idioma de la app",
  },
};
