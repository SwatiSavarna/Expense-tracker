import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
// export default defineConfig({
//   plugins: [react(),tailwindcss()],
// })

export default defineConfig({
   plugins: [react(),tailwindcss()],
  server: {
    proxy: {
      '/api': 'https://expense-tracker-2s76.onrender.com/', // Backend server
    },
  },
});