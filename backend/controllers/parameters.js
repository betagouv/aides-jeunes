var openfisca = require('../lib/openfisca');

exports.show = function(req, res) {

    return openfisca.getParameter(req.params.parameterId, function(result) {
        res.send(result);
    });

};
