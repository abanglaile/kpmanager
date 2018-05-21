var path = require('path')

module.exports = {
    output: {
        filename: "./build/bundle.js"
    },
    entry: {
        filename: "./src/app.js",
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel',
                query: {
                    presets: ['es2015', 'stage-2', 'react']
                }
            },
            {
                test: /\.scss$/,
                exclude: /node_modules/,
                loaders: ["style", "css", "sass"]
            },
            {
                test: /\.css$/, 
                loaders: ["style", "css"] 
            },
            {test: /\.less$/, loader: 'style!css!less'}
        ]
    },
    webserver: {
        hot: true
    },

};
