import type { MerchantMessages } from "./types.js";

/** Merchant-facing Turkish strings. */
export const merchantMessagesTr: MerchantMessages = {
  support: {
    withEmail: (email: string) =>
      `Sürerse ${email} adresine yazın; kısaca ne yaptığınızı anlatın.`,
    withoutEmail:
      "Sürerse mağazanız için Disclo'yu kuran kişiyle iletişime geçin.",
  },

  scan: {
    queueUnavailable:
      "Şu an taramaları sıraya alamıyoruz: arka plan iş servisi yanıt vermiyor. Birkaç dakika bekleyin, Tam taramayı başlat'a yeniden dokunun.",
    serverMisconfigured:
      "Disclo sunucularımızda hâlâ açılıyor. Birkaç dakika sonra yeniden deneyin. Tekrarlanırsa mağazanız için Disclo'yu yöneten kişiyle iletişime geçin.",
    shopMissing:
      "Bu mağaza henüz Disclo'da değil. Shopify yöneticisinde Ayarlar → Uygulamalar ve satış kanalları'nı açın, Disclo'yu arayın ve uygulamayı bir kez yükleyin veya açın. Disclo yoksa önce Shopify Uygulama Mağazası'ndan yükleyip tekrar deneyin.",
    planNotSynced:
      "Planınız henüz Disclo ile eşitlenmedi. Shopify yöneticisinde Ayarlar → Uygulamalar ve satış kanalları → Disclo'yu açın, ücretsiz veya ücretli planın yüklendiğini doğrulayın, bir dakika bekleyin, buraya dönün ve taramayı yeniden başlatın.",
    noProducts:
      "Taranacak ürün yok. Shopify yöneticisinden en az bir ürün ekleyin, sonra taramayı yeniden başlatın.",
    productGone:
      "Bu ürünü Shopify'dan yükleyemedik. Kaldırılmış olabilir. Ürünü Shopify yöneticisinde açın, kaydedin, listeyi yeniden güncelleyin.",
    catalogLoadFailed:
      "Shopify kataloğunuzu döndürmedi. Disclo'yu Shopify yöneticisinden açın. Tekrarlanırsa Disclo'yu yeniden kurun.",
    unexpectedFullScan:
      "Taramanızı başlatamadık. Bir dakika bekleyin, Tam taramayı başlat'a yeniden dokunun.",
    unexpectedIncremental:
      "Bu ürün için tarama sıraya alınamadı. Bir dakika bekleyin, ürünü Shopify yöneticisinde yeniden kaydedin.",
  },

  oauth: {
    serverNotReady:
      "Disclo henüz oturumunuzu kaydedemiyor: sunucu şifrelemesi yapılandırılmadı. Daha sonra deneyin veya uygulamayı kuran kişiyle iletişime geçin.",
    databaseNotReady:
      "Veritabanında gerekli veriler eksik (ör. ücretsiz plan satırı). Disclo'yu işleten kişi veritabanı tohumunu çalıştırmalı; sonra yeniden kurmayı deneyebilirsiniz.",
    missingAccessToken:
      "Oturum açma tamamlanmadı. Shopify yöneticisinde Ayarlar → Uygulamalar ve satış kanalları → Disclo'yu açın veya Uygulamalar listesinden Disclo'yu açıp kurulumu yeniden tamamlayın.",
  },

  dashboard: {
    titleBar: "Disclo yapay zeka uyumu",
    unknownAction:
      "Bu istek tanınmadı. Sayfayı yenileyin, hedef pazarları yeniden kaydedin.",
    shopMissingMarkets:
      "Bu mağazayı Disclo'da bulamadık. Uygulamayı yeniden kurun, hedef pazarları yeniden seçin.",
    marketsRequired:
      "Hangi kuralların geçerli olduğunu bilmemiz için en az bir bölge seçin. AB, ABD veya bir eyalet seçin, kaydedin.",
    setupBannerTitle: "Kurulumu bitirin",
    setupBannerBody: (shopDomain: string) =>
      `Bu mağaza henüz Disclo'ya bağlı değil. Uygulamayı kapatın, oturum açmanın bitmesi için Shopify yöneticisinden yeniden açın, bu sayfayı yenileyin. Alan adı: ${shopDomain}.`,
    onboardingHeading: "Başlarken",
    onboardingLinked: "Uygulama kuruldu, mağaza bağlandı",
    onboardingLinkShop: "Mağazanızı bağlayın",
    onboardingMarketsOk: "Hedef pazarlar seçildi",
    onboardingMarketsTodo: "Aşağıdan hedef pazarları seçin",
    onboardingScanOk: "İlk tarama tamamlandı",
    onboardingScanTodo: "Uyumluluk puanlarını görmek için tarama çalıştırın",
    activeScanTitle: "Taramanız sürüyor",
    activeScanBody: (processed: number, total: string) =>
      `${total} üründen ${processed} işlendi.`,
    openLiveProgress: "Canlı ilerlemeyi aç",
    scanFailedTitle: "Taramanız başlamadı",
    marketsFailedTitle: "Hedef pazarlar kaydedilmedi",
    complianceHeading: "Uyumluluk puanı",
    complianceUnavailable: "Henüz yok",
    complianceHelp:
      "Son tamamlanan taramanıza göre 0–100. Tarama sürerken önceki puan görünür kalır.",
    planHeading: "Plan",
    lastScanHeading: "Son tarama",
    noScansYet: "Henüz tarama yok",
    lastScanStatus: (status: string) => `Durum: ${status}`,
    riskHeading: "Risk dağılımı (son tamamlanan tarama)",
    riskHelp: "Her öğeye verdiğimiz en yüksek önem derecesine göre sayılar.",
    riskHigh: (n: number, pct: number) => `Yüksek: ${n} (${pct}%)`,
    riskReview: (n: number, pct: number) => `İncele: ${n} (${pct}%)`,
    riskClear: (n: number, pct: number) => `Uyarı yok: ${n} (${pct}%)`,
    regulationsHeading: "Uygulanan düzenlemeler",
    regulationsHelp:
      "Hedef pazarlardan türetilir. Rozet ve açıklama metinleri bu kurallara uyar.",
    regAi: "Yapay zeka içerik uyumluluğu",
    regGreen: "Çevre iddiaları",
    marketsHeading: "Hedef pazarlar",
    marketsHelp: "Hangi düzenlemelerin geçerli olduğunu belirler. Değişiklikler sonraki taramaya uygulanır.",
    choiceListTitle: "Pazarlar",
    saving: "Kaydediliyor…",
    quickActionsHeading: "Hızlı işlemler",
    startFullScan: "Tam taramayı başlat",
    quickActionsHelp: (merchantSupportEmail: string | null) => {
      const base =
        "Tüm kataloğunuzu sıraya alır; planınız kaç öğenin çalışacağını sınırlayabilir. Başladıktan sonra canlı ilerleme ekranını açarız.";
      if (merchantSupportEmail) {
        return `${base} Soru mu var? ${merchantSupportEmail} adresine yazın.`;
      }
      return `${base} Soru mu var? Mağazanız için Disclo'yu kuran kişiyle iletişime geçin.`;
    },
  },

  scansList: {
    titleBar: "Taramalar",
    intro:
      "En az bir öğe bir düzenlemeyle eşleştiğinde listeyi daraltın. Her taramanın başlangıcına göre sıralayın. Seçili tarama kimliklerini CSV olarak dışa aktarın.",
    filterLabel: "Öğelerdeki düzenleme",
    filterAria: "Taramaları öğelerdeki düzenleme koduna göre filtrele",
    allRegulations: "Tüm düzenlemeler",
    applyRegulationFilter: "Düzenleme filtresini uygula",
    tableStarted: "Başlangıç",
    tableType: "Tür",
    tableStatus: "Durum",
    tableItems: "Öğeler",
    tableScore: "Puan",
    tableFlagged: "İşaretli",
    tableActions: "İşlemler",
    openRow: "Aç",
    exportCsv: "Tarama kimliklerini dışa aktar (CSV)",
    emptyTitle: "Bu görünümle eşleşen tarama yok",
    emptyDescription:
      "Panodan tam tarama çalıştırın veya düzenleme filtresi açıksa kaldırın.",
    footnote:
      "Öğe başına etiket ve inceleme işlemleri yakında. O çalıştırmanın ilerlemesi ve puanları için bir tarama satırı açın.",
    openDashboard: "Panoyu aç",
  },

  scanProgress: {
    backScans: "Taramalar",
    titleBar: "Canlı tarama ilerlemesi",
    scanIdLine: (id: string) => `Tarama kimliği: ${id}`,
    completedTitle: "Taramanız bitti",
    completedBody: (score: string, flagged: string) =>
      `Uyumluluk puanı: ${score}. İşaretli öğeler: ${flagged}.`,
    runningTitle: "Kataloğunuz hâlâ taranıyor",
    runningBody:
      "Bu ekran birkaç saniyede bir yenilenir. Her ürün için metin, görsel ve çevre iddiası kontrollerini birlikte çalıştırırız.",
    overallHeading: "Genel",
    overallProcessed: (processed: number, total: string) =>
      `${total} üründen ${processed} işlendi`,
    pipelineHeading: "İş hattı aşamaları",
    pipelineHelp:
      "Üçü de ürün başına tek geçişte çalışır. Çubuklar aynı genel ilerlemeyi izler.",
    stageText: "Metin algılama",
    stageImage: "Görsel algılama",
    stageClaims: "Çevre iddiaları",
    openDashboard: "Panoyu aç",
    invalidLink: "Bu tarama bağlantısı geçersiz.",
    scanNotFound:
      "Bu mağaza için o taramayı bulamadık. Menüden Taramalar'ı açın ve yakın bir çalıştırma seçin.",
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
      "Panodaki Tam taramayı başlat düğmesini kullanın. Bu URL'yi yer imi yaptıysanız uygulama ana sayfasına dönün.",
  },

  settings: {
    pageTitle: "Mağaza ayarları",
    titleBar: "Ayarlar",
    languageHeading: "Dil",
    languageBody:
      "Bu tarayıcı için Disclo dilini seçin. Değiştirene kadar burada kalır. Desteklediğimizde tarayıcı dili sistem veya tarayıcıyı izler.",
    languageLabel: "Uygulama dili",
    languageSave: "Dili kaydet",
    languageBrowserDefault: "Tarayıcı varsayılanı",
    languageSaved: "Dil kaydedildi.",
    marketsHeading: "Hedef pazarlar",
    marketsBody:
      "Bölgeler hangi kuralların geçerli olduğunu belirler (AB yapay zeka yasası, Florida, New York, federal ABD, AB çevre iddiaları). Canlı değerler için panodaki hedef pazar listesini kullanın; bu alan yalnızca önizlemedir (varsayılan AB).",
    marketsFieldLabel: "Hedef pazarlar (virgülle ayrılmış)",
    marketsHelpText: "EU, US, US-FL veya US-NY kullanın. Örnek: EU, US-FL",
  },

  auth: {
    heading: "Disclo'ya giriş",
    shopLabel: "Mağaza alan adı",
    shopHelp:
      ".myshopify.com alan adınızı kullanın, örneğin magazaniz.myshopify.com",
    submit: "Shopify ile giriş yap",
    missingShop:
      ".myshopify.com alan adınızı girin, Shopify ile giriş yap'a basın.",
    invalidShop:
      "Bu alan adı Shopify mağazası gibi görünmüyor. Yazımı kontrol edin, magazaniz.myshopify.com kullanın.",
  },

  marketing: {
    heading: "Disclo - Yapay zeka içerik uyumluluğu",
    tagline:
      "Shopify kataloğunuz için yapay zeka içerik uyumluluğu ve çevre iddiası kontrolleri. Başlamak için uygulamayı Shopify yöneticisinden açın.",
    shopExample: "Örnek: magazaniz.myshopify.com",
    bulletScans:
      "Taramalar: kataloğunuz tek akışta metin, görsel ve çevre iddiası kontrollerinden geçer.",
    bulletScores:
      "Puanlar: uyumluluk puanını ve satış bölgelerinize göre geçerli kuralları görün.",
    bulletDisclosures:
      "Açıklamalar: üründe yayınlarken etiketleri AB yapay zeka yasası ve çevre iddiası beklentileriyle hizalı tutun.",
  },

  hints: {
    openAppsToManagePlan: "Uygulamalar ve satış kanallarını aç",
  },

  nav: {
    dashboard: "Disclo yapay zeka uyumu",
    scans: "Taramalar",
    settings: "Ayarlar",
  },

  footer: {
    language: "Dil",
    languageLabel: "Uygulama dili",
  },
};
