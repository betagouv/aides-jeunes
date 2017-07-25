var mongoose = require('mongoose');

var schemaGenerator = require('../lib/schemaGenerator');
var definitions = require('../specs/definitions');

var Schemas = schemaGenerator.generateSchemasFromOpenAPIDefinitions(definitions);
mongoose.model('Situation', Schemas.Situation);
mongoose.model('LegacySituation', new mongoose.Schema({}, { strict: false }));
