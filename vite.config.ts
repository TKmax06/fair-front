import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import * as path from "node:path";
//导入ElementPlus相关依赖库
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import {ElementPlusResolver} from 'unplugin-vue-components/resolvers'

//配置SVG依赖库（此处为新增）
import viteSvgIcons, { createSvgIconsPlugin } from 'vite-plugin-svg-icons';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
      vue(),//这是 vue 项目
    // 按需自动加载EP组件
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    // 引用EP控件库
    Components({
      resolvers:[ElementPlusResolver()]
    }),
    //引入SVG图标素材文件（此处为新增，留意上一行的逗号）
    createSvgIconsPlugin({
      // 指定需要缓存的图标文件夹
      iconDirs: [path.resolve(process.cwd(), 'src/icons/svg')],
      // 指定symbolId格式
      symbolId: '[name]'
    })
  ],
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
