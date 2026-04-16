import {
  createCipheriv,
  createDecipheriv,
  createHash,
  randomBytes,
} from "node:crypto";
import { ValidationError } from "./errors.js";

const ALGO = "aes-256-gcm";
const IV_LEN = 12;
const TAG_LEN = 16;

function deriveKey(keyMaterial: string): Buffer {
  return createHash("sha256").update(keyMaterial, "utf8").digest();
}

/**
 * Encrypt plaintext using AES-256-GCM. Output format: base64(iv || ciphertext || tag).
 */
export function encryptString(plaintext: string, encryptionKey: string): string {
  if (!encryptionKey || encryptionKey.length < 32) {
    throw new ValidationError(
      "ENCRYPTION_KEY must be set to at least 32 characters for AES-256-GCM",
    );
  }
  const key = deriveKey(encryptionKey);
  const iv = randomBytes(IV_LEN);
  const cipher = createCipheriv(ALGO, key, iv);
  const enc = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, enc, tag]).toString("base64");
}

export function decryptString(payload: string, encryptionKey: string): string {
  if (!encryptionKey || encryptionKey.length < 32) {
    throw new ValidationError(
      "ENCRYPTION_KEY must be set to at least 32 characters for AES-256-GCM",
    );
  }
  const key = deriveKey(encryptionKey);
  const buf = Buffer.from(payload, "base64");
  if (buf.length < IV_LEN + TAG_LEN) {
    throw new ValidationError("Invalid ciphertext");
  }
  const iv = buf.subarray(0, IV_LEN);
  const tag = buf.subarray(buf.length - TAG_LEN);
  const data = buf.subarray(IV_LEN, buf.length - TAG_LEN);
  const decipher = createDecipheriv(ALGO, key, iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(data), decipher.final()]).toString("utf8");
}
