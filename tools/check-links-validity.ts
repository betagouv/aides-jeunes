import Benefits from "../data/all.js"
import config from "../backend/config/index.js"
import { getRequiredAdditionsAndTouchWarningsToKeep } from "../lib/benefits/link-validity.js"
import { GristResponse, GristUpdate } from "../lib/types/link-validity.js"

import axios from "axios"
import https from "https"
import Bluebird from "bluebird"

// Avoid some errors due to bad tls management
const httpsAgent = new https.Agent({ rejectUnauthorized: false })

const customBenefitsFiles = [
  {
    pattern: /-fsl-eligibilite$/,
    file: `${config.github.repository_url}/blob/master/data/benefits/dynamic/fsl.ts`,
  },
  {
    pattern: /-apa-eligibilite$/,
    file: `${config.github.repository_url}/blob/master/data/benefits/dynamic/apa.ts`,
  },
  {
    pattern: /^aidesvelo_/,
    file: `https://github.com/mquandalle/mesaidesvelo/blob/master/src/aides.yaml`,
  },
]

function setEditLink(benefit) {
  for (const category of customBenefitsFiles) {
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

async function getBenefitData(noPriority: boolean) {
  const priorityMap = noPriority ? {} : await getPriorityStats()

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

const docId = process.env.GRIST_DOC_ID
const apiKey = process.env.GRIST_API_KEY
const baseURL = "grist.incubateur.net"
const tableId = "Veille"

const docUrl = `https://${baseURL}/api/docs/${docId}`
const recordsUrl = `${docUrl}/tables/${tableId}/records`

const gristConfig = {
  headers: {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
  },
}

const Grist = {
  get: async (filter?: any) => {
    let url = recordsUrl
    if (filter) {
      url += "?filter=" + JSON.stringify(filter)
    }
    const response = await axios.get<GristResponse>(url, gristConfig)
    return response.data
  },
  add: async (records) => {
    const response = await axios.post<GristResponse>(
      recordsUrl,
      { records },
      gristConfig
    )
    return response.data
  },
  update: async (records) => {
    const response = await axios.patch<GristResponse>(
      recordsUrl,
      { records },
      gristConfig
    )
    return response.data
  },
}

const dryRun = process.argv.includes("--dry-run")
const noPriority = process.argv.includes("--no-priority")
const benefitIdsFromCLI = getBenefitIdsFromCLI()
const pullRequestURL = determinePullRequestURL()

function getBenefitIdsFromCLI(): string[] | undefined {
  if (process.argv.includes("--only")) {
    return process.argv.slice(process.argv.indexOf("--only") + 1)
  }
}

function determinePullRequestURL() {
  if (!process.env.GITHUB_REF) {
    return
  }
  const { GITHUB_REF, GITHUB_REPOSITORY, GITHUB_SERVER_URL } = process.env
  const pullRequestNumber = GITHUB_REF.match(
    /(?:refs\/pull\/)(?<number>[\d]+)\/merge/
  )?.groups?.number
  return `${GITHUB_SERVER_URL}/${GITHUB_REPOSITORY}/pull/${pullRequestNumber}`
}

function filterBenefitDataToProcess(
  benefitData,
  ...benefitLimitations: (string[] | undefined)[]
) {
  let subset = benefitData
  benefitLimitations.forEach((ids) => {
    if (!ids) {
      return
    }
    subset = subset.filter((benefit) => ids.includes(benefit.id))
  })
  return subset
}

async function main() {
  if (!docId) {
    throw new Error("Missing GRIST_DOC_ID")
  }
  if (!apiKey) {
    throw new Error("Missing GRIST_API_KEY")
  }
  const rawExistingWarnings = await Grist.get({
    Corrige: [false],
    Aide: benefitIdsFromCLI,
  })
  const benefitData = await getBenefitData(noPriority)

  const benefitsToAnalyze = filterBenefitDataToProcess(
    benefitData,
    benefitIdsFromCLI,
    pullRequestURL
      ? rawExistingWarnings.records.map((r) => r.fields.Aide)
      : undefined
  )

  const existingWarnings = rawExistingWarnings.records.reduce((a, record) => {
    const fields = record.fields
    a[fields.Aide] = a[fields.Aide] || {}
    a[fields.Aide][fields.Type] = record
    return a
  }, {})

  const results = await Bluebird.map(benefitsToAnalyze, checkURL, {
    concurrency: 3,
  })

  type recordsByOperationTypesType = { [operationType: string]: GristUpdate[] }
  const recordsByOperationTypes: recordsByOperationTypesType = {
    addition: [],
    update: [],
  }

  const additionsByBenefit = results.map((linkCheckResult) =>
    getRequiredAdditionsAndTouchWarningsToKeep(
      existingWarnings,
      linkCheckResult
    )
  )

  const untouchedWarnings = rawExistingWarnings.records.filter((r) => !r.keep)
  if (pullRequestURL) {
    untouchedWarnings.forEach((record) => {
      if (!record.fields.PR) {
        return
      }
      recordsByOperationTypes.update.push({
        id: record.id,
        fields: { PR: pullRequestURL },
      })
    })
  } else {
    additionsByBenefit.forEach((additionsForABenefit) => {
      additionsForABenefit.forEach((recordToAdd) => {
        recordsByOperationTypes.addition.push(recordToAdd)
      })
    })
    untouchedWarnings.forEach((record) => {
      recordsByOperationTypes.update.push({
        id: record.id,
        fields: { Corrige: true },
      })
    })
  }

  console.log("== recordsByOperationTypes ==")
  console.log(JSON.stringify(recordsByOperationTypes, null, 2))
  if (!dryRun) {
    try {
      if (recordsByOperationTypes.addition.length) {
        await Grist.add(recordsByOperationTypes.addition)
      }
      if (recordsByOperationTypes.update.length) {
        await Grist.update(recordsByOperationTypes.update)
      }
    } catch (e) {
      console.log(e)
    }
  }
  console.log("Terminé")
}

main()
