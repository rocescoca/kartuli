import type { Metadata, Viewport } from 'next';
import './globals.css';
import { metadata as seoMetadata } from './metadata.config';

export const metadata: Metadata = seoMetadata;

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Disable analytics and tracking during CI audits
  // This prevents analytics from skewing Lighthouse performance scores
  const _isCiAudit = process.env.CI_AUDIT === 'true';

  return (
    <html lang="en">
      <body>
        {children}
        {/* Future: Add analytics scripts here with !_isCiAudit condition */}
        {/* Current status: CI_AUDIT={_isCiAudit ? 'enabled' : 'disabled'} */}
      </body>
    </html>
  );
}
