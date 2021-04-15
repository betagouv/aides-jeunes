import { full, next, current, chapters, chapterRoot } from '@/lib/State'
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
        const currentStep = current(this.$route.path, situation || this.$store.state.situation)
        if (currentStep)
            this.$store.dispatch('addPathToUserJourney', currentStep.path)
        const nextStep = next(this.$route, situation || this.$store.state.situation, this.$router)
        this.$router.push(nextStep.path)
    }

    Vue.prototype.$pop = function (situation) {
        const previousStep = previous(this.$route, situation || this.$store.state.situation, this.$router)
        this.$store.dispatch('addPathToUserJourney', previousStep.path)
        this.$router.push(previousStep.path)
    }
  }
}

export default StateService
