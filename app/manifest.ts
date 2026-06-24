import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Alpha Legal Intake',
    short_name: 'Alpha Legal',
    description: 'Motor Vehicle Accident leads, live transfer calls, and legal intake services for personal injury law firms.',
    start_url: '/',
    display: 'standalone',
    background_color: '#f6fafb',
    theme_color: '#062a3c',
    icons: [
      { src: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { src: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  }
}
