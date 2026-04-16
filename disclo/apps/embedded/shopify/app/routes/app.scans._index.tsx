import { useCallback, useMemo } from "react";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Form,
  useLoaderData,
  useOutletContext,
  useSearchParams,
} from "@remix-run/react";
import {
  BlockStack,
  Button,
  Card,
  EmptySearchResult,
  IndexTable,
  INDEX_TABLE_SELECT_ALL_ITEMS,
  InlineStack,
  Page,
  Text,
  useIndexResourceState,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { REGULATION_CONFIGS } from "@disclo/core/regulations";
import type { AppI18nOutletContext } from "../i18n-outlet-context.js";
import prisma from "../db.server";
import { loadShopScansForList } from "../scans-list.server";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const url = new URL(request.url);
  const regulation = url.searchParams.get("regulation")?.trim() || null;
  const dir = url.searchParams.get("dir") === "asc" ? "asc" : "desc";

  const scans = await loadShopScansForList(prisma, session.shop, {
    regulationFilter: regulation,
    sortDir: dir,
  });

  const regulationOptions = REGULATION_CONFIGS.map((c) => ({
    code: c.code,
    label: `${c.displayName} (${c.code})`,
  }));

  return json({ scans, regulation, sortDir: dir, regulationOptions });
};

function downloadCsv(filename: string, header: string, lines: string[]) {
  const body = [header, ...lines].join("\n");
  const blob = new Blob([body], { type: "text/csv;charset=utf-8" });
  const el = document.createElement("a");
  el.href = URL.createObjectURL(blob);
  el.download = filename;
  el.click();
  URL.revokeObjectURL(el.href);
}

export default function ScansListPage() {
  const { m } = useOutletContext<AppI18nOutletContext>();
  const { scans, regulation, sortDir, regulationOptions } =
    useLoaderData<typeof loader>();
  const [searchParams, setSearchParams] = useSearchParams();

  const rows = useMemo(
    () => scans.map((s) => ({ ...s, id: s.id })),
    [scans],
  );

  const {
    selectedResources,
    allResourcesSelected,
    handleSelectionChange,
  } = useIndexResourceState(rows);

  const selectedItemsCount = allResourcesSelected
    ? INDEX_TABLE_SELECT_ALL_ITEMS
    : selectedResources.length;

  const onSort = useCallback(
    (_index: number, direction: "ascending" | "descending") => {
      const next = new URLSearchParams(searchParams);
      next.set("dir", direction === "ascending" ? "asc" : "desc");
      if (regulation) {
        next.set("regulation", regulation);
      }
      setSearchParams(next);
    },
    [regulation, searchParams, setSearchParams],
  );

  const exportSelected = useCallback(() => {
    const ids = allResourcesSelected ? rows.map((r) => r.id) : selectedResources;
    if (ids.length === 0) {
      return;
    }
    downloadCsv(
      "disclo-scans-export.csv",
      "scan_id",
      ids,
    );
  }, [allResourcesSelected, rows, selectedResources]);

  const sortDirection = sortDir === "asc" ? "ascending" : "descending";

  const rowMarkup = scans.map((row, index) => (
    <IndexTable.Row
      id={row.id}
      key={row.id}
      position={index}
      selected={selectedResources.includes(row.id)}
    >
      <IndexTable.Cell>
        <Text as="span" variant="bodyMd" fontWeight="semibold">
          {new Date(row.createdAt).toLocaleString()}
        </Text>
      </IndexTable.Cell>
      <IndexTable.Cell>{row.scanType}</IndexTable.Cell>
      <IndexTable.Cell>{row.status}</IndexTable.Cell>
      <IndexTable.Cell>
        {row.totalItems != null ? String(row.totalItems) : "—"}
      </IndexTable.Cell>
      <IndexTable.Cell>
        {row.riskScore != null ? String(row.riskScore) : "—"}
      </IndexTable.Cell>
      <IndexTable.Cell>
        {row.flaggedItems != null ? String(row.flaggedItems) : "—"}
      </IndexTable.Cell>
      <IndexTable.Cell>
        <Button url={`/app/scans/${row.id}`} variant="plain">
          {m.scansList.openRow}
        </Button>
      </IndexTable.Cell>
    </IndexTable.Row>
  ));

  const regulationSelectOptions = [
    { label: m.scansList.allRegulations, value: "" },
    ...regulationOptions.map((o) => ({ label: o.label, value: o.code })),
  ];

  return (
    <Page>
      <TitleBar title={m.scansList.titleBar} />
      <BlockStack gap="500">
        <Text as="p" variant="bodyMd" tone="subdued">
          {m.scansList.intro}
        </Text>

        <Card>
          <Form method="get" replace>
            <BlockStack gap="300">
              <Text as="p" variant="bodySm" fontWeight="semibold">
                {m.scansList.filterLabel}
              </Text>
              <InlineStack gap="400" blockAlign="center" wrap>
                <select
                  name="regulation"
                  defaultValue={regulation ?? ""}
                  aria-label={m.scansList.filterAria}
                  style={{ minWidth: 280, padding: "0.5rem" }}
                >
                  {regulationSelectOptions.map((o) => (
                    <option key={o.value || "all"} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
                <input type="hidden" name="dir" value={sortDir} />
                <Button submit>
                  {m.scansList.applyRegulationFilter}
                </Button>
              </InlineStack>
            </BlockStack>
          </Form>
        </Card>

        <Card padding="0">
          <IndexTable
            resourceName={{ singular: "scan", plural: "scans" }}
            itemCount={scans.length}
            selectedItemsCount={selectedItemsCount}
            onSelectionChange={handleSelectionChange}
            headings={[
              { title: m.scansList.tableStarted, id: "started" },
              { title: m.scansList.tableType },
              { title: m.scansList.tableStatus },
              { title: m.scansList.tableItems },
              { title: m.scansList.tableScore },
              { title: m.scansList.tableFlagged },
              { title: m.scansList.tableActions },
            ]}
            sortable={[true, false, false, false, false, false, false]}
            sortColumnIndex={0}
            sortDirection={sortDirection}
            onSort={onSort}
            bulkActions={[
              {
                content: m.scansList.exportCsv,
                onAction: exportSelected,
              },
            ]}
            emptyState={
              <EmptySearchResult
                title={m.scansList.emptyTitle}
                description={m.scansList.emptyDescription}
                withIllustration
              />
            }
          >
            {rowMarkup}
          </IndexTable>
        </Card>

        <Text as="p" variant="bodySm" tone="subdued">
          {m.scansList.footnote}
        </Text>

        <Button url="/app" variant="plain">
          {m.scansList.openDashboard}
        </Button>
      </BlockStack>
    </Page>
  );
}
