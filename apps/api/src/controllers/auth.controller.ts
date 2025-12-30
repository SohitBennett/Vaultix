import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { RegisterRequest, LoginRequest } from '@password-manager/shared';
import { UnauthorizedError } from '../utils/errors';
import { isProd } from '../config/environment';

export class AuthController {
  // Register new user
  static async register(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const data: RegisterRequest = req.body;
      const result = await AuthService.register(data);

      // Set refresh token as httpOnly cookie
      res.cookie('refreshToken', (result as any).refreshToken, {
        httpOnly: true,
        secure: isProd, // HTTPS only in production
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        path: '/api/v1/auth',
      });

      res.status(201).json({
        success: true,
        data: {
          user: result.user,
          tokens: result.tokens,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  // Login user
  static async login(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const data: LoginRequest = req.body;
      const result = await AuthService.login(data);

      // Set refresh token as httpOnly cookie
      res.cookie('refreshToken', (result as any).refreshToken, {
        httpOnly: true,
        secure: isProd,
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: '/api/v1/auth',
      });

      res.status(200).json({
        success: true,
        data: {
          user: result.user,
          tokens: result.tokens,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  // Refresh access token
  static async refresh(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const refreshToken = req.cookies.refreshToken;

      if (!refreshToken) {
        throw new UnauthorizedError('No refresh token provided');
      }

      const result = await AuthService.refreshAccessToken(refreshToken);

      // Set new refresh token
      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: isProd,
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: '/api/v1/auth',
      });

      res.status(200).json({
        success: true,
        data: {
          tokens: {
            accessToken: result.accessToken,
            expiresIn: result.expiresIn,
          },
        },
      });
    } catch (error) {
      next(error);
    }
  }

  // Logout user
  static async logout(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const refreshToken = req.cookies.refreshToken;

      if (refreshToken) {
        await AuthService.logout(refreshToken);
      }

      // Clear refresh token cookie
      res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: isProd,
        sameSite: 'strict',
        path: '/api/v1/auth',
      });

      res.status(200).json({
        success: true,
        data: {
          message: 'Logged out successfully',
        },
      });
    } catch (error) {
      next(error);
    }
  }

  // Get current user
  static async me(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.user) {
        throw new UnauthorizedError();
      }

      const user = await AuthService.getUserById(req.user.userId);

      if (!user) {
        throw new UnauthorizedError('User not found');
      }

      res.status(200).json({
        success: true,
        data: {
          user: {
            id: user._id.toString(),
            email: user.email,
            createdAt: user.createdAt.toISOString(),
          },
        },
      });
    } catch (error) {
      next(error);
    }
  }
}