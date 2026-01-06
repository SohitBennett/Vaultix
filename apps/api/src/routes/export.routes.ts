import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { ExportController } from '../controllers/export.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// Rate limiter for export endpoint (prevent abuse)
const exportLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 1, // 1 export per minute
  message: {
    success: false,
    error: {
      code: 'TOO_MANY_REQUESTS',
      message: 'Export rate limit exceeded. Please wait before exporting again.',
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// All export routes require authentication
router.use(authenticate);

// Get export statistics
router.get('/stats', ExportController.getExportStats);

// Export vault as CSV
router.get('/csv', exportLimiter, ExportController.exportVaultAsCSV);

export default router;