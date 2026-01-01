/**
 * Key Manager - Manages master key in memory
 * 
 * SECURITY NOTES:
 * - Master key is stored in memory only (never persisted)
 * - Key is cleared on logout or page close
 * - Key must be re-derived on page refresh
 */

import { deriveMasterKey } from './key-derivation';

class KeyManager {
  private masterKey: CryptoKey | null = null;
  private salt: string | null = null;
  private autoLockTimer: NodeJS.Timeout | null = null;
  private autoLockDelay: number = 15 * 60 * 1000; // 15 minutes default

  /**
   * Initialize key manager with password and salt
   * Derives the master key and stores it in memory
   */
  async initialize(password: string, salt: string): Promise<void> {
    this.masterKey = await deriveMasterKey(password, salt);
    this.salt = salt;
    this.resetAutoLock();
  }

  /**
   * Get the current master key
   * Throws if key is not initialized
   */
  getMasterKey(): CryptoKey {
    if (!this.masterKey) {
      throw new Error('Master key not initialized. Please login first.');
    }
    this.resetAutoLock(); // Reset timer on each access
    return this.masterKey;
  }

  /**
   * Get the salt
   */
  getSalt(): string | null {
    return this.salt;
  }

  /**
   * Check if key is initialized
   */
  isInitialized(): boolean {
    return this.masterKey !== null;
  }

  /**
   * Clear the master key from memory
   * Should be called on logout
   */
  clear(): void {
    this.masterKey = null;
    this.salt = null;
    this.clearAutoLock();
  }

  /**
   * Set auto-lock delay
   * @param minutes - Minutes of inactivity before auto-lock
   */
  setAutoLockDelay(minutes: number): void {
    this.autoLockDelay = minutes * 60 * 1000;
    this.resetAutoLock();
  }

  /**
   * Get auto-lock delay in minutes
   */
  getAutoLockDelay(): number {
    return this.autoLockDelay / 60 / 1000;
  }

  /**
   * Reset the auto-lock timer
   */
  private resetAutoLock(): void {
    this.clearAutoLock();
    
    if (typeof window !== 'undefined') {
      this.autoLockTimer = setTimeout(() => {
        console.log('Auto-locking due to inactivity');
        this.clear();
        // Optionally trigger a logout event
        window.dispatchEvent(new CustomEvent('autolock'));
      }, this.autoLockDelay);
    }
  }

  /**
   * Clear the auto-lock timer
   */
  private clearAutoLock(): void {
    if (this.autoLockTimer) {
      clearTimeout(this.autoLockTimer);
      this.autoLockTimer = null;
    }
  }

  /**
   * Re-derive master key (for verification or key rotation)
   */
  async rederive(password: string): Promise<void> {
    if (!this.salt) {
      throw new Error('Salt not available. Cannot re-derive key.');
    }
    await this.initialize(password, this.salt);
  }
}

// Singleton instance
export const keyManager = new KeyManager();

// Cleanup on page unload
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    keyManager.clear();
  });

  // Listen for auto-lock events
  window.addEventListener('autolock', () => {
    // You can trigger additional logic here (e.g., redirect to login)
    console.log('Vault auto-locked due to inactivity');
  });
}