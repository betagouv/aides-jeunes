var webpack = require('webpack');


module.exports = {
    entry: {
        'forms': './front/forms/index.js',
        'birthdate': './front/questions/birthdate.js',
        'housing': './front/questions/housing.js',
        'postal-code': './front/questions/postal-code.js',
        'lib': './front/lib/index.js',
    },
    output: {
        path: './dist/js',
        filename: '[name].js',
    },
    module: {
        loaders: [
            {
                test: /forms\/index\.js$/,
                loader: 'expose',
                query: 'forms',
            },
            {
                test: /front\/questions\//,
                loader: 'expose',
                query: 'currentQuestion',
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel',
                query: {
                    presets: [ 'es2015' ],
                    plugins: [ 'transform-object-assign' ],
                },
            },
            {
                test: /\.json$/,
                loader: 'json',
            },
        ],
    },
}
