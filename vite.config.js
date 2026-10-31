import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  base: './', // 让路径变成相对路径，解决子路径加载问题
  plugins: [vue()]
})
