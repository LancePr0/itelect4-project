import path from 'path'
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      // import.meta.dirname, not __dirname: this file is an ES module.
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
  // npm run dev and npm run build skip this block. npm test reads the
  // whole file -- the plugins and the "@" alias too -- and then this.
  test: {
    // A pretend browser page inside Node, so render() has a document
    // to put the component in. Tests run in a terminal, not a tab.
    environment: 'jsdom',
    // Runs before every test file: adds the toBeInTheDocument family
    // of checks, and wipes the page between tests.
    setupFiles: ['./src/test/setup.ts'],
    // client.ts throws at import if VITE_API_URL is missing, and
    // LoginPage imports client.ts. The tests never call this address
    // -- they check the form stops before any request is sent -- so a
    // fixed value here means the tests need no .env, on this laptop
    // or on GitHub.
    env: { VITE_API_URL: 'http://localhost:4000' },
  },
})
