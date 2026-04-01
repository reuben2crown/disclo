import { Hono } from "hono";

const app = new Hono();

app.get("/health", (c) => c.json({ ok: true }));
app.get("/", (c) => c.json({ service: "disclo-api", version: "v1" }));

app.post("/v1/webhooks-inbound", (c) => {
  return c.json({ accepted: true });
});

export default app;
