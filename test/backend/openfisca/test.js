var expect = require('expect');
var _ = require('lodash');
var Promise = require('bluebird');
var fs = Promise.promisifyAll(require('fs'));
var subject = require('../../../backend/lib/openfisca/test');
var tmp = require('tmp');

var details = {
    name: 'Ideal name',
    description: 'Thorough description',
    output_variables: {
        valueOne: 1,
    },
    absolute_error_margin: 0.1,
};

var currentPeriod = '2018-01';
var situation = {
    dateDeValeur: new Date(currentPeriod),
    famille: {},
    foyer_fiscal: {},
    individus: [{
        id: 'id',
        date_naissance: new Date('1989-01-01'),
        role: 'demandeur',
        specificSituations: []
    }],
    menage: {
        personne_de_reference: ['id'],
        statut_occupation_logement: 'sans_domicile'
    },
};

describe('openfisca generateTest', function() {
    var result = subject.generateTest(details, situation);

    it('does not add rsa_non_calculable', function() {
        expect(typeof result.familles[0].rsa_non_calculable[currentPeriod]).toBe('undefined');
    });
});

function run_cmd(cmd, args) {
    return new Promise(function(resolve, reject) {
        var spawn = require('child_process').spawn;
        var child = spawn(cmd, args);
        var respErr = "";
        var respOut = "";

        child.stdout.on('data', function (buffer) { respOut += buffer.toString(); });
        child.stderr.on('data', function (buffer) { respErr += buffer.toString(); });
        child.on('exit', function(code) {
            var result = {
                stdout: respOut,
                stderr: respErr
            };
            if (code) {
                result.error = 'Exit code was ' + code;
                reject(result);
            } else {
                resolve(result);
            }
        });
        child.on('error', function(err) { reject({ error: err }); });
    });
}

function runOpenFiscaTest(yaml, extension) {
    var tmpobj = tmp.fileSync();
    return fs.writeFileAsync(tmpobj.fd, yaml, 'utf8')
        .then(function() {
            var args = extension ? [tmpobj.name, '--extension', extension] : [tmpobj.name];

            return run_cmd('openfisca-run-test', args);
        });
}

describe('openfisca generateYAMLTest', function() {
    var result = subject.generateYAMLTest(details, situation);

    it('generates a non empty string', function() {
        expect(result).toBeTruthy();
    });

    it('contains provided output_variables', function() {
        expect(result).toContain('valueOne: 1');
    });

    function validateYAMLRun(payload) {
        return runOpenFiscaTest(payload)
            .then(function(result) {
                expect(result.stderr).toMatch(/\nOK\n$/);
            })
            .catch(function(failure) {
                console.log(payload);
                expect(failure).toBeFalsy(failure.stderr);
            });
    }

    if (process.env.VIRTUAL_ENV) {
        describe('generates processable YAML files', function() {
            it('passes OpenFisca test without extension', function() {
                var details = Object.assign({}, details, { output_variables: { rsa: 545.48 }});
                var yamlContent = subject.generateYAMLTest(details, situation);

                return validateYAMLRun(yamlContent);
            });

            Object.keys(subject.EXTENSION_VARIABLES).forEach(function(extensionName) {
                it('passes OpenFisca test with ' + extensionName  + ' extension', function() {
                    var details = Object.assign({ extension: extensionName }, details, { output_variables: { rsa: 545.48 }});
                    var yamlContent = subject.generateYAMLTest(details, situation);

                    var variableListRegex = _.values(subject.EXTENSION_VARIABLES[extensionName]).map(function(variableList) { return variableList.join('|'); }).join('|');
                    expect(yamlContent).toMatch(new RegExp(variableListRegex));

                    return validateYAMLRun(yamlContent);
                });
            });
        });
    }
});
