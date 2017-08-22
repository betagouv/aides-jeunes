var codesPostaux = require('codes-postaux');

exports.communes = function(req, res) {
    res.send(codesPostaux.find(req.params.codePostal));
};
