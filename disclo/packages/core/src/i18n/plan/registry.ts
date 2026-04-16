import type { SupportedLocale } from "../locale.js";
import { FALLBACK_LOCALE } from "../locale.js";
import { planBundleEn } from "./bundle-en.js";
import { planBundleEs } from "./bundle-es.js";
import { planBundleDe } from "./bundle-de.js";
import { planBundleFr } from "./bundle-fr.js";
import { planBundleIt } from "./bundle-it.js";
import { planBundlePt } from "./bundle-pt.js";
import { planBundleNl } from "./bundle-nl.js";
import { planBundleJa } from "./bundle-ja.js";
import { planBundleKo } from "./bundle-ko.js";
import { planBundleZh } from "./bundle-zh.js";
import { planBundlePl } from "./bundle-pl.js";
import { planBundleSv } from "./bundle-sv.js";
import { planBundleDa } from "./bundle-da.js";
import { planBundleTr } from "./bundle-tr.js";
import { planBundleRu } from "./bundle-ru.js";
import type { PlanMessageBundle } from "./types.js";

const registry: Record<SupportedLocale, PlanMessageBundle> = {
  en: planBundleEn,
  fr: planBundleFr,
  es: planBundleEs,
  de: planBundleDe,
  it: planBundleIt,
  pt: planBundlePt,
  nl: planBundleNl,
  ja: planBundleJa,
  ko: planBundleKo,
  zh: planBundleZh,
  pl: planBundlePl,
  sv: planBundleSv,
  da: planBundleDa,
  tr: planBundleTr,
  ru: planBundleRu,
};

export function getPlanMessages(locale: SupportedLocale): PlanMessageBundle {
  return registry[locale] ?? registry[FALLBACK_LOCALE];
}
