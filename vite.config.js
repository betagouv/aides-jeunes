import vue from "@vitejs/plugin-vue"
import legacy from "@vitejs/plugin-legacy"
import path from "path"
import { defineConfig } from "vite"
const __dirname = new URL(".", import.meta.url).pathname

export default defineConfig({
  plugins: [
    vue(),
    legacy({
      targets: ["defaults", "not IE 11"],
    }),
  ],
  rollupOptions: {
    external: ["jamstack-loader"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@lib": path.resolve(__dirname, "dist-server/lib"),
      "@data": path.resolve(__dirname, "dist-server/data"),
    },
  },
})
