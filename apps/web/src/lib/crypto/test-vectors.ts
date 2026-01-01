/**
 * Test vectors and testing utilities for crypto functions
 * Use these to verify encryption is working correctly
 */

import {
  deriveMasterKey,
  encrypt,
  decrypt,
  encryptObject,
  decryptObject,
  generateSalt,
} from './index';

/**
 * Test vector for key derivation
 */
export const TEST_VECTORS = {
  password: 'TestPassword123!',
  salt: 'dGVzdHNhbHQxMjM0NTY3ODkwMTIzNDU2Nzg5MDEyMzQ1Njc4OTA=', // Base64 "testsalt..."
  plaintext: 'Hello, World!',
  object: { username: 'test@example.com', password: 'secret123' },
};

/**
 * Run basic encryption tests
 * Returns true if all tests pass
 */
export async function runCryptoTests(): Promise<{
  success: boolean;
  results: { test: string; passed: boolean; error?: string }[];
}> {
  const results: { test: string; passed: boolean; error?: string }[] = [];

  // Test 1: Key Derivation
  try {
    const key = await deriveMasterKey(
      TEST_VECTORS.password,
      TEST_VECTORS.salt
    );
    results.push({
      test: 'Key Derivation',
      passed: key !== null && key !== undefined,
    });
  } catch (error) {
    results.push({
      test: 'Key Derivation',
      passed: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }

  // Test 2: String Encryption/Decryption
  try {
    const key = await deriveMasterKey(
      TEST_VECTORS.password,
      TEST_VECTORS.salt
    );
    const encrypted = await encrypt(TEST_VECTORS.plaintext, key);
    const decrypted = await decrypt(encrypted, key);
    results.push({
      test: 'String Encryption/Decryption',
      passed: decrypted === TEST_VECTORS.plaintext,
    });
  } catch (error) {
    results.push({
      test: 'String Encryption/Decryption',
      passed: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }

  // Test 3: Object Encryption/Decryption
  try {
    const key = await deriveMasterKey(
      TEST_VECTORS.password,
      TEST_VECTORS.salt
    );
    const encrypted = await encryptObject(TEST_VECTORS.object, key);
    const decrypted = await decryptObject<typeof TEST_VECTORS.object>(
      encrypted,
      key
    );
    results.push({
      test: 'Object Encryption/Decryption',
      passed:
        decrypted.username === TEST_VECTORS.object.username &&
        decrypted.password === TEST_VECTORS.object.password,
    });
  } catch (error) {
    results.push({
      test: 'Object Encryption/Decryption',
      passed: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }

  // Test 4: IV Uniqueness
  try {
    const key = await deriveMasterKey(
      TEST_VECTORS.password,
      TEST_VECTORS.salt
    );
    const encrypted1 = await encrypt(TEST_VECTORS.plaintext, key);
    const encrypted2 = await encrypt(TEST_VECTORS.plaintext, key);
    results.push({
      test: 'IV Uniqueness',
      passed:
        encrypted1.iv !== encrypted2.iv &&
        encrypted1.ciphertext !== encrypted2.ciphertext,
    });
  } catch (error) {
    results.push({
      test: 'IV Uniqueness',
      passed: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }

  // Test 5: Wrong Key Fails Decryption
  try {
    const key1 = await deriveMasterKey(
      TEST_VECTORS.password,
      TEST_VECTORS.salt
    );
    const key2 = await deriveMasterKey(
      'WrongPassword123!',
      TEST_VECTORS.salt
    );
    const encrypted = await encrypt(TEST_VECTORS.plaintext, key1);
    
    let decryptionFailed = false;
    try {
      await decrypt(encrypted, key2);
    } catch {
      decryptionFailed = true;
    }
    
    results.push({
      test: 'Wrong Key Fails Decryption',
      passed: decryptionFailed,
    });
  } catch (error) {
    results.push({
      test: 'Wrong Key Fails Decryption',
      passed: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }

  // Test 6: Salt Generation
  try {
    const salt1 = generateSalt();
    const salt2 = generateSalt();
    results.push({
      test: 'Salt Generation',
      passed:
        salt1 !== salt2 &&
        salt1.length > 0 &&
        salt2.length > 0,
    });
  } catch (error) {
    results.push({
      test: 'Salt Generation',
      passed: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }

  const allPassed = results.every((r) => r.passed);

  return {
    success: allPassed,
    results,
  };
}

/**
 * Performance test - measure encryption/decryption speed
 */
export async function runPerformanceTest(
  iterations: number = 100
): Promise<{
  averageEncryptionTime: number;
  averageDecryptionTime: number;
  averageKeyDerivationTime: number;
}> {
  const key = await deriveMasterKey(
    TEST_VECTORS.password,
    TEST_VECTORS.salt
  );

  // Test encryption
  const encryptStart = performance.now();
  for (let i = 0; i < iterations; i++) {
    await encrypt(TEST_VECTORS.plaintext, key);
  }
  const encryptEnd = performance.now();
  const averageEncryptionTime = (encryptEnd - encryptStart) / iterations;

  // Test decryption
  const encrypted = await encrypt(TEST_VECTORS.plaintext, key);
  const decryptStart = performance.now();
  for (let i = 0; i < iterations; i++) {
    await decrypt(encrypted, key);
  }
  const decryptEnd = performance.now();
  const averageDecryptionTime = (decryptEnd - decryptStart) / iterations;

  // Test key derivation (expensive operation)
  const keyDerivStart = performance.now();
  for (let i = 0; i < 10; i++) {
    await deriveMasterKey(TEST_VECTORS.password, TEST_VECTORS.salt);
  }
  const keyDerivEnd = performance.now();
  const averageKeyDerivationTime = (keyDerivEnd - keyDerivStart) / 10;

  return {
    averageEncryptionTime,
    averageDecryptionTime,
    averageKeyDerivationTime,
  };
}

/**
 * Log crypto test results to console
 */
export function logTestResults(results: {
  success: boolean;
  results: { test: string; passed: boolean; error?: string }[];
}): void {
  console.log('🔐 Crypto Tests Results:');
  console.log('========================');
  
  results.results.forEach((result) => {
    const icon = result.passed ? '✅' : '❌';
    console.log(`${icon} ${result.test}`);
    if (result.error) {
      console.log(`   Error: ${result.error}`);
    }
  });
  
  console.log('========================');
  console.log(
    results.success
      ? '✅ All tests passed!'
      : '❌ Some tests failed'
  );
}