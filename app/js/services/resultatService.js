'use strict';

angular.module('ddsApp').service('ResultatService', function($http, droitsDescription) {

    var PRESTATIONS = { aspa: { type: Number }, asi: { type: Number }, acs: { type: Number }, cmu_c: { type: Boolean }, apl: { type: Number }, als: { type: Number }, alf: { type: Number }, aide_logement: { type: Number }, aide_logement_non_calculable: { type: String }, af: { type: Number }, rsa: { type: Number }, rsa_non_calculable: { type: String }, asf: { type: Number }, cf: { type: Number }, ass: { type: Number }, paje_base: { type: Number }, bourse_college: { type: Number }, bourse_lycee: { type: Number }, paris_logement_familles: { type: Number }, paris_forfait_famille: { type: Number }, paris_logement_psol: { type: Number }, paris_logement: { type: Number }, paris_logement_plfm: { type: Number }, paris_logement_aspeh: { type: Number }, paris_energie_famille: { type: Number }, paris_complement_sante: { type: Number }, adpa: { type: Number }, rennes_metropole_transport: { type: Number, prestationIndividuelle: true }, aah: { type: Number, prestationIndividuelle: true }, aah_non_calculable: { type: String, prestationIndividuelle: true }, ppa: { type: Number } };

    function preprocessOpenfiscaResult(situation, openfiscaResponse) {
        var period = moment(situation.dateDeValeur).format('YYYY-MM');

        var injectedRessources = _.uniq(_.flatten(_.map(situation.individus, function(individu) {
            return _.map(individu.ressources, 'type');
        })));

        var injectedPrestations = _.keys(PRESTATIONS).filter(function(prestationOpenFiscaId) {
            return injectedRessources.indexOf(prestationOpenFiscaId) >= 0;
        });

        // Computed prestations can be in the 'familles' or 'individus' openfisca entity
        var openfiscaResults = _.merge(openfiscaResponse.value[0].familles[0], openfiscaResponse.value[0].individus[0]);

        var calculatedPrestations = _.pickBy(PRESTATIONS, function(format, prestationName) {
            return injectedPrestations.indexOf(prestationName) < 0;
        });

        return {
            injectedPrestations: injectedPrestations,
            calculatedPrestations: _.mapValues(calculatedPrestations, function(format, prestationName) {
                var result = openfiscaResults[prestationName] && openfiscaResults[prestationName][period],
                    uncomputabilityReason = openfiscaResults[prestationName + '_non_calculable'] && openfiscaResults[prestationName + '_non_calculable'][period];

                if (uncomputabilityReason) {
                    return uncomputabilityReason;
                }

                return result;
            }),
        };
    }

    function processOpenfiscaResult(openfiscaResult) {
        var droitsEligibles = {};
        [ 'prestationsNationales', 'partenairesLocaux' ].forEach(function(type) {
            droitsEligibles[type] = {};

            Object.keys(droitsDescription[type]).forEach(function(provider) {
                var result = extractMontants(droitsDescription[type][provider].prestations, openfiscaResult.calculatedPrestations);

                if (_.isEmpty(result))
                    return;

                Object.keys(result).forEach(function(aideId) {
                    result[aideId].imgSrc = droitsDescription[type][provider].imgSrc;
                });

                droitsEligibles[type][provider] = result;
            });
        });

        droitsEligibles.prestationsNationales = _.reduce(droitsEligibles.prestationsNationales, function(result, droits) {
            return _.assign(result, droits);  // flatten all national prestations
        }, {});

        return {
            raw: openfiscaResult,
            droitsEligibles: droitsEligibles,
            droitsInjectes: openfiscaResult.injectedPrestations.map(function(prestationName) {
                var result;
                Object.keys(droitsDescription.prestationsNationales).some(function(provider) {
                    return (result = droitsDescription.prestationsNationales[provider].prestations[prestationName]);
                });
                return result;
            }),
        };
    }

    function extractMontants(prestationsList, openfiscaResult) {
        return _.reduce(prestationsList, function(result, droit, droitId) {
            if (openfiscaResult[droitId]) {
                result[droitId] = _.assign(droit, { montant: openfiscaResult[droitId] });
            }
            return result;
        }, {});
    }

    return {
        preprocessOpenfiscaResult: preprocessOpenfiscaResult,
        processOpenfiscaResult: processOpenfiscaResult,
        simulate: function(situation) {
            return $http.get('/api/situations/' + situation._id + '/simulation', {
                params: { cacheBust: Date.now() }
            }).then(function(response) {
                return processOpenfiscaResult(preprocessOpenfiscaResult(situation, response.data));
            });
        }
    };
});
