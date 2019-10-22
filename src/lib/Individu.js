import moment from 'moment'
import _ from 'lodash'


import Situation from './Situation'


function isRoleParent (role) {
    return _.includes(['demandeur', 'conjoint'], role);
}

function ressourceHeader(individu) {
    switch (individu.role) {
    case 'demandeur':
        return 'Vos ressources personnelles uniquement';
    case 'conjoint':
        return 'Les ressources de votre conjoint·e';
    default:
        return 'Les ressources de ' + individu.firstName;
    }
}

function findIndividu(individus, role, id) {
    // In case of "demandeur" or "conjoint", the role is sufficient
    var predicate = { role: role };

    // For children, we also need to match the id
    if (role === 'enfant' && id) {
        predicate = _.assign(predicate, { id: id });
    }

    return _.find(individus, predicate);
}

function get(individus, role, id) {
    var DEFAULT_INDIVIDU = {
        id: role,
        aah_restriction_substantielle_durable_acces_emploi: true,
        ass_precondition_remplie: false,
        duree_possession_titre_sejour: 25,
        echelon_bourse: -1,
        enfant_a_charge: {},
        enfant_place: false,
        gir: 'gir_6',
        nationalite: 'FR',
        role: role,
        scolarite: 'college',
        taux_incapacite: 0.9,
        tns_autres_revenus_type_activite: 'bic',
        tns_micro_entreprise_type_activite: 'bic',
        tns_auto_entrepreneur_type_activite: 'bic',
        specificSituations: []
    };
    // By default enfants are `à charge fiscale`, adults are not.
    // TODO ?
    //DEFAULT_INDIVIDU.enfant_a_charge[$scope.currentYear] = (role == 'enfant');

    // Required on DEFAULT_INDIVIDU to properly restore statut_marital
    if (DEFAULT_INDIVIDU.role == 'conjoint') {
        DEFAULT_INDIVIDU.statut_marital = 'marie';  // Marié(e)
    }

    var existingIndividu =  findIndividu(individus, role, id);
    var individu = _.assign({}, _.cloneDeep(DEFAULT_INDIVIDU), _.cloneDeep(existingIndividu));
    var enfants = Situation.getEnfants({individus})

    if (role == 'enfant' && !existingIndividu) {

        var nextEnfantCount = enfants.length + 1;
        individu.firstName = 'Votre ' + nextEnfantCount + (nextEnfantCount === 1 ? 'ᵉʳ' : 'ᵉ' ) + ' enfant';

        var usedIds = enfants.map(function(enfant) { return enfant.id; });
        var count = 0;
        while (_.indexOf(usedIds, 'enfant_' + count) >= 0) {
            count = count + 1;
        }
        individu.id = 'enfant_' + count;
    }

    return {
        existingIndividu: Boolean(existingIndividu),
        individu,
    }
}

const Individu = {
    age: function(individu, dateDeReference) {
        return moment(dateDeReference).diff(individu.date_naissance, 'years');
    },

    label: function(individu) {
        if ('demandeur' === individu.role) {
            return 'Vous';
        }

        if ('conjoint' === individu.role) {
            return 'Votre conjoint·e';
        }

        return individu.firstName;
    },
    get: get,
    ressourceHeader: ressourceHeader,

    ressourceShortLabel: function(individu) {
        switch (individu.role) {
        case 'demandeur':
            return 'Vos ressources';
        default:
            return ressourceHeader(individu);
        }
    },

    nationaliteLabel: function(individu) {
        return 'TODO' + individu.id;//NationaliteService.getLabel(individu.nationalite);
    },

    isRoleParent: isRoleParent,

    isParent: function(individu) {
        return isRoleParent(individu.role);
    },

    formatStatutsSpecifiques: function(individu) {
        var statuts = [];
        /*specificSituations.forEach(function(statut) {
            if (individu.specificSituations && individu.specificSituations.indexOf(statut.id) >= 0) {
                statuts.push(statut.label);
            }
        });//*/

        if (individu.enceinte) {
            statuts.push('enceinte');
        }

        if (individu.boursier) {
            statuts.push('boursier');
        }

        if (individu.garde_alternee) {
            statuts.push('en garde alternée');
        }

        //TODO statuts = _.map(statuts, $filter('lowercaseFirst'));
        statuts = statuts.join(', ');
        //TODO statuts = $filter('uppercaseFirst')(statuts);
        return 'TODO' //statuts;
    }
}

export default Individu
