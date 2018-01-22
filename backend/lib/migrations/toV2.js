/*
 * Use OpenFisca France new naming convention for enumerations
 */

var girs = {
    'Non défini': 'non_defini',
    'Gir 1': 'gir_1',
    'Gir 2': 'gir_2',
    'Gir 3': 'gir_3',
    'Gir 4': 'gir_4',
    'Gir 5': 'gir_5',
    'Gir 6': 'gir_6',
};

var scolarites = {
    'Collège': 'college',
    'Lycée': 'lycee',
    'Inconnue': 'inconnue',
};

var statut_maritaux = {
    '': 'non_renseigne',
    'Marié': 'marie',
    'Célibataire': 'celibataire',
    'Divorcé': 'divorce',
    'Veuf': 'veuf',
    'Pacsé': 'pacse',
    'Jeune veuf': 'jeune_veuf',
};

var statuts_occupation_logement = {
    'Non renseigné': 'non_renseigne',
    'Accédant à la propriété': 'primo_accedant',
    'Propriétaire (non accédant) du logement': 'proprietaire',
    'Locataire d‘un logement HLM': 'locataire_hlm',
    'Locataire ou sous-locataire d‘un logement loué vide non-HLM': 'locataire_vide',
    'Locataire ou sous-locataire d‘un logement loué meublé ou d‘une chambre d‘hôtel': 'locataire_meuble',
    'Logé gratuitement par des parents, des amis ou l‘employeur': 'loge_gratuitement',
    'Locataire d‘un foyer (résidence universitaire, maison de retraite, foyer de jeune travailleur, résidence sociale...)': 'locataire_foyer',
    'Sans domicile stable': 'sans_domicile'
};


module.exports = {
    function: function(situation) {

        situation.individus.forEach(function(individu) {
            individu.gir = girs[individu.gir];
            individu.scolarite = scolarites[individu.scolarite];
            individu.statut_marital = statut_maritaux[individu.statut_marital];
        });

        situation.menage.statut_occupation_logement = statuts_occupation_logement[situation.menage.statut_occupation_logement];

        return situation;
    },
    version: 2
};
