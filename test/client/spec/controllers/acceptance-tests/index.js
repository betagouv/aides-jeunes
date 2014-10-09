'use strict';

describe('Controller: IndexCtrl', function() {

    var scope;

    beforeEach(function() {
        module('acceptanceTests');
        scope = {};
    });

    describe('initialization', function() {
        it('should categorize the tests based on the beginning of their name', function() {
            // given
            var tests = [{name: '[category] test name'}];

            // when
            inject(function($controller) {
                $controller('IndexCtrl', {
                    $scope: scope,
                    acceptanceTests: tests
                });
            });

            // then
            expect(scope.categories[0].name).toBe('category');
            expect(scope.categories[0].tests[0]).toBe(tests[0]);
            expect(scope.categories[0].tests[0].name).toBe('test name');
        });

        it('should append a misc category for tests not prefixed by their category', function() {
            // given
            var tests = [
                {name: 'unprefixed test name'},
                {name: '[test] prefixed test name'}
            ];

            // when
            inject(function($controller) {
                $controller('IndexCtrl', {
                    $scope: scope,
                    acceptanceTests: tests
                });
            });

            // then
            expect(scope.categories[1].name).toBe('Non catégorisés');
            expect(scope.categories[1].tests[0]).toBe(tests[0]);
        });
    });
});
