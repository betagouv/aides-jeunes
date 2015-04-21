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

angular.module('ddsApp').directive('dateNaissanceMinAge', function() {
    return {
        require: 'ngModel',
        link: function($scope, elm, attrs, ctrl) {
            ctrl.$parsers.push(function(momentInstance) {
                var minimum = $scope.$eval(attrs.dateNaissanceMinAge),
                    actual = moment().diff(momentInstance, 'years');

                ctrl.$setValidity('dateNaissanceMinAge', actual >= minimum);

                return momentInstance;
            });
        }
    };
});
