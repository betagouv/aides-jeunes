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

TaskSchema.statics.generateTasksForSituation = function(situation) {
    this.model('Task').create({ type: 'nir_validation', status: 'todo', situation: situation });
    this.model('Task').create({ type: 'revenus_dgfip', status: 'todo', situation: situation });
};

mongoose.model('Task', TaskSchema);
