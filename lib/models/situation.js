/*
** Module dependencies
*/
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var PeopleSchema = new Schema({
    id: String,
    children: [String],
    parents: [String],
    attributes: Schema.Types.Mixed,
    userAttributes: Schema.Types.Mixed,
    computedAttributes: Schema.Types.Mixed
});

var DwellingSchema = new Schema({
    id: String,
    occupants: [String],
    attributes: Schema.Types.Mixed,
    userAttributes: Schema.Types.Mixed,
    computedAttributes: Schema.Types.Mixed
});

var SituationSchema = new Schema({
    status: { type: String, default: 'new' },
    updatedAt: Date,
    people: [PeopleSchema],
    dwellings: [DwellingSchema]
});

module.exports = mongoose.model('Situation', SituationSchema);
