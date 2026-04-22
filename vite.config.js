// Vite configuration for Election AI Assistant
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  // Expose env variables starting with VITE_ to the client
  envPrefix: 'VITE_',
});
