// this file is for use in CircleCI continuous integration environment
module.exports = {
    seleniumServerURL: {
        hostname    : 'ondemand.saucelabs.com',
        port        : 80,
    },
    driverCapabilities: {
        platform            : 'Windows 7',
        'tunnel-identifier' : 'circle-' + process.env.CIRCLE_BUILD_NUM + '-' + process.env.CIRCLE_NODE_INDEX,
    },
    tags        : [ 'circle-ci', '#' + process.env.CIRCLE_BUILD_NUM ],
    views       : [ 'Flow', 'SauceLabs' ],
    quit        : 'always', // avoid wasting 90 seconds on SauceLabs
    bail        : true,
    build       : 'CircleCI#' + process.env.CIRCLE_BUILD_NUM,
}
