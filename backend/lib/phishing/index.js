/* eslint-disable no-console */
var crypto = require('crypto');
var os = require('os');
var path = require('path');
var rp = require('request-promise');
var Promise = require('bluebird');

console.log(os.tmpdir());

var fs = Promise.promisifyAll(require('fs'));

var phishingExpressions = require('./../../../app/js/constants/phishingExpressions');

var OKSites = fs.readFileSync('backend/lib/phishing/ok-sites.txt', { encoding: 'utf-8' }).split('\n').filter(s => s !== '');
function getFile(referrer) {
    var shasum = crypto.createHash('sha1');
    shasum.update(referrer.label);
    var hash = shasum.digest('hex');
    var fullpath = path.join(os.tmpdir(), 'phishing-' + hash);
    if (fs.existsSync(fullpath))
        return fs.readFileAsync(fullpath, 'utf-8');

    return rp({
        uri: referrer.subtable[0].label
    })
        .then(data => {
            return fs.writeFileAsync(fullpath, data, 'utf-8')
                .then(() => data);
        });
}

function estimateFraudulentLevel(referrer) {
    if (! referrer.label)
        return Promise.fulfilled(-400);

    if (phishingExpressions.some(expr => referrer.label.match(expr)))
        return Promise.fulfilled(1);

    if (OKSites.some(site => site === referrer.label) ||
        referrer.label.match(/gouv\.fr$/) ||
        referrer.label.match(/\.ampproject\.org$/) ||
        referrer.label.match(/facebook\.com$/) ||
        referrer.label.match(/ooreka\.fr$/) ||
        referrer.label.match(/webmail.*\.orange\.fr$/) ||
        referrer.label.match(/webmail\.laposte\.net$/) ||
        referrer.label.match(/webmail\.numericable\.fr$/)
    )
        return Promise.fulfilled(0);


    if (referrer.label.match(/sq/))
        return Promise.fulfilled(-2);

    return getFile(referrer)
        .then(content => {
            if (content.match(/remboursement/)) {
                return -3;
            } else if (content.match(/ameli/)) {
                return -2;
            } else {
                return -1;
            }
        })
        .catch(() => -500);
}

rp({
    uri: `https://stats.data.gouv.fr/index.php?module=API&method=Referrers.getWebsites&format=JSON&idSite=9&period=day&date=yesterday&expanded=1&token_auth=anonymous&filter_limit=500&token_auth=anonymous&filter_limit=500`,
    json: true,
})
    .then(t => t.slice(0,100))
    .map((referrer) => {
        return estimateFraudulentLevel(referrer)
            .then(status => {
                return {
                    status: status,
                    referrer: referrer,
                };
            });
    })
    .then(results => results.sort(function(a, b) { return (a.referrer.label || '').localeCompare((b.referrer.label || '')); }))
    .then(results => {
        console.log(results.filter(r => r.status < 0 ).map(r => r.referrer.label + ' - ' + r.status + ' - ' + (r.referrer.subtable ? r.referrer.subtable[0].label : '')).join('\n'));
    });
