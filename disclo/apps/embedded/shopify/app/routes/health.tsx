import type { LoaderFunctionArgs } from "@remix-run/node";

/**
 * Plain HTTP health check for load balancers and Playwright smoke (no session).
 */
export const loader = async ({ request: _request }: LoaderFunctionArgs) => {
  return new Response("ok", {
    status: 200,
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
