/**
 * Main crypto module export
 * Provides all cryptographic functionality for the password manager
 */

// Constants
export * from './constants';

// Utilities
export {
  isWebCryptoAvailable,
  ensureWebCrypto,
  stringToBuffer,
  bufferToString,
  bufferToBase64,
  base64ToBuffer,
  generateRandomBytes,
  generateRandomBase64,
  constantTimeCompare,
  clearBuffer,
  clearString,
} from './utils';

// Key Derivation
export {
  deriveMasterKey,
  deriveMasterKeyRaw,
  verifyPassword,
  generateSalt,
} from './key-derivation';

// Encryption/Decryption
export {
  encrypt,
  decrypt,
  encryptObject,
  decryptObject,
  encryptBatch,
  decryptBatch,
} from './encryption';

// Types
export type { EncryptedData } from './encryption';
export type {
  VaultItemPlaintext,
  VaultItemEncrypted,
  VaultItem,
  VaultItemDecrypted,
  CreateVaultItemRequest,
  DerivedKey,
} from './types';

// Key Manager
export { keyManager } from './key-manager';

// High-level helper functions
export {
  encryptVaultItem,
  decryptVaultItem,
  prepareVaultItemForStorage,
  decryptVaultItemFull,
  decryptVaultItems,
  prepareVaultItemUpdate,
} from './vault-crypto';