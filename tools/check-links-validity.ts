import Benefits from "../data/all.js"
import axios from "axios"
import fs from "fs"
import Bluebird from "bluebird"

async function checkURL(benefit) {
  const results = await Bluebird.map(benefit.links, fetchStatus)
  const errors = results.filter((r) => !r.ok)
  console.log(
    `${benefit.label} (${benefit.institution})\n${results
      .map((e) => (e.ok ? `✅ ${e.type}` : `❌ ${e.type} ${e.link}`))
      .join("\n")}`
  )

  return { ...benefit, errors }
}

async function fetchStatus(ressource) {
  ressource.status = await getHTTPStatus(ressource.link)

  // Retry one time in case of timeout
  if (ressource.status === 499) {
    await sleep(10000)
    ressource.status = await getHTTPStatus(ressource.link)
  }
  ressource.ok = ressource.status === 200
  return ressource
}

async function getHTTPStatus(link) {
  try {
    const res = await axios.get(link, {
      timeout: 15000,
    })
    return res.status
  } catch (err) {
    return err.response?.status || 499
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function getPriorityStats() {
  const stats = await Promise.resolve(
    JSON.parse(fs.readFileSync("./statistics", "utf-8"))
  )
  const statTotal = stats.map((v) => {
    const p = v.events?.showDetails || {}
    const totals = Object.keys(p)
    return {
      benefit: v.benefit,
      count: totals.reduce((at, t) => {
        const indexes = Object.keys(p[t])
        return (
          at +
          indexes.reduce((ai, i) => {
            return ai + p[t][i]
          }, 0)
        )
      }, 0),
    }
  })

  const statByBenefitId = statTotal.reduce((a, v) => {
    a[v.benefit] = v.count
    return a
  }, {})

  return statByBenefitId
}

async function getBenefitData() {
  const priorityMap = await getPriorityStats()

  const data = Benefits.all.map((benefit) => {
    const links = ["link", "instructions", "form", "teleservice"]
      .filter(
        (linkType) => benefit[linkType] && typeof benefit[linkType] === "string"
      )
      .map((linkType) => {
        const link = benefit[linkType]
        return {
          link,
          type: linkType,
        }
      })
    return {
      id: benefit.id,
      label: benefit.label,
      institution: benefit.institution.label,
      priority: priorityMap[benefit.id] || 0,
      links,
      editLink: ["openfisca", "javascript"].includes(benefit.source)
        ? `https://contribuer-aides-jeunes.netlify.app/admin/#/collections/benefits_${benefit.source}/entries/${benefit.id}`
        : undefined,
    }
  })
  return data.sort((a, b) => -(a.priority - b.priority))
}

function rowText(data) {
  const errors = data.errors.map((e) => `${e.status} ${e.type} ${e.link}`)
  const details = `${data.label} - ${data.institution}<br />${errors.join(
    "<br />"
  )}`
  return `|${details}|${data.priority}|[✎](${data.editLink})|`
}

// Formattage spécifique pour récupérer le résultat avec l'action Github
function logGitHubIssueCommentText(benefitWithErrors) {
  const message = `

  Certaines (${
    benefitWithErrors.length
  }) aides référencées ont des liens dysfonctionnels :

  (De la moins prioritaire à la plus pr)

  |Aide|Priorité|✎|
  |----|--------|-|
  ${benefitWithErrors.reverse().map(rowText).join("\n")}`

  const format = (msg) =>
    msg
      .trim()
      .split("\n")
      .map((line) => line.trim())
      .join("<br />")
  console.log(`::set-output name=comment::${format(message)}`)
}

async function main() {
  const benefitData = await getBenefitData()
  //const results = await Bluebird.map(benefitData, checkURL, { concurrency: 3 })
  //const detectedErrors = results.filter((i) => i.errors.length)
  const detectedErrors = JSON.parse(
    fs.readFileSync("link-tests_2022-08-12T16-46-59.071Z.json", "utf-8")
  )
  /*fs.writeFileSync(`link-tests_${(new Date()).toISOString().replace(/:/g, '-')}.json`,
    JSON.stringify(detectedErrors, null, 2))*/
  if (detectedErrors.length > 0) {
    if (process.argv.slice(2).includes("--ci")) {
      logGitHubIssueCommentText(detectedErrors)
    } else if (detectedErrors) {
      console.log(
        `Liens invalides : ${detectedErrors.map(({ link }) => `\n- ${link}`)}`
      )
    }

    console.log("Terminé")
  }
}

main()
