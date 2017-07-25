var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var typeMapping = {
    /*array*/
    Boolean: Boolean,
    Date: Date,
    Enumeration: String,
    Float: Number,
    Integer: Number,
    number: Number,
    object: Object,
    string: String,
};

function generateSchemaStructuresFromOpenAPIDefinitions(definitions) {
    var mongooseDefinitions = {};

    var keyStart = '#/definitions/';

    function determineType(typeName, refName) {
        if ((! refName) && typeName && typeMapping[typeName]) {
            return typeMapping[typeName];
        }
        var definitionPath = refName;
        if (! refName || ! definitionPath.startsWith(keyStart)) {
            console.warn('Can‘t determine type: ' + typeName + '/' + refName);
            return Object;
        }
        var propertyDefinitionName = definitionPath.slice(keyStart.length);
        return Object.assign({ _id: false },
            mongooseDefinitions[propertyDefinitionName]);
    }

    Object.keys(definitions).forEach(function(objectName) {
        var definition = {};
        if (definitions[objectName].additionalProperties !== false)
            definition = Object;
        mongooseDefinitions[objectName] = definition;
    });

    Object.keys(definitions).forEach(function(objectName) {
        var definition = definitions[objectName];
        var ouputDefinition = mongooseDefinitions[objectName];
        if ((definition.additionalProperties !== false ||
            definition.type !== 'object') &&
            (! definition.$ref)) {
            console.warn('Can‘t process ' + objectName);
            return;
        }

        if (! definition.properties) {
            console.warn('Can‘t process properties of ' + objectName);
            return;
        }

        Object.keys(definition.properties).forEach(function(propertyName) {
            var propertyDefinition = definition.properties[propertyName];
            if (propertyDefinition.type === 'array') {
                var type = determineType(
                    propertyDefinition.items.type,
                    propertyDefinition.items.$ref
                );
                ouputDefinition[propertyName] = [type];
            } else {
                ouputDefinition[propertyName] = determineType(
                    propertyDefinition.type,
                    propertyDefinition.$ref
                );
            }
        });
    });

    return mongooseDefinitions;
}

function generateSchemasFromOpenAPIDefinitions(openAPIDefinitions) {
    var mongooseDefinitions = generateSchemaStructuresFromOpenAPIDefinitions(openAPIDefinitions);
    var schemas = {};
    Object.keys(mongooseDefinitions).forEach(function(definitionName) {
        if (mongooseDefinitions[definitionName] !== Object)
            schemas[definitionName] = new Schema(mongooseDefinitions[definitionName], { strict: false });
    });

    return schemas;
}

exports.generateSchemaStructuresFromOpenAPIDefinitions = generateSchemaStructuresFromOpenAPIDefinitions;
exports.generateSchemasFromOpenAPIDefinitions = generateSchemasFromOpenAPIDefinitions;
