import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    headers:{
      'Service-Worker-Allowed': '/'
    },
    host: true, // Allows all hosts, equivalent to '0.0.0.0'
    port: 5173, // Default port (you can change this if needed)
  },
})
