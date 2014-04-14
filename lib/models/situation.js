/*
** Module dependencies
*/
var mongoose = require('mongoose');


var Schema = mongoose.Schema;

var SituationSchema = new Schema({
    data: {
        people: [Schema.Types.Mixed],
        dwellings: [Schema.Types.Mixed]
    }
});

module.exports = mongoose.model('Situation', SituationSchema);
