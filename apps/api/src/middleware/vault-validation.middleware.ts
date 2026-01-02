import { body, param } from 'express-validator';

// Validation rules for creating a vault item
export const createVaultItemValidation = [
  body('name')
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ max: 255 })
    .withMessage('Name cannot exceed 255 characters')
    .trim(),

  body('category')
    .optional()
    .isLength({ max: 50 })
    .withMessage('Category cannot exceed 50 characters')
    .trim(),

  body('favorite')
    .optional()
    .isBoolean()
    .withMessage('Favorite must be a boolean'),

  body('encryptedData')
    .notEmpty()
    .withMessage('Encrypted data is required')
    .isString()
    .withMessage('Encrypted data must be a string')
    .isBase64()
    .withMessage('Encrypted data must be valid base64')
    .isLength({ max: 10485760 }) // 10MB limit
    .withMessage('Encrypted data cannot exceed 10MB'),

  body('iv')
    .notEmpty()
    .withMessage('IV is required')
    .isString()
    .withMessage('IV must be a string')
    .isBase64()
    .withMessage('IV must be valid base64')
    .isLength({ min: 16, max: 24 })
    .withMessage('IV must be 16-24 characters (12 bytes base64)'),
];

// Validation rules for updating a vault item
export const updateVaultItemValidation = [
  param('id')
    .notEmpty()
    .withMessage('Item ID is required')
    .isMongoId()
    .withMessage('Invalid item ID'),

  body('name')
    .optional()
    .isLength({ max: 255 })
    .withMessage('Name cannot exceed 255 characters')
    .trim(),

  body('category')
    .optional()
    .isLength({ max: 50 })
    .withMessage('Category cannot exceed 50 characters')
    .trim(),

  body('favorite')
    .optional()
    .isBoolean()
    .withMessage('Favorite must be a boolean'),

  body('encryptedData')
    .optional()
    .isString()
    .withMessage('Encrypted data must be a string')
    .isBase64()
    .withMessage('Encrypted data must be valid base64')
    .isLength({ max: 10485760 })
    .withMessage('Encrypted data cannot exceed 10MB'),

  body('iv')
    .optional()
    .isString()
    .withMessage('IV must be a string')
    .isBase64()
    .withMessage('IV must be valid base64')
    .isLength({ min: 16, max: 24 })
    .withMessage('IV must be 16-24 characters'),
];

// Validation for item ID parameter
export const itemIdValidation = [
  param('id')
    .notEmpty()
    .withMessage('Item ID is required')
    .isMongoId()
    .withMessage('Invalid item ID'),
];