var Promise = require('bluebird');
var openfisca = Promise.promisifyAll(require('../openfisca'));
var request = Promise.promisify(openfisca.sendToOpenfisca('calculate', (s) => s));

var common = require('../openfisca/mapping/common');
var { init, prefix, append } = require('../openfisca/bulk');
var droitsDescription = require('../../../app/js/constants/benefits');

function OpenFiscaAxe(situation) {
    this.situation = situation;
}

OpenFiscaAxe.prototype.toInternal = function() {
    return {};
};

var benefits = [];
for (var level in droitsDescription) {
    for (var provider in droitsDescription[level]) {
        for (var prestation in droitsDescription[level][provider].prestations) {
            benefits.push(Object.assign({
                id: prestation,
                provider: Object.assign({id: provider, level: level}, droitsDescription[level][provider])
            }, droitsDescription[level][provider].prestations[prestation]));
        }
    }
}

var benefitIds = ['irpp'].concat(benefits.map(b => b.id));
var variable = 'salaire_net';

var values = [];
var max = 3500;
var base = 25;
var steps = max/base + 1;
for (var i=0; i<steps; i = i+1) {
    values.push(i * max / (steps-1));
}
var fullTimePeriodLength = 25 + 12;
var fullTimePeriod = 'month:2017-05:' + fullTimePeriodLength.toString();

function extractResults({ source, response }) {
    var periods = common.getPeriods(source.dateDeValeur);
    var entities = ['familles', 'individus', 'foyers_fiscaux', 'menages'];

    return entities.reduce((groupAccum, group) => {
        var entityNames = Object.keys(response[group]);
        return entityNames.reduce((entityAccum, id) => {
            var prefix = id.split('_')[0];
            entityAccum[prefix] = entityAccum[prefix] || {};

            return benefitIds.reduce((benefitAccum, variable) => {
                var base = response[group][id][variable];
                if (base) {
                    benefitAccum[prefix][variable] = 1 * (base[periods.thisMonth] || (base[periods.thisYear] / 12) || 0);
                }

                return benefitAccum;
            }, entityAccum);
        }, groupAccum);
    }, {});
}

function fetch(s) {
    var fs = Promise.promisifyAll(require('fs'));
    var os = require('os');
    var path = require('path');
    var cachePath = path.join(os.tmpdir(), 'situation_' + s.source._id + '_' + base);
    if (false && fs.existsSync(cachePath)) {
        return fs.readFileAsync(cachePath)
            .then(data => { s.response = JSON.parse(data); })
            .then(() => s);
    } else {
        return request(s.request)
            .then(payload => {
                s.response = payload;
                fs.writeFileAsync(cachePath, JSON.stringify(payload, null, 2));
            })
            .then(() => s);
    }
}

OpenFiscaAxe.prototype.toExternal = function() {
    var periods = common.getPeriods(this.situation.dateDeValeur);

    var s = {
        source: this.situation,
        request: values.reduce((a, v) => {
            this.situation.demandeur[variable] = {};
            this.situation.demandeur[variable][fullTimePeriod] = fullTimePeriodLength * v;
            var ss = openfisca.buildOpenFiscaRequest(this.situation);

            ss.foyers_fiscaux._.irpp = { [periods.thisYear]: null };

            var prefixed = prefix(v.toString() + '_', ss);
            return append(a, prefixed);
        }, init())
    };

    return fetch(s)
        .then(s => {
            var results = extractResults(s);
            var jsonResults = Object.keys(results).map(k => {
                return Object.assign({name: k},
                    results[k], {[variable]: parseInt(k)});
            });
            return {
                names: [variable].concat(benefitIds),
                data: jsonResults
            };
        });
};

module.exports = OpenFiscaAxe;
