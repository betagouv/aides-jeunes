'use strict';

function buildHref(to, subject, body) {
    var params = [];
    if (subject) {
        params.push('subject=' + encodeURIComponent(subject));
    }
    if (body) {
        params.push('body=' + encodeURIComponent(body));
    }
    var comps = ['mailto:' + to, params.join('&')];

    return comps.join('?');
}

angular.module('ddsApp').directive('mailTo', function() {
    return function(scope, element, attrs) {
        var observers = ['mailTo', 'subject', 'body'].map(function(attr) {
            attrs.$observe(attr, function() {
                attrs.$set('href', buildHref(attrs.mailTo, attrs.subject, attrs.body));
            });
        });

        observers.forEach(function(observer) {
            element.on('destroy', observer);
        });
    };
});
