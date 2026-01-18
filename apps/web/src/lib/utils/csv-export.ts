/**
 * CSV Export Utilities
 * Handles CSV generation and download for vault export
 */

import type { VaultItemDecrypted } from '../crypto/types';

/**
 * Convert vault items to CSV format
 * Note: This exports PLAINTEXT passwords - only use after user confirmation
 */
export function generateCSV(items: VaultItemDecrypted[]): string {
  // CSV Headers
  const headers = [
    'Name',
    'Category',
    'Username',
    'Password',
    'URL',
    'Notes',
    'Favorite',
    'Created',
    'Updated',
  ];

  // CSV Rows
  const rows = items.map((item) => [
    escapeCsvField(item.name),
    escapeCsvField(item.category || ''),
    escapeCsvField(item.username || ''),
    escapeCsvField(item.password || ''),
    escapeCsvField(item.url || ''),
    escapeCsvField(item.notes || ''),
    item.favorite ? 'Yes' : 'No',
    item.createdAt ? new Date(item.createdAt).toISOString() : '',
    item.updatedAt ? new Date(item.updatedAt).toISOString() : '',
  ]);

  // Combine headers and rows
  const csvContent = [
    headers.join(','),
    ...rows.map((row) => row.join(',')),
  ].join('\n');

  return csvContent;
}

/**
 * Escape CSV field to handle commas, quotes, and newlines
 */
function escapeCsvField(field: string): string {
  if (!field) return '';

  // If field contains comma, quote, or newline, wrap in quotes and escape quotes
  if (field.includes(',') || field.includes('"') || field.includes('\n')) {
    return `"${field.replace(/"/g, '""')}"`;
  }

  return field;
}

/**
 * Download CSV file to user's computer
 */
export function downloadCSV(csvContent: string, filename?: string): void {
  // Generate filename with timestamp
  const timestamp = new Date().toISOString().split('T')[0];
  const finalFilename = filename || `vaultix_export_${timestamp}.csv`;

  // Create blob
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

  // Create download link
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', finalFilename);
  link.style.visibility = 'hidden';

  // Trigger download
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Clean up
  URL.revokeObjectURL(url);
}

/**
 * Generate filename for CSV export
 */
export function generateExportFilename(): string {
  const timestamp = new Date().toISOString().split('T')[0];
  return `vaultix_export_${timestamp}.csv`;
}

/**
 * Validate items before export
 */
export function validateExportItems(items: VaultItemDecrypted[]): {
  valid: boolean;
  error?: string;
} {
  if (!items || items.length === 0) {
    return {
      valid: false,
      error: 'No items to export',
    };
  }

  // Check if items have required fields
  const invalidItems = items.filter((item) => !item.name);
  if (invalidItems.length > 0) {
    return {
      valid: false,
      error: `${invalidItems.length} items missing required fields`,
    };
  }

  return { valid: true };
}

/**
 * Get export statistics
 */
export function getExportStats(items: VaultItemDecrypted[]): {
  totalItems: number;
  withPasswords: number;
  withUrls: number;
  withNotes: number;
  estimatedSizeKB: number;
} {
  return {
    totalItems: items.length,
    withPasswords: items.filter((item) => item.password).length,
    withUrls: items.filter((item) => item.url).length,
    withNotes: items.filter((item) => item.notes).length,
    estimatedSizeKB: Math.ceil(JSON.stringify(items).length / 1024),
  };
}
