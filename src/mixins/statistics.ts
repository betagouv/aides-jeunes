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
      category: string,
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
  },
  data: () => ({
    BehaviourEventTypes,
  }),
}
