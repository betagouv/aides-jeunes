import {
  getRequiredAdditionsAndTouchWarningsToKeep,
  getBenefitData,
} from "../lib/benefits/link-validity.js"
import { GristResponse, GristUpdate } from "../lib/types/link-validity.js"

import axios from "axios"
import https from "https"
import Bluebird from "bluebird"

// Avoid some errors due to bad tls management
const httpsAgent = new https.Agent({ rejectUnauthorized: false })

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
      {
        records,
      },
      gristConfig
    )
    return response.data
  },
  update: async (records) => {
    const response = await axios.patch<GristResponse>(
      recordsUrl,
      {
        records,
      },
      gristConfig
    )
    return response.data
  },
}

const dryRun = process.argv.includes("--dry-run")
const noPriority = process.argv.includes("--no-priority")
const benefitsFromCLI = getBenefitsFromCLI()
const pullRequestURL = determinePullRequestURL()

function getBenefitsFromCLI(): string[] | undefined {
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
    Aide: benefitsFromCLI,
  })
  const benefitData = await getBenefitData(noPriority)
  const benefitsToAnalyze = filterBenefitDataToProcess(
    benefitData,
    benefitsFromCLI,
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

  if (dryRun) {
    console.log("== recordsByOperationTypes ===>")
    console.log(JSON.stringify(recordsByOperationTypes, null, 2))
  } else {
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
