import { defineConfig, loadEnv } from 'vite'
import path from 'path'
import process from 'process'
import solid from 'vite-plugin-solid'
import Icons from 'unplugin-icons/vite'
import devtools from 'solid-devtools/vite'

export default defineConfig(({ mode }) => {
  process.env = Object.assign(process.env, loadEnv(mode, process.cwd(), ''))
  return {
    plugins: [
      devtools({
        /* features options - all disabled by default */
        autoname: true, // e.g. enable autoname
      }),
      ,
      solid(),
      Icons({ compiler: 'solid' }),
    ],
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
