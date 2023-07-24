import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
import mongoose from "mongoose"

import { callMatomoAPI } from "./piwik.js"
import mongooseConfig from "../../config/mongoose.js"
import config from "../../config/index.js"
import Followup from "../../models/followup.js"
import Simulation from "../../models/simulation.js"

mongooseConfig(mongoose, config)

dayjs.extend(utc)

const getMatomoVisitsData = async (
  beginRange: dayjs.Dayjs,
  endRange: dayjs.Dayjs
) => {
  const dateRange = `${beginRange.format("YYYY-MM-DD")},${endRange.format(
    "YYYY-MM-DD"
  )}`
  const piwikparamsInterface = {
    period: "month",
    date: dateRange,
  }
  const matomoVisitsData = await callMatomoAPI(piwikparamsInterface)
  const dateKey = beginRange.format("YYYY-MM")
  return {
    visits: matomoVisitsData[dateKey].nb_visits,
    nbUniqVisitors: matomoVisitsData[dateKey].nb_uniq_visitors,
  }
}

const getSimulationsData = async (
  beginRange: dayjs.Dayjs,
  endRange: dayjs.Dayjs
) => {
  const simulationCount = await Simulation.countDocuments({
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
  const followupWithOptinCount = await Followup.countDocuments({
    createdAt: { $gte: beginRange.toDate(), $lte: endRange.toDate() },
    surveyOptin: true,
  })
  const followupWithoutOptinCount = await Followup.countDocuments({
    createdAt: { $gte: beginRange.toDate(), $lte: endRange.toDate() },
    surveyOptin: false,
  })
  const followupWithSurveyCount = await Followup.countDocuments({
    "surveys.createdAt": {
      $gte: beginRange.toDate(),
      $lte: endRange.toDate(),
    },
  })
  const followupWithSurveyRepliedCount = await Followup.countDocuments({
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
  const piwikparamsInterface = {
    period: "month",
    date: dateRange,
    method: "Events.getAction",
  }
  const matomoEventData = await callMatomoAPI(piwikparamsInterface)
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

  await mongoose.connection.close()

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
