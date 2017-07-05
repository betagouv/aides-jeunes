'use strict';

angular.module('ddsApp').controller('StatsCtrl', function($scope, $http, $q) {
    $scope.statPeriods = [/*{
        label: 'Aujourd‘hui',
        period: 'day',
    }, */{
        label: 'Hier',
        period: 'day',
        date: function() { return moment().subtract('days', 1).format('YYYY-MM-DD'); },
    },/* {
        label: 'Cette semaine',
        period: 'week',
    }, {
        label: 'La semaine dernière',
        period: 'day',
        date: function() { return moment().subtract('days', 7).format('YYYY-MM-DD'); },
    }, {
        label: 'Ce mois-ci',
        period: 'month'
    }, */{
        label: 'Le mois dernier',
        period: 'month',
        date: function() { return moment().subtract('days', 7).format('YYYY-MM-DD'); },
    }, {
        label: 'Depuis le début de l‘année',
        period: 'year'
    }];

    $scope.retrievalDoneCount = 0;

    $scope.statPeriods.forEach(function(period) {
        var date = period.date && period.date() || 'today';
        var uri = 'http://stats.data.gouv.fr/index.php?module=API&method=API.get&format=json&idSite=9&period=month&date=' + date;
        //$http.get(uri)
        $q(function(resolve, reject) {
            var data = {
    nb_uniq_visitors: 32336,
    nb_visits: 36118,
    nb_users: 0,
    nb_actions: 420933,
    max_actions: 962,
    bounce_count: 1254,
    sum_visit_length: 8794143,
    nb_visits_returning: 8539,
    nb_actions_returning: 86220,
    nb_uniq_visitors_returning: 6799,
    nb_users_returning: 0,
    max_actions_returning: 558,
    bounce_rate_returning: "7%",
    nb_actions_per_visit_returning: 10.1,
    avg_time_on_site_returning: 217,
    nb_conversions: 12888,
    nb_visits_converted: 11105,
    revenue: 0,
    conversion_rate: "30.75%",
    nb_conversions_new_visit: 9874,
    nb_visits_converted_new_visit: 8440,
    revenue_new_visit: 0,
    conversion_rate_new_visit: "30.6%",
    nb_conversions_returning_visit: 3014,
    nb_visits_converted_returning_visit: 2665,
    revenue_returning_visit: 0,
    conversion_rate_returning_visit: "31.21%",
    nb_pageviews: 420299,
    nb_uniq_pageviews: 149216,
    nb_downloads: 1,
    nb_uniq_downloads: 1,
    nb_outlinks: 94,
    nb_uniq_outlinks: 90,
    nb_searches: 1,
    nb_keywords: 1,
    nb_hits_with_time_generation: 410615,
    avg_time_generation: 0.126,
    bounce_rate: "3%",
    nb_actions_per_visit: 11.7,
    avg_time_on_site: 243
};
            resolve({ data: data});
        })
        .then(function(response) {
            period.data = response.data;
            $scope.retrievalDoneCount = $scope.retrievalDoneCount + 1;

            $scope.allStatsRetrieved = $scope.retrievalDoneCount === $scope.statPeriods.length;
        }, function(error) {
            $scope.error = error;
        });
    });
});
