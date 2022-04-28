const puppeteer = require("puppeteer")

// @see https://github.com/westmonroe/pdf-puppeteer
exports.convertHTMLToPDF = async (
  html,
  callback,
  options = null,
  remoteContent = true
) => {
  if (typeof html !== "string") {
    throw new Error(
      "Invalid Argument: HTML expected as type of string and received a value of a different type. Check your request body and request headers."
    )
  }
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
    ],
  })

  const page = await browser.newPage()
  if (!options) {
    options = { format: "Letter" }
  }
  remoteContent = false
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
