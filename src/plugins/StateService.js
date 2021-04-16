import { full, next, current, chapters, chapterRoot } from '@/lib/State'

const StateService = {
  install (Vue) {

    Vue.prototype.$state = {
        full,
        next,
        current,
        chapters,
        chapterRoot
    }

    Vue.prototype.$push = function(situation) {
        const nextStep = next(this.$route, situation || this.$store.state.situation, this.$router)
        this.$router.push(nextStep.path)
    }
  }
}

export default StateService
