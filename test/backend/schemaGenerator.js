var expect = require('expect');
var mongoose = require('mongoose');
var subject = require('../../backend/lib/schemaGenerator').generateSchemaStructuresFromOpenAPIDefinitions;

function definitionGeneration(properties) {
    return {
        additionalProperties: false,
        properties: properties,
        type: 'object',
    };
}
describe('Schema generator', function () {
    it('exists', function() {
        expect(subject).toBeTruthy();
    });

    it('returns an object with identical keys', function() {
        var def = definitionGeneration({});
        var definitions = { One: def, Two: def, Three: def };

        var result = subject(definitions);
        expect(result).toIncludeKeys(Object.keys(definitions));
    });

    describe('Property generation', function() {

        it('processes strings', function() {
            var def = definitionGeneration({
                property: {
                    type: 'string',
                },
            });
            var result = subject({ Obj: def });
            expect(result.Obj.property).toEqual(String);
        });

        it('processes references', function() {
            var main = definitionGeneration({
                nested: {
                    '$ref': '#/definitions/Nested',
                }
            });
            var nested = definitionGeneration({
                property: { type: 'string' }
            });

            var definitions = {
                Nested: nested,
                Main: main
            };

            var result = subject(definitions);
            expect(result.Main.nested.property).toEqual(String);
        });
    });
});
