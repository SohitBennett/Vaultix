'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api-client';
import {
  RegisterRequest,
  LoginRequest,
  AuthResponse,
} from '@password-manager/shared';

interface AuthContextType {
  user: AuthResponse['user'] | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<AuthResponse['user'] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Try to refresh token on mount
        await refreshToken();
      } catch (error) {
        // No valid session, user needs to login
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  // Setup automatic token refresh
  useEffect(() => {
    if (!user) return;

    // Refresh token every 14 minutes (access token expires in 15 min)
    const interval = setInterval(() => {
      refreshToken().catch((error) => {
        console.error('Token refresh failed:', error);
        handleLogout();
      });
    }, 14 * 60 * 1000);

    return () => clearInterval(interval);
  }, [user]);

  const refreshToken = async () => {
    const response = await apiClient.refresh();
    apiClient.setAccessToken(response.tokens.accessToken);
    
    // Get current user
    const currentUser = await apiClient.getCurrentUser();
    setUser(currentUser);
  };

  const login = async (data: LoginRequest) => {
    const response = await apiClient.login(data);
    apiClient.setAccessToken(response.tokens.accessToken);
    setUser(response.user);
    router.push('/vault');
  };

  const register = async (data: RegisterRequest) => {
    const response = await apiClient.register(data);
    apiClient.setAccessToken(response.tokens.accessToken);
    setUser(response.user);
    router.push('/vault');
  };

  const handleLogout = () => {
    setUser(null);
    apiClient.setAccessToken(null);
    router.push('/login');
  };

  const logout = async () => {
    try {
      await apiClient.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      handleLogout();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        refreshToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};