import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte()],
  build: {
    manifest: true
  }
  // build: {
  //   lib: {
  //     entry: path.resolve(__dirname, 'src/main.js'),
  //     name: 'guides-builder',
  //     formats: ['es'],
  //     fileName: () => 'index.js'
  //   }
  // }
})
