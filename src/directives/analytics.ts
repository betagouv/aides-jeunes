import {
  RecorderEvent,
  sendEventToRecorder,
} from "@/lib/statistics-service/recorder.js"
import {
  MatomoEvent,
  sendEventToMatomo,
} from "@/lib/statistics-service/matomo.js"
import { EventCategory } from "@lib/enums/event-category.js"

const AnalyticsDirective = {
  beforeMount(el, binding) {
    el.myAnalyticsHandler = () => {
      const recorderEvent: RecorderEvent = {
        benefits: binding?.instance?.droits,
        benefitId: binding.value.name,
        event_type: binding.value.action,
      }

      sendEventToRecorder(recorderEvent, binding?.instance?.$matomo)

      const matomoEvent: MatomoEvent = {
        category: binding.value.category || EventCategory.Defaut,
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
