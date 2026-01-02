'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useVault } from '@/contexts/VaultContext';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { VaultItemCard } from '@/components/vault/VaultItemCard';
import { VaultItemModal } from '@/components/vault/VaultItemModal';
import { DeleteConfirmModal } from '@/components/vault/DeleteConfirmModal';
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

  const categories = Array.from(new Set(items.map((item) => item.category).filter(Boolean)));

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
        {/* Unlock Vault Form */}
        {!isVaultUnlocked ? (
          <div className="max-w-md mx-auto">
            <div className="card">
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
          </div>
        ) : (
          <>
            {/* Header Actions */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Your Vault</h1>
                  <p className="mt-2 text-gray-600">
                    {totalItems} {totalItems === 1 ? 'password' : 'passwords'} stored
                    securely
                  </p>
                </div>
                <button
                  onClick={() => {
                    setEditingItem(null);
                    setIsAddModalOpen(true);
                  }}
                  className="btn-primary"
                >
                  + Add Password
                </button>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-4">
                <input
                  type="text"
                  placeholder="Search passwords..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input flex-1 min-w-[200px]"
                />
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="input"
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
                  className={`px-4 py-2 rounded-lg font-medium ${
                    showFavoritesOnly
                      ? 'bg-yellow-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  ⭐ Favorites
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center justify-between">
                <span>{error}</span>
                <button onClick={clearError} className="text-red-900 font-bold">
                  ×
                </button>
              </div>
            )}

            {/* Loading */}
            {isLoading && (
              <div className="text-center py-12">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
                <p className="mt-4 text-gray-600">Loading passwords...</p>
              </div>
            )}

            {/* Empty State */}
            {!isLoading && items.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔐</div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  No Passwords Yet
                </h2>
                <p className="text-gray-600 mb-6">
                  Start by adding your first password to the vault
                </p>
                <button
                  onClick={() => {
                    setEditingItem(null);
                    setIsAddModalOpen(true);
                  }}
                  className="btn-primary"
                >
                  + Add Your First Password
                </button>
              </div>
            )}

            {/* Vault Items Grid */}
            {!isLoading && items.length > 0 && (
              <>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
                  <div className="mt-8 flex items-center justify-center gap-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-4 py-2 bg-white border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Previous
                    </button>
                    <span className="px-4 py-2 text-gray-700">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 bg-white border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
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