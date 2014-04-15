/* global window, document */

/*
** Module depdendencies
*/
var moment = require('moment');
var $ = require('jquery');
var Situation = require('../situation');
var questions = require('./questions');
var typesDef = require('./types');

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

var labelMap = {
    Person: 'Vous',
    Dwelling: 'Votre logement'
};


function buildQuestion(qdef, entity, attribute) {
    var q = $('#question');
    var qTitle = $('#question-title');

    qTitle.html('<span class="fa fa-' + iconMap[entity.constructor.name] + '"></span> ' + labelMap[entity.constructor.name]);

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
    typesDef[qdef.type].build(qdef, group);

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
    return $.getJSON('/api/situations/' + situationId + '/simulation').done(function(response) {
        console.log(response);
    });
}

function processSituation() {
    var result = {};
    try {
        var demandeur = situation.person('demandeur');
        result.RSA = demandeur.get('éligibleRSA');
        result.AL = demandeur.get('éligibleAideAuLogement');
        $('#question').text((result.RSA ? 'Vous êtes éligible au RSA.' : 'Vous n\'êtes pas éligible au RSA.') + ' ' + (result.AL ? 'Vous êtes éligible aux AL.' : 'Vous n\'êtes pas éligible aux AL.'));
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
    saveSituation().done(function() {
        simulate();
    });

}

$(function() {
    getSituation().always(function() {
        processSituation();
    });
});
