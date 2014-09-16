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

        it('Should return "Votre conjoint" if individu has role conjoint', function() {
            // given
            var individu = {role: 'conjoint', firstName: 'Arnaud'};

            // when
            var result = service.label(individu);

            // then
            expect(result).toBe('Votre conjoint');
        });

        it('Should return the individu\'s first name if individu has not role demandeur neither conjoint', function() {
            // given
            var individu = {role: 'fakeRole', firstName: 'Arnaud'};

            // when
            var result = service.label(individu);

            // then
            expect(result).toBe('Arnaud');
        });
    });

    describe('function formatStatutsSpecifiques()', function() {
        it('Should return empty string if no specific situations', function() {
            // when
            var result = service.formatStatutsSpecifiques({situationsPro: []});

            // then
            expect(result).toBe('');
        });

        it('Should return single situation with no comma', function() {
            // when
            var result = service.formatStatutsSpecifiques({situationsPro: [{situation: 'retraite'}]});

            // then
            expect(result).toBe('Retraité');
        });

        it('Should return comma-separated statuts when individu has several statuts specifiques', function() {
            // when
            var result = service.formatStatutsSpecifiques({situationsPro: [{situation: 'retraite'}, {situation: 'etudiant'}]});

            // then
            expect(result).toBe('Étudiant, retraité');
        });
    });
});
