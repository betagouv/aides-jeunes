/* global document, $, _, moment, questions */

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
        set: function(situation, key, group) {
            var val = group.find('input:radio:checked').val();
            if (!_.isUndefined(val)) situation[key] = group.find('input:radio:checked').val();
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
        set: function(situation, key, group) {
            situation[key] = group.find('input:radio:checked').val() === 'oui';
        }
    },

    date: {
        build: function(qdef, group) {
            $(document.createElement('input'))
                .addClass('input-lg form-control')
                .attr('type', 'date')
                .appendTo(group);
        },
        set: function(situation, key, group) {
            var val = group.find('input').val();
            if (!_.isUndefined(val)) situation[key] = moment(val);
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
        set: function(situation, key, group) {
            var val = group.find('input').val() || group.find('input').attr('default-value');
            if (!_.isUndefined(val)) situation[key] = parseInt(val);
        }
    },

    checkboxes: {
        build: function(qdef, group) {
            var values = _.isFunction(qdef.values) ? qdef.values(situation) : qdef.values;
            _.each(values, function(v, k) {
                var cbDiv = $(document.createElement('div'))
                    .addClass('checkbox')
                    .appendTo(group);

                var cbLabel = $(document.createElement('label'))
                    .appendTo(cbDiv);

                $(document.createElement('input'))
                    .attr('type', 'checkbox')
                    .attr('name', k)
                    .attr('value', v)
                    .appendTo(cbLabel);

                $(document.createElement('span')).html(_.str.capitalize(v)).appendTo(cbLabel);
            });
        },
        set: function(situation, key, group) {
            var one = false;
            group.find('input:checkbox').each(function() {
                var val = !!$(this).is(':checked');
                situation[$(this).attr('name')] = val;
                if (val) one = true;
            });
            if (one) situation[key] = true;
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
            typesDef[qdef.type].set(situation, key, group);
            processSituation();
        });
}

function updateSummary() {
    var s = situation;
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
    if (s['demandeur.parentIsolé']) b3.push('vous êtes considéré comme parent isolé');
    if (b3.length > 0) p.push(_.str.capitalize(_.str.toSentence(b3, ', ', ' et ')) + '.');

    var b4 = [];
    if (s['demandeur.situationLogement']) b4.push('vous êtes ' + s['demandeur.situationLogement']);
    if (s['logement.loyer']) b4.push('vous payez un loyer ou une mensualité de ' + s['logement.loyer'] + ' euros');
    if (s['logement.parentPropriétaireLogementLoué']) b4.push('un parent est propriétaire de votre logement');
    if (b4.length > 0) p.push(_.str.capitalize(_.str.toSentence(b4, ', ', ' et ')) + '.');

    var b5 = [];
    if (s['demandeur.situationPro']) b5.push('vous êtes ' + s['demandeur.situationPro']);
    if (s['demandeur.travailSalarié']) b5.push('vous avez perçu en moyenne ' + s['demandeur.travailSalarié'] + ' euros au cours des 3 derniers mois');
    if (b5.length > 0) p.push(_.str.capitalize(_.str.toSentence(b5, ', ', ' et ')) + '.');

    var b6 = [];
    if (s['prestationFictive.baseRessources']) b6.push('La base de calcul de vos prestation est de ' + s['prestationFictive.baseRessources'] + ' euros');
    if (b6.length > 0) p.push(_.str.capitalize(_.str.toSentence(b6, ', ', ' et ')) + '.');

    if (s.simulation) {
        var aides = {};
        _.forEach(s.simulation, function(v, k) {
            if (v > 0) aides[k] = v;
        });
        if (_.size(aides) === 0) {
            p.push('Selon nos informations, vous n\'avez droit à aucune aide.');
        } else {
            p.push('Selon nos informations, vous avez potentiellement droit aux aides suivantes : ' + _.str.toSentence(_.map(aides, function(montant, aide) {
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
        _.extend(situation, data.situation);
        updateSummary();

        var claimedValues = data.claimedValues;
        if (!claimedValues || claimedValues.length === 0) return $('#question').text('Nous n\'avons plus de questions à vous poser.');

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
