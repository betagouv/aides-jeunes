'use strict';

describe('directive benefit-cta-link', function() {
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

        $scope.locals = {
            type: 'teleservice',
            link: 'http://example.com'
        };

        var element = $compile('<benefit-cta-link type="locals.type" link="locals.link" />')($scope);

        $scope.$digest();

        var el = element[0].childNodes[0];

        expect(element.text().trim()).toEqual('Faire une demande en ligne');
        expect(el.getAttribute('href')).toBe('http://example.com');
    });

    it('should use function', function() {

        $scope.locals = {
            type: 'teleservice',
            link: {
                state: 'foo',
                params: { bar: 'baz' }
            }
        };

        var element = $compile('<benefit-cta-link type="locals.type" link="locals.link" />')($scope);

        $scope.$digest();

        var el = element[0].childNodes[0];

        expect(element.text().trim()).toEqual('Faire une demande en ligne');
        expect(el.getAttribute('href')).toBe('/foo?bar=baz');
    });

});
