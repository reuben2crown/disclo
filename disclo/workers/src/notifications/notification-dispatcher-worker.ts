import prisma from "@disclo/db";
import { Worker } from "bullmq";
import {
  QUEUE_NAMES,
  createHttpService,
  defaultLocaleFromEnv,
  getBullmqQueueOptions,
  getNotificationMessages,
  renderNotificationEmailTemplate,
  getServerEnv,
  loadServerEnv,
  notificationDispatchJobSchema,
  type NotificationDispatchJob,
} from "@disclo/core";
import { requireRedisUrl } from "../lib/worker-connection.js";

const http = createHttpService();

function toNotificationCopy(job: NotificationDispatchJob): {
  type: string;
  title: string;
  body: string | null;
} {
  const n = getNotificationMessages(defaultLocaleFromEnv());
  switch (job.kind) {
    case "report_scan_complete":
      return {
        type: "report",
        title: n.reportScanCompleteTitle,
        body: n.reportScanCompleteBody(job.shopDomain ?? "your store"),
      };
    case "report_monthly_summary":
      return {
        type: "report",
        title: n.reportMonthlyTitle,
        body: n.reportMonthlyBody(job.shopDomain ?? "your store"),
      };
    case "high_risk_alert":
      return {
        type: "high_risk",
        title: n.highRiskAlertTitle,
        body: n.highRiskAlertBody(job.shopDomain ?? "your store"),
      };
    case "evidence_expiry":
      return {
        type: "evidence",
        title: n.evidenceExpiryTitle,
        body: n.evidenceExpiryBody(job.shopDomain ?? "your store"),
      };
    default:
      throw new Error(`Unsupported notification kind: ${(job as { kind: string }).kind}`);
  }
}

async function sendEmailIfConfigured(args: {
  to: string | null;
  template: { subject: string; html: string };
}): Promise<void> {
  const env = getServerEnv();
  if (!env.RESEND_API_KEY || !env.RESEND_FROM_EMAIL || !args.to) {
    return;
  }
  const res = await http.post("https://api.resend.com/emails", {
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: env.RESEND_FROM_EMAIL,
      to: [args.to],
      subject: args.template.subject,
      html: args.template.html,
    }),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Resend API rejected notification email: ${body}`);
  }
}

async function sendSupportAlertIfConfigured(args: {
  kind: NotificationDispatchJob["kind"];
  title: string;
  body: string | null;
  link: string | undefined;
  shopId: string | undefined;
  shopDomain: string | undefined;
}): Promise<void> {
  if (args.kind !== "high_risk_alert") {
    return;
  }
  const env = getServerEnv();
  if (!env.SUPPORT_ALERT_WEBHOOK_URL) {
    return;
  }
  const res = await http.post(env.SUPPORT_ALERT_WEBHOOK_URL, {
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      event: "high_risk_alert",
      title: args.title,
      body: args.body,
      link: args.link,
      shopId: args.shopId,
      shopDomain: args.shopDomain,
      source: "disclo-notification-dispatcher",
    }),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Support alert webhook rejected payload: ${body}`);
  }
}

loadServerEnv();

export const notificationDispatcherWorker = new Worker(
  QUEUE_NAMES.notificationDispatch,
  async (job) => {
    const parsed = notificationDispatchJobSchema.safeParse(job.data);
    if (!parsed.success) {
      console.warn(
        `notification-dispatch job ${job.id}: invalid payload`,
        parsed.error.flatten(),
      );
      return;
    }
    const data = parsed.data;
    const copy = toNotificationCopy(data);
    const emailTemplate = renderNotificationEmailTemplate({
      job: data,
      title: copy.title,
      body: copy.body,
    });
    const user = await prisma.user.findUnique({
      where: { id: data.userId },
      select: { email: true },
    });
    await prisma.notification.create({
      data: {
        userId: data.userId,
        shopId: data.shopId ?? null,
        type: copy.type,
        title: copy.title,
        body: copy.body,
        link: data.link ?? "/app",
      },
    });

    await sendEmailIfConfigured({
      to: user?.email ?? null,
      template: emailTemplate,
    });
    await sendSupportAlertIfConfigured({
      kind: data.kind,
      title: copy.title,
      body: copy.body,
      link: data.link,
      shopId: data.shopId,
      shopDomain: data.shopDomain,
    });
  },
  getBullmqQueueOptions(requireRedisUrl()),
);

void notificationDispatcherWorker;
