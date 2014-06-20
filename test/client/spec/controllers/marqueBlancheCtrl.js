'use strict';

describe('Controller: marqueBlancheCtrl', function () {

  beforeEach(module('ddsApp'));

  it('Should attach the secours populaire logo to the scope when path name corresponds', function () {
    var scope;
    inject(function($rootScope, $controller) {
      scope = $rootScope.$new();
      var _window_ = { location: { pathname: '/secours-populaire/' }};
      $controller('marqueBlancheCtrl', {
        $scope: scope,
        $window: _window_
      });
    });
    expect(scope.logo).toBeDefined();
  });

  it('Should attach no logo when path name is /', function () {
    var scope;
    inject(function($rootScope, $controller) {
      scope = $rootScope.$new();
      var _window_ = { location: { pathname: '/' }};
      $controller('marqueBlancheCtrl', {
        $scope: scope,
        $window: _window_
      });
    });
    expect(scope.logo).toBeUndefined();
  });
});
