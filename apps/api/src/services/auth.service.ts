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

export class AuthService {
  // Register new user
  static async register(data: RegisterRequest): Promise<AuthResponse> {
    const { email, password, passwordConfirm } = data;

    // Validate passwords match
    if (password !== passwordConfirm) {
      throw new ValidationError('Passwords do not match');
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ConflictError('Email already registered');
    }

    // Generate salt for PBKDF2 (this will be used client-side)
    const salt = randomBytes(32).toString('base64');

    // Hash password with bcrypt (server-side protection)
    const passwordHash = await bcrypt.hash(password, 12);

    // Create user
    const user = await User.create({
      email,
      passwordHash,
      salt,
    });

    // Generate tokens
    const accessToken = TokenService.generateAccessToken(
      user._id.toString(),
      user.email
    );
    const refreshToken = await TokenService.generateRefreshToken(
      user._id.toString()
    );

    return {
      user: {
        id: user._id.toString(),
        email: user.email,
        createdAt: user.createdAt.toISOString(),
      },
      tokens: {
        accessToken,
        expiresIn: TokenService.getAccessTokenExpiryInSeconds(),
      },
      // Refresh token will be set as httpOnly cookie by controller
    } as any; // Will add refreshToken in controller
  }

  // Login user
  static async login(data: LoginRequest): Promise<AuthResponse> {
    const { email, password } = data;

    // Find user
    const user = await User.findOne({ email }).select('+passwordHash +salt');
    if (!user) {
      throw new UnauthorizedError('Invalid email or password');
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid email or password');
    }

    // Generate tokens
    const accessToken = TokenService.generateAccessToken(
      user._id.toString(),
      user.email
    );
    const refreshToken = await TokenService.generateRefreshToken(
      user._id.toString()
    );

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
    } as any; // Will add refreshToken in controller
  }

  // Refresh access token
  static async refreshAccessToken(
    refreshToken: string
  ): Promise<{ accessToken: string; refreshToken: string; expiresIn: number }> {
    // Verify refresh token
    const payload = await TokenService.verifyRefreshToken(refreshToken);

    // Revoke old refresh token
    await TokenService.revokeRefreshToken(payload.tokenId);

    // Get user
    const user = await User.findById(payload.userId);
    if (!user) {
      throw new UnauthorizedError('User not found');
    }

    // Generate new tokens
    const newAccessToken = TokenService.generateAccessToken(
      user._id.toString(),
      user.email
    );
    const newRefreshToken = await TokenService.generateRefreshToken(
      user._id.toString()
    );

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