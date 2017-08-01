description    : '[ng-bind-html="test.htmlDescription"]',
testedAideName : 'table td:nth-child(1)',
expectedValue  : 'table td:nth-child(2)',
computedValue  : 'table td:nth-child(3)',
resultsFrame   : '.embed-responsive iframe',

checkRecapSituationContains: function(textToLookFor) {
    return this.resultsFrame.then(function(frame) {
        return driver.frame(frame);
    }).then(function() {
        return driver.elementByTagName('pre');
    }).then(function(recapSituation) {
        return driver.textPresent(textToLookFor, recapSituation);
    }).then(function(isPresent) {
        if (! isPresent)
            throw '"' + textToLookFor + '" could not be found in the situation recap';
    });
},
