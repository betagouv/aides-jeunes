var fs = require('fs');
var path = require('path');
var mustache = require('consolidate').mustache;
var config = require('../../../config');

var textTemplate = fs.readFileSync(path.join(__dirname, 'templates/survey.txt'), 'utf8');

function renderAsText(followup) {

    var data = {
        returnURL: `${config.baseURL}${followup.surveyPath}`,
    };

    return mustache.render(textTemplate, data);
}

function render(followup) {

    return Promise.all([
        renderAsText(followup),
        // renderAsHtml(followup)
    ]).then(function (values) {
        return {
            subject: `[${followup.situation._id}] Votre simulation sur Mes-Aides.gouv.fr vous a-t-elle été utile ?`,
            text: values[0],
            // html: values[1].html,
            // attachments: values[1].attachments,
        };
    });
}

exports.render = render;
