import type { MerchantMessages } from "./types.js";

/** Merchant-facing Russian strings. */
export const merchantMessagesRu: MerchantMessages = {
  support: {
    withEmail: (email: string) =>
      `Если повторяется, напишите на ${email} и кратко опишите, что вы делали.`,
    withoutEmail:
      "Если повторяется, свяжитесь с тем, кто установил Disclo для вашего магазина.",
  },

  scan: {
    queueUnavailable:
      "Сейчас нельзя поставить сканы в очередь: фоновый сервис задач не отвечает. Подождите несколько минут и снова нажмите «Запустить полное сканирование».",
    serverMisconfigured:
      "Disclo ещё запускается на наших серверах. Повторите через несколько минут. Если снова, свяжитесь с тем, кто ведёт Disclo для вашего магазина.",
    shopMissing:
      "Этот магазин ещё не в Disclo. В админке Shopify откройте Настройки → Приложения и каналы продаж, найдите Disclo и установите или откройте приложение один раз. Если Disclo нет, сначала установите из Shopify App Store и попробуйте снова.",
    planNotSynced:
      "Ваш тариф ещё не синхронизирован с Disclo. В админке Shopify откройте Настройки → Приложения и каналы продаж → Disclo, убедитесь, что загружается бесплатный или платный план, подождите минуту, вернитесь сюда и запустите сканирование снова.",
    noProducts:
      "Нет товаров для сканирования. Добавьте хотя бы один товар в админке Shopify и снова запустите сканирование.",
    productGone:
      "Не удалось загрузить этот товар из Shopify. Возможно, он удалён. Откройте товар в админке Shopify, сохраните и снова обновите карточку.",
    catalogLoadFailed:
      "Shopify не вернул ваш каталог. Откройте Disclo из админки Shopify. Если повторяется, переустановите Disclo.",
    unexpectedFullScan:
      "Не удалось запустить сканирование. Подождите минуту и снова нажмите «Запустить полное сканирование».",
    unexpectedIncremental:
      "Не удалось поставить в очередь сканирование этого товара. Подождите минуту и снова сохраните товар в админке Shopify.",
  },

  oauth: {
    serverNotReady:
      "Disclo пока не может сохранить сессию: не настроено шифрование на сервере. Попробуйте позже или свяжитесь с тем, кто установил приложение.",
    databaseNotReady:
      "В базе не хватает нужных данных (например строки бесплатного плана). Тот, кто ведёт Disclo, должен выполнить seed базы; затем можно снова установить.",
    missingAccessToken:
      "Вход не завершён. В админке Shopify откройте Настройки → Приложения и каналы продаж → Disclo или Disclo из списка приложений и снова завершите установку.",
  },

  dashboard: {
    titleBar: "Disclo",
    unknownAction:
      "Запрос не распознан. Обновите страницу и снова сохраните целевые рынки.",
    shopMissingMarkets:
      "Этот магазин не найден в Disclo. Переустановите приложение и снова выберите целевые рынки.",
    marketsRequired:
      "Выберите хотя бы один регион, чтобы мы знали, какие правила действуют. Выберите ЕС, США или штат США и сохраните.",
    setupBannerTitle: "Завершите настройку",
    setupBannerBody: (shopDomain: string) =>
      `Этот магазин ещё не привязан в Disclo. Закройте приложение, откройте снова из админки Shopify, чтобы завершить вход, и обновите страницу. Домен: ${shopDomain}.`,
    onboardingHeading: "С чего начать",
    onboardingLinked: "Приложение установлено, магазин привязан",
    onboardingLinkShop: "Привяжите магазин",
    onboardingMarketsOk: "Целевые рынки выбраны",
    onboardingMarketsTodo: "Выберите целевые рынки ниже",
    onboardingScanOk: "Первое сканирование завершено",
    onboardingScanTodo: "Запустите сканирование, чтобы увидеть оценки соответствия",
    activeScanTitle: "Сканирование выполняется",
    activeScanBody: (processed: number, total: string) =>
      `Обработано ${processed} из ${total} товаров.`,
    openLiveProgress: "Открыть ход в реальном времени",
    scanFailedTitle: "Сканирование не запустилось",
    marketsFailedTitle: "Целевые рынки не сохранены",
    complianceHeading: "Оценка соответствия",
    complianceUnavailable: "Пока нет",
    complianceHelp:
      "От 0 до 100 по последнему завершённому сканированию. Пока идёт сканирование, видна предыдущая оценка.",
    planHeading: "План",
    lastScanHeading: "Последнее сканирование",
    noScansYet: "Пока нет сканирований",
    lastScanStatus: (status: string) => `Статус: ${status}`,
    riskHeading: "Разбивка по риску (последнее завершённое сканирование)",
    riskHelp: "Подсчёт по самой высокой серьёзности, которую мы дали каждой позиции.",
    riskHigh: (n: number, pct: number) => `Высокий: ${n} (${pct}%)`,
    riskReview: (n: number, pct: number) => `Проверить: ${n} (${pct}%)`,
    riskClear: (n: number, pct: number) => `Без замечаний: ${n} (${pct}%)`,
    regulationsHeading: "Применимые правила",
    regulationsHelp:
      "Выводятся из целевых рынков. Значок и тексты раскрытия следуют этим правилам.",
    regAi: "Соответствие AI Act",
    regGreen: "Экологические заявления",
    marketsHeading: "Целевые рынки",
    marketsHelp: "Определяет, какие правила действуют. Изменения применятся к следующему сканированию.",
    choiceListTitle: "Рынки",
    saving: "Сохранение…",
    quickActionsHeading: "Быстрые действия",
    startFullScan: "Запустить полное сканирование",
    quickActionsHelp: (merchantSupportEmail: string | null) => {
      const base =
        "Ставит в очередь весь каталог; план может ограничивать число позиций. После старта открываем экран хода в реальном времени.";
      if (merchantSupportEmail) {
        return `${base} Вопросы? Напишите на ${merchantSupportEmail}.`;
      }
      return `${base} Вопросы? Свяжитесь с тем, кто установил Disclo для вашего магазина.`;
    },
  },

  scansList: {
    titleBar: "Сканирования",
    intro:
      "Сузьте список, если хотя бы одна позиция совпала с правилом. Сортируйте по началу сканирования. Экспортируйте выбранные ID в CSV.",
    filterLabel: "Правило на позициях",
    filterAria: "Фильтровать сканирования по коду правила на позициях",
    allRegulations: "Все правила",
    applyRegulationFilter: "Применить фильтр правила",
    tableStarted: "Начато",
    tableType: "Тип",
    tableStatus: "Статус",
    tableItems: "Позиции",
    tableScore: "Оценка",
    tableFlagged: "Помечено",
    tableActions: "Действия",
    openRow: "Открыть",
    exportCsv: "Экспорт ID сканирований (CSV)",
    emptyTitle: "Нет сканирований для этого вида",
    emptyDescription:
      "Запустите полное сканирование с панели или снимите фильтр правила, если он включён.",
    footnote:
      "Метки по позициям и действия рецензента скоро. Откройте строку сканирования, чтобы увидеть ход и оценки этого запуска.",
    openDashboard: "Открыть панель",
  },

  scanProgress: {
    backScans: "Сканирования",
    titleBar: "Ход сканирования в реальном времени",
    scanIdLine: (id: string) => `ID сканирования: ${id}`,
    completedTitle: "Сканирование завершено",
    completedBody: (score: string, flagged: string) =>
      `Оценка соответствия: ${score}. Помеченные позиции: ${flagged}.`,
    runningTitle: "Каталог ещё сканируется",
    runningBody:
      "Экран обновляется каждые несколько секунд. Мы запускаем проверку текста, изображения и экозаявлений вместе для каждого товара.",
    overallHeading: "Итого",
    overallProcessed: (processed: number, total: string) =>
      `Обработано ${processed} из ${total} товаров`,
    pipelineHeading: "Этапы конвейера",
    pipelineHelp:
      "Все три за один проход на товар. Полосы показывают тот же общий прогресс.",
    stageText: "Распознавание текста",
    stageImage: "Распознавание изображения",
    stageClaims: "Экозаявления",
    openDashboard: "Открыть панель",
    invalidLink: "Эта ссылка на сканирование недействительна.",
    scanNotFound:
      "Мы не нашли это сканирование для этого магазина. Откройте «Сканирования» в меню и выберите недавний запуск.",
  },

  scanAction: {
    wrongMethod:
      "Используйте кнопку «Запустить полное сканирование» на панели. Если вы сохранили этот URL в закладках, вернитесь на главную приложения.",
  },

  settings: {
    pageTitle: "Настройки магазина",
    titleBar: "Настройки",
    languageHeading: "Язык",
    languageBody:
      "Выберите язык Disclo в этом браузере. Сохраняется, пока не смените. Язык браузера следует системе или браузеру, если мы его поддерживаем.",
    languageLabel: "Язык приложения",
    languageSave: "Сохранить язык",
    languageBrowserDefault: "Язык браузера",
    languageSaved: "Язык сохранён.",
    marketsHeading: "Целевые рынки",
    marketsBody:
      "Регионы задают, какие правила действуют (закон ЕС об ИИ, Флорида, Нью-Йорк, федеральные США, экозаявления ЕС). Для актуальных значений используйте список целевых рынков на панели; это поле только предпросмотр (по умолчанию ЕС).",
    marketsFieldLabel: "Целевые рынки (через запятую)",
    marketsHelpText: "Используйте EU, US, US-FL или US-NY. Пример: EU, US-FL",
  },

  auth: {
    heading: "Вход в Disclo",
    shopLabel: "Домен магазина",
    shopHelp:
      "Используйте домен .myshopify.com, например vash-magazin.myshopify.com",
    submit: "Войти через Shopify",
    missingShop:
      "Введите домен .myshopify.com и нажмите «Войти через Shopify».",
    invalidShop:
      "Домен не похож на магазин Shopify. Проверьте написание, используйте vash-magazin.myshopify.com.",
  },

  marketing: {
    heading: "Disclo",
    tagline:
      "Соответствие AI Act и проверка экозаявлений для каталога Shopify. Откройте приложение из админки Shopify, чтобы начать.",
    shopExample: "Пример: vash-magazin.myshopify.com",
    bulletScans:
      "Сканирования: каталог проходит проверку текста, изображения и экозаявлений в одном потоке.",
    bulletScores:
      "Оценки: смотрите оценку соответствия и правила по регионам продаж.",
    bulletDisclosures:
      "Раскрытия: держите этикетки в соответствии с законом ЕС об ИИ и ожиданиями по экозаявлениям при публикации в товаре.",
  },

  hints: {
    openAppsToManagePlan: "Открыть «Приложения и каналы продаж»",
  },

  nav: {
    dashboard: "Панель",
    scans: "Сканирования",
    settings: "Настройки",
  },

  footer: {
    language: "Язык",
    languageLabel: "Язык приложения",
  },
};
