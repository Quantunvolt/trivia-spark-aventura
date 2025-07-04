// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/trivia-spark-aventura/',  // 👈 Ruta de GitHub Pages
  plugins: [react()],
});
