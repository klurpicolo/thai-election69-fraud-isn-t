import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/thai-election69-fraud-isn-t/',
  plugins: [react(), tailwindcss()],
})
