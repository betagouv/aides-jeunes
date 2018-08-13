'use strict';

angular.module('ddsCommon')
    .filter('orderObjectBy', function() {
        return function(items, field, reverse) {
            var filtered = [];
            angular.forEach(items, function(item) {
                filtered.push(item);
            });
            filtered.sort(function (a, b) {
                if (typeof a[field] == 'object' && typeof b[field] == 'object')
                    return (Object.keys(a[field]).length > Object.keys(b[field]).length ? 1 : -1);
                return (a[field] > b[field] ? 1 : -1);
            });
            if (reverse) filtered.reverse();
            return filtered;
        };
    });
