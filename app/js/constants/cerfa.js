'use strict';

/*jshint multistr: true */

angular.module('ddsApp').constant('cerfaForms', [
    {
        droitId: 'cmu_c',
        description: 'Le dossier doit être envoyé à la caisse d\'assurance maladie dont vous dépendez.\
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
                label: 'Formulaire de choix de l\'organisme (demandeur)',
                description: '<strong>Ce formulaire est aussi obligatoire</strong>. Votre CMU-C sera gérée soit par votre caisse d’assurance maladie,\
                    soit par un organisme complémentaire inscrit sur une liste nationale que vous trouverez sur\
                    <a href="http://www.cmu.fr/liste-organismes-complementaires.php">ce lien</a>.'
            },
            {
                id: 'cmuc_choix_organisme_non_demandeur',
                label: 'Formulaire de choix de l\'organisme (autres membres du foyer)',
                description: 'Ce formulaire facultatif est à remplir, pour les autres membres du foyer,\
                    uniquement en cas de choix de l\'organisme différent de celui du demandeur.'
            }
        ],
        piecesJustificatives: [
            {
                id: 'vitale',
                label: 'Carte vitale et attestation',
                img: 'carte_vitale.jpg',
                description: 'Une photocopie de votre carte vitale et l’attestation qui l’accompagne.\
                    Cette attestation peut être obtenue auprès de votre caisse d’assurance maladie,\
                    auprès d’une borne de votre caisse d’assurance maladie ou éventuellement via votre compte internet\
                    sur le site de votre caisse d’assurance maladie.'
            },
            {
                id: 'identite',
                label: 'Pièce d\'identité',
                img: 'identite_passeport.jpg',
                description: 'Votre carte d’identité, ou votre passeport ou votre livret de famille à jour,\
                    revêtu de l\'une des mentions prévues à l\'article 28 du code civil.'
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
                img: 'livret_de_famille.jpg',
                description: 'Si vous avez des personnes à charge, vous devez inclure\
                    votre livret de famille tenu à jour, ou votre certificat de concubinage ou l’attestation d’enregistrement d’un PACS.',
                isIndividualized: false
            },
            {
                id: 'ressources',
                label: 'Justificatif de ressources',
                img: 'impots.jpg',
                description: 'Avis d’imposition ou de non imposition,\
                    bulletins de paie,\
                    attestations d’indemnités de chômage,\
                    déclarations de revenus et leurs annexes à l’administration des impôts,\
                    avis de taxe foncière, de taxe locale d’habitation,\
                    attestations des banques concernant les revenus d’épargne...'
            },
            {
                id: 'stabilite_residence',
                label: 'Justificatif de stabilité de résidence',
                img: 'quittance.jpg',
                description: 'Toute pièce justifiant que vous résidez en France depuis plus de trois mois.\
                    Par exemple : bail de location, quittances de loyer, factures d\'électricité consécutives,\
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
            Pour plus d\'informations, vous pouvez consulter\
            <a href="http://www.social-sante.gouv.fr/espaces,770/handicap-exclusion,775/dossiers,806/le-rsa,2302/le-revenu-de-solidarite-active,2279/quelles-sont-les-demarches-a,14882.html">ce lien</a>.',
        forms: [
            {
                id: 'rsa_demande',
                label: 'Formulaire de demande'
            }
        ],
        piecesJustificatives: [
            {
                id: 'identite',
                label: 'Justificatif d\'identité',
                img: 'identite_passeport.jpg',
                description: 'La photocopie lisible, pour chacun des membres de votre foyer de nationalité EEE,\
                    de l\'un des documents suivants :\
                    carte nationale d’identité ou livret de famille ou\
                    passeport ou extrait d’acte de naissance ou carte\
                    d’ancien combattant ou carte d’invalidité.'
            },
            {
                label: 'Titre de séjour',
                img: 'titre_sejour.jpg',
                description: 'Le titre de séjour de toutes les personnes de votre foyer qui ne sont pas de nationalité EEE.'
            },
            {
                label: 'Extrait d\'acte de naissance',
                img: 'acte_naissance.jpg',
                description: 'Un extrait d\'acte de naissance pour les personnes à charges de moins\
                    de 18 ans de nationalité étrangère et nées en France.'
            },
            {
                label: 'Certificat de l\'OFII',
                img: 'ofii.jpg',
                description: 'Le certificat de l\'OFII (ex. Anaem) délivré dans le cadre du regroupement familial.'
            }
        ]
    }
]);
