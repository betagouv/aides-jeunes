'use strict';

describe('Service: situationService', function () {

    var service;

    beforeEach(function() {
        module('ddsApp');
        inject(function(SituationService) {
            service = SituationService;
        });
    });

    describe('function formatStatutsLabels', function() {
        it('Should return empty string if no specific situations', function() {
            // when
            var result = service.formatStatutsSpecifiques({});

            // then
            expect(result).toBe('');
        });

        it('Should return single situation with no comma', function() {
            // when
            var result = service.formatStatutsSpecifiques({retraite: true});

            // then
            expect(result).toBe('Retraité');
        });

        it('Should return several situations with commas', function() {
            // when
            var result = service.formatStatutsSpecifiques({etudiant: true, retraite: true});

            // then
            expect(result).toBe('Étudiant, retraité');
        });
    });
});
