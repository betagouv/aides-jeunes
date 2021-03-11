import _ from 'lodash'
import Individu from '@/lib/Individu'
import Ressource from '@/lib/Ressource'

function nextDemandeurRessources(situation) {
    let conjoint = situation.conjoint
    if (conjoint) {
        return { name: 'ressources/types', params: { role: 'conjoint' } }
    } else {
        return nextConjointRessources(situation)
    }
}

function nextConjointRessources(situation) {
    let enfants = situation.enfants
    if (enfants.length) {
        return '/foyer/ressources/enfants'
    } else {
        return '/foyer/pensions-alimentaires'
    }
}

function nextEnfantRessources(current, situation) {
    let enfants = situation.enfants
    const { next } = enfants.reduce((accum, enfant) => {
        if (accum.next) {
            return accum
        }

        if (accum.trigger && enfant._hasRessources) {
            accum.next = { name: 'ressources/types', params: { role: 'enfant', id: enfant.id } }
            return accum
        }

        if (enfant.id === current.params.id) {
            accum.trigger = true
        }
        return accum
    }, { trigger: false, next: undefined })

    return next || '/foyer/pensions-alimentaires'
}

function nextRessourceRoute(current, situation) {
    switch (current.params.role) {
        case 'demandeur':
            return nextDemandeurRessources(situation)
        case 'conjoint':
            return nextConjointRessources(situation)
        case 'enfant':
            return nextEnfantRessources(current, situation)
        default:
            return '/foyer/pensions-alimentaires'
    }
}

function next(current, situation) {
    switch (current.path || current) {
        case '/':
            return '/foyer/demandeur'
        case '/foyer/demandeur':
            return '/foyer/enfants'
        case '/foyer/enfants':
            return '/foyer/conjoint'
        case '/foyer/enfants/ajouter':
            return '/foyer/enfants'
        case '/foyer/conjoint':
            return '/foyer/logement'
        case '/foyer/logement':
            return { name: 'ressources/types', params: {role: 'demandeur', id: undefined}}
        case '/foyer/pensions-alimentaires':
        case '/foyer/extra-pole-emploi':
        case '/foyer/ressources/fiscales':
        case '/foyer/ressources/patrimoine':
        case '/foyer/resultat':
            return '/foyer/resultat'
        case '/foyer/ressources/enfants':
        {
            let enfants = situation.enfants
            const { next } = enfants.reduce((accum, enfant) => {
              if (accum.next) {
                return accum
              }

              if (enfant._hasRessources) {
                accum.next = { name: 'ressources/types', params: { role: 'enfant', id: enfant.id } }
              }

              return accum
            }, { next: undefined })
            return next || '/foyer/pensions-alimentaires'
        } 
        default:
            switch (current.name) {
                case 'enfants/modifier':
                    return '/foyer/enfants'
                case 'ressources/types':
                    if (situation) {
                        let individu = Individu.find(situation, current.params.role, current.params.id)
                        if (!individu) {
                            return nextRessourceRoute(current, situation)
                        }
                        let selectedTypes = Ressource.getIndividuRessourceTypes(individu)
                        const count = _.filter(selectedTypes).length
                        if (count) {
                            return { name: 'ressources/montants', params: current.params }
                        } else {
                            return nextRessourceRoute(current, situation)
                        }
                    } else {
                        return { name: 'ressources/montants', params: current.params }
                    }
                case 'ressources/montants':
                    return nextRessourceRoute(current, situation)
                default:
                    throw 'No route for ' + JSON.stringify({path: current.path, name: current.name, params: current.params})
            }
    }
}

function areSimilar(a, b) {
    const res = a === b || (a.path && b.path && a.path === b.path) || (a.name && b.name && a.name === b.name && a.params === b.params)
    return res
}

function full(start, situation) {
    let steps = [start]
    let nextStep = next(steps[steps.length-1], situation)
    while (! areSimilar(steps[steps.length-1], nextStep)) {
        steps.push(nextStep)
        nextStep = next(steps[steps.length-1], situation)
    }

    steps.shift()
    return steps
}

const StateService = {
  install (Vue) {

    Vue.prototype.$state = {
        full,
        next,
    }

    Vue.prototype.$push = function(situation) {
        this.$router.push(next(this.$route, situation))
    }
  }
}

export default StateService
