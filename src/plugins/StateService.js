import Experimental from './ExperimentalStateService'

function processBlock({journey, subject, situation, isActive}, b) {
  if (typeof(b) == 'string' || b.key) {
    journey.push({isActive, route:b.route || b, key: b.key})
  } else {
    if (!b.steps) {
      throw Error('' + b + ' (' + (b instanceof Array ? 'array' : '?') + ')')
    }
    let blockSubject = b.subject ? b.subject(subject, situation) : (subject || situation)
    const localActive = isActive && (!b.isActive || b.isActive(blockSubject, situation))
    b.steps.forEach(s => processBlock({journey, subject: blockSubject, situation, isActive: localActive}, s))
  }
}

function generateJourney(situation) {
  const blocks = Experimental.generateBlocks(situation)

  function processBlocks({situation}) {
    let journey = []
    blocks.forEach(b => {
      processBlock({journey, subject: situation, situation, isActive: true}, b)
    })
    return journey
  }
  try {
    return processBlocks({situation})
  } catch (e) {
    console.log('error', e)
  }
}

function full(start, situation) {
    const journey = generateJourney(situation)
    journey.pop()
    return journey
}

function next(current, situation) {
    const journey = full(current, situation)
    const activeJourney = journey.filter(s => s.isActive)

    let matches = activeJourney.map((element, index) => { return {element, index} }).filter(item => item.element.route == (current.fullPath || current))
    if (matches.length) {
         return activeJourney[matches[matches.length - 1].index + 1]
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
        this.$router.push(nexts.route)
    }
  }
}

export default StateService
