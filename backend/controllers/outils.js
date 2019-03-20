var Fuse = require('fuse.js');
var communes = require('@etalab/decoupage-administratif/data/communes.json');
var index = {};

communes.forEach(function(commune) {
    if (!commune.codesPostaux) {
        return;
    }

    // Backward compatibility
    commune.codeCommune = commune.code;
    commune.nomCommune = commune.nom;

    commune.codesPostaux.forEach(function(codePostal) {
        if (!(codePostal in index)) {
            index[codePostal] = [];
        }

        index[codePostal].push(commune);
    });
});

var options = {
    shouldSort: true,
    threshold: 0.3,
    location: 0,
    distance: 100,
    maxPatternLength: 32,
    minMatchCharLength: 1,
    keys: [
        "nom",
        "codesPostaux"
    ]
};
var fuse = new Fuse(communes, options);

function find(postalCode) {
    return index[postalCode] || [];
}

exports.communes = function(req, res) {
    res.send(find(req.params.codePostal));
};

exports.searchCommunes = function(req, res) {
    var matches = fuse.search(req.query.q);
    res.send(matches.slice(0, 5));
};
