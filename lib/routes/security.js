var _ = require('lodash');

function ensureAuthenticated(req, res, next) {
    if (!req.isAuthenticated()) return res.send(401);
    next();
}

module.exports = function(api, passport) {

    api.post('/login', function(req, res, next) {
        passport.authenticate('local', function(err, agent) {
            if (err) return next(err);
            if (!agent) return res.send(400);
            req.logIn(agent, function(err) {
                if (err) return next(err);
                res.send(_.omit(agent.toObject(), 'password'));
            });
        })(req, res, next);
    });

    api.get('/profile', ensureAuthenticated, function(req, res) {
        res.send(req.user);
    });

};
