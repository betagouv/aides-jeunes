var utils = require("../../backend/lib/utils")

var pdfOptions = {
  format: "A4",
  margin: {
    top: "0.5cm",
    right: "2cm",
    bottom: "0.5cm",
    left: "2cm",
  },
}

let puppeteerArgs = {}
if (process.env.PUPPETEER_ARGS) {
  try {
    puppeteerArgs = JSON.parse(process.env.PUPPETEER_ARGS)
  } catch (e) {
    // Do nothing
  }
}

describe("PDF rendering", function () {
  it("should render a PDF", function (done) {
    this.timeout(10000)

    var html = `<html><body><p>Hello, world</p></body></html>`
    utils.convertHTMLToPDF(html, () => done(), pdfOptions, puppeteerArgs, false)
  })
})
