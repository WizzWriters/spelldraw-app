import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default defineConfig( ({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    base: env.APP_BASE_URL,
    plugins: [vue()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        '~': fileURLToPath(new URL('./node_modules', import.meta.url)),
      }
    }
  }
})
