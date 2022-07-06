import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"

const path = require("path")
export default defineConfig({
  build: {
    rollupOptions: {
      external: ["jamstack-loader"],
    },
  },
  plugins: [vue()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
