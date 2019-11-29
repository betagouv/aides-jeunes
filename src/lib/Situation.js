import _ from 'lodash'
import moment from 'moment'
import { categoriesRnc, patrimoineTypes } from '../constants/resources'

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

    getIndividusSortedParentsFirst: function(situation) {
        return [].concat(
            this.getDemandeur(situation),
            this.getConjoint(situation),
            this.getEnfants(situation)
        ).filter(function(individu) { return individu; });
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

    ressourcesYearMinusTwoCaptured: function(situation) {
        var yearMinusTwo = moment(situation.dateDeValeur)
            .subtract(2, 'years')
            .format('YYYY');
        var januaryYearMinusTwo = moment(situation.dateDeValeur)
            .subtract(2, 'years')
            .set('month', 0)
            .format('YYYY-MM');
        var rfr = situation.foyer_fiscal && situation.foyer_fiscal.rfr && situation.foyer_fiscal.rfr[yearMinusTwo];
        var hasYm2Ressources = this.getIndividusSortedParentsFirst(situation).some(function(individu) {
            return categoriesRnc.reduce(function(hasYm2RessourcesAccum, categorieRnc) {
                if (! individu[categorieRnc.id]) {
                    return hasYm2RessourcesAccum;
                }

                return hasYm2RessourcesAccum ||
                    typeof individu[categorieRnc.id][yearMinusTwo] == 'number' ||
                    typeof individu[categorieRnc.id][januaryYearMinusTwo] == 'number';
            }, false);
        });
        return typeof rfr == 'number' || hasYm2Ressources;
    },

    /* This function returns
     * - undefined if demandeur do not have any patrimoine ressource
     * - false if those ressources are all null else
     * - true
     */
    hasPatrimoine: function(situation) {
        var demandeur = situation.demandeur;
        return patrimoineTypes.reduce(function(accum, ressource) {
            if (! demandeur[ressource.id]) {
                return accum;
            }

            return accum || _.some(_.values(demandeur[ressource.id]));

        }, undefined);
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
