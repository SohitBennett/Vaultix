import { CRYPTO_ERRORS } from './constants';

/**
 * Check if Web Crypto API is available
 */
export function isWebCryptoAvailable(): boolean {
  return typeof window !== 'undefined' && 
         window.crypto && 
         window.crypto.subtle !== undefined;
}

/**
 * Ensure Web Crypto API is available, throw if not
 */
export function ensureWebCrypto(): void {
  if (!isWebCryptoAvailable()) {
    throw new Error(CRYPTO_ERRORS.WEB_CRYPTO_UNAVAILABLE);
  }
}

/**
 * Convert string to Uint8Array
 */
export function stringToBuffer(str: string): Uint8Array {
  const encoder = new TextEncoder();
  return encoder.encode(str);
}

/**
 * Convert Uint8Array to string
 */
export function bufferToString(buffer: Uint8Array): string {
  const decoder = new TextDecoder();
  return decoder.decode(buffer);
}

/**
 * Convert Uint8Array to base64 string
 */
export function bufferToBase64(buffer: Uint8Array): string {
  const binary = Array.from(buffer)
    .map(byte => String.fromCharCode(byte))
    .join('');
  return btoa(binary);
}

/**
 * Convert base64 string to Uint8Array
 */
export function base64ToBuffer(base64: string): Uint8Array {
  try {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  } catch (error) {
    throw new Error('Invalid base64 string');
  }
}

/**
 * Generate cryptographically secure random bytes
 */
export function generateRandomBytes(length: number): Uint8Array {
  ensureWebCrypto();
  const buffer = new Uint8Array(length);
  window.crypto.getRandomValues(buffer);
  return buffer;
}

/**
 * Generate random base64 string
 */
export function generateRandomBase64(length: number): string {
  const bytes = generateRandomBytes(length);
  return bufferToBase64(bytes);
}

/**
 * Securely compare two buffers in constant time
 * Prevents timing attacks
 */
export function constantTimeCompare(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) {
    return false;
  }
  
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a[i] ^ b[i];
  }
  
  return result === 0;
}

/**
 * Clear sensitive data from memory
 */
export function clearBuffer(buffer: Uint8Array): void {
  for (let i = 0; i < buffer.length; i++) {
    buffer[i] = 0;
  }
}

/**
 * Clear sensitive string from memory (best effort)
 */
export function clearString(str: string): void {
  // Note: In JavaScript, we can't truly clear strings from memory
  // This is a best-effort approach
  if (str && typeof str === 'string') {
    // @ts-ignore - Attempting to overwrite
    str = '\0'.repeat(str.length);
  }
}