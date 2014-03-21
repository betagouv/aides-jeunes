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

function updateSummary(situation) {
    var summary = $('#situation');
    summary.empty();
    _.each(situation, function(v, k) {
        v = _.isObject(v) ? JSON.stringify(v) : v;
        summary.append($(document.createElement('div')).text(k + ' : ' + v));
    });
}

function processSituation() {
    $.ajax({
        type: 'POST',
        url: '/process',
        contentType: 'application/json',
        data: JSON.stringify({ situation: situation })
    }).done(function(data) {
        updateSummary(data.situation);

        var claimedKeys = _.keys(data.claimedValues);
        if (claimedKeys.length === 0) return $('#question').text('Nous n\'avons plus de questions à vous poser.');

        var matchingQuestions = _.intersection(questionKeys, claimedKeys);
        if (matchingQuestions.length === 0) return $('#question').text('Votre situation est incomplète mais cet outil ne nous permet pas d\'aller plus loin pour le moment.');
        if (matchingQuestions.length === 0) {
            
        } else {
            buildQuestion(matchingQuestions[0]);
        }
        
    });
}

var questionKeys = _.keys(questions);

$(function() {
    processSituation();
});
