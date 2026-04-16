import type { MerchantMessages } from "./types.js";

/** Merchant-facing Korean strings. */
export const merchantMessagesKo: MerchantMessages = {
  support: {
    withEmail: (email: string) =>
      `계속되면 ${email}로 메일을 보내고, 무엇을 하고 있었는지 짧게 적어 주세요.`,
    withoutEmail:
      "계속되면 스토어에 Disclo를 설치한 담당자에게 문의하세요.",
  },

  scan: {
    queueUnavailable:
      "지금은 스캔을 대기열에 넣을 수 없습니다. 백그라운드 작업 서비스가 응답하지 않습니다. 몇 분 기다린 뒤 ‘전체 스캔 시작’을 다시 누르세요.",
    serverMisconfigured:
      "Disclo가 서버에서 아직 시작 중입니다. 몇 분 뒤 다시 시도하세요. 반복되면 스토어의 Disclo 운영 담당자에게 문의하세요.",
    shopMissing:
      "이 스토어는 아직 Disclo에 없습니다. Shopify 관리자에서 설정 → 앱 및 판매 채널을 연 다음 Disclo를 검색해 설치하거나 한 번 열어 주세요. Disclo가 없으면 Shopify 앱 스토어에서 먼저 설치한 뒤 다시 시도하세요.",
    planNotSynced:
      "요금제가 아직 Disclo와 동기화되지 않았습니다. Shopify 관리자에서 설정 → 앱 및 판매 채널 → Disclo를 열어 무료 또는 유료 요금제가 로드되는지 확인하고, 1분 기다린 뒤 여기로 돌아와 스캔을 다시 시작하세요.",
    noProducts:
      "스캔할 상품이 없습니다. Shopify 관리자에서 상품을 하나 이상 추가한 뒤 스캔을 다시 시작하세요.",
    productGone:
      "Shopify에서 해당 상품을 불러오지 못했습니다. 삭제되었을 수 있습니다. Shopify 관리자에서 상품을 열고 저장한 뒤 목록을 다시 업데이트하세요.",
    catalogLoadFailed:
      "Shopify가 카탈로그를 반환하지 않았습니다. Shopify 관리자에서 Disclo를 여세요. 반복되면 Disclo를 다시 설치하세요.",
    unexpectedFullScan:
      "스캔을 시작하지 못했습니다. 1분 기다린 뒤 ‘전체 스캔 시작’을 다시 누르세요.",
    unexpectedIncremental:
      "해당 상품 스캔을 대기열에 넣지 못했습니다. 1분 기다린 뒤 Shopify 관리자에서 상품을 다시 저장하세요.",
  },

  oauth: {
    serverNotReady:
      "Disclo가 아직 세션을 저장할 수 없습니다. 서버 암호화가 설정되어 있지 않습니다. 나중에 다시 시도하거나 앱을 설치한 담당자에게 문의하세요.",
    databaseNotReady:
      "데이터베이스에 필요한 데이터가 없습니다(무료 요금제 행 등). Disclo를 운영하는 사람이 DB 시드를 실행해야 합니다. 그다음 설치를 다시 시도할 수 있습니다.",
    missingAccessToken:
      "로그인이 완료되지 않았습니다. Shopify 관리자에서 설정 → 앱 및 판매 채널 → Disclo를 열거나 앱 목록에서 Disclo를 열어 설치를 다시 완료하세요.",
  },

  dashboard: {
    titleBar: "Disclo",
    unknownAction:
      "인식되지 않은 요청입니다. 페이지를 새로고침한 뒤 대상 시장을 다시 저장하세요.",
    shopMissingMarkets:
      "Disclo에서 이 스토어를 찾지 못했습니다. 앱을 다시 설치하고 대상 시장을 다시 선택하세요.",
    marketsRequired:
      "어떤 규칙이 적용되는지 알 수 있도록 지역을 하나 이상 선택하세요. EU, 미국 또는 미국 주를 선택한 뒤 저장하세요.",
    setupBannerTitle: "설정 마치기",
    setupBannerBody: (shopDomain: string) =>
      `이 스토어는 아직 Disclo에 연결되지 않았습니다. 앱을 닫고 Shopify 관리자에서 다시 열어 로그인을 마친 뒤 이 페이지를 새로고침하세요. 도메인: ${shopDomain}.`,
    onboardingHeading: "시작하기",
    onboardingLinked: "앱 설치 및 스토어 연결됨",
    onboardingLinkShop: "스토어 연결",
    onboardingMarketsOk: "대상 시장 선택됨",
    onboardingMarketsTodo: "아래에서 대상 시장을 선택하세요",
    onboardingScanOk: "첫 스캔 완료",
    onboardingScanTodo: "스캔을 실행해 준수 점수 확인",
    activeScanTitle: "스캔 진행 중",
    activeScanBody: (processed: number, total: string) =>
      `${total}개 중 ${processed}개 상품 처리됨.`,
    openLiveProgress: "실시간 진행 열기",
    scanFailedTitle: "스캰이 시작되지 않았습니다",
    marketsFailedTitle: "대상 시장이 저장되지 않았습니다",
    complianceHeading: "준수 점수",
    complianceUnavailable: "아직 없음",
    complianceHelp:
      "마지막으로 완료된 스캔 기준 0~100. 스캔 중에는 이전 점수가 그대로 보입니다.",
    planHeading: "요금제",
    lastScanHeading: "마지막 스캔",
    noScansYet: "아직 스캔 없음",
    lastScanStatus: (status: string) => `상태: ${status}`,
    riskHeading: "위험 분포(마지막 완료 스캔)",
    riskHelp: "항목마다 부여한 가장 높은 심각도 기준 개수입니다.",
    riskHigh: (n: number, pct: number) => `높음: ${n} (${pct}%)`,
    riskReview: (n: number, pct: number) => `검토: ${n} (${pct}%)`,
    riskClear: (n: number, pct: number) => `문제 없음: ${n} (${pct}%)`,
    regulationsHeading: "적용 규정",
    regulationsHelp:
      "대상 시장에서 도출됩니다. 배지와 고지 문구는 이 규칙을 따릅니다.",
    regAi: "AI Act 준수",
    regGreen: "환경 주장",
    marketsHeading: "대상 시장",
    marketsHelp: "어떤 규정이 적용되는지 정합니다. 변경은 다음 스캔에 반영됩니다.",
    choiceListTitle: "시장",
    saving: "저장 중…",
    quickActionsHeading: "빠른 작업",
    startFullScan: "전체 스캔 시작",
    quickActionsHelp: (merchantSupportEmail: string | null) => {
      const base =
        "전체 카탈로그를 대기열에 넣습니다. 요금제에 따라 처리 항목 수가 제한될 수 있습니다. 시작 후 실시간 진행 화면을 엽니다.";
      if (merchantSupportEmail) {
        return `${base} 문의: ${merchantSupportEmail}로 메일 주세요.`;
      }
      return `${base} 문의: 스토어에 Disclo를 설치한 담당자에게 연락하세요.`;
    },
  },

  scansList: {
    titleBar: "스캔",
    intro:
      "항목 중 하나라도 규정과 일치하면 목록을 좁힐 수 있습니다. 스캔 시작 시각으로 정렬합니다. 선택한 스캔 ID를 CSV로 보냅니다.",
    filterLabel: "항목의 규정",
    filterAria: "항목의 규정 코드로 스캔 필터",
    allRegulations: "모든 규정",
    applyRegulationFilter: "규정 필터 적용",
    tableStarted: "시작",
    tableType: "유형",
    tableStatus: "상태",
    tableItems: "항목",
    tableScore: "점수",
    tableFlagged: "표시됨",
    tableActions: "작업",
    openRow: "열기",
    exportCsv: "스캔 ID 보내기(CSV)",
    emptyTitle: "이 보기와 일치하는 스캔 없음",
    emptyDescription:
      "대시보드에서 전체 스캔을 실행하거나, 규정 필터가 켜져 있으면 해제하세요.",
    footnote:
      "항목별 라벨과 검토 작업은 곧 제공됩니다. 행을 열면 해당 실행의 진행과 점수를 볼 수 있습니다.",
    openDashboard: "대시보드 열기",
  },

  scanProgress: {
    backScans: "스캔",
    titleBar: "실시간 스캔 진행",
    scanIdLine: (id: string) => `스캔 ID: ${id}`,
    completedTitle: "스캰이 완료되었습니다",
    completedBody: (score: string, flagged: string) =>
      `준수 점수: ${score}. 표시된 항목: ${flagged}.`,
    runningTitle: "카탈로그 스캔 중",
    runningBody:
      "이 화면은 몇 초마다 갱신됩니다. 상품마다 텍스트·이미지·환경 주장 검사를 함께 실행합니다.",
    overallHeading: "전체",
    overallProcessed: (processed: number, total: string) =>
      `${total}개 중 ${processed}개 상품 처리`,
    pipelineHeading: "파이프라인 단계",
    pipelineHelp:
      "세 가지 모두 상품당 한 번에 실행됩니다. 막대는 같은 전체 진행을 나타냅니다.",
    stageText: "텍스트 감지",
    stageImage: "이미지 감지",
    stageClaims: "환경 주장",
    openDashboard: "대시보드 열기",
    invalidLink: "해당 스캔 링크는 유효하지 않습니다.",
    scanNotFound:
      "이 스토어에서 해당 스캔을 찾지 못했습니다. 메뉴에서 스캔을 열고 최근 실행을 선택하세요.",
  },

  scanAction: {
    wrongMethod:
      "대시보드의 ‘전체 스캔 시작’ 버튼을 사용하세요. 이 URL을 북마크했다면 앱 홈으로 돌아가세요.",
  },

  settings: {
    pageTitle: "스토어 설정",
    titleBar: "설정",
    languageHeading: "언어",
    languageBody:
      "이 브라우저에서 Disclo 언어를 선택합니다. 바꿀 때까지 여기에 저장됩니다. 지원하는 경우 브라우저 언어는 시스템 또는 브라우저를 따릅니다.",
    languageLabel: "앱 언어",
    languageSave: "언어 저장",
    languageBrowserDefault: "브라우저 기본값",
    languageSaved: "언어가 저장되었습니다.",
    marketsHeading: "대상 시장",
    marketsBody:
      "지역이 적용 규칙을 정합니다(EU AI법, 플로리다, 뉴욕, 미국 연방, EU 환경 주장). 실제 값은 대시보드의 대상 시장 목록에서 바꾸세요. 이 필드는 미리보기입니다(기본 EU).",
    marketsFieldLabel: "대상 시장(쉼표로 구분)",
    marketsHelpText: "EU, US, US-FL 또는 US-NY를 사용하세요. 예: EU, US-FL",
  },

  auth: {
    heading: "Disclo 로그인",
    shopLabel: "스토어 도메인",
    shopHelp:
      ".myshopify.com 도메인을 사용하세요. 예: your-store.myshopify.com",
    submit: "Shopify로 로그인",
    missingShop:
      ".myshopify.com 도메인을 입력하고 ‘Shopify로 로그인’을 누르세요.",
    invalidShop:
      "해당 도메인은 Shopify 스토어가 아닌 것 같습니다. 철자를 확인하고 your-store.myshopify.com 형식을 쓰세요.",
  },

  marketing: {
    heading: "Disclo",
    tagline:
      "Shopify 카탈로그용 AI Act 준수와 환경 주장 검사. Shopify 관리자에서 앱을 열어 시작하세요.",
    shopExample: "예: your-store.myshopify.com",
    bulletScans:
      "스캔: 카탈로그가 텍스트·이미지·환경 주장 검사를 한 흐름으로 통과합니다.",
    bulletScores:
      "점수: 준수 점수와 판매 지역에 따른 규칙을 확인합니다.",
    bulletDisclosures:
      "고지: 상품에 실을 때 EU AI법과 환경 주장 기대에 맞춰 라벨을 유지합니다.",
  },

  hints: {
    openAppsToManagePlan: "앱 및 판매 채널 열기",
  },

  nav: {
    dashboard: "대시보드",
    scans: "스캔",
    settings: "설정",
  },

  footer: {
    language: "언어",
    languageLabel: "앱 언어",
  },
};
