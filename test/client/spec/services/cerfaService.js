'use strict';

/* global _ */

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
                $provide.constant('cerfaForms', [{ droitId: 'test', forms: [] }]);
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
                $provide.constant('cerfaForms', [{ droitId: 'test', forms: [form] }]);
            });
            var service = createService();

            // when
            var forms = service.getCerfaFormsFromDroit('test');

            // then
            expect(forms).toEqual([form]);
        });

        it('should not return forms which show callbacks return false', function() {
            // given
            var form = {id: 'cmuc_choix_organisme_non_demandeur'};
            module(function($provide) {
                $provide.constant('cerfaForms', [{ droitId: 'cmu_c', forms: [form] }]);
            });
            var service = createService();

            // when
            var forms = service.getCerfaFormsFromDroit('cmu_c', {demandeur: {}, enfants: [], personnesACharge: []});

            // then
            expect(forms).toEqual([]);
        });

        it('should return forms which show callbacks return true', function() {
            // given
            var form = {id: 'cmuc_choix_organisme_non_demandeur'};
            module(function($provide) {
                $provide.constant('cerfaForms', [{ droitId: 'cmu_c', forms: [form] }]);
            });
            var service = createService();

            // when
            var forms = service.getCerfaFormsFromDroit('cmu_c', {demandeur: {}, conjoint: {}, enfants: [], personnesACharge: []});

            // then
            expect(forms).toEqual([form]);
        });
    });

    describe('pieces justificatives', function() {
        var service;

        beforeEach(function() {
            service = createService();
        });

        describe('function isPieceJustificativeRequiredForSituation()', function() {
            describe('cmuc', function() {
                it('should ask livret famille only if situation has personnes à charge', function() {
                    // given
                    var situations = [
                        {enfants: [], personnesACharge: []},
                        {enfants: [{}], personnesACharge: []},
                        {enfants: [], personnesACharge: [{}]}
                    ];

                    // when
                    var result = _.filter(situations, function(situation) {
                        return service.isPieceJustificativeRequiredForSituation('cmu_c', 'livret_famille', situation);
                    });

                    // then
                    expect(result.length).toBe(2);
                });

                it('should ask taxe foncière only if demandeur is propriétaire', function() {
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
                    expect(result.length).toBe(1);
                    expect(result[0].logement.type).toBe('proprietaire');
                });

                it('should ask taxe habitation only if demandeur is locataire or colocataire', function() {
                    // given
                    var situations = [
                        {logement: {type: 'proprietaire'}},
                        {logement: {type: 'colocataire'}},
                        {logement: {type: 'locataire'}}
                    ];

                    // when
                    var result = _.filter(situations, function(situation) {
                        return service.isPieceJustificativeRequiredForSituation('cmu_c', 'taxe_habitation', situation);
                    });

                    // then
                    expect(result.length).toBe(2);
                    expect(result[0].logement.type).toBe('colocataire');
                    expect(result[1].logement.type).toBe('locataire');
                });
            });
        });

        describe('function pieceJustificativeIndividus()', function() {
            describe('cmuc', function() {
                it('sould ask carte vitale for everybody', function() {
                    // given
                    var individus = [{role: 'demandeur'}, {role: 'conjoint'}, {role: 'enfant'}, {role: 'personneACharge'}];

                    // when
                    var result = service.pieceJustificativeIndividus('cmu_c', 'vitale', individus);

                    // then
                    expect(result).toEqual(individus);
                });

                it('should ask piece d\'identité for french and EEE people', function() {
                    // given
                    var individus = [
                        {nationalite: 'fr', role: 'demandeur'},
                        {nationalite: 'ue', role: 'conjonint'},
                        {nationalite: 'autre', role: 'demandeur'}
                    ];

                    // when
                    var result = service.pieceJustificativeIndividus('cmu_c', 'identite', individus);

                    // then
                    expect(result.length).toBe(2);
                    expect(result[0].nationalite).toBe('fr');
                    expect(result[1].nationalite).toBe('ue');
                });

                it('should ask titre de séjour for non-french people', function() {
                    // given
                    var individus = [{nationalite: 'fr'}, {nationalite: 'ue'}, {nationalite: 'autre'}];

                    // when
                    var result = service.pieceJustificativeIndividus('cmu_c', 'regularite', individus);

                    // then
                    expect(result.length).toBe(2);
                    expect(result[0].nationalite).toBe('ue');
                    expect(result[1].nationalite).toBe('autre');
                });

                it('should ask avis d\'imposition ou non-imposition for individus aged > 16', function() {
                    // given
                    var individus = [{birthDate: '14/09/2014'}, {birthDate: '14/08/1989'}];

                    // when
                    var result = service.pieceJustificativeIndividus('cmu_c', 'imposition', individus);

                    // then
                    expect(result.length).toBe(1);
                    expect(result[0].birthDate).toBe('14/08/1989');
                });

                // TODO Tester uniquement sur revenus salariés déclarés pendant l'année glissante
                it('should ask bulletins de paie for individus aged > 16 having revenus salaries', function() {
                    // given
                    var individuSalarie = {birthDate: '14/08/1989', ressources: [{type: 'revenusSalarie'}]};
                    var individus = [
                        {birthDate: '14/09/2014', ressources: [{type: 'revenusSalarie', periode: '1014'}]},
                        {birthDate: '14/08/1989'},
                        individuSalarie
                    ];

                    // when
                    var result = service.pieceJustificativeIndividus('cmu_c', 'bulletins_paie', individus);

                    // then
                    expect(result.length).toBe(1);
                    expect(result[0]).toBe(individuSalarie);
                });

                it('should ask attestations indemnités chômage for people aged > 16', function() {
                    // given
                    var individuChomeur = {birthDate: '14/08/1989', ressources: [{type: 'allocationsChomage'}]};
                    var individuChomeurPartiel = {birthDate: '14/08/1989', ressources: [{type: 'indChomagePartiel'}]};
                    var individuChomeurMoins16ans = {birthDate: '14/08/2014', ressources: [{type: 'allocationsChomage'}]};
                    var individus = [individuChomeur, individuChomeurPartiel, individuChomeurMoins16ans];

                    // when
                    var result = service.pieceJustificativeIndividus('cmu_c', 'attestation_indemnites_chomage', individus);

                    // then
                    expect(result.length).toBe(2);
                    expect(result[0]).toBe(individuChomeur);
                    expect(result[1]).toBe(individuChomeurPartiel);
                });
            });
        });
    });
});
