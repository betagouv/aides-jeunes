import {
  IRecorderEvent,
  sendEventToRecorder,
} from "@/lib/statistics-service/recorder.js"
import {
  IMatomoEvent,
  sendEventToMatomo,
} from "@/lib/statistics-service/matomo.js"
import { EventCategories } from "@lib/enums/event-categories.ts"

const AnalyticsDirective = {
  beforeMount(el, binding) {
    el.myAnalyticsHandler = () => {
      const recorderEvent: IRecorderEvent = {
        benefits: binding?.instance?.droits,
        benefitId: binding.value.name,
        event_type: binding.value.action,
      }

      sendEventToRecorder(recorderEvent, binding?.instance?.$matomo)

      const matomoEvent: IMatomoEvent = {
        category: binding.value.category || EventCategories.DEFAUT,
        action: binding.value.action,
        label: binding.value.name,
        value: binding.value.value,
      }

      sendEventToMatomo(matomoEvent, binding?.instance?.$matomo)
    }
    el.addEventListener("click", el.myAnalyticsHandler)
  },
  unmounted(el) {
    el.removeEventListener("click", el.myAnalyticsHandler)
  },
}

export default AnalyticsDirective
