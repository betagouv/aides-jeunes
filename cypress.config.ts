import { defineConfig } from "cypress"
import setup from "./cypress/utils/smtp-proxy.js"

export default defineConfig({
  e2e: {
    fixturesFolder: false,
    supportFile: false,
    setupNodeEvents(on, config) {
      setup(on, config)
    },
  },
})
