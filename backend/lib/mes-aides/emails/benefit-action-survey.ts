import fs from "fs"
import path from "path"
import consolidate from "consolidate"

const mustache = consolidate.mustache
import { mjml, followupLinksDataBuilder } from "./index"

const textTemplate = fs.readFileSync(
  path.join(__dirname, "templates/benefit-action-survey.txt"),
  "utf8"
)
const mjmlTemplate = fs.readFileSync(
  path.join(__dirname, "templates/benefit-action-survey.mjml"),
  "utf8"
)

function renderAsText(followup) {
  const data = followupLinksDataBuilder(followup, ["ctaLink", "returnURL"])
  return mustache.render(textTemplate, data)
}

function renderAsHtml(followup) {
  const data = followupLinksDataBuilder(followup, [
    "ctaLink",
    "returnURL",
    "baseURL",
  ])

  return mustache.render(mjmlTemplate, data).then(function (templateString) {
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
