/*
** Module dependencies
*/
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var SituationSchema = new Schema({
    _updated: Date,
    status: { type: String, default: 'new' },
    startId: { type: String, required: true },
    individus: [Schema.Types.Mixed],
    logements: [Schema.Types.Mixed],
    contact: {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        address: { type: String, required: true },
        postalCode: { type: String, required: true },
        city: { type: String, required: true },
        numeroSecu: { type: String, required: true },
        email: { type: String }
    }
}, { minimize: false });

module.exports = mongoose.model('Situation', SituationSchema);
