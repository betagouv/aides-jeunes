import { full, next, current } from "@/lib/State"

const StateService = {
  install(Vue) {
    Vue.prototype.$state = {
      full,
      next,
      current,
    }

    Vue.prototype.$push = function (situation) {
      const nextStep = next(
        this.$route,
        situation || this.$store.state.situation,
        this.$router
      )
      this.$router.push(nextStep.path).catch((failure) => {
        throw new Error(failure)
      })
    }
  },
}

export default StateService
