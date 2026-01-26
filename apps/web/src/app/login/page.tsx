'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
    <div className="min-h-screen bg-white dark:bg-[#0f0f0f] flex transition-colors duration-200">
      {/* Theme Toggle - Fixed top right */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      {/* Left Side - Hero Image as Background */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <Image
          src="/images/login-hero.png"
          alt="Vaultix - Secure Password Management"
          fill
          className="object-cover"
          style={{ objectPosition: '12% center' }}
          priority
          sizes="50vw"
        />
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="w-full max-w-md">
          {/* Logo - Mobile Only */}
          <div className="lg:hidden text-center mb-6">
            <Link href="/" className="inline-flex flex-col items-center gap-3 transition-opacity duration-200 hover:opacity-70">
              <div className="relative w-full max-w-xs h-40">
                <Image
                  src="/images/mobile-hero.png"
                  alt="Vaultix"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </Link>
          </div>

          {/* Desktop Logo */}
          <div className="hidden lg:block text-center mb-6">
            <Link href="/" className="inline-flex flex-col items-center gap-3 transition-opacity duration-200 hover:opacity-70">
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
          <div className="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-2xl p-8 transition-colors duration-200" style={{ boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)' }}>
            <div className="mb-6">
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2" style={{ letterSpacing: '-0.02em' }}>
                Welcome back
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Sign in to your account
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="flex items-start gap-2.5 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
                  <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span>{error}</span>
                </div>
              )}

              <div className="space-y-1.5">
                <label htmlFor="email" className="block text-sm font-medium text-gray-900 dark:text-gray-100">
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
                  className="w-full px-3.5 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100 focus:border-transparent transition-all duration-150"
                  placeholder="you@example.com"
                  style={{ fontSize: '15px' }}
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="password" className="block text-sm font-medium text-gray-900 dark:text-gray-100">
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
                  className="w-full px-3.5 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100 focus:border-transparent transition-all duration-150"
                  placeholder="Enter your password"
                  style={{ fontSize: '15px' }}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 mt-6 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 font-medium rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150"
                style={{ fontSize: '15px' }}
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 dark:border-gray-900/30 border-t-white dark:border-t-gray-900 rounded-full animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  'Continue'
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative flex items-center justify-center my-6">
              <div className="absolute left-0 right-0 h-px bg-gray-200 dark:bg-gray-800" />
              <span className="px-4 text-xs text-gray-500 dark:text-gray-400 bg-white dark:bg-[#1a1a1a] relative z-10" style={{ letterSpacing: '0.02em' }}>
                Don't have an account?
              </span>
            </div>

            {/* Register Link */}
            <Link 
              href="/register" 
              className="block w-full text-center px-4 py-2.5 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-medium rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-400 dark:hover:border-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100 focus:ring-offset-2 transition-all duration-150"
              style={{ fontSize: '15px' }}
            >
              Create account
            </Link>
          </div>

          {/* Security Note */}
          <div className="flex items-center justify-center gap-2 mt-6 text-xs text-gray-500 dark:text-gray-400">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <p className="text-center">
              Your password is encrypted before leaving your device. We never see it.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}