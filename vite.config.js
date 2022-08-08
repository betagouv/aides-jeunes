import vue from "@vitejs/plugin-vue"
import legacy from "@vitejs/plugin-legacy"
import nodePolyfills from "rollup-plugin-polyfill-node"
import path from "path"
import { defineConfig } from "vite"
const __dirname = new URL(".", import.meta.url).pathname

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
    nodePolyfills(),
  ],
  resolve: {
    preferBuiltins: false,
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@lib": path.resolve(__dirname, "dist-server/lib"),
      "@data": path.resolve(__dirname, "dist-server/data"),
      fs: "rollup-plugin-polyfill-node",
    },
  },
})
