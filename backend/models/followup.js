var mongoose = require('mongoose');
var validator = require('validator');
var utils = require('../lib/utils');

var FollowupSchema = new mongoose.Schema({
    situation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Situation'
    },
    email: {
        type: String,
        validate:{
            validator: validator.isEmail,
            message: '{VALUE} n\'est pas un email valide',
            isAsync: false
        }
    },
    createdAt: { type: Date, default: Date.now },
    _id: { type: String },
}, { minimize: false, id: false });

FollowupSchema.pre('save', function(next) {
    if (!this.isNew) next();
    var followup = this;
    utils.generateToken()
        .then(function(token) {
            followup._id = token;
        })
        .then(next)
        .catch(next);
});

mongoose.model('Followup', FollowupSchema);
