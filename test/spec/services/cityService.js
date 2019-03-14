'use strict';

describe('CityService', function() {
    var service, $httpBackend;

    beforeEach(function() {
        module('ddsApp');
        inject(function($injector, CityService) {
            service = CityService;

            $httpBackend = $injector.get('$httpBackend');

            $httpBackend
                .whenGET('/api/outils/communes/75019')
                .respond(200, JSON.stringify([{
                    code: '75119',
                    codesPostaux: ['75019'],
                    nom: 'paris 19',
                }]));

            $httpBackend
                .whenGET('/api/outils/communes/33610')
                .respond(200, JSON.stringify([{
                    code: "33090",
                    codesPostaux: ["33610"],
                    nom: "CANEJAN",
                },
                {
                    code: "33122",
                    codesPostaux: ["33610"],
                    nom: "CESTAS",
                }]));

        });
    });

    describe('function getCities()', function() {
        it('Should return single array for 75019', function(done) {
            // when
            var result = service.getCities('75019');

            // then
            result.then(function(cities) {
                expect(cities.length).toBe(1);
                done();
            });

            $httpBackend.flush();
        });

        it('Should return a two-element array for 33610', function(done) {
            // when
            var result = service.getCities('33610');

            // then
            result.then(function(cities) {
                expect(cities.length).toBe(2);
                done();
            });

            $httpBackend.flush();
        });
    });
});
