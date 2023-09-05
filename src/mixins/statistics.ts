import { StandardBenefit } from "@data/types/benefits.d.js"
import {
  IRecorderEvent,
  sendEventToRecorder,
} from "@/lib/statistics-service/recorder.js"
import {
  IMatomoEvent,
  sendEventToMatomo,
} from "@/lib/statistics-service/matomo.js"
import { BehaviourEvent } from "@lib/enums/behaviour-event.js"
import { EventCategory } from "@lib/enums/event-categories.js"

declare global {
  interface Window {
    Piwik: {
      getTracker(): any
    }
  }
}

export default {
  methods: {
    sendEventsToRecorder: function (
      benefits: StandardBenefit[] = [],
      event_type: string,
      benefitId: string | undefined = undefined
    ) {
      const event: IRecorderEvent = {
        benefits,
        benefitId,
        event_type,
      }
      const matomoTracker = window.Piwik?.getTracker()
      if (matomoTracker) {
        sendEventToRecorder(event, matomoTracker)
      }
    },
    sendEventToMatomo: function (
      category: EventCategory,
      action: string,
      label: string,
      value?: string
    ) {
      const event: IMatomoEvent = {
        category,
        action,
        label,
        value,
      }
      const matomoTracker = window.Piwik?.getTracker()
      if (matomoTracker) {
        sendEventToMatomo(event, matomoTracker)
      }
    },
    sendBenefitsStatistics: function (
      benefits: StandardBenefit[] = [],
      event_type: string,
      benefitId: string | undefined = undefined
    ) {
      this.sendEventsToRecorder(benefits, event_type, benefitId)

      for (const benefit of benefits) {
        if (benefitId && benefit.id !== benefitId) {
          continue
        }

        this.sendEventToMatomo(EventCategory.General, event_type, benefit.id)
      }
    },
  },
  data: () => ({
    BehaviourEvent,
  }),
}
