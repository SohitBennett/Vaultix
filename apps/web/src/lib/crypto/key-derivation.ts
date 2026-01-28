import {
  PBKDF2_ITERATIONS,
  PBKDF2_KEY_LENGTH,
  PBKDF2_HASH_ALGORITHM,
  CRYPTO_ERRORS,
} from './constants';
import {
  ensureWebCrypto,
  stringToBuffer,
  base64ToBuffer,
  bufferToBase64,
} from './utils';

/**
 * Derive a master key from password and salt using PBKDF2
 * 
 * @param password - User's master password
 * @param salt - Base64-encoded salt (from server)
 * @param iterations - Number of PBKDF2 iterations (default: 100,000)
 * @returns CryptoKey suitable for AES encryption
 */
export async function deriveMasterKey(
  password: string,
  salt: string,
  iterations: number = PBKDF2_ITERATIONS
): Promise<CryptoKey> {
  console.log('[Key Derivation] Starting key derivation', {
    passwordLength: password.length,
    saltLength: salt.length,
    iterations,
    algorithm: PBKDF2_HASH_ALGORITHM,
    keyLength: PBKDF2_KEY_LENGTH,
  });

  ensureWebCrypto();

  try {
    // Convert password to key material
    console.log('[Key Derivation] Step 1: Converting password to buffer');
    const passwordBuffer = stringToBuffer(password);
    console.log('[Key Derivation] Password buffer size:', passwordBuffer.byteLength, 'bytes');

    console.log('[Key Derivation] Step 2: Importing key material');
    const keyMaterial = await window.crypto.subtle.importKey(
      'raw',
      passwordBuffer,
      { name: 'PBKDF2' },
      false,
      ['deriveBits', 'deriveKey']
    );
    console.log('[Key Derivation] ✅ Key material imported successfully');

    // Convert salt from base64
    console.log('[Key Derivation] Step 3: Converting salt from base64');
    const saltBuffer = base64ToBuffer(salt);
    console.log('[Key Derivation] Salt buffer size:', saltBuffer.byteLength, 'bytes');

    // Derive key using PBKDF2
    console.log('[Key Derivation] Step 4: Deriving master key with PBKDF2');
    const startTime = performance.now();
    
    const masterKey = await window.crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: saltBuffer,
        iterations: iterations,
        hash: PBKDF2_HASH_ALGORITHM,
      },
      keyMaterial,
      { name: 'AES-GCM', length: PBKDF2_KEY_LENGTH },
      false, // Not extractable (more secure)
      ['encrypt', 'decrypt']
    );

    const endTime = performance.now();
    console.log('[Key Derivation] ✅ Master key derived successfully in', (endTime - startTime).toFixed(2), 'ms');
    console.log('[Key Derivation] Key type:', masterKey.type, 'Algorithm:', masterKey.algorithm);

    return masterKey;
  } catch (error) {
    console.error('[Key Derivation] ❌ Key derivation failed');
    console.error('[Key Derivation] Error type:', error?.constructor?.name);
    console.error('[Key Derivation] Error message:', error instanceof Error ? error.message : String(error));
    console.error('[Key Derivation] Full error:', error);
    throw new Error(CRYPTO_ERRORS.KEY_DERIVATION_FAILED);
  }
}

/**
 * Derive a key and return it as raw bytes (for testing/export)
 * WARNING: Use carefully - exposing raw key material is dangerous
 * 
 * @param password - User's master password
 * @param salt - Base64-encoded salt
 * @param iterations - Number of PBKDF2 iterations
 * @returns Base64-encoded derived key
 */
export async function deriveMasterKeyRaw(
  password: string,
  salt: string,
  iterations: number = PBKDF2_ITERATIONS
): Promise<string> {
  ensureWebCrypto();

  try {
    const passwordBuffer = stringToBuffer(password);
    const keyMaterial = await window.crypto.subtle.importKey(
      'raw',
      passwordBuffer,
      { name: 'PBKDF2' },
      false,
      ['deriveBits']
    );

    const saltBuffer = base64ToBuffer(salt);

    const derivedBits = await window.crypto.subtle.deriveBits(
      {
        name: 'PBKDF2',
        salt: saltBuffer,
        iterations: iterations,
        hash: PBKDF2_HASH_ALGORITHM,
      },
      keyMaterial,
      PBKDF2_KEY_LENGTH
    );

    return bufferToBase64(new Uint8Array(derivedBits));
  } catch (error) {
    console.error('Raw key derivation error:', error);
    throw new Error(CRYPTO_ERRORS.KEY_DERIVATION_FAILED);
  }
}

/**
 * Verify password against a salt (by deriving and comparing)
 * This is useful for validating the master password before operations
 * 
 * @param password - Password to verify
 * @param salt - Base64-encoded salt
 * @param expectedKeyHash - Hash of the expected derived key (for comparison)
 * @returns True if password is correct
 */
export async function verifyPassword(
  password: string,
  salt: string,
  expectedKeyHash: string
): Promise<boolean> {
  try {
    const derivedKey = await deriveMasterKeyRaw(password, salt);
    return derivedKey === expectedKeyHash;
  } catch (error) {
    return false;
  }
}

/**
 * Generate a new salt for a user
 * Should be called during registration and stored in the database
 * 
 * @returns Base64-encoded salt (32 bytes)
 */
export function generateSalt(): string {
  ensureWebCrypto();
  const salt = new Uint8Array(32); // 32 bytes = 256 bits
  window.crypto.getRandomValues(salt);
  return bufferToBase64(salt);
}