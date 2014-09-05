'use strict';

describe('Service: cerfaService', function () {

    beforeEach(function() {
        module('ddsApp');
    });

    describe('function getCerfaFormsFromDroit()', function() {
        it('should return an empty array if no forms are available for the given droit', function() {
            // given
            module(function($provide) {
                $provide.constant('cerfaForms', [{ droitId: 'test', forms: [] }]);
            });
            var service;
            inject(function(CerfaService) {
                service = CerfaService;
            });

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
            var service;
            inject(function(CerfaService) {
                service = CerfaService;
            });

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
            var service;
            inject(function(CerfaService) {
                service = CerfaService;
            });

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
            var service;
            inject(function(CerfaService) {
                service = CerfaService;
            });

            // when
            var forms = service.getCerfaFormsFromDroit('cmu_c', {demandeur: {}, conjoint: {}, enfants: [], personnesACharge: []});

            // then
            expect(forms).toEqual([form]);
        });
    });
});
