/* eslint-disable no-console */

var Promise = require("bluebird")
var crypto = Promise.promisifyAll(require("crypto"))
var puppeteer = require("puppeteer")

exports.generateToken = function (lengthInBytes) {
  if (!lengthInBytes) {
    lengthInBytes = 48
  }
  return crypto.randomBytesAsync(lengthInBytes).then(function (buf) {
    return buf.toString("base64").replace(/\//g, "_").replace(/\+/g, "-")
  })
}

// @see https://github.com/westmonroe/pdf-puppeteer
exports.convertHTMLToPDF = async (
  html,
  callback,
  options = null,
  puppeteerArgs = null,
  remoteContent = true
) => {
  if (typeof html !== "string") {
    throw new Error(
      "Invalid Argument: HTML expected as type of string and received a value of a different type. Check your request body and request headers."
    )
  }
  let browser
  if (puppeteerArgs) {
    browser = await puppeteer.launch(puppeteerArgs)
  } else {
    browser = await puppeteer.launch()
  }

  const page = await browser.newPage()
  if (!options) {
    options = { format: "Letter" }
  }

  if (remoteContent === true) {
    await page.goto(`data:text/html,${html}`, {
      waitUntil: "networkidle0",
    })
  } else {
    // page.setContent will be faster than page.goto if html is a static
    await page.setContent(html, {
      waitUntil: ["domcontentloaded", "networkidle0"],
    })
  }

  await page.pdf(options).then(callback, function (error) {
    console.log(error)
  })
  await browser.close()
}
