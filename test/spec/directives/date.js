'use strict';

describe('directive dds-date', function() {
  var $scope, form;

  beforeEach(module('ddsApp'));
  beforeEach(module('templates'));

  beforeEach(inject(function($compile, $rootScope) {
    $scope = $rootScope;
    var element = angular.element(
      '<form name="form">' +
      '<input ng-model="model.date" name="date" dds-date>' +
      '</form>'
    );
    $scope.model = { date: null };
    $compile(element)($scope);
    form = $scope.form;
  }));

  it('should pass with a valid date', function() {
    form.date.$setViewValue('12/08/1980');
    $scope.$digest();
    expect(form.date.$valid).toBe(true);
  });

  it('should not pass with an invalid date', function() {
    form.date.$setViewValue('99/99/1980');
    $scope.$digest();
    expect(form.date.$valid).toBe(false);
  });
});
