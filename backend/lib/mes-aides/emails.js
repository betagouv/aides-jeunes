var path = require('path');
var fs = require('fs');
var mjml = require('mjml');
var mustache = require('consolidate').mustache;
var _ = require('lodash');
var config = require('../../config');

var mjmlTemplate = fs.readFileSync(path.join(__dirname, 'email.mjml'), 'utf8');

exports.renderAsHtml = function(benefits) {

    console.log(benefits);

    return new Promise(function (resolve, reject) {

        var droits = _.map(benefits.droitsEligibles, function(droit) {

            var montant = '';
            if (_.isNumber(droit.montant)) {
                var unit = droit.unit || '€';
                var legend = droit.legend || (droit.isMontantAnnuel ? '/ an' : '/ mois');
                montant = `${droit.montant} ${unit} ${legend}`;
            }

            var ctaLink = '';
            var ctaLabel = '';
            if (droit.teleservice) {
                ctaLink = droit.teleservice;
                ctaLabel = 'Faire une demande en ligne';
            } else if (droit.form) {
                ctaLink = droit.form;
                ctaLabel = 'Accéder au formulaire papier';
            } else if (droit.instructions) {
                ctaLink = droit.instructions;
                ctaLabel = 'Accéder aux instructions';
            } else {
                ctaLink = droit.link;
                ctaLabel = 'Plus d\'informations';
            }

            return _.assign({}, droit, {
                montant: montant,
                ctaLink: ctaLink,
                ctaLabel: ctaLabel,
            })
        });

        var data = {
            droits: droits,
            baseURL: config.baseURL,
            returnURL: '#'
        };

        mustache.render(mjmlTemplate, data, function(err, templateString) {

            if (err) {
                return reject(err);
            }

            const output = mjml(templateString);

            // console.log(output.errors)

            resolve(output.html);
        });

    });
}
