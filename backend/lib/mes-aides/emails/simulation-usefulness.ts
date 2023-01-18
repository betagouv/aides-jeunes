import config from "../../../config/index"
import consolidate from "consolidate"
import fs from "fs"
import { mjml } from "./index"
import path from "path"

const mustache = consolidate.mustache

const textTemplate = fs.readFileSync(
  path.join(__dirname, "templates/simulation-usefulness.txt"),
  "utf8"
)
const mjmlTemplate = fs.readFileSync(
  path.join(__dirname, "templates/simulation-usefulness.mjml"),
  "utf8"
)

const dataTemplate = (followup) => {
  return {
    baseUrl: config.baseURL,
    ctaLink: `${config.baseURL}${followup.surveyPath}`,
    returnURL: `${config.baseURL}${followup.returnPath}`,
    wasUsefulLinkYes: `${config.baseURL}${followup.wasUsefulPath}`,
    wasUsefulLinkNo: `${config.baseURL}${followup.wasNotUsefulPath}`,
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
