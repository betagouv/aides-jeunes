import { defineConfig, loadEnv } from "vite"
import config from "../backend/config/index"

const { baseURL } = config

export default defineConfig(async ({ mode }) => {
  Object.assign(process.env, loadEnv(mode, process.cwd()))
  const viteEnvironment = {
    VITE_BASE_URL: baseURL,
  }
  return {
    build: {
      rollupOptions: {
        input: "iframes/iframe-integration.js",
        output: {
          dir: "public/documents/",
          entryFileNames: "iframe-integration.js",
        },
      },
    },
    define: {
      "process.env": viteEnvironment,
    },
  }
})
