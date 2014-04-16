/* global document */

/*
** Module dependencies
*/
var $ = require('jquery');
var _ = require('lodash');
var _s = require('underscore.string');
var moment = require('moment');


exports.radios = {
    build: function(qdef, group) {
        _.each(qdef.values, function(v, k) {
            var radioDiv = $(document.createElement('div'))
                .addClass('radio')
                .appendTo(group);

            var radioLabel = $(document.createElement('label'))
                .appendTo(radioDiv);

            $(document.createElement('input'))
                .attr('type', 'radio')
                .attr('name', 'radioInput')
                .attr('value', k)
                .appendTo(radioLabel);

            $(document.createElement('span')).text(_s.capitalize(v)).appendTo(radioLabel);
        });
    },
    set: function(entity, attribute, group) {
        var val = group.find('input:radio:checked').val();
        if (!_.isUndefined(val)) entity.set(attribute, group.find('input:radio:checked').val());
    }
};

exports.yesno = {
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

            $(document.createElement('span')).text(_s.capitalize(v)).appendTo(radioLabel);
        });
    },
    set: function(entity, attribute, group) {
        entity.set(attribute, group.find('input:radio:checked').val() === 'oui');
    }
};

exports.date = {
    build: function(qdef, group) {
        $(document.createElement('input'))
            .addClass('input-lg form-control')
            .attr('type', 'date')
            .appendTo(group);
    },
    set: function(entity, attribute, group) {
        var val = group.find('input').val();
        if (!_.isUndefined(val)) entity.set(attribute, moment(val));
    }
};

exports.number = {
    build: function(qdef, group) {
        $(document.createElement('input'))
            .addClass('input-lg form-control')
            .attr('type', 'number')
            .attr('placeholder', qdef.placeholder)
            .attr('default-value', 0)
            .appendTo(group);
    },
    set: function(entity, attribute, group) {
        var val = group.find('input').val() || group.find('input').attr('default-value');
        if (!_.isUndefined(val)) entity.set(attribute, parseInt(val));
    }
};

exports.checkboxes = {
    build: function(qdef, group) {
        var values = qdef.values;
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

            $(document.createElement('span')).html(_s.capitalize(v)).appendTo(cbLabel);
        });
    },
    set: function(entity, attribute, group) {
        group.find('input:checkbox').each(function() {
            entity.set($(this).attr('name'), !!$(this).is(':checked'));
        });
        entity.set(attribute, true);
    }
};
