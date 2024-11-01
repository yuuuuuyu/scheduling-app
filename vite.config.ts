import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"

// 当前执行node命令时文件夹的地址（工作目录）
const root: string = process.cwd()
// https://vitejs.dev/config/
export default defineConfig({
  base: `./`,
  root,
  plugins: [vue()],
  build: {
    target: "es2015",
    sourcemap: false,
    brotliSize: false,
    chunkSizeWarningLimit: 1500,
    outDir: `dist/drag-drop`,
  },
})

