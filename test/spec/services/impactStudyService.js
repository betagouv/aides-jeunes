'use strict';

describe('ImpactStudyService', function() {
    var subject,
        httpMock,
        location,
        browserController;

    var SITUATION = { logement: { adresse: { codePostal: '21800' } } },
        EID = '9582d21d-464b-4654-a556-e9279f425e08';

    beforeEach(function() {
        module('ddsApp');
        inject(function($httpBackend, $location, $browser, ImpactStudyService) {
            subject = ImpactStudyService;
            httpMock = $httpBackend;
            location = $location;
            browserController = $browser;

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
            subject.sendResults(SITUATION, {});
        });

        it('should send data if a research ID is set', function() {
            location.search({ eid: EID });
            browserController.poll();

            httpMock.expectPOST('https://mes-droits.fr/sr', validate);
            subject.sendResults(SITUATION, {});
            httpMock.flush();
        });
    });

    describe('sendPostCode()', function() {
        it('should not send anything if no research ID is set', function() {
            subject.sendResults(SITUATION, {});
        });

        it('should send data if a research ID is set', function() {
            location.search({ eid: EID });
            browserController.poll();

            httpMock.expectPOST('https://mes-droits.fr/cp', validate);
            subject.sendPostCode(SITUATION);
            httpMock.flush();
        });
    });

    describe('sendPostCode()', function() {
        it('should not send anything if no research ID is set', function() {
            subject.sendResults(SITUATION, {});
        });

        it('should send data if a research ID is set', function() {
            location.search({ eid: EID });
            browserController.poll();

            httpMock.expectPOST('https://mes-droits.fr/it');
            subject.sendVisitedPage();
            httpMock.flush();
        });
    });
});
