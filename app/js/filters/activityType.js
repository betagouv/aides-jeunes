'use strict';

var hasType = function(activity) {
    return (!activity || !activity.type);
};

var getState = function(content) {
    switch (content.state) {
        case 'validated':
            return {label: 'Validation', icon: 'check'};
        case 'rejected':
            return {label: 'Rejet', icon: 'remove'};
        case 'pending':
            return {label: 'En attente', icon: 'clock-o'};
    }
};

var getActivityType = function(activity) {
    switch (activity.type) {
        case 'validation_update':
            var state = getState(activity.content);
            return state;
        case 'results_update':
            return {label: 'Nouveau résultat', icon: 'edit'}; // thumbs-up || thumbs-down
        case 'update':
            return {label: 'Modification', icon: 'edit'};
        case 'creation':
            return {label: 'Création', icon: 'plus'};
        case 'no-activity':
            return {label: 'Pas d\'activité enregistrée', icon: 'question'};
        default:
            return {label: 'Action inconnue', icon: 'question'};
    }
};

angular.module('ddsCommon')
    .filter('activityTypeLabelFilter', function() {
        return function(activity) {
            if (hasType(activity)) {
                return '';
            }

            var type = getActivityType(activity);
            return type.label;
        };
    })
    .filter('activityTypeIconFilter', function() {
        return function(activity) {
            if (hasType(activity)) {
                return '';
            }

            var type = getActivityType(activity);
            return type.icon;
        };
    });
