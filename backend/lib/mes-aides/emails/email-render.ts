import { capitalize } from "lodash-es"
import fs from "fs"
import path from "path"
import consolidate from "consolidate"

const mustache = consolidate.mustache
import config from "../../../config/index.js"
import openfiscaController from "../../openfisca/parameters.js"
import {
  formatDroitEstime,
  getBenefitImage,
} from "../../../../lib/benefits/details.js"
import { mjml } from "./index.js"
import { EmailType } from "../../../types/email.js"

const __dirname = new URL(".", import.meta.url).pathname

function readFile(filePath) {
  return fs.readFileSync(path.join(__dirname, filePath), "utf8")
}
const benefitActionTemplate = readFile("templates/benefit-action.mjml")
const emailTemplate = readFile("templates/email.mjml")
const footerTemplate = readFile("templates/footer.mjml")
const headerTemplate = readFile("templates/header.mjml")
const simulationResultsTemplate = readFile("templates/simulation-results.mjml")
const simulationUsefulnessTemplate = readFile(
  "templates/simulation-usefulness.mjml"
)
const emailTemplates = {
  [EmailType.simulationResults]: simulationResultsTemplate,
  [EmailType.benefitAction]: benefitActionTemplate,
  [EmailType.simulationUsefulness]: simulationUsefulnessTemplate,
}
const simulationResultsTextTemplate = readFile(
  "templates/simulation-results.txt"
)
const benefitActionTextTemplate = readFile("templates/benefit-action.txt")
const simulationUsefulnessTextTemplate = readFile(
  "templates/simulation-usefulness.txt"
)
const textTemplates = {
  [EmailType.simulationResults]: simulationResultsTextTemplate,
  [EmailType.benefitAction]: benefitActionTextTemplate,
  [EmailType.simulationUsefulness]: simulationUsefulnessTextTemplate,
}

const dataTempateBuilder = (
  emailType,
  followup,
  formatedBenefits,
  benefits,
  parameters
) => {
  return {
    benefitTexts: benefits.map((benefit) =>
      basicBenefitText(benefit, parameters)
    ),
    baseURL: config.baseURL,
    ctaLink: `${config.baseURL}${followup.surveyPathTracker}`,
    droits: formatedBenefits,
    returnURL: `${config.baseURL}${followup.returnPath}`,
    partials: {
      header: headerTemplate,
      content: emailTemplates[emailType],
      footer: footerTemplate,
    },
  }
}

function basicBenefitText(droit, parameters) {
  const droitEstime = formatDroitEstime(droit, parameters)

  if (droit.labelFunction) {
    return droit.labelFunction({ ...droit, legend: droitEstime.legend })
  }

  if (droitEstime.type === "bool") {
    return droit.label
  }
  if (droitEstime.unit === "séances") {
    return `${droit.label} : vous pouvez bénéficier de ${droitEstime.value} ${droitEstime.legend}`
  }

  return `${droit.label} pour un montant de ${droitEstime.value} ${droitEstime.legend}`
}

const formatBenefits = (benefits, parameters) => {
  const formatedBenefits = benefits.map((benefit) => {
    const benefitEstimated = formatDroitEstime(benefit, parameters)
    const value =
      benefitEstimated.type === "float"
        ? `${benefitEstimated.value} ${benefitEstimated.legend}`
        : ""
    const { teleservice, form, instructions, link, label } = benefit
    const ctaLink = teleservice || form || instructions || link
    const ctaLabel = teleservice
      ? "Faire une demande en ligne"
      : form
      ? "Accéder au formulaire papier"
      : instructions
      ? "Accéder aux instructions"
      : "Plus d'informations"

    return {
      ...benefit,
      imgSrc: getBenefitImage(benefit),
      montant: value,
      ctaLink,
      ctaLabel,
      benefitLabel: capitalize(label),
    }
  })
  return formatedBenefits
}

function renderAsText(emailType, dataTemplate) {
  return mustache.render(textTemplates[emailType], dataTemplate)
}

function renderAsHtml(emailType, dataTemplate) {
  if (!(emailType in emailTemplates)) {
    throw new Error(`Unknown email type: ${emailType}`)
  }
  return mustache
    .render(emailTemplate, dataTemplate)
    .then(function (templateString) {
      const output = mjml(templateString)
      return {
        html: output.html,
      }
    })
}

export default async function emailRender(emailType, followup) {
  const populated = await (followup.populated("simulation")
    ? Promise.resolve(followup)
    : followup.populate("simulation"))

  const parameters = await openfiscaController.getParameters(
    populated.simulation.dateDeValeur
  )

  const situationResults = await populated.simulation.compute()
  const benefits = situationResults.droitsEligibles
  followup.benefits = benefits.map((benefit) => ({
    id: benefit.id,
    amount: benefit.montant,
    unit: benefit.unit,
  }))
  followup.save()

  const formatedBenefits =
    emailType === EmailType.simulationResults
      ? formatBenefits(benefits, parameters)
      : null

  const dataTemplate = dataTempateBuilder(
    emailType,
    followup,
    formatedBenefits,
    benefits,
    parameters
  )

  return Promise.all([
    renderAsText(emailType, dataTemplate),
    renderAsHtml(emailType, dataTemplate),
  ]).then(function (values) {
    return {
      subject: `[${followup.simulation._id}] Récapitulatif de votre simulation sur 1jeune1solution.gouv.fr`,
      text: values[0],
      html: values[1].html,
      attachments: values[1].attachments,
    }
  })
}
