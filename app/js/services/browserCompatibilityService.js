'use strict';

angular.module('ddsCommon').service('BrowserCompatibilityService', function(UAParser) {
    var minimumMajorVersionChecker = {
        'Safari': 5,
    };

    return {
        getResult: function() {
            var uaParser = new UAParser();
            var uaDetails = uaParser.getResult();

            var minimumMajor = minimumMajorVersionChecker[uaDetails.browser.name];
            if ((! minimumMajor) || minimumMajor < uaDetails.browser.major) {
                return null;
            } else {
                return uaDetails.browser;
            }
        }
    };
});
