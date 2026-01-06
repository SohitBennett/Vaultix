import { Request, Response, NextFunction } from 'express';
import { VaultService } from '../services/vault.service';
import { Parser } from 'json2csv';

export class ExportController {
  /**
   * Export vault as CSV
   * Note: Data is encrypted - client must decrypt before presenting to user
   */
  static async exportVaultAsCSV(
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

      // Get all vault items (no pagination for export)
      const result = await VaultService.getItems(req.user.userId, {
        page: 1,
        limit: 10000, // Get all items
      });

      // Prepare CSV data
      const csvData = result.items.map((item) => ({
        id: item.id,
        name: item.name,
        category: item.category || '',
        favorite: item.favorite ? 'true' : 'false',
        encryptedData: item.encryptedData,
        iv: item.iv,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      }));

      // Generate CSV
      const fields = [
        'id',
        'name',
        'category',
        'favorite',
        'encryptedData',
        'iv',
        'createdAt',
        'updatedAt',
      ];

      const json2csvParser = new Parser({ fields });
      const csv = json2csvParser.parse(csvData);

      // Set headers for file download
      const filename = `vault_export_${new Date().toISOString().split('T')[0]}.csv`;
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

      res.status(200).send(csv);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get export statistics
   */
  static async getExportStats(
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
        data: {
          ...stats,
          exportReady: true,
          estimatedSize: Math.ceil(stats.totalItems * 0.5), // Rough estimate in KB
        },
      });
    } catch (error) {
      next(error);
    }
  }
}