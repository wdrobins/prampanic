import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({ mode }) => ({
  base: mode === 'production' ? '/prampanic/' : '/',
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Pram Panic',
        short_name: 'Pram Panic',
        description: 'Keep Lulu asleep on Super Dad Bill’s big day out.',
        theme_color: '#FFF8E7',
        background_color: '#FFF8E7',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          { src: 'icons/icon-192.svg', sizes: '192x192', type: 'image/svg+xml' },
          { src: 'icons/icon-512.svg', sizes: '512x512', type: 'image/svg+xml' }
        ]
      },
      workbox: { globPatterns: ['**/*.{js,css,html,svg,json}'] }
    })
  ],
  test: { environment: 'node', include: ['tests/unit/**/*.test.ts'] }
}));
