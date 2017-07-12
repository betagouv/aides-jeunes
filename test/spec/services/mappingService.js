'use strict';

describe('MappingService', function() {
    var service;

    beforeEach(function() {
        module('ddsApp', function($provide) {
            $provide.value('droitsDescription', {});
        });
        inject(function(MappingService) {
            service = MappingService;
        });
    });

    it('is injectable', function() {});
});
