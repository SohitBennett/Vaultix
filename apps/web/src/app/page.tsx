import Link from 'next/link';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

export default function Home() {
  return (
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
        <div className="claude-landing-hero-content">
          <h1 className="claude-landing-hero-title">
            Secure password management
            <br />
            <span className="claude-landing-hero-title-accent">made simple</span>
          </h1>
          <p className="claude-landing-hero-subtitle">
            Store your passwords with military-grade encryption. Zero-knowledge
            architecture means only you can access your data.
          </p>
          <div className="claude-landing-hero-buttons">
            <Link href="/register" className="claude-landing-hero-btn-primary">
              Create free account
            </Link>
            <Link href="/login" className="claude-landing-hero-btn-secondary">
              Sign in
            </Link>
          </div>

          {/* Features */}
          <div className="claude-landing-features">
            <div className="claude-landing-feature-card">
              <div className="claude-landing-feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>
              <h3 className="claude-landing-feature-title">
                Client-side encryption
              </h3>
              <p className="claude-landing-feature-description">
                Your passwords are encrypted in your browser before being sent
                to our servers. We never see your data.
              </p>
            </div>

            <div className="claude-landing-feature-card">
              <div className="claude-landing-feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                  <line x1="12" y1="19" x2="12" y2="22" />
                </svg>
              </div>
              <h3 className="claude-landing-feature-title">
                Password generator
              </h3>
              <p className="claude-landing-feature-description">
                Generate cryptographically secure passwords with customizable
                length and character sets.
              </p>
              <Link
                href="/generator"
                className="claude-landing-feature-link"
              >
                Try generator →
              </Link>
            </div>

            <div className="claude-landing-feature-card">
              <div className="claude-landing-feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
              </div>
              <h3 className="claude-landing-feature-title">Easy export</h3>
              <p className="claude-landing-feature-description">
                Export your passwords to CSV anytime. Your data is always yours
                to keep.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="claude-landing-footer">
        <div className="claude-landing-footer-content">
          <p>&copy; 2024 Vaultix. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}