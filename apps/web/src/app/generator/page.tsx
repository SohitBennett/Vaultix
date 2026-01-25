'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { PasswordGenerator } from '@/components/generator/PasswordGenerator';
import { generatePassphrase, generatePIN } from '@/lib/password-generator/generator';
import { Dices, Lock, Lightbulb, Target, Copy, Check } from 'lucide-react';

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
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 transition-opacity duration-200 hover:opacity-70">
            <svg className="w-6 h-6 text-gray-900" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <span className="text-lg font-semibold text-gray-900" style={{ letterSpacing: '-0.01em' }}>
              Vaultix
            </span>
          </Link>
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <Link href="/vault" className="claude-landing-btn-primary">
                Go to Vault
              </Link>
            ) : (
              <>
                <Link href="/login" className="claude-landing-btn-secondary">
                  Login
                </Link>
                <Link href="/register" className="claude-landing-btn-primary">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10">
          <h1 className="text-4xl font-semibold text-gray-900 mb-3 flex items-center gap-3" style={{ letterSpacing: '-0.02em' }}>
            <Dices className="w-10 h-10" />
            Password Generator
          </h1>
          <p className="text-base text-gray-600">
            Generate secure, cryptographically random passwords for your accounts
          </p>
        </div>

        {/* Standard Password Generator */}
        <div className="bg-white border border-gray-200 rounded-2xl p-8 mb-6" style={{ boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)' }}>
          <h2 className="text-xl font-semibold text-gray-900 mb-6" style={{ letterSpacing: '-0.01em' }}>
            Password Generator
          </h2>
          <PasswordGenerator showCopyButton={true} />
        </div>

        {/* Passphrase Generator */}
        <div className="bg-white border border-gray-200 rounded-2xl p-8 mb-6" style={{ boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)' }}>
          <h2 className="text-xl font-semibold text-gray-900 mb-3" style={{ letterSpacing: '-0.01em' }}>
            Passphrase Generator
          </h2>
          <p className="text-sm text-gray-600 mb-6">
            Generate memorable passphrases using random words. Example:{' '}
            <span className="font-mono text-sm">correct-horse-battery-staple</span>
          </p>

          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="claude-label">Number of Words: {passphraseCount}</label>
              </div>
              <input
                type="range"
                min="3"
                max="8"
                value={passphraseCount}
                onChange={(e) => setPassphraseCount(parseInt(e.target.value))}
                className="w-full accent-gray-900"
              />
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={passphrase}
                readOnly
                placeholder="Click generate to create a passphrase"
                className="claude-input flex-1 font-mono"
              />
              <button
                onClick={handleGeneratePassphrase}
                className="px-4 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 font-medium transition-all duration-150 text-sm"
              >
                Generate
              </button>
              {passphrase && (
                <button
                  onClick={copyPassphrase}
                  className="px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-all duration-150 text-sm"
                >
                  {copiedPassphrase ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* PIN Generator */}
        <div className="bg-white border border-gray-200 rounded-2xl p-8 mb-6" style={{ boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)' }}>
          <h2 className="text-xl font-semibold text-gray-900 mb-3" style={{ letterSpacing: '-0.01em' }}>
            PIN Generator
          </h2>
          <p className="text-sm text-gray-600 mb-6">
            Generate secure numeric PINs for phone locks, ATM cards, etc.
          </p>

          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="claude-label">PIN Length: {pinLength}</label>
              </div>
              <input
                type="range"
                min="4"
                max="8"
                value={pinLength}
                onChange={(e) => setPinLength(parseInt(e.target.value))}
                className="w-full accent-gray-900"
              />
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={pin}
                readOnly
                placeholder="Click generate to create a PIN"
                className="claude-input flex-1 font-mono text-2xl tracking-widest"
              />
              <button
                onClick={handleGeneratePIN}
                className="px-4 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 font-medium transition-all duration-150 text-sm"
              >
                Generate
              </button>
              {pin && (
                <button
                  onClick={copyPin}
                  className="px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-all duration-150 text-sm"
                >
                  {copiedPin ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Security Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-6" style={{ boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)' }}>
          <div className="flex items-start gap-4">
            <Lock className="w-10 h-10 text-blue-600 flex-shrink-0" />
            <div>
              <h3 className="text-base font-semibold text-blue-900 mb-2" style={{ letterSpacing: '-0.01em' }}>
                Cryptographically Secure
              </h3>
              <p className="text-sm text-blue-800 mb-2">
                All passwords are generated using{' '}
                <code className="bg-blue-100 px-1.5 py-0.5 rounded text-xs">
                  crypto.getRandomValues()
                </code>
                , which provides cryptographically strong random values.
              </p>
              <p className="text-sm text-blue-800">
                <strong>Never use Math.random() for passwords!</strong> It's not
                secure and can be predicted.
              </p>
            </div>
          </div>
        </div>

        {/* Tips */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-white border border-gray-200 rounded-2xl p-6" style={{ boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)' }}>
            <h3 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2" style={{ letterSpacing: '-0.01em' }}>
              <Lightbulb className="w-5 h-5" />
              Password Best Practices
            </h3>
            <ul className="text-sm text-gray-700 space-y-1.5">
              <li>• Use 16+ characters for high security</li>
              <li>• Include all character types</li>
              <li>• Never reuse passwords across sites</li>
              <li>• Change passwords if compromised</li>
              <li>• Use a password manager (like this!)</li>
            </ul>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-6" style={{ boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)' }}>
            <h3 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2" style={{ letterSpacing: '-0.01em' }}>
              <Target className="w-5 h-5" />
              When to Use Each Type
            </h3>
            <ul className="text-sm text-gray-700 space-y-1.5">
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