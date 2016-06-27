'use strict';

describe('ImpactStudyService', function() {
    var subject,
        httpMock,
        location,
        browserController,
        sessionStorage;

    var SITUATION = { logement: { adresse: { codePostal: '21800' } } },
        RESULTS = { calculatedPrestations: { key: 'value' }, injectedPrestations: {} },
        EID = '9582d21d-464b-4654-a556-e9279f425e08';

    beforeEach(function() {
        module('ddsApp');
        inject(function($httpBackend, $location, $browser, $sessionStorage, ImpactStudyService) {
            subject = ImpactStudyService;
            httpMock = $httpBackend;
            location = $location;
            browserController = $browser;
            sessionStorage = $sessionStorage;

            httpMock.when('POST', /^https\:\/\/mes-droits\.fr\//).respond(200);
            httpMock.when('GET', /^\/.*/).respond(200);

            httpMock.flush();
        });
    });

    afterEach(function() {
        httpMock.verifyNoOutstandingExpectation();
        httpMock.verifyNoOutstandingRequest();
    });

    function validate(data) {
        data = JSON.parse(data);
        return data.postcode == SITUATION.logement.adresse.codePostal
            && data.eid == EID;
    }

    describe('sendResults()', function() {
        it('should not send anything if no research ID is set', function() {
            subject.sendResults(SITUATION, RESULTS);
        });

        it('should send data if a research ID is set', function() {
            location.search({ eid: EID });
            browserController.poll();

            httpMock.expectPOST('https://mes-droits.fr/v1/sr', function(data) {
                return validate(data)
                    && JSON.parse(data).results.key == RESULTS.calculatedPrestations.key;
            });
            subject.sendResults(SITUATION, RESULTS);
            httpMock.flush();
        });
    });

    describe('sendPostCode()', function() {
        it('should not send anything if no research ID is set', function() {
            subject.sendPostCode(SITUATION);
        });

        it('should send data if a research ID is set', function() {
            location.search({ eid: EID });
            browserController.poll();

            httpMock.expectPOST('https://mes-droits.fr/v1/cp', validate);
            subject.sendPostCode(SITUATION);
            httpMock.flush();
        });
    });

    describe('sendVisitedPage()', function() {
        it('should not send anything if no research ID is set', function() {
            subject.sendVisitedPage();
        });

        it('should send data if a research ID is set', function() {
            location.search({ eid: EID });
            browserController.poll();

            httpMock.expectPOST('https://mes-droits.fr/v1/it');
            subject.sendVisitedPage();
            httpMock.flush();
        });
    });

    describe('session id', function() {
        var sessionId;

        beforeEach(function() {
            location.search({ eid: EID });
            browserController.poll();

            httpMock.expectPOST('https://mes-droits.fr/v1/it', function(data) {
                sessionId = JSON.parse(data).session_id;
                return sessionId;
            });

            subject.sendVisitedPage();
        });

        afterEach(function() {
            httpMock.flush();
        });

        it('should be consistent', function() {
            httpMock.expectPOST('https://mes-droits.fr/v1/it', function(data) {
                return JSON.parse(data).session_id == sessionId;
            });
        });

        it('should change after a call to resetSessionId()', function() {
            subject.resetSessionId();

            httpMock.expectPOST('https://mes-droits.fr/v1/it', function(data) {
                return JSON.parse(data).session_id != sessionId;
            });
        });
    });
});
