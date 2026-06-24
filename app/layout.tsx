import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://alphalegalintake.com'),
  title: {
    default: 'Alpha Legal Intake | Motor Vehicle Accident Leads',
    template: '%s | Alpha Legal Intake',
  },
  description: 'Motor Vehicle Accident leads, MVA leads, personal injury leads, live transfer leads, legal intake services, and accident call center support for law firms.',
  applicationName: 'Alpha Legal Intake',
  generator: 'Alpha Legal Intake',
  keywords: [
    'Alpha Legal Intake',
    'Motor Vehicle Accident Leads',
    'MVA Leads',
    'Personal Injury Leads',
    'Live Transfer Leads',
    'Legal Intake Services',
    'Accident Call Center',
    'Accident Lead Generation',
  ],
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Alpha Legal Intake | Motor Vehicle Accident Leads',
    description: 'Verified accident leads, live transfer calls, case qualification, and legal intake support for personal injury law firms.',
    url: 'https://alphalegalintake.com',
    siteName: 'Alpha Legal Intake',
    type: 'website',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'Alpha Legal Intake accident lead generation and call center support' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Alpha Legal Intake | Motor Vehicle Accident Leads',
    description: 'Verified accident leads, live transfer calls, and legal intake services for personal injury law firms.',
    images: ['/twitter-image'],
  },
  manifest: '/manifest.webmanifest',
  icons: { icon: [{ url: '/favicon.ico', sizes: 'any' }, { url: '/favicon-32x32.png', type: 'image/png', sizes: '32x32' }], shortcut: '/favicon.ico', apple: '/apple-touch-icon.png' },
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="theme-dark">
      <head><script dangerouslySetInnerHTML={{ __html: `(function(){try{var t=localStorage.getItem('alpha-theme');var c=document.documentElement.classList;c.remove('theme-dark','theme-light');c.add(t==='theme-light'?'theme-light':'theme-dark');}catch(e){}})();` }} /></head>
      <body className="font-sans antialiased">{children}<Analytics /></body>
    </html>
  )
}
