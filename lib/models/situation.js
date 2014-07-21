/*
** Module dependencies
*/
var mongoose = require('mongoose');
var async = require('async');

var Schema = mongoose.Schema;

var ressourceTypes = [
    'revenusSalarie',
    'revenusNonSalarie',
    'revenusAutoEntrepreneur',
    'allocationsChomage',
    'allocationLogement',
    'rsa',
    'aspa',
    'ass',
    'indJourMaternite',
    'indJourPaternite',
    'indJourAdoption',
    'indJourMaladie',
    'indJourMaladieProf',
    'indJourAccidentDuTravail',
    'indChomagePartiel',
    'pensionsAlimentaires',
    'pensionsRetraitesRentes'
];

var RessourceSchema = new Schema({
    periode: { type: String, required: true },
    type: { type: String, required: true, enum: ressourceTypes },
    montant: { type: Number, required: true }
});

var IndividuDef = {
    nir: String,
    enceinte: Boolean,
    boursierEnseignementSup: Boolean,
    etudiant: Boolean,
    demandeurEmploi: Boolean,
    retraite: Boolean,
    statusMarital: { type: String, enum: ['mariage', 'pacs', 'relation_libre'] },
    dateDeNaissance: Date,
    role: { type: String, enum: ['demandeur', 'conjoint', 'enfant', 'personneACharge'] },
    ressources: [RessourceSchema]
};

var IndividuSchema = new Schema(IndividuDef);

var LogementDef = {
    primoAccedant: Boolean,
    membreFamilleProprietaire: Boolean,
    loyer: Number,
    codePostal: String,
    type: { type: String, enum: ['locataire', 'proprietaire', 'gratuit'] },
    locationType: { type: String, enum: ['hlm', 'nonmeuble', 'meublehotel'] }
};

var SituationSchema = new Schema({
    _updated: Date,
    status: { type: String, default: 'new' },
    logement: LogementDef,
    individus: [IndividuSchema],
    contact: {
        firstName: { type: String },
        lastName: { type: String },
        address: { type: String },
        postalCode: { type: String },
        city: { type: String },
        numeroSecu: { type: String },
        email: { type: String }
    }
});

SituationSchema.methods = {

    submit: function(done) {
        if (this.status !== 'new') done(new Error('Not a new situation. Cannot be submitted.'));

        var situation = this;
        this.set('status', 'pending').save(function(err) {
            if (err) return done(err);
            situation.createTasks(done);
        });
    },

    createTasks: function(done) {
        var situation = this;
        async.each(['nir_validation', 'revenus_dgfip'], function(type, created) {
            mongoose.model('Task').create({ type: type, status: 'todo', situation: situation }, created);
        }, done);
    }

};

mongoose.model('Situation', SituationSchema);
