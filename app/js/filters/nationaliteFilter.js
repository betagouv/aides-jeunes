'use strict';

angular.module('ddsCommon')
    .filter('nationaliteFilter', function(NationaliteService) {
        return function(items, text) {
            var normalizedText = NationaliteService.normalizeString(text);
            var out = [];

            if (Array.isArray(items)) {
                items.forEach(function(item) {
                    var normalized = NationaliteService.normalizeString(item.name);
                    if (normalized.toLowerCase().indexOf(normalizedText) !== -1) {
                        out.push(item);
                    }
                });

                return out;
            }

            return items;
        };
    });
