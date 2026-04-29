import { describe, expect, it, vi, beforeEach } from "vitest";
import { storageRegistry } from "@disclo/core";
import { createEvidenceUploadPresign, validateUploadInput } from "./storage.server.js";

describe("validateUploadInput", () => {
  it("rejects missing extension", () => {
    expect(() =>
      validateUploadInput({
        fileName: "nodot",
        contentType: "image/png",
      }),
    ).toThrow(/extension/);
  });

  it("rejects disallowed mime", () => {
    expect(() =>
      validateUploadInput({
        fileName: "a.exe",
        contentType: "application/x-msdownload",
      }),
    ).toThrow(/Unsupported/);
  });
});

describe("createEvidenceUploadPresign", () => {
  beforeEach(() => {
    storageRegistry.setStorageProvider({
      generateSignedUrl: vi.fn().mockResolvedValue({
        uploadUrl: "https://signed.example/put",
        publicUrl: "https://cdn.example/evidence/shop-1/2026-01-01/k-file.pdf",
      }),
      uploadFile: vi.fn(),
      deleteFile: vi.fn(),
    });
  });

  it("builds object key and calls storage provider", async () => {
    const provider = storageRegistry.getStorageProvider();
    const out = await createEvidenceUploadPresign({
      shopId: "shop-1",
      fileName: "cert.pdf",
      contentType: "application/pdf",
      contentLength: 100
    });
    expect(provider.generateSignedUrl).toHaveBeenCalledWith(
      expect.objectContaining({
        filename: expect.stringMatching(/^evidence\/shop-1\/\d{4}-\d{2}-\d{2}\/.+\-cert\.pdf$/),
        contentType: "application/pdf",
      }),
    );
    expect(out.uploadUrl).toBe("https://signed.example/put");
    expect(out.publicUrl).toContain("evidence/shop-1/");
  });
});
