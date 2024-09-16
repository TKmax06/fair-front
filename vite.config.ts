import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import * as path from "node:path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()], //这是 vue 项目
  server: {
    host: "localhost",
    port: 7600,
    cors: true
  },
  resolve: {
    alias: {
      //使用@代表./src目录路径
      '@': path.resolve(__dirname, './src'),
    },
  }

})
