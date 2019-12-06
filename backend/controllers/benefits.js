var mesAides = require('../lib/mes-aides');

var data = [];
mesAides.forEach((b, id) => {
    data.push(Object.assign({id}, b));
});

exports.list = function(req, res) {
    res.send(data);
};
