import type { Metadata } from 'next';
import '@/styles/globals.css';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Swagger Buddy',
  description: 'Transform Swagger/OpenAPI documentation into a human-readable, interactive UI',
  keywords: ['swagger', 'openapi', 'documentation', 'api', 'interactive'],
  authors: [{ name: 'Swagger Buddy Team' }],
  creator: 'Swagger Buddy',
  publisher: 'Swagger Buddy',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('http://localhost:3000'),
  openGraph: {
    title: 'Swagger Buddy',
    description: 'Transform Swagger/OpenAPI documentation into a human-readable, interactive UI',
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: 'Swagger Buddy',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Swagger Buddy',
    description: 'Transform Swagger/OpenAPI documentation into a human-readable, interactive UI',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased'
        )}
        suppressHydrationWarning
      >
        <div className="relative flex min-h-screen flex-col" suppressHydrationWarning>
          <div className="flex-1" suppressHydrationWarning>
            {children}
          </div>
        </div>
      </body>
    </html>
  );
} 