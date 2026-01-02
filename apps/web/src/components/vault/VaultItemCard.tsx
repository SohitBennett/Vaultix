'use client';

import { useState } from 'react';
import type { VaultItemDecrypted } from '@/lib/crypto/types';

interface VaultItemCardProps {
  item: VaultItemDecrypted;
  onEdit: (item: VaultItemDecrypted) => void;
  onDelete: (id: string) => void;
}

export function VaultItemCard({ item, onEdit, onDelete }: VaultItemCardProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState<'username' | 'password' | null>(null);

  const copyToClipboard = async (text: string, type: 'username' | 'password') => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const getCategoryColor = (category?: string) => {
    if (!category) return 'bg-gray-100 text-gray-800';
    
    const colors: Record<string, string> = {
      email: 'bg-blue-100 text-blue-800',
      social: 'bg-purple-100 text-purple-800',
      banking: 'bg-green-100 text-green-800',
      shopping: 'bg-orange-100 text-orange-800',
      work: 'bg-indigo-100 text-indigo-800',
      personal: 'bg-pink-100 text-pink-800',
    };
    
    return colors[category.toLowerCase()] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="card hover:shadow-lg transition-shadow duration-200">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
            {item.favorite && <span className="text-yellow-500">⭐</span>}
          </div>
          {item.category && (
            <span
              className={`inline-block px-2 py-1 rounded text-xs font-medium ${getCategoryColor(
                item.category
              )}`}
            >
              {item.category}
            </span>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(item)}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            title="Edit"
          >
            ✏️
          </button>
          <button
            onClick={() => onDelete(item.id!)}
            className="text-red-600 hover:text-red-700 text-sm font-medium"
            title="Delete"
          >
            🗑️
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-3">
        {/* Username */}
        <div>
          <label className="text-xs font-medium text-gray-500 uppercase">
            Username
          </label>
          <div className="flex items-center gap-2 mt-1">
            <input
              type="text"
              value={item.username}
              readOnly
              className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded text-sm"
            />
            <button
              onClick={() => copyToClipboard(item.username, 'username')}
              className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm font-medium"
              title="Copy username"
            >
              {copied === 'username' ? '✓' : '📋'}
            </button>
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="text-xs font-medium text-gray-500 uppercase">
            Password
          </label>
          <div className="flex items-center gap-2 mt-1">
            <input
              type={showPassword ? 'text' : 'password'}
              value={item.password}
              readOnly
              className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded text-sm font-mono"
            />
            <button
              onClick={() => setShowPassword(!showPassword)}
              className="px-3 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 text-sm font-medium"
              title={showPassword ? 'Hide' : 'Show'}
            >
              {showPassword ? '👁️' : '👁️‍🗨️'}
            </button>
            <button
              onClick={() => copyToClipboard(item.password, 'password')}
              className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm font-medium"
              title="Copy password"
            >
              {copied === 'password' ? '✓' : '📋'}
            </button>
          </div>
        </div>

        {/* URL */}
        {item.url && (
          <div>
            <label className="text-xs font-medium text-gray-500 uppercase">
              URL
            </label>
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block mt-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded text-sm text-blue-600 hover:underline truncate"
            >
              {item.url}
            </a>
          </div>
        )}

        {/* Notes */}
        {item.notes && (
          <div>
            <label className="text-xs font-medium text-gray-500 uppercase">
              Notes
            </label>
            <p className="mt-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded text-sm text-gray-700 whitespace-pre-wrap">
              {item.notes}
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-4 pt-4 border-t border-gray-200 text-xs text-gray-500">
        {item.createdAt && (
          <span>Created {new Date(item.createdAt).toLocaleDateString()}</span>
        )}
      </div>
    </div>
  );
}