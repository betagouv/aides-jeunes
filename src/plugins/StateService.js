import { nextUnansweredStep, current, chapters } from "@/lib/State"
import VueRouter from "vue-router"

const StateService = {
  install(Vue) {
    Vue.prototype.$state = {
      nextUnansweredStep,
      current,
      chapters,
    }

    Vue.prototype.$push = function () {
      const nextStep = nextUnansweredStep(
        this.$store.state,
        this.$store.getters
      )
      this.$store.dispatch("updateCurrentAnswers", nextStep.path)
      this.$router.push(nextStep.path).catch((failure) => {
        if (
          VueRouter.isNavigationFailure(
            failure,
            VueRouter.NavigationFailureType.cancelled
          )
        ) {
          this.$matomo &&
            this.$matomo.trackEvent(
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
