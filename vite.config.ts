import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig(() => {
  const base = process.env.GITHUB_ACTIONS ? '/t1d-football-academy/' : '/'

  return {
    base,
    plugins: [
      react(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['app-icon.svg', 'maskable-icon.svg'],
        manifest: {
          name: 'T1D Football Academy',
          short_name: 'T1D Academy',
          description: 'Football-themed activities that help young children understand and talk about type 1 diabetes.',
          theme_color: '#0058a9',
          background_color: '#fffaf0',
          display: 'standalone',
          orientation: 'portrait-primary',
          start_url: base,
          scope: base,
          icons: [
            {
              src: 'app-icon.svg',
              sizes: 'any',
              type: 'image/svg+xml',
              purpose: 'any',
            },
            {
              src: 'maskable-icon.svg',
              sizes: 'any',
              type: 'image/svg+xml',
              purpose: 'maskable',
            },
          ],
        },
        workbox: {
          navigateFallback: 'index.html',
          globPatterns: ['**/*.{js,css,html,svg,jpg,woff2}'],
        },
      }),
    ],
  }
})
