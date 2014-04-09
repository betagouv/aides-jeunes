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

    'demandeur.revenus': {
        type: 'checkboxes',
        label: 'Au cours des 3 derniers mois, cochez la ou les situations qui vous concernent :',
        sub: 'Laissez vide si aucune des situations ne vous correspond',
        values: function(situation) {
            var values = {
                'demandeur.travailSalarié': 'Vous avez travaillé.',
                'demandeur.rsa': 'Vous avez perçu le RSA.',
                'demandeur.allocationsChômage': 'Vous avez perçu des allocations chômage.',
                'demandeur.pensionAlimentaire': 'Vous avez perçu une pension alimentaire.'
            };
            if (situation['demandeur.âge'] && situation['demandeur.âge'] > 32) { // Militaire 17 ans + 15 ans de service
                values['demandeur.pensionRetraite'] = 'Vous avez perçu une pension retraite';
            }
            return values;
        }
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

   'logement.codePostal': {
        type: 'number',
        label: 'Quel est le code postal de votre lieu de résidence ?'
    },

    'demandeur.salaire3DerniersMois': {
        type: 'number',
        label: 'En moyenne, quel revenu mensuel avez-vous perçu au cours des 3 derniers mois ?',
        defaultValue: 0,
        placeholder: 'Aucun'
    },

    'demandeur.travailSalarié': {
        type: 'number',
        label: 'En moyenne, quel salaire mensuel avez-vous perçu au cours des 3 derniers mois ?',
        defaultValue: 0,
        placeholder: 'Aucun'
    },

    'demandeur.rsa': {
        type: 'number',
        label: 'À combien s\'élève le RSA que vous percevez chaque mois ?',
        defaultValue: 0,
        placeholder: 'Aucun'
    },

    'demandeur.allocationsChômage': {
        type: 'number',
        label: 'En moyenne, quel est le montant mensuel de l\'allocation chômage que vous avez perçu au cours des 3 derniers mois ?',
        defaultValue: 0,
        placeholder: 'Aucun'
    },

   'demandeur.pensionRetraite': {
        type: 'number',
        label: 'Quel est le montant de votre pension retraire ?',
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
