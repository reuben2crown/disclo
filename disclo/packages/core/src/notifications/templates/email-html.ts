import type { NotificationDispatchJob } from "../../scan/payloads.js";

export interface NotificationEmailTemplate {
  subject: string;
  html: string;
}

export function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

/**
 * HTML email body for Resend. Copy comes from i18n; this layer only escapes and wraps.
 */
export function renderNotificationEmailTemplate(input: {
  job: NotificationDispatchJob;
  title: string;
  body: string | null;
}): NotificationEmailTemplate {
  const title = escapeHtml(input.title);
  const body = input.body ? `<p>${escapeHtml(input.body)}</p>` : "";
  const link = input.job.link
    ? `<p><a href="${escapeHtml(input.job.link)}">Open Disclo</a></p>`
    : "";
  const inner = `<h1 style="font-size:20px;line-height:1.3">${title}</h1>${body}${link}`;
  const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
<body style="font-family:system-ui,sans-serif;margin:24px;color:#111">
${inner}
</body>
</html>`;
  return {
    subject: input.title,
    html,
  };
}
