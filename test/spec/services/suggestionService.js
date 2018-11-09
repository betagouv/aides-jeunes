'use strict';

describe('Service: Suggestion', function() {
    var service;

    beforeEach(function() {
        module('ddsApp');
        inject(function(SuggestionService) {
            service = SuggestionService;
        });
    });

    describe('determineExtensionAndRepository', function() {
        var result;
        describe('national aids', function() {
            beforeEach(function() {
                result = service.determineExtensionAndRepository([{
                    level: 'prestationsNationales'
                }]);
            });

            it('has no extension for national aids', function() {
                expect(result.extension).toBeFalsy();
            });

            it('targets openfisca-france', function() {
                expect(result.repository).toBe('openfisca-france');
            });
        });

        describe('local aids', function() {
            beforeEach(function() {
                result = service.determineExtensionAndRepository([{
                    level: 'partenairesLocaux',
                    repository: 'provider'
                }]);
            });


            it('targets the extension', function() {
                expect(result.extension).toBeTruthy();
                expect(result.repository).toBe('openfisca-provider');
            });
        });
    });
});
