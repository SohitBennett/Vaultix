import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-2xl font-bold text-blue-600">🔐</span>
            <span className="ml-2 text-xl font-bold text-gray-900">
              Password Manager
            </span>
          </div>
          <div className="flex gap-4">
            <Link href="/login" className="btn-secondary">
              Login
            </Link>
            <Link href="/register" className="btn-primary">
              Get Started
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex items-center justify-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Secure Password Management
            <br />
            <span className="text-blue-600">Made Simple</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Store your passwords with military-grade encryption. Zero-knowledge
            architecture means only you can access your data.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/register" className="btn-primary text-lg px-8 py-3">
              Create Free Account
            </Link>
            <Link href="/login" className="btn-secondary text-lg px-8 py-3">
              Sign In
            </Link>
          </div>

          {/* Features */}
          <div className="mt-20 grid md:grid-cols-3 gap-8">
            <div className="card">
              <div className="text-4xl mb-4">🔒</div>
              <h3 className="text-xl font-semibold mb-2">
                Client-Side Encryption
              </h3>
              <p className="text-gray-600">
                Your passwords are encrypted in your browser before being sent
                to our servers. We never see your data.
              </p>
            </div>
            <div className="card">
              <div className="text-4xl mb-4">🎲</div>
              <h3 className="text-xl font-semibold mb-2">
                Password Generator
              </h3>
              <p className="text-gray-600">
                Generate cryptographically secure passwords with customizable
                length and character sets.
              </p>
            </div>
            <div className="card">
              <div className="text-4xl mb-4">📤</div>
              <h3 className="text-xl font-semibold mb-2">Easy Export</h3>
              <p className="text-gray-600">
                Export your passwords to CSV anytime. Your data is always yours
                to keep.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 py-6 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-600">
          <p>&copy; 2024 Password Manager. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}