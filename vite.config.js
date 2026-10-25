import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Stripe redirects back to localhost:5173 (STRIPE_CHECKOUT_SUCCESS_URL / CANCEL_URL
  // defaults on the backend), so fail loudly instead of silently moving to 5174.
  server: { port: 5173, strictPort: true },
 // base: '/bookstore/',
})
