import { next, current, chapters } from "@lib/state"
import { isNavigationFailure, NavigationFailureType } from "vue-router"
import { useStore } from "@/stores/index.ts"

const StateService = {
  install(app) {
    app.config.globalProperties.$state = {
      next,
      current,
      chapters,
    }

    app.config.globalProperties.$push = function () {
      const store = useStore()
      const nextStep = next(this.$route, store.getAllSteps)
      store.updateCurrentAnswers(nextStep.path)
      this.$router.push(nextStep.path).catch((failure) => {
        if (isNavigationFailure(failure, NavigationFailureType.cancelled)) {
          this.$matomo?.trackEvent(
            "Parcours",
            "Navigation cancelled",
            failure.toString()
          )
        } else {
          throw new Error(failure)
        }
      })
    }
  },
}

export default StateService
