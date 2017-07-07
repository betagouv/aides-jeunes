'use strict';

describe('CityService', function() {
    var service, q, scope, http;

    beforeEach(function() {
        module('ddsApp', function($provide) {
            $provide.value('$http', {
                get: function(url) {
                    // Prevent mocking real $http calls
                    if (! url.match(/\d{5}$/)) {
                        return http.get(url);
                    }

                    var deferred = q.defer();
                    var data = [{
                        codeInsee: '75119',
                        codePostal: '75019',
                        nomCommune: 'paris 19',
                    }];
                    if (url && url.slice && url.slice(-5) === '33610') {
                        data = [{
                            codeInsee: "33090",
                            codePostal: "33610",
                            nomCommune: "CANEJAN",
                        },
                        {
                            codeInsee: "33122",
                            codePostal: "33610",
                            nomCommune: "CESTAS",
                        }];
                    }
                    deferred.resolve({ data: data });
                    return deferred.promise;
                },
            });
        });
        inject(function($rootScope, $q, $http, CityService) {
            scope = $rootScope.$new();
            service = CityService;
            http = $http;
            q = $q;
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
            scope.$apply();
        });

        it('Should return a two-element array for 33610', function(done) {
            // when
            var result = service.getCities('33610');

            // then
            result.then(function(cities) {
                expect(cities.length).toBe(2);
                done();
            });
            scope.$apply();
        });
    });
});
