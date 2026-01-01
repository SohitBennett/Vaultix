'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api-client';
import { keyManager } from '@/lib/crypto';
import {
  RegisterRequest,
  LoginRequest,
  AuthResponse,
} from '@password-manager/shared';

interface AuthContextType {
  user: AuthResponse['user'] | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isVaultUnlocked: boolean;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
  unlockVault: (password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<AuthResponse['user'] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isVaultUnlocked, setIsVaultUnlocked] = useState(false);
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

  // Listen for auto-lock events from key manager
  useEffect(() => {
    const handleAutoLock = () => {
      setIsVaultUnlocked(false);
      console.log('Vault locked due to inactivity');
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('autolock', handleAutoLock);
      return () => window.removeEventListener('autolock', handleAutoLock);
    }
  }, []);

  const refreshToken = async () => {
    const response = await apiClient.refresh();
    apiClient.setAccessToken(response.tokens.accessToken);
    
    // Get current user
    const currentUser = await apiClient.getCurrentUser();
    setUser(currentUser);
    
    // Note: Vault remains locked after refresh - user must unlock with password
  };

  const unlockVault = async (password: string) => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      // Initialize key manager with password and salt
      await keyManager.initialize(password, user.salt);
      setIsVaultUnlocked(true);
    } catch (error) {
      throw new Error('Failed to unlock vault. Please check your password.');
    }
  };

  const login = async (data: LoginRequest) => {
    const response = await apiClient.login(data);
    apiClient.setAccessToken(response.tokens.accessToken);
    setUser(response.user);
    
    // Initialize key manager with the password (available during login)
    await keyManager.initialize(data.password, response.user.salt);
    setIsVaultUnlocked(true);
    
    router.push('/vault');
  };

  const register = async (data: RegisterRequest) => {
    const response = await apiClient.register(data);
    apiClient.setAccessToken(response.tokens.accessToken);
    setUser(response.user);
    
    // Initialize key manager with the password (available during registration)
    await keyManager.initialize(data.password, response.user.salt);
    setIsVaultUnlocked(true);
    
    router.push('/vault');
  };

  const handleLogout = () => {
    setUser(null);
    setIsVaultUnlocked(false);
    apiClient.setAccessToken(null);
    keyManager.clear(); // Clear master key from memory
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
        isVaultUnlocked,
        login,
        register,
        logout,
        refreshToken,
        unlockVault,
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