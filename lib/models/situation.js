/*
** Module dependencies
*/
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var PeopleSchema = new Schema({
    id: String,
    children: [String],
    parents: [String],
    userAttributes: Schema.Types.Mixed,
    computedAttributes: Schema.Types.Mixed
});

var DwellingSchema = new Schema({
    id: String,
    occupants: [String],
    userAttributes: Schema.Types.Mixed,
    computedAttributes: Schema.Types.Mixed
});

var SituationSchema = new Schema({
    status: String,
    people: [PeopleSchema],
    dwellings: [DwellingSchema]
});

module.exports = mongoose.model('Situation', SituationSchema);
