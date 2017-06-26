'use strict';

angular.module('ddsApp').service('MappingPeriodService', function() {
    function getPeriods(dateDeValeur) {
        dateDeValeur = moment(dateDeValeur);
        return {
            thisMonth: dateDeValeur.format('YYYY-MM'),
            '1MonthsAgo': dateDeValeur.clone().subtract(1, 'months').format('YYYY-MM'),
            '2MonthsAgo': dateDeValeur.clone().subtract(2, 'months').format('YYYY-MM'),
            '3MonthsAgo': dateDeValeur.clone().subtract(3, 'months').format('YYYY-MM'),
            // 12-element array of the latest 12 months
            last12Months: _.map(_.range(1, 12 + 1), function(monthIndex) {
                return dateDeValeur.clone().subtract(monthIndex, 'months').format('YYYY-MM');
            }),
            lastYear: dateDeValeur.clone().subtract(1, 'years').format('YYYY'),
            anneeFiscaleReference: dateDeValeur.clone().subtract(2, 'years').format('YYYY'),
            // 12-element array of the 12 months in the année fiscale de référence
            anneeFiscaleReference12Months: _.map(_.range(12), function(monthIndex) {
                var anneeFiscaleReference = moment(dateDeValeur.clone().subtract(2, 'years').year(), 'YYYY');
                return anneeFiscaleReference.clone().add(monthIndex, 'months').format('YYYY-MM');
            })
        };
    }

    return {
        getPeriods: getPeriods,
        toOpenFiscaFormat: function(date) {
            return moment(date).format('YYYY-MM');
        },
    };
});
