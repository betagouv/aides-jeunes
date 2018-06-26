'use strict';

angular.module('ddsCommon').factory('TrampolineService', function($localStorage) {
    return {
        set: function(value) {
            $localStorage.trampoline = value;
        },
        get: function() {
            var value = $localStorage.trampoline;
            delete $localStorage.trampoline;

            return value;
        }
    };
});
