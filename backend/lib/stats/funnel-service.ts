import dayjs from "dayjs"
import utc from "dayjs/plugin/utc.js"

import { callMatomoAPI } from "./piwik.js"
import Followups from "../../models/followup.js"
import Simulations from "../../models/simulation.js"

const funnelInterestingPaths = {
  firstPageVisits: "/simulation/individu/demandeur/date_naissance",
  secondPageVisits: "/simulation/individu/demandeur/nationalite",
  resultsPageVisits: "/simulation/resultats",
}

dayjs.extend(utc)

const getPageVisits = (pageStats, path) => {
  const page = pageStats.find((page) => page.label === path)
  return page ? page.nb_visits : 0
}

const getMatomoVisitsData = async (
  beginRange: dayjs.Dayjs,
  endRange: dayjs.Dayjs
) => {
  const dateRange = `${beginRange.format("YYYY-MM-DD")},${endRange.format(
    "YYYY-MM-DD"
  )}`
  const piwikParameters = {
    period: "month",
    date: dateRange,
    method: "Actions.getPageUrls",
    flat: "1",
  }
  const matomoVisitsData = await callMatomoAPI(piwikParameters)
  const dateKey = beginRange.format("YYYY-MM")
  const pageStats = matomoVisitsData[dateKey]

  return Object.entries(funnelInterestingPaths).reduce(
    (visitStatsAcc, [key, path]) => {
      visitStatsAcc[key] = getPageVisits(pageStats, path)

      return visitStatsAcc
    },
    {}
  )
}

const getSimulationsData = async (
  beginRange: dayjs.Dayjs,
  endRange: dayjs.Dayjs
) => {
  const simulationCount = await Simulations.countDocuments({
    createdAt: { $gte: beginRange.toDate(), $lte: endRange.toDate() },
  })

  return {
    simulationCount,
  }
}

const getFollowupsData = async (
  beginRange: dayjs.Dayjs,
  endRange: dayjs.Dayjs
) => {
  const followupWithOptinCount = await Followups.countDocuments({
    createdAt: { $gte: beginRange.toDate(), $lte: endRange.toDate() },
    surveyOptin: true,
  })
  const followupWithoutOptinCount = await Followups.countDocuments({
    createdAt: { $gte: beginRange.toDate(), $lte: endRange.toDate() },
    surveyOptin: false,
  })
  const followupWithSurveyCount = await Followups.countDocuments({
    "surveys.createdAt": {
      $gte: beginRange.toDate(),
      $lte: endRange.toDate(),
    },
  })
  const followupWithSurveyRepliedCount = await Followups.countDocuments({
    "surveys.repliedAt": {
      $gte: beginRange.toDate(),
      $lte: endRange.toDate(),
    },
  })

  return {
    followupWithOptinCount,
    followupWithoutOptinCount,
    followupWithSurveyCount,
    followupWithSurveyRepliedCount,
  }
}

const getMatomoEventsData = async (
  beginRange: dayjs.Dayjs,
  endRange: dayjs.Dayjs
) => {
  const dateRange = `${beginRange.format("YYYY-MM-DD")},${endRange.format(
    "YYYY-MM-DD"
  )}`
  const piwikParameters = {
    period: "month",
    date: dateRange,
    method: "Events.getAction",
  }
  const matomoEventData = await callMatomoAPI(piwikParameters)
  const dateKey = beginRange.format("YYYY-MM")
  return {
    showAccompanimentCount: matomoEventData[dateKey].find(
      (d) => d.label === "show-accompaniment-link"
    )["nb_events"],
    clickAccompanimentCount: matomoEventData[dateKey].find(
      (d) => d.label === "click-accompaniment-link"
    )["nb_events"],
  }
}

function returnEmptyDataIfError(result) {
  if (result.status === "rejected") {
    console.error(result.reason)
    console.warn("Returning empty data")
    return {}
  }

  return result.value
}

const getFunnelData = async () => {
  const beginRange = dayjs().startOf("month").subtract(1, "month")
  const endRange = dayjs().startOf("month").subtract(1, "day")
  const dateKey = beginRange.format("YYYY-MM")

  const [matomoVisitsData, simulationData, followupData, matomoEventData] =
    await Promise.allSettled([
      getMatomoVisitsData(beginRange, endRange),
      getSimulationsData(beginRange, endRange),
      getFollowupsData(beginRange, endRange),
      getMatomoEventsData(beginRange, endRange),
    ]).then((results) => results.map(returnEmptyDataIfError))

  return {
    [dateKey]: {
      ...matomoVisitsData,
      ...simulationData,
      ...followupData,
      ...matomoEventData,
    },
  }
}

export default getFunnelData
