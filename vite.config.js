import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    allowedHosts: 'b6d137b1-9cd2-4624-919e-70f5b340bfa5-00-26k383t6oe74d.spock.replit.dev'
  },
})
