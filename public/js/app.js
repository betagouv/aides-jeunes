/* global document, $, _ */

var situation = {};

var typesDef = {

    radios: {
        build: function(qdef, group) {
            _.each(qdef.values, function(v) {
                var radioDiv = $(document.createElement('div'))
                    .addClass('radio')
                    .appendTo(group);

                var radioLabel = $(document.createElement('label'))
                    .appendTo(radioDiv);

                $(document.createElement('input'))
                    .attr('type', 'radio')
                    .attr('name', 'radioInput')
                    .attr('value', v)
                    .appendTo(radioLabel);

                $(document.createElement('span')).text(_.str.capitalize(v)).appendTo(radioLabel);
            });
        },
        pick: function(group) {
            return group.find('input:radio:checked').val();
        }
    },

    yesno: {
        build: function(qdef, group) {
            _.each(['oui', 'non'], function(v) {
                var radioDiv = $(document.createElement('div'))
                    .addClass('radio')
                    .appendTo(group);

                var radioLabel = $(document.createElement('label'))
                    .appendTo(radioDiv);

                $(document.createElement('input'))
                    .attr('type', 'radio')
                    .attr('name', 'radioInput')
                    .attr('value', v)
                    .appendTo(radioLabel);

                $(document.createElement('span')).text(_.str.capitalize(v)).appendTo(radioLabel);
            });
        },
        pick: function(group) {
            return group.find('input:radio:checked').val() === 'oui';
        }
    },

    date: {
        build: function(qdef, group) {
            $(document.createElement('input'))
                .addClass('input-lg form-control')
                .attr('type', 'date')
                .appendTo(group);
        },
        pick: function(group) {
            return group.find('input').val();
        }
    },

    number: {
        build: function(qdef, group) {
            $(document.createElement('input'))
                .addClass('input-lg form-control')
                .attr('type', 'number')
                .attr('placeholder', qdef.placeholder)
                .attr('default-value', 0)
                .appendTo(group);
        },
        pick: function(group) {
            return group.find('input').val() || group.find('input').attr('default-value');
        }
    }

};

function buildQuestion(key) {
    var qdef = questions[key];

    var q = $('#question');
    q.empty();

    var group = $(document.createElement('div'))
        .addClass('form-group')
        .appendTo(q);

    // Label
    $(document.createElement('label'))
        .text(qdef.label)
        .appendTo(group);

    // Input
    typesDef[qdef.type].build(qdef, group);

    // Next
    $(document.createElement('button'))
        .addClass('btn btn-primary btn-lg pull-right')
        .text('Suivant')
        .appendTo(q)
        .on('click', function() {
            var value = typesDef[qdef.type].pick(group);
            if (_.isUndefined(value)) return;
            situation[key] = value;
            processSituation();
        });
}

function updateSummary(s) {
    var summary = $('#situation');
    summary.empty();
    var p = [];

    var b1 = [];
    if (s['demandeur.âge']) b1.push('vous avez ' + s['demandeur.âge'] + ' ans');
    if (s['demandeur.situationFamiliale']) b1.push('vous êtes ' + s['demandeur.situationFamiliale']);
    if (b1.length > 0) p.push(_.str.capitalize(_.str.toSentence(b1, ', ', ' et ')) + '.');

    var b2 = [];
    if (s['demandeur.nbEnfantsÀCharge']) b2.push('vous avez ' + s['demandeur.nbEnfantsÀCharge'] + ' enfant(s) à charge');
    if (s['demandeur.enceinte']) b2.push('vous êtes enceinte');
    if (b2.length > 0) p.push(_.str.capitalize(_.str.toSentence(b2, ', ', ' et ')) + '.');

    var b3 = [];
    if (s['demandeur.parentIsolé']) b3.push('vous êtes considéré comme parentIsolé');
    if (b3.length > 0) p.push(_.str.capitalize(_.str.toSentence(b3, ', ', ' et ')) + '.');

    var b4 = [];
    if (s['demandeur.situationLogement']) b4.push('vous êtes ' + s['demandeur.situationLogement']);
    if (s['logement.loyer']) b4.push('vous payez un loyer ou une mensualité de ' + s['logement.loyer'] + ' euros');
    if (s['logement.parentPropriétaireLogementLoué']) b4.push('un parent est propriétaire de votre logement');
    if (b4.length > 0) p.push(_.str.capitalize(_.str.toSentence(b4, ', ', ' et ')) + '.');

    if (s.simulation) {
        var aides = {};
        _.forEach(s.simulation, function(v, k) {
            if (v > 0) aides[k] = v;
        });
        if (_.size(aides) === 0) {
            p.push('Selon nos informations, vous n\'avez droit à aucune aide.');
        } else {
            p.push('Selon nos informations, vous avez droit aux aides suivantes : ' + _.str.toSentence(_.map(aides, function(montant, aide) {
                return 'un <strong>' + aide + '</strong> de <strong>' + montant + ' euros</strong>';
            })));
        }
    }

    _.each(p, function(oneP) {
        summary.append($(document.createElement('p')).html(oneP));
    });
}

var questionKeys = _.keys(questions);

function processSituation() {
    $.ajax({
        type: 'POST',
        url: '/process',
        contentType: 'application/json',
        data: JSON.stringify({ situation: situation })
    }).done(function(data) {
        updateSummary(data.situation);

        var claimedValues = data.claimedValues;
        if (claimedValues.length === 0) return $('#question').text('Nous n\'avons plus de questions à vous poser.');

        var matchingQuestions = _.intersection(questionKeys, claimedValues);
        if (matchingQuestions.length === 0) return $('#question').text('Votre situation est incomplète mais cet outil ne nous permet pas d\'aller plus loin pour le moment.');
        if (matchingQuestions.length === 0) {
            
        } else {
            buildQuestion(matchingQuestions[0]);
        }
        
    });
}

$(function() {
    processSituation();
});
