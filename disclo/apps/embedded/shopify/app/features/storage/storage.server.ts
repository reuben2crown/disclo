import { storageRegistry } from "@disclo/core";
import { randomUUID } from "node:crypto";

const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "application/pdf",
]);

const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

export function validateUploadInput(input: {
  fileName: string;
  contentType: string;
  contentLength?: number;
}) {
  if (!input.fileName.includes(".")) {
    throw new Error("Invalid filename: missing extension");
  }
  if (!ALLOWED_MIME_TYPES.has(input.contentType)) {
    throw new Error("Unsupported file type");
  }
  if (input.contentLength != null && input.contentLength > MAX_UPLOAD_BYTES) {
    throw new Error("File too large (max 10MB)");
  }
}

/**
 * 
 * @param shopId shop id
 * @param fileName original filename
 * @param baseDirectory base location of the file in the bucket
 * @param groupByDate indicate if file should be uploaded in a sub-directory created by date
 * @returns object key @{uploadUrl, objectKey, publicUrl}
 */
export function buildObjectKey(shopId: string, fileName: string, baseDirectory?: string, groupByDate?: boolean): string {
  const safeName = fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
  const subDirectory = groupByDate ? `${new Date().toISOString().slice(0, 10)}/` : "";
  const newFileName = `${randomUUID()}-${safeName}`;
  let path = `${baseDirectory || 'evidence'}/${shopId}/${subDirectory}${newFileName}`;
  return path;
}

/**
 * Handle all file uploads
 * @param input 
 * @returns 
 */
export async function createEvidenceUploadPresign(input: {
  shopId: string;
  fileName: string;
  contentType: string;
  contentLength: number;
  baseDirectory?: string;
  groupByDate?: boolean;
}): Promise<{ uploadUrl: string; objectKey: string; publicUrl: string | null }> {
  validateUploadInput({
    fileName: input.fileName,
    contentType: input.contentType,
    contentLength: input.contentLength,
  });

  const objectKey = buildObjectKey(input.shopId, input.fileName, input.baseDirectory, input.groupByDate);

  const result = await storageRegistry.getStorageProvider().generateSignedUrl({
    filename: objectKey,
    contentType: input.contentType,
  });
  return {
    uploadUrl: result.uploadUrl,
    objectKey,
    publicUrl: result.publicUrl ?? null,
  };
}
