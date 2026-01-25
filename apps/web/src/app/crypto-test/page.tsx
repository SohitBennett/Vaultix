'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  runCryptoTests,
  runPerformanceTest,
  logTestResults,
} from '@/lib/crypto/test-vectors';
import { isWebCryptoAvailable } from '@/lib/crypto/utils';

export default function CryptoTestPage() {
  const [testResults, setTestResults] = useState<any>(null);
  const [perfResults, setPerfResults] = useState<any>(null);
  const [isRunning, setIsRunning] = useState(false);

  const runTests = async () => {
    setIsRunning(true);
    try {
      const results = await runCryptoTests();
      logTestResults(results);
      setTestResults(results);
    } catch (error) {
      console.error('Test error:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const runPerf = async () => {
    setIsRunning(true);
    try {
      const results = await runPerformanceTest();
      console.log('Performance Results:', results);
      setPerfResults(results);
    } catch (error) {
      console.error('Performance test error:', error);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <Link href="/" className="inline-flex items-center gap-2 text-gray-900 hover:opacity-70 mb-6 transition-opacity duration-200">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-sm font-medium">Back to Home</span>
          </Link>
          <h1 className="text-3xl font-semibold text-gray-900 mb-2" style={{ letterSpacing: '-0.02em' }}>
            Encryption Test Suite
          </h1>
          <p className="text-sm text-gray-600">
            Verify that client-side encryption is working correctly
          </p>
        </div>

        {/* Web Crypto Status */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6" style={{ boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)' }}>
          <h2 className="text-lg font-semibold text-gray-900 mb-4" style={{ letterSpacing: '-0.01em' }}>
            Web Crypto API Status
          </h2>
          <div className="flex items-center">
            {isWebCryptoAvailable() ? (
              <>
                <span className="text-green-500 text-2xl mr-3">✅</span>
                <div>
                  <p className="font-semibold text-green-900 text-sm">Available</p>
                  <p className="text-xs text-green-700">
                    Your browser supports Web Crypto API
                  </p>
                </div>
              </>
            ) : (
              <>
                <span className="text-red-500 text-2xl mr-3">❌</span>
                <div>
                  <p className="font-semibold text-red-900 text-sm">Not Available</p>
                  <p className="text-xs text-red-700">
                    Your browser does not support Web Crypto API
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Test Buttons */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6" style={{ boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)' }}>
          <h2 className="text-lg font-semibold text-gray-900 mb-4" style={{ letterSpacing: '-0.01em' }}>
            Run Tests
          </h2>
          <div className="flex gap-3">
            <button
              onClick={runTests}
              disabled={isRunning || !isWebCryptoAvailable()}
              className="claude-landing-btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isRunning ? 'Running...' : 'Run Crypto Tests'}
            </button>
            <button
              onClick={runPerf}
              disabled={isRunning || !isWebCryptoAvailable()}
              className="claude-landing-btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isRunning ? 'Running...' : 'Run Performance Tests'}
            </button>
          </div>
        </div>

        {/* Test Results */}
        {testResults && (
          <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6" style={{ boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)' }}>
            <h2 className="text-lg font-semibold text-gray-900 mb-4" style={{ letterSpacing: '-0.01em' }}>
              Crypto Test Results
            </h2>
            <div className="space-y-3">
              {testResults.results.map((result: any, index: number) => (
                <div
                  key={index}
                  className={`p-4 rounded-xl border ${
                    result.passed
                      ? 'bg-green-50 border-green-200'
                      : 'bg-red-50 border-red-200'
                  }`}
                >
                  <div className="flex items-start">
                    <span className="text-2xl mr-3">
                      {result.passed ? '✅' : '❌'}
                    </span>
                    <div className="flex-1">
                      <p
                        className={`font-semibold text-sm ${
                          result.passed ? 'text-green-900' : 'text-red-900'
                        }`}
                      >
                        {result.test}
                      </p>
                      {result.error && (
                        <p className="text-xs text-red-700 mt-1">
                          Error: {result.error}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 rounded-xl bg-gray-50 border border-gray-200">
              <p className="font-semibold text-gray-900 text-sm">
                Overall Status:{' '}
                {testResults.success ? (
                  <span className="text-green-600">✅ All Tests Passed</span>
                ) : (
                  <span className="text-red-600">❌ Some Tests Failed</span>
                )}
              </p>
            </div>
          </div>
        )}

        {/* Performance Results */}
        {perfResults && (
          <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6" style={{ boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)' }}>
            <h2 className="text-lg font-semibold text-gray-900 mb-4" style={{ letterSpacing: '-0.01em' }}>
              Performance Results
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                <span className="font-medium text-sm text-gray-900">Average Encryption Time:</span>
                <span className="font-mono text-sm text-gray-900">
                  {perfResults.averageEncryptionTime.toFixed(2)}ms
                </span>
              </div>
              <div className="flex justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                <span className="font-medium text-sm text-gray-900">Average Decryption Time:</span>
                <span className="font-mono text-sm text-gray-900">
                  {perfResults.averageDecryptionTime.toFixed(2)}ms
                </span>
              </div>
              <div className="flex justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                <span className="font-medium text-sm text-gray-900">Average Key Derivation Time:</span>
                <span className="font-mono text-sm text-gray-900">
                  {perfResults.averageKeyDerivationTime.toFixed(2)}ms
                </span>
              </div>
            </div>
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-xl">
              <p className="text-xs text-blue-700">
                <strong>Note:</strong> Key derivation is intentionally slow (PBKDF2 with
                100,000 iterations) for security. Encryption/decryption should be fast.
              </p>
            </div>
          </div>
        )}

        {/* Information */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6" style={{ boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)' }}>
          <h2 className="text-lg font-semibold text-gray-900 mb-4" style={{ letterSpacing: '-0.01em' }}>
            What's Being Tested?
          </h2>
          <ul className="space-y-2.5 text-gray-700">
            <li className="flex items-start">
              <span className="text-gray-900 mr-2 font-semibold">•</span>
              <span className="text-sm">
                <strong>Key Derivation:</strong> PBKDF2-SHA256 with 100,000 iterations
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-gray-900 mr-2 font-semibold">•</span>
              <span className="text-sm">
                <strong>Encryption:</strong> AES-256-GCM with random IVs
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-gray-900 mr-2 font-semibold">•</span>
              <span className="text-sm">
                <strong>IV Uniqueness:</strong> Each encryption uses a unique IV
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-gray-900 mr-2 font-semibold">•</span>
              <span className="text-sm">
                <strong>Authentication:</strong> GCM mode provides authenticated encryption
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-gray-900 mr-2 font-semibold">•</span>
              <span className="text-sm">
                <strong>Wrong Key Protection:</strong> Decryption fails with wrong key
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}