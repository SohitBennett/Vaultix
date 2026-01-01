'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import Link from 'next/link';
import { keyManager, encrypt, decrypt } from '@/lib/crypto';

function VaultContent() {
  const { user, logout, isVaultUnlocked, unlockVault } = useAuth();
  const [unlockPassword, setUnlockPassword] = useState('');
  const [unlockError, setUnlockError] = useState('');
  const [isUnlocking, setIsUnlocking] = useState(false);

  // Demo encryption
  const [demoText, setDemoText] = useState('');
  const [encryptedDemo, setEncryptedDemo] = useState<{
    ciphertext: string;
    iv: string;
  } | null>(null);
  const [decryptedDemo, setDecryptedDemo] = useState('');

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    setUnlockError('');
    setIsUnlocking(true);

    try {
      await unlockVault(unlockPassword);
      setUnlockPassword('');
    } catch (error) {
      setUnlockError(
        error instanceof Error ? error.message : 'Failed to unlock vault'
      );
    } finally {
      setIsUnlocking(false);
    }
  };

  const handleEncryptDemo = async () => {
    try {
      const masterKey = keyManager.getMasterKey();
      const encrypted = await encrypt(demoText, masterKey);
      setEncryptedDemo(encrypted);
      setDecryptedDemo('');
    } catch (error) {
      alert('Encryption failed: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const handleDecryptDemo = async () => {
    if (!encryptedDemo) return;
    
    try {
      const masterKey = keyManager.getMasterKey();
      const decrypted = await decrypt(encryptedDemo, masterKey);
      setDecryptedDemo(decrypted);
    } catch (error) {
      alert('Decryption failed: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-2xl font-bold text-blue-600">🔐</span>
            <span className="ml-2 text-xl font-bold text-gray-900">
              Password Manager
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">{user?.email}</span>
            {isVaultUnlocked && (
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                🔓 Unlocked
              </span>
            )}
            <button onClick={handleLogout} className="btn-secondary">
              Logout
            </button>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Your Vault</h1>
          <p className="mt-2 text-gray-600">
            Manage your passwords securely with end-to-end encryption
          </p>
        </div>

        {/* Unlock Vault Form */}
        {!isVaultUnlocked && (
          <div className="card mb-8 max-w-md">
            <h2 className="text-xl font-semibold mb-4">Unlock Vault</h2>
            <p className="text-gray-600 mb-4">
              Enter your master password to unlock your vault and access encrypted data.
            </p>
            <form onSubmit={handleUnlock} className="space-y-4">
              {unlockError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {unlockError}
                </div>
              )}
              <div>
                <label htmlFor="unlock-password" className="label">
                  Master Password
                </label>
                <input
                  id="unlock-password"
                  type="password"
                  value={unlockPassword}
                  onChange={(e) => setUnlockPassword(e.target.value)}
                  className="input"
                  placeholder="Enter your password"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isUnlocking}
                className="w-full btn-primary disabled:opacity-50"
              >
                {isUnlocking ? 'Unlocking...' : 'Unlock Vault'}
              </button>
            </form>
          </div>
        )}

        {/* Phase Status */}
        {isVaultUnlocked ? (
          <>
            <div className="card mb-8">
              <div className="flex items-start">
                <span className="text-green-500 text-4xl mr-4">✓</span>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Phase 2 Complete!
                  </h2>
                  <p className="text-gray-600 mb-4">
                    Client-side encryption is now fully functional. Your vault is unlocked
                    and ready to use.
                  </p>
                  <div className="flex gap-4">
                    <Link href="/crypto-test" className="btn-primary">
                      Test Encryption
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Encryption Demo */}
            <div className="card mb-8">
              <h2 className="text-xl font-semibold mb-4">🔐 Encryption Demo</h2>
              <p className="text-gray-600 mb-4">
                Try encrypting and decrypting text with your master key:
              </p>
              
              <div className="space-y-4">
                <div>
                  <label className="label">Text to Encrypt</label>
                  <textarea
                    value={demoText}
                    onChange={(e) => setDemoText(e.target.value)}
                    className="input"
                    rows={3}
                    placeholder="Enter some text to encrypt..."
                  />
                </div>

                <button
                  onClick={handleEncryptDemo}
                  disabled={!demoText}
                  className="btn-primary disabled:opacity-50"
                >
                  Encrypt Text
                </button>

                {encryptedDemo && (
                  <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                    <div>
                      <label className="label">Encrypted (Ciphertext)</label>
                      <textarea
                        value={encryptedDemo.ciphertext}
                        className="input font-mono text-xs"
                        rows={3}
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="label">IV (Initialization Vector)</label>
                      <input
                        value={encryptedDemo.iv}
                        className="input font-mono text-xs"
                        readOnly
                      />
                    </div>

                    <button
                      onClick={handleDecryptDemo}
                      className="btn-secondary"
                    >
                      Decrypt Text
                    </button>

                    {decryptedDemo && (
                      <div>
                        <label className="label">Decrypted Result</label>
                        <textarea
                          value={decryptedDemo}
                          className="input bg-green-50 border-green-300"
                          rows={3}
                          readOnly
                        />
                        {decryptedDemo === demoText && (
                          <p className="text-green-600 text-sm mt-2">
                            ✓ Decryption successful! Text matches original.
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Phase Progress */}
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-start">
                  <span className="text-green-500 text-xl mr-3">✓</span>
                  <div>
                    <h3 className="font-semibold text-green-900">
                      Phase 1: Authentication
                    </h3>
                    <p className="text-sm text-green-700">
                      User registration, login, and JWT-based auth
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-start">
                  <span className="text-green-500 text-xl mr-3">✓</span>
                  <div>
                    <h3 className="font-semibold text-green-900">
                      Phase 2: Encryption Layer
                    </h3>
                    <p className="text-sm text-green-700">
                      Client-side AES-256-GCM encryption with PBKDF2 key derivation
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start">
                  <span className="text-blue-500 text-xl mr-3">→</span>
                  <div>
                    <h3 className="font-semibold text-blue-900">
                      Next: Phase 3 - Vault CRUD
                    </h3>
                    <p className="text-sm text-blue-700">
                      Full vault functionality with encrypted storage
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="card text-center py-12">
            <div className="text-6xl mb-4">🔒</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Vault Locked
            </h2>
            <p className="text-gray-600">
              Please unlock your vault to continue
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

export default function VaultPage() {
  return (
    <ProtectedRoute>
      <VaultContent />
    </ProtectedRoute>
  );
}