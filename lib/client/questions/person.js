exports.birthdate = {
    type: 'date',
    label: 'Quelle est votre date de naissance ?'
};

exports.maritalStatus = {
    type: 'radios',
    label: 'Quelle est votre situation familiale actuelle ?',
    values: [
        'single',
        'cohabiting',
        'civil union',
        'married'
    ]
};

exports.occupancyStatus = {
    type: 'radios',
    label: 'Concernant votre logement, êtes-vous ?',
    values: [
        'tenant',
        'owner',
        'free occupant',
        'homeless'
    ]
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
