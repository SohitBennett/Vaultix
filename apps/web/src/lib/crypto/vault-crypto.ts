/**
 * High-level crypto functions for vault items
 * Provides convenient wrappers around encryption functions
 */

import { encryptObject, decryptObject } from './encryption';
import { keyManager } from './key-manager';
import type {
  VaultItemPlaintext,
  VaultItem,
  VaultItemDecrypted,
  CreateVaultItemRequest,
} from './types';

/**
 * Encrypt a vault item for storage
 * 
 * @param item - Plaintext vault item data
 * @param masterKey - Optional master key (uses keyManager if not provided)
 * @returns Encrypted data structure
 */
export async function encryptVaultItem(
  item: VaultItemPlaintext,
  masterKey?: CryptoKey
): Promise<{ encryptedData: string; iv: string }> {
  const key = masterKey || keyManager.getMasterKey();
  
  const encrypted = await encryptObject(item, key);
  
  return {
    encryptedData: encrypted.ciphertext,
    iv: encrypted.iv,
  };
}

/**
 * Decrypt a vault item
 * 
 * @param encryptedData - Base64-encoded ciphertext
 * @param iv - Base64-encoded initialization vector
 * @param masterKey - Optional master key (uses keyManager if not provided)
 * @returns Decrypted vault item
 */
export async function decryptVaultItem(
  encryptedData: string,
  iv: string,
  masterKey?: CryptoKey
): Promise<VaultItemPlaintext> {
  const key = masterKey || keyManager.getMasterKey();
  
  return await decryptObject<VaultItemPlaintext>(
    { ciphertext: encryptedData, iv },
    key
  );
}

/**
 * Prepare a new vault item for storage
 * Encrypts the sensitive data and returns the structure for backend
 * 
 * @param item - Create vault item request
 * @returns Vault item ready for backend API
 */
export async function prepareVaultItemForStorage(
  item: CreateVaultItemRequest
): Promise<Omit<VaultItem, 'id' | 'createdAt' | 'updatedAt'>> {
  // Extract sensitive data for encryption
  const sensitiveData: VaultItemPlaintext = {
    username: item.username,
    password: item.password,
    url: item.url,
    notes: item.notes,
  };

  // Encrypt sensitive data
  const encrypted = await encryptVaultItem(sensitiveData);

  // Return structure with metadata (not encrypted) and encrypted data
  return {
    name: item.name,
    category: item.category,
    favorite: item.favorite || false,
    encryptedData: encrypted.encryptedData,
    iv: encrypted.iv,
  };
}

/**
 * Decrypt a vault item from backend response
 * Combines metadata with decrypted sensitive data
 * 
 * @param vaultItem - Encrypted vault item from backend
 * @returns Fully decrypted vault item
 */
export async function decryptVaultItemFull(
  vaultItem: VaultItem
): Promise<VaultItemDecrypted> {
  const decrypted = await decryptVaultItem(
    vaultItem.encryptedData,
    vaultItem.iv
  );

  return {
    id: vaultItem.id,
    name: vaultItem.name,
    category: vaultItem.category,
    favorite: vaultItem.favorite,
    username: decrypted.username,
    password: decrypted.password,
    url: decrypted.url,
    notes: decrypted.notes,
    createdAt: vaultItem.createdAt,
    updatedAt: vaultItem.updatedAt,
  };
}

/**
 * Batch decrypt vault items
 * Useful for decrypting entire vault list
 * 
 * @param items - Array of encrypted vault items
 * @returns Array of decrypted vault items
 */
export async function decryptVaultItems(
  items: VaultItem[]
): Promise<VaultItemDecrypted[]> {
  const decrypted: VaultItemDecrypted[] = [];

  for (const item of items) {
    try {
      const decryptedItem = await decryptVaultItemFull(item);
      decrypted.push(decryptedItem);
    } catch (error) {
      console.error(`Failed to decrypt item ${item.id}:`, error);
      // Continue with other items
    }
  }

  return decrypted;
}

/**
 * Update vault item - encrypts the new data
 * 
 * @param itemId - ID of item to update
 * @param updates - Updated vault item data
 * @returns Updated vault item ready for backend
 */
export async function prepareVaultItemUpdate(
  itemId: string,
  updates: Partial<CreateVaultItemRequest>
): Promise<Partial<VaultItem>> {
  const result: Partial<VaultItem> = {};

  // Update metadata (not encrypted)
  if (updates.name !== undefined) result.name = updates.name;
  if (updates.category !== undefined) result.category = updates.category;
  if (updates.favorite !== undefined) result.favorite = updates.favorite;

  // If any sensitive data is updated, re-encrypt everything
  const hasSensitiveUpdates =
    updates.username !== undefined ||
    updates.password !== undefined ||
    updates.url !== undefined ||
    updates.notes !== undefined;

  if (hasSensitiveUpdates) {
    // Note: In a real update, you'd fetch the current item,
    // decrypt it, merge updates, and re-encrypt
    // For now, we expect all sensitive fields to be provided
    if (
      updates.username === undefined ||
      updates.password === undefined
    ) {
      throw new Error(
        'When updating sensitive data, username and password are required'
      );
    }

    const sensitiveData: VaultItemPlaintext = {
      username: updates.username,
      password: updates.password,
      url: updates.url,
      notes: updates.notes,
    };

    const encrypted = await encryptVaultItem(sensitiveData);
    result.encryptedData = encrypted.encryptedData;
    result.iv = encrypted.iv;
  }

  return result;
}