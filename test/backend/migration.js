/*
 * This script rely on
    "sgmap-mes-aides-api": "sgmap/mes-aides-api#replicate",
 */
var config = require('../../backend');
var expect = require('expect');
var _ = require('lodash');

var mongoose = require('mongoose');

// Setup mongoose
var AcceptanceTest = mongoose.model('AcceptanceTest');
var LegacySituation = mongoose.model('LegacySituation');
var Situation = mongoose.model('Situation');

var legacyMapping = require('sgmap-mes-aides-api/lib/simulation/openfisca/mapping');

var migration = require('../../backend/lib/migrations/initial');
var mapping = require('../../backend/lib/openfisca/mapping');

function deepDiffRight(left, right) {
  // if they are equals, return undefined
  if (_.isEqual(left, right)) { return; }
  // form now on, we can assure that `left` and `right` are not equals (equivalents)

  // if `left` and `right` are primitives, value changed
  // if `left` is a primitive and `right` an object, value has been replaced with an object
  // if `left` is an object and `right` a primitive, value has been replaced with a primitive
  // use `_.copy` to prevent object referrence issues
  if (! _.isObject(left) || ! _.isObject(right)) { return _.cloneDeep(right); }

  // make `result` the same type as `right`
  var result = _.isArray(right) ? [] : {};

  // since we know that both are objects,
  // iterate on `right` to see what changed or what's new in `right`
  _.forEach(right, function (value, key) {
    // recursion
    var diff = deepDiffRight(left[key], right[key]);
    // since the function returns undefined when `left` and `right` are equals,
    // only assing non-undefined values to result
    if (! _.isUndefined(diff)) {
        result[key] = diff;
    }
  });

  //console.log(result, (! result.length), (! Object.keys(result).length));
  if ((! result.length) && (! Object.keys(result).length)) { return; }

  return result;
}

function processSituations(err, retrievedTests) {
    if (err) {
        console.log(err);
        process.exit(1);
    }
    var tests = retrievedTests.slice(0, 2000);
    var done = 0;
    function processTests() {
        if(done == tests.length) {
            process.exit();
        }
        var test = tests[done];
        var testId = test._id;
        var situationId = test.scenario && test.scenario.situationId || (test.id || test._id || '').toString();

        LegacySituation.findById(situationId)
        .then(function(dbLegacySituation) {
            if (! dbLegacySituation) {
                console.log('var Err_testID_ = \'' + testId + '\'; // Null');
                done += 1;
                return processTests();
            }
            var dbSituationJSON = JSON.stringify(dbLegacySituation.toObject(), null, 2);
            var situation = dbLegacySituation.toObject();
            migration.persistedSituationPretransformationUpdate(situation);

            var legacyOpenfiscaRequest = legacyMapping.buildOpenFiscaRequest(_.cloneDeep(situation));

            var frontSituation = migration.migratePersistedSituation(situation);
            Situation.create(frontSituation, function(err, dbSituation) {
                if (err) {
                    console.log('var Err_testID_ = \'' + testId + '\'; // Situation.create ' + frontSituation._id );
                    console.log(JSON.stringify(err, null, 2));
                    process.exit(1);
                }

                var generatedSituation = frontSituation;
                var persistedSituation = _.omit(dbSituation.toObject(), '__v');

                var diff01 = deepDiffRight(generatedSituation, persistedSituation);
                var diff02 = deepDiffRight(persistedSituation, generatedSituation);
                if (/*true || //*/
                    diff01 || diff02) {
                    var structure0 = [diff01, diff02];
                    console.log('var testID_db_ = \'' + testId + '\' //  ' + frontSituation._id );
                    console.log(JSON.stringify(structure0, null, 2));
                    console.log(JSON.stringify([generatedSituation, persistedSituation], null, 2));

                    process.exit(1);
                }

                var newOpenfiscaRequest = mapping.buildOpenFiscaRequest(_.cloneDeep(persistedSituation));

                legacyOpenfiscaRequest.variables.sort();

                var diff1 = deepDiffRight(legacyOpenfiscaRequest, newOpenfiscaRequest);
                var diff2 = deepDiffRight(newOpenfiscaRequest, legacyOpenfiscaRequest);
                if (/*true || //*/
                    diff1 || diff2) {
                    var structure = [diff1, diff2];

                    console.log('var testID_req_ = \'' + testId + '\'; // Situation.create ' + frontSituation._id );
                    console.log(JSON.stringify(structure, null, 2));
                    console.log(JSON.stringify([newOpenfiscaRequest, legacyOpenfiscaRequest], null, 2));
                    process.exit(1);
                } else {
                    console.log('var situation_' + situationId + '_' + done + ' = \'ok\';');
                }

                done += 1;

                processTests();
            });
        }).catch(function(err) {
            console.log('var Err_testID_ = \'' + testId + '\'; // LegacySituation.findById');
            console.log(err);
            console.log(JSON.stringify(err, null, 2));
            process.exit(1);
        });
    }
    processTests();
}

function migrateTestSituations() {
    AcceptanceTest.find({
        // _id: '54e4c0bffb31b85d4074fe15', // taux incapacite
        // _id: '54915ffadf990f5b0286cf20', // salaire_imposable were double counted
        // _id: '5422c2d95be58c0200a07585', // Refactor backend - anneeDeReference proxy ressources - missing computed ressources
        // _id: '53d79982f6aa390200a6cd08', // Refactor backend - anneeDeReference proxy ressources
        // _id: '546c9783b7fb60347d0f3b24', // Ids missing in individus
        // _id: '53d21ee5159e330200810b87', // ObjectId versus String comparison issue
        // _id: '53d7b76df6aa390200a6cd5c', // Add firstName
        // _id: '540d69a1aa90150200440ee9', // remove rejected test - Caution will hang
        // _id: '582b06f467831ca264e93def', // Situation 582b06e667831ca264e93de5 set individus.2.specificSituations = []
        // _id: '53d220ce159e330200810b8e', // Persisted situation error
        // _id: '588f2778db011fdc7a230a12', // habite_chez_parents missing in migration mapping
        // _id: '5639eb3ceeab276a0422b307', // reverted interrupted aide_logement
        // _id: '54f07c45246e5054751ccfe3', // situation.logement.isChambre
        // _id: '54d8e0821fe4e8cf448e2bf3', // rfr diff
        // _id: '53d24d0ae40a7902009c3377', // Broken diff function
        // _id: '55b8cbb1d28906b46b50376a', // Uninferable ressourcesYearMoins2Captured = true from ressources
        // _id: '5540d71646bea9643939530f', // Unknown properties autresRevenusTns and caAutresRevenusTns
        // _id: '559e4fe4fa617858013d9a39', // rounding loyer
        // _id: '54e4c0bffb31b85d4074fe15', // tauxIncapacite presence
        // _id: '545a57f8ad58ab46561f56ec', // Ressources moved from individu to group entity
        state: { '$nin': ['unclaimed', 'rejected'] }
    }, {}, { sort: '_id' }, processSituations);
}


function migrateRecentSituations() {
    LegacySituation.find({
        _id: { '$nin': [
            '5999dc194866593317f4b006',
            '599983ae4866593317f44818',
            '599971c44866593317f43044', // ASI partially interrupted, new version has the correct behavior
            '599961ef4866593317f41fb2', // aide_logement partially interrupted, new version has the correct behavior
            '59991f1e4866593317f3e9d4', // ass partially interrupted, new version has the correct behavior
            '599877fd4866593317f3b120', // aide_logement partially interrupted, new version has the correct behavior
            '599808db4866593317f337e8', // aide_logement and paje_base partially interrupted, new version has the correct behavior
            '5998001e4866593317f32e31', // aide_logement partially interrupted, new version has the correct behavior
            '5997642e4866593317f2f2e5', // aide_logement partially interrupted, new version has the correct behavior
            '59971f104866593317f2b3de' // paje_clca partially interrupted, new version has the correct behavior
            ],
            '$lte': '59971f104866593317f2b3de',
            //'$in': ['5998d6d04866593317f3e45f']
        }, // Dodgy situation ?
        // _id: '5998d6d04866593317f3e45f', //
        // _id: '599a898d4866593317f4fd61',
        // _id: '5999fc6e4866593317f4cb26', // legacy API bug: 'Fix not interrupted ressources for famille'
    }, {}, {
        limit: 10000,
        sort: { dateDeValeur: -1 },
    }, processSituations);
}

Situation.deleteMany({}, function(err) {
    if (err) {
        console.log('ERROR:');
        console.log(err);
        process.exit(1);
    }
    //migrateTestSituations();
    migrateRecentSituations();
});
