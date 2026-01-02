import { Request, Response, NextFunction } from 'express';
import { VaultService } from '../services/vault.service';

export class VaultController {
  /**
   * Create a new vault item
   */
  static async createItem(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'User not authenticated',
          },
        });
        return;
      }

      const item = await VaultService.createItem(req.user.userId, req.body);

      res.status(201).json({
        success: true,
        data: { item },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get all vault items for the current user
   */
  static async getItems(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'User not authenticated',
          },
        });
        return;
      }

      const options = {
        page: req.query.page ? parseInt(req.query.page as string, 10) : 1,
        limit: req.query.limit ? parseInt(req.query.limit as string, 10) : 50,
        category: req.query.category as string | undefined,
        favorite:
          req.query.favorite === 'true'
            ? true
            : req.query.favorite === 'false'
            ? false
            : undefined,
        search: req.query.search as string | undefined,
        sortBy: (req.query.sortBy as 'name' | 'createdAt' | 'updatedAt') || 'createdAt',
        sortOrder: (req.query.sortOrder as 'asc' | 'desc') || 'desc',
      };

      const result = await VaultService.getItems(req.user.userId, options);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get a single vault item by ID
   */
  static async getItem(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'User not authenticated',
          },
        });
        return;
      }

      const item = await VaultService.getItemById(
        req.user.userId,
        req.params.id
      );

      res.status(200).json({
        success: true,
        data: { item },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update a vault item
   */
  static async updateItem(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'User not authenticated',
          },
        });
        return;
      }

      const item = await VaultService.updateItem(
        req.user.userId,
        req.params.id,
        req.body
      );

      res.status(200).json({
        success: true,
        data: { item },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete a vault item
   */
  static async deleteItem(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'User not authenticated',
          },
        });
        return;
      }

      await VaultService.deleteItem(req.user.userId, req.params.id);

      res.status(200).json({
        success: true,
        data: {
          message: 'Vault item deleted successfully',
          deletedId: req.params.id,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get vault statistics
   */
  static async getStats(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'User not authenticated',
          },
        });
        return;
      }

      const stats = await VaultService.getStats(req.user.userId);

      res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error) {
      next(error);
    }
  }
}