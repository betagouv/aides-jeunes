import { StandardBenefit } from "@data/types/benefits.d.js"
import {
  RecorderEvent,
  sendEventToRecorder,
} from "@/lib/statistics-service/recorder.js"
import {
  MatomoEvent,
  sendEventToMatomo,
} from "@/lib/statistics-service/matomo.js"
import { BehaviourEvent } from "@lib/enums/behaviour-event.js"
import { EventAction, EventCategory } from "@lib/enums/event.js"

export default {
  methods: {
    sendEventsToRecorder: function (
      benefits: StandardBenefit[] = [],
      eventAction: EventAction,
      benefitId: string | undefined = undefined
    ) {
      const event: RecorderEvent = {
        benefits,
        benefitId,
        eventAction,
      }
      sendEventToRecorder(event)
    },
    sendEventToMatomo: function (
      category: EventCategory,
      action: EventAction,
      label: string,
      value?: string
    ) {
      const event: MatomoEvent = {
        category,
        action,
        label,
        value,
      }
      sendEventToMatomo(event)
    },
    sendBenefitsStatistics: function (
      benefits: StandardBenefit[] = [],
      eventAction: EventAction,
      benefitId: string | undefined = undefined
    ) {
      this.sendEventsToRecorder(benefits, eventAction, benefitId)

      for (const benefit of benefits) {
        if (benefitId && benefit.id !== benefitId) {
          continue
        }

        this.sendEventToMatomo(EventCategory.General, eventAction, benefit.id)
      }
    },
  },
  data: () => ({
    BehaviourEvent,
  }),
}
