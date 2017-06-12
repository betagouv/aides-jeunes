var expect = require('expect');
var https = require('https');


describe('aides descriptions', function() {
    var subject = require('../../app/js/constants/droits.js');

    Object.keys(subject.prestationsNationales).forEach(function(providerName) {
        describe(providerName, function() {
            var provider = subject.prestationsNationales[providerName];

            it('should have a label', function() {
                expect(provider.label).toBeA('string');
                expect(provider.label.length).toBeGreaterThan(1);
            });

            Object.keys(provider.prestations).forEach(function(aideName) {
                describe(aideName, function() {
                    var aide = provider.prestations[aideName];

                    it('should have a label', function() {
                        expect(aide.label).toBeA('string');
                        expect(aide.label.length).toBeGreaterThan(1);
                    });

                    it('should have a shortLabel', function() {
                        expect(aide.shortLabel).toBeA('string');
                        expect(aide.shortLabel.length).toBeGreaterThan(1);
                        expect(aide.shortLabel.length).toBeLessThanOrEqualTo(10);
                    });

                    it('should have a description', function() {
                        expect(aide.description).toBeA('string');
                        expect(aide.description.length).toBeGreaterThanOrEqualTo(220);
                        expect(aide.description.length).toBeLessThanOrEqualTo(420);
                    });

                    it('should have a link', function() {
                        expect(aide.link).toBeA('string');
                        expect(aide.link).toMatch(/^https?:\/\//);
                    });

                    it('should have a teleservice, a form, or instructions', function() {
                        expect(aide.teleservice || aide.form || aide.instructions).toBeA('string');
                    });

                    it('should reflect OpenFisca description', function(done) {
                        https.get(`https://api-test.openfisca.fr/variable/${aideName}`, res => {
                            res.setEncoding('utf8');
                            let rawData = '';
                            res.on('data', (chunk) => { rawData += chunk; });
                            res.on('end', () => {
                                const parsedData = JSON.parse(rawData);
                                expect((aide.type || 'Float').toLowerCase()).toEqual(parsedData.valueType.toLowerCase());
                                expect((aide.entity || 'famille').toLowerCase()).toEqual(parsedData.entity);
                                done();
                            });
                        });
                    });
                });
            });
        });
    });
});
