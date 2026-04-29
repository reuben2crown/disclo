import type { MerchantMessages } from "./types.js";

/** Merchant-facing Portuguese strings (neutral). */
export const merchantMessagesPt: MerchantMessages = {
  support: {
    withEmail: (email: string) =>
      `Se continuar, envie um e-mail para ${email} e diga brevemente o que estava a fazer.`,
    withoutEmail:
      "Se continuar, contacte quem instalou o Disclo na sua loja.",
  },

  scan: {
    queueUnavailable:
      "Não conseguimos colocar análises na fila: o serviço de tarefas em segundo plano não responde. Espere alguns minutos e toque novamente em Iniciar análise completa.",
    serverMisconfigured:
      "O Disclo ainda está a arrancar nos nossos servidores. Tente de novo em alguns minutos. Se repetir, contacte quem gere o Disclo para a sua loja.",
    shopMissing:
      "Esta loja ainda não está no Disclo. No admin da Shopify, abra Definições → Aplicações e canais de vendas, procure Disclo e instale ou abra a app uma vez. Se Disclo não aparecer, instale primeiro a partir da Shopify App Store e tente de novo.",
    planNotSynced:
      "O seu plano ainda não sincronizou com o Disclo. No admin da Shopify, abra Definições → Aplicações e canais de vendas → Disclo, confirme que o plano gratuito ou pago carrega, espere um minuto, volte aqui e inicie de novo uma análise.",
    noProducts:
      "Não há produtos para analisar. Adicione pelo menos um produto no admin da Shopify e inicie de novo uma análise.",
    productGone:
      "Não conseguimos carregar esse produto a partir da Shopify. Pode ter sido removido. Abra o produto no admin da Shopify, guarde e atualize a ficha outra vez.",
    catalogLoadFailed:
      "A Shopify não devolveu o seu catálogo. Abra o Disclo a partir do admin da Shopify. Se repetir, reinstale o Disclo.",
    unexpectedFullScan:
      "Não conseguimos iniciar a sua análise. Espere um minuto e toque novamente em Iniciar análise completa.",
    unexpectedIncremental:
      "Não conseguimos colocar na fila uma análise para esse produto. Espere um minuto e guarde de novo o produto no admin da Shopify.",
  },

  oauth: {
    serverNotReady:
      "O Disclo ainda não pode guardar a sua sessão: a encriptação do servidor não está configurada. Tente mais tarde ou contacte quem instalou a app.",
    databaseNotReady:
      "Faltam dados obrigatórios na base (por exemplo a linha do plano gratuito). Quem opera o Disclo deve executar o seed da base; depois pode tentar instalar de novo.",
    missingAccessToken:
      "O início de sessão não terminou. No admin da Shopify, abra Definições → Aplicações e canais de vendas → Disclo, ou abra Disclo a partir da lista de aplicações, e conclua novamente a instalação.",
  },

  dashboard: {
    titleBar: "Disclo conformidade IA",
    unknownAction:
      "Não reconhecemos esse pedido. Recarregue a página e guarde de novo os mercados alvo.",
    shopMissingMarkets:
      "Não encontrámos esta loja no Disclo. Reinstale a app e escolha de novo os mercados alvo.",
    marketsRequired:
      "Escolha pelo menos uma região para sabermos que regras se aplicam. Escolha UE, EUA ou um estado, e guarde.",
    setupBannerTitle: "Concluir configuração",
    setupBannerBody: (shopDomain: string) =>
      `Esta loja ainda não está ligada no Disclo. Feche a app, abra-a outra vez a partir do admin da Shopify para concluir o acesso e atualize esta página. Domínio: ${shopDomain}.`,
    onboardingHeading: "Primeiros passos",
    onboardingLinked: "App instalada e loja ligada",
    onboardingLinkShop: "Ligue a sua loja",
    onboardingMarketsOk: "Mercados alvo selecionados",
    onboardingMarketsTodo: "Escolha os mercados alvo abaixo",
    onboardingScanOk: "Primeira análise concluída",
    onboardingScanTodo: "Execute uma análise para ver as pontuações de conformidade",
    activeScanTitle: "A sua análise está a correr",
    activeScanBody: (processed: number, total: string) =>
      `Processados ${processed} de ${total} produtos.`,
    openLiveProgress: "Abrir progresso em direto",
    scanFailedTitle: "A sua análise não começou",
    marketsFailedTitle: "Os mercados alvo não foram guardados",
    complianceHeading: "Pontuação de conformidade",
    complianceUnavailable: "Ainda não disponível",
    complianceHelp:
      "De 0 a 100 com base na última análise concluída. Enquanto uma análise corre, a pontuação anterior continua visível.",
    planHeading: "Plano",
    lastScanHeading: "Última análise",
    noScansYet: "Ainda sem análises",
    lastScanStatus: (status: string) => `Estado: ${status}`,
    riskHeading: "Repartição de risco (última análise concluída)",
    riskHelp: "Contagens pela gravidade mais alta que atribuímos a cada artigo.",
    riskHigh: (n: number, pct: number) => `Alta: ${n} (${pct}%)`,
    riskReview: (n: number, pct: number) => `Rever: ${n} (${pct}%)`,
    riskClear: (n: number, pct: number) => `Sem alerta: ${n} (${pct}%)`,
    regulationsHeading: "Regulamentos aplicáveis",
    regulationsHelp:
      "Derivados dos mercados alvo. O distintivo e os textos de divulgação seguem estas regras.",
    regAi: "Conformidade de conteúdos de IA",
    regGreen: "Alegações ambientais",
    marketsHeading: "Mercados alvo",
    marketsHelp: "Define que regulamentos se aplicam. Alterações valem para a próxima análise.",
    choiceListTitle: "Mercados",
    saving: "A guardar…",
    quickActionsHeading: "Ações rápidas",
    startFullScan: "Iniciar análise completa",
    quickActionsHelp: (merchantSupportEmail: string | null) => {
      const base =
        "Coloca todo o catálogo na fila; o seu plano pode limitar quantos artigos correm. Depois de iniciar, abrimos o ecrã de progresso em direto.";
      if (merchantSupportEmail) {
        return `${base} Dúvidas? Envie e-mail para ${merchantSupportEmail}.`;
      }
      return `${base} Dúvidas? Contacte quem instalou o Disclo na sua loja.`;
    },
  },

  scansList: {
    titleBar: "Análises",
    intro:
      "Reduza a lista quando pelo menos um artigo corresponder a um regulamento. Ordene pelo início de cada análise. Exporte os IDs selecionados em CSV.",
    filterLabel: "Regulamento nos artigos",
    filterAria: "Filtrar análises por código de regulamento nos artigos",
    allRegulations: "Todos os regulamentos",
    applyRegulationFilter: "Aplicar filtro de regulamento",
    tableStarted: "Início",
    tableType: "Tipo",
    tableStatus: "Estado",
    tableItems: "Artigos",
    tableScore: "Pontuação",
    tableFlagged: "Sinalizados",
    tableActions: "Ações",
    openRow: "Abrir",
    exportCsv: "Exportar IDs de análise (CSV)",
    emptyTitle: "Nenhuma análise corresponde a esta vista",
    emptyDescription:
      "Execute uma análise completa a partir do painel ou limpe o filtro de regulamento se estiver ativo.",
    footnote:
      "Etiquetas por artigo e ações de revisão chegam em breve. Abra uma linha de análise para ver o progresso e as pontuações dessa execução.",
    openDashboard: "Abrir painel",
  },

  scanProgress: {
    backScans: "Análises",
    titleBar: "Progresso da análise em direto",
    scanIdLine: (id: string) => `ID da análise: ${id}`,
    completedTitle: "A sua análise terminou",
    completedBody: (score: string, flagged: string) =>
      `Pontuação de conformidade: ${score}. Artigos sinalizados: ${flagged}.`,
    runningTitle: "Ainda a analisar o seu catálogo",
    runningBody:
      "Este ecrã atualiza a cada poucos segundos. Corremos texto, imagem e alegações ambientais em conjunto por produto.",
    overallHeading: "Geral",
    overallProcessed: (processed: number, total: string) =>
      `Processados ${processed} de ${total} produtos`,
    pipelineHeading: "Etapas do fluxo",
    pipelineHelp:
      "As três correm numa só passagem por produto. As barras seguem o mesmo progresso global.",
    stageText: "Deteção de texto",
    stageImage: "Deteção de imagem",
    stageClaims: "Alegações ambientais",
    openDashboard: "Abrir painel",
    invalidLink: "Esse link de análise não é válido.",
    scanNotFound:
      "Não encontrámos essa análise para esta loja. Abra Análises no menu e escolha uma execução recente.",
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
      "Use o botão Iniciar análise completa no painel. Se guardou esta URL nos favoritos, volte ao início da app.",
  },

  settings: {
    pageTitle: "Definições da loja",
    titleBar: "Definições",
    languageHeading: "Idioma",
    languageBody:
      "Escolha um idioma para o Disclo neste browser. Fica guardado até alterar. O idioma do browser segue o sistema ou o browser quando o suportamos.",
    languageLabel: "Idioma da app",
    languageSave: "Guardar idioma",
    languageBrowserDefault: "Idioma do browser",
    languageSaved: "Idioma guardado.",
    marketsHeading: "Mercados alvo",
    marketsBody:
      "As regiões definem que regras se aplicam (AI Act da UE, Flórida, Nova Iorque, EUA federais, alegações verdes na UE). Use a lista de mercados alvo no painel para valores ativos; este campo é só pré-visualização (UE por defeito).",
    marketsFieldLabel: "Mercados alvo (separados por vírgula)",
    marketsHelpText: "Use EU, US, US-FL ou US-NY. Exemplo: EU, US-FL",
  },

  auth: {
    heading: "Entrar no Disclo",
    shopLabel: "Domínio da loja",
    shopHelp:
      "Use o seu domínio .myshopify.com, por exemplo a-sua-loja.myshopify.com",
    submit: "Entrar com a Shopify",
    missingShop:
      "Introduza o domínio .myshopify.com e prima Entrar com a Shopify.",
    invalidShop:
      "Esse domínio não parece uma loja Shopify. Verifique a grafia e use a-sua-loja.myshopify.com.",
  },

  marketing: {
    heading: "Disclo - Conformidade de conteúdos de IA",
    tagline:
      "Conformidade de conteúdos de IA e verificação de alegações ambientais para o seu catálogo Shopify. Abra a app a partir do admin da Shopify para começar.",
    shopExample: "Exemplo: a-sua-loja.myshopify.com",
    bulletScans:
      "Análises: o catálogo passa por texto, imagem e alegações ambientais num só fluxo.",
    bulletScores:
      "Pontuações: veja uma nota de conformidade e que regras se aplicam conforme onde vende.",
    bulletDisclosures:
      "Divulgação: alinhe etiquetas com o AI Act da UE e as expetativas de alegações verdes ao publicar no produto.",
  },

  hints: {
    openAppsToManagePlan: "Abrir Aplicações e canais de venda",
  },

  nav: {
    dashboard: "Disclo conformidade IA",
    scans: "Análises",
    audit: "Audit log",
    billing: "Plans & billing",
    settings: "Definições",
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
    languageLabel: "Idioma da app",
  },
};
