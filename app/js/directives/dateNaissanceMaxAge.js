'use strict';

var dateNaissanceValidator = function(scope, ctrl, attrs, attr, isValid) {
  ctrl.$parsers.unshift(function(viewValue) {
      var date = moment(viewValue, 'DD/MM/YYYY', true);
      if (date.isValid()) {
          var ageCond = scope.$eval(attrs[attr]);
          if (angular.isDefined(ageCond)) {
              var years = moment().diff(date, 'years');
              if (!isValid(years, ageCond)) {
                  ctrl.$setValidity(attr, false);

                  return viewValue;
              }
          }
      }

      ctrl.$setValidity(attr, true);

      return viewValue;
  });
};

angular.module('ddsApp').directive('dateNaissanceMaxAge', function() {
    return {
        require: 'ngModel',
        link: function(scope, elm, attrs, ctrl) {
            dateNaissanceValidator(scope, ctrl, attrs, 'dateNaissanceMaxAge', function(years, ageCond) {
              return years <= ageCond;
            });
        }
    };
});

angular.module('ddsApp').directive('dateNaissanceMinAge', function() {
    return {
        require: 'ngModel',
        link: function(scope, elm, attrs, ctrl) {
            dateNaissanceValidator(scope, ctrl, attrs, 'dateNaissanceMinAge', function(years, ageCond) {
              return years >= ageCond;
            });
        }
    };
});
