import { VaultItemDecrypted } from '@/lib/crypto/types';

/**
 * Convert decrypted vault items to CSV format
 */
export function convertVaultToCSV(items: VaultItemDecrypted[]): string {
  // CSV header
  const header = [
    'Name',
    'Username',
    'Password',
    'URL',
    'Notes',
    'Category',
    'Favorite',
    'Created At',
    'Updated At',
  ].join(',');

  // CSV rows
  const rows = items.map((item) => {
    // Escape quotes and commas in fields
    const escape = (value: string | undefined | boolean): string => {
      if (value === undefined || value === null) return '';
      const str = String(value);
      if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };

    return [
      escape(item.name),
      escape(item.username),
      escape(item.password),
      escape(item.url),
      escape(item.notes),
      escape(item.category),
      escape(item.favorite),
      escape(item.createdAt),
      escape(item.updatedAt),
    ].join(',');
  });

  return [header, ...rows].join('\n');
}

/**
 * Download CSV file
 */
export function downloadCSV(csv: string, filename: string): void {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Clean up
  URL.revokeObjectURL(url);
}

/**
 * Generate filename for export
 */
export function generateExportFilename(): string {
  const date = new Date().toISOString().split('T')[0];
  return `password_vault_${date}.csv`;
}