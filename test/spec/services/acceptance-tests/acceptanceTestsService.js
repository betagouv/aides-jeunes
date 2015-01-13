'use strict';

describe('Service: acceptanceTestsService', function () {

    var service;

    beforeEach(function() {
        module('ddsApp');
        inject(function(AcceptanceTestsService) {
            service = AcceptanceTestsService;
        });
    });

    describe('function orderTestsByKeywords()', function() {
        it('should return empty array when given empty array', function() {
            // given
            var tests = [];

            // when
            var result = service.orderTestsByKeywords(tests);

            // then
            expect(result).toEqual([]);
        });

        it('should return the test when given a single test', function() {
            // given
            var test = { keywords: [] };
            var tests = [test];

            // when
            var result = service.orderTestsByKeywords(tests);

            // then
            expect(result).toEqual([test]);
        });

        it('should return the test list as is if tests have no keywords', function() {
            // given
            var test1 = { keywords: [] }, test2 = { keywords: [] }, test3 = { keywords: [] };
            var tests = [test1, test2, test3];

            // when
            var result = service.orderTestsByKeywords(tests);

            // then
            expect(result).toEqual([test1, test2, test3]);
        });

        it('should sort the tests by their keywords', function() {
            // given
            var test1 = { keywords: ['aaa'] }, test2 = { keywords: ['ccc'] }, test3 = { keywords: ['bbb'] };
            var tests = [test1, test2, test3];

            // when
            var result = service.orderTestsByKeywords(tests);

            // then
            expect(result).toEqual([test1, test3, test2]);
        });

        it('should sort the tests by their sub-keywords', function() {
            // given
            var test1 = { keywords: ['aaa'] }, test2 = { keywords: ['ccc', 'bbb'] }, test3 = { keywords: ['ccc', 'aaa'] };
            var tests = [test1, test2, test3];

            // when
            var result = service.orderTestsByKeywords(tests);

            // then
            expect(result).toEqual([test1, test3, test2]);
        });

        it('should fallback sorting by the names of the tests', function() {
            // given
            var test1 = { keywords: ['aaa'] },
                test2 = { keywords: ['ccc', 'bbb'], name: 'bbb' },
                test3 = { keywords: ['ccc', 'bbb'], name: 'aaa' };
            var tests = [test1, test2, test3];

            // when
            var result = service.orderTestsByKeywords(tests);

            // then
            expect(result).toEqual([test1, test3, test2]);
        });
    });
});
