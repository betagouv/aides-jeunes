var activityStatusList = require('../../situation/status');
var resourceTypeList = require('../../situation/resources');
var _ = require('lodash');

exports.birthdate = {
    type: 'date',
    label: 'Quelle est votre date de naissance ?'
};

exports.maritalStatus = {
    type: 'radios',
    label: 'Quelle est votre situation familiale actuelle ?',
    values: {
        'single': 'Seul',
        'cohabiting': 'En couple',
        'civil union': 'Pacsé(e)',
        'married': 'Marié(e)'
    }
};

exports.occupancyStatus = {
    type: 'radios',
    label: 'Concernant votre logement, êtes-vous ?',
    values: {
        'tenant': 'Locataire',
        'owner': 'Propriétaire',
        'free occupant': 'Occupant à titre gratuit',
        'homeless': 'Sans domicile fixe'
    }
};

exports.numChildren = {
    type: 'number',
    label: 'Combien d\'enfants avez-vous à charge ?',
    placeholder: 'Aucun',
    defaultValue: 0
};

exports.pregnant = {
    type: 'yesno',
    label: 'Attendez-vous un enfant ?'
};

exports.studentScholarship = {
    type: 'yesno',
    label: 'Percevez-vous une bourse de l\'enseignement supérieur ?'
};

exports.allEligibleResourcesDefined = {
    type: 'checkboxes',
    label: 'Au cours des 3 derniers mois, quels types de ressources avez-vous perçus ?',
    sub: 'Vous pouvez cochez plusieurs cases, ou aucune.',
    values: _.mapValues(resourceTypeList, function(resourceType) { return resourceType.label; })
};

exports.allEligibleResources3Months = {
    type: 'grid',
    label: 'Saisissez les ressources que vous avez perçu au cours des 3 derniers mois.',
    sub: 'Vous pouvez laissez des cases vides (valeur zéro).',
    values: function(entity) {
        var values = {};
        _.forEach(resourceTypeList, function(resourceType, name) {
            var entityValue = entity.read(name);
            if (!entityValue) return;
            values[name] = { label: resourceType.label, m1: null, m2: null, m3: null };
        });
        return values;
    }
};

exports.allEligibleStatusDefined = {
    type: 'checkboxes',
    label: 'Quelle est votre situation actuelle ?',
    sub: 'Vous pouvez cochez plusieurs situations, ou aucune.',
    values: _.mapValues(activityStatusList, function(status) { return status.label; })
};
