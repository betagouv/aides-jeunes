'use strict';

describe('Service: monthService', function () {

    var service;

    beforeEach(function() {
        module('ddsApp');
        inject(function(MonthService) {
            service = MonthService;
        });
    });

    describe('function getMonths()', function() {
        it('Should create an array of the last 3 months before the provided date', function() {
            // given
            var dateDeValeur = '2013-01-15';
            var expectedDate = moment('2013-01-15').subtract(3, 'months').format('YYYY-MM');

            // when
            var result = service.getMonths(dateDeValeur);

            // then
            expect(result.length).toBe(3);
            expect(result[0].id).toBe(expectedDate);
        });

        it('Should create an array of the last 3 months before the current date if no ref date given', function() {
            // given
            var expectedDate = moment().subtract(3, 'months').format('YYYY-MM');

            // when
            var result = service.getMonths();

            // then
            expect(result.length).toBe(3);
            expect(result[0].id).toBe(expectedDate);
        });
    });
});
