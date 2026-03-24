import jwt from 'jsonwebtoken';
import { randomBytes } from 'crypto';
import { config } from '../config/environment';
import { RefreshToken } from '../models/refresh-token.model';
import { JWTPayload, RefreshTokenPayload } from '@password-manager/shared';
import { UnauthorizedError } from '../utils/errors';

export class TokenService {
  // Generate access token
  static generateAccessToken(userId: string, email: string): string {
    const payload: JWTPayload = {
      userId,
      email,
    };

    return jwt.sign(payload, config.jwtAccessSecret, {
      // Cast required: config expiry is `string`; jwt typings expect `StringValue`.
      expiresIn: config.accessTokenExpiry as unknown as number,
    });
  }

  // Generate refresh token
  static async generateRefreshToken(userId: string): Promise<string> {
    const tokenId = randomBytes(32).toString('hex');
    
    const payload: RefreshTokenPayload = {
      userId,
      tokenId,
    };

    const token = jwt.sign(payload, config.jwtRefreshSecret, {
      // Cast required: config expiry is `string`; jwt typings expect `StringValue`.
      expiresIn: config.refreshTokenExpiry as unknown as number,
    });

    // Calculate expiry date from config so DB record always matches the JWT.
    // e.g. "7d" -> 7 days, "24h" -> 24 hours, "30m" -> 30 minutes.
    const expiresAt = this.parseExpiryToDate(config.refreshTokenExpiry);

    // Store token in database
    await RefreshToken.create({
      tokenId,
      userId,
      isRevoked: false,
      expiresAt,
    });

    return token;
  }

  // Verify access token
  static verifyAccessToken(token: string): JWTPayload {
    try {
      return jwt.verify(token, config.jwtAccessSecret) as JWTPayload;
    } catch (error) {
      throw new UnauthorizedError('Invalid or expired access token');
    }
  }

  // Verify refresh token
  static async verifyRefreshToken(token: string): Promise<RefreshTokenPayload> {
    try {
      const payload = jwt.verify(
        token,
        config.jwtRefreshSecret
      ) as RefreshTokenPayload;

      // Check if token is revoked
      const tokenDoc = await RefreshToken.findOne({
        tokenId: payload.tokenId,
        userId: payload.userId,
      });

      if (!tokenDoc) {
        throw new UnauthorizedError('Refresh token not found');
      }

      if (tokenDoc.isRevoked) {
        throw new UnauthorizedError('Refresh token has been revoked');
      }

      if (tokenDoc.expiresAt < new Date()) {
        throw new UnauthorizedError('Refresh token expired');
      }

      return payload;
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        throw error;
      }
      throw new UnauthorizedError('Invalid or expired refresh token');
    }
  }

  // Revoke refresh token
  static async revokeRefreshToken(tokenId: string): Promise<void> {
    await RefreshToken.updateOne(
      { tokenId },
      { isRevoked: true }
    );
  }

  // Revoke all user's refresh tokens
  static async revokeAllUserTokens(userId: string): Promise<void> {
    await RefreshToken.updateMany(
      { userId, isRevoked: false },
      { isRevoked: true }
    );
  }

  // Get access token expiry in seconds
  static getAccessTokenExpiryInSeconds(): number {
    const expiry = config.accessTokenExpiry;
    
    // Parse time string (e.g., "15m" -> 900 seconds)
    const unit = expiry.slice(-1);
    const value = parseInt(expiry.slice(0, -1), 10);
    
    switch (unit) {
      case 's':
        return value;
      case 'm':
        return value * 60;
      case 'h':
        return value * 3600;
      case 'd':
        return value * 86400;
      default:
        return 900; // Default: 15 minutes (matches ACCESS_TOKEN_EXPIRY default)
    }
  }

  /**
   * Parse a JWT-style expiry string (e.g. "7d", "24h", "30m") into a future Date.
   * Used to keep the DB token record in sync with the JWT expiry.
   */
  private static parseExpiryToDate(expiry: string): Date {
    const unit = expiry.slice(-1);
    const value = parseInt(expiry.slice(0, -1), 10);
    const now = new Date();

    switch (unit) {
      case 's':
        now.setSeconds(now.getSeconds() + value);
        break;
      case 'm':
        now.setMinutes(now.getMinutes() + value);
        break;
      case 'h':
        now.setHours(now.getHours() + value);
        break;
      case 'd':
        now.setDate(now.getDate() + value);
        break;
      default:
        // Fallback: 7 days
        now.setDate(now.getDate() + 7);
    }

    return now;
  }
}