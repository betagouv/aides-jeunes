var expect = require('expect');


describe('aides descriptions', function() {
    var subject = require('../../app/js/constants/droits');

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
                        expect(aide.shortLabel.length).toBeLessThanOrEqualTo(15);
                    });

                    it('should have a description', function() {
                        expect(aide.description).toBeA('string');
                        expect(aide.description.length).toBeGreaterThanOrEqualTo(190);
                        expect(aide.description.length).toBeLessThanOrEqualTo(420);
                    });

                    it('should have a link', function() {
                        expect(aide.link).toBeA('string');
                        expect(aide.link).toMatch(/^https?:\/\//);
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
});
