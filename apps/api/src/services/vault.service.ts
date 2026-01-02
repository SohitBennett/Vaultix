import { VaultItem, IVaultItem } from '../models/vault-item.model';
import { NotFoundError, ValidationError } from '../utils/errors';
import mongoose from 'mongoose';

interface CreateVaultItemData {
  name: string;
  category?: string;
  favorite?: boolean;
  encryptedData: string;
  iv: string;
}

interface UpdateVaultItemData {
  name?: string;
  category?: string;
  favorite?: boolean;
  encryptedData?: string;
  iv?: string;
}

interface VaultListOptions {
  page?: number;
  limit?: number;
  category?: string;
  favorite?: boolean;
  search?: string;
  sortBy?: 'name' | 'createdAt' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
}

export class VaultService {
  /**
   * Create a new vault item
   */
  static async createItem(
    userId: string,
    data: CreateVaultItemData
  ): Promise<IVaultItem> {
    // Validate encrypted data format
    if (!data.encryptedData || !data.iv) {
      throw new ValidationError('Encrypted data and IV are required');
    }

    // Validate base64 format
    if (!this.isValidBase64(data.encryptedData) || !this.isValidBase64(data.iv)) {
      throw new ValidationError('Invalid encrypted data format');
    }

    const vaultItem = await VaultItem.create({
      userId: new mongoose.Types.ObjectId(userId),
      name: data.name,
      category: data.category,
      favorite: data.favorite || false,
      encryptedData: data.encryptedData,
      iv: data.iv,
    });

    return vaultItem;
  }

  /**
   * Get all vault items for a user with pagination and filters
   */
  static async getItems(
    userId: string,
    options: VaultListOptions = {}
  ): Promise<{
    items: IVaultItem[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      itemsPerPage: number;
    };
  }> {
    const {
      page = 1,
      limit = 50,
      category,
      favorite,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = options;

    // Build query
    const query: any = { userId: new mongoose.Types.ObjectId(userId) };

    if (category) {
      query.category = category;
    }

    if (favorite !== undefined) {
      query.favorite = favorite;
    }

    if (search) {
      query.$text = { $search: search };
    }

    // Build sort
    const sort: any = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Get total count
    const totalItems = await VaultItem.countDocuments(query);

    // Calculate pagination
    const skip = (page - 1) * limit;
    const totalPages = Math.ceil(totalItems / limit);

    // Get items
    const items = await VaultItem.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit);

    return {
      items,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems,
        itemsPerPage: limit,
      },
    };
  }

  /**
   * Get a single vault item by ID
   */
  static async getItemById(
    userId: string,
    itemId: string
  ): Promise<IVaultItem> {
    if (!mongoose.Types.ObjectId.isValid(itemId)) {
      throw new NotFoundError('Vault item not found');
    }

    const item = await VaultItem.findOne({
      _id: new mongoose.Types.ObjectId(itemId),
      userId: new mongoose.Types.ObjectId(userId),
    });

    if (!item) {
      throw new NotFoundError('Vault item not found');
    }

    return item;
  }

  /**
   * Update a vault item
   */
  static async updateItem(
    userId: string,
    itemId: string,
    updates: UpdateVaultItemData
  ): Promise<IVaultItem> {
    // Get existing item
    const item = await this.getItemById(userId, itemId);

    // Validate encrypted data if provided
    if (updates.encryptedData || updates.iv) {
      if (!updates.encryptedData || !updates.iv) {
        throw new ValidationError(
          'Both encryptedData and IV must be provided together'
        );
      }

      if (
        !this.isValidBase64(updates.encryptedData) ||
        !this.isValidBase64(updates.iv)
      ) {
        throw new ValidationError('Invalid encrypted data format');
      }
    }

    // Update fields
    if (updates.name !== undefined) item.name = updates.name;
    if (updates.category !== undefined) item.category = updates.category;
    if (updates.favorite !== undefined) item.favorite = updates.favorite;
    if (updates.encryptedData !== undefined)
      item.encryptedData = updates.encryptedData;
    if (updates.iv !== undefined) item.iv = updates.iv;

    await item.save();

    return item;
  }

  /**
   * Delete a vault item
   */
  static async deleteItem(userId: string, itemId: string): Promise<void> {
    if (!mongoose.Types.ObjectId.isValid(itemId)) {
      throw new NotFoundError('Vault item not found');
    }

    const result = await VaultItem.deleteOne({
      _id: new mongoose.Types.ObjectId(itemId),
      userId: new mongoose.Types.ObjectId(userId),
    });

    if (result.deletedCount === 0) {
      throw new NotFoundError('Vault item not found');
    }
  }

  /**
   * Get vault statistics for a user
   */
  static async getStats(userId: string): Promise<{
    totalItems: number;
    favoriteItems: number;
    categoryCounts: { category: string; count: number }[];
  }> {
    const userObjectId = new mongoose.Types.ObjectId(userId);

    const [totalItems, favoriteItems, categoryCounts] = await Promise.all([
      VaultItem.countDocuments({ userId: userObjectId }),
      VaultItem.countDocuments({ userId: userObjectId, favorite: true }),
      VaultItem.aggregate([
        { $match: { userId: userObjectId } },
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $project: { category: '$_id', count: 1, _id: 0 } },
        { $sort: { count: -1 } },
      ]),
    ]);

    return {
      totalItems,
      favoriteItems,
      categoryCounts,
    };
  }

  /**
   * Validate base64 string
   */
  private static isValidBase64(str: string): boolean {
    try {
      return Buffer.from(str, 'base64').toString('base64') === str;
    } catch {
      return false;
    }
  }
}