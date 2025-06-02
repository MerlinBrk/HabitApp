import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate', // Service Worker automatisch updaten
      manifest: {
        name: 'Habit Tracker',
        short_name: 'Habits',
        start_url: '/',
        display: 'standalone', // wie native App
        background_color: '#ffffff',
        theme_color: '#4f46e5', // z.B. Tailwind Indigo-600
        icons: [
          {
            src: 'icon-192.png', // Diese Icons musst du anlegen
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'icon-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
      workbox: {
        // Optional: anpassen wie Caching funktioniert
      },
    }),
  ],
})