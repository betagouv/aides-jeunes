var mongoose = require('mongoose');
var _ = require('lodash');
var validator = require('validator');

var utils = require('../lib/utils');

var renderInitial = require('../lib/mes-aides/emails/initial').render;
var renderSurvey = require('../lib/mes-aides/emails/survey').render;

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
    surveySentAt: { type: Date },
    benefits: { type: Object },
    surveyOptin: { type: Boolean, default: false },
    surveys: {
        type: [{
            _id: { type: String },
            createdAt: { type: Date, default: Date.now },
            messageId: { type: String },
            repliedAt: { type: Date },
            answers: [{
                id: String,
                value: String,
                comments: String
            }]
        }],
        default: []
    },
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

FollowupSchema.methods.addEmptySurvey = function(messageID) {
    var followup = this;

    return utils.generateToken()
        .then(function(token) {
            var surveys = Array.from(followup.surveys);
            var survey = {
                _id: token,
                messageID: messageID,
                createdAt: Date.now(),
            };
            surveys.push(survey);

            followup.surveys = surveys;
            return followup.save();
        });
};

FollowupSchema.methods.updateSurvey = function(id, answers) {
    var surveys = Array.from(this.surveys);
    var survey = _.find(surveys, function(s) { return s._id === id; });

    Object.assign(survey, { answers: answers, repliedAt: Date.now() });
    this.surveys = surveys;
    return this.save();
};

FollowupSchema.methods.renderSurvey = function() {
    return renderSurvey(this);
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

FollowupSchema.virtual('surveyPath').get(function() {
    return '/suivi?token=' + this._id;
});

mongoose.model('Followup', FollowupSchema);
