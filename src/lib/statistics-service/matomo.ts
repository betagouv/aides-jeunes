import { skipSendStatistics } from "./shared.js"
import { EventCategories } from "@lib/enums/event-categories.js"

const isProduction = process.env.NODE_ENV === "production"

export interface IMatomoEvent {
  category: EventCategories
  action: string
  label: string
  value?: string
}

export interface IMatomo {
  trackEvent: (
    category: EventCategories,
    action: string,
    label: string,
    value?: string
  ) => void
  getVisitorId: () => string
}

function skipSendEventToMatomo(matomo: IMatomo | undefined): boolean {
  return skipSendStatistics() || matomo === undefined
}

export function sendEventToMatomo(event: IMatomoEvent, matomo: IMatomo): void {
  if (skipSendEventToMatomo(matomo)) {
    !isProduction && console.debug("Skip sending event to Matomo", event)
    return
  }

  matomo.trackEvent(event.category, event.action, event.label, event.value)
}
