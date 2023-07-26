import { BenefitType } from "@lib/types/benefits"
import {
  IRecorderEvent,
  sendEventToRecorder,
} from "@/lib/statistics-service/recorder.js"
import {
  IMatomoEvent,
  sendEventToMatomo,
} from "@/lib/statistics-service/matomo.js"
import { BehaviourEventTypes } from "@lib/enums/behaviour-event-types.js"
import { EventCategories } from "@lib/enums/event-categories.js"

export default {
  methods: {
    sendEventsToRecorder: function (
      benefits: BenefitType[] = [],
      event_type: string,
      benefitId: string | undefined = undefined
    ) {
      const event: IRecorderEvent = {
        benefits,
        benefitId,
        event_type,
      }

      sendEventToRecorder(event, this.$matomo)
    },
    sendEventToMatomo: function (
      category: EventCategories,
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

      sendEventToMatomo(event, this.$matomo)
    },
    sendBenefitsStatistics: function (
      benefits: BenefitType[] = [],
      event_type: string,
      benefitId: string | undefined = undefined
    ) {
      this.sendEventsToRecorder(benefits, event_type, benefitId)

      for (const benefit of benefits) {
        if (benefitId && benefit.id !== benefitId) {
          continue
        }

        this.sendEventToMatomo(EventCategories.GENERAL, event_type, benefit.id)
      }
    },
  },
  data: () => ({
    BehaviourEventTypes,
  }),
}
