'use strict';

describe('IndividuService', function() {
    var service;

    beforeEach(function() {
        module('ddsApp');
        inject(function(IndividuService) {
            service = IndividuService;
        });
    });

    describe('function label()', function() {
        it('Should return "Vous" if individu has role demandeur', function() {
            // given
            var individu = {role: 'demandeur', firstName: 'Arnaud'};

            // when
            var result = service.label(individu);

            // then
            expect(result).toBe('Vous');
        });

        it('Should return "Votre conjoint·e" if individu has role conjoint', function() {
            // given
            var individu = { role: 'conjoint', firstName: 'Arnaud' };

            // when
            var result = service.label(individu);

            // then
            expect(result).toBe('Votre conjoint·e');
        });

        it('Should return the individu\'s first name if individu has not role demandeur neither conjoint', function() {
            // given
            var individu = { role: 'fakeRole', firstName: 'Arnaud' };

            // when
            var result = service.label(individu);

            // then
            expect(result).toBe('Arnaud');
        });
    });

    describe('function formatStatutsSpecifiques()', function() {
        it('Should return empty string if no specific situations', function() {
            // when
            var result = service.formatStatutsSpecifiques({ specificSituations: [] });

            // then
            expect(result).toBe('');
        });

        it('Should return single situation with no comma', function() {
            // when
            var result = service.formatStatutsSpecifiques({ specificSituations: ['retraite'] });

            // then
            expect(result).toBe('Retraité·e');
        });

        it('Should return comma-separated statuts when individu has several statuts specifiques', function() {
            // when
            var result = service.formatStatutsSpecifiques({ specificSituations: ['retraite' , 'etudiant'] });

            // then
            expect(result).toBe('Étudiant·e, apprenti·e, retraité·e');
        });

        it('Should display "enceinte", "boursier" and "en garde alternée" if the individu has the corresponding fields to true', function() {
            // when
            var result = service.formatStatutsSpecifiques({ enceinte: true, boursier: true, garde_alternee: true });

            // then
            expect(result).toBe('Enceinte, boursier, en garde alternée');
        });
    });

    describe('function isParent()', function() {
        it('Should return true only if individu has role "demandeur" or "conjoint"', function() {
            // given
            var roles = ['demandeur', 'conjoint', 'enfant', undefined];
            var individus = _.map(roles, function(role) { return { role: role }; });

            // when
            var results = _.map(individus, _.bind(service.isParent, service));

            // then
            expect(results).toEqual([true, true, false, false]);
        });
    });
});
