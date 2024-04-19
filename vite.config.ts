import { defineConfig, loadEnv } from 'vite'
import path from 'path'
import process from 'process'
import solid from 'vite-plugin-solid'
import Icons from 'unplugin-icons/vite'

export default defineConfig(({ mode }) => {
  process.env = Object.assign(process.env, loadEnv(mode, process.cwd(), ''))
  return {
    plugins: [solid(), Icons({ compiler: 'solid' })],
    server: {
      proxy: {
        '/api': {
          target: process.env.suwayomi,
          changeOrigin: true,
          ws: true,
        },
      },
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
  }
})
