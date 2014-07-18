var should = require('should');
var path = require('path');
var fs = require('fs');
var openfisca = require('../../lib/simulation/openfisca');

var testsPath = path.join(__dirname, 'rsa-tests');

describe('rsa', function() {
    fs.readdirSync(testsPath).forEach(function (file) {
        if (/(.*)\.(json$)/.test(file)) {
            describe(file, function() {
                var data = require(testsPath + '/' + file);
                if (data.expectedResults.exception) {
                    var expectedException = data.expectedResults.exception;
                    var test = function(done) {
                        openfisca.simulate(data, function(err, result) {
                            should.exist(err);
                            err.message.should.equal(expectedException);
                            done();
                        });
                    };
                    if (data.desactive) {
                        xit('should throw ' + expectedException, test);
                    } else {
                        it('should throw ' + expectedException, test);
                    }
                } else {
                    var expectedValue = data.expectedResults.rsa;
                    var test = function(done) {
                        openfisca.simulate(data, function(err, result) {
                            if (err) throw err;
                            result.rsa.should.be.approximately(expectedValue, 0.1);
                            done();
                        });
                    };
                    if (data.desactive) {
                        xit('should return ' + expectedValue, test);
                    } else {
                        it('should return ' + expectedValue, test);
                    }
                }
            });
        }
    });
});
