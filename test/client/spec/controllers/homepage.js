'use strict';

describe('Controller: HomepageCtrl', function() {

    var scope = {}, $window;

    beforeEach(function() {
        module('ddsApp');
        inject(function($controller, _$window_) {
            $controller('HomepageCtrl', {$scope: scope});
            $window = _$window_;
        });
    });

    it('should init acceptConditions to falsy', function() {
        expect(scope.acceptConditions).toBeFalsy();
    });

    it('checkConfirmation() should return false and display an alert if conditions are not accepted', function() {
        // given
        spyOn($window, 'alert');

        // when
        var result = scope.checkConfirmation();

        // then
        expect(result).toBe(false);
        expect($window.alert).toHaveBeenCalled();
    });
});
