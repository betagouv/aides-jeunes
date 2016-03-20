'use strict';

/* jshint multistr: true */

angular.module('ddsApp').constant('cerfaForms', {
    cmu_c: {
        description: 'Le dossier doit être envoyé à la caisse d’assurance maladie dont vous dépendez.\
            Il peut être envoyé par courrier ou être déposé directement à votre caisse d’assurance maladie.\
            Pour obtenir l’adresse de votre caisse d’assurance maladie, <a href="http://www.cmu.fr/liste-caisses.php">cliquez ici</a>.',
        forms: {
            cmuc_demande: {
                label: 'Formulaire de demande',
                url: 'http://www.ameli.fr/fileadmin/user_upload/formulaires/S3711.pdf',
                description: 'Ce formulaire est obligatoire. Il faut le remplir une seule fois pour l’ensemble du foyer.'
            },
            cmuc_choix_organisme_demandeur: {
                label: 'Formulaire de choix de l’organisme (demandeur)',
                url: '',
                description: '<strong>Ce formulaire est aussi obligatoire</strong>. Votre CMU-C/ACS sera gérée soit par votre caisse d’assurance maladie,\
                    soit par un organisme complémentaire inscrit sur une liste nationale que vous trouverez sur\
                    <a href="http://www.cmu.fr/liste-organismes-complementaires.php">ce lien</a>.'
            },
            cmuc_choix_organisme_non_demandeur: {
                label: 'Formulaire de choix de l’organisme (autres membres du foyer)',
                url: '',
                description: 'Ce formulaire facultatif est à remplir, pour les autres membres du foyer,\
                    uniquement en cas de choix de l’organisme différent de celui du demandeur.'
            }
        },
        piecesJustificatives: [
            'vitale',
            'identite',
            'regularite',
            'livret_famille',
            'imposition',
            'bulletins_paie',
            'attestation_indemnites_chomage',
            'taxe_fonciere',
            'taxe_habitation',
            'stabilite_residence'
        ]
    },
    rsa: {
        description: 'Vous devez déposer votre demande auprès de l’un des organismes instructeurs de votre choix prévus par la loi :\
            Caisse d’allocations familiales (CAF), Mutualité sociale agricole (MSA), services du Conseil départemental,\
            Centre communal d’action sociale (CCAS) ou Centre intercommunal d’action sociale (CIAS) volontaires\
            ou bien une association ou un organisme à but non lucratif ayant reçu délégation du Conseil départemental.\
            Pour plus d’informations, vous pouvez consulter\
            <a href="http://www.social-sante.gouv.fr/espaces,770/handicap-exclusion,775/dossiers,806/le-rsa,2302/le-revenu-de-solidarite-active,2279/quelles-sont-les-demarches-a,14882.html">ce lien</a>.',
        forms: {
            rsa_demande: {
                url: '',
                label: 'Formulaire de demande'
            },
            rsa_non_salarie: {
                url: '',
                label: 'Formulaire complémentaire pour les non-salariés'
            },
            rsa_moins_25: {
                url: '',
                label: 'Formulaire complémentaire pour les moins de 25 ans'
            }
        },
        piecesJustificatives: [
            'identite',
            'titre_sejour',
            'acte_naissance',
            'ofii',
            'avis_paiement_pension_invalidite',
            'avis_paiement_retraite',
            'avis_paiement_rente_accident_travail',
            'declaration_revenus_saisonnier',
            'declaration_grossesse',
            'rib',
            'taxe_habitation_patrimoine'
        ]
    },
    aspa: {
        description: '',
        forms: {
            aspa: {
                url: '',
                label: 'Formulaire de demande'
            }
        },
        piecesJustificatives: ['imposition', 'domicile', 'titre_sejour']
    },
});
