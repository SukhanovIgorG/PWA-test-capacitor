import basicSsl from '@vitejs/plugin-basic-ssl'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    basicSsl(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true,
        type: 'module'
      },
      injectRegister: 'auto',
      strategies: 'generateSW',
      manifest: {
        name: 'PWA Capacitor',
        short_name: 'PWA',
        description: 'PWA Capacitor',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        display_override: ['window-controls-overlay'],
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        id: '/',
        icons: [
          {
            src: 'icon-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'
          }
        ],
        screenshots: [
          {
            src: 'screenshot-1.png',
            sizes: '640x960',
            type: 'image/png',
          },
          {
            src: 'screenshot-2.png',
            sizes: '1920x1080',
            type: 'image/png',
            form_factor: 'wide'
          }
        ]
      },
      manifestFilename: 'pwa.webmanifest',
      base: '/',
      selfDestroying: false,
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg,jpeg}'],
        navigateFallback: 'index.html',
        runtimeCaching: [
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images',
              expiration: {
                maxEntries: 60,
                maxAgeSeconds: 30 * 24 * 60 * 60, // 30 дней
              },
            },
          },
          {
            urlPattern: /^https:\/\/api\./,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              networkTimeoutSeconds: 10,
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 5 * 60, // 5 минут
              },
            },
          },
        ],
        maximumFileSizeToCacheInBytes: 1024 * 1024 * 10,
        sourcemap: true,
        cleanupOutdatedCaches: true
      },
    })
  ],
  server: {
    // @ts-expect-error ignore
    https: true,
    host: true,
    port: 3000,
  },
})