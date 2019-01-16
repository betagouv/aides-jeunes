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
                    codeInsee: '75119',
                    codePostal: '75019',
                    nomCommune: 'paris 19',
                }]));

            $httpBackend
                .whenGET('/api/outils/communes/33610')
                .respond(200, JSON.stringify([{
                    codeInsee: "33090",
                    codePostal: "33610",
                    nomCommune: "CANEJAN",
                },
                {
                    codeInsee: "33122",
                    codePostal: "33610",
                    nomCommune: "CESTAS",
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
