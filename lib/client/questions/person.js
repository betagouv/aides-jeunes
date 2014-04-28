var activityStatusList = require('../../situation/status');
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

exports.allEligibleStatusDefined = {
    type: 'checkboxes',
    label: 'Quelle est votre situation actuelle ?',
    sub: 'Vous pouvez cochez plusieurs situations, ou aucune.',
    values: _.mapValues(activityStatusList, function(status) { return status.label; })
};
