var mongoose = require('mongoose');
var LocalStrategy = require('passport-local').Strategy;

var Agent = mongoose.model('Agent');

module.exports = function(passport) {

    // Serialize the user id to push into the session
    passport.serializeUser(function(agent, done) {
        done(null, agent.id);
    });

    // Deserialize the user object based on a pre-serialized token
    // which is the user id
    passport.deserializeUser(function(id, done) {
        Agent
            .findById(id)
            .select('-password')
            .populate('organization')
            .exec(function(err, agent) {
                done(err, agent);
            });
    });

    passport.use('local', new LocalStrategy(
        { usernameField: 'email', passwordField: 'password' },
        function(email, password, done) {
            Agent.findOne({ email: email }).populate('organization').exec(function(err, agent) {
                if (err) return done(err);
                if (!agent) return done(null, false);
                agent.comparePassword(password, function(err, isMatch) {
                    if (err) return done(err);
                    if (isMatch) done(null, agent);
                    else done(null, false);
                });
            });
        }
    ));

};
