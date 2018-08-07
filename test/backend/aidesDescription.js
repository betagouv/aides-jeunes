var expect = require('expect');
var rp = require('request-promise');

describe('aides descriptions', function() {
    var subject = require('../../app/js/constants/droits');

    function testAids(aidLevel) {
        Object.keys(aidLevel).forEach(function(providerName) {
            describe(providerName, function() {
                var provider = aidLevel[providerName];

                it('should have a label', function() {
                    expect(provider.label).toBeA('string');
                    expect(provider.label.length).toBeGreaterThan(1);
                });
                //console.log(aidLevel)
                Object.keys(provider.prestations).forEach(function(aideName) {
                    describe(aideName, function() {
                        var aide = provider.prestations[aideName];

                        it('should have a label', function() {
                            expect(aide.label).toBeA('string');
                            expect(aide.label.length).toBeGreaterThan(1);
                        });

                        it('should have a description', function() {
                            expect(aide.description).toBeA('string');
                            expect(aide.description.length).toBeGreaterThanOrEqualTo(190);
                            expect(aide.description.length).toBeLessThanOrEqualTo(465);
                        });

                        it('should have a valid link', function(done) {
                            expect(aide.link).toBeA('string');
                            expect(aide.link).toMatch(/^https?:\/\//);

                            this.timeout(5000);
                            rp({
                                uri: aide.link,
                                resolveWithFullResponse: true,
                            })
                            .then(function(response) {
                                expect(response.statusCode).toEqual(200);
                            })
                            .catch(function(err) {
                                expect(err).toEqual(null);
                            })
                            .finally(done);

                        });

                        if (aide.isExperimental) {
                            it('should have an internal link', function() {
                                expect(aide.internalLink).toBeA('string');
                            });
                        } else {
                            it('should have a teleservice, a form, or instructions', function() {
                                expect(aide.teleservice || aide.form || aide.instructions).toBeA('string');
                            });
                        }
                    });
                });
            });
        });
    }

    testAids(subject.prestationsNationales);
    testAids(subject.partenairesLocaux);
});
