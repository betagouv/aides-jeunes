import { next, current, chapters } from "@/lib/State"

const StateService = {
  install(Vue) {
    Vue.prototype.$state = {
      next,
      current,
      chapters,
    }

    Vue.prototype.$push = function () {
      const nextStep = next(this.$route, this.$store.getters.getAllSteps)
      this.$router.push(nextStep.path).catch((failure) => {
        throw new Error(failure)
      })
    }
  },
}

export default StateService
