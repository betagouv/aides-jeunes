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
                description: '<strong>Ce formulaire est aussi obligatoire</strong>. Votre CMU-C sera gérée soit par votre caisse d’assurance maladie,\
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
        piecesJustificatives: [
            {
                id: 'vitale',
                label: 'Carte vitale et attestation',
                img: 'carte_vitale.jpg',
                description: 'Une photocopie de la carte vitale et l’attestation qui l’accompagne.\
                    Cette attestation peut être obtenue auprès de votre caisse d’assurance maladie,\
                    auprès d’une borne de votre caisse d’assurance maladie ou éventuellement via votre compte internet\
                    sur le site de votre caisse d’assurance maladie.'
            },
            {
                id: 'identite',
                label: 'Pièce d’identité',
                img: 'identite_passeport.jpg',
                description: 'Votre carte d’identité, ou votre passeport ou votre livret de famille à jour,\
                    revêtu de l’une des mentions prévues à l’article 28 du code civil.'
            },
            {
                id: 'regularite',
                label: 'Justificatif de régularité du séjour',
                img: 'titre_sejour.jpg',
                description: 'toute pièce justifiant la régularité du séjour (contrat de travail, attestation de\
                    chômage, titre de séjour, formulaires communautaires - E106 - E121/S1), récépissé\
                    de votre demande de titre, convocation ou rendez-vous en préfecture'
            },
            {
                id: 'livret_famille',
                label: 'Livret de famille',
                img: 'livret_famille.jpg',
                description: 'Votre livret de famille tenu à jour.\
                    Peut être remplacé par un certificat de concubinage ou une attestation d’enregistrement d’un PACS.',
                isIndividualized: false
            },
            {
                id: 'imposition',
                label: 'Avis d’imposition ou de non-imposition',
                img: 'impots.jpg',
                description: 'Derniers avis d’imposition ou de non-imposition.'
            },
            {
                id: 'bulletins_paie',
                label: 'Bulletins de paie',
                img: 'bulletin_paie.jpg',
                description: 'Les bulletins de paie sur l’année.'
            },
            {
                id: 'attestation_indemnites_chomage',
                label: 'Attestations d’indemnités de chômage',
                img: 'pole_emploi.png',
                description: 'Attestations d’indemnités de chômage.'
            },
            {
                id: 'taxe_fonciere',
                label: 'Avis de taxe foncière',
                img: 'taxe_fonciere.jpg',
                isIndividualized: false
            },
            {
                id: 'taxe_habitation',
                label: 'Avis de taxe d’habitation',
                img: 'taxe_habitation.jpg',
                isIndividualized: false
            },
            {
                id: 'stabilite_residence',
                label: 'Justificatif de stabilité de résidence',
                img: 'quittance.jpg',
                description: 'Toute pièce justifiant que vous résidez en France depuis plus de trois mois.\
                    Par exemple : bail de location, quittances de loyer, factures d’électricité consécutives,\
                    certificat d’hébergement, certificat de scolarité ou d’inscription universitaire…',
                isIndividualized: false
            }
        ]
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
            }
        ],
        piecesJustificatives: [
            {
                id: 'identite',
                label: 'Justificatif d’identité',
                img: 'identite_passeport.jpg',
                description: 'La photocopie lisible de l’un des documents suivants :\
                    carte nationale d’identité ou livret de famille ou\
                    passeport ou extrait d’acte de naissance ou carte\
                    d’ancien combattant ou carte d’invalidité.'
            },
            {
                id: 'titre_sejour',
                label: 'Titre de séjour',
                img: 'titre_sejour.jpg',
                description: 'La photocopie lisible du titre de séjour en cours de validité.'
            },
            {
                id: 'acte_naissance',
                label: 'Extrait d’acte de naissance',
                img: 'acte_naissance.jpg',
                description: 'Un extrait d’acte de naissance pour les personnes à charges de moins\
                    de 18 ans de nationalité étrangère et nées en France.'
            },
            {
                id: 'ofii',
                label: 'Certificat de l’OFII',
                img: 'ofii.jpg',
                description: 'Le certificat de l’OFII (ex. Anaem) délivré dans le cadre du regroupement familial,\
                    pour les personnes agées de moins de 18 ans, de nationalité étrangère et nées à l’étranger.'
            },
            {
                id: 'avis_paiement_pension_invalidite',
                label: 'Avis de paiement de pension d’invalidité',
                img: 'cheque.jpg',
                description: 'La photocopie lisible du dernier avis de paiement de la pension d’invalidité.'
            },
            {
                id: 'avis_paiement_retraite',
                label: 'Avis de paiement de pension de retraite',
                img: 'cheque.jpg',
                description: 'La photocopie lisible du dernier avis de paiement de la pension de retraite.'
            },
            {
                id: 'avis_paiement_rente_accident_travail',
                label: 'Avis de paiement d’indemnité accident du travail',
                img: 'cheque.jpg',
                description: 'La photocopie lisible du dernier avis de paiement de l’indemnité d’accident du travail.'
            },
            {
                id: 'declaration_revenus_saisonnier',
                label: 'Déclaration de revenus de travailleur saisonnier',
                img: 'declaration_revenus.jpg',
                description: 'La déclaration de revenus de l’année civile précédant la demande.'
            },
            {
                id: 'declaration_grossesse',
                label: 'Déclaration de grossesse',
                img: 'femme_enceinte.jpg',
                description: 'La déclaration de grossesse établie par le médecin.',
                isIndividualized: false
            },
            {
                id: 'rib',
                label: 'RIB',
                img: 'rib.png',
                description: 'Un relevé d’identité postal ou d’épargne ou bancaire, pour le paiement du RSA.',
                isIndividualized: false
            }
        ]
    }
]);
