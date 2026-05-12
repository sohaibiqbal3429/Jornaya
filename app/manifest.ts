import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Apha Health Plan',
    short_name: 'Apha',
    description: 'Premium Medicare guidance, plan comparison support, and licensed insurance consultation coordination.',
    start_url: '/',
    display: 'standalone',
    background_color: '#062a3c',
    theme_color: '#062a3c',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  };
}
