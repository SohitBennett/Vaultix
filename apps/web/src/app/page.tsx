'use client';

import Link from 'next/link';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { AnimatedHero } from '@/components/landing/AnimatedHero';
import { AnimatedFeatures } from '@/components/landing/AnimatedFeatures';
import { LoadingScreen } from '@/components/effects/LoadingScreen';

export default function Home() {
  return (
    <>
      <LoadingScreen />
      <div className="claude-landing-container">
        {/* Header */}
        <header className="claude-landing-header">
          <nav className="claude-landing-nav">
            <Link href="/" className="claude-landing-logo">
              <svg className="claude-landing-logo-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <span className="claude-landing-logo-text">Vaultix</span>
            </Link>
            <div className="claude-landing-nav-buttons">
              <ThemeToggle />
              <Link href="/login" className="claude-landing-btn-secondary">
                Sign in
              </Link>
              <Link href="/register" className="claude-landing-btn-primary">
                Get started
              </Link>
            </div>
          </nav>
        </header>

        {/* Hero Section */}
        <main className="claude-landing-hero">
          <AnimatedHero />
          
          {/* Animated Features */}
          <AnimatedFeatures />
        </main>

        {/* Footer */}
        <footer className="claude-landing-footer">
          <div className="claude-landing-footer-content">
            <p>&copy; 2024 Vaultix. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </>
  );
}