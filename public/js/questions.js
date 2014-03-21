var questions = {

    'demandeur.dateDeNaissance': {
        type: 'date',
        label: 'Quelle est votre date de naissance ?'
    },

    'demandeur.situationFamiliale': {
        type: 'radios',
        label: 'Quelle est votre situation familiale actuelle ?',
        values: [
            'célibataire',
            'en couple',
            'pacsé(e)',
            'marié(e)',
            'divorcé(e)',
            'séparé(e)',
            'veuf/veuve'
        ]
    },

    'demandeur.situationLogement': {
        type: 'radios',
        label: 'Concernant votre logement, êtes-vous ?',
        values: [
            'locataire',
            'occupant à titre gratuit',
            'propriétaire',
            'sans domicile fixe'
        ]
    },

    'demandeur.nbEnfantsÀCharge': {
        type: 'number',
        label: 'Combien d\'enfants avez-vous à charge ?',
        placeholder: 'Aucun',
        defaultValue: 0
    },

    'demandeur.enceinte': {
        type: 'yesno',
        label: 'Attendez-vous un enfant ?'
    },

    'logement.emprunt': {
        type: 'yesno',
        label: 'Remboursez-vous un emprunt financer votre logement ?'
    },

    'logement.parentPropriétaireLogementLoué': {
        type: 'yesno',
        label: 'Un membre de votre famille est-il le propriétaire de votre logement ?'
    }

};
