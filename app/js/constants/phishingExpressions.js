(function() {
    'use strict';

    var phishingExpressions = [
        /\.beget\.tech/,
        /acusticanapoli\.com/,
        /archer\.fr/,
        /assurance-ameli-recouvrement\.com/,
        /assurance\.remboursement-amelifr/,
        /assure-ameli-portail-remboursement\.info/,
        /assurance-ameli-recouvrement\.net/,
        /assurance\.remboursement-amelifr\.kostidis\.gr/,
        /intercoined\.com/,
        /liveone\.com\.br/,
        /mannishtalk\.com/,
        /remboursement\.ameliassurance\.contempora\.ro/,
        /remboursement\.ameliassurance-fr36932693693269\.irds\.ro/,
        /remboursement\.caisse-assurance\.irds\.ro/,
        /remboursement\.ameliassurance\.marikala\.gr/,
        /www\.crplindia\.com/,
        /www\.imakecollege\.com/
    ];

    /* Export either through Angular loader or CommonJS */
    if (typeof global != 'undefined') {  // we're in Node
        module.exports = phishingExpressions;
    } else {  // we're in the browser
        angular.module('ddsCommon').constant('phishingExpressions', phishingExpressions);
    }
/* End of export */
})();
