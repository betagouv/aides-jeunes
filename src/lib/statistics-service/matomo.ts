import { skipSendStatistics } from "./shared.js"
import { EventCategory } from "@lib/enums/event-category.js"

const isProduction = process.env.NODE_ENV === "production"

export interface MatomoEvent {
  category: EventCategory
  action: string
  label: string
  value?: string
}

export interface Matomo {
  trackEvent: (
    category: EventCategory,
    action: string,
    label: string,
    value?: string
  ) => void
  getVisitorId: () => string
}

function skipSendEventToMatomo(matomo: Matomo | undefined): boolean {
  return skipSendStatistics() || matomo === undefined
}

export function sendEventToMatomo(event: MatomoEvent, matomo: Matomo): void {
  if (skipSendEventToMatomo(matomo)) {
    !isProduction && console.debug("Skip sending event to Matomo", event)
    return
  }

  matomo.trackEvent(event.category, event.action, event.label, event.value)
}
