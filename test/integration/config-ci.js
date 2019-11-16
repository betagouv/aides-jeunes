// this file is for use in CircleCI continuous integration environment
module.exports = {
    bail        : true,
    baseURL     : 'http://localhost:8080/init-ci',
    build       : 'CircleCI-' + process.env.CIRCLE_PROJECT_USERNAME + '-' + process.env.CIRCLE_PROJECT_REPONAME +'#' + process.env.CIRCLE_BUILD_NUM,
    driverCapabilities: {
        platform            : 'Windows 7',
        'tunnel-identifier' : 'circle-' + process.env.CIRCLE_PROJECT_USERNAME + '-' + process.env.CIRCLE_PROJECT_REPONAME + '-' + process.env.CIRCLE_BUILD_NUM + '-' + process.env.CIRCLE_NODE_INDEX
    },
    quit        : 'always', // avoid wasting 90 seconds on SauceLabs
    seleniumServerURL: {
        hostname            : 'ondemand.saucelabs.com',
        port                : 80,
    },
    tags        : [ 'circle-ci', '#' + process.env.CIRCLE_BUILD_NUM ],
    timeout     : 10000,
    views       : [ 'Verbose', 'SauceLabs' ],
}
