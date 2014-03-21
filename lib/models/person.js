var moment = require('moment');
var _ = require('lodash');

module.exports = function(engine) {

    var situationsFamiliales = [
        'célibataire',
        'en couple',
        'pacsé(e)',
        'marié(e)',
        'divorcé(e)',
        'séparé(e)',
        'veuf/veuve'
    ];

    var situationOccupation = [
        'locataire',
        'occupant à titre gratuit',
        'propriétaire',
        'sans domicile fixe'
    ];

    var situationPro = [
        'salarié',
        'travailleur non-salarié',
        'demandeur d\'emploi',
        'apprenti',
        'conjoint collaborateur'
    ];

    var situationsParticulières = [
        'en détention',
        'congé parental',
        'congé sabbatique',
        'longue maladie',
        'hospitalisation',
        'congé sans solde',
        'étudiant',
        'stagiaire'
    ];

    engine.registerDefinition('demandeur.âge', {
        required: ['demandeur.dateDeNaissance'],
        getValue: function(dateDeNaissance) {
            return moment().diff(dateDeNaissance, 'years');
        }
    });

    var situationsFamilialesParentIsolé = ['célibataire', 'séparé(e)', 'divorcé(e)', 'veuf/veuve'];

    engine.registerDefinition('demandeur.parentIsolé', {
        required: ['demandeur.situationFamiliale', 'demandeur.nbEnfantsÀCharge'],
        optional: ['demandeur.enceinte'],
        getValue: function(situationFamiliale, nbEnfantsÀCharge, enceinte) {
            if (!_.contains(situationsFamilialesParentIsolé, situationFamiliale)) return false;
            if (nbEnfantsÀCharge > 0) return true;
            if (_.isUndefined(enceinte)) return this.claim('demandeur.enceinte');
            else if (enceinte) return true;
            else return false;
        }
    });

};
