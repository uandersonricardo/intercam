import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(), 
    VitePWA({
      mode: 'development',
      base: '/',
      srcDir: 'src',
      filename: 'sw.ts',
      registerType: 'prompt',
      strategies: 'injectManifest',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.png'],
      manifest: {
        name: 'InterCam',
        short_name: 'InterCam',
        description: 'Sistema IoT de interfone inteligente',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',  
            sizes: '512x512',  
            type: 'image/png',  
            purpose: 'any maskable',  
          },  
        ]
      },
      devOptions: {
        enabled: true,
        type: 'module'
      }
    })
  ],
})
