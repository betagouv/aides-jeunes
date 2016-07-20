module.exports = {
    baseURL: 'http://localhost:9000',
    browser: 'chrome',
    driverCapabilities: {
        'chromeOptions': {
            'binary': '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
            'args': [ 'start-maximized' ]
        }
    },
    quit: 'on success',
    bail: 'true',
}
