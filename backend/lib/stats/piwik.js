var rp = require('request-promise');

function formatPiwik(data) {
    var metrics = [{
        source: 'nb_visits',
        name: 'visit',
    }];
    var dates = Object.keys(data);
    return metrics.map(function(metric) {
        var datapoints = dates.map(function(date) {
            return {
                date: date,
                value: data[date][metric.source],
            };
        });
        return {
            metric: metric.name,
            datapoints: datapoints,
        };
    });
}

exports.getUsageData = function(fromDate, toDate) {
    return rp({
        uri: 'https://stats.data.gouv.fr/index.php',
        qs: {
            module: 'API',
            method: 'API.get',
            format: 'JSON',
            idSite: '9',
            period: 'day',
            date: fromDate.toISOString().slice(0,10) + ',' + toDate.toISOString().slice(0,10),
        },
        json: true,
    })
        .then(formatPiwik)
        .catch(() => [])
};
