import bcrypt from 'bcryptjs';
import { randomBytes } from 'crypto';
import { User, IUser } from '../models/user.model';
import { TokenService } from './token.service';
import {
  RegisterRequest,
  LoginRequest,
  AuthResponse,
} from '@password-manager/shared';
import {
  ConflictError,
  UnauthorizedError,
  ValidationError,
} from '../utils/errors';
import { logger } from '../utils/logger';

export class AuthService {
  // Register new user
  // UPDATED register method (around line 25)
  static async register(data: RegisterRequest): Promise<AuthResponse & { refreshToken: string }> {
    const { email, password, passwordConfirm } = data;

    logger.info('Registration attempt', { email });

    // Validate passwords match
    if (password !== passwordConfirm) {
      logger.warn('Registration failed: passwords do not match', { email });
      throw new ValidationError('Passwords do not match');
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      logger.warn('Registration failed: email already exists', { email });
      throw new ConflictError('Email already registered');
    }

    // Generate salt for PBKDF2 (this will be used client-side)
    const salt = randomBytes(32).toString('base64');
    logger.debug('Generated salt for user', { email, saltLength: salt.length });

    // Hash password with bcrypt (server-side protection)
    const passwordHash = await bcrypt.hash(password, 12);
    logger.debug('Password hashed with bcrypt', { email });

    // Create user
    const user = await User.create({
      email,
      passwordHash,
      salt,
    });
    logger.success('User registered successfully', { userId: user._id.toString(), email });

    // Generate tokens
    const accessToken = TokenService.generateAccessToken(
      user._id.toString(),
      user.email
    );
    const refreshToken = await TokenService.generateRefreshToken(
      user._id.toString()
    );

    logger.debug('Tokens generated for new user', { userId: user._id.toString() });

    return {
      user: {
        id: user._id.toString(),
        email: user.email,
        createdAt: user.createdAt.toISOString(),
        salt, // Include salt for client-side key derivation
      },
      tokens: {
        accessToken,
        expiresIn: TokenService.getAccessTokenExpiryInSeconds(),
      },
      refreshToken, // ✅ Return the refresh token
    };
  }

  // UPDATED login method (around line 68)
  static async login(data: LoginRequest): Promise<AuthResponse & { refreshToken: string }> {
    const { email, password } = data;

    logger.info('Login attempt', { email });

    // Find user
    const user = await User.findOne({ email }).select('+passwordHash +salt');
    if (!user) {
      logger.warn('Login failed: user not found', { email });
      throw new UnauthorizedError('Invalid email or password');
    }

    logger.debug('User found, verifying password', { userId: user._id.toString(), email });

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      logger.warn('Login failed: invalid password', { userId: user._id.toString(), email });
      throw new UnauthorizedError('Invalid email or password');
    }

    logger.success('Password verified successfully', { userId: user._id.toString(), email });

    // Generate tokens
    const accessToken = TokenService.generateAccessToken(
      user._id.toString(),
      user.email
    );
    const refreshToken = await TokenService.generateRefreshToken(
      user._id.toString()
    );

    logger.debug('Tokens generated for login', { userId: user._id.toString() });

    return {
      user: {
        id: user._id.toString(),
        email: user.email,
        createdAt: user.createdAt.toISOString(),
        salt: user.salt, // Return salt for client-side key derivation
      },
      tokens: {
        accessToken,
        expiresIn: TokenService.getAccessTokenExpiryInSeconds(),
      },
      refreshToken, // ✅ Return the refresh token
    };
  }

  // Refresh access token
  static async refreshAccessToken(
    refreshToken: string
  ): Promise<{ accessToken: string; refreshToken: string; expiresIn: number }> {
    // Verify refresh token
    // const payload = await TokenService.verifyRefreshToken(refreshToken);

    // // Revoke old refresh token
    // await TokenService.revokeRefreshToken(payload.tokenId);

    // // Get user
    // const user = await User.findById(payload.userId);
    // if (!user) {
    //   throw new UnauthorizedError('User not found');
    // }

    // // Generate new tokens
    // const newAccessToken = TokenService.generateAccessToken(
    //   user._id.toString(),
    //   user.email
    // );
    // const newRefreshToken = await TokenService.generateRefreshToken(
    //   user._id.toString()
    // );

    // return {
    //   accessToken: newAccessToken,
    //   refreshToken: newRefreshToken,
    //   expiresIn: TokenService.getAccessTokenExpiryInSeconds(),
    // };

    const payload = await TokenService.verifyRefreshToken(refreshToken);

    const user = await User.findById(payload.userId);
    if (!user) {
      throw new UnauthorizedError('User not found');
    }

    // Generate new tokens FIRST
    const newAccessToken = TokenService.generateAccessToken(
      user._id.toString(),
      user.email
    );
    const newRefreshToken = await TokenService.generateRefreshToken(
      user._id.toString()
    );

    // THEN revoke old one
    await TokenService.revokeRefreshToken(payload.tokenId);

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      expiresIn: TokenService.getAccessTokenExpiryInSeconds(),
    };
  }

  // Logout user
  static async logout(refreshToken: string): Promise<void> {
    try {
      const payload = await TokenService.verifyRefreshToken(refreshToken);
      await TokenService.revokeRefreshToken(payload.tokenId);
    } catch (error) {
      // Even if token is invalid, consider logout successful
      // This prevents errors when tokens are already expired
    }
  }

  // Get user by ID
  static async getUserById(userId: string): Promise<IUser | null> {
    return User.findById(userId);
  }
}