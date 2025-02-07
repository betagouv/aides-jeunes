import { defineConfig } from "cypress"
import setupSMTPProxy from "./cypress/utils/smtp-proxy.js"

export default defineConfig({
  e2e: {
    fixturesFolder: false,
    supportFile: false,
    setupNodeEvents(on) {
      setupSMTPProxy(on)
    },
    defaultCommandTimeout: 60000,
    requestTimeout: 60000,
  },
})
