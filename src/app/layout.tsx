import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/components/AuthProvider';
import StyledComponentsRegistry from '@/lib/AntdRegistry';
import ClientLayout from '@/components/ClientLayout';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Authentication System',
  description: 'Next.js 14 Authentication System with MongoDB',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <StyledComponentsRegistry>
            <ClientLayout>
              {children}
            </ClientLayout>
          </StyledComponentsRegistry>
        </AuthProvider>
      </body>
    </html>
  );
}
