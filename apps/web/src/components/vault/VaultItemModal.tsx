'use client';

import { useState, useEffect } from 'react';
import type { VaultItemDecrypted, CreateVaultItemRequest } from '@/lib/crypto/types';
import { PasswordGenerator } from '@/components/generator/PasswordGenerator';

interface VaultItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: CreateVaultItemRequest) => Promise<void>;
  editItem?: VaultItemDecrypted | null;
}

const CATEGORIES = [
  'email',
  'social',
  'banking',
  'shopping',
  'work',
  'personal',
  'other',
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            {editItem ? 'Edit' : 'Add'} Password
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
            disabled={isLoading}
          >
            ×
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {/* Name */}
          <div>
            <label htmlFor="name" className="label">
              Name *
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Gmail Account"
              className="input"
              required
            />
          </div>

          {/* Username */}
          <div>
            <label htmlFor="username" className="label">
              Username / Email *
            </label>
            <input
              id="username"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              placeholder="e.g., user@example.com"
              className="input"
              required
            />
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="password" className="label">
                Password *
              </label>
              <button
                type="button"
                onClick={() => setShowGenerator(!showGenerator)}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                {showGenerator ? '✕ Close Generator' : '🎲 Generate Password'}
              </button>
            </div>

            {showGenerator && (
              <div className="mb-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
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
              placeholder="Enter password"
              className="input"
              required
            />
          </div>

          {/* URL */}
          <div>
            <label htmlFor="url" className="label">
              URL
            </label>
            <input
              id="url"
              name="url"
              type="url"
              value={formData.url}
              onChange={handleChange}
              placeholder="https://example.com"
              className="input"
            />
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className="label">
              Category
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="input"
            >
              <option value="">Select category</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Notes */}
          <div>
            <label htmlFor="notes" className="label">
              Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Add any additional notes..."
              rows={4}
              className="input"
            />
          </div>

          {/* Favorite */}
          <div className="flex items-center">
            <input
              id="favorite"
              name="favorite"
              type="checkbox"
              checked={formData.favorite}
              onChange={handleChange}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <label htmlFor="favorite" className="ml-2 text-sm text-gray-700">
              Mark as favorite ⭐
            </label>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Saving...' : editItem ? 'Update' : 'Add'} Password
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 btn-secondary disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}