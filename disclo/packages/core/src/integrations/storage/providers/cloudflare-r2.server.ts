import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { IStorageProvider } from "../storage-contract.js";

/**
 * Cloudflare R2 implementation of the Storage Provider.
 * Connects via S3-compatible API.
 */
export class CloudflareR2Provider implements IStorageProvider {
  private client: S3Client;
  private bucket: string;
  /** Full origin for public reads, e.g. https://cdn.example.com (optional). */
  private publicBaseUrl: string | undefined;

  constructor(config: {
    endpoint: string,
    accessKeyId: string,
    secretAccessKey: string,
    bucket: string,
    /** Full public origin (matches `R2_PUBLIC_URL` in config). */
    publicBaseUrl?: string;
  }) {
    this.client = new S3Client({
      region: "auto",
      endpoint: config.endpoint,
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
      },
    });
    this.bucket = config.bucket;
    this.publicBaseUrl = config.publicBaseUrl?.replace(/\/$/, "");
  }

  private buildPublicUrl(objectKey: string): string {
    if (this.publicBaseUrl) {
      return new URL(objectKey, `${this.publicBaseUrl}/`).toString();
    }
    return `https://pub-${this.bucket}.r2.dev/${objectKey}`;
  }

  async generateSignedUrl(params: {
    filename: string;
    contentType: string;
    expiresIn?: number;
  }) {
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: params.filename,
      ContentType: params.contentType,
    });

    const uploadUrl = await getSignedUrl(this.client, command, { expiresIn: params.expiresIn || 3600 });

    const publicUrl = this.buildPublicUrl(params.filename);

    return { uploadUrl, publicUrl };
  }

  async uploadFile(params: {
    filename: string;
    content: Buffer | Uint8Array | ReadableStream;
    contentType: string;
  }) {
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: params.filename,
      Body: params.content as any, // S3 client handles Buffer/Stream
      ContentType: params.contentType,
    });

    await this.client.send(command);

    const publicUrl = this.buildPublicUrl(params.filename);

    return { publicUrl };
  }

  async deleteFile(publicUrl: string) {
    let key: string;
    try {
      key = new URL(publicUrl).pathname.replace(/^\//, "");
    } catch {
      return;
    }
    if (!key) return;
    const command = new DeleteObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });
    await this.client.send(command);
  }
}

export const cloudFlareR2Provider = new CloudflareR2Provider({
  endpoint: process.env.CLOUDFLARE_R2_ENDPOINT || "",
  accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID || "",
  secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY || "",
  bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME || "gild-ugc",
  publicBaseUrl: process.env.CLOUDFLARE_R2_PUBLIC_DOMAIN || "",
});
