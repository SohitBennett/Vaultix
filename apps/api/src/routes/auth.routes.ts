import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import {
  registerValidation,
  loginValidation,
  validate,
} from '../middleware/validation.middleware';
import {
  authLimiter,
  registerLimiter,
} from '../middleware/rate-limit.middleware';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// Public routes
router.post(
  '/register',
  registerLimiter,
  registerValidation,
  validate,
  AuthController.register
);

router.post(
  '/login',
  authLimiter,
  loginValidation,
  validate,
  AuthController.login
);

router.post('/refresh', AuthController.refresh);

router.post('/logout', AuthController.logout);

// Protected routes
router.get('/me', authenticate, AuthController.me);

export default router;