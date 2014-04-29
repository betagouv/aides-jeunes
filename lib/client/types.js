/* global document */

/*
** Module dependencies
*/
var $ = require('jquery');
var _ = require('lodash');
var _s = require('underscore.string');
var moment = require('moment');

var checkboxesTmpl = require('./templates/checkboxes.handlebars');
var gridTmpl = require('./templates/grid.handlebars');


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
        if (!_.isUndefined(val) && moment(val).isValid()) entity.set(attribute, moment(val));
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
        group.append(checkboxesTmpl({ values: qdef.values }));
    },
    set: function(entity, attribute, group) {
        group.find('input:checkbox').each(function() {
            entity.set($(this).attr('name'), !!$(this).is(':checked'));
        });
        entity.set(attribute, true);
    }
};

exports.grid = {
    build: function(qdef, group, entity) {
        var data = {
            months: ['201401', '201402', '201405'],
            resourceTypes: _.isFunction(qdef.values) ? qdef.values(entity) : qdef.values
        };
        group.append(gridTmpl(data));
    },
    set: function(entity, attribute, group) {
        group.find('input').each(function() {
            var resourceType = $(this).data('resource-type');
            var period = $(this).data('period');
            var value = parseFloat($(this).val());
            var currentAttributeValue = entity.get(resourceType);

            if (currentAttributeValue === true) {
                currentAttributeValue = {};
                entity.set(resourceType, currentAttributeValue);
            } else if (currentAttributeValue === false) {
                return;
            }

            currentAttributeValue[period] = _.isNumber(value) ? value : 0;
        });
        entity.set(attribute, true);
    }
};
