// This library allows us to combine paths easily
const path = require('path');
module.exports = {
    entry: path.resolve(__dirname, 'source', './main.js'),
    output: {
	path: path.resolve(__dirname, 'output'),
	filename: 'bundle.js'
    },
    watch: true,
    resolve: {
        extensions: ['.js', '.css', '.scss']
    },
    module: {
	rules: [
            {
                test: /\.js/,
                use: {
	             loader: 'babel-loader',
	             options: { presets: ['react', 'es2015', 'stage-0'] }
                }
	    },
            {
                test: /\.css$/,
                use: 'css-loader'
            },
            {
                test: /\.scss$/,
                use: 'sass-loader'
	    }
        ]
    }
};