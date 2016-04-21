'use strict';

angular.module('ddsApp').directive('droitEligiblesList', function() {
    return {
        restrict: 'E',
        templateUrl: 'partials/droits-eligibles-list.html',
        scope: {
            list: '='
        },
        link: function(scope) {
    		scope.isNumber = _.isNumber;
    		scope.isString = _.isString;
        	scope.round = function(droit) {
		        if (! droit.unit && droit.roundToNearest10 !== false) {
		            return Math.round(droit.montant / 10) * 10;
		        } else {
		            return Math.round(droit.montant);
		        }
	    	};
        }
    };
});
