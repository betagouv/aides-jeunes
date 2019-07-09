'use strict';

angular.module('ddsCommon')
    .filter('nationaliteFilter', function() {
        return function(items, text) {
            var out = [];

            if (Array.isArray(items)) {
                items.forEach(function(item) {
                    // @see https://stackoverflow.com/questions/990904/remove-accents-diacritics-in-a-string-in-javascript
                    var normalized = item.name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
                    if (normalized.toLowerCase().indexOf(text.toLowerCase()) !== -1) {
                        out.push(item);
                    }
                });

                return out;
            }

            return items;
        }
    });
