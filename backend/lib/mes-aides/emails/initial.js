var fs = require('fs');
var mustache = require('consolidate').mustache;
var config = require('../../../config');

function basicBenefitText(b) {
    if (b.labelFunction) {
        return b.labelFunction(b);
    }

    if (b.type === 'bool') {
        return b.label;
    }

    return `${b.label} pour un montant de ${b.montant} € / ${b.isMontantAnnuel ? 'an' : 'mois'}`;
}

var textTemplate = fs.readFileSync('app/views/emails/initial.txt', 'utf8');
function render(followup) {
    return followup.situation.compute()
        .then(function (benefits) {
            return {
                benefitTexts: benefits.droitsEligibles.map(basicBenefitText),
                subject: `[${followup.situation._id}] Récapitulatif de votre simulation sur Mes-Aides.gouv.fr`,
                returnURL: `${config.baseURL}${followup.returnPath}`,
            };
        }).then(function(data) {
            return mustache.render(textTemplate, data)
                .then(text => {
                    return {
                        text: text,
                        subject: data.subject,
                    };
                });
        });
}

exports.render = render;
