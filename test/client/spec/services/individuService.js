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
});
