'use client';

import { useAuth } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import Link from 'next/link';

function VaultContent() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
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

        {/* Coming Soon Notice */}
        <div className="card text-center py-12">
          <div className="text-6xl mb-4">🚧</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Phase 1 Complete!
          </h2>
          <p className="text-gray-600 mb-6">
            Authentication is now working. Vault functionality coming in Phase 3.
          </p>
          <div className="space-y-4 max-w-md mx-auto">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-left">
              <div className="flex items-start">
                <span className="text-green-500 text-xl mr-3">✓</span>
                <div>
                  <h3 className="font-semibold text-green-900">
                    Authentication Working
                  </h3>
                  <p className="text-sm text-green-700">
                    User registration, login, and JWT-based auth are fully functional
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
              <div className="flex items-start">
                <span className="text-blue-500 text-xl mr-3">→</span>
                <div>
                  <h3 className="font-semibold text-blue-900">Next: Phase 2</h3>
                  <p className="text-sm text-blue-700">
                    Client-side encryption layer (AES-256-GCM, PBKDF2)
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
              <div className="flex items-start">
                <span className="text-blue-500 text-xl mr-3">→</span>
                <div>
                  <h3 className="font-semibold text-blue-900">Then: Phase 3</h3>
                  <p className="text-sm text-blue-700">
                    Vault CRUD operations with encrypted storage
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
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