/**
 * Contract for Media Storage providers.
 * Any storage service (Cloudflare R2, AWS S3, etc.) must implement this.
 */
export interface IStorageProvider {
  /**
   * Generates a pre-signed URL for direct client-side upload or download.
   */
  generateSignedUrl(params: {
    filename: string;
    contentType: string;
    expiresIn?: number;
  }): Promise<{
    uploadUrl: string;
    publicUrl: string;
  }>;

  /**
   * Uploads a file directly from the server.
   * Note: Prefer generateSignedUrl for user-facing uploads to reduce server load.
   */
  uploadFile(params: {
    filename: string;
    content: Buffer | Uint8Array | ReadableStream;
    contentType: string;
  }): Promise<{ publicUrl: string }>;

  /**
   * Deletes a file from the storage provider.
   */
  deleteFile(publicUrl: string): Promise<void>;
}

