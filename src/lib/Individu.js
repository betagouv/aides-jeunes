import { specificSituations } from '@/constants/specificSituations'
import moment from 'moment'
import _ from 'lodash'

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

function find(situation, role, id) {
    if (role === 'enfant' && id) {
        return _.find(situation.enfants, { id: id })
    }

    return situation[role]
}

function getDemandeur() {
    return get([], 'demandeur').individu
}

function getConjoint() {
    return get([], 'conjoint').individu
}

function get(individus, role, id, dates) {
    let DEFAULT_INDIVIDU = {
        id: role,
        aah_restriction_substantielle_durable_acces_emploi: true,
        ass_precondition_remplie: false,
        date_naissance: undefined,
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
        salaire_journalier_reference: 0,
        temps_travail_semaine: 0,
    };

    specificSituations.forEach(s => {
        DEFAULT_INDIVIDU[s.id] = false
    })

    // By default enfants are `à charge fiscale`, adults are not.
    if (DEFAULT_INDIVIDU.role == 'enfant' && dates && dates.thisYear) {
        DEFAULT_INDIVIDU.enfant_a_charge[dates.thisYear.id] = true
    }

    // Required on DEFAULT_INDIVIDU to properly restore statut_marital
    if (DEFAULT_INDIVIDU.role == 'conjoint') {
        DEFAULT_INDIVIDU.statut_marital = 'marie';  // Marié(e)
    }

    let existingIndividu = find(individus, role, id);
    let individu = _.assign({}, _.cloneDeep(DEFAULT_INDIVIDU), _.cloneDeep(existingIndividu));

    if (role == 'enfant' && !existingIndividu) {

        let nextEnfantCount = individus.length + 1;
        individu.firstName = 'votre ' + nextEnfantCount + (nextEnfantCount === 1 ? 'ᵉʳ' : 'ᵉ' ) + ' enfant';

        let usedIds = individus.map(function(enfant) { return enfant.id; });
        let count = 0;
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
            return 'vous';
        }

        if ('conjoint' === individu.role) {
            return 'votre conjoint·e';
        }

        return individu.firstName;
    },
    find,
    get,
    getDemandeur,
    getConjoint,
    ressourceHeader,

    ressourceShortLabel: function(individu) {
        switch (individu.role) {
        case 'demandeur':
            return 'vos ressources';
        default:
            return ressourceHeader(individu);
        }
    },

    nationaliteLabel: function(individu) {
        return 'TODO2' + individu.id;//NationaliteService.getLabel(individu.nationalite);
    },

    isRoleParent,

    isParent: function(individu) {
        return isRoleParent(individu.role);
    },

    formatStatutsSpecifiques: function(individu) {
        let statuts = [];
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

        //TODO3 statuts = _.map(statuts, $filter('lowercaseFirst'));
        statuts = statuts.join(', ');
        //TODO3 statuts = $filter('uppercaseFirst')(statuts);
        return 'TODO3' //statuts;
    }
}

export default Individu
