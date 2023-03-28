import { skipSendStatistics } from "./shared.js"

export interface IMatomoEvent {
  category: string
  action: string
  label: string
  value?: string
}

export interface IMatomo {
  trackEvent: (
    category: string,
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
    return console.debug("Skip sending event to Matomo", event)
  }

  matomo.trackEvent(event.category, event.action, event.label, event.value)
}
