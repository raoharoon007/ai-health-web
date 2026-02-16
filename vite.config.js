import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import svgr from 'vite-plugin-svgr'

// https://vite.dev/config/
export default defineConfig({
  plugins: [ 
    react(),
    tailwindcss(),
    svgr({
      // IMPORTANT: Only apply SVGR to imports with ?react suffix
      // Regular .svg imports (without ?react) will be treated as URL strings
      include: '**/*.svg?react',
      exclude: '**/*.svg',
    }),
  ],
})
