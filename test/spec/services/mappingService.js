'use strict';

describe('MappingService', function() {
    var service;

    beforeEach(function() {
        module('ddsApp', function($provide) {
            $provide.value('droitsDescription', {});
        });
        inject(function(MappingService) {
            service = MappingService;
        });
    });

    describe('applyRessources', function() {
        it('should aggregate ressources', function() {
            var individu = {
                a: {
                    period1: 1,
                    period2: 2,
                },
                b: {
                    period1: 3,
                },
                c: {
                    period1: 5,
                },
            };
            var mapping = {
                c: ['a', 'b', 'c'],
            };
            var outputIndividu = {c: 1};
            service._applyRessources(individu, outputIndividu, mapping);

            expect(outputIndividu.c).toBeTruthy();
            expect(outputIndividu.c.period1).toEqual(9);
            //expect(individus[0].pensions_alimentaires_percues['2015-08']).toEqual(100);
        });
    });


});
