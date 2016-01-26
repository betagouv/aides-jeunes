var webpack = require('webpack');


module.exports = {
    entry: {
        'birthdate': './front/birthdate.js',
        'housing': './front/housing.js',
        'lib': './front/lib/date-today.js',  // lib will be an index.js when there are other library scripts than date-today
    },
    output: {
        path: './dist/js',
        filename: '[name].js',
    },
    module: {
        loaders: [
            {
                test: /birthdate\.js$/,
                loader: 'expose',
                query: 'birthdate',
            },
            {
                test: /housing\.js$/,
                loader: 'expose',
                query: 'housing',
            },
            {
                test: /store\.js$/,
                loader: 'expose',
                query: 'store',
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel',
                query: { presets: ['es2015'] },
            },
            {
                test: /\.json$/,
                loader: 'json',
            },
        ],
    },
}
