var _ = require('lodash');
var situation = require('../situation');

var questions = {
    Individu: {
        enceinte: {
            type: 'yes-no',
            label: 'Attendez-vous un enfant ?'
        },
        boursierEnseignementSup: {
            type: 'yes-no',
            label: 'Percevez-vous une bourse de l\'enseignement supérieur ?'
        },
        statutMarital: {
            type: 'radios',
            label: 'Quelle est votre situation familiale actuelle ?',
            values: {
                'seul': 'Seul',
                'en couple': 'En couple',
                'pacsé': 'Pacsé(e)',
                'marié': 'Marié(e)'
            },
            afterCallback: function() {
                if (!this.statutMarital) return;
                if (this.statutMarital === 'seul') {
                    this.seul();
                } else {
                    this.enCouple(this.statutMarital);
                }
            }
        },
        dateDeNaissance: {
            type: 'date',
            label: 'Quelle est votre date de naissance ?'
        },
        enfants: {
            type: 'enfants',
            label: 'Vos enfants :',
            afterCallback: function() {
                if (!this.enfants) this.enfants = [];
                var error = false;
                this.enfants.forEach(function(enfant) {
                    if (!enfant.prenom || !enfant.prenom.length) error = true;
                    if (!enfant.dateDeNaissance) error = true;
                });
                return !error;
            }
        },
        ressources: {
            type: 'ressources',
            label: 'Au cours des 3 derniers mois, quels types de ressources avez-vous perçus ?'
        }
    },
    Logement: {
        prêtEnCours: {
            type: 'yes-no',
            label: 'Remboursez-vous un emprunt pour financer votre logement ?'
        },
        prochePropriétaire: {
            type: 'yes-no',
            label: 'Un membre de votre famille est-il le propriétaire de votre logement ?'
        },
        loyer: {
            type: 'number',
            label: 'À combien s\'élève votre loyer (ou votre mensualité d\'emprunt) ?'
        },
        codePostal: {
            type: 'number',
            label: 'Quel est le code postal de votre lieu de résidence ?'
        },
        statusOccupation: {
            type: 'radios',
            label: 'Concernant votre logement, êtes-vous ?',
            values: {
                'locataire': 'Locataire',
                'proprietaire': 'Propriétaire',
                'gratuit': 'Occupant à titre gratuit'
            }
        }
    }
};

var statusQuestion = {
    type: 'checkboxes',
    label: 'Êtes-vous dans l\'une ou l\'autre de ces situations particulières ?',
    sub: 'Vous pouvez cochez plusieurs cases, ou aucune.',
    values: situation.Individu.status
};

_.forEach(situation.Individu.status, function(label, attribute) {
    questions.Individu[attribute] = statusQuestion;
});

module.exports = questions;
