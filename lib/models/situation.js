/*
** Module dependencies
*/
var mongoose = require('mongoose');
var async = require('async');

var Schema = mongoose.Schema;

var SituationSchema = new Schema({
    _updated: Date,
    status: { type: String, default: 'new' },
    startId: { type: String, required: true },
    individus: [Schema.Types.Mixed],
    logements: [Schema.Types.Mixed],
    contact: {
        firstName: { type: String },
        lastName: { type: String },
        address: { type: String },
        postalCode: { type: String },
        city: { type: String },
        numeroSecu: { type: String },
        email: { type: String }
    }
}, { minimize: false });

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
