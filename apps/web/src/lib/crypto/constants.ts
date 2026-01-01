/**
 * Cryptographic constants for the password manager
 * All values chosen based on OWASP recommendations and industry standards
 */

// PBKDF2 Configuration
export const PBKDF2_ITERATIONS = 100000; // OWASP minimum: 100,000 iterations
export const PBKDF2_KEY_LENGTH = 256; // 256 bits = 32 bytes
export const PBKDF2_HASH_ALGORITHM = 'SHA-256';

// AES-GCM Configuration
export const AES_ALGORITHM = 'AES-GCM';
export const AES_KEY_LENGTH = 256; // 256 bits
export const AES_IV_LENGTH = 12; // 12 bytes (96 bits) for GCM
export const AES_TAG_LENGTH = 128; // 128 bits authentication tag

// Encoding
export const TEXT_ENCODING = 'utf-8';

// Error Messages
export const CRYPTO_ERRORS = {
  WEB_CRYPTO_UNAVAILABLE: 'Web Crypto API is not available in this browser',
  INVALID_KEY: 'Invalid encryption key',
  INVALID_DATA: 'Invalid data for encryption/decryption',
  ENCRYPTION_FAILED: 'Encryption operation failed',
  DECRYPTION_FAILED: 'Decryption operation failed',
  KEY_DERIVATION_FAILED: 'Key derivation failed',
  INVALID_SALT: 'Invalid salt format',
  INVALID_IV: 'Invalid initialization vector',
} as const;