/* global window, document */

/*
** Module depdendencies
*/
var moment = require('moment');
var _ = require('lodash');
var $ = require('jquery');
var Situation = require('../situation');
var questions = require('./questions');
var typesDef = require('./types');
var situationTmpl = require('./templates/situation.handlebars');

/*
** Configuration
*/
moment.lang('fr');

var situationId = window.situationId;
var situation = new Situation(situationId);

var iconMap = {
    Person: 'user',
    Dwelling: 'home'
};

function updateHeader(icon, label) {
    $('#question-title').html('<span class="fa fa-' + icon + '"></span> ' + label);
}

function buildQuestion(qdef, entity, attribute) {
    var q = $('#question');

    var label, icon = iconMap[entity.constructor.name];
    if (entity.constructor.name === 'Dwelling') label = 'Votre logement';
    else if (entity.id === 'demandeur') label = 'Vous';
    else if (entity.id === 'demandeur.conjoint') label = 'Votre conjoint';
    else label = 'Enfant : ' + entity.id;
    updateHeader(icon, label);

    q.empty();

    var group = $(document.createElement('div'))
        .addClass('form-group')
        .appendTo(q);

    // Label
    $(document.createElement('label'))
        .text(qdef.label)
        .appendTo(group);

    // Sub
    if (qdef.sub) {
        $(document.createElement('p'))
            .html('<em>' + qdef.sub + '</em><br>&nbsp;')
            .appendTo(group);
    }

    // Input
    typesDef[qdef.type].build(qdef, group, entity);

    // Next
    $(document.createElement('button'))
        .addClass('btn btn-primary btn-lg pull-right')
        .text('Suivant')
        .appendTo(q)
        .on('click', function() {
            typesDef[qdef.type].set(entity, attribute, group);
            processSituation();
        });
}

function getSituation() {
    return $.getJSON('/api/situations/' + situationId).done(function(response) {
        situation.import(response);
    }).fail(function() {
        situation.person('demandeur');
    });
}

function saveSituation() {
    return $.ajax({
        url: '/api/situations/' + situationId,
        method: 'PUT',
        data: JSON.stringify(situation.toJSON()),
        contentType: 'application/json'
    }).done(function(response) {
        situation.import(response);
    });
}

function simulate() {
    return $.getJSON('/api/situations/' + situationId + '/simulation').then(function(response) {
        return _.mapValues(response, function(val, key) {
            return val ? val.toFixed(2) : 0;
        });
    });
}

function buildSituation(eligib, result) {
    var newEligib = result.RSA || result.ASPA || result.ALE || result.ALF || result.ALS || result.APL;
    $('#question').html(situationTmpl({ eligib: newEligib, result: result }));
}

function processSituation() {
    var demandeur = situation.person('demandeur');
    var eligib = {};

    saveSituation().done(function() {
        try {
            eligib.RSA = demandeur.claim('éligibleRSA');
            eligib.AL = demandeur.claim('éligibleAideAuLogement');
            eligib.ok = true;
            simulate().done(function(result) {
                if (!eligib.ok) return;
                updateHeader('flag-checkered', 'Votre situation');
                buildSituation(eligib, result);
            });
        } catch (e) {
            if (!(e instanceof Situation.ComputingError)) throw e;

            console.log(e);

            var q, claimedAttribute = e.claimedAttributes[0];

            if (e.entity instanceof Situation.Person) {
                q = questions.Person[claimedAttribute];
            } else if (e.entity instanceof Situation.Dwelling) {
                q = questions.Dwelling[claimedAttribute];
            }

            if (q) buildQuestion(q, e.entity, claimedAttribute);
            else {
                $('#question').text('Votre situation est incomplète mais cet outil ne nous permet pas d\'aller plus loin pour le moment.');
                console.log(situation);
            }
        }
    });

}

$(function() {
    getSituation().always(function() {
        processSituation();
    });
});
