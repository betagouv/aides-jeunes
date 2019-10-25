import Situation from '@/lib/Situation'

function nextDemandeurRessources(situation) {
    let conjoint = Situation.getConjoint(situation)
    if (conjoint) {
        return { name: 'ressources/types', params: { role: 'conjoint' } }
    } else {
        return nextConjointRessources(situation)
    }
}

function nextConjointRessources(situation) {
    let enfants = Situation.getEnfants(situation)
    if (enfants.length) {
        return '/foyer/ressources/enfants'
    } else {
        return '/foyer/pensions-alimentaires'
    }
}

function nextEnfantRessources(situation, current) {
    let enfants = Situation.getEnfants(situation)
    const { next } = enfants.reduce((accum, enfant) => {
        if (accum.next) {
            return
        }

        if (accum.trigger && enfant.hasRessources) {
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

function nextRoute(situation, current) {
    switch (current.params.role) {
        case 'demandeur':
            return nextDemandeurRessources(situation)
        case 'conjoint':
            return nextConjointRessources(situation)
        case 'enfant':
            return nextEnfantRessources(situation, current)
        default:
            return '/foyer/pensions-alimentaires'
    }
}

function next(situation, current) {
    var result = nextRoute(situation, current)
    return result
}

const RouteLogic = {
    next
}

export default RouteLogic
