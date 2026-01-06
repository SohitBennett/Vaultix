'use client';

import { useState } from 'react';

interface ExportConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  itemCount: number;
}

export function ExportConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  itemCount,
}: ExportConfirmModalProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState('');

  const handleConfirm = async () => {
    setIsExporting(true);
    setError('');
    
    try {
      await onConfirm();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Export failed');
    } finally {
      setIsExporting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="text-center">
          <div className="text-5xl mb-4">📦</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Export Password Vault
          </h2>
          <p className="text-gray-600 mb-4">
            You're about to export <span className="font-semibold">{itemCount}</span>{' '}
            {itemCount === 1 ? 'password' : 'passwords'} to a CSV file.
          </p>

          {/* Warning Box */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 text-left">
            <div className="flex items-start">
              <span className="text-2xl mr-3">⚠️</span>
              <div>
                <h3 className="font-semibold text-yellow-900 mb-2">
                  Security Warning
                </h3>
                <ul className="text-sm text-yellow-800 space-y-1">
                  <li>• Exported data will contain <strong>plaintext passwords</strong></li>
                  <li>• Store the CSV file in a secure location</li>
                  <li>• Delete the file after use</li>
                  <li>• Never email or share this file</li>
                </ul>
              </div>
            </div>
          </div>

          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={handleConfirm}
              disabled={isExporting}
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isExporting ? 'Exporting...' : 'Export to CSV'}
            </button>
            <button
              onClick={onClose}
              disabled={isExporting}
              className="flex-1 btn-secondary disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}