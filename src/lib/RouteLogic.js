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

function nextRoute(situation, currentRoute) {
    if (currentRoute.count) {
        return { name: 'ressources/montants', params: { role: currentRoute.individu.role, id: currentRoute.individu.id } }
    } else {
        switch (currentRoute.individu.role) {
            case 'demandeur':
                return nextDemandeurRessources(situation)
            case 'conjoint':
                return nextConjointRessources(situation)
            case 'enfant':
                // TODO multiple kids
                return '/foyer/pensions-alimentaires'
            default:
                console.log('Sorry, we are out of ' + currentRoute.individu.role + '.');
                return '/foyer/pensions-alimentaires'
        }
    }
}

function next(situation, currentRoute) {
    var result = nextRoute(situation, currentRoute)
    return result
}

const RouteLogic = {
    next
}

export default RouteLogic
