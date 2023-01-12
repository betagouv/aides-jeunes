const path = require("path")
const fs = require("fs")

const filename = "../../dist/documents/iframe-integration.js"

const buildOutput = fs.readFileSync(path.join(__dirname, `${filename}`), "utf8")
console.log()
describe("Test iframe build output", function () {
  it("File is not empty", function () {
    expect(buildOutput).not.toBe("")
  })
  if (process.env.NODE_ENV === "production") {
    it("Does not contain localhost", function () {
      expect(buildOutput).not.toContain("localhost")
    })
  }
})
