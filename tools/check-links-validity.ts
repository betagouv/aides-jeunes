import Benefits from "../data/all"
import Config from "../backend/config/index"
import axios from "axios"
import https from "https"
import Bluebird from "bluebird"
import fs from "fs"
import os from "os"

// Avoid some errors due to bad tls management
const httpsAgent = new https.Agent({ rejectUnauthorized: false })

const customBenefitsFiles = [
  {
    pattern: /-fsl-eligibilite$/,
    file: `${Config.github.repository_url}/blob/master/data/benefits/dynamic/fsl.ts`,
  },
  {
    pattern: /-apa-eligibilite$/,
    file: `${Config.github.repository_url}/blob/master/data/benefits/dynamic/apa.ts`,
  },
  {
    pattern: /^aidesvelo_/,
    file: `https://github.com/mquandalle/mesaidesvelo/blob/master/src/aides.yaml`,
  },
]

function setEditLink(benefit) {
  for (let category of customBenefitsFiles) {
    if (benefit.id.match(category.pattern)) {
      return category.file
    }
  }
  return ["openfisca", "javascript"].includes(benefit.source)
    ? `https://contribuer-aides-jeunes.netlify.app/admin/#/collections/benefits_${benefit.source}/entries/${benefit.id}`
    : undefined
}

async function checkURL(benefit) {
  const results = await Bluebird.map(benefit.links, fetchStatus)
  const errors = results.filter((r) => !r.ok)
  console.log(
    `${benefit.label} (${benefit.institution})\n${results
      .map((e) => (e.ok ? `- ✅ ${e.type}` : `- ❌ ${e.type} ${e.link}`))
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
      withCredentials: true,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:99.0) Gecko/20100101 Firefox/99.0",
      },
      httpsAgent,
    })
    return res.status
  } catch (err: any) {
    return err.response?.status || 499
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function getPriorityStats() {
  const stats = await axios
    .get("https://aides-jeunes-stats-recorder.osc-fr1.scalingo.io/statistics")
    .then((r) => r.data)
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
    const linkMap = ["link", "instructions", "form", "teleservice"]
      .filter(
        (linkType) => benefit[linkType] && typeof benefit[linkType] === "string"
      )
      .reduce((a, linkType) => {
        const link = benefit[linkType]
        a[link] = a[link] || { link, types: [] }
        a[link].types.push(linkType)

        return a
      }, {})

    const links = Object.values(linkMap).map((v: any) => {
      return {
        link: v.link,
        type: v.types.join(" / "),
      }
    })

    return {
      id: benefit.id,
      label: benefit.label,
      institution: benefit.institution.label,
      priority: priorityMap[benefit.id] || 0,
      links,
      editLink: setEditLink(benefit),
    }
  })
  return data.sort((a, b) => +(a.priority - b.priority))
}

function githubRowFormat(data) {
  const errors = data.errors.map(
    (e) => ` - [${e.type}](${e.link}) (${e.status})`
  )
  const details = `- [ ] [Modifier](${data.editLink}) ${data.label} / ${data.institution} (${data.priority} affichages)`
  return [details, ...errors].join("\n")
}

function basicFormat(data) {
  const errors = data.errors.map((e) => ` - ${e.status} ${e.type} ${e.link}`)
  const details = `- ${data.label} / ${data.institution} (${data.priority} affichages)`
  return [details, ...errors].join("\n")
}

function buildMessage(benefitWithErrors, rowFormat) {
  return `Certaines aides référencées (${
    benefitWithErrors.length
  }) ont des liens dysfonctionnels :

${benefitWithErrors.map(rowFormat).join("\n")}`
}

function buildGitHubIssueCommentText(benefitWithErrors) {
  const issueContent = `${buildMessage(benefitWithErrors, githubRowFormat)
    .split("\n")
    .join("<br />")}`

  fs.appendFileSync(
    process.env.GITHUB_OUTPUT,
    `comment=${issueContent}${os.EOL}`,
    {
      encoding: "utf8",
    }
  )
}

async function main() {
  const benefitData = await getBenefitData()
  const results = await Bluebird.map(benefitData, checkURL, { concurrency: 3 })
  const detectedErrors = results
    .filter((i) => i.errors.length)
    .sort((a, b) => -(a.priority - b.priority))
  if (detectedErrors.length > 0) {
    if (process.argv.slice(2).includes("--ci")) {
      buildGitHubIssueCommentText(detectedErrors)
    } else if (detectedErrors) {
      console.log(buildMessage(detectedErrors, basicFormat))
    }
  }
  console.log("Terminé")
}

main()
