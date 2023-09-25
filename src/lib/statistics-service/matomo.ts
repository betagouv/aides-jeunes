import { skipSendStatistics } from "./shared.js"
import { EventCategory } from "@lib/enums/event-category.js"
import tracker from "@/plugins/tracker.js"

const isProduction = process.env.NODE_ENV === "production"

export interface MatomoEvent {
  category: EventCategory
  action: string
  label: string
  value?: string
}

export function sendEventToMatomo(event: MatomoEvent): void {
  if (skipSendStatistics()) {
    !isProduction && console.debug("Skip sending event to Matomo", event)
    return
  }

  tracker.trackEvent(event.category, event.action, event.label, event.value)
}
