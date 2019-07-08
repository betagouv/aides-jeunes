var expect = require('expect');
var _ = require('lodash');
var Promise = require('bluebird');
var fs = Promise.promisifyAll(require('fs'));
var subject = require('../../../backend/lib/openfisca/test');
var tmp = require('tmp');

var details = {
    name: 'Ideal name',
    description: 'Thorough description',
    output: {
        rsa: 545.48,
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
        expect(typeof result.input.familles._.rsa_non_calculable[currentPeriod]).toBe('undefined');
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
    var tmpobj = tmp.fileSync({postfix: '.yaml'});
    return fs.writeFileAsync(tmpobj.fd, yaml, 'utf8')
        .then(function() {
            var args = extension ? ['test', tmpobj.name, '--extensions', extension] : ['test', tmpobj.name];

            return run_cmd('openfisca', args);
        });
}

describe('openfisca generateYAMLTest', function() {
    var result = subject.generateYAMLTest(details, situation);

    it('generates a non empty string', function() {
        expect(result).toBeTruthy();
    });

    it('contains provided output', function() {
        expect(result).toContain('rsa: 545.48');
    });

    function validateYAMLRun(payload, extension) {
        return runOpenFiscaTest(payload, extension)
            .catch(function(failure) {
                console.log(payload);
                expect(failure).toBeFalsy();

                return failure;
            })
            .then(function(result) {
                expect(result.stdout).toMatch(/ passed/);

                expect(result.stdout).not.toMatch(/ failed /);
                expect(result.stdout).not.toMatch(/= ERRORS =/);
                expect(result.stdout).not.toMatch(/= FAILURES =/);
            });
    }

    if (process.env.VIRTUAL_ENV) {
        describe('generates processable YAML files', function() {
            it('passes OpenFisca test without extension', function() {
                var info = Object.assign({}, details);
                var yamlContent = subject.generateYAMLTest(info, situation);

                return validateYAMLRun(yamlContent);
            });

            Object.keys(subject.EXTENSION_VARIABLES).forEach(function(extensionName) {
                it('passes OpenFisca test with ' + extensionName  + ' extension', function() {
                    var info = Object.assign({ extension: extensionName }, details);
                    var yamlContent = subject.generateYAMLTest(info, situation);

                    var variableListRegex = _.values(subject.EXTENSION_VARIABLES[extensionName]).map(function(variableList) { return variableList.join('|'); }).join('|');
                    expect(yamlContent).toMatch(new RegExp(variableListRegex));

                    return validateYAMLRun(yamlContent, extensionName.replace(/-/g, '_'));
                });
            });
        });
    }
});
