/**
 * Type definitions for encrypted vault items
 */

/**
 * Plaintext vault item (before encryption)
 */
export interface VaultItemPlaintext {
  username: string;
  password: string;
  url?: string;
  notes?: string;
}

/**
 * Encrypted vault item payload
 * This is what gets encrypted and sent to the backend
 */
export interface VaultItemEncrypted {
  encryptedData: string; // Base64-encoded ciphertext
  iv: string; // Base64-encoded initialization vector
}

/**
 * Complete vault item with metadata
 * Metadata is NOT encrypted (for searchability)
 */
export interface VaultItem {
  id?: string;
  name: string; // Display name (e.g., "Gmail Account")
  category?: string; // Category (e.g., "email", "social", "banking")
  favorite?: boolean;
  encryptedData: string; // Encrypted VaultItemPlaintext
  iv: string;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Decrypted vault item (for display)
 */
export interface VaultItemDecrypted {
  id?: string;
  name: string;
  category?: string;
  favorite?: boolean;
  username: string;
  password: string;
  url?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Vault item for creation (before sending to backend)
 */
export interface CreateVaultItemRequest {
  name: string;
  category?: string;
  favorite?: boolean;
  username: string;
  password: string;
  url?: string;
  notes?: string;
}

/**
 * Key derivation result
 */
export interface DerivedKey {
  key: CryptoKey;
  salt: string;
}