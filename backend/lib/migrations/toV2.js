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

module.exports = {
    function: function(situation) {

        situation.individus.forEach(function(individu) {
            individu.gir = girs[individu.gir];
            individu.scolarite = scolarites[individu.scolarite];
        });

        return situation;
    },
    version: 2
};
