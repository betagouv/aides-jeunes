var v1 = require('./toV1');
var v2 = require('./toV2');

var migrations = [
    v1,
    v2,
];

module.exports = function(situation) {
    migrations.forEach(function(migration) {
        if (situation.version < migration.version) {
            situation = migration.function(situation);
        }
    });
    return situation;
};
