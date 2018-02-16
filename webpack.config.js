const path = require('path');

module.exports = {
    entry: './client/index.jsx',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'build/static')
    },
    devtool: 'eval-cheap-module-source-map',
    module: {
        rules: [
            {
                test: /\.jsx$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['env', 'react']
                    }
                }
            }
        ]
    }
};

