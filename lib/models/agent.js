/*
** Module dependencies
*/
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var Schema = mongoose.Schema;
var SALT_WORK_FACTOR = 10;

var AgentSchema = new Schema({
    firstName: String,
    lastName: String,
    email: { type: String, unique: true, required: true },
    password: String,
    organization: { type: Schema.Types.ObjectId, ref: 'Organization' }
});

/*
** Pre-save hook
*/
AgentSchema.pre('save', function(next) {
    var user = this;

    if (!user.isModified('password')) return next();

    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);
            user.password = hash;
            next();
        });
    });
});

/*
** Methods
*/
AgentSchema.methods = {

    comparePassword: function(candidatePassword, cb) {
        bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
            if (err) return cb(err);
            cb(null, isMatch);
        });
    }

};

mongoose.model('Agent', AgentSchema);
