'use strict';

/* global _ */
/* global moment */

describe('Service: cerfaService', function () {

    beforeEach(function() {
        module('ddsApp');
    });

    var createService = function() {
        var service;
        inject(function(CerfaService) {
            service = CerfaService;
        });

        return service;
    };

    describe('function getCerfaFormsFromDroit()', function() {
        it('should return an empty array if no forms are available for the given droit', function() {
            // given
            module(function($provide) {
                $provide.constant('cerfaForms', { test: { forms: [] }});
            });
            var service = createService();

            // when
            var forms = service.getCerfaFormsFromDroit('test');

            // then
            expect(forms).toEqual([]);
        });

        it('should return forms that are not conditionnaly showed', function() {
            // given
            var form = {};
            module(function($provide) {
                $provide.constant('cerfaForms', { test: { forms: { formID: form } }});
            });
            var service = createService();

            // when
            var forms = service.getCerfaFormsFromDroit('test');

            // then
            expect(forms).toEqual([form]);
        });

        it('should not return forms which show callbacks return false', function() {
            // given
            var form = {};
            module(function($provide) {
                $provide.constant('cerfaForms', { rsa: { forms: { rsa_non_salarie: form } }});
            });
            var service = createService();

            // when
            var forms = service.getCerfaFormsFromDroit('rsa', { individus: [{ role: 'demandeur' }] });

            // then
            expect(forms).toEqual([]);
        });

        it('should return forms which show callbacks return true', function() {
            // given
            var form = {};
            module(function($provide) {
                $provide.constant('cerfaForms', { rsa: { forms: { rsa_non_salarie: form } }});
            });
            var service = createService();

            // when
            var forms = service.getCerfaFormsFromDroit('rsa', { individus: [{ role: 'demandeur', ressources: [{ type: 'caAutoEntrepreneur' }] }] });

            // then
            expect(forms).toEqual([form]);
        });

        it('should display rsa_moins_25 only if demandeur or conjoint is aged < 25', function() {

            var cerfaFormsConstant;
            inject(function(cerfaForms) {
                cerfaFormsConstant = cerfaForms;
            });

            // given
            var service = createService();
            var situations = [
                { individus: [{ role: 'demandeur', dateDeNaissance: moment('14/09/2014', 'DD/MM/YYYY')}] },
                { individus: [{ role: 'demandeur'}, { role: 'conjoint', dateDeNaissance: moment('14/09/2014', 'DD/MM/YYYY') }] },
                { individus: [{ role: 'demandeur', dateDeNaissance: moment('14/09/1989', 'DD/MM/YYYY')}] }
            ];

            // when
            var result = _.map(situations, function(situation) {
                return _.contains(service.getCerfaFormsFromDroit('rsa', situation), cerfaFormsConstant.rsa.forms.rsa_moins_25);
            });

            // then
            expect(result).toEqual([true, true, false]);
        });
    });

    describe('pieces justificatives', function() {
        var service;

        beforeEach(function() {
            service = createService();
        });

        describe('function isPieceJustificativeRequiredForSituation()', function() {
            it('should ask livret famille for cmu-c only if situation has personnes à charge', function() {
                // given
                var situations = [
                    { individus: [{ role: 'enfant' }] },
                    { individus: [] }
                ];

                // when
                var result = _.filter(situations, function(situation) {
                    return service.isPieceJustificativeRequiredForSituation('cmu_c', 'livret_famille', situation);
                });

                // then
                expect(result).toEqual(_.initial(situations));
            });

            it('should ask taxe foncière for cmu-c only if demandeur is propriétaire', function() {
                // given
                var situations = [
                    {logement: {type: 'proprietaire'}},
                    {logement: {type: 'colocataire'}},
                    {logement: {type: 'locataire'}}
                ];

                // when
                var result = _.filter(situations, function(situation) {
                    return service.isPieceJustificativeRequiredForSituation('cmu_c', 'taxe_fonciere', situation);
                });

                // then
                expect(result).toEqual([situations[0]]);
            });

            it('should ask taxe habitation for cmu-c only if demandeur is locataire or colocataire', function() {
                // given
                var situations = [
                    {logement: {type: 'colocataire'}},
                    {logement: {type: 'locataire'}},
                    {logement: {type: 'proprietaire'}}
                ];

                // when
                var result = _.filter(situations, function(situation) {
                    return service.isPieceJustificativeRequiredForSituation('cmu_c', 'taxe_habitation', situation);
                });

                // then
                expect(result).toEqual(_.initial(situations));
            });

            it('should ask declaration de grossesse for rsa if enceinte', function() {
                // given
                var situations = [
                    { individus: [{ role: 'demandeur', enceinte: true }] },
                    { individus: [{ role: 'demandeur' }] }
                ];

                // when
                var result = _.filter(situations, function(situation) {
                    return service.isPieceJustificativeRequiredForSituation('rsa', 'declaration_grossesse', situation);
                });

                // then
                expect(result).toEqual([situations[0]]);
            });

            it('should ask taxe habitation for immobilier secondaire only if patrimoine declared', function() {
                // given
                var situations = [
                    {patrimoine: {valeurLocativeImmoNonLoue: 1}},
                    {patrimoine: {valeurLocativeTerrainNonLoue: 1}},
                    {patrimoine: {}}
                ];

                // when
                var result = _.filter(situations, function(situation) {
                    return service.isPieceJustificativeRequiredForSituation('rsa', 'taxe_habitation_patrimoine', situation);
                });

                // then
                expect(result).toEqual(_.initial(situations));
            });
        });

        describe('function pieceJustificativeIndividus()', function() {
            it('should ask piece d\'identité for french and EEE people aged >= 18', function() {
                // given
                var individus = [
                    {dateDeNaissance: moment('14/09/1980', 'DD/MM/YYYY'), nationalite: 'fr'},
                    {dateDeNaissance: moment('14/09/1980', 'DD/MM/YYYY'), nationalite: 'ue'},
                    // not kept because nationality not eee
                    {dateDeNaissance: moment('14/09/1980', 'DD/MM/YYYY'), nationalite: 'autre'},
                    // not kept because aged < 18
                    {dateDeNaissance: moment('14/09/2014', 'DD/MM/YYYY'), nationalite: 'fr'}
                ];

                // when
                var result = service.pieceJustificativeIndividus('cmu_c', 'identite', individus);

                // then
                expect(result).toEqual(_.initial(individus, 2));
            });

            describe('cmuc', function() {
                it('sould ask carte vitale for everybody aged >= 18', function() {
                    // given
                    var individus = [
                        {dateDeNaissance: moment('14/09/1980', 'DD/MM/YYYY')},
                        // not kept because aged < 18
                        {dateDeNaissance: moment('14/09/2014', 'DD/MM/YYYY')},
                    ];

                    // when
                    var result = service.pieceJustificativeIndividus('cmu_c', 'vitale', individus);

                    // then
                    expect(result).toEqual(_.initial(individus));
                });

                it('should ask titre de séjour for non-french people', function() {
                    // given
                    var individus = [{nationalite: 'ue'}, {nationalite: 'autre'}, {nationalite: 'fr'}];

                    // when
                    var result = service.pieceJustificativeIndividus('cmu_c', 'regularite', individus);

                    // then
                    expect(result).toEqual(_.initial(individus));
                });

                it('should ask avis d\'imposition ou non-imposition for individus aged > 16', function() {
                    // given
                    var individus = [{dateDeNaissance: moment('14/08/1989', 'DD/MM/YYYY')}, {dateDeNaissance: moment('14/09/2014', 'DD/MM/YYYY')}];

                    // when
                    var result = service.pieceJustificativeIndividus('cmu_c', 'imposition', individus);

                    // then
                    expect(result).toEqual([individus[0]]);
                });

                // TODO Tester uniquement sur revenus salariés déclarés pendant l'année glissante
                // car il se peut qu'il ait entré des revenus sur l'année n-2 qui ne sont pas à prendre en compte ici
                it('should ask bulletins de paie for individus aged > 16 having revenus salaries', function() {
                    // given
                    var individus = [
                        {dateDeNaissance: moment('14/08/1989', 'DD/MM/YYYY'), ressources: [{type: 'revenusSalarie'}]},
                        // not kept because aged < 16
                        {dateDeNaissance: moment('14/09/2014', 'DD/MM/YYYY'), ressources: [{type: 'revenusSalarie'}]},
                        // not kept because no revenus salarie
                        {dateDeNaissance: moment('14/08/1989', 'DD/MM/YYYY')},
                    ];

                    // when
                    var result = service.pieceJustificativeIndividus('cmu_c', 'bulletins_paie', individus);

                    // then
                    expect(result).toEqual([individus[0]]);
                });

                it('should ask attestations indemnités chômage for people aged > 16', function() {
                    // given
                    var individus = [
                        {dateDeNaissance: moment('14/08/1989', 'DD/MM/YYYY'), ressources: [{type: 'allocationsChomage'}]},
                        {dateDeNaissance: moment('14/08/1989', 'DD/MM/YYYY'), ressources: [{type: 'indChomagePartiel'}]},
                        // not kept because aged > 16
                        {dateDeNaissance: moment('14/08/2014', 'DD/MM/YYYY'), ressources: [{type: 'allocationsChomage'}]},
                        // not kept because no chomage
                        {dateDeNaissance: moment('14/08/2014', 'DD/MM/YYYY'), ressources: [{type: 'test'}]}
                    ];

                    // when
                    var result = service.pieceJustificativeIndividus('cmu_c', 'attestation_indemnites_chomage', individus);

                    // then
                    expect(result).toEqual(_.initial(individus, 2));
                });
            });

            describe('rsa', function() {
                it('should ask piece d\'identite for nationalite fr or ue parents or children born in France', function() {
                    // given
                    var individus = [
                        {nationalite: 'fr', role: 'demandeur'},
                        {nationalite: 'ue', role: 'conjoint'},
                        {nationalite: 'fr', role: 'enfant'},
                        // not kept because nationalite autre
                        {nationalite: 'autre', role: 'demandeur'},
                    ];

                    // when
                    var result = service.pieceJustificativeIndividus('rsa', 'identite', individus);

                    // then
                    expect(result).toEqual(_.initial(individus, 1));
                });

                it('should ask titre de séjour for parents with nationalité not EEE, and for children aged > 18 and foreigner', function() {
                    // given
                    var individus = [
                        {nationalite: 'autre', paysNaissance: 'Malaisie', role: 'demandeur'},
                        {nationalite: 'autre', paysNaissance: 'Congo', role: 'conjoint'},
                        {dateDeNaissance: moment('14/08/1980', 'DD/MM/YYYY'), nationalite: 'autre', paysNaissance: 'Congo', role: 'enfant'},
                        // not kept because child < 18
                        {dateDeNaissance: moment('14/08/2014', 'DD/MM/YYYY'), nationalite: 'autre', paysNaissance: 'Congo', role: 'enfant'},
                        // not kept because nationalite eee
                        {nationalite: 'ue', role: 'demandeur'},
                    ];

                    // when
                    var result = service.pieceJustificativeIndividus('rsa', 'titre_sejour', individus);

                    // then
                    expect(result).toEqual(_.initial(individus, 2));
                });

                it('should ask avis paiement pension invalidité when required', function() {
                    // given
                    var individus = [
                        {role: 'demandeur', ressources: [{type: 'pensionsInvalidite'}]},
                        {role: 'demandeur', ressources: [{type: 'pensionsInvalidite'}]},
                        // not kept because not parent
                        {role: 'enfant', ressources: [{type: 'pensionsInvalidite'}]},
                        // not kept because no pension
                        {role: 'demandeur'}
                    ];

                    // when
                    var result = service.pieceJustificativeIndividus('rsa', 'avis_paiement_pension_invalidite', individus);

                    // then
                    expect(result).toEqual(_.initial(individus, 2));
                });

                it('should ask avis paiement retraite when required', function() {
                    // given
                    var individus = [
                        {role: 'demandeur', specificSituations: [{situation: 'retraite'}]},
                        {role: 'conjoint', specificSituations: [{situation: 'retraite'}]},
                        // not kept because not retraite
                        {role: 'conjoint'},
                        // not kept because not parent
                        {role: 'enfant', specificSituations: [{situation: 'retraite'}]}
                    ];

                    // when
                    var result = service.pieceJustificativeIndividus('rsa', 'avis_paiement_retraite', individus);

                    // then
                    expect(result).toEqual(_.initial(individus, 2));
                });

                it('should ask avis paiement indemnite accident travail when required', function() {
                    // given
                    var individus = [
                        {role: 'demandeur', ressources: [{type: 'indJourAccidentDuTravail'}]},
                        {role: 'demandeur', ressources: [{type: 'indJourAccidentDuTravail'}]},
                        // not kept because not parent
                        {role: 'enfant', ressources: [{type: 'indJourAccidentDuTravail'}]},
                        // not kept because no indemnite
                        {role: 'demandeur'}
                    ];

                    // when
                    var result = service.pieceJustificativeIndividus('rsa', 'avis_paiement_rente_accident_travail', individus);

                    // then
                    expect(result).toEqual(_.initial(individus, 2));
                });
            });

            describe('al', function() {
                it('should ask attestions chomage partiel to everyone that declared it as a resource', function() {
                    // given
                    var individus = [
                        {role: 'demandeur', ressources: [{type: 'indChomagePartiel'}]},
                        {role: 'enfant', ressources: [{type: 'indChomagePartiel'}]},
                        {role: 'enfant'},
                        {role: 'enfant'}
                    ];

                    // when
                    var result = service.pieceJustificativeIndividus('al', 'attestation_chomage_partiel', individus);

                    // then
                    expect(result).toEqual(_.initial(individus, 2));
                });
            });

            describe('aspa', function() {
                it('should ask avis impot revenu to demandeur, and conjoint only if concubin', function() {
                    // given
                    var individus = [
                        {role: 'demandeur'},
                        {role: 'conjoint', statutMarital: 'union_libre'},
                        // not kept because not parent
                        {role: 'enfant'},
                        // not kept because not concubin
                        {role: 'conjoint', statutMarital: 'mariage'}
                    ];

                    // when
                    var result = service.pieceJustificativeIndividus('aspa', 'imposition', individus);

                    // then
                    expect(result).toEqual(_.initial(individus, 2));
                });

                it('should ask titre sejour for parents with nationality not fr/eee', function() {
                    // given
                    var individus = [
                        {role: 'demandeur', nationalite: 'autre'},
                        {role: 'conjoint', nationalite: 'autre'},
                        // not kept because not parent
                        {role: 'enfant', nationalite: 'autre'},
                        // not kept because nationality eee
                        {role: 'demandeur', nationalite: 'ue'}
                    ];

                    // when
                    var result = service.pieceJustificativeIndividus('aspa', 'titre_sejour', individus);

                    // then
                    expect(result).toEqual(_.initial(individus, 2));
                });
            });
        });
    });
});
