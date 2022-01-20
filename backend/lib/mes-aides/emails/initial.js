const capitalize = require("lodash/capitalize")
const fs = require("fs")
const path = require("path")
const map = require("lodash/map")
const assign = require("lodash/assign")

const mustache = require("consolidate").mustache
const config = require("../../../config")
const openfiscaController = require("../../openfisca/parameters")
const { formatDroitEstime } = require("../../../../lib/benefits/details")
const { mjml } = require(".")

function basicBenefitText(droit, parameters) {
  if (droit.labelFunction) {
    return droit.labelFunction(droit)
  }

  const droitEstime = formatDroitEstime(droit, parameters)

  if (droitEstime.type === "bool") {
    return droit.label
  }

  return `${droitEstime.label} pour un montant de ${droitEstime.value} ${droitEstime.legend}`
}

const textTemplate = fs.readFileSync(
  path.join(__dirname, "templates/initial.txt"),
  "utf8"
)
const mjmlTemplate = fs.readFileSync(
  path.join(__dirname, "templates/initial.mjml"),
  "utf8"
)

function renderAsText(followup, benefits, parameters) {
  const data = {
    benefitTexts: benefits.map(basicBenefitText, parameters),
    returnURL: `${config.baseURL}${followup.returnPath}`,
  }

  return mustache.render(textTemplate, data)
}

function renderAsHtml(followup, benefits, parameters) {
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
      imgSrc: `/img/${droit.institution.imgSrc}`,
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
      returnURL: `${config.baseURL}${followup.returnPath}`,
    })
    .then(function (templateString) {
      const output = mjml(templateString)
      return {
        html: output.html,
      }
    })
}

async function render(followup) {
  const populated = await (followup.populated("answers")
    ? Promise.resolve(followup)
    : followup.populate("answers").execPopulate())

  const parameters = await openfiscaController.getParameters(
    populated.answers.dateDeValeur
  )

  const situationResults = await populated.answers.compute()
  const droitsEligibles = situationResults.droitsEligibles
  followup.benefits = droitsEligibles.map((benefit) => ({
    id: benefit.id,
    amount: benefit.montant,
    unit: benefit.unit,
  }))
  followup.save()

  return Promise.all([
    renderAsText(followup, droitsEligibles, parameters),
    renderAsHtml(followup, droitsEligibles, parameters),
  ]).then(function (values) {
    return {
      subject: `[${followup.answers._id}] Récapitulatif de votre simulation sur 1jeune1solution.gouv.fr`,
      text: values[0],
      html: values[1].html,
      attachments: values[1].attachments,
    }
  })
}

exports.render = render
