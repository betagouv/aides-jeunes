import { defineConfig } from "cypress"
import setupSMTPProxy from "./cypress/utils/smtp-proxy.js"

export default defineConfig({
  e2e: {
    fixturesFolder: false,
    supportFile: false,
    setupNodeEvents(on) {
      setupSMTPProxy(on)
      on("task", {
        log(message) {
          console.log(message)

          return null
        },
        table(message) {
          console.table(message)

          return null
        },
      })
    },
  },
})
