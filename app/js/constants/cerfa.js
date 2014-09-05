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
                label: 'Formulaire de demande'
            },
            {
                id: 'cmuc_choix_organisme_demandeur',
                label: 'Formulaire de choix de l\'organisme (demandeur)',
                description: 'Votre CMU-C sera gérée soit par votre caisse d’assurance maladie,\
                    soit par un organisme complémentaire inscrit sur une liste nationale que vous trouverez sur\
                    <a href="http://www.cmu.fr/liste-organismes-complementaires.php">ce lien</a>.'
            },
            {
                id: 'cmuc_choix_organisme_non_demandeur',
                label: 'Formulaire de choix de l\'organisme (autres membres du foyer)',
            }
        ],
        piecesJustificatives: [
            {
                label: 'Carte vitale et attestation',
                img: 'carte_vitale.jpg',
                description: 'Une photocopie de votre carte vitale et l’attestation qui l’accompagne.\
                    Cette attestation peut être obtenue auprès de votre caisse d’assurance maladie,\
                    auprès d’une borne de votre caisse d’assurance maladie ou éventuellement via votre compte internet\
                    sur le site de votre caisse d’assurance maladie.'
            },
            {
                label: 'Carte d\'identité ou passeport',
                img: 'identite_passeport.jpg',
                description: 'Votre carte d’identité, ou votre passeport ou votre livret de famille à jour,\
                    revêtu de l\'une des mentions prévues à l\'article 28 du code civil'
            },
            {
                label: 'Justificatif de régularité du séjour',
                img: 'titre_sejour.jpg',
                description: 'toute pièce justifiant la régularité de votre séjour : titre de séjour, récépissé\
                    de votre demande de titre, convocation ou rendez-vous en préfecture…'
            },
            {
                label: 'Livret de famille',
                img: 'livret_de_famille.jpg',
                description: 'Si vous avez des personnes à charge, vous devez inclure\
                    votre livret de famille tenu à jour, ou votre certificat de concubinage ou l’attestation d’enregistrement d’un PACS.'
            },
            {
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
                label: 'Justificatif de stabilité de résidence',
                img: 'quittance.jpg',
                description: 'Toute pièce justifiant que vous résidez en France depuis plus de trois mois.\
                    Par exemple : bail de location, quittances de loyer, factures d\'électricité consécutives,\
                    certificat d’hébergement, certificat de scolarité ou d’inscription universitaire…'
            }
        ]
    }
]);
