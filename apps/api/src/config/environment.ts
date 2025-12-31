import dotenv from 'dotenv';

dotenv.config();

interface EnvironmentConfig {
  nodeEnv: string;
  port: number;
  mongodbUri: string;
  jwtAccessSecret: string;
  jwtRefreshSecret: string;
  accessTokenExpiry: string;
  refreshTokenExpiry: string;
  corsOrigin: string;
  rateLimitWindowMs: number;
  rateLimitMaxRequests: number;
}

const getEnvVariable = (key: string, defaultValue?: string): string => {
  const value = process.env[key] || defaultValue;
  if (!value) {
    throw new Error(`Environment variable ${key} is not defined`);
  }
  return value;
};

export const config: EnvironmentConfig = {
  nodeEnv: getEnvVariable('NODE_ENV', 'development'),
  port: parseInt(getEnvVariable('PORT', '5000'), 10),
  mongodbUri: getEnvVariable('MONGODB_URI'),
  jwtAccessSecret: getEnvVariable('JWT_ACCESS_SECRET'),
  jwtRefreshSecret: getEnvVariable('JWT_REFRESH_SECRET'),
  accessTokenExpiry: getEnvVariable('ACCESS_TOKEN_EXPIRY', '15m'),
  refreshTokenExpiry: getEnvVariable('REFRESH_TOKEN_EXPIRY', '7d'),
  corsOrigin: getEnvVariable('CORS_ORIGIN', 'http://localhost:4000'),
  rateLimitWindowMs: parseInt(
    getEnvVariable('RATE_LIMIT_WINDOW_MS', '900000'),
    10
  ),
  rateLimitMaxRequests: parseInt(
    getEnvVariable('RATE_LIMIT_MAX_REQUESTS', '100'),
    10
  ),
};

export const isProd = config.nodeEnv === 'production';
export const isDev = config.nodeEnv === 'development';