'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useVault } from '@/contexts/VaultContext';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { VaultItemCard } from '@/components/vault/VaultItemCard';
import { VaultItemModal } from '@/components/vault/VaultItemModal';
import { DeleteConfirmModal } from '@/components/vault/DeleteConfirmModal';
import { ExportConfirmModal } from '@/components/vault/ExportConfirmModal';
import Link from 'next/link';
import type { VaultItemDecrypted, CreateVaultItemRequest } from '@/lib/crypto/types';

function VaultContent() {
  const { user, logout, isVaultUnlocked, unlockVault } = useAuth();
  const {
    items,
    isLoading,
    error,
    currentPage,
    totalPages,
    totalItems,
    fetchItems,
    createItem,
    updateItem,
    deleteItem,
    clearError,
    exportToCSV,
  } = useVault();

  const [unlockPassword, setUnlockPassword] = useState('');
  const [unlockError, setUnlockError] = useState('');
  const [isUnlocking, setIsUnlocking] = useState(false);

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<VaultItemDecrypted | null>(null);
  const [deletingItem, setDeletingItem] = useState<{ id: string; name: string } | null>(
    null
  );
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  // Fetch items when vault is unlocked
  useEffect(() => {
    if (isVaultUnlocked) {
      fetchItems(1, {
        search: searchTerm || undefined,
        category: categoryFilter || undefined,
        favorite: showFavoritesOnly || undefined,
      });
    }
  }, [isVaultUnlocked, searchTerm, categoryFilter, showFavoritesOnly]);

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

  const handleSaveItem = async (item: CreateVaultItemRequest) => {
    if (editingItem) {
      await updateItem(editingItem.id!, item);
    } else {
      await createItem(item);
    }
  };

  const handleDelete = async () => {
    if (deletingItem) {
      await deleteItem(deletingItem.id);
    }
  };

  const handlePageChange = (page: number) => {
    fetchItems(page, {
      search: searchTerm || undefined,
      category: categoryFilter || undefined,
      favorite: showFavoritesOnly || undefined,
    });
  };

  const handleExport = async () => {
    try {
      await exportToCSV();
      setIsExportModalOpen(false);
    } catch (error) {
      console.error('Export error:', error);
      // Error is already set in context
    }
  };

  const categories = Array.from(new Set(items.map((item) => item.category).filter(Boolean)));

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <svg className="w-6 h-6 text-gray-900" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <span className="text-lg font-semibold text-gray-900" style={{ letterSpacing: '-0.01em' }}>
              Vaultix
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">{user?.email}</span>
            {isVaultUnlocked && (
              <span className="text-xs bg-green-50 text-green-700 px-2.5 py-1 rounded-md border border-green-200 font-medium">
                🔓 Unlocked
              </span>
            )}
            <button onClick={handleLogout} className="claude-landing-btn-secondary">
              Logout
            </button>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Unlock Vault Form */}
        {!isVaultUnlocked ? (
          <div className="max-w-md mx-auto" style={{ animation: 'fadeIn 0.4s ease-out' }}>
            <div className="mb-8">
              <h1 className="text-2xl font-semibold text-gray-900 mb-2" style={{ letterSpacing: '-0.02em' }}>
                Unlock Your Vault
              </h1>
              <p className="text-sm text-gray-600">
                Enter your master password to access your encrypted passwords
              </p>
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl p-8" style={{ boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)' }}>
              <form onSubmit={handleUnlock} className="space-y-4">
                {unlockError && (
                  <div className="claude-error">
                    <svg className="claude-error-icon" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <span>{unlockError}</span>
                  </div>
                )}
                <div className="claude-input-group">
                  <label htmlFor="unlock-password" className="claude-label">
                    Master Password
                  </label>
                  <input
                    id="unlock-password"
                    type="password"
                    value={unlockPassword}
                    onChange={(e) => setUnlockPassword(e.target.value)}
                    className="claude-input"
                    placeholder="Enter your master password"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={isUnlocking}
                  className="claude-submit-btn"
                >
                  {isUnlocking ? (
                    <>
                      <div className="claude-spinner"></div>
                      <span>Unlocking...</span>
                    </>
                  ) : (
                    'Unlock Vault'
                  )}
                </button>
              </form>
            </div>
            <div className="flex items-center justify-center gap-2 mt-8 text-xs text-gray-500">
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <p className="text-center">
                Your vault is encrypted with AES-256-GCM encryption
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Header Actions */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-semibold text-gray-900 mb-2" style={{ letterSpacing: '-0.02em' }}>
                    Your Vault
                  </h1>
                  <p className="text-sm text-gray-600">
                    {totalItems} {totalItems === 1 ? 'password' : 'passwords'} stored securely
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setIsExportModalOpen(true)}
                    disabled={items.length === 0}
                    className="claude-landing-btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    📥 Export CSV
                  </button>
                  <button
                    onClick={() => {
                      setEditingItem(null);
                      setIsAddModalOpen(true);
                    }}
                    className="claude-landing-btn-primary"
                  >
                    + Add Password
                  </button>
                </div>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-3">
                <input
                  type="text"
                  placeholder="Search passwords..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="claude-input flex-1 min-w-[200px]"
                />
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="claude-input w-auto"
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                  className={`px-4 py-2.5 rounded-lg font-medium transition-all duration-150 text-sm ${
                    showFavoritesOnly
                      ? 'bg-gray-900 text-white hover:bg-gray-800'
                      : 'bg-white text-gray-900 border border-gray-300 hover:bg-gray-50 hover:border-gray-400'
                  }`}
                >
                  ⭐ Favorites
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 claude-error">
                <svg className="claude-error-icon" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span className="flex-1">{error}</span>
                <button onClick={clearError} className="text-red-900 font-bold hover:text-red-700">
                  ×
                </button>
              </div>
            )}

            {/* Loading */}
            {isLoading && (
              <div className="text-center py-16">
                <div className="inline-block h-8 w-8 border-2 border-gray-900/30 border-t-gray-900 rounded-full" style={{ animation: 'spin 0.6s linear infinite' }}></div>
                <p className="mt-4 text-sm text-gray-600">Loading passwords...</p>
              </div>
            )}

            {/* Empty State */}
            {!isLoading && items.length === 0 && (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🔐</div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-2" style={{ letterSpacing: '-0.02em' }}>
                  No Passwords Yet
                </h2>
                <p className="text-sm text-gray-600 mb-6">
                  Start by adding your first password to the vault
                </p>
                <button
                  onClick={() => {
                    setEditingItem(null);
                    setIsAddModalOpen(true);
                  }}
                  className="claude-landing-btn-primary"
                >
                  + Add Your First Password
                </button>
              </div>
            )}

            {/* Vault Items Grid */}
            {!isLoading && items.length > 0 && (
              <>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {items.map((item) => (
                    <VaultItemCard
                      key={item.id}
                      item={item}
                      onEdit={(item) => {
                        setEditingItem(item);
                        setIsAddModalOpen(true);
                      }}
                      onDelete={(id) => {
                        const item = items.find((i) => i.id === id);
                        if (item) {
                          setDeletingItem({ id, name: item.name });
                        }
                      }}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-8 flex items-center justify-center gap-3">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-4 py-2 bg-white border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 hover:border-gray-400 transition-all duration-150 text-sm font-medium text-gray-900"
                    >
                      Previous
                    </button>
                    <span className="px-4 py-2 text-sm text-gray-700">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 bg-white border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 hover:border-gray-400 transition-all duration-150 text-sm font-medium text-gray-900"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </main>

      {/* Modals */}
      <VaultItemModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingItem(null);
        }}
        onSave={handleSaveItem}
        editItem={editingItem}
      />

      <DeleteConfirmModal
        isOpen={!!deletingItem}
        onClose={() => setDeletingItem(null)}
        onConfirm={handleDelete}
        itemName={deletingItem?.name || ''}
      />

      <ExportConfirmModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        onConfirm={handleExport}
        itemCount={items.length}
      />
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