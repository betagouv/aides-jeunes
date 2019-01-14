'use strict';

describe('directive droit-cta', function() {
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

        $scope.droit = {
            teleservice: 'http://example.com'
        };

        var element = $compile('<droit-cta droit="droit" />')($scope);

        $scope.$digest();

        var el = element[0].childNodes[0];

        expect(element.text().trim()).toEqual('Faire une demande');
        expect(el.getAttribute('href')).toBe('http://example.com');
    });

    it('should use function', function() {

        $scope.droit = {
            teleservice: {
                state: 'foo',
                params: { bar: 'baz' }
            }
        };

        var element = $compile('<droit-cta droit="droit" />')($scope);

        $scope.$digest();

        var el = element[0].childNodes[0];

        expect(element.text().trim()).toEqual('Faire une demande');
        expect(el.getAttribute('href')).toBe('/foo?bar=baz');
    });

});
