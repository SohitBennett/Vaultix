'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  runCryptoTests,
  runPerformanceTest,
  logTestResults,
  isWebCryptoAvailable,
} from '@/lib/crypto/test-vectors';

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
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="text-blue-600 hover:text-blue-700 mb-4 inline-block">
            ← Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">
            Encryption Test Suite
          </h1>
          <p className="mt-2 text-gray-600">
            Verify that client-side encryption is working correctly
          </p>
        </div>

        {/* Web Crypto Status */}
        <div className="card mb-6">
          <h2 className="text-xl font-semibold mb-4">Web Crypto API Status</h2>
          <div className="flex items-center">
            {isWebCryptoAvailable() ? (
              <>
                <span className="text-green-500 text-2xl mr-3">✅</span>
                <div>
                  <p className="font-semibold text-green-900">Available</p>
                  <p className="text-sm text-green-700">
                    Your browser supports Web Crypto API
                  </p>
                </div>
              </>
            ) : (
              <>
                <span className="text-red-500 text-2xl mr-3">❌</span>
                <div>
                  <p className="font-semibold text-red-900">Not Available</p>
                  <p className="text-sm text-red-700">
                    Your browser does not support Web Crypto API
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Test Buttons */}
        <div className="card mb-6">
          <h2 className="text-xl font-semibold mb-4">Run Tests</h2>
          <div className="flex gap-4">
            <button
              onClick={runTests}
              disabled={isRunning || !isWebCryptoAvailable()}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isRunning ? 'Running...' : 'Run Crypto Tests'}
            </button>
            <button
              onClick={runPerf}
              disabled={isRunning || !isWebCryptoAvailable()}
              className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isRunning ? 'Running...' : 'Run Performance Tests'}
            </button>
          </div>
        </div>

        {/* Test Results */}
        {testResults && (
          <div className="card mb-6">
            <h2 className="text-xl font-semibold mb-4">Crypto Test Results</h2>
            <div className="space-y-3">
              {testResults.results.map((result: any, index: number) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg ${
                    result.passed
                      ? 'bg-green-50 border border-green-200'
                      : 'bg-red-50 border border-red-200'
                  }`}
                >
                  <div className="flex items-start">
                    <span className="text-2xl mr-3">
                      {result.passed ? '✅' : '❌'}
                    </span>
                    <div className="flex-1">
                      <p
                        className={`font-semibold ${
                          result.passed ? 'text-green-900' : 'text-red-900'
                        }`}
                      >
                        {result.test}
                      </p>
                      {result.error && (
                        <p className="text-sm text-red-700 mt-1">
                          Error: {result.error}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 rounded-lg bg-gray-100">
              <p className="font-semibold text-gray-900">
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
          <div className="card mb-6">
            <h2 className="text-xl font-semibold mb-4">Performance Results</h2>
            <div className="space-y-3">
              <div className="flex justify-between p-3 bg-gray-50 rounded">
                <span className="font-medium">Average Encryption Time:</span>
                <span className="font-mono">
                  {perfResults.averageEncryptionTime.toFixed(2)}ms
                </span>
              </div>
              <div className="flex justify-between p-3 bg-gray-50 rounded">
                <span className="font-medium">Average Decryption Time:</span>
                <span className="font-mono">
                  {perfResults.averageDecryptionTime.toFixed(2)}ms
                </span>
              </div>
              <div className="flex justify-between p-3 bg-gray-50 rounded">
                <span className="font-medium">Average Key Derivation Time:</span>
                <span className="font-mono">
                  {perfResults.averageKeyDerivationTime.toFixed(2)}ms
                </span>
              </div>
            </div>
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-700">
                <strong>Note:</strong> Key derivation is intentionally slow (PBKDF2 with
                100,000 iterations) for security. Encryption/decryption should be fast.
              </p>
            </div>
          </div>
        )}

        {/* Information */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">What's Being Tested?</h2>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <span>
                <strong>Key Derivation:</strong> PBKDF2-SHA256 with 100,000 iterations
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <span>
                <strong>Encryption:</strong> AES-256-GCM with random IVs
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <span>
                <strong>IV Uniqueness:</strong> Each encryption uses a unique IV
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <span>
                <strong>Authentication:</strong> GCM mode provides authenticated encryption
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <span>
                <strong>Wrong Key Protection:</strong> Decryption fails with wrong key
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}