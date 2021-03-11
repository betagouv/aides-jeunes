import _ from 'lodash'

const Situation = {
    getDemandeur: function(situation) {
        return situation.demandeur
    },

    getConjoint: function(situation) {
        return situation.conjoint
    },

    getEnfants: function(situation) {
        return situation.enfants
    },

    hasEnfantScolarise: function(situation) {
        return _.some(situation.enfants, { scolarite: 'college' }) || _.some(situation.enfants, { scolarite: 'lycee' });
    },

    setEnfants: function(situation, enfants) {
        let individus = situation.individus
        individus = _.filter(individus, function(individu) {
            return 'enfant' !== individu._role
        })
        individus = individus.slice(0,1)
            .concat(enfants)
            .concat(individus.slice(1))
        situation.individus = individus
        return enfants
    },
}

export default Situation
