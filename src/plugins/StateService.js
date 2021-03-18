import { full, next } from '@/lib/State'

const StateService = {
  install (Vue) {

    Vue.prototype.$state = {
        full,
        next,
    }

    Vue.prototype.$push = function(situation) {
        const nextStep = next(this.$route, situation || this.$store.state.situation, this.$router)
        this.$router.push(nextStep.fullPath)
    }
  }
}

export default StateService
