var expect = require('expect');
var _ = require('lodash');
var fs = require('fs');
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

function run_cmd(cmd, args, callback ) {
    var spawn = require('child_process').spawn;
    var child = spawn(cmd, args);
    var respErr = "";
    var respOut = "";

    child.stdout.on('data', function (buffer) { respOut += buffer.toString(); });
    child.stderr.on('data', function (buffer) { respErr += buffer.toString(); });
    child.on('exit', function(code) { callback(code ? 'Exit code was ' + code : null, respOut, respErr); });
    child.on('error', function(err) { callback(err); });
}

function runAndCheckOpenFiscaTest(yaml, extension, done) {
    if (! done) {
        done = extension;
        extension = undefined;
    }

    var tmpobj = tmp.fileSync();
    fs.writeFileSync(tmpobj.fd, yaml, 'utf8');
    var args = extension ? [tmpobj.name, '--extension', extension] : [tmpobj.name];

    run_cmd('openfisca-run-test', args, function(error, stdout, stderr) {
        if (error) {
            console.log(yaml);
        }
        expect(error).toBeFalsy(stderr);
        expect(stderr).toMatch(/\nOK\n$/);
        done();
    });
}

describe('openfisca generateYAMLTest', function() {
    var result = subject.generateYAMLTest(details, situation);

    it('generates a non empty string', function() {
        expect(result).toBeTruthy();
    });

    it('contains provided output_variables', function() {
        expect(result).toInclude('valueOne: 1');
    });

    if (process.env.VIRTUAL_ENV) {
        describe('generates processable YAML files', function() {
            it('passes OpenFisca test without extension', function(done) {
                var details = Object.assign({}, details, { output_variables: { rsa: 545.48 }});
                var yaml = subject.generateYAMLTest(details, situation);

                runAndCheckOpenFiscaTest(yaml, done);
            });

            Object.keys(subject.EXTENSION_VARIABLES).forEach(function(extensionName) {
                it('passes OpenFisca test with ' + extensionName  + ' extension', function(done) {
                    var details = Object.assign({ extension: extensionName }, details, { output_variables: { rsa: 545.48 }});
                    var yamlContent = subject.generateYAMLTest(details, situation);

                    var variableListRegex = _.values(subject.EXTENSION_VARIABLES[extensionName]).map(function(variableList) { return variableList.join('|'); }).join('|');
                    expect(yamlContent).toMatch(new RegExp(variableListRegex));

                    runAndCheckOpenFiscaTest(yamlContent, extensionName.replace('-', '_'), done);
                });
            });
        });
    }
});
