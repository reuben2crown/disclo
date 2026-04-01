import { BlockStack, Card, FormLayout, Page, Text, TextField } from "@shopify/polaris";
import { useState } from "react";

export default function SettingsPage() {
  const [markets, setMarkets] = useState("EU");
  return (
    <Page title="Shop settings" backAction={{ url: "/app" }}>
      <Card>
        <BlockStack gap="400">
          <Text as="h2" variant="headingMd">
            Target markets
          </Text>
          <Text as="p" variant="bodyMd" tone="subdued">
            Determines which regulations apply (EU AI Act, Florida, NY, FTC Green Guides, EU Green Claims). Wire to
            `shop_settings.target_markets`. Default: EU.
          </Text>
          <FormLayout>
            <TextField
              label="Target markets (comma-separated)"
              value={markets}
              onChange={setMarkets}
              autoComplete="off"
              helpText="Example: EU, US-FL, US-NY, US-Federal"
            />
          </FormLayout>
        </BlockStack>
      </Card>
    </Page>
  );
}
