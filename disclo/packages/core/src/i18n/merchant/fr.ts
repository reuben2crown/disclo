import type { MerchantMessages } from "./types.js";
import { merchantHintsFr } from "./hints-fr.js";

/** Merchant-facing French strings. */
export const merchantMessagesFr: MerchantMessages = {
  support: {
    withEmail: (email: string) =>
      `Si le problème continue, écrivez à ${email} en expliquant brièvement ce que vous faisiez.`,
    withoutEmail:
      "Si le problème continue, contactez la personne qui a installé Disclo pour votre boutique.",
  },

  scan: {
    queueUnavailable:
      "Nous ne pouvons pas mettre d’analyses en file pour le moment : le service de tâches en arrière-plan ne répond pas. Attendez quelques minutes, puis touchez à nouveau Démarrer l’analyse complète.",
    serverMisconfigured:
      "Disclo démarre encore sur nos serveurs. Réessayez dans quelques minutes. Si cela se répète, contactez la personne qui gère Disclo pour votre boutique.",
    shopMissing:
      "Cette boutique n’est pas encore dans Disclo. Dans l’admin Shopify, ouvrez Paramètres → Applications et canaux de vente, cherchez Disclo, installez-le ou ouvrez-le une fois. Si Disclo est absent, installez-le depuis la boutique d’applications Shopify, puis réessayez.",
    planNotSynced:
      "Votre offre n’est pas encore synchronisée avec Disclo. Dans l’admin Shopify, ouvrez Paramètres → Applications et canaux de vente → Disclo, vérifiez que l’offre gratuite ou payante s’affiche, attendez une minute, puis revenez ici et relancez une analyse.",
    noProducts:
      "Il n’y a aucun produit à analyser. Ajoutez au moins un produit dans l’admin Shopify, puis relancez une analyse.",
    productGone:
      "Nous n’avons pas pu charger ce produit depuis Shopify. Il a peut-être été supprimé. Ouvrez le produit dans l’admin Shopify, enregistrez-le, puis mettez à jour la fiche.",
    catalogLoadFailed:
      "Shopify n’a pas renvoyé votre catalogue. Rouvrez Disclo depuis l’admin Shopify. Si le problème continue, réinstallez Disclo.",
    unexpectedFullScan:
      "Nous n’avons pas pu démarrer votre analyse. Attendez une minute, puis touchez à nouveau Démarrer l’analyse complète.",
    unexpectedIncremental:
      "Nous n’avons pas pu mettre en file une analyse pour ce produit. Attendez une minute, puis enregistrez à nouveau le produit dans l’admin Shopify.",
  },

  oauth: {
    serverNotReady:
      "Disclo ne peut pas encore enregistrer votre session : le chiffrement côté serveur n’est pas configuré. Réessayez plus tard, ou contactez la personne qui a installé l’application.",
    databaseNotReady:
      "Des données requises manquent dans la base (par exemple la ligne d’offre gratuite). La personne qui exploite Disclo doit lancer l’amorçage de la base, puis vous pourrez réessayer l’installation.",
    missingAccessToken:
      "La connexion n’est pas allée au bout. Dans l’admin Shopify, ouvrez Paramètres → Applications et canaux de vente → Disclo, ou ouvrez Disclo depuis la liste Applications, et terminez de nouveau l’installation.",
  },

  dashboard: {
    titleBar: "Disclo",
    unknownAction:
      "Cette action n’a pas été reconnue. Rechargez la page, puis enregistrez à nouveau les marchés cibles.",
    shopMissingMarkets:
      "Nous n’avons pas trouvé cette boutique dans Disclo. Réinstallez l’application, puis choisissez à nouveau les marchés cibles.",
    marketsRequired:
      "Choisissez au moins une région pour savoir quelles règles s’appliquent. Sélectionnez l’UE, les États-Unis ou un État, puis enregistrez.",
    setupBannerTitle: "Terminer la configuration",
    setupBannerBody: (shopDomain: string) =>
      `Cette boutique n’est pas encore liée à Disclo. Fermez l’application, rouvrez-la depuis l’admin Shopify pour terminer la connexion, puis actualisez cette page. Domaine : ${shopDomain}.`,
    onboardingHeading: "Pour commencer",
    onboardingLinked: "Application installée et boutique liée",
    onboardingLinkShop: "Liez votre boutique",
    onboardingMarketsOk: "Marchés cibles sélectionnés",
    onboardingMarketsTodo: "Choisissez les marchés cibles ci-dessous",
    onboardingScanOk: "Première analyse terminée",
    onboardingScanTodo: "Lancez une analyse pour voir les scores de conformité",
    activeScanTitle: "Votre analyse est en cours",
    activeScanBody: (processed: number, total: string) =>
      `${processed} produit(s) traité(s) sur ${total}.`,
    openLiveProgress: "Voir la progression en direct",
    scanFailedTitle: "L’analyse n’a pas démarré",
    marketsFailedTitle: "Les marchés cibles n’ont pas été enregistrés",
    complianceHeading: "Score de conformité",
    complianceUnavailable: "Pas encore disponible",
    complianceHelp:
      "Note de 0 à 100 d’après votre dernière analyse terminée. Pendant une analyse, le score précédent reste affiché.",
    planHeading: "Offre",
    lastScanHeading: "Dernière analyse",
    noScansYet: "Aucune analyse pour le moment",
    lastScanStatus: (status: string) => `Statut : ${status}`,
    riskHeading: "Répartition des risques (dernière analyse terminée)",
    riskHelp: "Nombre d’articles par niveau de gravité le plus élevé que nous avons attribué.",
    riskHigh: (n: number, pct: number) => `Élevé : ${n} (${pct}%)`,
    riskReview: (n: number, pct: number) => `À revoir : ${n} (${pct}%)`,
    riskClear: (n: number, pct: number) => `Sans alerte : ${n} (${pct}%)`,
    regulationsHeading: "Réglementations applicables",
    regulationsHelp:
      "Dérivées des marchés cibles. Le badge et les textes de divulgation suivent ces règles.",
    regAi: "Conformité AI Act",
    regGreen: "Allégations environnementales",
    marketsHeading: "Marchés cibles",
    marketsHelp:
      "Détermine quelles réglementations s’appliquent. Les changements s’appliquent à la prochaine analyse.",
    choiceListTitle: "Marchés",
    saving: "Enregistrement…",
    quickActionsHeading: "Actions rapides",
    startFullScan: "Lancer une analyse complète",
    quickActionsHelp: (merchantSupportEmail: string | null) => {
      const base =
        "Met en file tout votre catalogue ; votre offre peut limiter le nombre d’articles. Après le démarrage, nous ouvrons l’écran de progression en direct.";
      if (merchantSupportEmail) {
        return `${base} Des questions ? Écrivez à ${merchantSupportEmail}.`;
      }
      return `${base} Des questions ? Contactez la personne qui a installé Disclo pour votre boutique.`;
    },
  },

  scansList: {
    titleBar: "Analyses",
    intro:
      "Affinez la liste lorsqu’au moins un article correspond à une réglementation. Triez par date de début d’analyse. Exportez les identifiants sélectionnés en CSV pour vos dossiers.",
    filterLabel: "Réglementation sur les articles",
    filterAria: "Filtrer les analyses par code de réglementation sur les articles",
    allRegulations: "Toutes les réglementations",
    applyRegulationFilter: "Appliquer le filtre de réglementation",
    tableStarted: "Démarrée",
    tableType: "Type",
    tableStatus: "Statut",
    tableItems: "Articles",
    tableScore: "Score",
    tableFlagged: "Signalés",
    tableActions: "Actions",
    openRow: "Ouvrir",
    exportCsv: "Exporter les ID d’analyse (CSV)",
    emptyTitle: "Aucune analyse ne correspond à cette vue",
    emptyDescription:
      "Lancez une analyse complète depuis le tableau de bord, ou supprimez le filtre de réglementation s’il est actif.",
    footnote:
      "Les actions par article (étiquette, relecture) arrivent bientôt. Ouvrez une ligne d’analyse pour voir la progression et les scores de cette exécution.",
    openDashboard: "Ouvrir le tableau de bord",
  },

  scanProgress: {
    backScans: "Analyses",
    titleBar: "Progression de l’analyse",
    scanIdLine: (id: string) => `ID d’analyse : ${id}`,
    completedTitle: "Votre analyse est terminée",
    completedBody: (score: string, flagged: string) =>
      `Score de conformité : ${score}. Articles signalés : ${flagged}.`,
    runningTitle: "Analyse du catalogue en cours",
    runningBody:
      "Cet écran s’actualise toutes les quelques secondes. Nous exécutons ensemble les contrôles texte, image et allégations vertes pour chaque produit.",
    overallHeading: "Global",
    overallProcessed: (processed: number, total: string) =>
      `${processed} produit(s) traité(s) sur ${total}`,
    pipelineHeading: "Étapes du pipeline",
    pipelineHelp:
      "Les trois s’exécutent en une passe par produit. Les barres suivent la même progression globale.",
    stageText: "Détection texte",
    stageImage: "Détection image",
    stageClaims: "Allégations vertes",
    openDashboard: "Ouvrir le tableau de bord",
    invalidLink: "Ce lien d’analyse n’est pas valide.",
    scanNotFound:
      "Nous n’avons pas trouvé cette analyse pour cette boutique. Ouvrez Analyses dans le menu et choisissez une exécution récente.",
  },

  scanAction: {
    wrongMethod:
      "Utilisez le bouton « Lancer une analyse complète » sur le tableau de bord. Si vous avez mis cette URL en favori, revenez à l’accueil de l’application.",
  },

  settings: {
    pageTitle: "Paramètres de la boutique",
    titleBar: "Paramètres",
    languageHeading: "Langue",
    languageBody:
      "Choisissez une langue pour Disclo dans ce navigateur. Votre choix est enregistré ici jusqu’à modification. La langue du navigateur suit la langue du système ou du navigateur lorsque nous la prenons en charge.",
    languageLabel: "Langue de l’application",
    languageSave: "Enregistrer la langue",
    languageBrowserDefault: "Langue du navigateur",
    languageSaved: "Langue enregistrée.",
    marketsHeading: "Marchés cibles",
    marketsBody:
      "Les régions déterminent les règles applicables (AI Act UE, Floride, New York, États-Unis fédéral, allégations vertes UE). Utilisez la liste des marchés cibles du tableau de bord pour modifier les valeurs actives ; ce champ est un aperçu uniquement (UE par défaut).",
    marketsFieldLabel: "Marchés cibles (séparés par des virgules)",
    marketsHelpText: "Utilisez EU, US, US-FL ou US-NY. Exemple : EU, US-FL",
  },

  auth: {
    heading: "Connexion à Disclo",
    shopLabel: "Domaine de la boutique",
    shopHelp:
      "Utilisez votre domaine .myshopify.com, par exemple votre-boutique.myshopify.com",
    submit: "Se connecter avec Shopify",
    missingShop:
      "Saisissez votre domaine .myshopify.com, puis appuyez sur Se connecter avec Shopify.",
    invalidShop:
      "Ce domaine ne ressemble pas à une boutique Shopify. Vérifiez l’orthographe et utilisez votre-boutique.myshopify.com.",
  },

  marketing: {
    heading: "Disclo",
    tagline:
      "Conformité AI Act et contrôle des allégations environnementales pour votre catalogue Shopify. Ouvrez l’application depuis l’admin Shopify pour commencer.",
    shopExample: "Exemple : votre-boutique.myshopify.com",
    bulletScans:
      "Analyses : faites passer votre catalogue par les contrôles texte, image et allégations vertes en un flux.",
    bulletScores:
      "Scores : consultez un score de conformité et les règles applicables selon vos zones de vente.",
    bulletDisclosures:
      "Divulgations : alignez les étiquettes sur l’AI Act et les attentes en matière d’allégations vertes au fil de vos mises en production.",
  },

  hints: merchantHintsFr,

  nav: {
    dashboard: "Tableau de bord",
    scans: "Analyses",
    settings: "Paramètres",
  },

  footer: {
    language: "Langue",
    languageLabel: "Langue de l’application",
  },
};
