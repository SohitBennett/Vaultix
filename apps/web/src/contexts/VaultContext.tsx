'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { apiClient } from '@/lib/api-client';
import {
  prepareVaultItemForStorage,
  decryptVaultItemFull,
  prepareVaultItemUpdate,
} from '@/lib/crypto';
import type {
  VaultItem,
  VaultItemDecrypted,
  CreateVaultItemRequest,
} from '@/lib/crypto/types';

interface VaultContextType {
  items: VaultItemDecrypted[];
  isLoading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  totalItems: number;
  fetchItems: (page?: number, filters?: VaultFilters) => Promise<void>;
  createItem: (item: CreateVaultItemRequest) => Promise<void>;
  updateItem: (id: string, updates: Partial<CreateVaultItemRequest>) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  refreshItems: () => Promise<void>;
  clearError: () => void;
}

interface VaultFilters {
  category?: string;
  favorite?: boolean;
  search?: string;
}

const VaultContext = createContext<VaultContextType | undefined>(undefined);

export const VaultProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [items, setItems] = useState<VaultItemDecrypted[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [currentFilters, setCurrentFilters] = useState<VaultFilters>({});

  const fetchItems = useCallback(
    async (page: number = 1, filters: VaultFilters = {}) => {
      setIsLoading(true);
      setError(null);
      setCurrentFilters(filters);

      try {
        const response = await apiClient.getVaultItems({
          page,
          limit: 50,
          ...filters,
        });

        // Decrypt all items
        const decryptedItems: VaultItemDecrypted[] = [];
        for (const item of response.items) {
          try {
            const decrypted = await decryptVaultItemFull(item);
            decryptedItems.push(decrypted);
          } catch (err) {
            console.error(`Failed to decrypt item ${item.id}:`, err);
          }
        }

        setItems(decryptedItems);
        setCurrentPage(response.pagination.currentPage);
        setTotalPages(response.pagination.totalPages);
        setTotalItems(response.pagination.totalItems);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch items');
        console.error('Fetch items error:', err);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const createItem = useCallback(
    async (item: CreateVaultItemRequest) => {
      setIsLoading(true);
      setError(null);

      try {
        // Encrypt the item
        const encrypted = await prepareVaultItemForStorage(item);

        // Send to backend
        await apiClient.createVaultItem(encrypted);

        // Refresh the list
        await fetchItems(currentPage, currentFilters);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to create item');
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [currentPage, currentFilters, fetchItems]
  );

  const updateItem = useCallback(
    async (id: string, updates: Partial<CreateVaultItemRequest>) => {
      setIsLoading(true);
      setError(null);

      try {
        // Find the existing item
        const existingItem = items.find((item) => item.id === id);
        if (!existingItem) {
          throw new Error('Item not found');
        }

        // Merge with existing data
        const fullData: CreateVaultItemRequest = {
          name: updates.name ?? existingItem.name,
          category: updates.category ?? existingItem.category,
          favorite: updates.favorite ?? existingItem.favorite,
          username: updates.username ?? existingItem.username,
          password: updates.password ?? existingItem.password,
          url: updates.url ?? existingItem.url,
          notes: updates.notes ?? existingItem.notes,
        };

        // Encrypt the updated data
        const encrypted = await prepareVaultItemUpdate(id, fullData);

        // Send to backend
        await apiClient.updateVaultItem(id, encrypted);

        // Refresh the list
        await fetchItems(currentPage, currentFilters);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to update item');
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [items, currentPage, currentFilters, fetchItems]
  );

  const deleteItem = useCallback(
    async (id: string) => {
      setIsLoading(true);
      setError(null);

      try {
        await apiClient.deleteVaultItem(id);

        // Refresh the list
        await fetchItems(currentPage, currentFilters);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete item');
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [currentPage, currentFilters, fetchItems]
  );

  const refreshItems = useCallback(async () => {
    await fetchItems(currentPage, currentFilters);
  }, [currentPage, currentFilters, fetchItems]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return (
    <VaultContext.Provider
      value={{
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
        refreshItems,
        clearError,
      }}
    >
      {children}
    </VaultContext.Provider>
  );
};

export const useVault = () => {
  const context = useContext(VaultContext);
  if (context === undefined) {
    throw new Error('useVault must be used within a VaultProvider');
  }
  return context;
};