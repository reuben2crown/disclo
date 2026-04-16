import type { SupportedLocale } from "../locale.js";
import { FALLBACK_LOCALE } from "../locale.js";
import { merchantMessagesEn } from "./en.js";
import { merchantMessagesEs } from "./es.js";
import { merchantMessagesDe } from "./de.js";
import { merchantMessagesFr } from "./fr.js";
import { merchantMessagesIt } from "./it.js";
import { merchantMessagesPt } from "./pt.js";
import { merchantMessagesNl } from "./nl.js";
import { merchantMessagesJa } from "./ja.js";
import { merchantMessagesKo } from "./ko.js";
import { merchantMessagesZh } from "./zh.js";
import { merchantMessagesPl } from "./pl.js";
import { merchantMessagesSv } from "./sv.js";
import { merchantMessagesDa } from "./da.js";
import { merchantMessagesTr } from "./tr.js";
import { merchantMessagesRu } from "./ru.js";
import type { MerchantMessages } from "./types.js";

const registry: Record<SupportedLocale, MerchantMessages> = {
  en: merchantMessagesEn,
  fr: merchantMessagesFr,
  es: merchantMessagesEs,
  de: merchantMessagesDe,
  it: merchantMessagesIt,
  pt: merchantMessagesPt,
  nl: merchantMessagesNl,
  ja: merchantMessagesJa,
  ko: merchantMessagesKo,
  zh: merchantMessagesZh,
  pl: merchantMessagesPl,
  sv: merchantMessagesSv,
  da: merchantMessagesDa,
  tr: merchantMessagesTr,
  ru: merchantMessagesRu,
};

export function getMerchantMessages(locale: SupportedLocale): MerchantMessages {
  return registry[locale] ?? registry[FALLBACK_LOCALE];
}

/** Alias for embeds that used `merchantEn`. */
export const merchantEn = merchantMessagesEn;
