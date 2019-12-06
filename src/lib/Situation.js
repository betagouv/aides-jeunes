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
        var individus = situation.individus
        individus = _.filter(individus, function(individu) {
            return 'enfant' !== individu.role
        })
        individus = individus.slice(0,1)
            .concat(enfants)
            .concat(individus.slice(1))
        situation.individus = individus
        return enfants
    },

    isProprietaireAvecPretEnCours(situation) {
        var isProprietaire =
            ['primo_accedant', 'proprietaire'].includes(situation.menage.statut_occupation_logement);

        return isProprietaire && situation.menage.loyer > 0;
    },

    isHebergeParticipeFrais(situation) {
        return situation.menage.statut_occupation_logement === 'loge_gratuitement'
            && situation.menage.participation_frais === true;
    },
}

export default Situation
