'use strict';

function isIndividuValid(individu, situation) {
    var age = moment(situation.dateDeValeur).diff(moment(individu.dateDeNaissance), 'years');
    var handicap = individu.specificSituations.indexOf('handicap' ) >= 0;
    return individu.role != 'enfant' || age <= 25 || handicap;
}

function getEnfants(situation) {
    var enfants = _.filter(situation.individus, function(individu) {
        return isIndividuValid(individu, situation) && individu.role == 'enfant';
    });
    return _.map(enfants, 'id');
}

var familleSchema = {
    parents: {
        fn: function(situation) {
            return _.map(_.filter(situation.individus, function(individu) {
                return _.includes(['demandeur', 'conjoint'], individu.role);
            }), 'id');
        },
        copyTo3PreviousMonths: false,
    },
    enfants: {
        fn: getEnfants,
        copyTo3PreviousMonths: false,
    },
    proprietaire_proche_famille: {
        fn: function(situation) {
            return situation.logement.membreFamilleProprietaire;
        }
    },
    rsa_isolement_recent: {
        fn: function(situation) {
            return situation.individus[0].isolementRecent;
        }
    },
    parisien: {
        fn: function(situation) { return situation.logement.inhabitantForThreeYearsOutOfLastFive; }
    },
};

var foyerFiscalSchema = {
    declarants: {
        fn: function(situation) {
            return _.map(_.filter(situation.individus, function(individu) {
                return _.includes(['demandeur', 'conjoint'], individu.role);
            }), 'id');
        },
        copyTo3PreviousMonths: false,
    },
    // Today, in mes-aides, all children and only them are transmitted to Openfisca as personnes à charge
    personnes_a_charge: {
        fn: getEnfants,
        copyTo3PreviousMonths: false,
    },
    rfr: {
        fn: function (situation) {
            if (situation.ressourcesYearMoins2Captured) {
                var anneeFiscaleN2 = moment(situation.dateDeValeur).subtract(2, 'years').year();
                var result = {};
                result[anneeFiscaleN2] = situation.rfr;
                return result;
            }
        },
        copyTo3PreviousMonths: false,
    },
};

var menageSchema = {
    personne_de_reference: {
        fn: function(situation) {
            return _.find(situation.individus, { role: 'demandeur' }).id;
        },
        copyTo3PreviousMonths: false,
    },
    conjoint: {
        fn: function(situation) {
            var conjoint = _.find(situation.individus, { role: 'conjoint' });
            return conjoint ? conjoint.id : null;
        },
        copyTo3PreviousMonths: false,
    },
    enfants: {
        fn: getEnfants,
        copyTo3PreviousMonths: false,
    },
    statut_occupation_logement: {
        fn: function(situation) {
            var statusOccupationMap = {
                'proprietaireprimoaccedant': 1,
                'proprietaire': 2,
                'locatairenonmeuble': 4,
                'locatairemeublehotel': 5,
                'heberge': 6,
                'locatairefoyer': 7,
                'sans_domicile' : 8
            };
            var logement = situation.logement;
            var type = logement.type;
            if (type) {
                var statusOccupationId = type;
                if (type == 'proprietaire' && logement.primoAccedant) {
                    statusOccupationId = 'proprietaireprimoaccedant';
                }
                if (type == 'locataire' && logement.locationType) {
                    statusOccupationId += logement.locationType;
                }
                return statusOccupationMap[statusOccupationId];
            }
        }
    },
    loyer: {
        fn: function (situation) { return situation.logement.loyer; },
        round: true
    },
    charges_locatives: {
        fn: function (situation) { return situation.logement.charges; },
        round: true
    },
    depcom: {
        fn: function (situation) { return situation.logement.adresse.codeInsee || null; }
    },
    participation_frais: {
        fn: function (situation) { return situation.logement.participationFrais; }
    },
    coloc: {
        fn: function (situation) {
            return situation.logement.type == 'locataire' && situation.logement.colocation;
        }
    },
    logement_chambre: {
        fn: function (situation) {
            return situation.logement.type == 'locataire' && situation.logement.isChambre;
        }
    },
};

angular.module('ddsCommon').constant('mappingSchemas', {
    famille: familleSchema,
    foyerFiscal: foyerFiscalSchema,
    menage: menageSchema,
});
