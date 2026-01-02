import { Router } from 'express';
import { VaultController } from '../controllers/vault.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';
import {
  createVaultItemValidation,
  updateVaultItemValidation,
  itemIdValidation,
} from '../middleware/vault-validation.middleware';

const router = Router();

// All vault routes require authentication
router.use(authenticate);

// Get vault statistics
router.get('/stats', VaultController.getStats);

// Get all vault items
router.get('/', VaultController.getItems);

// Get single vault item
router.get('/:id', itemIdValidation, validate, VaultController.getItem);

// Create vault item
router.post(
  '/',
  createVaultItemValidation,
  validate,
  VaultController.createItem
);

// Update vault item
router.put(
  '/:id',
  updateVaultItemValidation,
  validate,
  VaultController.updateItem
);

// Delete vault item
router.delete('/:id', itemIdValidation, validate, VaultController.deleteItem);

export default router;