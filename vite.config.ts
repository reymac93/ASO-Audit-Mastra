import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    watch: {
      // Ignore database and temporary files written by the Mastra backend
      ignored: ['**/mastra.db', '**/src/mastra/public/**', '**/*.duckdb*', '**/*.wal'],
    },
  },
})