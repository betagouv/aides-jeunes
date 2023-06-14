import { defineConfig } from "cypress"
import setupSMTPProxy from "./cypress/utils/smtp-proxy.js"

export default defineConfig({
  e2e: {
    fixturesFolder: false,
    supportFile: false,
    setupNodeEvents(on, config) {
      setupSMTPProxy(on, config)
    },
  },
})
