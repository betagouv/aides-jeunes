'use strict';

angular.module('ddsApp').directive('dateNaissanceMaxAge', function() {
    return {
        require: 'ngModel',
        link: function($scope, elm, attrs, ctrl) {
            ctrl.$parsers.push(function(momentInstance) {
                var maximum = $scope.$eval(attrs.dateNaissanceMaxAge),
                    actual = moment().diff(momentInstance, 'years');

                ctrl.$setValidity('dateNaissanceMaxAge', actual <= maximum);

                return momentInstance;
            });
        }
    };
});

angular.module('ddsApp').directive('beforeToday', function() {
    return {
        require: 'ngModel',
        link: function($scope, elm, attrs, ctrl) {
            ctrl.$parsers.push(function(momentInstance) {
                ctrl.$setValidity('beforeToday', moment().diff(momentInstance, 'days') >= 0);
                return momentInstance;
            });
        }
    };
});
