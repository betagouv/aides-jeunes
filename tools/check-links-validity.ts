import Benefits from "../data/all.js"
import { determineOperationsOnBenefitLinkError } from "../lib/benefits/link-validity.js"
import { GristData } from "../lib/types/link-validity.js"
import { Grist } from "../lib/grist.js"
import Mattermost from "../backend/lib/mattermost-bot/mattermost.js"

import axios from "axios"
import https from "https"
import Bluebird from "bluebird"
import * as Sentry from "@sentry/node"
import dayjs from "dayjs"

const DEFAULT_BRANCH_REF = "refs/heads/main"

// Avoid some errors due to bad tls management
const httpsAgent = new https.Agent({ rejectUnauthorized: false })

async function checkBenefitUrls(benefit) {
  const results = await Bluebird.map(benefit.links, fetchStatus)
  console.log(
    `${benefit.label} (${benefit.institution})\n${results
      .map((e) => (e.ok ? `- ✅ ${e.type}` : `- ❌ ${e.type} ${e.link}`))
      .join("\n")}`
  )
  return benefit
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
  const lastMonth: string = dayjs().subtract(1, "month").format("YYYY-MM-DD")
  const stats = await axios
    .get(
      `https://aides-jeunes-stats-recorder.osc-fr1.scalingo.io/benefits?startAt=${lastMonth}`
    )
    .then((response) => response.data)

  return stats.reduce((priorityMap, benefitStatsEvent) => {
    const benefitId: string = benefitStatsEvent.id
    const priority: number = benefitStatsEvent.events.showDetails

    if (priority) {
      priorityMap[benefitId] = priority
    }

    return priorityMap
  })
}

async function getBenefitData(noPriority: boolean) {
  let priorityMap = {}
  try {
    priorityMap = noPriority ? {} : await getPriorityStats()
  } catch (error) {
    console.error(error)
    Sentry.captureException(error)
    console.warn("Unable to get priority stats, priorityMap is empty")
  }

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
    }
  })
  return data.sort((a, b) => +(a.priority - b.priority))
}

const dryRun = process.argv.includes("--dry-run")
const noPriority = process.argv.includes("--no-priority")
const benefitIdsFromCLI = getBenefitIdsFromCLI()
const pullRequestURL = determinePullRequestURL()
const processingPR = Boolean(pullRequestURL)

function getBenefitIdsFromCLI(): string[] | undefined {
  if (process.argv.includes("--only")) {
    return process.argv.slice(process.argv.indexOf("--only") + 1)
  }
}

function determinePullRequestURL() {
  if (
    !process.env.GITHUB_REF ||
    process.env.GITHUB_REF === DEFAULT_BRANCH_REF
  ) {
    return
  }
  const { GITHUB_REF, GITHUB_REPOSITORY, GITHUB_SERVER_URL } = process.env

  console.log("determinePullRequestURL", { GITHUB_REF })

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
  if (!process.env.GRIST_DOC_ID) {
    throw new Error("Missing GRIST_DOC_ID")
  }
  if (!process.env.GRIST_API_KEY) {
    throw new Error("Missing GRIST_API_KEY")
  }
  const gristAPI = Grist(process.env.GRIST_DOC_ID, process.env.GRIST_API_KEY)

  const user = await gristAPI.me()
  console.log(`Connected as ${user.name}.`)

  const rawExistingWarnings = await gristAPI.get({
    Corrige: [false],
    Aide: benefitIdsFromCLI,
  })
  const benefitData = await getBenefitData(noPriority)
  const benefitsToAnalyze = filterBenefitDataToProcess(
    benefitData,
    benefitIdsFromCLI,
    processingPR
      ? rawExistingWarnings.records.map((r) => r.fields.Aide)
      : undefined
  )

  const existingWarnings = rawExistingWarnings.records.reduce((a, record) => {
    const fields = record.fields
    a[fields.Aide] = a[fields.Aide] || {}
    a[fields.Aide][fields.Type] = record
    return a
  }, {})

  const benefitLinksCheckResults = await Bluebird.map(
    benefitsToAnalyze,
    checkBenefitUrls,
    {
      concurrency: 3,
    }
  )

  const benefitOperationsList = benefitLinksCheckResults.map(
    (benefitLinksCheckResult) =>
      determineOperationsOnBenefitLinkError(
        existingWarnings,
        benefitLinksCheckResult,
        pullRequestURL
      )
  )
  type RecordsByOperationTypesType = { [operationType: string]: GristData[] }
  const recordsByOperationTypes: RecordsByOperationTypesType = {
    add: [],
    update: [],
  }

  benefitOperationsList.forEach((operations) => {
    operations.forEach(({ type, data }) => {
      recordsByOperationTypes[type].push(data)
    })
  })

  console.log("== recordsByOperationTypes ==")
  console.log(JSON.stringify(recordsByOperationTypes, null, 2))
  if (!dryRun) {
    try {
      if (recordsByOperationTypes.add.length) {
        await gristAPI.add(recordsByOperationTypes.add)
      }
      if (recordsByOperationTypes.update.length) {
        await gristAPI.update(recordsByOperationTypes.update)
      }
    } catch (e) {
      console.log(e)
    }
  }
  console.log("Terminé")

  // Notify on mattermost
  const invalidLinksAdded = recordsByOperationTypes.add.length > 0

  if (invalidLinksAdded && !dryRun && !processingPR) {
    const text = [
      ":icon-info: La liste des aides avec des liens invalides a été mise à jour ici : [lien](https://grist.incubateur.net/o/docs/mRipN1JbV6sB/Aides-Jeunes/p/39)",
      `Ajout: ${recordsByOperationTypes.add.length}`,
      `Mise à jour: ${recordsByOperationTypes.update.length}`,
    ].join("\n")

    Mattermost.post(text, process.env.MATTERMOST_ALERTING_URL)
  }
}

main()
