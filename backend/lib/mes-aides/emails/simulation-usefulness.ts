import config from "../../../config/index.js"
import consolidate from "consolidate"
import fs from "fs"
import { mjml } from "./index.js"
import path from "path"

const mustache = consolidate.mustache
const __dirname = new URL(".", import.meta.url).pathname

const textTemplate = fs.readFileSync(
  path.join(__dirname, "templates/simulation-usefulness.txt"),
  "utf8"
)
const mjmlTemplate = fs.readFileSync(
  path.join(__dirname, "templates/simulation-usefulness.mjml"),
  "utf8"
)

const headerTemplate = fs.readFileSync(
  path.join(__dirname, "templates/header.mjml"),
  "utf8"
)

const footerTemplate = fs.readFileSync(
  path.join(__dirname, "templates/footer.mjml"),
  "utf8"
)

const dataTemplate = (followup) => {
  return {
    baseURL: config.baseURL,
    ctaLink: `${config.baseURL}${followup.surveyPath}`,
    returnURL: `${config.baseURL}${followup.returnPath}`,
    wasUsefulLinkYes: `${config.baseURL}${followup.wasUsefulPath}`,
    wasUsefulLinkNo: `${config.baseURL}${followup.wasNotUsefulPath}`,
    partials: { header: headerTemplate, footer: footerTemplate },
  }
}

function renderAsText(followup) {
  return mustache.render(textTemplate, dataTemplate(followup))
}

function renderAsHtml(followup) {
  return mustache
    .render(mjmlTemplate, dataTemplate(followup))
    .then(function (templateString) {
      const output = mjml(templateString)
      return {
        html: output.html,
      }
    })
}

export default function render(followup) {
  return Promise.all([renderAsText(followup), renderAsHtml(followup)]).then(
    function (values) {
      return {
        subject: `[${
          followup.simulation?._id || followup.simulation
        }] Votre simulation sur 1jeune1solution.gouv.fr vous a-t-elle été utile ?`,
        text: values[0],
        html: values[1].html,
      }
    }
  )
}
