'use strict';

angular.module('ddsCommon').service('BroadcastService', function($http, $localStorage, $log) {
    function getLastBroadcastRead() {
        if (! $localStorage.lastBroadcastRead)
            updateLastBroadcastRead();

        return $localStorage.lastBroadcastRead;
    }

    function updateLastBroadcastRead() {
        $localStorage.lastBroadcastRead = new Date().toISOString();
    }

    function getBroadcasts() {
        return $http.get('https://api.github.com/repos/sgmap/mes-aides-ui/releases')
                    .then(function(res) {
                        return res.data;
                    }, function(error) {
                        $log.warn('Could not fetch broadcasts', error);
                        return [];
                    });
    }

    return {
        getNewBroadcasts: function getNewBroadcasts() {
            return getBroadcasts().then(function(broadcasts) {
                var lastRead = getLastBroadcastRead();

                return broadcasts.filter(function(broadcast) {
                    /*jshint camelcase: false */
                    return broadcast.published_at > lastRead;
                });
            });
        },
        markBroadcastsAsRead: updateLastBroadcastRead,
    };
});
