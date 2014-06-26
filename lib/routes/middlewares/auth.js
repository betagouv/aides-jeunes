exports.ensureLoggedIn = function(req, res, next) {
    if (!req.isAuthenticated || !req.isAuthenticated() || !req.user.organization) return res.send(401);
    next();
};
