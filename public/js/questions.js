var questions = {

    'demandeur.dateDeNaissance': {
        type: 'date',
        label: 'Quelle est votre date de naissance ?'
    },

    'demandeur.situationFamiliale': {
        type: 'radios',
        label: 'Quelle est votre situation familiale actuelle ?',
        values: [
            'seul',
            'en couple (concubinage)',
            'en couple (mariage ou PACS)'
        ]
    },

    'demandeur.situationPro': {
        type: 'radios',
        label: 'Quelle est votre situation professionnelle actuelle ?',
        values: [
            'salarié',
            'travailleur non-salarié',
            'demandeur d\'emploi',
            'apprenti',
            'conjoint collaborateur',
            'retraité',
            'étudiant, autre inactif'
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

    'logement.loyer': {
        type: 'number',
        label: 'À combien s\'élève votre loyer (ou votre mensualité d\'emprunt) ?',
        defaultValue: 0
    },

    'demandeur.salaire3DerniersMois': {
        type: 'number',
        label: 'En moyenne, quel revenu mensuel avez-vous perçu au cours des 3 derniers mois ?',
        defaultValue: 0,
        placeholder: 'Aucun'
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
