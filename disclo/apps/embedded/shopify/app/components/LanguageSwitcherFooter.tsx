import { useEffect, useState } from "react";
import { useFetcher, useLocation } from "@remix-run/react";
import { Box, InlineStack, Select, Text } from "@shopify/polaris";
import {
  LOCALE_NATIVE_LABELS,
  SUPPORTED_LOCALES,
  type MerchantMessages,
  type SupportedLocale,
} from "@disclo/core/i18n";

type Props = {
  m: MerchantMessages;
  cookieLocale: SupportedLocale | null;
  /** Marketing / plain pages: native `<select>` (no Polaris CSS required). */
  polarisChrome?: boolean;
  /** `footer`: bordered bar under app shell. `plain`: compact row (e.g. inside Settings card). */
  layout?: "footer" | "plain";
  className?: string;
};

/**
 * Language control: POSTs to `/locale`, then returns to the current URL.
 */
export function LanguageSwitcherFooter({
  m,
  cookieLocale,
  polarisChrome = true,
  layout = "footer",
  className,
}: Props) {
  const fetcher = useFetcher();
  const location = useLocation();
  const returnTo = `${location.pathname}${location.search}`;
  const [value, setValue] = useState(() => cookieLocale ?? "");

  useEffect(() => {
    setValue(cookieLocale ?? "");
  }, [cookieLocale]);

  const options = [
    { label: m.settings.languageBrowserDefault, value: "" },
    ...SUPPORTED_LOCALES.map((code) => ({
      label: LOCALE_NATIVE_LABELS[code],
      value: code,
    })),
  ];

  const busy = fetcher.state !== "idle";

  const submit = (next: string) => {
    fetcher.submit(
      {
        intent: "setLocale",
        locale: next,
        returnTo,
      },
      { method: "post", action: "/locale" },
    );
  };

  if (!polarisChrome) {
    return (
      <footer className={className} style={{ marginTop: "2rem", paddingTop: "1rem" }}>
        <label
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "0.5rem",
            alignItems: "center",
            fontSize: "0.875rem",
          }}
        >
          <span style={{ color: "var(--p-color-text-secondary, #616161)" }}>
            {m.footer.language}
          </span>
          <select
            aria-label={m.footer.languageLabel}
            value={value}
            disabled={busy}
            onChange={(e) => {
              const next = e.target.value;
              setValue(next);
              submit(next);
            }}
            style={{ minWidth: 200, padding: "0.35rem 0.5rem" }}
          >
            {options.map((o) => (
              <option key={o.value || "browser"} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
      </footer>
    );
  }

  const row = (
    <InlineStack align="space-between" blockAlign="center" wrap={false} gap="300">
      <Text variant="bodySm" tone="subdued" as="span">
        {m.footer.language}
      </Text>
      <div style={{ minWidth: 200, flexShrink: 0 }}>
        <Select
          label={m.footer.languageLabel}
          labelHidden
          options={options}
          value={value}
          disabled={busy}
          onChange={(next) => {
            setValue(next);
            submit(next);
          }}
        />
      </div>
    </InlineStack>
  );

  if (layout === "plain") {
    return (
      <div className={className}>
        {row}
      </div>
    );
  }

  return (
    <Box
      as="footer"
      paddingBlockStart="400"
      paddingBlockEnd="300"
      borderColor="border"
      borderBlockStartWidth="025"
      className={className}
    >
      {row}
    </Box>
  );
}
