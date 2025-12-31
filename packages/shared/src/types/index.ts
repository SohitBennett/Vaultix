// Auth Types
export interface RegisterRequest {
  email: string;
  password: string;
  passwordConfirm: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    createdAt: string;
  };
  tokens: {
    accessToken: string;
    expiresIn: number;
  };
}

export interface RefreshResponse {
  tokens: {
    accessToken: string;
    expiresIn: number;
  };
}

// Vault Types
export interface VaultItemMetadata {
  name: string;
  category?: string;
  favorite?: boolean;
}

export interface VaultItemRequest {
  encryptedData: string;
  iv: string;
  metadata: VaultItemMetadata;
}

export interface VaultItem {
  id: string;
  encryptedData: string;
  iv: string;
  metadata: VaultItemMetadata;
  createdAt: string;
  updatedAt: string;
}

export interface VaultListResponse {
  items: VaultItem[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

// API Response Types
export interface ApiSuccessResponse<T = any> {
  success: true;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
  };
}

export type ApiResponse<T = any> = ApiSuccessResponse<T> | ApiErrorResponse;

// Error Codes
export enum ErrorCode {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  CONFLICT = 'CONFLICT',
  PAYLOAD_TOO_LARGE = 'PAYLOAD_TOO_LARGE',
  TOO_MANY_REQUESTS = 'TOO_MANY_REQUESTS',
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
}

// JWT Payload
export interface JWTPayload {
  userId: string;
  email: string;
}

export interface RefreshTokenPayload {
  userId: string;
  tokenId: string;
}