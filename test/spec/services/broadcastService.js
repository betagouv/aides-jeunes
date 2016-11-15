'use strict';

describe('BroadcastService', function() {
    var subject,
        httpMock,
        location,
        browserController,
        sessionStorage;

    beforeEach(function() {
        module('ddsApp');
        inject(function($httpBackend, $location, $browser, $sessionStorage, BroadcastService) {
            subject = BroadcastService;
            httpMock = $httpBackend;
            location = $location;
            browserController = $browser;
            sessionStorage = $sessionStorage;
        });
    });

    afterEach(function() {
        httpMock.verifyNoOutstandingExpectation();
        httpMock.verifyNoOutstandingRequest();
    });

    describe('getNewBroadcasts()', function() {
        it('should not return anything on first visit', function() {
            httpMock.when('GET', /.*/).respond([ {
                published_at: new Date().toISOString(),
                name: "Name now",
                body: "Body now"
            } ]);

            subject.getNewBroadcasts().then(function(broadcasts) {
                expect(broadcasts).toEqual([]);
            }, function() {
                throw new Error('should not error');
            });

            httpMock.flush();
        });

        it('should return new broadcasts on a second visit', function() {
            var expected = {
                published_at: "2030-11-10T16:40:28Z",
                name: "Name now",
                body: "Body now"
            };

            httpMock.when('GET', /.*/).respond([ expected, {
                published_at: "2015-11-10T16:40:28Z",
                name: "Name 2015",
                body: "Body 2015"
            } ]);

            subject.getNewBroadcasts().then(function(broadcasts) {
                expect(broadcasts).toEqual([ expected ]);
            }, function() {
                throw new Error('should not error');
            });

            httpMock.flush();
        });

        it('should not return anything in case of an error', function() {
            httpMock.when('GET', /.*/).respond(500, 'Internal server error');

            subject.getNewBroadcasts().then(function(broadcasts) {
                expect(broadcasts).toEqual([]);
            }, function() {
                throw new Error('should not error');
            });

            httpMock.flush();
        });
    });
});
