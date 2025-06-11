import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  assetsInclude: ['**/*.glb', '**/*.gltf', '**/*.bin', '**/*.hdr', '**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.svg', '**/*.mp3', '**/*.mp4', '**/*.ico', '**/*.webm', '**/*.json'],
  plugins: [],
  server: {
    host: true,
    port: 5500  // required by cors of the dev-env aws server
  },
  resolve: {
    alias: {
      'three': 'three'
    }
  }
})
