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
  const followupSendingStats = await Followups.aggregate([
    {
      $match: {
        createdAt: { $gte: beginRange.toDate(), $lte: endRange.toDate() },
      },
    },
    {
      $group: {
        _id: {
          surveyOptin: "$surveyOptin",
          hasPhone: {
            $cond: {
              if: { $ifNull: ["$smsMessageId", false] },
              then: true,
              else: false,
            },
          },
          hasEmail: {
            $cond: {
              if: { $ifNull: ["$messageId", false] },
              then: true,
              else: false,
            },
          },
        },
        count: { $sum: 1 },
      },
    },
    {
      $group: {
        _id: null,
        followupWithOptinCount: {
          $sum: {
            $cond: [{ $eq: ["$_id.surveyOptin", true] }, "$count", 0],
          },
        },
        followupWithoutOptinCount: {
          $sum: {
            $cond: [{ $eq: ["$_id.surveyOptin", false] }, "$count", 0],
          },
        },
        followupWithOptinCountSms: {
          $sum: {
            $cond: [
              {
                $and: [
                  { $eq: ["$_id.surveyOptin", true] },
                  { $eq: ["$_id.hasPhone", true] },
                  { $eq: ["$_id.hasEmail", false] },
                ],
              },
              "$count",
              0,
            ],
          },
        },
        followupWithoutOptinCountSms: {
          $sum: {
            $cond: [
              {
                $and: [
                  { $eq: ["$_id.surveyOptin", false] },
                  { $eq: ["$_id.hasPhone", true] },
                  { $eq: ["$_id.hasEmail", false] },
                ],
              },
              "$count",
              0,
            ],
          },
        },
        followupWithOptinCountEmail: {
          $sum: {
            $cond: [
              {
                $and: [
                  { $eq: ["$_id.surveyOptin", true] },
                  { $eq: ["$_id.hasPhone", false] },
                  { $eq: ["$_id.hasEmail", true] },
                ],
              },
              "$count",
              0,
            ],
          },
        },
        followupWithoutOptinCountEmail: {
          $sum: {
            $cond: [
              {
                $and: [
                  { $eq: ["$_id.surveyOptin", false] },
                  { $eq: ["$_id.hasPhone", false] },
                  { $eq: ["$_id.hasEmail", true] },
                ],
              },
              "$count",
              0,
            ],
          },
        },
        followupWithOptinCountEmailAndSms: {
          $sum: {
            $cond: [
              {
                $and: [
                  { $eq: ["$_id.surveyOptin", true] },
                  { $eq: ["$_id.hasPhone", true] },
                  { $eq: ["$_id.hasEmail", true] },
                ],
              },
              "$count",
              0,
            ],
          },
        },
        followupWithoutOptinCountEmailAndSms: {
          $sum: {
            $cond: [
              {
                $and: [
                  { $eq: ["$_id.surveyOptin", false] },
                  { $eq: ["$_id.hasPhone", true] },
                  { $eq: ["$_id.hasEmail", true] },
                ],
              },
              "$count",
              0,
            ],
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
        followupWithOptinCount: 1,
        followupWithoutOptinCount: 1,
        followupWithOptinCountSms: 1,
        followupWithoutOptinCountSms: 1,
        followupWithOptinCountEmail: 1,
        followupWithoutOptinCountEmail: 1,
        followupWithOptinCountEmailAndSms: 1,
        followupWithoutOptinCountEmailAndSms: 1,
      },
    },
  ]).exec()

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
    ...followupSendingStats[0],
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
