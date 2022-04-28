const capitalize = require("lodash/capitalize")
const fs = require("fs")
const path = require("path")
const map = require("lodash/map")
const assign = require("lodash/assign")

const mustache = require("consolidate").mustache
const config = require("../../../config")
const openfiscaController = require("../../openfisca/parameters")
const {
  formatDroitEstime,
  getBenefitImage,
} = require("../../../../lib/benefits/details")
const { mjml } = require(".")

const mjmlTemplate = fs.readFileSync(
  path.join(__dirname, "templates/simulation-result.mjml"),
  "utf8"
)

function renderAsHtml(benefits, parameters) {
  let droits = map(benefits, function (droit) {
    let value = ""
    let droitEstime = formatDroitEstime(droit, parameters)

    if (droitEstime.type === "float") {
      value = `${droitEstime.value} ${droitEstime.legend}`
    }

    let ctaLink = ""
    let ctaLabel = ""
    if (droit.teleservice) {
      ctaLink = droit.teleservice
      ctaLabel = "Faire une demande en ligne"
    } else if (droit.form) {
      ctaLink = droit.form
      ctaLabel = "Accéder au formulaire papier"
    } else if (droit.instructions) {
      ctaLink = droit.instructions
      ctaLabel = "Accéder aux instructions"
    } else {
      ctaLink = droit.link
      ctaLabel = "Plus d'informations"
    }

    return assign({}, droit, {
      imgSrc: getBenefitImage(droit),
      montant: value,
      ctaLink: ctaLink,
      ctaLabel: ctaLabel,
      droitLabel: capitalize(droit.label),
    })
  })

  return mustache
    .render(mjmlTemplate, {
      droits: droits,
      baseURL: config.baseURL,
    })
    .then(function (templateString) {
      return mjml(templateString).html
    })
}

async function render(simulation) {
  const parameters = await openfiscaController.getParameters(
    simulation.dateDeValeur
  )
  const simulationResults = await simulation.compute()
  const droitsEligibles = simulationResults.droitsEligibles
  const html = await renderAsHtml(droitsEligibles, parameters)
  return html
}

exports.render = render
