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
    logements: [Schema.Types.Mixed]
});

module.exports = mongoose.model('Situation', SituationSchema);
