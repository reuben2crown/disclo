import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useCallback, useEffect, useState } from "react";
import type { ChangeEvent } from "react";
import { Banner, BlockStack, Button, Card, FormLayout, IndexTable, Page, Select, Text, TextField } from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { Form, useActionData, useFetcher, useLoaderData, useOutletContext, } from "@remix-run/react";
import type { AppI18nOutletContext } from "../locales/i18n-outlet-context.js";
import prisma from "../db.server.js";
import { authenticate } from "../shopify.server.js";
import { createEvidenceItemForShopOwner, getEvidenceContext, linkEvidenceToScanItem, listEvidenceForShopOwner } from "../features/evidence/evidence.server.js";
import { createEvidenceUploadPresign } from "../features/storage/storage.server.js";

const EVIDENCE_OPTIONS = [
  { label: "Third-party certification", value: "third_party_certification" },
  { label: "Environmental label", value: "environmental_label" },
  { label: "Test report", value: "test_report" },
  { label: "Supplier attestation", value: "supplier_attestation" },
  { label: "Regulatory filing", value: "regulatory_filing" },
  { label: "Other", value: "other" },
];

const QUALITY_OPTIONS = [
  { label: "High", value: "high" },
  { label: "Review", value: "review" },
  { label: "None", value: "none" },
];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const url = new URL(request.url);
  const scanItemId = url.searchParams.get("scanItemId");
  const shop = await getEvidenceContext(prisma, session.shop);
  if (!shop) {
    return json({ rows: [], shopMissing: true, scanItemId });
  }
  const rows = await listEvidenceForShopOwner(prisma, shop.ownerUserId, shop.id);
  return json({ rows, shopMissing: false, scanItemId });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const form = await request.formData();
  const intent = String(form.get("intent") ?? "");
  const shop = await getEvidenceContext(prisma, session.shop);
  if (!shop) {
    return json({ ok: false, error: "Shop not found." }, { status: 404 });
  }

  if (intent === "presignUpload") {
    try {
      const fileName = String(form.get("fileName") ?? "");
      const contentType = String(form.get("contentType") ?? "application/octet-stream");
      const contentLengthRaw = form.get("contentLength");
      const contentLength =
        typeof contentLengthRaw === "string" && contentLengthRaw.length > 0
          ? Number(contentLengthRaw)
          : 0;
      const out = await createEvidenceUploadPresign({
        shopId: shop.id,
        fileName,
        contentType,
        contentLength,
        baseDirectory: "evidence",
        groupByDate: true
      });
      return json({ ok: true, ...out });
    } catch (error) {
      return json(
        { ok: false, error: error instanceof Error ? error.message : "Upload unavailable." },
        { status: 500 },
      );
    }
  }

  if (intent === "createEvidence") {
    const title = String(form.get("title") ?? "").trim();
    if (!title) {
      return json({ ok: false, error: "Title is required." }, { status: 400 });
    }
    const evidenceType = String(form.get("evidenceType") ?? "other");
    const qualityTier = String(form.get("qualityTier") ?? "review");
    await createEvidenceItemForShopOwner(prisma, {
      ownerUserId: shop.ownerUserId,
      shopId: shop.id,
      evidenceType,
      title,
      qualityTier,
      referenceUrl: String(form.get("referenceUrl") ?? "") || null,
      documentUrl: String(form.get("documentUrl") ?? "") || null,
      documentHash: String(form.get("documentHash") ?? "") || null,
      certificationBody: String(form.get("certificationBody") ?? "") || null,
      certificateNumber: String(form.get("certificateNumber") ?? "") || null,
      notes: String(form.get("notes") ?? "") || null,
    });
    return json({ ok: true, created: true });
  }

  if (intent === "linkEvidence") {
    const scanItemId = String(form.get("scanItemId") ?? "");
    const evidenceItemId = String(form.get("evidenceItemId") ?? "");
    const out = await linkEvidenceToScanItem({
      prisma,
      ownerUserId: shop.ownerUserId,
      shopId: shop.id,
      scanItemId,
      evidenceItemId,
    });
    if (!out.ok) {
      return json({ ok: false, error: "Could not link this evidence to the item." }, { status: 400 });
    }
    return json({ ok: true, linked: true });
  }

  return json({ ok: false, error: "Unknown action." }, { status: 400 });
};

export default function EvidenceLibraryPage() {
  const { m } = useOutletContext<AppI18nOutletContext>();
  const { rows, shopMissing, scanItemId } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const presignFetcher = useFetcher<{
    ok: boolean;
    error?: string;
    uploadUrl?: string;
    publicUrl?: string | null;
  }>();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadedDocumentUrl, setUploadedDocumentUrl] = useState("");
  const [uploadedDocumentHash, setUploadedDocumentHash] = useState("");

  const onPickFile = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setSelectedFile(event.currentTarget.files?.[0] ?? null);
    setUploadError(null);
  }, []);

  const onStartUpload = useCallback(() => {
    if (!selectedFile) {
      setUploadError("Choose a file first.");
      return;
    }
    const body = new FormData();
    body.set("intent", "presignUpload");
    body.set("fileName", selectedFile.name);
    body.set("contentType", selectedFile.type || "application/octet-stream");
    body.set("contentLength", String(selectedFile.size || 0));
    presignFetcher.submit(body, { method: "post" });
  }, [presignFetcher, selectedFile]);

  useEffect(() => {
    async function uploadToR2() {
      if (!selectedFile || !presignFetcher.data?.ok || !presignFetcher.data.uploadUrl) {
        return;
      }
      setIsUploading(true);
      setUploadError(null);
      try {
        const uploadRes = await fetch(presignFetcher.data.uploadUrl, {
          method: "PUT",
          headers: {
            "Content-Type": selectedFile.type || "application/octet-stream",
          },
          body: selectedFile,
        });
        if (!uploadRes.ok) {
          throw new Error("R2 upload failed.");
        }
        const bytes = await selectedFile.arrayBuffer();
        const digest = await crypto.subtle.digest("SHA-256", bytes);
        const hex = Array.from(new Uint8Array(digest))
          .map((b) => b.toString(16).padStart(2, "0"))
          .join("");
        setUploadedDocumentHash(hex);
        if (presignFetcher.data.publicUrl) {
          setUploadedDocumentUrl(presignFetcher.data.publicUrl);
        }
      } catch (error) {
        setUploadError(error instanceof Error ? error.message : "Upload failed.");
      } finally {
        setIsUploading(false);
      }
    }
    void uploadToR2();
  }, [presignFetcher.data, selectedFile]);

  return (
    <Page title="Evidence library" backAction={{ url: "/app" }}>
      <TitleBar title="Evidence library" />
      <BlockStack gap="500">
        {shopMissing && <Banner tone="critical">{m.scan.shopMissing}</Banner>}
        {actionData && "error" in actionData && actionData.error && (
          <Banner tone="critical">{actionData.error}</Banner>
        )}
        {actionData?.ok && "created" in actionData && actionData.created && (
          <Banner tone="success">Evidence item created.</Banner>
        )}
        {actionData?.ok && "linked" in actionData && actionData.linked && (
          <Banner tone="success">Evidence linked to scan item.</Banner>
        )}
        {uploadError && <Banner tone="critical">{uploadError}</Banner>}
        {isUploading && (
          <Banner tone="info">Uploading file and calculating SHA-256 hash…</Banner>
        )}
        {!isUploading && uploadedDocumentUrl && uploadedDocumentHash && (
          <Banner tone="success">Upload complete. URL and SHA-256 were filled in.</Banner>
        )}

        <Card>
          <BlockStack gap="300">
            <Text as="h2" variant="headingMd">Add evidence</Text>
            <Form method="post">
              <input type="hidden" name="intent" value="createEvidence" />
              <FormLayout>
                <TextField label="Title" name="title" autoComplete="off" />
                <Select label="Evidence type" name="evidenceType" options={EVIDENCE_OPTIONS} />
                <Select label="Quality tier" name="qualityTier" options={QUALITY_OPTIONS} />
                <TextField label="Reference URL" name="referenceUrl" autoComplete="off" />
                <div>
                  <Text as="p" variant="bodyMd">Upload document to R2</Text>
                  <input type="file" onChange={onPickFile} />
                  <Button onClick={onStartUpload} disabled={!selectedFile || isUploading}>
                    Upload to R2
                  </Button>
                </div>
                <TextField
                  label="Document URL"
                  name="documentUrl"
                  autoComplete="off"
                  value={uploadedDocumentUrl}
                  onChange={setUploadedDocumentUrl}
                />
                <TextField
                  label="Document SHA-256 hash"
                  name="documentHash"
                  autoComplete="off"
                  value={uploadedDocumentHash}
                  onChange={setUploadedDocumentHash}
                />
                <TextField label="Certification body" name="certificationBody" autoComplete="off" />
                <TextField label="Certificate number" name="certificateNumber" autoComplete="off" />
                <TextField label="Notes" name="notes" autoComplete="off" multiline={3} />
                <Button submit variant="primary">Create evidence</Button>
              </FormLayout>
            </Form>
          </BlockStack>
        </Card>

        {scanItemId && (
          <Card>
            <BlockStack gap="300">
              <Text as="h2" variant="headingMd">Link evidence to scan item</Text>
              <Form method="post">
                <input type="hidden" name="intent" value="linkEvidence" />
                <input type="hidden" name="scanItemId" value={scanItemId} />
                <FormLayout>
                  <Select
                    label="Evidence item"
                    name="evidenceItemId"
                    options={rows.map((r) => ({ label: `${r.title} (${r.evidenceType})`, value: r.id }))}
                  />
                  <Button submit>Link evidence</Button>
                </FormLayout>
              </Form>
            </BlockStack>
          </Card>
        )}

        <Card>
          <BlockStack gap="300">
            <Text as="h2" variant="headingMd">Evidence library</Text>
            <IndexTable
              itemCount={rows.length}
              headings={[
                { title: "Title" },
                { title: "Type" },
                { title: "Verification" },
                { title: "Updated" },
              ]}
              selectable={false}
            >
              {rows.map((row, idx) => (
                <IndexTable.Row id={row.id} key={row.id} position={idx}>
                  <IndexTable.Cell>{row.title}</IndexTable.Cell>
                  <IndexTable.Cell>{row.evidenceType}</IndexTable.Cell>
                  <IndexTable.Cell>{row.verificationStatus}</IndexTable.Cell>
                  <IndexTable.Cell>{new Date(row.updatedAt).toLocaleString()}</IndexTable.Cell>
                </IndexTable.Row>
              ))}
            </IndexTable>
          </BlockStack>
        </Card>
      </BlockStack>
    </Page>
  );
}
