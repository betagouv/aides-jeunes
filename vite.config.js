import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import legacy from "@vitejs/plugin-legacy"

const path = require("path")
export default defineConfig({
  build: {
    rollupOptions: {
      external: ["jamstack-loader"],
    },
    commonjsOptions: {
      exclude: ["lib"],
    },
  },
  plugins: [
    vue(),
    legacy({
      targets: ["defaults", "not IE 11"],
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
