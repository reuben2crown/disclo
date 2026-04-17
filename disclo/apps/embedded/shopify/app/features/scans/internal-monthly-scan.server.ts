import type { ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { getInternalHttpMessages, loadServerEnv } from "@disclo/core";
import prisma from "../../db.server.js";
import { enqueueMonthlyAutoScansFromPlan } from "./scan-enqueue.server";

/**
 * BE-19: workers call this with `Authorization: Bearer ${INTERNAL_API_SECRET}`.
 * Lives in `.server.ts` so the Remix client bundle never pulls `loadServerEnv` / full `@disclo/core` barrel.
 */
export const internalMonthlyScanAction = async ({ request }: ActionFunctionArgs) => {
  const http = getInternalHttpMessages();

  if (request.method !== "POST") {
    return json({ ok: false, error: http.postOnly }, { status: 405 });
  }

  const env = loadServerEnv();
  const secret = env.INTERNAL_API_SECRET;
  const auth = request.headers.get("Authorization");
  if (!secret || auth !== `Bearer ${secret}`) {
    return json({ ok: false, error: http.authFailed }, { status: 401 });
  }

  const batch = await enqueueMonthlyAutoScansFromPlan(prisma);
  return json({ ok: true, ...batch });
};
