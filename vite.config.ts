
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],  // Fixed: Added React plugin in array
  server: {
    port: 5173
  }
});
