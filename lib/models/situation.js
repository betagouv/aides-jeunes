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
    'aah',
    'pensionsInvalidite',
    'indJourMaternite',
    'indJourPaternite',
    'indJourAdoption',
    'indJourMaladie',
    'indJourMaladieProf',
    'indJourAccidentDuTravail',
    'indChomagePartiel',
    'pensionsAlimentaires',
    'pensionsRetraitesRentes',
    'bourseEnseignementSup'
];

var RessourceSchema = new Schema({
    periode: { type: String, required: true },
    type: { type: String, required: true, enum: ressourceTypes },
    montant: { type: Number, required: true }
});

var IndividuDef = {
    civilite: { type: String, enum: ['f', 'h'] },
    firstName: String,
    lastName: String,
    nomUsage: String,
    nir: String,
    enceinte: Boolean,
    boursierEnseignementSup: Boolean,
    etudiant: Boolean,
    demandeurEmploi: Boolean,
    retraite: Boolean,
    statusMarital: { type: String, enum: ['mariage', 'pacs', 'relation_libre', 'celibat'] },
    dateDeNaissance: Date,
    villeNaissance: String,
    departementNaissance: Number,
    paysNaissance: String,
    nationalite: { type: String, enum: ['fr', 'ue', 'autre'] },
    role: { type: String, enum: ['demandeur', 'conjoint', 'enfant', 'personneACharge'] },
    ressources: [RessourceSchema]
};

var IndividuSchema = new Schema(IndividuDef);

var LogementDef = {
    primoAccedant: Boolean,
    membreFamilleProprietaire: Boolean,
    loyer: Number,
    adresse: String,
    codePostal: String,
    ville: String,
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
