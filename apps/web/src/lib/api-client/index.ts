import {
  ApiResponse,
  RegisterRequest,
  LoginRequest,
  AuthResponse,
  RefreshResponse,
  VaultItem,
  VaultListResponse,
} from '@password-manager/shared';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

class ApiClient {
  private baseUrl: string;
  private accessToken: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  setAccessToken(token: string | null): void {
    this.accessToken = token;
  }

  getAccessToken(): string | null {
    return this.accessToken;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    // Add access token if available
    if (this.accessToken) {
      headers['Authorization'] = `Bearer ${this.accessToken}`;
    }

    const config: RequestInit = {
      ...options,
      headers,
      credentials: 'include', // Include cookies for refresh token
    };

    try {
      const response = await fetch(url, config);
      const data: ApiResponse<T> = await response.json();

      if (!response.ok) {
        if (!data.success) {
          throw new Error(data.error.message || 'Request failed');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      if (!data.success) {
        throw new Error(data.error.message || 'Request failed');
      }

      return data.data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('An unexpected error occurred');
    }
  }

  // Auth endpoints
  async register(data: RegisterRequest): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async login(data: LoginRequest): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async refresh(): Promise<RefreshResponse> {
    return this.request<RefreshResponse>('/auth/refresh', {
      method: 'POST',
    });
  }

  async logout(): Promise<void> {
    await this.request('/auth/logout', {
      method: 'POST',
    });
  }

  async getCurrentUser(): Promise<AuthResponse['user']> {
    const response = await this.request<{ user: AuthResponse['user'] }>(
      '/auth/me'
    );
    return response.user;
  }

  // Vault endpoints
  async getVaultItems(params?: {
    page?: number;
    limit?: number;
    category?: string;
    favorite?: boolean;
    search?: string;
    sortBy?: 'name' | 'createdAt' | 'updatedAt';
    sortOrder?: 'asc' | 'desc';
  }): Promise<VaultListResponse> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.category) queryParams.append('category', params.category);
    if (params?.favorite !== undefined)
      queryParams.append('favorite', params.favorite.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder);

    const query = queryParams.toString();
    const endpoint = `/vault${query ? `?${query}` : ''}`;

    return this.request<VaultListResponse>(endpoint);
  }

  async getVaultItem(id: string): Promise<VaultItem> {
    const response = await this.request<{ item: VaultItem }>(`/vault/${id}`);
    return response.item;
  }

  async createVaultItem(
    item: Omit<VaultItem, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<VaultItem> {
    const response = await this.request<{ item: VaultItem }>('/vault', {
      method: 'POST',
      body: JSON.stringify(item),
    });
    return response.item;
  }

  async updateVaultItem(
    id: string,
    updates: Partial<Omit<VaultItem, 'id' | 'createdAt' | 'updatedAt'>>
  ): Promise<VaultItem> {
    const response = await this.request<{ item: VaultItem }>(`/vault/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    return response.item;
  }

  async deleteVaultItem(id: string): Promise<void> {
    await this.request(`/vault/${id}`, {
      method: 'DELETE',
    });
  }

  async getVaultStats(): Promise<{
    totalItems: number;
    favoriteItems: number;
    categoryCounts: { category: string; count: number }[];
  }> {
    return this.request('/vault/stats');
  }
}

export const apiClient = new ApiClient(API_URL);
export default apiClient;