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
      console.error('[Vault Unlock] ❌ No user authenticated');
      throw new Error('User not authenticated');
    }

    console.log('[Vault Unlock] ========== UNLOCK ATTEMPT START ==========');
    console.log('[Vault Unlock] User Info:', {
      userId: user.id,
      userEmail: user.email,
      hasSalt: !!user.salt,
      saltLength: user.salt?.length,
      saltPreview: user.salt?.substring(0, 20) + '...',
    });
    console.log('[Vault Unlock] Password Info:', {
      passwordLength: password.length,
      passwordPreview: password.substring(0, 3) + '***',
      isEmpty: password.length === 0,
    });

    try {
      // Validate inputs
      if (!user.salt) {
        console.error('[Vault Unlock] ❌ No salt found for user');
        throw new Error('User salt not found. Please contact support.');
      }

      if (!password || password.trim().length === 0) {
        console.error('[Vault Unlock] ❌ Empty password provided');
        throw new Error('Password cannot be empty');
      }

      // Initialize key manager with password and salt
      console.log('[Vault Unlock] Calling keyManager.initialize()...');
      const startTime = performance.now();
      
      await keyManager.initialize(password, user.salt);
      
      const endTime = performance.now();
      console.log('[Vault Unlock] ✅ Key derivation completed in', (endTime - startTime).toFixed(2), 'ms');
      console.log('[Vault Unlock] ✅ Vault unlocked successfully');
      console.log('[Vault Unlock] ========== UNLOCK ATTEMPT SUCCESS ==========');
      
      setIsVaultUnlocked(true);
    } catch (error) {
      console.error('[Vault Unlock] ========== UNLOCK ATTEMPT FAILED ==========');
      console.error('[Vault Unlock] ❌ Error details:', {
        errorType: error?.constructor?.name,
        errorMessage: error instanceof Error ? error.message : String(error),
        errorStack: error instanceof Error ? error.stack : undefined,
      });
      
      // Re-throw with user-friendly message
      if (error instanceof Error && error.message.includes('salt')) {
        throw new Error('User configuration error. Please contact support.');
      }
      
      throw new Error('Failed to unlock vault. Please check your password.');
    }
  };

  const login = async (data: LoginRequest) => {
    console.log('[Auth] Login attempt', { email: data.email });
    const response = await apiClient.login(data);
    console.log('[Auth] Login successful', { 
      userId: response.user.id, 
      email: response.user.email,
      hasSalt: !!response.user.salt 
    });
    
    apiClient.setAccessToken(response.tokens.accessToken);
    setUser(response.user);
    
    // Initialize key manager with the password (available during login)
    console.log('[Auth] Initializing vault with login password');
    await keyManager.initialize(data.password, response.user.salt);
    console.log('[Auth] ✅ Vault initialized and unlocked');
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