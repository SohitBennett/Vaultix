import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';
import { VaultProvider } from '@/contexts/VaultContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { ScrollProgress } from '@/components/effects/ScrollProgress';
import { CustomCursor } from '@/components/effects/CustomCursor';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Vaultix - Secure Password Manager',
  description: 'A secure, zero-knowledge password manager with client-side encryption',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#ffffff" />
      </head>
      <body className={inter.className}>
        <ThemeProvider>
          <AuthProvider>
            <VaultProvider>
              <ScrollProgress />
              <CustomCursor />
              {children}
            </VaultProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}