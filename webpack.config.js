const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
	entry: './scripts.js',
	output: {
		filename: './app.js'
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: ['jshint-loader', 'babel-loader?presets[]=env']
			},
			{
				test: /\.scss$/,
				use: ExtractTextPlugin.extract({
					fallback: 'style-loader',
					use: ['css-loader', 'postcss-loader', 'sass-loader']
				})
			}		
		]
	},
	devServer: {
		open: true
	},
	plugins: [
		new HtmlWebpackPlugin({
			minify: {
				collapseWhitespace: true
			},
			template: 'index.ejs'
		}),
		new ExtractTextPlugin('app.css')
	]
}