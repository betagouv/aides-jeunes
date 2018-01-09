(function() {
'use strict';

var phishingExpressions = [
    /acusticanapoli\.com/,
];

/* Export either through Angular loader or CommonJS */
if (typeof module != 'undefined') {  // we're in Node
    module.exports = phishingExpressions;
} else {  // we're in the browser
    angular.module('ddsCommon').constant('phishingExpressions', phishingExpressions);
}
/* End of export */
})();
