var mongoose = require('mongoose');
var filter = require('lodash/filter');
var benefits = require('../../app/js/constants/benefits/back');
var mesAides = require('../lib/mes-aides');
var openfisca = require('../lib/openfisca');
var utils = require('../lib/utils');
var computeAides = mesAides.computeAides.bind(benefits);

var {situation} = require('../lib/definitions');

var SituationSchema = new mongoose.Schema(situation, { minimize: false });

SituationSchema.statics.cookiePrefix = 'situation_';
SituationSchema.virtual('cookieName').get(function() {
    return `${SituationSchema.statics.cookiePrefix}${this._id}`;
});
SituationSchema.virtual('returnPath').get(function() {
    return '/simulation/resultats?situationId=' + this._id;
});

SituationSchema.methods.isAccessible = function(keychain) {
    return ['demo', 'investigation', 'test'].includes(this.status) || (keychain && keychain[this.cookieName] === this.token);
};

SituationSchema.methods.getIndividus = function() {
    return filter([].concat(this.demandeur, this.conjoint, ...(this.enfants || [])))
}

SituationSchema.methods.compute = function() {
    var that = this;
    return new Promise(function(resolve, reject) {
        openfisca.calculate(that, function(err, openfiscaResponse) {
            if (err) {
                return reject(err);
            }

            var aides = computeAides(that, openfiscaResponse, false);
            resolve(aides);
        });
    });
};

SituationSchema.pre('save', function(next) {
    if (!this.isNew) { return next(); }
    var situation = this;
    utils.generateToken()
        .then(function(token) {
            situation.token = token;
        })
        .then(next)
        .catch(next);
});

mongoose.model('Situation', SituationSchema);
mongoose.model('LegacySituation', new mongoose.Schema({}, { strict: false }));
