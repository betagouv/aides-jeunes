var expect = require('expect');
var https = require('https');

describe('ressource types', function() {
    var subject = require('../../app/js/constants/ressources.js').ressourceTypes;

    subject.forEach(function(ressource) {
        describe(ressource.id, function() {
            it('should reflect OpenFisca description', function(done) {
                https.get(`https://api-test.openfisca.fr/variable/${ressource.id}`, res => {
                    res.setEncoding('utf8');
                    let rawData = '';
                    res.on('data', (chunk) => { rawData += chunk; });
                    res.on('end', () => {
                        const parsedData = JSON.parse(rawData);
                        expect((ressource.entity || 'individu').toLowerCase()).toEqual(parsedData.entity);
                        done();
                    });
                });
            });
        });
    });
});
