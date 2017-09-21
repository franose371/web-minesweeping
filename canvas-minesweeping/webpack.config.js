const path = require('path');

module.exports = {
	entry: __dirname + "/src/index.js",
	output: {
		path: __dirname + "/public",
		filename: "bundle.js"
	},
	module: {
		rules: [{
			test: /\.js$/,
			use: {
				loader: "babel-loader",
				options: {
					presets: [
						"es2015"
					]
				}
			},
			exclude: /node_modules/
		}, {
			test: /\.css$/,
			use: [{
				loader: "style-loader",
			}, {
				loader: "css-loader"
			}]
		}, {
			test: /\.(png|svg|jpg|gif)$/,
			use: [
				'file-loader'
			]
		}]
	},
	devServer: {
		contentBase: './public',
		historyApiFallback: true,
		inline: true
	}
};