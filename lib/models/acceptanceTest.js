/*
** Module dependencies
*/
var mongoose = require('mongoose');

var AcceptanceTestSchema = new mongoose.Schema({
    _updated: Date,
    situation: { type: mongoose.Schema.Types.ObjectId, ref: 'Situation' },
    name: String,
    description: String,
    droits: [mongoose.Schema.Types.Mixed]
});

mongoose.model('AcceptanceTest', AcceptanceTestSchema);
