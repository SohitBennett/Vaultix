'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

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
    <div className="gemini-login-container">
      {/* Animated Background */}
      <div className="gemini-bg-gradient"></div>
      <div className="gemini-bg-overlay"></div>
      
      <div className="gemini-content-wrapper">
        {/* Header */}
        <div className="gemini-header">
          <Link href="/" className="gemini-logo-link">
            <div className="gemini-logo-icon">🔐</div>
            <span className="gemini-logo-text">Vaultix</span>
          </Link>
          <h1 className="gemini-title">Welcome back</h1>
          <p className="gemini-subtitle">
            Sign in to continue to your vault
          </p>
        </div>

        {/* Form Card */}
        <div className="gemini-card">
          <form onSubmit={handleSubmit} className="gemini-form">
            {error && (
              <div className="gemini-error">
                <svg className="gemini-error-icon" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            <div className="gemini-input-group">
              <label htmlFor="email" className="gemini-label">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="gemini-input"
                placeholder="Enter your email"
              />
            </div>

            <div className="gemini-input-group">
              <label htmlFor="password" className="gemini-label">
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
                className="gemini-input"
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="gemini-submit-btn"
            >
              {isLoading ? (
                <>
                  <div className="gemini-spinner"></div>
                  <span>Signing in...</span>
                </>
              ) : (
                'Continue'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="gemini-divider">
            <span>New to Vaultix?</span>
          </div>

          {/* Register Link */}
          <Link href="/register" className="gemini-register-link">
            Create an account
          </Link>
        </div>

        {/* Security Note */}
        <div className="gemini-footer">
          <svg className="gemini-footer-icon" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
          </svg>
          <p>
            Your password is encrypted before leaving your device. We never see it.
          </p>
        </div>
      </div>
    </div>
  );
}