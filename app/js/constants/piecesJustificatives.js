'use strict';

/* jshint multistr: true */

angular.module('ddsApp').constant('piecesJustificatives', [
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
        description: 'Une photocopie recto-verso de votre carte d’identité, votre passeport ou votre livret de famille.'
    },
    {
        id: 'regularite',
        label: 'Justificatif de régularité du séjour',
        img: 'titre_sejour.jpg',
        description: 'Toute pièce justifiant la régularité du séjour (contrat de travail, attestation de\
            chômage, titre de séjour, formulaires communautaires - E106 - E121/S1), récépissé\
            de votre demande de titre, convocation ou rendez-vous en préfecture'
    },
    {
        id: 'titre_sejour',
        label: 'Titre de séjour',
        img: 'titre_sejour.jpg',
        description: 'La photocopie lisible du titre de séjour en cours de validité.'
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
        id: 'attestation_chomage_partiel',
        label: 'Justificatif de chômage partiel',
        img: 'bulletin_paie.jpg',
        description: 'L’attestation de l’employeur ou la photocopie des bulletins de salaire'
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
        description: 'La déclaration de grossesse établie par un praticien.',
        isIndividualized: false
    },
    {
        id: 'rib',
        label: 'RIB',
        img: 'rib.png',
        description: 'Un relevé d’identité postal ou d’épargne ou bancaire.',
        isIndividualized: false
    },
    {
        id: 'domicile',
        label: '2 justificatifs de domicile',
        img: 'quittance.jpg',
        description: 'Quittances de loyer, factures d’eau, de gaz, d’électricité, de téléphone, attestation du Maire, ...',
        isIndividualized: false
    }
]);
