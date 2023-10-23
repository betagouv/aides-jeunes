import { getNextStep, current, getChapters } from "@lib/state"
import { isNavigationFailure, NavigationFailureType } from "vue-router"
import { useStore } from "@/stores/index.js"
import { sendEventToMatomo } from "@/lib/statistics-service/matomo.js"
import { EventAction, EventCategory } from "@lib/enums/event.js"

const StateService = {
  install(app) {
    app.config.globalProperties.$state = {
      getNextStep,
      current,
      getChapters,
    }

    app.config.globalProperties.$push = function () {
      const store = useStore()
      const nextStep = getNextStep(this.$route, store.getAllSteps)
      store.updateCurrentAnswers(nextStep.path)
      this.$router.push(nextStep.path).catch((failure) => {
        if (isNavigationFailure(failure, NavigationFailureType.cancelled)) {
          sendEventToMatomo({
            category: EventCategory.Parcours,
            action: EventAction.NavigationAnnulee,
            label: failure.toString(),
          })
        } else {
          throw new Error(failure)
        }
      })
    }
  },
}

export default StateService
