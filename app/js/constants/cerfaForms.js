'use strict';

/* jshint multistr: true */

angular.module('ddsApp').constant('cerfaForms', [
    {
        droitId: 'cmu_c',
        description: 'Le dossier doit être envoyé à la caisse d’assurance maladie dont vous dépendez.\
            Il peut être envoyé par courrier ou être déposé directement à votre caisse d’assurance maladie.\
            Pour obtenir l’adresse de votre caisse d’assurance maladie, <a href="http://www.cmu.fr/liste-caisses.php">cliquez ici</a>.',
        forms: [
            {
                id: 'cmuc_demande',
                label: 'Formulaire de demande',
                description: 'Ce formulaire est obligatoire. Il faut le remplir une seule fois pour l’ensemble du foyer.'
            },
            {
                id: 'cmuc_choix_organisme_demandeur',
                label: 'Formulaire de choix de l’organisme (demandeur)',
                description: '<strong>Ce formulaire est aussi obligatoire</strong>. Votre CMU-C/ACS sera gérée soit par votre caisse d’assurance maladie,\
                    soit par un organisme complémentaire inscrit sur une liste nationale que vous trouverez sur\
                    <a href="http://www.cmu.fr/liste-organismes-complementaires.php">ce lien</a>.'
            },
            {
                id: 'cmuc_choix_organisme_non_demandeur',
                label: 'Formulaire de choix de l’organisme (autres membres du foyer)',
                description: 'Ce formulaire facultatif est à remplir, pour les autres membres du foyer,\
                    uniquement en cas de choix de l’organisme différent de celui du demandeur.'
            }
        ],
        piecesJustificatives: ['vitale', 'identite', 'regularite', 'livret_famille', 'imposition', 'bulletins_paie', 'attestation_indemnites_chomage', 'taxe_fonciere', 'taxe_habitation', 'stabilite_residence']
    },
    {
        droitId: 'rsa',
        description: 'Vous devez déposer votre demande auprès de l’un des organismes instructeurs de votre choix prévus par la loi :\
            Caisse d’allocations familiales (CAF), Mutualité sociale agricole (MSA), services du Conseil général,\
            Centre communal d’action sociale (CCAS) ou Centre intercommunal d’action sociale (CIAS) volontaires\
            ou bien une association ou un organisme à but non lucratif ayant reçu délégation du Conseil général.\
            Pour plus d’informations, vous pouvez consulter\
            <a href="http://www.social-sante.gouv.fr/espaces,770/handicap-exclusion,775/dossiers,806/le-rsa,2302/le-revenu-de-solidarite-active,2279/quelles-sont-les-demarches-a,14882.html">ce lien</a>.',
        forms: [
            {
                id: 'rsa_demande',
                label: 'Formulaire de demande'
            },
            {
                id: 'rsa_non_salarie',
                label: 'Formulaire complémentaire pour les non-salariés'
            },
            {
                id: 'rsa_moins_25',
                label: 'Formulaire complémentaire pour les moins de 25 ans'
            }
        ],
        piecesJustificatives: ['identite', 'titre_sejour', 'acte_naissance', 'ofii', 'avis_paiement_pension_invalidite', 'avis_paiement_retraite', 'avis_paiement_rente_accident_travail', 'declaration_revenus_saisonnier', 'declaration_grossesse', 'rib']
    },
    {
        droitId: 'aspa',
        description: '',
        forms: [
            {
                id: 'aspa',
                label: 'Formulaire de demande'
            }
        ],
        piecesJustificatives: ['imposition', 'domicile', 'titre_sejour']
    },
    {
        droitId: 'al',
        description: '',
        forms: [
            {
                id: 'caf_demande_aide_logement',
                label: 'Formulaire de demande'
            },
            {
                id: 'caf_declaration_situation',
                label: 'Déclaration de situation'
            },
            {
                id: 'caf_declaration_ressources',
                label: 'Déclaration de ressources'
            },
            {
                id: 'caf_attestation_loyer',
                label: 'Attestation de loyer'
            },
            {
                id: 'caf_attestation_pret',
                label: 'Certificat de prêt'
            },
            {
                id: 'caf_attestation_residence_foyer',
                label: 'Attestation de résidence en foyer'
            }
        ],
        piecesJustificatives: ['rib', 'declaration_grossesse', 'attestation_chomage_partiel', 'identite', 'titre_sejour', 'ofii']
    }
]);
