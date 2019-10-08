import _ from 'lodash'
import moment from 'moment'

const Situation = {
    YAMLRepresentation: function(sourceSituation) {
        var situation = _.cloneDeep(sourceSituation);
        situation.dateDeValeur = moment(new Date(situation.dateDeValeur)).format('YYYY-MM-DD');
        situation.individus.forEach(function(individu) {
            DATE_FIELDS.forEach(function(dateField) {
                if (individu[dateField]) {
                    individu[dateField] = individu[dateField].format('YYYY-MM-DD');
                }
            });

            delete individu.hasRessources;
        });
        return 'TODO'//jsyaml.dump(_.omit(situation, ['__v', 'modifiedFrom', 'status', 'token', 'version']));
    },

    /**
    *@param    {String}  A situation model to send to the backend
    *@return   {String}  A boolean indicating whether the situation looks ready for OpenFisca or not
    */
    passSanityCheck: function(situation) {
        return situation.individus && situation.individus.length > 0;
    },

    getDemandeur: function(situation) {
        return _.find(situation.individus, { role: 'demandeur' });
    },

    getConjoint: function(situation) {
        return _.find(situation.individus, { role: 'conjoint' });
    },

    getEnfants: function(situation) {
        return _.filter(situation.individus, { role: 'enfant' });
    },

    getIndividusSortedParentsFirst: function(situation) {
        return [].concat(
            this.getDemandeur(situation),
            this.getConjoint(situation),
            this.getEnfants(situation)
        ).filter(function(individu) { return individu; });
    },

    hasEnfantScolarise: function(situation) {
        return _.some(situation.individus, { role: 'enfant', scolarite: 'college' }) || _.some(situation.individus, { role: 'enfant', scolarite: 'lycee' });
    },

    hasEnfant: function(situation) {
        return _.some(situation.individus, { role: 'enfant' });
    },

    getYearMinusTwo: function(situation) {
        return moment(situation.dateDeValeur).subtract(2, 'years').format('YYYY');
    },

    setConjoint: function(situation, conjoint) {
        var individus = situation.individus;
        // si le conjoint existait déjà avant, on l'écrase
        if (this.getConjoint(situation)) {
            individus[individus.length - 1] = conjoint;
        } else {
            // on insère le conjoint en dernier dans la liste des individus
            individus.push(conjoint);
        }
    },

    setEnfants: function(situation, enfants) {
        var individus = situation.individus;
        individus = _.filter(individus, function(individu) {
            return 'enfant' !== individu.role;
        });
        individus = individus.slice(0,1)
            .concat(enfants)
            .concat(individus.slice(1));
        situation.individus = individus;
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
        var hasYm2Ressources = situation.individus.some(function(individu) {
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
        var demandeur = situation.individus[0];
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
