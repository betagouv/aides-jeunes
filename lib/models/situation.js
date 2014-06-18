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
      firstName: { type: String },
      lastName: { type: String },
      address: { type: String },
      postalCode: { type: String },
      city: { type: String },
      numeroSecu: { type: String },
      email: { type: String }
    }
}, { minimize: false });

module.exports = mongoose.model('Situation', SituationSchema);
