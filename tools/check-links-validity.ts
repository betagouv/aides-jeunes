import Benefits from "../data/all.js"
import Config from "../backend/config/index.js"
import { determineOperations } from "../lib/benefits/link-validity.js"

import axios from "axios"
import https from "https"
import Bluebird from "bluebird"

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

const docId = process.env.GRIST_DOC_ID
const apiKey = process.env.GRIST_API_KEY
const baseURL = "grist.incubateur.net"
const tableId = "Veille"

const docUrl = `https://${baseURL}/api/docs/${docId}`
const recordsUrl = `${docUrl}/tables/${tableId}/records`

import { GristResponse } from "../lib/types/link-validity.js"

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
      {
        records,
      },
      gristConfig
    )
    return response.data
  },
  update: async (records) => {
    const response = await axios.put<GristResponse>(
      recordsUrl,
      {
        records,
      },
      gristConfig
    )
    return response.data
  },
}

async function main() {
  if (!docId) {
    throw new Error("Missing GRIST_DOC_ID")
  }
  if (!apiKey) {
    throw new Error("Missing GRIST_API_KEY")
  }
  const rawExistingWarnings = await Grist.get({ Corrige: [false] })
  const benefitData = await getBenefitData()
  const filteredBenefitData = benefitData.filter((benefit) => benefit.id)
  const existingWarnings = rawExistingWarnings.records.reduce((a, record) => {
    const fields = record.fields
    a[fields.Aide] = a[fields.Aide] || {}
    a[fields.Aide][fields.Type] = record
    return a
  }, {})
  const results = await Bluebird.map(filteredBenefitData, checkURL, {
    concurrency: 3,
  })

  const operationsToPerformForEachBenefit = results.map((r) =>
    determineOperations(existingWarnings, r)
  )
  const recordsByOperationTypes = {
    addition: [],
    update: [],
  }

  operationsToPerformForEachBenefit.forEach((operationsForABenefit) => {
    operationsForABenefit.forEach((operation) => {
      recordsByOperationTypes[operation.type].push(operation.record)
    })
  })
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
  console.log("Terminé")
}

main()
