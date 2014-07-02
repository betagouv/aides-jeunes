var should = require('should');
var openfisca = require('../../lib/simulation/openfisca');

describe('rsa', function() {

    describe('etudiant-seul', function() {
        var data = require('./rsa-tests/etudiant-seul.json');
        var expectedValue = data.expectedResults.rsa;

        it('should return ' + expectedValue, function(done) {
            openfisca.simulate(data, function(err, result) {
                if (err) throw err;
                result.rsa.should.equal(expectedValue);
                done();
            });
        });
    });

    describe('chomeur-1enfant-locataire', function() {
        var data = require('./rsa-tests/chomeur-1enfant-locataire.json');
        var expectedValue = data.expectedResults.rsa;

        it('should return ' + expectedValue, function(done) {
            openfisca.simulate(data, function(err, result) {
                if (err) throw err;
                result.rsa.should.equal(expectedValue);
                done();
            });
        });
    });

});
