const print = require("../lib/print")
const simulationResult = require("../lib/mes-aides/pdf/simulation-result")

exports.printPDF = async (req, res) => {
  const simulation = req.simulation
  const html = await simulationResult.render(simulation)
  const pdfOptions = {
    format: "A4",
    margin: {
      top: "2cm",
      right: "2cm",
      bottom: "2cm",
      left: "2cm",
    },
  }

  const callback = function (pdf) {
    res.writeHead(200, {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=AidesJeunes_simulation_${req.simulation._id}.pdf`,
    })
    res.end(pdf, "binary")
  }

  print.convertHTMLToPDF(html, callback, pdfOptions, false)
}
