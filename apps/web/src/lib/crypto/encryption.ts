import {
  AES_ALGORITHM,
  AES_IV_LENGTH,
  AES_TAG_LENGTH,
  CRYPTO_ERRORS,
} from './constants';
import {
  ensureWebCrypto,
  stringToBuffer,
  bufferToString,
  bufferToBase64,
  base64ToBuffer,
  generateRandomBytes,
} from './utils';

/**
 * Encrypted data structure
 */
export interface EncryptedData {
  ciphertext: string; // Base64-encoded encrypted data
  iv: string; // Base64-encoded initialization vector
}

/**
 * Encrypt plaintext data using AES-256-GCM
 * 
 * @param plaintext - Data to encrypt (as string)
 * @param masterKey - CryptoKey derived from user password
 * @returns EncryptedData object with ciphertext and IV
 */
export async function encrypt(
  plaintext: string,
  masterKey: CryptoKey
): Promise<EncryptedData> {
  ensureWebCrypto();

  if (!plaintext) {
    throw new Error(CRYPTO_ERRORS.INVALID_DATA);
  }

  if (!masterKey) {
    throw new Error(CRYPTO_ERRORS.INVALID_KEY);
  }

  try {
    // Generate random IV (initialization vector)
    // CRITICAL: Must be unique for every encryption operation
    const iv = generateRandomBytes(AES_IV_LENGTH);

    // Convert plaintext to buffer
    const plaintextBuffer = stringToBuffer(plaintext);

    // Encrypt using AES-GCM
    const ciphertextBuffer = await window.crypto.subtle.encrypt(
      {
        name: AES_ALGORITHM,
        iv: iv,
        tagLength: AES_TAG_LENGTH,
      },
      masterKey,
      plaintextBuffer
    );

    // Convert to base64 for storage
    const ciphertext = bufferToBase64(new Uint8Array(ciphertextBuffer));
    const ivBase64 = bufferToBase64(iv);

    return {
      ciphertext,
      iv: ivBase64,
    };
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error(CRYPTO_ERRORS.ENCRYPTION_FAILED);
  }
}

/**
 * Decrypt ciphertext using AES-256-GCM
 * 
 * @param encryptedData - EncryptedData object with ciphertext and IV
 * @param masterKey - CryptoKey derived from user password
 * @returns Decrypted plaintext as string
 */
export async function decrypt(
  encryptedData: EncryptedData,
  masterKey: CryptoKey
): Promise<string> {
  ensureWebCrypto();

  if (!encryptedData || !encryptedData.ciphertext || !encryptedData.iv) {
    throw new Error(CRYPTO_ERRORS.INVALID_DATA);
  }

  if (!masterKey) {
    throw new Error(CRYPTO_ERRORS.INVALID_KEY);
  }

  try {
    // Convert from base64
    const ciphertextBuffer = base64ToBuffer(encryptedData.ciphertext);
    const iv = base64ToBuffer(encryptedData.iv);

    // Verify IV length
    if (iv.length !== AES_IV_LENGTH) {
      throw new Error(CRYPTO_ERRORS.INVALID_IV);
    }

    // Decrypt using AES-GCM
    const plaintextBuffer = await window.crypto.subtle.decrypt(
      {
        name: AES_ALGORITHM,
        iv: iv,
        tagLength: AES_TAG_LENGTH,
      },
      masterKey,
      ciphertextBuffer
    );

    // Convert back to string
    const plaintext = bufferToString(new Uint8Array(plaintextBuffer));

    return plaintext;
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error(CRYPTO_ERRORS.DECRYPTION_FAILED);
  }
}

/**
 * Encrypt an object (converts to JSON first)
 * 
 * @param obj - Object to encrypt
 * @param masterKey - CryptoKey derived from user password
 * @returns EncryptedData object
 */
export async function encryptObject<T>(
  obj: T,
  masterKey: CryptoKey
): Promise<EncryptedData> {
  try {
    const json = JSON.stringify(obj);
    return await encrypt(json, masterKey);
  } catch (error) {
    throw new Error(CRYPTO_ERRORS.ENCRYPTION_FAILED);
  }
}

/**
 * Decrypt and parse object from encrypted data
 * 
 * @param encryptedData - EncryptedData object
 * @param masterKey - CryptoKey derived from user password
 * @returns Decrypted and parsed object
 */
export async function decryptObject<T>(
  encryptedData: EncryptedData,
  masterKey: CryptoKey
): Promise<T> {
  try {
    const json = await decrypt(encryptedData, masterKey);
    return JSON.parse(json) as T;
  } catch (error) {
    throw new Error(CRYPTO_ERRORS.DECRYPTION_FAILED);
  }
}

/**
 * Batch encrypt multiple items
 * Useful for encrypting entire vault
 * 
 * @param items - Array of items to encrypt
 * @param masterKey - CryptoKey derived from user password
 * @returns Array of encrypted items
 */
export async function encryptBatch<T>(
  items: T[],
  masterKey: CryptoKey
): Promise<EncryptedData[]> {
  const encrypted: EncryptedData[] = [];
  
  for (const item of items) {
    const encryptedItem = await encryptObject(item, masterKey);
    encrypted.push(encryptedItem);
  }
  
  return encrypted;
}

/**
 * Batch decrypt multiple items
 * Useful for decrypting entire vault
 * 
 * @param encryptedItems - Array of encrypted items
 * @param masterKey - CryptoKey derived from user password
 * @returns Array of decrypted items
 */
export async function decryptBatch<T>(
  encryptedItems: EncryptedData[],
  masterKey: CryptoKey
): Promise<T[]> {
  const decrypted: T[] = [];
  
  for (const encryptedItem of encryptedItems) {
    try {
      const decryptedItem = await decryptObject<T>(encryptedItem, masterKey);
      decrypted.push(decryptedItem);
    } catch (error) {
      console.error('Failed to decrypt item:', error);
      // Continue with other items even if one fails
    }
  }
  
  return decrypted;
}