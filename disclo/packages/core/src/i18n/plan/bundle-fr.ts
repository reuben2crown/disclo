import type { BooleanPlanFeatureKey, NumericLimitKey } from "../../plan/plan-feature-keys.js";
import type { PlanMessageBundle } from "./types.js";

const shopifyPlanStepsFr =
  "Dans l’admin Shopify, ouvrez Paramètres, puis Applications et canaux de vente, puis ouvrez Disclo. Sur cet écran, utilisez Gérer l’abonnement ou choisissez une offre qui couvre votre besoin.";

const booleanFeatureLabel: Record<BooleanPlanFeatureKey, string> = {
  textDetection: "Détection de texte IA",
  imageDetection: "Détection d’images IA",
  fixDashboard: "Tableau de bord correctifs",
  auditLog: "Journal d’audit",
  auditLogPdfExport: "Export PDF du journal d’audit",
  monthlyAutoScan: "Analyse automatique mensuelle",
  rewriteEngine: "Suggestions de réécriture",
  whiteLabelReports: "Rapports à votre marque",
  apiAccess: "Accès API",
};

function limitExceeded(key: NumericLimitKey, limit: number): string {
  switch (key) {
    case "maxItemsPerScan":
      return `Chaque analyse peut couvrir jusqu’à ${limit} produits avec votre offre actuelle. ${shopifyPlanStepsFr} Puis revenez ici et lancez une nouvelle analyse. Pour l’aide à la facturation, contactez le support.`;
    case "maxShops":
      return `Votre offre actuelle couvre ${limit} boutique${limit === 1 ? "" : "s"}. ${shopifyPlanStepsFr} Poursuivez ensuite dans Disclo.`;
    case "apiMonthlyCalls":
      return `Votre offre inclut ${limit} appels API sur cette période de facturation. ${shopifyPlanStepsFr} Ou attendez la fin de période, puis réessayez.`;
    case "teamMembers":
      return `Votre offre inclut ${limit} siège${limit === 1 ? "" : "s"} membre d’équipe. ${shopifyPlanStepsFr} Puis réinvitez vos coéquipiers depuis Disclo.`;
  }
}

export const planBundleFr: PlanMessageBundle = {
  booleanFeatureLabel,
  featureNotOnPlan: (featureLabel: string) =>
    `Votre offre actuelle n’inclut pas ${featureLabel}. ${shopifyPlanStepsFr} Puis revenez dans Disclo et réessayez.`,
  limitExceeded,
};
