'use strict';

describe('directive benefit-cta', function() {
    var $compile, $scope;

    beforeEach(module('ddsApp'));

    // Add a route on the fly just for this test
    beforeEach(module(function($stateProvider) {
        $stateProvider.state('foo', {
            url: '/foo?bar',
        });
    }));

    beforeEach(inject(function(_$compile_, _$rootScope_) {
        $compile = _$compile_;
        $scope = _$rootScope_.$new();
    }));

    it('should use string', function() {

        $scope.benefit = {
            teleservice: 'http://example.com'
        };

        var element = $compile('<benefit-cta benefit="benefit" />')($scope);

        $scope.$digest();

        var el = element[0].childNodes[0];

        expect(element.text().trim()).toEqual('Faire une demande');
        expect(el.getAttribute('href')).toBe('http://example.com');
    });

    it('should use function', function() {

        $scope.benefit = {
            teleservice: {
                state: 'foo',
                params: { bar: 'baz' }
            }
        };

        var element = $compile('<benefit-cta benefit="benefit" />')($scope);

        $scope.$digest();

        var el = element[0].childNodes[0];

        expect(element.text().trim()).toEqual('Faire une demande');
        expect(el.getAttribute('href')).toBe('/foo?bar=baz');
    });

});
