(function() {
'use strict';

var phishingExpressions = [
    /acusticanapoli\.com/,
    /archer\.fr/,
    /assurance-ameli-recouvrement\.com/,
    /assurance-ameli-recouvrement\.net/,
    /assurance\.remboursement-amelifr\.kostidis\.gr/,
    /depor420\.beget\.tech/,
    /intercoined\.com/,
    /liveone\.com\.br/,
    /mannishtalk\.com/,
    /remboursement\.ameliassurance\.contempora\.ro/,
    /remboursement\.ameliassurance-fr36932693693269\.irds\.ro/,
    /remboursement\.caisse-assurance\.irds\.ro/,
    /remboursement\.ameliassurance\.marikala\.gr/,
    /yzfg\.r\.bh\.d\.sendibt3\.com/
];

/* Export either through Angular loader or CommonJS */
if (typeof module != 'undefined') {  // we're in Node
    module.exports = phishingExpressions;
} else {  // we're in the browser
    angular.module('ddsCommon').constant('phishingExpressions', phishingExpressions);
}
/* End of export */
})();
