import type { SupportedLocale } from "../locale.js";
import { FALLBACK_LOCALE } from "../locale.js";
import { notificationMessagesEn } from "./en.js";
import { notificationMessagesEs } from "./es.js";
import { notificationMessagesDe } from "./de.js";
import { notificationMessagesFr } from "./fr.js";
import { notificationMessagesIt } from "./it.js";
import { notificationMessagesPt } from "./pt.js";
import { notificationMessagesNl } from "./nl.js";
import { notificationMessagesJa } from "./ja.js";
import { notificationMessagesKo } from "./ko.js";
import { notificationMessagesZh } from "./zh.js";
import { notificationMessagesPl } from "./pl.js";
import { notificationMessagesSv } from "./sv.js";
import { notificationMessagesDa } from "./da.js";
import { notificationMessagesTr } from "./tr.js";
import { notificationMessagesRu } from "./ru.js";
import type { NotificationMessages } from "./types.js";

const registry: Record<SupportedLocale, NotificationMessages> = {
  en: notificationMessagesEn,
  fr: notificationMessagesFr,
  es: notificationMessagesEs,
  de: notificationMessagesDe,
  it: notificationMessagesIt,
  pt: notificationMessagesPt,
  nl: notificationMessagesNl,
  ja: notificationMessagesJa,
  ko: notificationMessagesKo,
  zh: notificationMessagesZh,
  pl: notificationMessagesPl,
  sv: notificationMessagesSv,
  da: notificationMessagesDa,
  tr: notificationMessagesTr,
  ru: notificationMessagesRu,
};

export function getNotificationMessages(locale: SupportedLocale): NotificationMessages {
  return registry[locale] ?? registry[FALLBACK_LOCALE];
}
