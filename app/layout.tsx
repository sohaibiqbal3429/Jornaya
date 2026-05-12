import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://aphahealthplan.com'),
  title: {
    default: 'Apha Health Plan | Modern Medicare Guidance',
    template: '%s | Apha Health Plan',
  },
  description: 'Premium Medicare guidance, plan comparison support, and licensed insurance consultation coordination from Apha Health Plan.',
  applicationName: 'Apha Health Plan',
  generator: 'Apha Health Plan',
  keywords: [
    'Apha Health Plan',
    'Medicare guidance',
    'Medicare consultation',
    'Medicare Advantage',
    'Medicare Supplement',
    'Part D plans',
    'licensed insurance agent',
  ],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Apha Health Plan | Modern Medicare Guidance',
    description: 'Premium Medicare guidance, plan comparison support, and licensed insurance consultation coordination from Apha Health Plan.',
    url: 'https://aphahealthplan.com',
    siteName: 'Apha Health Plan',
    type: 'website',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Apha Health Plan premium Medicare guidance',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Apha Health Plan | Modern Medicare Guidance',
    description: 'Premium Medicare guidance, plan comparison support, and licensed insurance consultation coordination from Apha Health Plan.',
    images: ['/twitter-image'],
  },
  manifest: '/manifest.webmanifest',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-32x32.png', type: 'image/png', sizes: '32x32' },
    ],
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="theme-dark">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var t = localStorage.getItem('apha-theme');
                  var c = document.documentElement.classList;
                  c.remove('theme-dark','theme-light');
                  c.add(t === 'theme-light' ? 'theme-light' : 'theme-dark');
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="font-sans antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
