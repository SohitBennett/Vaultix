'use client';

import { useState, useEffect } from 'react';
import { Dices, X, Star, Sparkles } from 'lucide-react';
import type { VaultItemDecrypted, CreateVaultItemRequest } from '@/lib/crypto/types';
import { PasswordGenerator } from '@/components/generator/PasswordGenerator';

interface VaultItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: CreateVaultItemRequest) => Promise<void>;
  editItem?: VaultItemDecrypted | null;
}

const CATEGORIES = [
  { value: 'email', label: 'Email', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  { value: 'social', label: 'Social Media', color: 'bg-purple-50 text-purple-700 border-purple-200' },
  { value: 'banking', label: 'Banking', color: 'bg-green-50 text-green-700 border-green-200' },
  { value: 'shopping', label: 'Shopping', color: 'bg-orange-50 text-orange-700 border-orange-200' },
  { value: 'work', label: 'Work', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  { value: 'personal', label: 'Personal', color: 'bg-pink-50 text-pink-700 border-pink-200' },
  { value: 'other', label: 'Other', color: 'bg-gray-50 text-gray-700 border-gray-200' },
];

export function VaultItemModal({
  isOpen,
  onClose,
  onSave,
  editItem,
}: VaultItemModalProps) {
  const [formData, setFormData] = useState<CreateVaultItemRequest>({
    name: '',
    username: '',
    password: '',
    url: '',
    notes: '',
    category: '',
    favorite: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showGenerator, setShowGenerator] = useState(false);

  useEffect(() => {
    if (editItem) {
      setFormData({
        name: editItem.name,
        username: editItem.username,
        password: editItem.password,
        url: editItem.url || '',
        notes: editItem.notes || '',
        category: editItem.category || '',
        favorite: editItem.favorite || false,
      });
    } else {
      setFormData({
        name: '',
        username: '',
        password: '',
        url: '',
        notes: '',
        category: '',
        favorite: false,
      });
    }
    setError('');
    setShowGenerator(false);
  }, [editItem, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await onSave(formData);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save item');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handlePasswordGenerated = (password: string) => {
    setFormData((prev) => ({ ...prev, password }));
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div 
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-xl"
        style={{ letterSpacing: '-0.01em' }}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900" style={{ letterSpacing: '-0.02em' }}>
              {editItem ? 'Edit Password' : 'Add New Password'}
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              {editItem ? 'Update your password details' : 'Store a new password securely'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            disabled={isLoading}
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[calc(90vh-80px)]">
          <div className="p-6 space-y-5">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-start gap-2">
                <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-900 mb-2">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., Gmail Account, GitHub, Netflix..."
                className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-150 hover:border-gray-400"
                required
              />
            </div>

            {/* Username */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-900 mb-2">
                Username / Email <span className="text-red-500">*</span>
              </label>
              <input
                id="username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleChange}
                placeholder="e.g., user@example.com"
                className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-150 hover:border-gray-400"
                required
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="password" className="block text-sm font-medium text-gray-900">
                  Password <span className="text-red-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => setShowGenerator(!showGenerator)}
                  className="text-sm text-gray-700 hover:text-gray-900 font-medium flex items-center gap-1.5 px-2.5 py-1 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  {showGenerator ? (
                    <>
                      <X className="w-3.5 h-3.5" />
                      Close
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      Generate
                    </>
                  )}
                </button>
              </div>

              {showGenerator && (
                <div className="mb-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <PasswordGenerator
                    onPasswordGenerated={handlePasswordGenerated}
                    showCopyButton={false}
                    compact={true}
                  />
                </div>
              )}

              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter a strong password"
                className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 font-mono focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-150 hover:border-gray-400"
                required
              />
            </div>

            {/* URL */}
            <div>
              <label htmlFor="url" className="block text-sm font-medium text-gray-900 mb-2">
                Website URL
              </label>
              <input
                id="url"
                name="url"
                type="url"
                value={formData.url}
                onChange={handleChange}
                placeholder="https://example.com"
                className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-150 hover:border-gray-400"
              />
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-900 mb-2">
                Category
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-150 hover:border-gray-400 cursor-pointer"
              >
                <option value="">Select a category</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Notes */}
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-900 mb-2">
                Notes
              </label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Add any additional notes or information..."
                rows={3}
                className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-150 hover:border-gray-400 resize-none"
              />
            </div>

            {/* Favorite */}
            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <input
                id="favorite"
                name="favorite"
                type="checkbox"
                checked={formData.favorite}
                onChange={handleChange}
                className="w-4 h-4 text-gray-900 border-gray-300 rounded focus:ring-gray-900 focus:ring-2 cursor-pointer"
              />
              <label htmlFor="favorite" className="text-sm text-gray-700 flex items-center gap-1.5 cursor-pointer">
                Mark as favorite
                <Star className="w-3.5 h-3.5 text-yellow-500" />
              </label>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-900 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>{editItem ? 'Update Password' : 'Add Password'}</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}