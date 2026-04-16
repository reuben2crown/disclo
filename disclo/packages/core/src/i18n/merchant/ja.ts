import type { MerchantMessages } from "./types.js";

/** Merchant-facing Japanese strings. */
export const merchantMessagesJa: MerchantMessages = {
  support: {
    withEmail: (email: string) =>
      `繰り返す場合は ${email} にメールし、何をしていたか短く書いてください。`,
    withoutEmail:
      "繰り返す場合は、ストアに Disclo を入れた担当者に連絡してください。",
  },

  scan: {
    queueUnavailable:
      "いまはスキャンをキューに入れられません。バックグラウンドのジョブサービスが応答していません。数分待ってから「全商品スキャンを開始」をもう一度押してください。",
    serverMisconfigured:
      "Disclo はサーバー上でまだ起動中です。数分後にもう一度試してください。繰り返す場合は、ストアの Disclo 運用担当に連絡してください。",
    shopMissing:
      "このストアはまだ Disclo にありません。Shopify 管理画面で「設定」→「アプリと販売チャネル」を開き、Disclo を検索してインストールするか、一度開いてください。Disclo がない場合は Shopify アプリストアから先にインストールしてから再度お試しください。",
    planNotSynced:
      "プランがまだ Disclo と同期していません。Shopify 管理画面で「設定」→「アプリと販売チャネル」→「Disclo」を開き、無料または有料プランが表示されることを確認し、1 分待ってからここに戻り、スキャンを再開してください。",
    noProducts:
      "スキャンする商品がありません。Shopify 管理画面で商品を 1 件以上追加してから、もう一度スキャンしてください。",
    productGone:
      "Shopify からその商品を読み込めませんでした。削除された可能性があります。Shopify 管理画面で商品を開き、保存してから一覧を更新してください。",
    catalogLoadFailed:
      "Shopify がカタログを返しませんでした。Shopify 管理画面から Disclo を開いてください。繰り返す場合は Disclo を再インストールしてください。",
    unexpectedFullScan:
      "スキャンを開始できませんでした。1 分待ってから「全商品スキャンを開始」をもう一度押してください。",
    unexpectedIncremental:
      "その商品のスキャンをキューに入れられませんでした。1 分待ってから、Shopify 管理画面で商品を再度保存してください。",
  },

  oauth: {
    serverNotReady:
      "Disclo はまだセッションを保存できません。サーバー側の暗号化が設定されていません。後でもう一度試すか、アプリを入れた担当者に連絡してください。",
    databaseNotReady:
      "データベースに必要なデータがありません（無料プランの行など）。Disclo を運用する人がデータベースのシードを実行する必要があります。その後、インストールをやり直せます。",
    missingAccessToken:
      "サインインが完了していません。Shopify 管理画面で「設定」→「アプリと販売チャネル」→「Disclo」を開くか、アプリ一覧から Disclo を開き、インストールをもう一度完了してください。",
  },

  dashboard: {
    titleBar: "Disclo",
    unknownAction:
      "その操作は認識されませんでした。ページを再読み込みして、対象市場をもう一度保存してください。",
    shopMissingMarkets:
      "このストアが Disclo に見つかりませんでした。アプリを再インストールし、対象市場を選び直してください。",
    marketsRequired:
      "どのルールが適用されるか分かるよう、地域を 1 つ以上選んでください。EU、米国、または米国の州を選んで保存してください。",
    setupBannerTitle: "セットアップを完了",
    setupBannerBody: (shopDomain: string) =>
      `このストアはまだ Disclo にリンクしていません。アプリを閉じ、Shopify 管理画面から開き直してサインインを完了し、このページを更新してください。ドメイン: ${shopDomain}。`,
    onboardingHeading: "はじめに",
    onboardingLinked: "アプリをインストールし、ストアをリンク済み",
    onboardingLinkShop: "ストアをリンク",
    onboardingMarketsOk: "対象市場を選択済み",
    onboardingMarketsTodo: "下で対象市場を選んでください",
    onboardingScanOk: "最初のスキャンが完了",
    onboardingScanTodo: "スキャンを実行してコンプライアンススコアを表示",
    activeScanTitle: "スキャン実行中",
    activeScanBody: (processed: number, total: string) =>
      `${total} 件中 ${processed} 件を処理しました。`,
    openLiveProgress: "ライブの進捗を開く",
    scanFailedTitle: "スキャンが開始されませんでした",
    marketsFailedTitle: "対象市場を保存できませんでした",
    complianceHeading: "コンプライアンススコア",
    complianceUnavailable: "まだありません",
    complianceHelp:
      "直近に完了したスキャンから 0〜100。スキャン中は前回のスコアが表示されたままです。",
    planHeading: "プラン",
    lastScanHeading: "直近のスキャン",
    noScansYet: "スキャンはまだありません",
    lastScanStatus: (status: string) => `ステータス: ${status}`,
    riskHeading: "リスク内訳（直近に完了したスキャン）",
    riskHelp: "各項目に付けた最も高い重要度ごとの件数です。",
    riskHigh: (n: number, pct: number) => `高: ${n}（${pct}%）`,
    riskReview: (n: number, pct: number) => `要確認: ${n}（${pct}%）`,
    riskClear: (n: number, pct: number) => `問題なし: ${n}（${pct}%）`,
    regulationsHeading: "適用される規制",
    regulationsHelp:
      "対象市場から決まります。バッジと開示文言はこれらのルールに従います。",
    regAi: "AI Act 準拠",
    regGreen: "環境表示",
    marketsHeading: "対象市場",
    marketsHelp: "どの規制が適用されるかを決めます。変更は次のスキャンから有効です。",
    choiceListTitle: "市場",
    saving: "保存中…",
    quickActionsHeading: "クイック操作",
    startFullScan: "全商品スキャンを開始",
    quickActionsHelp: (merchantSupportEmail: string | null) => {
      const base =
        "カタログ全体をキューに入れます。プランによって処理件数が上限になることがあります。開始後、ライブ進捗画面を開きます。";
      if (merchantSupportEmail) {
        return `${base} 質問は ${merchantSupportEmail} まで。`;
      }
      return `${base} 質問は、ストアに Disclo を入れた担当者へ。`;
    },
  },

  scansList: {
    titleBar: "スキャン",
    intro:
      "少なくとも 1 件が規制に合致するときに一覧を絞り込めます。スキャン開始時刻で並べ替え。選んだスキャン ID を CSV で書き出せます。",
    filterLabel: "項目の規制",
    filterAria: "項目の規制コードでスキャンを絞り込む",
    allRegulations: "すべての規制",
    applyRegulationFilter: "規制フィルターを適用",
    tableStarted: "開始",
    tableType: "種類",
    tableStatus: "ステータス",
    tableItems: "項目",
    tableScore: "スコア",
    tableFlagged: "フラグ",
    tableActions: "操作",
    openRow: "開く",
    exportCsv: "スキャン ID をエクスポート（CSV）",
    emptyTitle: "この表示に合うスキャンはありません",
    emptyDescription:
      "ダッシュボードから全商品スキャンを実行するか、規制フィルターを外してください。",
    footnote:
      "項目ごとのラベルとレビュー操作は近日対応です。行を開くとその実行の進捗とスコアが見られます。",
    openDashboard: "ダッシュボードを開く",
  },

  scanProgress: {
    backScans: "スキャン",
    titleBar: "スキャンのライブ進捗",
    scanIdLine: (id: string) => `スキャン ID: ${id}`,
    completedTitle: "スキャンが完了しました",
    completedBody: (score: string, flagged: string) =>
      `コンプライアンススコア: ${score}。フラグ付き項目: ${flagged}。`,
    runningTitle: "カタログをスキャン中です",
    runningBody:
      "この画面は数秒ごとに更新されます。商品ごとにテキスト・画像・環境表示のチェックをまとめて行います。",
    overallHeading: "全体",
    overallProcessed: (processed: number, total: string) =>
      `${total} 件中 ${processed} 件を処理`,
    pipelineHeading: "パイプライン段階",
    pipelineHelp:
      "3 つとも商品ごとに 1 回で実行されます。バーは同じ全体の進捗を示します。",
    stageText: "テキスト検出",
    stageImage: "画像検出",
    stageClaims: "環境表示",
    openDashboard: "ダッシュボードを開く",
    invalidLink: "そのスキャンリンクは無効です。",
    scanNotFound:
      "このストアのそのスキャンが見つかりませんでした。メニューからスキャンを開き、最近の実行を選んでください。",
  },

  scanAction: {
    wrongMethod:
      "ダッシュボードの「全商品スキャンを開始」を使ってください。この URL をブックマークしている場合はアプリのホームに戻ってください。",
  },

  settings: {
    pageTitle: "ストア設定",
    titleBar: "設定",
    languageHeading: "言語",
    languageBody:
      "このブラウザで Disclo の言語を選びます。変えるまでここに保存されます。対応している場合、ブラウザの言語は OS またはブラウザに従います。",
    languageLabel: "アプリの言語",
    languageSave: "言語を保存",
    languageBrowserDefault: "ブラウザの既定",
    languageSaved: "言語を保存しました。",
    marketsHeading: "対象市場",
    marketsBody:
      "地域で適用ルールが決まります（EU AI 法、フロリダ、ニューヨーク、米国連邦、EU の環境表示）。実際の値はダッシュボードの対象市場リストで変更してください。この欄はプレビューです（既定は EU）。",
    marketsFieldLabel: "対象市場（カンマ区切り）",
    marketsHelpText: "EU、US、US-FL、US-NY を使います。例: EU, US-FL",
  },

  auth: {
    heading: "Disclo にサインイン",
    shopLabel: "ストアのドメイン",
    shopHelp:
      ".myshopify.com ドメインを使います。例: your-store.myshopify.com",
    submit: "Shopify でサインイン",
    missingShop:
      ".myshopify.com ドメインを入力し、「Shopify でサインイン」を押してください。",
    invalidShop:
      "そのドメインは Shopify ストアではなさそうです。表記を確認し、your-store.myshopify.com の形式で入力してください。",
  },

  marketing: {
    heading: "Disclo",
    tagline:
      "Shopify カタログ向けの AI Act 準拠と環境表示のチェック。Shopify 管理画面からアプリを開いて始められます。",
    shopExample: "例: your-store.myshopify.com",
    bulletScans:
      "スキャン: カタログがテキスト・画像・環境表示のチェックを一度に通ります。",
    bulletScores:
      "スコア: コンプライアンススコアと、販売地域に応じたルールが分かります。",
    bulletDisclosures:
      "表示: 商品に載せる内容を EU AI 法と環境表示の期待に沿わせます。",
  },

  hints: {
    openAppsToManagePlan: "アプリと販売チャネルを開く",
  },

  nav: {
    dashboard: "ダッシュボード",
    scans: "スキャン",
    settings: "設定",
  },

  footer: {
    language: "言語",
    languageLabel: "アプリの言語",
  },
};
