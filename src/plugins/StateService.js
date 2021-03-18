import Experimental from './ExperimentalStateService'

function full(start, situation, router) {
    const journey = Experimental.generateJourney(situation, router.currentRoute)
    journey.pop()
    return journey
}

function next(current, situation, router) {
    const journey = full(current, situation, router)
    let matches = journey.map((element, index) => { return {element, index} }).filter(item => item.element == current.fullPath)
    if (matches.length) {
         return journey[matches[matches.length - 1].index + 1]
     } else {
         const test = current.path || current
         throw new Error('Logic missing for ' + test)
     }
}

const StateService = {
  install (Vue) {

    Vue.prototype.$state = {
        full,
        next,
    }

    Vue.prototype.$push = function(situation) {
        const nexts = next(this.$route, situation || this.$store.state.situation, this.$router)
        console.log(nexts)
        this.$router.push(nexts)
    }
  }
}

export default StateService
