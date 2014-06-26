/*
** Module dependencies
*/
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var TaskSchema = new Schema({
    situation: { type: Schema.Types.ObjectId, ref: 'Situation' },
    type: { type: String },
    status: { type: String }
});

mongoose.model('Task', TaskSchema);
