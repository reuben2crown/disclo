import type { MerchantMessages } from "./types.js";

/** Merchant-facing Simplified Chinese strings. */
export const merchantMessagesZh: MerchantMessages = {
  support: {
    withEmail: (email: string) =>
      `若问题仍在，请发邮件至 ${email}，并简要说明您当时在做什么。`,
    withoutEmail:
      "若问题仍在，请联系为您的店铺安装 Disclo 的人员。",
  },

  scan: {
    queueUnavailable:
      "目前无法将扫描加入队列：后台任务服务无响应。请等待几分钟后再次点击「开始全店扫描」。",
    serverMisconfigured:
      "Disclo 仍在我们的服务器上启动。请几分钟后再试。若反复出现，请联系负责您店铺 Disclo 的人员。",
    shopMissing:
      "此店铺尚未加入 Disclo。在 Shopify 后台打开「设置」→「应用和销售渠道」，搜索 Disclo 并安装或打开一次应用。若没有 Disclo，请先从 Shopify 应用商店安装后再试。",
    planNotSynced:
      "您的套餐尚未与 Disclo 同步。在 Shopify 后台打开「设置」→「应用和销售渠道」→「Disclo」，确认免费或付费套餐已加载，等待一分钟后返回此处再次开始扫描。",
    noProducts:
      "没有可扫描的商品。请在 Shopify 后台至少添加一个商品，然后再开始扫描。",
    productGone:
      "我们无法从 Shopify 加载该商品。可能已被删除。请在 Shopify 后台打开商品、保存，然后再次更新上架信息。",
    catalogLoadFailed:
      "Shopify 未返回您的目录。请从 Shopify 后台打开 Disclo。若反复出现，请重新安装 Disclo。",
    unexpectedFullScan:
      "无法开始扫描。请等待一分钟后再次点击「开始全店扫描」。",
    unexpectedIncremental:
      "无法将该商品加入扫描队列。请等待一分钟后在 Shopify 后台再次保存商品。",
  },

  oauth: {
    serverNotReady:
      "Disclo 尚无法保存您的会话：服务器端加密未配置。请稍后再试，或联系安装应用的人员。",
    databaseNotReady:
      "数据库缺少必要数据（例如免费套餐对应记录）。运营 Disclo 的人员需要执行数据库种子脚本；之后您可以重新安装。",
    missingAccessToken:
      "登录未完成。在 Shopify 后台打开「设置」→「应用和销售渠道」→「Disclo」，或从应用列表打开 Disclo，并再次完成安装。",
  },

  dashboard: {
    titleBar: "Disclo AI 合规",
    unknownAction:
      "无法识别该请求。请刷新页面并再次保存目标市场。",
    shopMissingMarkets:
      "未在 Disclo 中找到此店铺。请重新安装应用并重新选择目标市场。",
    marketsRequired:
      "请至少选择一个地区，以便我们判断适用规则。请选择欧盟、美国或美国某州，然后保存。",
    setupBannerTitle: "完成设置",
    setupBannerBody: (shopDomain: string) =>
      `此店铺尚未在 Disclo 中关联。请关闭应用，从 Shopify 后台重新打开以完成登录，然后刷新本页。域名：${shopDomain}。`,
    onboardingHeading: "入门",
    onboardingLinked: "已安装应用并关联店铺",
    onboardingLinkShop: "关联店铺",
    onboardingMarketsOk: "已选择目标市场",
    onboardingMarketsTodo: "请在下方选择目标市场",
    onboardingScanOk: "已完成首次扫描",
    onboardingScanTodo: "运行扫描以查看合规分数",
    activeScanTitle: "扫描进行中",
    activeScanBody: (processed: number, total: string) =>
      `已处理 ${processed} / ${total} 个商品。`,
    openLiveProgress: "打开实时进度",
    scanFailedTitle: "扫描未开始",
    marketsFailedTitle: "目标市场未保存",
    complianceHeading: "合规分数",
    complianceUnavailable: "暂不可用",
    complianceHelp:
      "根据最近一次完成的扫描为 0–100。扫描进行中时，仍显示上一次分数。",
    planHeading: "套餐",
    lastScanHeading: "上次扫描",
    noScansYet: "尚无扫描",
    lastScanStatus: (status: string) => `状态：${status}`,
    riskHeading: "风险分布（最近一次完成的扫描）",
    riskHelp: "按我们为每个条目给出的最高严重程度计数。",
    riskHigh: (n: number, pct: number) => `高：${n}（${pct}%）`,
    riskReview: (n: number, pct: number) => `待复核：${n}（${pct}%）`,
    riskClear: (n: number, pct: number) => `无标记：${n}（${pct}%）`,
    regulationsHeading: "适用法规",
    regulationsHelp:
      "由目标市场推导。徽章与披露文案遵循这些规则。",
    regAi: "AI 内容合规",
    regGreen: "绿色声明",
    marketsHeading: "目标市场",
    marketsHelp: "决定适用哪些法规。更改将在下次扫描生效。",
    choiceListTitle: "市场",
    saving: "正在保存…",
    quickActionsHeading: "快捷操作",
    startFullScan: "开始全店扫描",
    quickActionsHelp: (merchantSupportEmail: string | null) => {
      const base =
        "将整店目录加入队列；您的套餐可能会限制可运行条目数。开始后我们会打开实时进度界面。";
      if (merchantSupportEmail) {
        return `${base} 有疑问？请发邮件至 ${merchantSupportEmail}。`;
      }
      return `${base} 有疑问？请联系为您的店铺安装 Disclo 的人员。`;
    },
  },

  scansList: {
    titleBar: "扫描",
    intro:
      "当至少有一条目匹配某法规时可缩小列表。按每次扫描开始时间排序。可将所选扫描 ID 导出为 CSV。",
    filterLabel: "条目上的法规",
    filterAria: "按条目上的法规代码筛选扫描",
    allRegulations: "全部法规",
    applyRegulationFilter: "应用法规筛选",
    tableStarted: "开始时间",
    tableType: "类型",
    tableStatus: "状态",
    tableItems: "条目",
    tableScore: "分数",
    tableFlagged: "已标记",
    tableActions: "操作",
    openRow: "打开",
    exportCsv: "导出扫描 ID（CSV）",
    emptyTitle: "此视图下没有扫描",
    emptyDescription:
      "请从控制台运行全店扫描，或清除已设置的法规筛选。",
    footnote:
      "按条目标签与审核操作即将推出。打开扫描行可查看该次运行的进度与分数。",
    openDashboard: "打开控制台",
  },

  scanProgress: {
    backScans: "扫描",
    titleBar: "扫描实时进度",
    scanIdLine: (id: string) => `扫描 ID：${id}`,
    completedTitle: "扫描已完成",
    completedBody: (score: string, flagged: string) =>
      `合规分数：${score}。已标记条目：${flagged}。`,
    runningTitle: "正在扫描您的目录",
    runningBody:
      "本页面每隔数秒刷新。我们会同时为每个商品运行文本、图片与绿色声明检查。",
    overallHeading: "总体",
    overallProcessed: (processed: number, total: string) =>
      `已处理 ${processed} / ${total} 个商品`,
    pipelineHeading: "流水线阶段",
    pipelineHelp:
      "三项检查每个商品一次完成。进度条反映同一总体进度。",
    stageText: "文本检测",
    stageImage: "图片检测",
    stageClaims: "绿色声明",
    openDashboard: "打开控制台",
    invalidLink: "该扫描链接无效。",
    scanNotFound:
      "未找到该店铺对应的扫描。请从菜单打开「扫描」并选择最近的一次运行。",
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
      "请使用控制台上的「开始全店扫描」按钮。若您收藏了此网址，请返回应用首页。",
  },

  settings: {
    pageTitle: "店铺设置",
    titleBar: "设置",
    languageHeading: "语言",
    languageBody:
      "为此浏览器选择 Disclo 语言。在您更改之前会一直保存。若我们支持，将跟随系统或浏览器语言。",
    languageLabel: "应用语言",
    languageSave: "保存语言",
    languageBrowserDefault: "浏览器默认",
    languageSaved: "语言已保存。",
    marketsHeading: "目标市场",
    marketsBody:
      "地区决定适用规则（欧盟人工智能法、佛罗里达、纽约、美国联邦、欧盟绿色声明）。请在控制台的目标市场列表中修改实际值；此字段仅为预览（默认欧盟）。",
    marketsFieldLabel: "目标市场（逗号分隔）",
    marketsHelpText: "请使用 EU、US、US-FL 或 US-NY。示例：EU, US-FL",
  },

  auth: {
    heading: "登录 Disclo",
    shopLabel: "店铺域名",
    shopHelp:
      "请使用您的 .myshopify.com 域名，例如 your-store.myshopify.com",
    submit: "使用 Shopify 登录",
    missingShop:
      "请输入 .myshopify.com 域名，然后点击「使用 Shopify 登录」。",
    invalidShop:
      "该域名不像 Shopify 店铺。请检查拼写并使用 your-store.myshopify.com。",
  },

  marketing: {
    heading: "Disclo - AI 内容合规",
    tagline:
      "为 Shopify 目录提供 AI 内容合规与绿色声明检查。请从 Shopify 后台打开应用以开始。",
    shopExample: "示例：your-store.myshopify.com",
    bulletScans:
      "扫描：目录在一次流程中经过文本、图片与绿色声明检查。",
    bulletScores:
      "分数：查看合规分数及按销售地区适用的规则。",
    bulletDisclosures:
      "披露：在上架商品时使标签符合欧盟人工智能法与对绿色声明的预期。",
  },

  hints: {
    openAppsToManagePlan: "打开应用和销售渠道",
  },

  nav: {
    dashboard: "Disclo AI 合规",
    scans: "扫描",
    audit: "Audit log",
    billing: "Plans & billing",
    settings: "设置",
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
    language: "语言",
    languageLabel: "应用语言",
  },
};
