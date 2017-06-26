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
    menage: menageSchema,
});
