'use strict';

describe('Controller: CaptureRevenusModalCtrl', function() {

    var scope = {};

    beforeEach(function() {
        module('ddsApp');
        inject(function($controller) {
            $controller('CaptureRevenusModalCtrl', {$scope: scope, $modalInstance: {}});
        });
    });

    it('Should init an array with the last 3 months', function() {
        function isoDate(minusMonths) {
            var date = new Date();
            var result = date.setMonth(date.getMonth() - minusMonths);
            var month = date.getMonth() + 1;
            var prefix = month < 10 ? '0' : '';
            month = prefix + month;
            result = '' + date.getFullYear() + '-' + month;

            return result;
        }

        expect(scope.months.length).toBe(3);
        expect(scope.months[0].id).toBe(isoDate(3));
        expect(scope.months[2].id).toBe(isoDate(1));
    });
});
