var mongoose = require('mongoose');
var validator = require('validator');
var utils = require('../lib/utils');
var renderInitial = require('../lib/mes-aides/emails/initial').render;

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
    sentAt: { type: Date },
    messageId: { type: String },
    benefits: { type: Object },
    surveyOptin: { type: Boolean, default: false },
    _id: { type: String },
}, { minimize: false, id: false });


FollowupSchema.methods.postInitialEmail = function(messageId) {
    this.sentAt = Date.now();
    if (! this.surveyOptin) {
        this.email = undefined;
    } else {
        this.messageId = messageId;
    }
    return this.save();
};

FollowupSchema.methods.renderInitial = function() {
    return renderInitial(this);
};

FollowupSchema.pre('save', function(next) {
    if (!this.isNew) { return next(); }
    var followup = this;
    utils.generateToken()
        .then(function(token) {
            followup._id = token;
        })
        .then(next)
        .catch(next);
});
FollowupSchema.virtual('returnPath').get(function() {
    return '/followups/' + this._id;
});

mongoose.model('Followup', FollowupSchema);
