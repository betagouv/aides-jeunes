import { full, next, previous, current, max, chapters, chapterRoot } from '@/lib/State'

const StateService = {
  install (Vue) {

    Vue.prototype.$state = {
        full,
        next,
        previous,
        current,
        chapters,
        max,
        chapterRoot
    }

    Vue.prototype.$push = function(situation) {
        const nextStep = next(this.$route, situation || this.$store.state.situation, this.$router)
        this.$store.commit('addPathToUserDoneJourney', this.$route.path)
        this.$router.push(nextStep.path)
    }

    Vue.prototype.$pop = function (situation) {
        const previousStep = previous(this.$route, situation || this.$store.state.situation, this.$router)
        this.$router.push(previousStep.path)
    }
  }
}

export default StateService
