import ABTestingService from "@/plugins/ab-testing-service.js"
import { getEnvVariable } from "@lib/utils.js"
import { StandardBenefit } from "@data/types/benefits.d.js"

import { skipSendStatistics } from "./shared.js"
import { Matomo } from "./matomo.js"

const isProduction = process.env.NODE_ENV === "production"

export interface RecorderEvent {
  benefits: StandardBenefit[]
  benefitId?: string
  event_type: string
}

interface StatisticsRecord {
  benefit_id: string
  hash_id: string
  abtesting: object
  benefit_index: number
  page_total: number
  event_type: string
  version: string
}

function skipSendEventToRecorder(event: RecorderEvent): boolean {
  if (skipSendStatistics()) {
    return true
  }

  try {
    getEnvVariable("VITE_STATS_URL")
    getEnvVariable("VITE_STATS_VERSION")
  } catch (e) {
    return true
  }

  return event.benefits ? event.benefits.length === 0 : true
}

function identifyEvent(matomo: Matomo | undefined): string {
  return matomo !== undefined
    ? matomo.getVisitorId()
    : `uid_${Math.random().toString(12).slice(2)}`
}

export async function sendEventToRecorder(
  event: RecorderEvent,
  matomo: Matomo | undefined = undefined
): Promise<void> {
  if (skipSendEventToRecorder(event)) {
    !isProduction && console.debug("Skip sending event to recorder", event)
    return
  }

  const { benefits, benefitId, event_type } = event
  const abtesting = ABTestingService.getValues()
  const benefitsStats: StatisticsRecord[] = []
  const totalResults = benefits.length
  const eventHashId = identifyEvent(matomo)

  benefits.forEach((benefit, i) => {
    if (benefitId && benefitId !== benefit.id) {
      return
    }

    benefitsStats.push({
      benefit_id: benefit.id,
      hash_id: eventHashId,
      abtesting,
      benefit_index: i + 1,
      page_total: totalResults,
      event_type,
      version: getEnvVariable("VITE_STATS_VERSION"),
    })
  })

  const url = getEnvVariable("VITE_STATS_URL")
  const body = JSON.stringify(benefitsStats)

  try {
    await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body,
    })
  } catch (e) {
    if (e instanceof TypeError && e.message === "Failed to fetch") {
      !isProduction && console.debug("Event to recorder", event)
    } else {
      console.error(e)
    }
  }
}
