'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { PasswordGenerator } from '@/components/generator/PasswordGenerator';
import { generatePassphrase, generatePIN } from '@/lib/password-generator/generator';

export default function GeneratorPage() {
  const { isAuthenticated } = useAuth();
  const [passphraseCount, setPassphraseCount] = useState(4);
  const [passphrase, setPassphrase] = useState('');
  const [pinLength, setPinLength] = useState(6);
  const [pin, setPin] = useState('');
  const [copiedPassphrase, setCopiedPassphrase] = useState(false);
  const [copiedPin, setCopiedPin] = useState(false);

  const handleGeneratePassphrase = () => {
    const newPassphrase = generatePassphrase(passphraseCount);
    setPassphrase(newPassphrase);
  };

  const handleGeneratePIN = () => {
    const newPin = generatePIN(pinLength);
    setPin(newPin);
  };

  const copyPassphrase = async () => {
    try {
      await navigator.clipboard.writeText(passphrase);
      setCopiedPassphrase(true);
      setTimeout(() => setCopiedPassphrase(false), 2000);
    } catch (error) {
      console.error('Copy failed:', error);
    }
  };

  const copyPin = async () => {
    try {
      await navigator.clipboard.writeText(pin);
      setCopiedPin(true);
      setTimeout(() => setCopiedPin(false), 2000);
    } catch (error) {
      console.error('Copy failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold text-blue-600">🔐</span>
            <span className="ml-2 text-xl font-bold text-gray-900">
              Password Manager
            </span>
          </Link>
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <Link href="/vault" className="btn-primary">
                Go to Vault
              </Link>
            ) : (
              <>
                <Link href="/login" className="btn-secondary">
                  Login
                </Link>
                <Link href="/register" className="btn-primary">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            🎲 Password Generator
          </h1>
          <p className="text-lg text-gray-600">
            Generate secure, cryptographically random passwords for your accounts
          </p>
        </div>

        {/* Standard Password Generator */}
        <div className="card mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Password Generator
          </h2>
          <PasswordGenerator showCopyButton={true} />
        </div>

        {/* Passphrase Generator */}
        <div className="card mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Passphrase Generator
          </h2>
          <p className="text-gray-600 mb-6">
            Generate memorable passphrases using random words. Example:{' '}
            <span className="font-mono text-sm">correct-horse-battery-staple</span>
          </p>

          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="label">Number of Words: {passphraseCount}</label>
              </div>
              <input
                type="range"
                min="3"
                max="8"
                value={passphraseCount}
                onChange={(e) => setPassphraseCount(parseInt(e.target.value))}
                className="w-full"
              />
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={passphrase}
                readOnly
                placeholder="Click generate to create a passphrase"
                className="input flex-1 font-mono"
              />
              <button
                onClick={handleGeneratePassphrase}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
              >
                Generate
              </button>
              {passphrase && (
                <button
                  onClick={copyPassphrase}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
                >
                  {copiedPassphrase ? '✓' : '📋'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* PIN Generator */}
        <div className="card mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            PIN Generator
          </h2>
          <p className="text-gray-600 mb-6">
            Generate secure numeric PINs for phone locks, ATM cards, etc.
          </p>

          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="label">PIN Length: {pinLength}</label>
              </div>
              <input
                type="range"
                min="4"
                max="8"
                value={pinLength}
                onChange={(e) => setPinLength(parseInt(e.target.value))}
                className="w-full"
              />
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={pin}
                readOnly
                placeholder="Click generate to create a PIN"
                className="input flex-1 font-mono text-2xl tracking-widest"
              />
              <button
                onClick={handleGeneratePIN}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
              >
                Generate
              </button>
              {pin && (
                <button
                  onClick={copyPin}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
                >
                  {copiedPin ? '✓' : '📋'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Security Info */}
        <div className="card bg-blue-50 border-blue-200">
          <div className="flex items-start gap-4">
            <div className="text-4xl">🔒</div>
            <div>
              <h3 className="text-lg font-semibold text-blue-900 mb-2">
                Cryptographically Secure
              </h3>
              <p className="text-blue-800 text-sm mb-2">
                All passwords are generated using{' '}
                <code className="bg-blue-100 px-1 rounded">
                  crypto.getRandomValues()
                </code>
                , which provides cryptographically strong random values.
              </p>
              <p className="text-blue-800 text-sm">
                <strong>Never use Math.random() for passwords!</strong> It's not
                secure and can be predicted.
              </p>
            </div>
          </div>
        </div>

        {/* Tips */}
        <div className="mt-8 grid md:grid-cols-2 gap-6">
          <div className="card">
            <h3 className="font-semibold text-gray-900 mb-2">
              💡 Password Best Practices
            </h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Use 16+ characters for high security</li>
              <li>• Include all character types</li>
              <li>• Never reuse passwords across sites</li>
              <li>• Change passwords if compromised</li>
              <li>• Use a password manager (like this!)</li>
            </ul>
          </div>

          <div className="card">
            <h3 className="font-semibold text-gray-900 mb-2">
              🎯 When to Use Each Type
            </h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• <strong>Password:</strong> Most secure for accounts</li>
              <li>• <strong>Passphrase:</strong> Easy to remember</li>
              <li>• <strong>PIN:</strong> For numeric-only systems</li>
              <li>• <strong>Maximum:</strong> Critical accounts</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}