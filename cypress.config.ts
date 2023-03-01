import { defineConfig } from "cypress"

export default defineConfig({
  e2e: {
    fixturesFolder: false,
    supportFile: false,
  },
  //chromeWebSecurity: false,
})
