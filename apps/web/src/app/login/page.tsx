'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login({ email, password });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="claude-login-container">
      {/* Theme Toggle - Fixed top right */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      <div className="claude-content-wrapper">
        {/* Header with Logo */}
        <div className="claude-header text-center">
          <Link href="/" className="inline-flex flex-col items-center gap-3 mb-8 transition-opacity duration-200 hover:opacity-70">
            <svg className="w-12 h-12 text-gray-900 dark:text-gray-100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <span className="text-2xl font-semibold text-gray-900 dark:text-gray-100" style={{ letterSpacing: '-0.01em' }}>
              Vaultix
            </span>
          </Link>
        </div>

        {/* Form Card */}
        <div className="claude-card">
          <div className="claude-card-header">
            <h1 className="claude-title">Welcome back</h1>
            <p className="claude-subtitle">
              Sign in to your account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="claude-form">
            {error && (
              <div className="claude-error">
                <svg className="claude-error-icon" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            <div className="claude-input-group">
              <label htmlFor="email" className="claude-label">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="claude-input"
                placeholder="you@example.com"
              />
            </div>

            <div className="claude-input-group">
              <label htmlFor="password" className="claude-label">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="claude-input"
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="claude-submit-btn"
            >
              {isLoading ? (
                <>
                  <div className="claude-spinner"></div>
                  <span>Signing in...</span>
                </>
              ) : (
                'Continue'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="claude-divider">
            <span>Don't have an account?</span>
          </div>

          {/* Register Link */}
          <Link href="/register" className="claude-register-link">
            Create account
          </Link>
        </div>

        {/* Security Note */}
        <div className="claude-footer">
          <svg className="claude-footer-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          <p>
            Your password is encrypted before leaving your device. We never see it.
          </p>
        </div>
      </div>
    </div>
  );
}